import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  LineChart,
  Award,
  Settings,
  LogOut,
  FileText,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

interface SidebarProps {
  isAdmin?: boolean;
}

const adminNavItems = [
  { href: "/admin/dashboard", title: "Admin Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", title: "Users", icon: Users },
  { href: "/admin/reports", title: "Reports", icon: FileText },
  { href: "/admin/settings", title: "Settings", icon: Settings },
];

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "Cases",
    href: "/cases",
    icon: Briefcase,
  },
  {
    title: "Case Report",
    href: "/case-report",
    icon: LineChart,
  },
  {
    title: "Rewards",
    href: "/rewards",
    icon: Award,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar({ isAdmin }: SidebarProps) {
  const [location] = useLocation();
  const { openMobile, setOpenMobile, toggleSidebar } = useSidebar();

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    setOpenMobile(false);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {openMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={handleOverlayClick}
        />
      )}
      <aside className={cn(
      "fixed inset-y-0 left-0 z-[100] w-64 border-r bg-background transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
      openMobile ? "translate-x-0" : "-translate-x-full",
      "block" // Always show the container
    )}>
      <div className="flex flex-col h-full">
        <div className="flex-1 py-4">
          <nav className="grid items-start px-4 gap-2">
            {(isAdmin ? adminNavItems : navItems).map((item, index) => {
              const isActive = location === item.href;
              const IconComponent = item.icon;

              return (
                <Link 
                  href={item.href} 
                  key={index}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <IconComponent className={cn("h-5 w-5", isActive ? "text-primary" : "")} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t">
          <Link 
            href="/logout"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </Link>
        </div>
      </div>
    </aside>
    </>
  );
}