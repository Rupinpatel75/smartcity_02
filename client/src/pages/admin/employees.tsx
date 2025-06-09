
import { useState } from "react";
import { AdminLayout } from "@/components/layouts/admin-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

type Employee = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
};

export default function ViewEmployees() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");

  // Mock data - replace with actual API call
  const employees: Employee[] = [
    {
      id: "#1223",
      name: "Patel Kavya",
      email: "patel@gmail.com",
      phoneNumber: "9225434152",
      role: "Manager",
    },
  ];

  const handleSearch = () => {
    // Implement search functionality
  };

  const handleAssignTask = (employeeId: string) => {
    // Implement assign task functionality
  };

  const handleDelete = (employeeId: string) => {
    // Implement delete functionality
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