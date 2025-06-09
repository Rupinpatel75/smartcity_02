import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Settings() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone_no: "",
    city: ""
  });

  // Fetch logged-in user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
  
        const response = await fetch("http://localhost:5000/api/v1/user/me", {
          method: "GET",
          credentials: "include",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });
  
        if (!response.ok) throw new Error("Failed to fetch user");
  
        const data = await response.json();
        setUser(data); // ✅ Update the state
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
  
    fetchUser();
  }, []); 
  
  

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setUser((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value.trim(),
    }));
  };

  // Save updated user details
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not authenticated! Please log in again.");
        return;
      }
  
      // ✅ Send only necessary fields
      const updateData = {
        username: user.username,
        email: user.email,
        phone_no: user.phone_no,
        city: user.city,
      };
  
      console.log("Sending Data:", updateData);
  
      const response = await fetch("http://localhost:5000/api/v1/user/update", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });
  
      const data = await response.json();
      console.log("API Response:", data);
  
      if (!response.ok) throw new Error("Failed to update user");
  
      // ✅ Fetch updated user data after update
      fetchUser();  
  
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      const response = await fetch("http://localhost:5000/api/v1/user/me", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) throw new Error("Failed to fetch user");
  
      const data = await response.json();
      setUser(data); // ✅ Update state with latest user data
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  
  // Fetch user on component mount
  useEffect(() => {
    fetchUser();
  }, []);
  
  

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="username" value={user.username} onChange={handleChange} placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email} onChange={handleChange} placeholder="your@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone_no" type="tel" value={user.phone_no} onChange={handleChange} placeholder="Your phone number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={user.city} onChange={handleChange} placeholder="Your city" />
            </div>
            <Button onClick={handleSubmit}>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <input type="checkbox" id="emailNotifications" />
                <span>Email Notifications</span>
              </Label>
              <Label className="flex items-center space-x-2">
                <input type="checkbox" id="pushNotifications" />
                <span>Push Notifications</span>
              </Label>
            </div>
            <Button onClick={handleSubmit}>Update Preferences</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
