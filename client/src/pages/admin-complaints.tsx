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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
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
      setIsAssignDialogOpen(false);
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

  const updateStatusMutation = useMutation({
    mutationFn: async ({ caseId, status }: { caseId: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/v1/cases/${caseId}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Status updated successfully",
        description: "The case status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/v1/cases"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating status",
        description: error.message || "Failed to update case status",
        variant: "destructive",
      });
    },
  });

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = !searchTerm || 
      case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || case_.status === statusFilter;
    
    return matchesSearch && matchesStatus;
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

  return (
    <MobileAdminLayout>
      <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Complaint Management</h1>
          <p className="text-gray-600">View, assign, and track city complaints</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <Calendar className="h-5 w-5 text-orange-500" />
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
              <User className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Assigned</p>
                <p className="text-2xl font-bold text-purple-600">
                  {cases.filter(c => c.assignedTo).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-green-500" />
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

      {/* Filters */}
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

      {/* Cases Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cases ({filteredCases.length})</CardTitle>
          <CardDescription>
            Manage and assign complaints to your team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCases.map((case_) => (
              <div key={case_.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{case_.title}</h3>
                      <Badge variant={getStatusColor(case_.status)}>
                        {case_.status}
                      </Badge>
                      <Badge variant={getPriorityColor(case_.priority)}>
                        {case_.priority} priority
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-2 line-clamp-2">{case_.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>{case_.category}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{case_.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(case_.createdAt).toLocaleDateString()}</span>
                      </div>
                      {case_.assignedTo && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>Assigned to: {getEmployeeName(case_.assignedTo)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCase(case_);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    
                    {!case_.assignedTo && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedCase(case_);
                          setIsAssignDialogOpen(true);
                        }}
                        disabled={employees.length === 0}
                      >
                        <User className="h-4 w-4 mr-1" />
                        Assign
                      </Button>
                    )}
                    
                    <Select
                      value={case_.status}
                      onValueChange={(newStatus) => {
                        updateStatusMutation.mutate({
                          caseId: case_.id,
                          status: newStatus
                        });
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredCases.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No cases found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Case Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Case Details</DialogTitle>
            <DialogDescription>
              Complete information about this complaint
            </DialogDescription>
          </DialogHeader>
          {selectedCase && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{selectedCase.title}</h3>
                <div className="flex gap-2 mb-4">
                  <Badge variant={getStatusColor(selectedCase.status)}>
                    {selectedCase.status}
                  </Badge>
                  <Badge variant={getPriorityColor(selectedCase.priority)}>
                    {selectedCase.priority} priority
                  </Badge>
                  <Badge variant="outline">{selectedCase.category}</Badge>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-600">{selectedCase.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Location</h4>
                  <p className="text-gray-600">{selectedCase.location}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => window.open(`https://maps.google.com/maps?q=${selectedCase.latitude},${selectedCase.longitude}`, '_blank')}
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    View on Map
                  </Button>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Timeline</h4>
                  <p className="text-sm text-gray-600">
                    Created: {new Date(selectedCase.createdAt).toLocaleString()}
                  </p>
                  {selectedCase.assignedTo && (
                    <p className="text-sm text-gray-600">
                      Assigned to: {getEmployeeName(selectedCase.assignedTo)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Case Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Case</DialogTitle>
            <DialogDescription>
              Select an employee to handle: {selectedCase?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Available Employees</h4>
              <div className="space-y-2">
                {employees.map((employee) => (
                  <Button
                    key={employee.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      if (selectedCase) {
                        assignCaseMutation.mutate({
                          caseId: selectedCase.id,
                          employeeId: employee.id
                        });
                      }
                    }}
                    disabled={assignCaseMutation.isPending}
                  >
                    <User className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <p className="font-medium">{employee.username}</p>
                      <p className="text-xs text-gray-500">{employee.email}</p>
                    </div>
                  </Button>
                ))}
                
                {employees.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    No employees available. Create employees first.
                  </p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}