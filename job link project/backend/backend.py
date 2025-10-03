from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
import os
import uuid
from dotenv import load_dotenv
from werkzeug.utils import secure_filename


load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Supabase credentials not found in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)
CORS(app, supports_credentials=True)


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

       
        resume = request.files.get("resume")
        certificates = request.files.getlist("certificates")

      
        print("Candidate:", name, email, skills)

       
        response = supabase.table("candidates").insert({
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

        return jsonify({"message": "Candidate registered successfully", "data": response.data}), 201

    except Exception as e:
        import traceback
        print("❌ Error in /register/candidate:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@app.route("/register/employer", methods=["POST"])
def register_employer():
    try:
        data = request.get_json()
        company_name = data.get("companyName")
        email = data.get("email")
        industry = data.get("industry")
        job_openings = data.get("jobOpenings")

        response = supabase.table("employers").insert({
            "company_name": company_name,
            "email": email,
            "industry": industry,
            "job_openings": job_openings,
        }).execute()

        return jsonify({"message": "Employer registered successfully", "data": response.data})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

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

      
        candidate_resp = supabase.table("candidates").select("*").eq("email", email).execute()
        if candidate_resp.data and len(candidate_resp.data) > 0:
          
            return jsonify({"success": True, "role": "candidate"}), 200

       
        employer_resp = supabase.table("employers").select("*").eq("email", email).execute()
        if employer_resp.data and len(employer_resp.data) > 0:
            
            return jsonify({"success": True, "role": "employer"}), 200

        
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

    except Exception as e:
        import traceback
        print("❌ Login error:", traceback.format_exc())
        return jsonify({"success": False, "message": str(e)}), 500
    

if __name__ == "__main__":
    app.run(debug=True)
