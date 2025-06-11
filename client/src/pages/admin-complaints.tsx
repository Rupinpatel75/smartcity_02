import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { FileText, MapPin, Calendar, User, Search, Filter, Eye } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { AdminNavButton } from "@/components/admin-nav-button";

interface Case {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  location: string;
  latitude: string;
  longitude: string;
  assignedTo?: number;
  createdAt: string;
}

interface Employee {
  id: number;
  username: string;
  email: string;
  city: string;
  isActive: boolean;
}

export default function AdminComplaints() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [assignedEmployee, setAssignedEmployee] = useState<string>("");

  const { data: cases = [] } = useQuery<Case[]>({
    queryKey: ["/api/v1/cases"],
  });

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ["/api/v1/admin/employees"],
  });

  const assignCaseMutation = useMutation({
    mutationFn: async ({ caseId, employeeId }: { caseId: number; employeeId: number }) => {
      const res = await apiRequest("PATCH", `/api/v1/admin/cases/${caseId}/assign`, {
        employeeId,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Case assigned successfully",
      });
      setSelectedCase(null);
      setAssignedEmployee("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredCases = cases.filter((case_: Case) => {
    const matchesSearch = case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || case_.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="relative">
      <AdminNavButton />
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Complaint Management</h1>
            <p className="text-sm sm:text-base text-gray-600">View, assign, and track city complaints</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Total Cases</p>
                  <p className="text-2xl font-bold text-blue-600">{cases.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {cases.filter(c => c.status === "pending").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {cases.filter(c => c.status === "in-progress").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {cases.filter(c => c.status === "resolved").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by title, location, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Complaints ({filteredCases.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {filteredCases.length > 0 ? (
                filteredCases.map((case_: Case) => (
                  <div key={case_.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg truncate">{case_.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{case_.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{case_.location}</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2">
                        <Badge variant="outline" className="text-xs">{case_.status}</Badge>
                        <Badge variant="outline" className="text-xs">{case_.category}</Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t">
                      <div className="text-xs text-gray-500">
                        Created: {new Date(case_.createdAt).toLocaleDateString()}
                        {case_.assignedTo && (
                          <span className="ml-3">
                            Assigned to: Employee #{case_.assignedTo}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{case_.title}</DialogTitle>
                              <DialogDescription>Case #{case_.id}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Description</h4>
                                <p className="text-sm text-gray-600">{case_.description}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-1">Location</h4>
                                  <p className="text-sm text-gray-600">{case_.location}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-1">Category</h4>
                                  <p className="text-sm text-gray-600">{case_.category}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-1">Status</h4>
                                  <p className="text-sm text-gray-600">{case_.status}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-1">Priority</h4>
                                  <p className="text-sm text-gray-600">{case_.priority}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        {case_.status === "pending" && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" onClick={() => setSelectedCase(case_)}>
                                Assign
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Assign Case</DialogTitle>
                                <DialogDescription>
                                  Assign this case to an available employee
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Case: {case_.title}</h4>
                                  <p className="text-sm text-gray-600">{case_.location}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Select Employee</h4>
                                  {employees.filter(e => e.isActive).length > 0 ? (
                                    <Select value={assignedEmployee} onValueChange={setAssignedEmployee}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Choose an employee" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {employees.filter(e => e.isActive).map((employee) => (
                                          <SelectItem key={employee.id} value={employee.id.toString()}>
                                            {employee.username} - {employee.email}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <p className="text-sm text-gray-500">
                                      No employees available. Create employees first.
                                    </p>
                                  )}
                                </div>
                                <div className="flex justify-end gap-3">
                                  <Button variant="outline" onClick={() => setSelectedCase(null)}>
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      if (assignedEmployee) {
                                        assignCaseMutation.mutate({
                                          caseId: case_.id,
                                          employeeId: parseInt(assignedEmployee),
                                        });
                                      }
                                    }}
                                    disabled={!assignedEmployee || assignCaseMutation.isPending}
                                  >
                                    {assignCaseMutation.isPending ? "Assigning..." : "Assign Case"}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No complaints found matching your filters.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}