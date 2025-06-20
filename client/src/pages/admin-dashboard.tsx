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

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ["/api/v1/admin/employees"],
  });

  const { data: cases = [] } = useQuery<Case[]>({
    queryKey: ["/api/v1/cases"],
  });

  const form = useForm<CreateEmployee>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      state: "",
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage employees and assign complaints</p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-blue-600" />
          <span className="font-medium">Administrator</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <FileText className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Pending Cases</p>
                <p className="text-2xl font-bold text-orange-600">{pendingCases.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Assigned Cases</p>
                <p className="text-2xl font-bold text-purple-600">{assignedCases.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Resolved Cases</p>
                <p className="text-2xl font-bold text-green-600">{resolvedCases.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employees Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Employees</CardTitle>
                <CardDescription>Manage your city employees</CardDescription>
              </div>
              <Dialog open={isCreateEmployeeOpen} onOpenChange={setIsCreateEmployeeOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Employee
                  </Button>
                </DialogTrigger>
                <DialogContent>
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
                              <Input type="password" placeholder="Enter password" {...field} />
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
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {employees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <User className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="font-medium">{employee.username}</p>
                      <p className="text-sm text-gray-600">{employee.email}</p>
                      <p className="text-xs text-gray-500">{employee.city}</p>
                    </div>
                  </div>
                  <Badge variant={employee.isActive ? "default" : "secondary"}>
                    {employee.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))}
              {employees.length === 0 && (
                <p className="text-center text-gray-500 py-4">No employees yet. Create your first employee!</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cases Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Cases</CardTitle>
            <CardDescription>Manage and assign complaints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingCases.slice(0, 5).map((case_) => (
                <div key={case_.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{case_.title}</p>
                    <p className="text-sm text-gray-600 truncate">{case_.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{case_.category}</Badge>
                      <Badge variant="destructive">{case_.status}</Badge>
                      <Badge variant="secondary">{case_.priority}</Badge>
                    </div>
                  </div>
                  {!case_.assignedTo && (
                    <Dialog open={isAssignCaseOpen && selectedCase?.id === case_.id} 
                            onOpenChange={(open) => {
                              setIsAssignCaseOpen(open);
                              if (!open) setSelectedCase(null);
                            }}>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          onClick={() => setSelectedCase(case_)}
                          disabled={employees.length === 0}
                        >
                          Assign
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign Case</DialogTitle>
                          <DialogDescription>
                            Select an employee to handle this case: {case_.title}
                          </DialogDescription>
                        </DialogHeader>
                        <Select onValueChange={onAssignCase}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an employee" />
                          </SelectTrigger>
                          <SelectContent>
                            {employees.map((employee) => (
                              <SelectItem key={employee.id} value={employee.id.toString()}>
                                {employee.username} - {employee.city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              ))}
              {pendingCases.length === 0 && (
                <p className="text-center text-gray-500 py-4">No pending cases to assign.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}