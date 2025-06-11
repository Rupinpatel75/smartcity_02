import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, User, Eye, EyeOff, Users } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { MobileAdminLayout } from "@/components/layouts/mobile-admin-layout";
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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateEmployee>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ["/api/v1/admin/employees"],
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
    <MobileAdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Employee Management</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your field team members</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-4 sm:mx-auto">
              <DialogHeader>
                <DialogTitle>Create New Employee</DialogTitle>
                <DialogDescription>
                  Add a new employee to handle complaints in your city
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onCreateEmployee)} className="space-y-4">
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
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={createEmployeeMutation.isPending} className="w-full">
                    {createEmployeeMutation.isPending ? "Creating..." : "Create Employee"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">Total Employees</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-600">{employees.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">Active</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">
                    {employees.filter(emp => emp.isActive).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">Inactive</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-600">
                    {employees.filter(emp => !emp.isActive).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employees List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">All Employees</CardTitle>
            <CardDescription className="text-sm">
              {employees.length} field workers in your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {employees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{employee.username}</p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{employee.email}</p>
                      <p className="text-xs text-gray-500">
                        Joined: {new Date(employee.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={employee.isActive ? "default" : "secondary"} className="text-xs">
                      {employee.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              ))}
              {employees.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No employees added yet</h3>
                  <p className="text-gray-600 mb-4">Start by adding your first field worker to handle complaints.</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add First Employee
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileAdminLayout>
  );
}