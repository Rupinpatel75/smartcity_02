import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ClipboardList, 
  MapPin, 
  Settings, 
  LogOut,
  User,
  CheckSquare,
  Clock,
  AlertTriangle
} from "lucide-react";
import smartCityLogo from "../../assets/smartcity-logo.png";

interface EmployeeLayoutProps {
  children: ReactNode;
}

export function EmployeeLayout({ children }: EmployeeLayoutProps) {
  const [location] = useLocation();
  
  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.clear(); // Clear any other stored data
    
    // Force redirect to home page
    window.location.replace("/");
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const navItems = [
    {
      href: "/employee/dashboard",
      icon: ClipboardList,
      label: "My Assignments",
      description: "Cases assigned to me"
    },
    {
      href: "/employee/map",
      icon: MapPin,
      label: "Field Map",
      description: "Navigate to locations"
    },
    {
      href: "/employee/settings",
      icon: Settings,
      label: "Settings",
      description: "Account preferences"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-2 rounded-lg shadow-sm border">
              <img 
                src={smartCityLogo} 
                alt="SmartCity Logo" 
                className="h-16 w-16 object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Field Worker Portal</h1>
              <p className="text-base text-gray-600">{user.city} - Assignment Management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.username}</p>
              <Badge variant="secondary" className="text-xs">Field Employee</Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r border-gray-200 min-h-screen p-6">
          <nav className="space-y-3">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Card className={`cursor-pointer transition-all hover:bg-gray-50 ${
                    isActive ? 'ring-2 ring-green-500 bg-green-50' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          isActive ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            isActive ? 'text-green-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <p className={`font-medium ${
                            isActive ? 'text-green-900' : 'text-gray-900'
                          }`}>
                            {item.label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </nav>

          {/* Quick Status Actions */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start text-orange-700 border-orange-200 hover:bg-orange-50">
                <Clock className="h-4 w-4 mr-2" />
                Mark In Progress
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-green-700 border-green-200 hover:bg-green-50">
                <CheckSquare className="h-4 w-4 mr-2" />
                Mark Resolved
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-red-700 border-red-200 hover:bg-red-50">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
            </div>
          </div>

          {/* Work Status Summary */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Today's Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Tasks:</span>
                <Badge variant="destructive" className="text-xs">3</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">In Progress:</span>
                <Badge variant="secondary" className="text-xs">1</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed:</span>
                <Badge variant="default" className="text-xs">2</Badge>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}