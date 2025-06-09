import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  FileText,
  Map,
  Briefcase,
  UserPlus,
  MessageSquare,
  FileBarChart,
  Settings,
  LogOut,
} from "lucide-react";
import logo from "../../assets/logo.png";

export function AdminSidebar() {
  const [location] = useLocation();
  const { openMobile, setOpenMobile } = useSidebar();

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
  
  
    {
      title: "View Employees",
      href: "/admin/employees",
      icon: Users,
    },
    {
      title: "Assign Task",
      href: "/admin/assign-task",
      icon: FileText,
    },
    {
      title: "Add Employee",
      href: "/admin/add-employee",
      icon: UserPlus,
    },
    {
      title: "Manage Complain",
      href: "/admin/mange-complani",
      icon: MessageSquare,
    },
    {
      title: "Generate Reports",
      href: "/admin/reports",
      icon: FileBarChart,
    },
    {
      title: "View Map",
      href: "/admin/map",
      icon: Map,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {openMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpenMobile(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
"fixed inset-y-0 left-0 z-[100] w-64 border-r bg-background transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
      openMobile ? "translate-x-0" : "-translate-x-full",
      "block" // Always show the container
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          {/* <div className="p-4 border-b flex items-center gap-2">
            <img src={logo} alt="SmartCity" className="h-8 w-8" />
            <span className="text-lg font-semibold">SmartCity Admin</span>
          </div> */}

          {/* Nav Items */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                    location === item.href
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                  onClick={() => setOpenMobile(false)}
                >
                  <item.icon
                    className={cn("h-5 w-5", location === item.href ? "text-sidebar-accent-foreground" : "")}
                  />
                  {item.title}
                </a>
              </Link>
            ))}

            {/* Sign Out */}
            <Link href="/admin/logout">
              <a
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-sidebar-accent/50"
                onClick={() => setOpenMobile(false)}
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </a>
            </Link>
          </nav>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
