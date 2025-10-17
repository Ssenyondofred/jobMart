import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000"; // Flask backend URL

const theme = {
  forestGreen: "#228B22",
  darkGreen: "#006400",
  goldAccent: "#FFD700",
  softMint: "#eafaf1",
  mintSurface: "#d4f5e9",
  inputAccent: "#f0fff4",
  textDark: "#1E1E1E",
  mutedGray: "#7A7A7A",
  white: "#FFFFFF",
};

const Register = () => {
  const [userType, setUserType] = useState<"candidate" | "employer">("candidate");

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: `linear-gradient(to bottom right, ${theme.forestGreen}22, ${theme.darkGreen}22)`,
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: theme.softMint,
          borderRadius: "2rem",
          padding: "2rem",
          maxWidth: "700px",
          width: "100%",
          boxShadow: "0 0 25px rgba(0,0,0,0.15)",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        {/* User type selector */}
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "2rem" }}>
          {["candidate", "employer"].map((type) => (
            <label
              key={type}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.5rem 1.5rem",
                borderRadius: "1rem",
                border: `2px solid ${
                  userType === type ? (type === "candidate" ? theme.forestGreen : theme.darkGreen) : "#d1d5db"
                }`,
                backgroundColor: userType === type ? (type === "candidate" ? theme.forestGreen : theme.darkGreen) : theme.white,
                color: userType === type ? theme.white : theme.textDark,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onClick={() => setUserType(type as "candidate" | "employer")}
            >
              {type === "candidate" ? "Job Seeker" : "Employer"}
              <input
                type="radio"
                name="userType"
                value={type}
                checked={userType === type}
                onChange={() => setUserType(type as "candidate" | "employer")}
                style={{ display: "none" }}
              />
            </label>
          ))}
        </div>

        {userType === "candidate" ? <CandidateRegister /> : <EmployerRegister />}
      </div>
    </div>
  );
};

// ==========================
// Candidate Registration
// ==========================
const CandidateRegister = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [appliedJobs, setAppliedJobs] = useState("");
  const [education, setEducation] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [certificates, setCertificates] = useState<File[]>([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("skills", skills);
      formData.append("experience", experience);
      formData.append("applied_jobs", appliedJobs);
      formData.append("education", education);
      formData.append("portfolio", portfolio);
      formData.append("password", password);
      if (resume) formData.append("resume", resume);
      certificates.forEach((file) => formData.append("certificates", file));

      const res = await fetch(`${API_URL}/register/candidate`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Candidate registered successfully!");
        navigate("/login");
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || "Registration failed"}`);
      }
    } catch (error) {
      console.error("Error registering candidate:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem", color: theme.forestGreen }}>
        Job Seeker Registration
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
        <InputField label="Full Name" value={name} onChange={setName} placeholder="Ssemuyaba" />
        <InputField label="Email" value={email} onChange={setEmail} placeholder="swift@example.com" />
        <InputField label="Skills" value={skills} onChange={setSkills} placeholder="React, Node.js, Python" gridSpan={2} />
        <InputField label="Experience (years)" value={experience} onChange={setExperience} placeholder="3" />
        <InputField label="Highest Education" value={education} onChange={setEducation} placeholder="Bachelor’s in CS" />
        <InputField label="Applied Jobs" value={appliedJobs} onChange={setAppliedJobs} placeholder="Frontend Developer, UI Designer" gridSpan={2} />
        <InputField label="Portfolio / GitHub Link" value={portfolio} onChange={setPortfolio} placeholder="https://github.com/johndoe" gridSpan={2} />
        <InputField label="Password" value={password} onChange={setPassword} placeholder="Enter password" type="password" />
        <InputField label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Confirm password" type="password" />
        <FileInput label="Upload Resume" file={resume} setFile={setResume} />
        <MultiFileInput label="Certificates" files={certificates} setFiles={setCertificates} />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "0.75rem",
          borderRadius: "1rem",
          backgroundColor: theme.forestGreen,
          color: theme.white,
          fontWeight: 600,
          fontSize: "1rem",
          border: "2px solid transparent",
          cursor: loading ? "not-allowed" : "pointer",
          marginTop: "1rem",
          transition: "all 0.3s",
        }}
        onMouseOver={(e) => {
          (e.currentTarget.style.backgroundColor = theme.darkGreen);
          e.currentTarget.style.borderColor = theme.goldAccent;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = theme.forestGreen;
          e.currentTarget.style.borderColor = "transparent";
        }}
      >
        {loading ? "Registering..." : "Register as Job Seeker"}
      </button>

      <p style={{ textAlign: "center", fontSize: "0.85rem", color: theme.mutedGray }}>
        Already have an account?{" "}
        <span style={{ color: theme.forestGreen, cursor: "pointer" }} onClick={() => navigate("/login")}>
          Login
        </span>
      </p>
    </form>
  );
};

// ==========================
// Employer Registration
// ==========================
const EmployerRegister = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [industry, setIndustry] = useState("");
  const [jobOpenings, setJobOpenings] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/register/employer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, email, industry, jobOpenings, password }),
      });

      if (res.ok) {
        alert("Employer registered successfully!");
        navigate("/login");
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || "Registration failed"}`);
      }
    } catch (error) {
      console.error("Error registering employer:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem", color: theme.darkGreen }}>
        Employer Registration
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
        <InputField label="Company Name" value={companyName} onChange={setCompanyName} placeholder="TechCorp Ltd" />
        <InputField label="Email" value={email} onChange={setEmail} placeholder="hr@techcorp.com" />
        <InputField label="Industry" value={industry} onChange={setIndustry} placeholder="Software, Finance, Healthcare" />
        <InputField label="Job Openings" value={jobOpenings} onChange={setJobOpenings} placeholder="Backend Developer, Data Analyst" />
        <InputField label="Password" value={password} onChange={setPassword} placeholder="Enter password" type="password" />
        <InputField label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Confirm password" type="password" />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "0.75rem",
          borderRadius: "1rem",
          backgroundColor: theme.darkGreen,
          color: theme.white,
          fontWeight: 600,
          fontSize: "1rem",
          border: "2px solid transparent",
          cursor: loading ? "not-allowed" : "pointer",
          marginTop: "1rem",
          transition: "all 0.3s",
        }}
        onMouseOver={(e) => {
          (e.currentTarget.style.backgroundColor = theme.forestGreen);
          e.currentTarget.style.borderColor = theme.goldAccent;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = theme.darkGreen;
          e.currentTarget.style.borderColor = "transparent";
        }}
      >
        {loading ? "Registering..." : "Register as Employer"}
      </button>

      <p style={{ textAlign: "center", fontSize: "0.85rem", color: theme.mutedGray }}>
        Already have an account?{" "}
        <span style={{ color: theme.darkGreen, cursor: "pointer" }} onClick={() => navigate("/login")}>
          Login
        </span>
      </p>
    </form>
  );
};

// ==========================
// Input Components
// ==========================
const InputField = ({ label, value, onChange, placeholder, gridSpan, type = "text" }: any) => (
  <div style={{ gridColumn: gridSpan ? `span ${gridSpan}` : undefined }}>
    <label style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.25rem", display: "block", color: theme.textDark }}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "0.7rem",
        border: "1px solid #d1d5db",
        borderRadius: "0.5rem",
        backgroundColor: theme.inputAccent,
        fontWeight: 500,
        color: theme.textDark,
      }}
      required
    />
  </div>
);

const FileInput = ({ label, file, setFile }: any) => (
  <div>
    <label style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.25rem", display: "block", color: theme.textDark }}>{label}</label>
    <input
      type="file"
      accept=".pdf,.doc,.docx"
      onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
      style={{ width: "100%", padding: "0.5rem", borderRadius: "0.5rem", border: `1px solid ${theme.mutedGray}` }}
      required
    />
    {file && <p style={{ fontSize: "0.8rem", color: theme.textDark, marginTop: "0.25rem" }}>Selected: {file.name}</p>}
  </div>
);

const MultiFileInput = ({ label, files, setFiles }: any) => (
  <div>
    <label style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.25rem", display: "block", color: theme.textDark }}>{label}</label>
    <input
      type="file"
      multiple
      accept=".pdf,.jpg,.jpeg,.png"
      onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])}
      style={{ width: "100%", padding: "0.5rem", borderRadius: "0.5rem", border: `1px solid ${theme.mutedGray}` }}
    />
    {files.length > 0 && (
      <ul style={{ fontSize: "0.8rem", color: theme.textDark, marginTop: "0.25rem", paddingLeft: "1rem" }}>
        {files.map((file: File, idx: number) => (
          <li key={idx}>{file.name}</li>
        ))}
      </ul>
    )}
  </div>
);

export default Register;
