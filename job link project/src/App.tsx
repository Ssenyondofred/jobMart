import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LandingWireframe } from "./components/LandingWireframe";
import { JobSeekerWireframes } from "./components/JobSeekerWireframes";
import { EmployerWireframes } from "./components/EmployerWireframes";
import { AdminWireframes } from "./components/AdminWireframes";
import Register from "./components/Register";
import Login from "./components/Login";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingWireframe />} />

        {/* Auth Pages */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Role-based Pages */}
        <Route path="/jobseeker" element={<JobSeekerWireframes />} />
        <Route path="/employer" element={< EmployerWireframes currentView=""       />} />
        <Route path="/admin" element={<AdminWireframes  currentView="" />} />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
