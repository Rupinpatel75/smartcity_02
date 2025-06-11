import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, User, Calendar, AlertTriangle, CheckCircle, Filter } from "lucide-react";
import { DivIcon } from "leaflet";
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
}

interface Employee {
  id: number;
  username: string;
  email: string;
  city: string;
  isActive: boolean;
}

const createMarkerIcon = (status: string) => {
  const color = status === 'resolved' ? '#22c55e' : '#ef4444';
  const symbol = status === 'resolved' ? '✓' : '!';
  
  const iconHtml = `
    <div style="
      background-color: ${color}; 
      width: 25px; 
      height: 35px; 
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      position: relative;
    ">
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
        color: white;
        font-size: 12px;
        font-weight: bold;
      ">
        ${symbol}
      </div>
    </div>
  `;
  
  return new DivIcon({
    html: iconHtml,
    iconSize: [25, 35],
    iconAnchor: [12, 35],
    className: 'custom-marker'
  });
};

export default function AdminMap() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [assignmentFilter, setAssignmentFilter] = useState<string>("all");

  const { data: cases = [] } = useQuery<Case[]>({
    queryKey: ["/api/v1/cases"],
  });

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ["/api/v1/admin/employees"],
  });

  // Filter cases based on search and filters
  const filteredCases = cases.filter((case_: Case) => {
    const matchesSearch = !searchTerm || 
      case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || case_.status === statusFilter;
    
    const matchesAssignment = assignmentFilter === "all" || 
      (assignmentFilter === "assigned" && case_.assignedTo) ||
      (assignmentFilter === "unassigned" && !case_.assignedTo);
    
    return matchesSearch && matchesStatus && matchesAssignment && case_.latitude && case_.longitude;
  });

  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.username : "Unknown";
  };

  const pendingCount = cases.filter(c => c.status === "pending").length;
  const resolvedCount = cases.filter(c => c.status === "resolved").length;
  const assignedCount = cases.filter(c => c.assignedTo).length;

  return (
    <MobileAdminLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">City Map View</h1>
          <p className="text-gray-600">Visual overview of all complaints across the city</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Pending Cases</p>
                <p className="text-2xl font-bold text-red-600">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Resolved Cases</p>
                <p className="text-2xl font-bold text-green-600">{resolvedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Assigned Cases</p>
                <p className="text-2xl font-bold text-blue-600">{assignedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Total Showing</p>
                <p className="text-2xl font-bold text-purple-600">{filteredCases.length}</p>
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
            <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
              <SelectTrigger className="w-48">
                <User className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Assignment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cases</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle>Complaint Locations</CardTitle>
          <CardDescription>
            Red markers indicate pending cases, green markers show resolved cases
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[600px]">
            <MapContainer
              center={[23.0225, 72.5714]}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {filteredCases.map((case_: Case) => (
                <Marker
                  key={case_.id}
                  position={[parseFloat(case_.latitude), parseFloat(case_.longitude)]}
                  icon={createMarkerIcon(case_.status)}
                >
                  <Popup maxWidth={350} minWidth={280}>
                    <div className="p-3 space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-lg text-gray-900 leading-tight">
                          {case_.title}
                        </h3>
                        <Badge 
                          variant={case_.status === 'resolved' ? 'default' : 'destructive'}
                          className="ml-2 shrink-0"
                        >
                          {case_.status === 'resolved' ? (
                            <><CheckCircle className="w-3 h-3 mr-1" /> Resolved</>
                          ) : (
                            <><AlertTriangle className="w-3 h-3 mr-1" /> {case_.status}</>
                          )}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {case_.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="capitalize">{case_.category}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(case_.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{case_.location}</span>
                          </div>
                        </div>
                        
                        {case_.assignedTo && (
                          <div className="text-xs">
                            <Badge variant="outline" className="text-xs">
                              Assigned to: {getEmployeeName(case_.assignedTo)}
                            </Badge>
                          </div>
                        )}

                        {case_.priority && (
                          <div className="text-xs">
                            <Badge variant="outline" className="text-xs">
                              Priority: {case_.priority}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`https://maps.google.com/maps?q=${case_.latitude},${case_.longitude}`, '_blank')}
                        >
                          <MapPin className="w-3 h-3 mr-1" />
                          Navigate
                        </Button>
                        {!case_.assignedTo && (
                          <Button size="sm">
                            <User className="w-3 h-3 mr-1" />
                            Assign
                          </Button>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Map Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <p className="font-medium">Pending/In-Progress Cases</p>
                <p className="text-sm text-gray-600">Requires attention or currently being handled</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <div>
                <p className="font-medium">Resolved Cases</p>
                <p className="text-sm text-gray-600">Successfully completed by your team</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </MobileAdminLayout>
  );
}