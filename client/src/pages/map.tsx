import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Search, MapPin, Clock, User, AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Icon, DivIcon } from "leaflet";
import { renderToStaticMarkup } from 'react-dom/server';

// Create custom markers for different statuses
const createMarkerIcon = (status: string) => {
  const color = status === 'resolved' || status === 'completed' ? '#22c55e' : '#ef4444';
  const symbol = status === 'resolved' || status === 'completed' ? '✓' : '!';
  
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

interface CaseData {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  location: string;
  latitude: string;
  longitude: string;
  imageUrl?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export default function Map() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"pending" | "resolved" | undefined>();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: cases = [] } = useQuery({
    queryKey: ["/api/v1/cases"],
  });

  // Filter cases based on search term and status
  const filteredCases = (cases as CaseData[]).filter((case_: CaseData) => {
    const matchesSearch = !searchTerm || 
      case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !selectedStatus || case_.status === selectedStatus;
    
    return matchesSearch && matchesStatus && case_.latitude && case_.longitude;
  });

  const filters = (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <Input 
          placeholder="Search location, title, or category..." 
          className="w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button 
        variant={selectedStatus === "pending" ? "default" : "outline"}
        onClick={() => setSelectedStatus(s => s === "pending" ? undefined : "pending")}
        className="w-full md:w-auto"
      >
        <AlertTriangle className="mr-2 h-4 w-4" />
        Pending ({(cases as CaseData[]).filter(c => c.status === "pending").length})
      </Button>
      <Button 
        variant={selectedStatus === "resolved" ? "default" : "outline"}
        onClick={() => setSelectedStatus(s => s === "resolved" ? undefined : "resolved")}
        className="w-full md:w-auto"
      >
        <CheckCircle className="mr-2 h-4 w-4" />
        Resolved ({(cases as CaseData[]).filter(c => c.status === "resolved").length})
      </Button>
    </div>
  );

  const pendingCount = (cases as CaseData[]).filter(c => c.status === "pending").length;
  const resolvedCount = (cases as CaseData[]).filter(c => c.status === "resolved").length;

  return (
    <div className="p-6">
      <div className="hidden md:block mb-6">
        {filters}
      </div>

      <div className="block md:hidden mb-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Search className="mr-2 h-4 w-4" /> Filter Reports
        </Button>
        {isFilterOpen && (
          <Card className="mt-4">
            <CardContent className="p-4">
              {filters}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Pending Complaints</p>
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
                <p className="text-sm font-medium">Resolved Complaints</p>
                <p className="text-2xl font-bold text-green-600">{resolvedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Showing</p>
                <p className="text-2xl font-bold text-blue-600">{filteredCases.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="h-[calc(100vh-16rem)] md:h-[calc(100vh-12rem)]">
            <MapContainer
              center={[23.0225, 72.5714]}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {filteredCases.map((case_: CaseData) => (
                <Marker
                  key={case_.id}
                  position={[parseFloat(case_.latitude), parseFloat(case_.longitude)]}
                  icon={createMarkerIcon(case_.status)}
                >
                  <Popup maxWidth={300} minWidth={250}>
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
                            <><AlertTriangle className="w-3 h-3 mr-1" /> Pending</>
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
                            <Clock className="w-3 h-3" />
                            <span>{new Date(case_.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{case_.location}</span>
                          </div>
                        </div>
                        
                        {case_.priority && (
                          <div className="text-xs">
                            <Badge variant="outline" className="text-xs">
                              Priority: {case_.priority}
                            </Badge>
                          </div>
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
    </div>
  );
}