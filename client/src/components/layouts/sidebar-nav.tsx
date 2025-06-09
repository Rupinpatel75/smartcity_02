import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  Gift,
  Settings,
  LogOut,
} from "lucide-react";
import logo from "../../assets/logo.png";
const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
  },
  {
    name: "Cases",
    href: "/cases",
    icon: FileText,
  },
  {
    name: "Case Report",
    href: "/report",
    icon: FileText,
  },
  {
    name: "Rewards",
    href: "/rewards",
    icon: Gift,
  },
];

export function SidebarNav() {
  const [location] = useLocation();

  return (
    <div className="flex flex-col min-h-screen w-64 border-r bg-background">
      <div className="p-6 flex-1">
        <div className="flex items-center mb-8">
          <img src={logo}  alt="SmartCity" className="h-10 w-10" />
          <span className="ml-2 text-xl font-semibold">SmartCity</span>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                    location === item.href ? "bg-accent" : "transparent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </a>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t">
        <Link href="/settings">
          <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent">
            <Settings className="h-4 w-4" />
            Settings
          </a>
        </Link>
        <Link href="/logout">
          <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent text-red-500">
            <LogOut className="h-4 w-4" />
            Sign Out
          </a>
        </Link>
      </div>

      <div className="p-6 border-t">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/10" />
          <div className="ml-3">
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-muted-foreground">admin@smartcity.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}