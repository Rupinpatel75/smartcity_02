import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  Wrench, 
  FileText, 
  Map, 
  LogOut, 
  Bell,
  Settings,
  X,
  Clock,
  CheckCircle
} from "lucide-react";
import { useLocation } from "wouter";
import logoPath from "@assets/logo_1749612230002.png";

interface MobileEmployeeLayoutProps {
  children: React.ReactNode;
}

export function MobileEmployeeLayout({ children }: MobileEmployeeLayoutProps) {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const navigation = [
    { name: "My Assignments", href: "/employee/dashboard", icon: Wrench },
    { name: "All Cases", href: "/employee/cases", icon: FileText },
    { name: "Field Map", href: "/employee/map", icon: Map },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLocation("/employee/login");
  };

  const handleNavigation = (href: string) => {
    setLocation(href);
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Menu */}
          <div className="flex items-center gap-3">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="flex flex-col h-full">
                  {/* Sidebar Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={logoPath} alt="SmartCity" className="h-8 w-8" />
                        <div>
                          <h2 className="text-sm font-semibold text-gray-900">Field Worker</h2>
                          <p className="text-xs text-gray-600">SmartCity Employee</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(false)}
                        className="p-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Navigation */}
                  <nav className="flex-1 p-4 space-y-2">
                    {navigation.map((item) => {
                      const isActive = location === item.href;
                      return (
                        <button
                          key={item.name}
                          onClick={() => handleNavigation(item.href)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-orange-50 text-orange-700 border border-orange-200"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.name}
                        </button>
                      );
                    })}
                  </nav>

                  {/* Quick Actions */}
                  <div className="p-4 border-t border-gray-200 space-y-3">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Start Work
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Button>
                    </div>
                  </div>

                  {/* User Info & Logout */}
                  <div className="p-4 border-t border-gray-200 space-y-3">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-orange-600 font-semibold text-sm">
                          {user.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{user.username}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        Field Worker
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full text-sm"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <img src={logoPath} alt="SmartCity" className="h-6 w-6" />
            <div>
              <h1 className="text-sm font-semibold text-gray-900">Field Worker</h1>
              <p className="text-xs text-gray-600">SmartCity Employee</p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="p-2 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-orange-500 rounded-full"></span>
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 pb-20">
        {children}
      </main>

      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-40">
        <div className="flex flex-col h-full">
          {/* Desktop Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img src={logoPath} alt="SmartCity" className="h-10 w-10" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Field Worker</h2>
                <p className="text-sm text-gray-600">SmartCity Employee Portal</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => setLocation(item.href)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-orange-50 text-orange-700 border border-orange-200"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Desktop Quick Actions */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="h-4 w-4 mr-2" />
                Start Work Day
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Task
              </Button>
            </div>
          </div>

          {/* Desktop User Info */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-semibold">
                  {user.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
                <p className="text-xs text-gray-600 truncate">{user.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop content offset */}
      <div className="hidden lg:block lg:ml-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}