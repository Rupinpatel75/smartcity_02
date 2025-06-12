import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  MapPin,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import smartCityLogo from "../../assets/smartcity-logo.png";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.clear();
    window.location.replace("/");
  };

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Manage Complaints",
      href: "/admin/complaints",
      icon: FileText,
    },
    {
      title: "Employees",
      href: "/admin/employees",
      icon: Users,
    },
    {
      title: "City Map",
      href: "/admin/map",
      icon: MapPin,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="bg-white border-b px-4 py-3 lg:hidden">
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
            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 p-1 rounded-lg">
                <img 
                  src={smartCityLogo} 
                  alt="SmartCity Logo" 
                  className="h-6 w-6 object-contain"
                />
              </div>
              <h1 className="text-lg font-bold text-blue-600">Admin Portal</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <div className="flex flex-col h-full">
            {/* Logo section - only visible on desktop */}
            <div className="hidden lg:flex items-center p-6 border-b">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <img 
                    src={smartCityLogo} 
                    alt="SmartCity Logo" 
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <h1 className="text-xl font-bold text-blue-600">Admin Portal</h1>
              </div>
            </div>
            
            <div className="flex-1 py-4">
              <nav className="grid items-start px-4 gap-2">
                {navItems.map((item, index) => {
                  const isActive = location === item.href;
                  const IconComponent = item.icon;

                  return (
                    <Link 
                      href={item.href} 
                      key={index}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                        isActive
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <IconComponent className={cn("h-5 w-5", isActive ? "text-blue-700" : "")} />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            <div className="p-4 border-t">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 w-full"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}