import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Wrench, CheckCircle, Clock, MapPin, Calendar, FileText, Navigation, Eye, AlertTriangle } from "lucide-react";
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
        description: error.message || "Failed to update case status",
        variant: "destructive",
      });
    },
  });

  // Get current user and filter assigned cases
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Work Assignments</h1>
          <p className="text-gray-600">Cases assigned to me for field resolution</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Assigned</p>
                <p className="text-2xl font-bold text-blue-600">{assignedCases.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-red-600">
                  {assignedCases.filter(c => c.status === "pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold text-orange-600">
                  {assignedCases.filter(c => c.status === "in-progress").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {assignedCases.filter(c => c.status === "resolved").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Tasks Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            High Priority Tasks
          </CardTitle>
          <CardDescription>Urgent assignments that need immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          {assignedCases.filter(c => c.priority === "high" && c.status !== "resolved").length > 0 ? (
            <div className="space-y-3">
              {assignedCases.filter(c => c.priority === "high" && c.status !== "resolved").map((case_) => (
                <div key={case_.id} className="p-3 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-red-900">{case_.title}</h4>
                      <p className="text-sm text-red-700">{case_.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-300"
                        onClick={() => window.open(`https://maps.google.com/maps?q=${case_.latitude},${case_.longitude}`, '_blank')}
                      >
                        <Navigation className="h-4 w-4 mr-1" />
                        Navigate
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => {
                          setSelectedCase(case_);
                          setIsStatusDialogOpen(true);
                        }}
                      >
                        Start Work
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No high priority tasks at the moment</p>
          )}
        </CardContent>
      </Card>

      {/* All Assigned Cases */}
      <Card>
        <CardHeader>
          <CardTitle>All My Assignments</CardTitle>
          <CardDescription>Complete list of cases assigned to me</CardDescription>
        </CardHeader>
        <CardContent>
          {assignedCases.length > 0 ? (
            <div className="space-y-4">
              {assignedCases.map((case_) => (
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
                        <Badge variant="outline">{case_.category}</Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">{case_.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{case_.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Assigned: {new Date(case_.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <div className="flex gap-2">
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
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`https://maps.google.com/maps?q=${case_.latitude},${case_.longitude}`, '_blank')}
                        >
                          <Navigation className="h-4 w-4 mr-1" />
                          Navigate
                        </Button>
                      </div>
                      
                      {case_.status !== "resolved" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedCase(case_);
                            setIsStatusDialogOpen(true);
                          }}
                        >
                          Update Status
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
              <p className="text-gray-500">You don't have any cases assigned to you at the moment.</p>
              <p className="text-gray-500">Check back later or contact your administrator.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Case Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assignment Details</DialogTitle>
            <DialogDescription>
              Complete information about this field assignment
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
                  <p className="text-gray-600 mb-2">{selectedCase.location}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://maps.google.com/maps?q=${selectedCase.latitude},${selectedCase.longitude}`, '_blank')}
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    Open in Maps
                  </Button>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Assignment Info</h4>
                  <p className="text-sm text-gray-600">
                    Assigned: {new Date(selectedCase.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Priority: {selectedCase.priority}
                  </p>
                  <p className="text-sm text-gray-600">
                    Category: {selectedCase.category}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Work Status</DialogTitle>
            <DialogDescription>
              Update the progress of: {selectedCase?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">Select New Status</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-orange-700 border-orange-200 hover:bg-orange-50"
                  onClick={() => {
                    if (selectedCase) {
                      updateStatusMutation.mutate({
                        caseId: selectedCase.id,
                        status: "in-progress"
                      });
                    }
                  }}
                  disabled={updateStatusMutation.isPending}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Mark as In Progress
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start text-green-700 border-green-200 hover:bg-green-50"
                  onClick={() => {
                    if (selectedCase) {
                      updateStatusMutation.mutate({
                        caseId: selectedCase.id,
                        status: "resolved"
                      });
                    }
                  }}
                  disabled={updateStatusMutation.isPending}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Resolved
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}