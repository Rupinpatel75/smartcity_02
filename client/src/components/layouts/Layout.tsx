// Navbar Component
import { Link } from "wouter";
import logo from "../../assets/logo.png";
import { Home, MapPin, FilePlus } from "lucide-react";
import { useState, ReactNode } from "react"; // Import ReactNode for TypeScript

interface LayoutProps {
  children: ReactNode; // Children prop type
}

// Navbar Component
export function Navbar() {
  return (
    <nav className="border-b bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <img src={logo} alt="SmartCity" className="h-10 w-10" />
            <span className="ml-2 text-xl font-semibold">SmartCity</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <a className="text-sm text-gray-600 hover:text-gray-900">
                Dashboard
              </a>
            </Link>
            <Link href="/map">
              <a className="text-sm text-gray-600 hover:text-gray-900">Map</a>
            </Link>
            <Link href="/report">
              <a className="text-sm text-gray-600 hover:text-gray-900">
                Create a Report
              </a>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Sidebar Component
export function Sidebar() {
  const [active, setActive] = useState<string>("dashboard");

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white fixed">
      <div className="p-6 text-xl font-bold">SmartCity</div>
      <nav>
        <ul className="space-y-4">
          <li>
            <button
              className={`flex items-center p-3 rounded-lg ${
                active === "dashboard" ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
              onClick={() => setActive("dashboard")}
            >
              <Home className="mr-3" /> Dashboard
            </button>
          </li>
          <li>
            <button
              className={`flex items-center p-3 rounded-lg ${
                active === "map" ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
              onClick={() => setActive("map")}
            >
              <MapPin className="mr-3" /> Map
            </button>
          </li>
          <li>
            <button
              className={`flex items-center p-3 rounded-lg ${
                active === "report" ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
              onClick={() => setActive("report")}
            >
              <FilePlus className="mr-3" /> Create Report
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

// Layout Wrapper Component
export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
      <div className="flex-1">
        {/* Navbar */}
        <Navbar />
        <main className="p-4 bg-gray-100 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
