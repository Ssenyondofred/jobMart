import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Users,
  Building,
  Target,
  TrendingUp,
  LayoutDashboard,
  FileText,
  LineChart,
  Menu,
  X,
  LogOut
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import "../App.css";
import "../index.css";

// Logout helper
const logout = (navigate: any) => {
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
  navigate("/login");
};

export function AdminWireframes({ currentView }: { currentView: string }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState(currentView || "dashboard");

  // Redirect if not logged in or not admin
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (!role || role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);
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
  // Dummy Stats
  const dummyStats = [
    { label: "Total Job Seekers", value: "12,543", icon: Users },
    { label: "Active Employers", value: "1,234", icon: Building },
    { label: "Jobs Posted", value: "3,456", icon: Target },
    { label: "Successful Placements", value: "2,891", icon: TrendingUp },
  ];

  const dummyPrograms = [
    { title: "Frontend Development Bootcamp", progress: 75, status: "Active", participants: 120, completed: 85 },
    { title: "Python Data Analysis", progress: 60, status: "Draft", participants: 80, completed: 48 },
    { title: "Digital Marketing Workshop", progress: 85, status: "Active", participants: 150, completed: 128 },
    { title: "AI & ML Training", progress: 40, status: "Draft", participants: 60, completed: 24 },
    { title: "Cloud Computing Essentials", progress: 90, status: "Active", participants: 200, completed: 180 },
    { title: "Cybersecurity Awareness", progress: 30, status: "Draft", participants: 50, completed: 15 },
  ];

  const employmentTrendsData = [
    { month: "Jan", placements: 200, jobsPosted: 300 },
    { month: "Feb", placements: 180, jobsPosted: 250 },
    { month: "Mar", placements: 220, jobsPosted: 280 },
    { month: "Apr", placements: 260, jobsPosted: 320 },
    { month: "May", placements: 300, jobsPosted: 350 },
  ];

  const skillDemandData = [
    { skill: "AI/ML", demand: 95 },
    { skill: "Cloud Computing", demand: 88 },
    { skill: "Cybersecurity", demand: 82 },
    { skill: "Blockchain", demand: 75 },
  ];

  const monthlyReportData = [
    { month: "Jan", newRegistrations: 450, jobPlacements: 320, trainingCompletions: 210, successRate: 87 },
    { month: "Feb", newRegistrations: 500, jobPlacements: 350, trainingCompletions: 240, successRate: 90 },
    { month: "Mar", newRegistrations: 480, jobPlacements: 300, trainingCompletions: 220, successRate: 85 },
    { month: "Apr", newRegistrations: 520, jobPlacements: 370, trainingCompletions: 260, successRate: 92 },
    { month: "May", newRegistrations: 550, jobPlacements: 400, trainingCompletions: 280, successRate: 95 },
  ];

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "programs", label: "Programs", icon: FileText },
    { key: "reports", label: "Reports", icon: LineChart },
  ];

  const Sidebar = () => (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-900 text-black shadow-lg transition-all duration-300 z-50
      ${sidebarOpen ? "w-64" : "w-16"}`}
    >
      <div className="flex items-center justify-between p-4">
        <span className={`font-bold text-lg transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0"}`}>
          Admin
        </span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <nav className="mt-6 flex flex-col space-y-2">
        {navItems.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveView(key)}
            className={`flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors ${
              activeView === key ? "bg-green-600" : "hover:bg-gray-700"
            }`}
          >
            <Icon className="h-5 w-5" />
            {sidebarOpen && <span>{label}</span>}
          </button>
        ))}
        <button
          onClick={() => logout(navigate)}
          className="flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-red-600 mt-4"
        >
          <LogOut className="h-5 w-5" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </nav>
    </div>
  );

  const renderSwitch = () => {
    switch (activeView) {
      case "dashboard":
        return renderDashboard();
      case "programs":
        return renderPrograms();
      case "reports":
        return renderReports();
      default:
        return renderDashboard();
    }
  };

  // Views
  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {dummyStats.map((stat, index) => (
          <Card key={index} className="border-2 border-dashed p-4">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">{stat.value}</div>
                  <div className="text-gray-500">{stat.label}</div>
                </div>
                <stat.icon className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 border-dashed">
          <CardHeader>
            <CardTitle>Employment Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employmentTrendsData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="placements" fill="#4ade80" />
                <Bar dataKey="jobsPosted" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed">
          <CardHeader>
            <CardTitle>Skill Demand Forecast</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillDemandData}>
                <XAxis dataKey="skill" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="demand" fill="#facc15" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPrograms = () => (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Training Programs</h2>
        <Button>Create New Program</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyPrograms.map((program, idx) => (
          <Card key={idx} className="border-2 border-dashed">
            <CardHeader>
              <div className="flex justify-between items-center">
                <span className="font-semibold">{program.title}</span>
                <Badge
                  variant={program.status === "Active" ? "default" : "secondary"}
                >
                  {program.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm text-gray-500">Progress</span>
                <Progress value={program.progress} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="font-semibold">{program.participants}</div>
                  <div className="text-gray-500 text-sm">Participants</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{program.completed}</div>
                  <div className="text-gray-500 text-sm">Completed</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Edit
                </Button>
                <Button size="sm" className="flex-1">
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card className="border-2 border-dashed">
        <CardHeader>
          <CardTitle>Monthly Employment Report</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ReLineChart data={monthlyReportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="newRegistrations" stroke="#4ade80" />
              <Line type="monotone" dataKey="jobPlacements" stroke="#3b82f6" />
              <Line type="monotone" dataKey="trainingCompletions" stroke="#facc15" />
            </ReLineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className={`flex-1 transition-all ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        {renderSwitch()}
      </div>
    </div>
  );
}
