import { useState, useEffect } from "react";
import "../App.css";
import "../index.css";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  MapPin,
  Menu,
  X,
  User,
  Briefcase,
  GraduationCap,
  PenTool,
  FileText,
} from "lucide-react";

type JobSeekerWireframesProps = {
  currentView: string;
};

export function JobSeekerWireframes({ currentView }: JobSeekerWireframesProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState(currentView || "matches");

  const [profile, setProfile] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  const [formData, setFormData] = useState<any>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    location: "",
    skills: [],
    experience: "",
    education: "",
    portfolio: "",
  });

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState("");

  // Fetch candidate, jobs, and applications
  useEffect(() => {
    async function fetchData() {
      try {
        const resCand = await fetch("http://127.0.0.1:5000/candidates");
        const candData = await resCand.json();
        if (candData.length > 0) {
          const c = candData[0];
          setProfile(c);
          const [first_name, ...last] = c.name.split(" ");
          setFormData({
            ...formData,
            first_name,
            last_name: last.join(" "),
            email: c.email,
            skills: c.skills ? c.skills.split(",") : [],
            experience: c.experience,
            education: c.education,
            portfolio: c.portfolio,
          });

          const resApps = await fetch("http://127.0.0.1:5000/applications");
          const appsData = await resApps.json();
          setApplications(appsData.filter((a: any) => a.candidate_id === c.id));
        }

        const resJobs = await fetch("http://127.0.0.1:5000/jobs");
        const jobsData = await resJobs.json();
        setJobs(jobsData);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  // Save Candidate Profile
  const saveProfile = async () => {
    const payload = new FormData();
    payload.append("name", `${formData.first_name} ${formData.last_name}`);
    payload.append("email", formData.email);
    payload.append("skills", formData.skills?.join(",") || "");
    payload.append("experience", formData.experience || "");
    payload.append("education", formData.education || "");
    payload.append("portfolio", formData.portfolio || "");
    payload.append("password", "default123"); // temp password

    const res = await fetch("http://127.0.0.1:5000/register/candidate", {
      method: "POST",
      body: payload,
    });
    const data = await res.json();
    if (res.ok) {
      alert("Profile created successfully!");
      setProfile(data.data[0]);
    } else {
      alert("Error creating profile: " + JSON.stringify(data));
    }
  };

  // Generate Cover Letter
  const generateCoverLetter = (job: any) => {
    return `Dear Hiring Manager,

I am excited to apply for the position of ${job.title} at ${job.company_name || "your company"}.

With my experience in ${formData.experience || "relevant experience"} and skills in ${
      formData.skills?.join(", ") || "relevant skills"
    }, I am confident I can contribute positively to your team.

Thank you for considering my application.

Sincerely,
${formData.first_name} ${formData.last_name}
Email: ${formData.email}
Phone: ${formData.phone || "N/A"}`;
  };

  // Open modal with generated cover letter
  const handleApply = (job: any) => {
    setSelectedJob(job);
    setCoverLetter(generateCoverLetter(job));
    setApplyModalOpen(true);
  };

  // Submit application
  const submitApplication = async () => {
    if (!selectedJob || !profile) return;

    const payload = {
      email: profile.email, // backend expects email
      job_id: selectedJob.id,
      cover_letter: coverLetter,
    };

    try {
      const res = await fetch("http://127.0.0.1:5000/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Application submitted successfully!");
        setApplications([...applications, data[0]]);
        setApplyModalOpen(false);
        setSelectedJob(null);
        setCoverLetter("");
      } else {
        alert("Error submitting application: " + JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit application.");
    }
  };

  const isApplied = (jobId: string) =>
    applications.some((app) => app.job_id === jobId);

  // Sidebar
  const navItems = [
    { key: "registration", label: "Registration", icon: FileText },
    { key: "profile", label: "Profile", icon: User },
    { key: "matches", label: "Job Matches", icon: Briefcase },
    { key: "training", label: "Training", icon: GraduationCap },
    { key: "freelance", label: "Freelance", icon: PenTool },
  ];

  const Sidebar = () => (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-900 text-white shadow-lg transition-all duration-300 z-50 ${
        sidebarOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between p-4">
        <span className={`font-bold text-lg ${sidebarOpen ? "block" : "hidden"}`}>
          Dashboard
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
      </nav>
    </div>
  );

  // Views
  const renderRegistration = () => (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Candidate Registration</h2>
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="First Name"
          value={formData.first_name}
          onChange={(e) => handleInputChange("first_name", e.target.value)}
        />
        <Input
          placeholder="Last Name"
          value={formData.last_name}
          onChange={(e) => handleInputChange("last_name", e.target.value)}
        />
        <Input
          placeholder="Email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
        />
        <Input
          placeholder="Experience"
          value={formData.experience}
          onChange={(e) => handleInputChange("experience", e.target.value)}
        />
      </div>
      <Button className="mt-4" onClick={saveProfile}>
        Save Profile
      </Button>
    </div>
  );

  const renderProfile = () => (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Profile</h2>
      {profile ? (
        <div className="space-y-2">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Skills:</strong> {profile.skills}</p>
          <p><strong>Experience:</strong> {profile.experience}</p>
          <p><strong>Education:</strong> {profile.education}</p>
        </div>
      ) : (
        <p>No profile found. Please register.</p>
      )}
    </div>
  );

  const renderJobMatches = () => (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      {jobs.map((job) => (
        <Card key={job.id} className="border-2 border-dashed">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <h3 className="font-bold">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.company_name}</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                </div>
              </div>
              <Badge variant="outline">{job.type || "N/A"}</Badge>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                size="sm"
                disabled={isApplied(job.id)}
                onClick={() => handleApply(job)}
              >
                {isApplied(job.id) ? "Applied" : "Apply"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {applyModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <Card className="max-w-xl w-full p-6 space-y-4">
            <CardHeader>
              <CardTitle>Apply for {selectedJob.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                className="w-full h-48 p-3 border rounded resize-none"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setApplyModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={submitApplication}>Submit Application</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const renderTraining = () => (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Training Resources</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>Resume Writing Workshop</li>
        <li>Interview Skills</li>
        <li>Career Growth Webinars</li>
      </ul>
    </div>
  );

  const renderFreelance = () => (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Freelance Opportunities</h2>
      <p>Coming soon! You’ll find gigs and short-term projects here.</p>
    </div>
  );

  const renderActiveView = () => {
    switch (activeView) {
      case "registration":
        return renderRegistration();
      case "profile":
        return renderProfile();
      case "training":
        return renderTraining();
      case "freelance":
        return renderFreelance();
      default:
        return renderJobMatches();
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-16 md:ml-64 transition-all">{renderActiveView()}</div>
    </div>
  );
}
