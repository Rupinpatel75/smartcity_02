import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  LayoutDashboard, 
  Users, 
  FileText, 
  MapPin, 
  Settings, 
  LogOut,
  User,
  ClipboardList,
  Menu,
  X
} from "lucide-react";
import smartCityLogo from "../../assets/smartcity-logo.png";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      description: "Overview & statistics"
    },
    {
      href: "/admin/complaints",
      icon: FileText,
      label: "Manage Complaints",
      description: "View & assign cases"
    },
    {
      href: "/admin/employees",
      icon: Users,
      label: "Employees",
      description: "Manage your team"
    },
    {
      href: "/admin/map",
      icon: MapPin,
      label: "City Map",
      description: "Visual complaint tracking"
    },
    {
      href: "/admin/settings",
      icon: Settings,
      label: "Settings",
      description: "Account & preferences"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="bg-white p-1 rounded-lg shadow-sm border">
              <img 
                src={smartCityLogo} 
                alt="SmartCity Logo" 
                className="h-8 w-8 object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin Portal</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-gray-900">{user.username}</p>
              <Badge variant="default" className="text-xs">Admin</Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="p-2"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 hidden lg:block">
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
              <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
              <p className="text-base text-gray-600">{user.city} City Management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.username}</p>
              <Badge variant="default" className="text-xs">Administrator</Badge>
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

      <div className="flex relative">
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={cn(
          "bg-white border-r border-gray-200 min-h-screen p-4 lg:p-6 transition-transform duration-300 ease-in-out z-50",
          "fixed lg:static inset-y-0 left-0 w-72 lg:w-80",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <nav className="space-y-3">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Card className={`cursor-pointer transition-all hover:bg-gray-50 ${
                    isActive ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <CardContent className="p-3 lg:p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          isActive ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={`h-4 w-4 lg:h-5 lg:w-5 ${
                            isActive ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm lg:text-base font-medium ${
                            isActive ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {item.label}
                          </p>
                          <p className="text-xs text-gray-500 hidden lg:block">
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

          {/* Quick Actions - Hidden on mobile for space */}
          <div className="mt-6 lg:mt-8 hidden lg:block">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/admin/employees">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </Link>
              <Link href="/admin/complaints">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Assign Task
                </Button>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-3 lg:p-6 lg:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
}