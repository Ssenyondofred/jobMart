"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { MapPin, Menu, X, User, Briefcase, GraduationCap, PenTool, FileText, Loader2, CheckCircle2 } from "lucide-react"

// =================== TYPES ===================
type Profile = {
  id: string
  name: string
  email: string
  skills: string
  experience: string
  education: string
  portfolio: string
}

type Job = {
  id: string
  title: string
  company_name: string
  location: string
  type: string
  description: string
  hot: boolean
}

type Application = {
  id: string
  candidate_id: string
  job_id: string
  status: string
  cover_letter: string
  referee1_name: string
  referee1_email: string
  referee2_name: string
  referee2_email: string
}

type FormData = {
  first_name: string
  last_name: string
  email: string
  phone: string
  location: string
  skills: string[]
  experience: string
  education: string
  portfolio: string
  referee1_name: string
  referee1_email: string
  referee2_name: string
  referee2_email: string
}

type JobSeekerDashboardProps = {
  currentView?: string
}

type NavItem = {
  key: string
  label: string
  icon: typeof FileText
}

// =================== COMPONENT ===================
export function JobSeekerWireframes({ currentView = "matches" }: JobSeekerDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeView, setActiveView] = useState(currentView)
  const [loading, setLoading] = useState(true)

  const [profile, setProfile] = useState<Profile | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])

  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    location: "",
    skills: [],
    experience: "",
    education: "",
    portfolio: "",
    referee1_name: "",
    referee1_email: "",
    referee2_name: "",
    referee2_email: "",
  })

  const [applyModalOpen, setApplyModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [coverLetter, setCoverLetter] = useState("")
  const [expandedJobs, setExpandedJobs] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)

  // ================== RESPONSIVE SIDEBAR ===================
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const resCand = await fetch("http://127.0.0.1:5000/candidates")
        const candData = await resCand.json()

        if (candData.length > 0) {
          const c = candData[0]
          setProfile(c)
          const [first_name, ...last] = c.name.split(" ")
          setFormData((prev) => ({
            ...prev,
            first_name,
            last_name: last.join(" "),
            email: c.email,
            skills: c.skills ? c.skills.split(",").map((s: string) => s.trim()) : [],
            experience: c.experience || "",
            education: c.education || "",
            portfolio: c.portfolio || "",
          }))

          const resApps = await fetch("http://127.0.0.1:5000/applications")
          const appsData = await resApps.json()
          setApplications(appsData.filter((a: Application) => a.candidate_id === c.id))
        }

        const resJobs = await fetch("http://127.0.0.1:5000/jobs")
        const jobsData = await resJobs.json()
        setJobs(jobsData)
      } catch (err) {
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const saveProfile = async () => {
    setSubmitting(true)
    try {
      const payload = new FormData()
      payload.append("name", `${formData.first_name} ${formData.last_name}`)
      payload.append("email", formData.email)
      payload.append("skills", formData.skills.join(", "))
      payload.append("experience", formData.experience)
      payload.append("education", formData.education)
      payload.append("portfolio", formData.portfolio)
      payload.append("password", "default123")

      const res = await fetch("http://127.0.0.1:5000/register/candidate", {
        method: "POST",
        body: payload,
      })
      const data = await res.json()

      if (res.ok) {
        alert("Profile saved successfully!")
        setProfile(data.data[0])
        setActiveView("profile")
      } else {
        alert("Error saving profile: " + JSON.stringify(data))
      }
    } catch (err) {
      console.error(err)
      alert("Failed to save profile")
    } finally {
      setSubmitting(false)
    }
  }

  const generateCoverLetter = (job: Job) => {
    return `Dear Hiring Manager,

I am excited to apply for the position of ${job.title} at ${job.company_name || "your company"}.

With my experience in ${formData.experience || "relevant fields"} and skills in ${formData.skills.join(", ") || "various technologies"}, I am confident I can contribute positively to your team.

Thank you for considering my application.

Sincerely,
${formData.first_name} ${formData.last_name}
Email: ${formData.email}
Phone: ${formData.phone || "N/A"}`
  }

  const handleApply = (job: Job) => {
    setSelectedJob(job)
    setCoverLetter(generateCoverLetter(job))
    setApplyModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!selectedJob || !profile) return;

  setSubmitting(true);

  const payload = {
    email: profile.email,
    job_id: selectedJob.id,
    cover_letter: coverLetter,
    referee1_name: formData.referee1_name,
    referee1_email: formData.referee1_email,
    referee2_name: formData.referee2_name,
    referee2_email: formData.referee2_email,
  };

  const applicantData = {
    applicant_name: `${formData.first_name} ${formData.last_name}`,
    referees: [formData.referee1_email, formData.referee2_email],
  };

  try {
    // Submit application
    const res = await fetch("http://127.0.0.1:5000/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      // Notify referees
      try {
        await fetch("http://localhost:5000/send_referee_emails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(applicantData),
        });
        alert("✅ Application submitted! Referees notified.");
      } catch (error) {
        console.error("Referee notification error:", error);
        alert("⚠️ Application submitted, but failed to notify referees.");
      }

      // Update UI state
      setApplications((prev) => [...prev, data[0]]);
      setApplyModalOpen(false);
      setSelectedJob(null);
      setCoverLetter("");
      setFormData((prev) => ({
        ...prev,
        referee1_name: "",
        referee1_email: "",
        referee2_name: "",
        referee2_email: "",
      }));
    } else {
      alert("Error submitting application: " + JSON.stringify(data));
    }
  } catch (err) {
    console.error(err);
    alert("Failed to submit application.");
  } finally {
    setSubmitting(false);
  }
};


  const isApplied = (jobId: string) => applications.some((app) => app.job_id === jobId)

  const appliedJobs = applications.map((app) => {
    const job = jobs.find((j) => j.id === app.job_id)
    return { ...app, job }
  })

  const navItems: NavItem[] = [
    { key: "registration", label: "Registration", icon: FileText },
    { key: "profile", label: "Profile", icon: User },
    { key: "matches", label: "Job Matches", icon: Briefcase },
    { key: "applied", label: "Applied Jobs", icon: Briefcase },
    { key: "training", label: "Training", icon: GraduationCap },
    { key: "freelance", label: "Freelance", icon: PenTool },
  ]

  // ================== SIDEBAR ===================
  // ================== SIDEBAR ===================
const Sidebar = () => {
  const sidebarStyles = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    height: "75%",
    backdropFilter: "blur(20px)",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRight: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 0 20px rgba(0,0,0,0.2)",
    transition: "all 0.3s",
    width: sidebarOpen ? 256 : 64, // 64px for collapsed
    zIndex: 50,
  };

  const buttonStyles = (isActive: boolean) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    borderRadius: "0.75rem",
    cursor: "pointer",
    transition: "all 0.2s",
    background: isActive
      ? "linear-gradient(to right, rgba(59,130,246,0.125), rgba(6,182,212,0.125))"
      : "transparent",
    border: isActive ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent",
    color: isActive ? "#1f2937" : "#000",
    boxShadow: isActive ? "0 10px 20px rgba(59,130,246,0.125)" : "none",
    backdropFilter: "blur(10px)",
  });

  return (
    <div style={sidebarStyles}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        {sidebarOpen && (
          <span style={{ fontWeight: "bold", fontSize: "1.25rem", background: "linear-gradient(to right, #3b82f6, #06b6d4, #14b8a6)", WebkitBackgroundClip: "text", color: "transparent" }}>
            JobSeeker
          </span>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          style={{
            padding: "0.375rem",
            borderRadius: "0.5rem",
            backgroundColor: "rgba(255,255,255,0.1)",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {sidebarOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
        </button>
      </div>

      <nav role="navigation" aria-label="Main navigation" style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", padding: "0 0.5rem" }}>
        {navItems.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            onClick={() => setActiveView(key)}
            style={buttonStyles(activeView === key)}
            aria-current={activeView === key ? "page" : undefined}
          >
            <Icon style={{ width: 20, height: 20, flexShrink: 0 }} />
            {sidebarOpen && <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>}
          </div>
        ))}
      </nav>
    </div>
  );
};

  // ================== VIEWS ===================
  const renderRegistration = () => (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-balance">Candidate Registration</h2>
        <p className="text-muted-foreground mt-2">Create your profile to start applying for jobs</p>
      </div>

      <Card className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                placeholder="John"
                value={formData.first_name}
                onChange={(e) => handleInputChange("first_name", e.target.value)}
                className="backdrop-blur-sm bg-white/5 border-white/20 focus:border-blue-400/50 focus:ring-blue-400/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                placeholder="Doe"
                value={formData.last_name}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                className="backdrop-blur-sm bg-white/5 border-white/20 focus:border-blue-400/50 focus:ring-blue-400/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="backdrop-blur-sm bg-white/5 border-white/20 focus:border-blue-400/50 focus:ring-blue-400/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+256 700 000 000"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="backdrop-blur-sm bg-white/5 border-white/20 focus:border-blue-400/50 focus:ring-blue-400/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Experience</Label>
            <Textarea
              id="experience"
              placeholder="Describe your work experience..."
              value={formData.experience}
              onChange={(e) => handleInputChange("experience", e.target.value)}
              className="min-h-24 backdrop-blur-sm bg-white/5 border-white/20 focus:border-blue-400/50 focus:ring-blue-400/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            <Input
              id="education"
              placeholder="Bachelor's in Computer Science"
              value={formData.education}
              onChange={(e) => handleInputChange("education", e.target.value)}
              className="backdrop-blur-sm bg-white/5 border-white/20 focus:border-blue-400/50 focus:ring-blue-400/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolio">Portfolio URL</Label>
            <Input
              id="portfolio"
              placeholder="https://yourportfolio.com"
              value={formData.portfolio}
              onChange={(e) => handleInputChange("portfolio", e.target.value)}
              className="backdrop-blur-sm bg-white/5 border-white/20 focus:border-blue-400/50 focus:ring-blue-400/20"
            />
          </div>

          <Button
            className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-black border-0 shadow-lg shadow-blue-500/30"
            onClick={saveProfile}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderProfile = () => (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-balance">Your Profile</h2>
        <p className="text-muted-foreground mt-2">View and manage your profile information</p>
      </div>

      {profile ? (
        <Card className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border-white/20 shadow-xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 backdrop-blur-md border border-blue-400/30 flex items-center justify-center">
                <User className="h-8 w-8 text-blue-400" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{profile.name}</h3>
                <p className="text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div>
                <Label className="text-muted-foreground">Skills</Label>
                <p className="mt-1">{profile.skills || "Not specified"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Education</Label>
                <p className="mt-1">{profile.education || "Not specified"}</p>
              </div>
              <div className="md:col-span-2">
                <Label className="text-muted-foreground">Experience</Label>
                <p className="mt-1">{profile.experience || "Not specified"}</p>
              </div>
              {profile.portfolio && (
                <div className="md:col-span-2">
                  <Label className="text-muted-foreground">Portfolio</Label>
                  <a
                    href={profile.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-blue-400 hover:text-blue-300 hover:underline block transition-colors"
                  >
                    {profile.portfolio}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border-white/20 shadow-xl">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No profile found. Please register first.</p>
            <Button
              className="mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-black border-0 shadow-lg shadow-blue-500/30"
              onClick={() => setActiveView("registration")}
            >
              Go to Registration
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderJobMatches = () => (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-balance">Job Matches</h2>
        <p className="text-muted-foreground mt-2">
          Browse available positions and apply to those that match your skills
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        </div>
      ) : jobs.length === 0 ? (
        <Card className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border-white/20 shadow-xl">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No jobs available at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => {
            const expanded = expandedJobs[job.id] || false
            const applied = isApplied(job.id)

            return (
              <Card
                key={job.id}
                className="relative backdrop-blur-xl bg-white/10 dark:bg-black/20 border-white/20 hover:border-blue-400/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
              >
                {job.hot && (
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-black border-0 font-bold animate-pulse shadow-lg shadow-orange-500/30">
                    🔥 Hot Job
                  </Badge>
                )}

                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <h3 className="font-bold text-xl text-balance">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.company_name}</p>
                      </div>
                      <Badge variant="outline" className="backdrop-blur-sm bg-white/5 border-white/20">
                        {job.type || "Full-time"}
                      </Badge>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" aria-hidden="true" />
                      <span>{job.location}</span>
                    </div>
                  </div>

                  <p className={`text-sm transition-all duration-300 ${expanded ? "" : "line-clamp-3"}`}>
                    {job.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setExpandedJobs((prev) => ({ ...prev, [job.id]: !expanded }))}
                      className="hover:bg-white/5"
                      aria-expanded={expanded}
                    >
                      {expanded ? "Show Less" : "Read More"}
                    </Button>

                    <Button
                      size="sm"
                      disabled={applied}
                      onClick={() => handleApply(job)}
                      className={
                        applied
                          ? "bg-white/5 text-muted-foreground cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-black border-0 shadow-lg shadow-blue-500/30"
                      }
                    >
                      {applied ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" aria-hidden="true" />
                          Applied
                        </>
                      ) : (
                        "Apply Now"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )

  const renderAppliedJobs = () => (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-balance">Applied Jobs</h2>
        <p className="text-muted-foreground mt-2">Track your job applications and their status</p>
      </div>

      {appliedJobs.length === 0 ? (
        <Card className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border-white/20 shadow-xl">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">You haven't applied to any jobs yet.</p>
            <Button
              className="mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-black border-0 shadow-lg shadow-blue-500/30"
              onClick={() => setActiveView("matches")}
            >
              Browse Jobs
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appliedJobs.map((app) => (
            <Card
              key={app.id}
              className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border-white/20 hover:border-blue-400/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
            >
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-xl text-balance">{app.job?.title || "Unknown Position"}</h3>
                    <Badge
                      variant={app.status === "pending" ? "outline" : "default"}
                      className={
                        app.status === "pending"
                          ? "backdrop-blur-sm bg-white/5 border-white/20 capitalize"
                          : "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30 text-green-100 capitalize"
                      }
                    >
                      {app.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{app.job?.company_name || "Unknown Company"}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Referee 1</Label>
                    <p>
                      {app.referee1_name} ({app.referee1_email})
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Referee 2</Label>
                    <p>
                      {app.referee2_name} ({app.referee2_email})
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  const renderTraining = () => (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-balance">Training Resources</h2>
        <p className="text-muted-foreground mt-2">Enhance your skills with our training materials</p>
      </div>

      <Card className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border-white/20 shadow-xl">
        <CardContent className="p-6">
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400/20 to-cyan-400/20 backdrop-blur-md border border-blue-400/30 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 text-blue-400" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold">Resume Writing Workshop</h3>
                <p className="text-sm text-muted-foreground">Learn how to craft a compelling resume</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400/20 to-cyan-400/20 backdrop-blur-md border border-blue-400/30 flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-blue-400" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold">Interview Skills</h3>
                <p className="text-sm text-muted-foreground">Master the art of successful interviews</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-400/20 to-cyan-400/20 backdrop-blur-md border border-blue-400/30 flex items-center justify-center shrink-0">
                <GraduationCap className="h-5 w-5 text-blue-400" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold">Career Growth Webinars</h3>
                <p className="text-sm text-muted-foreground">Join our webinars for career advancement tips</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )

  const renderFreelance = () => (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-balance">Freelance Opportunities</h2>
        <p className="text-muted-foreground mt-2">Discover short-term projects and gig opportunities</p>
      </div>

      <Card className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border-white/20 shadow-xl">
        <CardContent className="p-12 text-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 backdrop-blur-md border border-blue-400/30 flex items-center justify-center mx-auto mb-4">
            <PenTool className="h-8 w-8 text-blue-400" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Coming Soon!</h3>
          <p className="text-muted-foreground">
            We're working on bringing you exciting freelance opportunities. Stay tuned!
          </p>
        </CardContent>
      </Card>
    </div>
  )

  const renderActiveView = () => {
    switch (activeView) {
      case "registration":
        return renderRegistration()
      case "profile":
        return renderProfile()
      case "applied":
        return renderAppliedJobs()
      case "training":
        return renderTraining()
      case "freelance":
        return renderFreelance()
      default:
        return renderJobMatches()
    }
  }

  // ================== MAIN RENDER ===================
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />

      <div className="flex min-h-screen relative z-10">
        <Sidebar />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
          {renderActiveView()}
        </main>
      </div>

      {/* ================= APPLICATION MODAL ================= */}
      {applyModalOpen && selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          onClick={() => !submitting && setApplyModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <Card
            className="w-full sm:w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-y-auto rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-black/30 border-white/20 shadow-2xl transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle className="text-2xl" id="modal-title">
                Apply for {selectedJob.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">at {selectedJob.company_name}</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cover_letter">Cover Letter</Label>
               <Textarea
  id="cover_letter"
  value={coverLetter}
  onChange={(e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    setCoverLetter(e.target.value);
  }}
  placeholder="Write your cover letter here..."
  className="w-full min-h-[60rem] rounded-xl backdrop-blur-sm bg-white/5 border-white/20 
             focus:border-blue-400/50 focus:ring-blue-400/20 
             resize-none leading-relaxed overflow-hidden"
/>

              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">References</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="referee1_name">Referee 1 Name</Label>
                    <Input
                      id="referee1_name"
                      placeholder="John Smith"
                      value={formData.referee1_name}
                      onChange={(e) => handleInputChange("referee1_name", e.target.value)}
                      className="backdrop-blur-sm bg-white/5 border-white/20 focus:border-blue-400/50 focus:ring-blue-400/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referee1_email">Referee 1 Email</Label>
                    <Input
                      id="referee1_email"
                      type="email"
                      placeholder="john.smith@example.com"
                      value={formData.referee1_email}
                      onChange={(e) => handleInputChange("referee1_email", e.target.value)}
                      className="backdrop-blur-sm bg-white/5 border-white/20 focus:border-blue-400/50 focus:ring-blue-400/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referee2_name">Referee 2 Name</Label>
                    <Input
                      id="referee2_name"
                      placeholder="Jane Doe"
                      value={formData.referee2_name}
                      onChange={(e) => handleInputChange("referee2_name", e.target.value)}
                      className="backdrop-blur-sm bg-white/5 border-white/20 focus:border-blue-400/50 focus:ring-blue-400/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referee2_email">Referee 2 Email</Label>
                    <Input
                      id="referee2_email"
                      type="email"
                      placeholder="jane.doe@example.com"
                      value={formData.referee2_email}
                      onChange={(e) => handleInputChange("referee2_email", e.target.value)}
                      className="backdrop-blur-sm bg-white/5 border-white/20 focus:border-blue-400/50 focus:ring-blue-400/20"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <Button
                  variant="outline"
                  onClick={() => setApplyModalOpen(false)}
                  disabled={submitting}
                  className="backdrop-blur-sm bg-white/5 border-white/20 hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
              
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-black border-0 shadow-lg shadow-blue-500/30"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
