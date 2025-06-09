import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import logo from "../../assets/logo.png";

export function HomeNavbar() {
  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <img src={logo} alt="SmartCity" className="h-10 w-10" />
            <span className="ml-2 text-xl font-semibold">SmartCity</span>
          </div>
          <div className="flex items-center space-x-4">
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
              <Button variant="outline">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}