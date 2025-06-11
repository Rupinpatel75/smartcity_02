import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Wrench, CheckCircle, Clock, MapPin, Calendar, FileText, Navigation, Eye, AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { MobileEmployeeLayout } from "@/components/layouts/mobile-employee-layout";

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

export default function EmployeeDashboard() {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cases = [] } = useQuery<Case[]>({
    queryKey: ["/api/v1/cases"],
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
      setIsStatusDialogOpen(false);
      setSelectedCase(null);
      queryClient.invalidateQueries({ queryKey: ["/api/v1/cases"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const assignedCases = cases.filter(case_ => case_.assignedTo === user.id);

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
    <MobileEmployeeLayout>
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Mobile-first Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">My Work Assignments</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Cases assigned to me for field resolution</p>
        </div>

        {/* Mobile-optimized Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">Total Assigned</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-600">{assignedCases.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">Pending</p>
                  <p className="text-lg sm:text-2xl font-bold text-red-600">
                    {assignedCases.filter(c => c.status === "pending").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">In Progress</p>
                  <p className="text-lg sm:text-2xl font-bold text-orange-600">
                    {assignedCases.filter(c => c.status === "in-progress").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">Completed</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">
                    {assignedCases.filter(c => c.status === "resolved").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile-optimized Cases List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Assigned Cases</h2>
            <Badge variant="outline" className="text-xs sm:text-sm">
              {assignedCases.length} Total
            </Badge>
          </div>

          {assignedCases.length === 0 ? (
            <Card>
              <CardContent className="p-6 sm:p-8 text-center">
                <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Cases Assigned</h3>
                <p className="text-gray-600">You don't have any cases assigned to you yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {assignedCases.map((case_) => (
                <Card key={case_.id} className="hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4">
                      {/* Header Section */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {case_.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {case_.description}
                          </p>
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

                      {/* Details Section */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{case_.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>{new Date(case_.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Actions Section */}
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCase(case_);
                            setIsViewDialogOpen(true);
                          }}
                          className="flex-1 sm:flex-none"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const url = `https://www.google.com/maps?q=${case_.latitude},${case_.longitude}`;
                            window.open(url, '_blank');
                          }}
                          className="flex-1 sm:flex-none"
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Navigate
                        </Button>
                        {case_.status !== "resolved" && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedCase(case_);
                              setIsStatusDialogOpen(true);
                            }}
                            className="flex-1 sm:flex-none"
                          >
                            <Wrench className="h-4 w-4 mr-2" />
                            Update Status
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* View Details Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-lg mx-4 sm:mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Case Details</DialogTitle>
              <DialogDescription className="text-sm">
                Detailed information about the selected case
              </DialogDescription>
            </DialogHeader>
            {selectedCase && (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Title</h4>
                  <p className="text-sm text-gray-600">{selectedCase.title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{selectedCase.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Category</h4>
                    <p className="text-sm text-gray-600">{selectedCase.category}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Priority</h4>
                    <Badge variant={getPriorityColor(selectedCase.priority)} className="text-xs">
                      {selectedCase.priority.charAt(0).toUpperCase() + selectedCase.priority.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Location</h4>
                  <p className="text-sm text-gray-600">{selectedCase.location}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Status</h4>
                  <Badge variant={getStatusColor(selectedCase.status)} className="text-xs">
                    {selectedCase.status.charAt(0).toUpperCase() + selectedCase.status.slice(1)}
                  </Badge>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Status Update Dialog */}
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent className="max-w-sm mx-4 sm:mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg">Update Case Status</DialogTitle>
              <DialogDescription className="text-sm">
                Change the status of the selected case
              </DialogDescription>
            </DialogHeader>
            {selectedCase && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Case: {selectedCase.title}</h4>
                  <p className="text-xs text-gray-600">Current status: {selectedCase.status}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {selectedCase.status === "pending" && (
                    <Button
                      onClick={() => updateStatusMutation.mutate({ caseId: selectedCase.id, status: "in-progress" })}
                      disabled={updateStatusMutation.isPending}
                      className="w-full"
                    >
                      Mark as In Progress
                    </Button>
                  )}
                  {selectedCase.status === "in-progress" && (
                    <Button
                      onClick={() => updateStatusMutation.mutate({ caseId: selectedCase.id, status: "resolved" })}
                      disabled={updateStatusMutation.isPending}
                      className="w-full"
                    >
                      Mark as Resolved
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        </div>
    </MobileEmployeeLayout>
  );
}