import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { FileText, MapPin, Calendar, User, Search, Filter, Eye } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { MobileAdminLayout } from "@/components/layouts/mobile-admin-layout";

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
  assignedBy?: number;
  createdAt: string;
  updatedAt: string;
}

interface Employee {
  id: number;
  username: string;
  email: string;
  city: string;
  isActive: boolean;
}

export default function AdminComplaints() {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cases = [] } = useQuery<Case[]>({
    queryKey: ["/api/v1/cases"],
  });

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ["/api/v1/admin/employees"],
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

  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.username : "Unknown";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "destructive";
      case "in-progress": return "secondary";
      case "resolved": return "default";
      default: return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || case_.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || case_.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <MobileAdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Complaint Management</h1>
            <p className="text-sm sm:text-base text-gray-600">View, assign, and track city complaints</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">Total Cases</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-600">{cases.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">Pending</p>
                  <p className="text-lg sm:text-2xl font-bold text-orange-600">
                    {cases.filter(c => c.status === "pending").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">In Progress</p>
                  <p className="text-lg sm:text-2xl font-bold text-purple-600">
                    {cases.filter(c => c.status === "in-progress").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">Resolved</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">
                    {cases.filter(c => c.status === "resolved").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cases List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">All Complaints</CardTitle>
            <CardDescription className="text-sm">
              {filteredCases.length} of {cases.length} complaints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredCases.map((case_) => (
                <div key={case_.id} className="p-4 border rounded-lg space-y-3 hover:shadow-sm transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{case_.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{case_.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                      <Badge variant={getStatusColor(case_.status)} className="text-xs">
                        {case_.status.charAt(0).toUpperCase() + case_.status.slice(1)}
                      </Badge>
                      <Badge variant={getPriorityColor(case_.priority)} className="text-xs">
                        {case_.priority.charAt(0).toUpperCase() + case_.priority.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{case_.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>{new Date(case_.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {case_.assignedTo && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>Assigned to: {getEmployeeName(case_.assignedTo)}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 border-t">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg mx-4 sm:mx-auto">
                        <DialogHeader>
                          <DialogTitle className="text-lg">Case Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Title</h4>
                            <p className="text-sm text-gray-600">{case_.title}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                            <p className="text-sm text-gray-600">{case_.description}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Category</h4>
                              <p className="text-sm text-gray-600">{case_.category}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Priority</h4>
                              <Badge variant={getPriorityColor(case_.priority)} className="text-xs">
                                {case_.priority.charAt(0).toUpperCase() + case_.priority.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Location</h4>
                            <p className="text-sm text-gray-600">{case_.location}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {case_.status === "pending" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="flex-1 sm:flex-none">
                            Assign Employee
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
                            <Select onValueChange={(employeeId) => 
                              assignCaseMutation.mutate({ 
                                caseId: case_.id, 
                                employeeId: parseInt(employeeId) 
                              })
                            }>
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
                    )}
                  </div>
                </div>
              ))}
              {filteredCases.length === 0 && (
                <p className="text-center text-gray-500 py-8 text-sm">No complaints found matching your criteria.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileAdminLayout>
  );
}