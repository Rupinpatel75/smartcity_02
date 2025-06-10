import { ReactNode } from "react";
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
  ClipboardList
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Admin Portal</h1>
              <p className="text-sm text-gray-600">{user.city} City Management</p>
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
                    isActive ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          isActive ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            isActive ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <p className={`font-medium ${
                            isActive ? 'text-blue-900' : 'text-gray-900'
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

          {/* Quick Actions */}
          <div className="mt-8">
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
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}