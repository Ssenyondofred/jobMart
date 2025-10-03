import { useState } from "react";
import "../App.css";
import "../index.css";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  MapPin,
  Star,
  Clock,
  DollarSign,
  BookOpen,
  Menu,
  X,
  User,
  Briefcase,
  GraduationCap,
  PenTool,
  FileText
} from "lucide-react";

type JobSeekerWireframesProps = {
  currentView: string;
};

export function JobSeekerWireframes({ currentView }: JobSeekerWireframesProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState(currentView || "matches");

  // --- Background style ---
  const backgroundStyle = {
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
  };

  const contentOverlay = "bg-white bg-opacity-90 backdrop-blur-sm";

  // --- Dummy Data ---
  const dummyProfile = {
    firstName: "Fred",
    lastName: "Ssenyondo",
    email: "emma@gmail.com",
    phone: "+256 750531168",
    location: "Kampala, Uganda",
    experienceLevel: "Mid-Level",
    bio: "Passionate frontend developer with 3 years experience in building React applications.",
    skills: ["JavaScript", "React", "Node.js", "Python"],
    profileCompletion: 65,
    courses: [
      { title: "React Basics", progress: 65, hours: 8, rating: 4.5 },
      { title: "Node.js Advanced", progress: 30, hours: 12, rating: 4.2 }
    ],
    certificates: ["React Basics Certificate", "Node.js Certificate"]
  };

  const dummyJobs = [
    { title: "Frontend Developer", company: "TechCorp", location: "Kampala", salary: "$1500", match: 85 },
    { title: "UI/UX Designer", company: "DesignHub", location: "Entebbe", salary: "$1200", match: 78 },
    { title: "Backend Developer", company: "SoftSolutions", location: "Kampala", salary: "$1600", match: 92 },
    { title: "Fullstack Developer", company: "DevWorks", location: "Jinja", salary: "$1800", match: 88 }
  ];

  const dummyCourses = [
    { title: "React for Beginners", hours: 10, rating: 4.5 },
    { title: "Advanced Node.js", hours: 12, rating: 4.2 },
    { title: "UI/UX Design Principles", hours: 8, rating: 4.7 },
    { title: "Python Automation", hours: 15, rating: 4.4 }
  ];

  const dummyFreelanceGigs = [
    { title: "React Landing Page", type: "Remote", skills: ["React", "UI/UX"] },
    { title: "Mobile App UI", type: "Remote", skills: ["Figma", "UI/UX"] },
    { title: "Node.js API Integration", type: "Remote", skills: ["Node.js", "Express"] },
    { title: "Portfolio Website", type: "Remote", skills: ["HTML", "CSS", "JavaScript"] },
    { title: "E-commerce Frontend", type: "Remote", skills: ["React", "Redux"] },
    { title: "Dashboard UI", type: "Remote", skills: ["React", "Tailwind"] }
  ];

  // --- Sidebar ---
  const navItems = [
    { key: "registration", label: "Registration", icon: FileText },
    { key: "profile", label: "Profile", icon: User },
    { key: "matches", label: "Job Matches", icon: Briefcase },
    { key: "training", label: "Training", icon: GraduationCap },
    { key: "freelance", label: "Freelance", icon: PenTool },
  ];

  const Sidebar = () => (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-900 text-white shadow-lg transition-all duration-300 z-50 
      ${sidebarOpen ? "w-64" : "w-16"}`}
    >
      <div className="flex items-center justify-between p-4">
        <span className={`font-bold text-lg transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0"}`}>
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

  // --- Wrapper with background ---
  const renderWithBackground = (content: React.ReactNode) => (
    <div style={backgroundStyle} className={`p-6 transition-all ${sidebarOpen ? "ml-64" : "ml-16"}`}>
      <div className={contentOverlay}>{content}</div>
    </div>
  );

  // --- Views ---
  const renderRegistration = () => (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card className="border-2 border-dashed">
        <CardHeader>
          <CardTitle>Job Seeker Registration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="First Name" defaultValue={dummyProfile.firstName} />
            <Input placeholder="Last Name" defaultValue={dummyProfile.lastName} />
          </div>
          <Input placeholder="Email" defaultValue={dummyProfile.email} />
          <Input placeholder="Password" type="password" />
          <Input placeholder="Phone" defaultValue={dummyProfile.phone} />
          <Button className="w-full">Create Account</Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderProfile = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-2 border-dashed">
            <CardContent className="p-6 text-center">
              <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto mb-4" />
              <h3 className="font-bold text-lg">{dummyProfile.firstName} {dummyProfile.lastName}</h3>
              <p className="text-sm text-gray-600 mb-4">{dummyProfile.email}</p>
              <Button size="sm">Upload Photo</Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed">
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={dummyProfile.profileCompletion} className="mb-2" />
              <p className="text-sm">{dummyProfile.profileCompletion}% Completed</p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2 border-dashed">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Location" defaultValue={dummyProfile.location} />
                <Input placeholder="Experience Level" defaultValue={dummyProfile.experienceLevel} />
              </div>
              <textarea
                placeholder="Bio/Summary"
                className="w-full h-24 p-3 border rounded resize-none"
                defaultValue={dummyProfile.bio}
              />
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed">
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {dummyProfile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
              <Input placeholder="Add skill" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderJobMatches = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="border-2 border-dashed">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Location" />
              <Input placeholder="Salary Range" />
              <Input placeholder="Job Type" />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {dummyJobs.map((job, idx) => (
            <Card key={idx} className="border-2 border-dashed">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <h3 className="font-bold">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.company}</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{job.salary}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{job.match}% Match</Badge>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button size="sm" variant="outline">Save</Button>
                  <Button size="sm">Apply</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTraining = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2 border-dashed">
            <CardHeader>
              <CardTitle>Available Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dummyCourses.map((course, idx) => (
                  <Card key={idx} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="h-32 w-full bg-gray-200 rounded mb-4" />
                      <h4 className="font-semibold">{course.title}</h4>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{course.hours} hrs</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{course.rating}</span>
                        </div>
                      </div>
                      <Button size="sm" className="w-full">Enroll</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="border-2 border-dashed">
            <CardHeader>
              <CardTitle>My Learning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dummyProfile.courses.map((c, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="text-sm">{c.title}</div>
                  <Progress value={c.progress} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed">
            <CardHeader>
              <CardTitle>Certificates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dummyProfile.certificates.map((cert, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                  <div className="space-y-1">
                    <div className="text-sm">{cert}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderFreelance = () => (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dummyFreelanceGigs.map((gig, idx) => (
          <Card key={idx} className="border-2 border-dashed">
            <CardContent className="p-4">
              <h4 className="font-semibold">{gig.title}</h4>
              <Badge variant="outline">{gig.type}</Badge>
              <div className="flex space-x-2 mt-2 mb-3">
                {gig.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                ))}
              </div>
              <Button size="sm" className="w-full">Apply</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // --- Switch Views ---
  const renderSwitch = () => {
    switch (activeView) {
      case "registration":
        return renderWithBackground(renderRegistration());
      case "profile":
        return renderWithBackground(renderProfile());
      case "matches":
        return renderWithBackground(renderJobMatches());
      case "training":
        return renderWithBackground(renderTraining());
      case "freelance":
        return renderWithBackground(renderFreelance());
      default:
        return renderWithBackground(renderJobMatches());
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">{renderSwitch()}</div>
    </div>
  );
}
