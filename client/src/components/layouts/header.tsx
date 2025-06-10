import { Link } from "wouter";
import logo from '../../assets/logo.png';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/components/ui/sidebar";


export function Header() {
  const { user, logout } = useAuth();
  const { setOpenMobile } = useSidebar();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="border-b">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="mr-2 px-2 md:hidden"
            onClick={() => setOpenMobile(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/dashboard">
            <div className="flex items-center gap-2">
              <img src={logo} alt="SmartCity" className="h-10 w-10" />
              <span className="text-xl font-semibold hidden sm:inline-block">SmartCity</span>
            </div>
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          <Link href="/dashboard">
            <span className="text-sm font-medium transition-colors hover:text-primary">Dashboard</span>
          </Link>
          <Link href="/map">
            <span className="text-sm font-medium transition-colors hover:text-primary">Map</span>
          </Link>
          <Link href="/report">
            <span className="text-sm font-medium transition-colors hover:text-primary">Create a report</span>
          </Link>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar>
                  <AvatarImage src="/avatar.png" alt={user?.username || "User"} />
                  <AvatarFallback>{user?.username?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-sm">
                  <p className="font-medium">{user?.username || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user?.role === 'admin' ? 'Administrator' : 'Citizen'}</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}