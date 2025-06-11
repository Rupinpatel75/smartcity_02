import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  assignedAt?: string;
  createdAt: string;
}

export default function EmployeeDashboard() {
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

  const handleStatusUpdate = (caseId: number, status: string) => {
    updateStatusMutation.mutate({ caseId, status });
  };

  const assignedCases = cases.filter(c => c.assignedAt);
  const inProgressCases = assignedCases.filter(c => c.status === "in-progress");
  const completedCases = assignedCases.filter(c => c.status === "resolved");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employee Dashboard</h1>
          <p className="text-gray-600">Manage your assigned complaints and tasks</p>
        </div>
        <div className="flex items-center gap-2">
          <Wrench className="h-6 w-6 text-green-600" />
          <span className="font-medium">Field Employee</span>
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
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold text-orange-600">{inProgressCases.length}</p>
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
                <p className="text-2xl font-bold text-green-600">{completedCases.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Success Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {assignedCases.length > 0 ? Math.round((completedCases.length / assignedCases.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Cases */}
      <Card>
        <CardHeader>
          <CardTitle>My Assigned Cases</CardTitle>
          <CardDescription>Cases assigned to you for resolution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignedCases.map((case_) => (
              <div key={case_.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{case_.title}</h3>
                    <p className="text-gray-600 mt-1">{case_.description}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{case_.category}</Badge>
                      <Badge 
                        variant={
                          case_.status === "resolved" ? "default" : 
                          case_.status === "in-progress" ? "secondary" : "destructive"
                        }
                      >
                        {case_.status}
                      </Badge>
                      <Badge variant="outline">{case_.priority} priority</Badge>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{case_.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Assigned: {new Date(case_.assignedAt || case_.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Select 
                      value={case_.status} 
                      onValueChange={(status) => handleStatusUpdate(case_.id, status)}
                      disabled={updateStatusMutation.isPending}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(`https://maps.google.com/maps?q=${case_.latitude},${case_.longitude}`, '_blank')}
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      View Location
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {assignedCases.length === 0 && (
              <div className="text-center py-8">
                <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No cases assigned yet.</p>
                <p className="text-sm text-gray-400">Check back later for new assignments from your admin.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Work History */}
      {completedCases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Work</CardTitle>
            <CardDescription>Your recently completed cases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedCases.slice(0, 5).map((case_) => (
                <div key={case_.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                  <div>
                    <p className="font-medium">{case_.title}</p>
                    <p className="text-sm text-gray-600">{case_.category} - {case_.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <Badge variant="default">Completed</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}