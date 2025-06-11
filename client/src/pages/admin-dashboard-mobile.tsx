import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Shield, UserPlus, Users, FileText, MapPin, Calendar, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { createEmployeeSchema, type CreateEmployee } from "@shared/schema";
import { MobileAdminLayout } from "@/components/layouts/mobile-admin-layout";

interface Employee {
  id: number;
  username: string;
  email: string;
  city: string;
  isActive: boolean;
  createdAt: string;
}

interface Case {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  location: string;
  assignedTo?: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const [isCreateEmployeeOpen, setIsCreateEmployeeOpen] = useState(false);
  const [isAssignCaseOpen, setIsAssignCaseOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
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

  const { data: cases = [] } = useQuery<Case[]>({
    queryKey: ["/api/v1/cases"],
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
      setIsCreateEmployeeOpen(false);
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

  const assignCaseMutation = useMutation({
    mutationFn: async ({ caseId, employeeId }: { caseId: number; employeeId: number }) => {
      const res = await apiRequest("PATCH", `/api/v1/admin/cases/${caseId}/assign`, { employeeId });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Case assigned successfully",
        description: "The case has been assigned to the selected employee.",
      });
      setIsAssignCaseOpen(false);
      setSelectedCase(null);
      queryClient.invalidateQueries({ queryKey: ["/api/v1/cases"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error assigning case",
        description: error.message || "Failed to assign case",
        variant: "destructive",
      });
    },
  });

  const onCreateEmployee = (data: CreateEmployee) => {
    createEmployeeMutation.mutate(data);
  };

  const onAssignCase = (employeeId: string) => {
    if (selectedCase) {
      assignCaseMutation.mutate({
        caseId: selectedCase.id,
        employeeId: parseInt(employeeId)
      });
    }
  };

  const pendingCases = cases.filter(c => c.status === "pending");
  const assignedCases = cases.filter(c => c.assignedTo);
  const resolvedCases = cases.filter(c => c.status === "resolved");

  return (
    <MobileAdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage employees and assign complaints</p>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            <span className="text-sm sm:text-base font-medium">Administrator</span>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">Pending Cases</p>
                  <p className="text-lg sm:text-2xl font-bold text-orange-600">{pendingCases.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">Assigned Cases</p>
                  <p className="text-lg sm:text-2xl font-bold text-purple-600">{assignedCases.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">Resolved Cases</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">{resolvedCases.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Employees Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-lg sm:text-xl">Recent Employees</CardTitle>
                  <CardDescription className="text-sm">Manage your city's field workers</CardDescription>
                </div>
                <Dialog open={isCreateEmployeeOpen} onOpenChange={setIsCreateEmployeeOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="w-full sm:w-auto">
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
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {employees.slice(0, 5).map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{employee.username}</p>
                        <p className="text-xs text-gray-600 truncate">{employee.email}</p>
                      </div>
                    </div>
                    <Badge variant={employee.isActive ? "default" : "secondary"} className="text-xs">
                      {employee.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))}
                {employees.length === 0 && (
                  <p className="text-center text-gray-500 py-4 text-sm">No employees added yet.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pending Cases Section */}
          <Card>
            <CardHeader className="pb-3">
              <div>
                <CardTitle className="text-lg sm:text-xl">Pending Case Assignment</CardTitle>
                <CardDescription className="text-sm">Assign complaints to field workers</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingCases.slice(0, 5).map((case_) => (
                  <div key={case_.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{case_.title}</h4>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setSelectedCase(case_)}
                            className="w-full sm:w-auto"
                          >
                            Assign
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm mx-4 sm:mx-auto">
                          <DialogHeader>
                            <DialogTitle>Assign Case</DialogTitle>
                            <DialogDescription>
                              Select an employee to handle this complaint
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-medium mb-1">Case: {case_.title}</p>
                              <p className="text-xs text-gray-600">{case_.location}</p>
                            </div>
                            <Select onValueChange={onAssignCase}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select employee" />
                              </SelectTrigger>
                              <SelectContent>
                                {employees.filter(emp => emp.isActive).map((employee) => (
                                  <SelectItem key={employee.id} value={employee.id.toString()}>
                                    {employee.username}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{case_.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{case_.location}</span>
                    </div>
                  </div>
                ))}
                {pendingCases.length === 0 && (
                  <p className="text-center text-gray-500 py-4 text-sm">No pending cases to assign.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileAdminLayout>
  );
}