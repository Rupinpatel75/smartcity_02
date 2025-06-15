import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function Settings() {
  const { user: authUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    phoneNo: "",
    city: "",
    state: "gujarat"
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["/api/v1/user/me"],
    enabled: !!authUser,
  });

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        username: (userProfile as any).username || "",
        email: (userProfile as any).email || "",
        phoneNo: (userProfile as any).phoneNo || "",
        city: (userProfile as any).city || "",
        state: (userProfile as any).state || "gujarat"
      });
    }
  }, [userProfile]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/v1/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/user/me"] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/v1/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to change password");
      return response.json();
    },
    onSuccess: () => {
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive",
      });
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };
  
  

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Full Name</Label>
                <Input
                  id="username"
                  value={profileData.username}
                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNo">Mobile Number</Label>
                <Input
                  id="phoneNo"
                  type="tel"
                  value={profileData.phoneNo}
                  onChange={(e) => setProfileData({ ...profileData, phoneNo: e.target.value })}
                  placeholder="10-digit mobile number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select
                  value={profileData.city}
                  onValueChange={(value) => setProfileData({ ...profileData, city: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                    <SelectItem value="surat">Surat</SelectItem>
                    <SelectItem value="vadodara">Vadodara</SelectItem>
                    <SelectItem value="rajkot">Rajkot</SelectItem>
                    <SelectItem value="bhavnagar">Bhavnagar</SelectItem>
                    <SelectItem value="jamnagar">Jamnagar</SelectItem>
                    <SelectItem value="junagadh">Junagadh</SelectItem>
                    <SelectItem value="gandhinagar">Gandhinagar</SelectItem>
                    <SelectItem value="anand">Anand</SelectItem>
                    <SelectItem value="morbi">Morbi</SelectItem>
                    <SelectItem value="nadiad">Nadiad</SelectItem>
                    <SelectItem value="surendranagar">Surendranagar</SelectItem>
                    <SelectItem value="bharuch">Bharuch</SelectItem>
                    <SelectItem value="mehsana">Mehsana</SelectItem>
                    <SelectItem value="bhuj">Bhuj</SelectItem>
                    <SelectItem value="porbandar">Porbandar</SelectItem>
                    <SelectItem value="palanpur">Palanpur</SelectItem>
                    <SelectItem value="valsad">Valsad</SelectItem>
                    <SelectItem value="vapi">Vapi</SelectItem>
                    <SelectItem value="veraval">Veraval</SelectItem>
                    <SelectItem value="godhra">Godhra</SelectItem>
                    <SelectItem value="patan">Patan</SelectItem>
                    <SelectItem value="kalol">Kalol</SelectItem>
                    <SelectItem value="dahod">Dahod</SelectItem>
                    <SelectItem value="botad">Botad</SelectItem>
                    <SelectItem value="amreli">Amreli</SelectItem>
                    <SelectItem value="deesa">Deesa</SelectItem>
                    <SelectItem value="jetpur">Jetpur</SelectItem>
                    <SelectItem value="sidhpur">Sidhpur</SelectItem>
                    <SelectItem value="wankaner">Wankaner</SelectItem>
                    <SelectItem value="padra">Padra</SelectItem>
                    <SelectItem value="mangrol">Mangrol</SelectItem>
                    <SelectItem value="visnagar">Visnagar</SelectItem>
                    <SelectItem value="upleta">Upleta</SelectItem>
                    <SelectItem value="una">Una</SelectItem>
                    <SelectItem value="talaja">Talaja</SelectItem>
                    <SelectItem value="mahuva">Mahuva</SelectItem>
                    <SelectItem value="modasa">Modasa</SelectItem>
                    <SelectItem value="lunawada">Lunawada</SelectItem>
                    <SelectItem value="thangadh">Thangadh</SelectItem>
                    <SelectItem value="vyara">Vyara</SelectItem>
                    <SelectItem value="mandvi">Mandvi</SelectItem>
                    <SelectItem value="petlad">Petlad</SelectItem>
                    <SelectItem value="kapadvanj">Kapadvanj</SelectItem>
                    <SelectItem value="umreth">Umreth</SelectItem>
                    <SelectItem value="dholka">Dholka</SelectItem>
                    <SelectItem value="disa">Disa</SelectItem>
                    <SelectItem value="salaya">Salaya</SelectItem>
                    <SelectItem value="limbdi">Limbdi</SelectItem>
                    <SelectItem value="dhrangadhra">Dhrangadhra</SelectItem>
                    <SelectItem value="rajula">Rajula</SelectItem>
                    <SelectItem value="morvi">Morvi</SelectItem>
                    <SelectItem value="wadhwan">Wadhwan</SelectItem>
                    <SelectItem value="chotila">Chotila</SelectItem>
                    <SelectItem value="halvad">Halvad</SelectItem>
                    <SelectItem value="dhrol">Dhrol</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={updateProfileMutation.isPending}
              className="w-full md:w-auto"
            >
              {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Enter current password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Enter new password (min 8 characters)"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={changePasswordMutation.isPending}
              className="w-full md:w-auto"
              variant="outline"
            >
              {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Account Type:</span>
                <span className="text-sm font-medium capitalize">
                  {userProfile?.role === 'admin' ? 'Administrator' : 
                   userProfile?.role === 'employee' ? 'Employee' : 'Citizen'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Current City:</span>
                <span className="text-sm font-medium capitalize">{userProfile?.city || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">State:</span>
                <span className="text-sm font-medium">Gujarat</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Points Balance:</span>
                <span className="text-sm font-medium">{userProfile?.points || 0} points</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Mobile Number:</span>
                <span className="text-sm font-medium">{userProfile?.phoneNo || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email:</span>
                <span className="text-sm font-medium text-xs">{userProfile?.email || 'Not provided'}</span>
              </div>
            </div>
          </div>
          
          {userProfile?.role === 'citizen' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-1">City Administration</h4>
              <p className="text-xs text-blue-600">
                Your complaints are managed by {userProfile?.city ? `${userProfile.city.charAt(0).toUpperCase() + userProfile.city.slice(1)} City Administration` : 'your city administration'}. 
                You can change your city above if you've moved.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
