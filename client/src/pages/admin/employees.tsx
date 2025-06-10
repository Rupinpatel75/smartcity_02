
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
      return apiRequest("/api/v1/admin/users", {
        method: "DELETE",
        body: { userId },
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
      return apiRequest("/api/v1/admin/users/toggle-admin", {
        method: "PATCH",
        body: { userId, isAdmin },
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
          <h1 className="text-2xl font-semibold">View Employee List</h1>
          <Button variant="default">+ Add Employee</Button>
        </div>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Input
              placeholder="Search by keyword"
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
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Employee">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Showing {employees.length} of {employees.length} Employees
          </p>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.id}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phoneNumber}</TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell className="space-x-2">
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleAssignTask(employee.id)}
                    >
                      Assign Task
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(employee.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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