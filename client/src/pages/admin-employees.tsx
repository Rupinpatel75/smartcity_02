import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, User, Eye, EyeOff, Users } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

import { createEmployeeSchema, type CreateEmployee } from "@shared/schema";

interface Employee {
  id: number;
  username: string;
  email: string;
  city: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminEmployees() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ["/api/v1/admin/employees"],
  });

  const form = useForm<CreateEmployee>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      state: "Gujarat",
      district: "",
      city: "",
      phoneNo: "",
    },
  });

  const createEmployeeMutation = useMutation({
    mutationFn: async (data: CreateEmployee) => {
      const res = await apiRequest("POST", "/api/v1/admin/employees", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Employee created successfully",
        description: "The employee account has been created and is ready to use.",
      });
      form.reset();
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/v1/admin/employees"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating employee",
        description: error.message || "Failed to create employee account",
        variant: "destructive",
      });
    },
  });

  const onCreateEmployee = (data: CreateEmployee) => {
    createEmployeeMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employee Management</h1>
          <p className="text-gray-600">Manage your field team members</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Employee</DialogTitle>
              <DialogDescription>
                Add a new employee to handle complaints in your city
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onCreateEmployee)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="employee_username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="employee@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter password" 
                            {...field} 
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="Gujarat" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District</FormLabel>
                        <FormControl>
                          <Input placeholder="Ahmedabad" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Ahmedabad" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phoneNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={createEmployeeMutation.isPending}
                >
                  {createEmployeeMutation.isPending ? "Creating..." : "Create Employee"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Employees</p>
                <p className="text-2xl font-bold text-blue-600">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {employees.filter(emp => emp.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Inactive</p>
                <p className="text-2xl font-bold text-gray-600">
                  {employees.filter(emp => !emp.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Your field employees who handle complaint resolution
          </CardDescription>
        </CardHeader>
        <CardContent>
          {employees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.map((employee) => (
                <Card key={employee.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{employee.username}</h3>
                          <p className="text-sm text-gray-600">{employee.email}</p>
                        </div>
                      </div>
                      <Badge variant={employee.isActive ? "default" : "secondary"}>
                        {employee.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>City:</span>
                        <span className="font-medium">{employee.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Joined:</span>
                        <span>{new Date(employee.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No employees yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first employee to start managing complaints effectively.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add First Employee
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employee Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Guidelines</CardTitle>
          <CardDescription>
            Important information for managing your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Account Creation</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Employees get username/password login access</li>
                <li>• They can only see cases assigned to them</li>
                <li>• Accounts are automatically linked to your admin account</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Responsibilities</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Handle assigned complaints in the field</li>
                <li>• Update case status (pending → in-progress → resolved)</li>
                <li>• Access location details and maps for navigation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}