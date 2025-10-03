import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin, FaFacebookF, FaTwitter } from "react-icons/fa";

// Theme (same vibe as Register)
const theme = {
  forestGreen: "#228B22", // base button color
  darkGreen: "#006400",   // hover/active
  gold: "#FFD700",        // accent
  white: "#FFFFFF",
  black: "#000000",
  lightGray: "#f8f9fa",
  darkGray: "#343a40",
};

// Logout helper (reuse across app)
export const logout = (navigate: any) => {
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
  navigate("/login");
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    alert("Google login not yet implemented!");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Save session
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userRole", data.role);

        // Redirect based on role
        if (data.role === "admin") navigate("/admin");
        else if (data.role === "candidate") navigate("/jobSeeker");
        else if (data.role === "employer") navigate("/employer");
        else alert("Unknown role, cannot redirect.");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: theme.lightGray,
        padding: "1rem",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          backgroundColor: theme.white,
          borderRadius: "1.5rem",
          padding: "2rem 1.5rem",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <div
          style={{
            backgroundColor: theme.forestGreen,
            borderRadius: "1rem 1rem 0 0",
            padding: "1rem",
            textAlign: "center",
            margin: "-2rem -1.5rem 2rem -1.5rem",
            color: theme.white,
            fontSize: "1.2rem",
            fontWeight: "700",
          }}
        >
          Welcome Back
        </div>

        <label style={labelStyle}>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@example.com"
          style={inputStyle}
        />

        <label style={labelStyle}>Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          style={inputStyle}
        />

        <div style={{ textAlign: "right", marginBottom: "1rem" }}>
          <Link
            to="/forgot"
            style={{
              fontSize: "0.85rem",
              color: theme.darkGray,
              textDecoration: "none",
            }}
          >
            Forgot Password?
          </Link>
        </div>

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p style={{ textAlign: "center", fontSize: "0.8rem", marginTop: "1rem" }}>
          or continue with
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1.5rem",
            margin: "1rem 0",
          }}
        >
          <FcGoogle size={25} style={{ cursor: "pointer" }} onClick={handleGoogleLogin} />
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="h-6 w-6 text-blue-700 hover:text-blue-900" />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebookF className="h-6 w-6 text-blue-600 hover:text-blue-800" />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="h-6 w-6 text-black hover:text-gray-800" />
          </a>
        </div>

        <p style={{ fontSize: "0.8rem", textAlign: "center" }}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: theme.forestGreen, fontWeight: 600 }}>
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.7rem",
  border: "none",
  borderRadius: "10px",
  backgroundColor: "#f2f8f2",
  marginBottom: "1rem",
  fontWeight: 600,
};

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  fontSize: "0.9rem",
  marginBottom: "0.25rem",
  display: "block",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.7rem",
  backgroundColor: theme.forestGreen,
  color: theme.white,
  fontWeight: 700,
  fontSize: "1rem",
  border: "none",
  borderRadius: "20px",
  cursor: "pointer",
  transition: "background 0.3s",
};

export default Login;
