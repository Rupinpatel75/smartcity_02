import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  Home, 
  Users, 
  FileText, 
  Map, 
  LogOut,
  Shield,
  X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    name: "View Employees", 
    href: "/admin/employees",
    icon: Users,
  },
  {
    name: "View Cases",
    href: "/admin/complaints", 
    icon: FileText,
  },
  {
    name: "Map View",
    href: "/admin/map",
    icon: Map,
  },
];

export function AdminNavigation() {
  const [location] = useLocation();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-md"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-4 w-4 mr-2" />
        Menu
      </Button>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <div className="flex h-full flex-col bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-lg font-semibold">Admin Panel</h1>
                  <p className="text-sm text-gray-600">{user?.username}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 px-4 py-6">
              {navigation.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <a
                      className={`
                        flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors
                        ${isActive
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </a>
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="border-t p-4">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:border-r md:border-gray-200 md:bg-white md:shadow-sm z-40">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center gap-2 px-6 py-4 border-b">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-lg font-semibold">Admin Panel</h1>
              <p className="text-sm text-gray-600">{user?.username}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-4 py-6">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={`
                      flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors
                      ${isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }
                    `}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </a>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t p-4">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}