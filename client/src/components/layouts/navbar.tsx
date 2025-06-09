// Navbar.jsx
import { Bell, User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h2 className="text-xl font-bold">Dashboard</h2>

      <div className="flex gap-4 items-center">
        <Bell className="cursor-pointer hover:text-blue-500" />
        <User className="cursor-pointer hover:text-blue-500" />
      </div>
    </nav>
  );
}
