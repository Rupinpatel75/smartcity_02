import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  LayoutDashboard, 
  FileText, 
  Users, 
  Map, 
  LogOut, 
  Bell,
  Settings,
  X
} from "lucide-react";
import { useLocation } from "wouter";

interface MobileAdminLayoutProps {
  children: React.ReactNode;
}

export function MobileAdminLayout({ children }: MobileAdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Complaints", href: "/admin/complaints", icon: FileText },
    { name: "Employees", href: "/admin/employees", icon: Users },
    { name: "City Map", href: "/admin/map", icon: Map },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLocation("/admin/login");
  };

  const handleNavigation = (href: string) => {
    setLocation(href);
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">SC</span>
                        </div>
                        <div>
                          <h2 className="text-sm font-semibold text-gray-900">SmartCity Admin</h2>
                          <p className="text-xs text-gray-600">{user.city}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="p-1">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <nav className="flex-1 p-4 space-y-2">
                    {navigation.map((item) => {
                      const isActive = location === item.href;
                      return (
                        <button
                          key={item.name}
                          onClick={() => handleNavigation(item.href)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.name}
                        </button>
                      );
                    })}
                  </nav>

                  <div className="p-4 border-t border-gray-200 space-y-3">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-blue-600 font-semibold text-sm">
                          {user.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{user.username}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                      <Badge variant="secondary" className="mt-1 text-xs">Admin</Badge>
                    </div>
                    <Button variant="outline" onClick={handleLogout} className="w-full text-sm">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="h-6 w-6 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">SC</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-900">Admin Panel</h1>
              <p className="text-xs text-gray-600">{user.city} City</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="p-2 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-40">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">SC</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">SmartCity Admin</h2>
                <p className="text-sm text-gray-600">{user.city} City Management</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => setLocation(item.href)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </button>
              );
            })}
          </nav>

          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {user.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
                <p className="text-xs text-gray-600 truncate">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8">
        {children}
      </main>
    </div>
  );
}