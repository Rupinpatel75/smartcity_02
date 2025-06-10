
import { useState } from "react";
import { AdminLayout } from "@/components/layouts/admin-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type User = {
  id: number;
  username: string;
  email: string;
  phoneNo: string;
  city: string;
  state: string;
  isAdmin: boolean;
  points?: number;
};

export default function ViewEmployees() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["/api/v1/admin/users"],
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      return apiRequest(`/api/v1/admin/users/${userId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/admin/users"] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  const toggleAdminMutation = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: number; isAdmin: boolean }) => {
      return apiRequest(`/api/v1/admin/users/${userId}/toggle-admin`, {
        method: "PATCH",
        body: JSON.stringify({ isAdmin }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/admin/users"] });
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    },
  });

  const filteredUsers = Array.isArray(users) ? users.filter((user: User) => {
    const matchesSearch = user.username.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                         user.phoneNo.includes(searchKeyword);
    const matchesRole = selectedRole === "All Roles" || 
                       (selectedRole === "Admin" && user.isAdmin) ||
                       (selectedRole === "Citizen" && !user.isAdmin);
    return matchesSearch && matchesRole;
  }) : [];

  const handleDelete = (userId: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleToggleAdmin = (userId: number, currentAdmin: boolean) => {
    toggleAdminMutation.mutate({ userId, isAdmin: !currentAdmin });
  };

  return (
  
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">User Management</h1>
          <Link href="/admin/add-employee">
            <Button variant="default">+ Add User</Button>
          </Link>
        </div>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email or mobile number"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          <div className="w-48">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Roles">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Citizen">Citizen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Showing {filteredUsers.length} of {Array.isArray(users) ? users.length : 0} Users
          </p>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile Number</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">No users found</TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell>#{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phoneNo}</TableCell>
                    <TableCell>{user.city}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.isAdmin ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.isAdmin ? 'Admin' : 'Citizen'}
                      </span>
                    </TableCell>
                    <TableCell>{user.points || 0}</TableCell>
                    <TableCell className="space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
                        disabled={toggleAdminMutation.isPending}
                      >
                        {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        disabled={deleteUserMutation.isPending}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex justify-center gap-2 mt-4">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Button variant="outline" disabled>
              1
            </Button>
            <Button variant="outline" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    
  );
}