from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
from dotenv import load_dotenv

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Supabase credentials not found in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
app = Flask(__name__)
CORS(app, supports_credentials=True)

# ------------------ Candidate Registration ------------------
@app.route("/register/candidate", methods=["POST"])
def register_candidate():
    try:
        
        name = request.form.get("name")
        email = request.form.get("email")
        skills = request.form.get("skills")
        experience = request.form.get("experience")
        applied_jobs = request.form.get("applied_jobs")
        education = request.form.get("education")
        portfolio = request.form.get("portfolio")
        password = request.form.get("password")

        resume = request.files.get("resume")
        certificates = request.files.getlist("certificates")

        if not password:
            return jsonify({"error": "Password is required"}), 400

        password_hash = generate_password_hash(password)

        user_resp = supabase.table("users").insert({
            "first_name": name.split()[0] if name else "",
            "last_name": " ".join(name.split()[1:]) if name and len(name.split()) > 1 else "",
            "email": email,
            "role": "candidate",
            "password_hash": password_hash
        }).execute()

        if not user_resp.data:
            return jsonify({"error": "Failed to create user"}), 500

        user_id = user_resp.data[0]["id"]

        candidate_resp = supabase.table("candidates").insert({
            "user_id": user_id,
            "name": name,
            "email": email,
            "skills": skills,
            "experience": experience,
            "applied_jobs": applied_jobs,
            "education": education,
            "portfolio": portfolio,
            "resume_url": "",
            "certificates": [],
        }).execute()

        return jsonify({"message": "Candidate registered successfully", "data": candidate_resp.data}), 201

    except Exception as e:
        import traceback
        print("❌ Error in /register/candidate:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500

# ------------------ Employer Registration ------------------
@app.route("/register/employer", methods=["POST"])
def register_employer():
    try:
        data = request.get_json()
        company_name = data.get("companyName")
        email = data.get("email")
        industry = data.get("industry")
        job_openings = data.get("jobOpenings")
        password = data.get("password")

        if not password:
            return jsonify({"error": "Password is required"}), 400

        password_hash = generate_password_hash(password)

        user_resp = supabase.table("users").insert({
            "first_name": company_name,
            "email": email,
            "role": "employer",
            "password_hash": password_hash
        }).execute()

        if not user_resp.data:
            return jsonify({"error": "Failed to create user"}), 500

        user_id = user_resp.data[0]["id"]

        employer_resp = supabase.table("employers").insert({
            "user_id": user_id,
            "company_name": company_name,
            "industry": industry,
            "job_openings": job_openings,
        }).execute()

        return jsonify({"message": "Employer registered successfully", "data": employer_resp.data})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------------------ Login ------------------
@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        ADMIN_EMAIL = "admin@jobmart.com"
        ADMIN_PASSWORD = "admin123"
        if email == ADMIN_EMAIL and password == ADMIN_PASSWORD:
            return jsonify({"success": True, "role": "admin"}), 200

        user_resp = supabase.table("users").select("*").eq("email", email).execute()
        if not user_resp.data or len(user_resp.data) == 0:
            return jsonify({"success": False, "message": "Invalid credentials"}), 401

        user = user_resp.data[0]
        if check_password_hash(user.get("password_hash"), password):
            return jsonify({"success": True, "role": user["role"]}), 200
        else:
            return jsonify({"success": False, "message": "Invalid credentials"}), 401

    except Exception as e:
        import traceback
        print("❌ Login error:", traceback.format_exc())
        return jsonify({"success": False, "message": str(e)}), 500

# ------------------ Applications ------------------
@app.route("/applications", methods=["GET"])
def get_applications():
    try:
        # Fetch all applications that are not rejected
        data = supabase.table("applications").select("*").neq("status", "Rejected").execute()
        return jsonify(data.data)
    except Exception as e:
        import traceback
        print("❌ Error in GET /applications:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500

# ------------------ Rejected Applications ------------------
@app.route("/rejected_applications", methods=["GET"])
def get_rejected_applications():
    try:
        data = supabase.table("rejected_applications").select("*").execute()
        return jsonify(data.data)
    except Exception as e:
        import traceback
        print("❌ Error in GET /rejected_applications:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@app.route("/applications", methods=["POST"])
def create_application():
    try:
        payload = request.json
        email = payload.get("email")
        job_id = payload.get("job_id")
        cover_letter = payload.get("cover_letter")

        if not email or not job_id or not cover_letter:
            return jsonify({"error": "email, job_id, and cover_letter are required"}), 400

        candidate_resp = supabase.table("users").select("*").eq("email", email).eq("role", "candidate").execute()
        if not candidate_resp.data or len(candidate_resp.data) == 0:
            return jsonify({"error": "Candidate does not exist"}), 400

        candidate_id = candidate_resp.data[0]["id"]

        app_payload = {
            "candidate_id": candidate_id,
            "job_id": job_id,
            "status": payload.get("status", "Applied"),  # Must match check constraint
            "cover_letter": cover_letter
        }

        application_resp = supabase.table("applications").insert(app_payload).execute()
        return jsonify(application_resp.data), 201

    except Exception as e:
        import traceback
        print("❌ Error in /applications POST:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500

# ------------------ Approve Application ------------------
@app.route("/applications/<app_id>/approve", methods=["POST"])
def approve_application(app_id):
    try:
        resp = supabase.table("applications").update({"status": "Approved"}).eq("id", app_id).execute()
        if not resp.data:
            return jsonify({"error": "Application not found"}), 404
        return jsonify({"message": "Application approved"}), 200
    except Exception as e:
        import traceback
        print("❌ Error approving application:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500

# ------------------ Reject Application ------------------
@app.route("/applications/<app_id>/reject", methods=["POST"])
def reject_application(app_id):
    try:
        # Fetch the application from the applications table
        app_resp = supabase.table("applications").select("*").eq("id", app_id).single().execute()
        if not app_resp.data:
            return jsonify({"error": "Application not found"}), 404

        app_data = app_resp.data

        # Move to rejected_applications table with proper timestamps
        supabase.table("rejected_applications").insert({
            "id": app_data["id"],
            "candidate_id": app_data["candidate_id"],
            "job_id": app_data["job_id"],
            "cover_letter": app_data.get("cover_letter"),
            "status": "Rejected",  # Must match check constraint
            "created_at": app_data.get("created_at"),
            "updated_at": app_data.get("updated_at")
        }).execute()

        # Delete from applications table
        supabase.table("applications").delete().eq("id", app_id).execute()

        return jsonify({"message": "Application rejected and moved"}), 200

    except Exception as e:
        import traceback
        print("❌ Error rejecting application:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500

# ------------------ Jobs ------------------
@app.route("/jobs", methods=["GET"])
def get_jobs():
    data = supabase.table("jobs").select("*").execute()
    return jsonify(data.data)

@app.route("/jobs", methods=["POST"])
def create_job():
    payload = request.json
    data = supabase.table("jobs").insert(payload).execute()
    return jsonify(data.data)

# ------------------ Get Applications (All or By Email) ------------------
@app.route("/application", methods=["GET"])
def get_application():
    try:
        email = request.args.get("email")  # ?email=someone@mail.com

        query = supabase.table("applications").select("*")

        if email:
            # find candidate by email
            candidate = supabase.table("users").select("id").eq("email", email).eq("role", "candidate").execute()
            if not candidate.data:
                return jsonify([]), 200  # no candidate found

            candidate_id = candidate.data[0]["id"]
            query = query.eq("candidate_id", candidate_id)

        data = query.execute()
        return jsonify(data.data), 200
    except Exception as e:
        import traceback
        print("❌ Error in GET /applications:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500
    
@app.route("/candidates", methods=["GET"])
def get_candidates():
    try:
        data = supabase.table("candidates").select("*").execute()
        return jsonify(data.data), 200
    except Exception as e:
        import traceback
        print("❌ Error in /candidates GET:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500
    
# ------------------ Get Candidate by Email ------------------
# ------------------ Get Candidate by Email ------------------
@app.route("/candidates/<email>", methods=["GET"])
def get_candidate_by_email(email):
    try:
        resp = supabase.table("candidates").select("*").eq("email", email).single().execute()
        if not resp.data:
            return jsonify({"error": "Candidate not found"}), 404
        return jsonify(resp.data), 200
    except Exception as e:
        import traceback
        print("❌ Error in GET /candidates/<email>:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500

# ------------------ Update Candidate by Email ------------------
@app.route("/candidates/<email>", methods=["PUT"])
def update_candidate(email):
    try:
        payload = request.json
        # Update candidate table
        update_resp = supabase.table("candidates").update({
            "name": payload.get("name"),
            "email": payload.get("email"),
            "skills": payload.get("skills"),
            "experience": payload.get("experience"),
            "education": payload.get("education"),
            "portfolio": payload.get("portfolio")
        }).eq("email", email).execute()

        if not update_resp.data or len(update_resp.data) == 0:
            return jsonify({"error": "Candidate not found"}), 404

        return jsonify(update_resp.data[0]), 200

    except Exception as e:
        import traceback
        print("❌ Error in PUT /candidates/<email>:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
