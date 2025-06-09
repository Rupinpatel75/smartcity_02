import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Search, Map, MessageSquare, Users, Menu, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ArrowRight } from "lucide-react";
import logo from "../assets/logo.png";
import heroillustration from "../assets/hero-illustration.png";
import { useState } from "react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="border-b sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <img src={logo} alt="SmartCity" className="h-8 w-8 sm:h-10 sm:w-10" />
              <span className="ml-2 text-lg sm:text-xl font-semibold">SmartCity</span>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/dashboard">
                <a className="text-sm text-gray-600 hover:text-gray-900">Dashboard</a>
              </Link>
              <Link href="/map">
                <a className="text-sm text-gray-600 hover:text-gray-900">Map</a>
              </Link>
              <Link href="/report">
                <a className="text-sm text-gray-600 hover:text-gray-900">Create a report</a>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="hidden sm:inline-flex">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button className="hidden sm:inline-flex">Sign up</Button>
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link href="/dashboard">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                    Dashboard
                  </a>
                </Link>
                <Link href="/map">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                    Map
                  </a>
                </Link>
                <Link href="/report">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                    Create a report
                  </a>
                </Link>
                <Link href="/login">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                    Log in
                  </a>
                </Link>
                <Link href="/signup">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                    Sign up
                  </a>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8">
              <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between">
                <div className="lg:w-1/2 space-y-4 sm:space-y-6">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                    Report infrastructure issues, improve your community
                  </h1>
                  <p className="mt-3 text-base sm:text-lg md:text-xl text-gray-500">
                    Our app makes it easy to report infrastructure issues and connect with your community.
                  </p>
                  <div className="mt-5 sm:mt-8">
                    <Link href="/report">
                      <Button size="lg" className="w-full sm:w-auto px-8 py-3 text-lg">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="mt-12 lg:mt-0 lg:w-1/2">
                  <img
                    className="w-full object-contain h-64 sm:h-72 md:h-96 lg:h-full"
                    src={heroillustration}
                    alt="City illustration"
                  />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How it works</h2>
          </div>
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-medium">{feature.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: <Search className="h-6 w-6" />,
    title: "Report Issues",
    description: "Snap a photo and provide details about the issue"
  },
  {
    icon: <Map className="h-6 w-6" />,
    title: "Explore Map",
    description: "Check out reports from other users"
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Community Chat",
    description: "Join local groups to stay updated on issues"
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Volunteer",
    description: "Help your neighbors by volunteering"
  }
];