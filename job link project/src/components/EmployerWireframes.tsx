import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Eye, ThumbsUp, ThumbsDown, LayoutDashboard, UserPlus, Briefcase, FileText, Menu, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts";
import "../App.css";
import "../index.css";

export function EmployerWireframes({ currentView }: { currentView: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState(currentView || "dashboard");

  // Sidebar items
  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "registration", label: "Registration", icon: UserPlus },
    { key: "posting", label: "Post Job", icon: Briefcase },
    { key: "applications", label: "Applications", icon: FileText },
  ];

  // Dummy chart & data
  const jobPerformanceData = [
    { job: "Frontend Dev", applications: 45 },
    { job: "Backend Eng", applications: 30 },
    { job: "UI/UX Designer", applications: 20 },
    { job: "Data Analyst", applications: 25 },
  ];

  const weeklyTrendData = [
    { week: "Week 1", apps: 20 },
    { week: "Week 2", apps: 35 },
    { week: "Week 3", apps: 50 },
    { week: "Week 4", apps: 40 },
  ];

  // --- Sidebar component ---
  const Sidebar = () => (
    <div className={`fixed top-0 left-0 h-full bg-gray-900 text-white shadow-lg transition-all duration-300 z-50 ${sidebarOpen ? "w-64" : "w-16"}`}>
      <div className="flex items-center justify-between p-4">
        <span className={`font-bold text-lg transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0"}`}>Employer</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      <nav className="mt-6 flex flex-col space-y-2">
        {navItems.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveView(key)}
            className={`flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors ${activeView === key ? "bg-green-600" : "hover:bg-gray-700"}`}
          >
            <Icon className="h-5 w-5" />
            {sidebarOpen && <span>{label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );

  // --- Views ---
  const renderDashboard = () => (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[{ label: "Active Jobs", value: "8" }, { label: "Total Applications", value: "156" }, { label: "Interviews Scheduled", value: "12" }, { label: "Hired This Month", value: "3" }].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Recent Applications</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {["Brian O.", "Lydia M.", "Samuel T.", "Janet W."].map((name, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded">
                <span className="font-medium">{name}</span>
                <Badge variant="secondary">New</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Job Performance</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobPerformanceData}>
                  <XAxis dataKey="job" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="applications" fill="#6b21a8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="apps" stroke="#229f26" strokeWidth={2} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderRegistration = () => (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader><CardTitle>Employer Registration</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="TechNova Solutions" />
          <Input placeholder="Information Technology" />
          <Input placeholder="hr@technova.com" />
          <Input placeholder="••••••••" type="password" />
          <Input placeholder="150 Employees" />
          <Input placeholder="https://technova.com" />
          <Button className="w-full">Create Company Account</Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderJobPosting = () => (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader><CardTitle>Post New Job</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Frontend Developer" />
          <Input placeholder="Engineering" />
          <textarea placeholder="Build scalable web applications using React & TypeScript." className="w-full h-32 p-3 border rounded resize-none" />
          <div className="grid grid-cols-3 gap-4">
            <Input placeholder="Kampala, Uganda" />
            <Input placeholder="Full-time" />
            <Input placeholder="3+ years" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="$800" />
            <Input placeholder="$1500" />
          </div>
          <Input placeholder="React, TypeScript, Tailwind, Git" />
          <textarea placeholder="Bachelor's in CS, proven experience, good communication skills." className="w-full h-24 p-3 border rounded resize-none" />
          <div className="flex justify-end space-x-4">
            <Button variant="outline">Save Draft</Button>
            <Button>Post Job</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderApplications = () => (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader><CardTitle>Applications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[{ name: "Sarah N.", role: "Frontend Developer", skills: ["React", "5 years"] },
            { name: "James K.", role: "Backend Engineer", skills: ["Node.js", "3 years"] },
            { name: "Maria P.", role: "UI/UX Designer", skills: ["Figma", "4 years"] }].map((app, i) => (
            <div key={i} className="border rounded p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold">{app.name}</p>
                  <p className="text-sm text-gray-500">{app.role}</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline"><Eye className="h-4 w-4" /></Button>
                  <Button size="sm" variant="outline"><ThumbsDown className="h-4 w-4" /></Button>
                  <Button size="sm"><ThumbsUp className="h-4 w-4" /></Button>
                </div>
              </div>
              <div className="flex space-x-2">{app.skills.map((s, idx) => <Badge key={idx} variant="secondary">{s}</Badge>)}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  // --- Main view switch ---
  const renderSwitch = () => {
    switch (activeView) {
      case "dashboard": return renderDashboard();
      case "registration": return renderRegistration();
      case "posting": return renderJobPosting();
      case "applications": return renderApplications();
      default: return renderDashboard();
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className={`flex-1 transition-all ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        {renderSwitch()}
      </div>
    </div>
  );
}
