import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Users, Building, Shield, Heading } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import "../App.css";

export function LandingWireframe() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('')" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold text-blue-600"><b color="#1E1E1E">Job Mart</b></h1>
        <div className="flex space-x-6">
          <Button variant="ghost" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button variant="outline" onClick={() => navigate("/register")}>
            Register
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg shadow">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Your Bridge to Opportunity
        </h1>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          Whether you’re a job seeker or an employer, Job Mart helps bridge
          the gap by connecting top talent with leading companies.
        </p>
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md"
          onClick={() => navigate("/register")}
        >
          Get Started
        </Button>
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Job Seeker */}
        <Card className="shadow-md hover:shadow-xl transition">
          <CardHeader className="text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-blue-500" />
            <CardTitle className="text-xl">Job Seekers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-600 text-center">
            <p>
              Over <span className="font-bold text-blue-600">10,000+</span>{" "}
              active job seekers are finding opportunities daily.
            </p>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </CardContent>
        </Card>

        {/* Employer */}
        <Card className="shadow-md hover:shadow-xl transition">
          <CardHeader className="text-center">
            <Building className="h-12 w-12 mx-auto mb-4 text-purple-500" />
            <CardTitle className="text-xl">Employers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-600 text-center">
            <p>
              Trusted by <span className="font-bold text-purple-600">500+</span>{" "}
              companies hiring top talent across Uganda.
            </p>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </CardContent>
        </Card>

        {/* Admin / Government */}
        <Card className="shadow-md hover:shadow-xl transition">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <CardTitle className="text-xl">Admin/Government</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-600 text-center">
            <p>
              We aid governments to monitor employment stats and support workforce growth with{" "}
              <span className="font-bold text-green-600">real-time data</span>.
            </p>
          
          </CardContent>
        </Card>
      </div>

      {/* Partners / Extra Section */}
      <div className="bg-gray-50 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-center text-gray-800 mb-6">
          Our Partners
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Google", "Microsoft", "MTN Uganda", "SafeBoda"].map((partner, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto flex items-center justify-center text-gray-500 font-bold">
                {partner[0]}
              </div>
              <p className="text-gray-700 font-medium">{partner}</p>
              <p className="text-xs text-gray-500">Partner since {2015 + i}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
