import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Eye, ThumbsUp, ThumbsDown, LayoutDashboard, UserPlus, Briefcase, FileText, Menu, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "../App.css";
import "../index.css";

const API_BASE = "http://localhost:5000"; // Flask backend URL

// --- Types ---
interface Application {
  id: string;
  candidate_name?: string;
  job_title?: string;
  status?: string;
  hired_date?: string;
  cover_letter?: string;
}

interface Job {
  id?: string;
  title: string;
  applications_count?: number;
}

interface Stats {
  activeJobs: number;
  totalApplications: number;
  interviewsScheduled: number;
  hiredThisMonth: number;
}

// --- Component ---
export function EmployerWireframes({ currentView }: { currentView: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState(currentView || "dashboard");

  // --- Backend Data States ---
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<Stats>({
    activeJobs: 0,
    totalApplications: 0,
    interviewsScheduled: 0,
    hiredThisMonth: 0
  });
  const [loading, setLoading] = useState(false);

  // --- Modal States for Viewing Letter ---
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = (app: Application) => { setSelectedApplication(app); setModalOpen(true); };
  const closeModal = () => { setSelectedApplication(null); setModalOpen(false); };

  // --- Form states for posting a job ---
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [experience, setExperience] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [skills, setSkills] = useState("");

  // --- Form states for registration ---
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [industry, setIndustry] = useState("");
  const [password, setPassword] = useState("");
  const [employees, setEmployees] = useState("");
  const [website, setWebsite] = useState("");

  // --- Fetch applications and jobs from backend ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [appsRes, jobsRes] = await Promise.all([
        fetch(`${API_BASE}/applications`),
        fetch(`${API_BASE}/jobs`)
      ]);

      if (!appsRes.ok || !jobsRes.ok) throw new Error("Failed to fetch data");

      const appsData: Application[] = await appsRes.json();
      const jobsData: Job[] = await jobsRes.json();

      setApplications(appsData);
      setJobs(jobsData);

      // Update dashboard stats dynamically
      setStats({
        activeJobs: jobsData.length,
        totalApplications: appsData.length,
        interviewsScheduled: appsData.filter(app => app.status === "Interviewing").length,
        hiredThisMonth: appsData.filter(app => app.status === "Hired" && new Date(app.hired_date || "").getMonth() === new Date().getMonth()).length
      });
    } catch (err) {
      console.error("Error fetching backend data:", err);
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  // Function to check window width and set sidebar accordingly
  const handleResize = () => {
    if (window.innerWidth < 768) { // Small screens: collapse
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  };

  // Initial check
  handleResize();

  // Listen to resize events
  window.addEventListener("resize", handleResize);

  // Cleanup
  return () => window.removeEventListener("resize", handleResize);
}, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  // --- Sidebar items ---
  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "registration", label: "Registration", icon: UserPlus },
    { key: "posting", label: "Post Job", icon: Briefcase },
    { key: "applications", label: "Applications", icon: FileText }
  ];

  const Sidebar = () => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      height: "100vh",
      width: sidebarOpen ? "16rem" : "4rem",
      background: "rgba(30, 41, 59, 0.7)", // semi-transparent dark
      backdropFilter: "blur(10px)", // glass effect
      WebkitBackdropFilter: "blur(10px)", // for Safari
      color: "#fff",
      boxShadow: "2px 0 12px rgba(0,0,0,0.4)",
      transition: "all 0.3s ease",
      zIndex: 50,
      overflow: "hidden",
      borderRight: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "0 12px 12px 0",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <span
        style={{
          fontWeight: "bold",
          fontSize: "1.125rem",
          opacity: sidebarOpen ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        Employer
      </span>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          background: "none",
          border: "none",
          color: "#d1d5db",
          cursor: "pointer",
          transition: "color 0.2s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = "#22c55e")}
        onMouseOut={(e) => (e.currentTarget.style.color = "#d1d5db")}
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
    </div>

    <nav style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {navItems.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setActiveView(key)}
          title={!sidebarOpen ? label : undefined}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            background: activeView === key ? "rgba(34,197,94,0.2)" : "transparent",
            borderLeft: activeView === key ? "4px solid #22c55e" : "4px solid transparent",
            color: activeView === key ? "#22c55e" : "#d1d5db",
            cursor: "pointer",
            transition: "all 0.25s ease",
            borderRadius: "0 8px 8px 0",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          onMouseOut={(e) =>
            (e.currentTarget.style.background =
              activeView === key ? "rgba(34,197,94,0.2)" : "transparent")
          }
        >
          <Icon className="h-5 w-5" />
          {sidebarOpen && <span>{label}</span>}
        </button>
      ))}
    </nav>
  </div>
);

  // --- Approve / Reject Functions ---
  const handleApprove = async (appId: string) => {
    try {
      await fetch(`${API_BASE}/applications/${appId}/approve`, { method: "POST" });
      fetchData(); // refresh all data
      closeModal();
    } catch (err) { console.error(err); }
  };

  const handleReject = async (appId: string) => {
    try {
      await fetch(`${API_BASE}/applications/${appId}/reject`, { method: "POST" });
      fetchData(); // refresh all data
      closeModal();
    } catch (err) { console.error(err); }
  };

  // --- Views ---
  const renderDashboard = () => (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[ 
          { label: "Active Jobs", value: stats.activeJobs },
          { label: "Total Applications", value: stats.totalApplications },
          { label: "Interviews Scheduled", value: stats.interviewsScheduled },
          { label: "Hired This Month", value: stats.hiredThisMonth }
        ].map((stat, index) => (
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
            {applications.slice(0, 5).map((app, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded">
                <span className="font-medium">{app.candidate_name}</span>
                <Badge variant={app.status === "Hired" ? "success" : "secondary"}>{app.status || "New"}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Job Performance</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobs}>
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="applications_count" fill="#6b21a8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderRegistration = () => {
    const handleRegister = async () => {
      const payload = { companyName, email: companyEmail, industry, jobOpenings: Number(employees), website, password };
      try {
        const res = await fetch(`${API_BASE}/register/employer`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error("Failed to register employer");
        alert("Employer registered successfully");
        setCompanyName(""); setCompanyEmail(""); setIndustry(""); setPassword(""); setEmployees(""); setWebsite("");
        fetchData();
      } catch (err) {
        console.error(err);
        alert("Error registering employer");
      }
    };

    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader><CardTitle>Employer Registration</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="TechNova Solutions" value={companyName} onChange={e => setCompanyName(e.target.value)} />
            <Input placeholder="Information Technology" value={industry} onChange={e => setIndustry(e.target.value)} />
            <Input placeholder="hr@technova.com" value={companyEmail} onChange={e => setCompanyEmail(e.target.value)} />
            <Input placeholder="••••••••" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <Input placeholder="150 Employees" value={employees} onChange={e => setEmployees(e.target.value)} />
            <Input placeholder="https://technova.com" value={website} onChange={e => setWebsite(e.target.value)} />
            <Button className="w-full" onClick={handleRegister}>Create Company Account</Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderJobPosting = () => {
    const handlePostJob = async () => {
      const payload = { title, department, description, location, type, experience_required: experience, salary_min: Number(salaryMin), salary_max: Number(salaryMax), skills_required: skills.split(",").map(s => s.trim()) };
      try {
        await fetch(`${API_BASE}/jobs`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        fetchData(); // refresh jobs and stats
        alert("Job posted successfully");
        setTitle(""); setDepartment(""); setDescription(""); setLocation(""); setType(""); setExperience(""); setSalaryMin(""); setSalaryMax(""); setSkills("");
      } catch (err) {
        console.error(err);
        alert("Error posting job");
      }
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader><CardTitle>Post New Job</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Frontend Developer" value={title} onChange={e => setTitle(e.target.value)} />
            <Input placeholder="Engineering" value={department} onChange={e => setDepartment(e.target.value)} />
            <textarea placeholder="Job Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full h-32 p-3 border rounded resize-none" />
            <div className="grid grid-cols-3 gap-4">
              <Input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
              <Input placeholder="Full-time" value={type} onChange={e => setType(e.target.value)} />
              <Input placeholder="Experience" value={experience} onChange={e => setExperience(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Salary Min" value={salaryMin} onChange={e => setSalaryMin(e.target.value)} />
              <Input placeholder="Salary Max" value={salaryMax} onChange={e => setSalaryMax(e.target.value)} />
            </div>
            <Input placeholder="Skills (comma separated)" value={skills} onChange={e => setSkills(e.target.value)} />
            <div className="flex justify-end space-x-4">
              <Button onClick={handlePostJob}>Post Job</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderApplications = () => {
    const pendingApps = applications.filter(app => app.status !== "Approved");
    const approvedApps = applications.filter(app => app.status === "Approved");

    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Pending Applications */}
        <Card>
          <CardHeader><CardTitle>Pending Applications</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Candidate</th>
                  <th className="px-4 py-2 text-left">Job</th>
                  <th className="px-4 py-2 text-left">Letter</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingApps.map((app) => (
                  <tr key={app.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{app.candidate_name}</td>
                    <td className="px-4 py-2">{app.job_title}</td>
                    <td className="px-4 py-2 cursor-pointer text-blue-600 hover:underline" onClick={() => openModal(app)}>View Letter</td>
                    <td className="px-4 py-2">{app.status || "Pending"}</td>
                    <td className="px-4 py-2 flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleReject(app.id)}><ThumbsDown className="h-4 w-4" /></Button>
                      <Button size="sm" onClick={() => handleApprove(app.id)}><ThumbsUp className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Approved Applications */}
        {approvedApps.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Approved Applications</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="min-w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">Candidate</th>
                    <th className="px-4 py-2 text-left">Job</th>
                    <th className="px-4 py-2 text-left">Letter</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedApps.map(app => (
                    <tr key={app.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{app.candidate_name}</td>
                      <td className="px-4 py-2">{app.job_title}</td>
                      <td className="px-4 py-2 cursor-pointer text-blue-600 hover:underline" onClick={() => openModal(app)}>View Letter</td>
                      <td className="px-4 py-2 text-green-600 font-bold">{app.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}

        {/* Modal */}
        {modalOpen && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative">
              <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" onClick={closeModal}>X</button>
              <h3 className="text-lg font-bold mb-4">{selectedApplication.candidate_name}'s Letter</h3>
              <p className="whitespace-pre-wrap mb-6">{selectedApplication.cover_letter || "No letter provided"}</p>
              <div className="flex justify-end space-x-4">
                {selectedApplication.status !== "Approved" && <Button variant="outline" onClick={() => handleReject(selectedApplication.id)}>Reject</Button>}
                {selectedApplication.status !== "Approved" && <Button onClick={() => handleApprove(selectedApplication.id)}>Approve</Button>}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

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
      <div className={`flex-1 ml-${sidebarOpen ? "64" : "16"} transition-all duration-300`}>
        {renderSwitch()}
      </div>
    </div>
  );
}
