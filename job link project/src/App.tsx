import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import { LandingWireframe } from "./components/LandingWireframe";
import { JobSeekerWireframes } from "./components/JobSeekerWireframes";
import { EmployerWireframes } from "./components/EmployerWireframes";
import { AdminWireframes } from "./components/AdminWireframes";
import { NavigationWireframe } from "./components/NavigationWireframe";
import Register  from "./components/Register";
import Login  from "./components/Login"

type UserType = "jobSeeker" | "employer" | "admin";


function Dashboard({ userType }: { userType: UserType }) {
  const [currentView, setCurrentView] = useState("dashboard");

  const getUserTypeName = () => {
    switch (userType) {
      case "jobSeeker":
        return "Job Seeker";
      case "employer":
        return "Employer";
      case "admin":
        return "Admin/Government";
    }
  };

  const getFlowDescription = () => {
    switch (userType) {
      case "jobSeeker":
        return "Register → Create Profile → Get Job Matches → Apply → Get Hired";
      case "employer":
        return "Register → Post Job/Gig → Receive Applications → Shortlist → Hire";
      case "admin":
        return "Monitor → Collect Data → Analyze Trends → Improve Employment Programs";
    }
  };

  const renderUserContent = () => {
    switch (userType) {
      case "jobSeeker":
        return <JobSeekerWireframes currentView={currentView} />;
      case "employer":
        return <EmployerWireframes currentView={currentView} />;
      case "admin":
        return <AdminWireframes currentView={currentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      
      <NavigationWireframe
        userType={userType}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      
      <div className="border-b p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => (window.location.href = "/")}
            className="text-sm text-blue-600 underline"
          >
            Back to Landing
          </button>
          <div className="space-y-1">
            <h2 className="font-medium">{getUserTypeName()} Dashboard</h2>
            <p className="text-sm text-muted-foreground">{getFlowDescription()}</p>
          </div>
        </div>
      </div>

     
      <main className="flex-1">{renderUserContent()}</main>
    </div>
  );
}


export default function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<LandingWireframe />} />

       
        <Route path="/jobSeeker" element={<Dashboard userType="jobSeeker" />} />
        <Route path="/employer" element={<Dashboard userType="employer" />} />
        <Route path="/admin" element={<Dashboard userType="admin" />} />

        
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
