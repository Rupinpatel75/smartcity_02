import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

const mockMarkers = [
  { id: 1, lat: 23.2156, lng: 72.6369, title: "Pothole", status: "pending" },
  { id: 2, lat: 23.2256, lng: 72.6469, title: "Street Light", status: "completed" },
  { id: 3, lat: 23.2056, lng: 72.6269, title: "Garbage", status: "pending" },
];

export default function Map() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [status, setStatus] = useState<"pending" | "completed" | undefined>();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: markers = mockMarkers } = useQuery({
    queryKey: ["/api/cases/map", { date, status }],
  });

  const filters = (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <Input 
          placeholder="Search location..." 
          className="w-full"
          prefix={<Search className="h-4 w-4" />}
        />
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full md:w-auto">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Button 
        variant={status === "pending" ? "default" : "outline"}
        onClick={() => setStatus(s => s === "pending" ? undefined : "pending")}
        className="w-full md:w-auto"
      >
        Pending
      </Button>
      <Button 
        variant={status === "completed" ? "default" : "outline"}
        onClick={() => setStatus(s => s === "completed" ? undefined : "completed")}
        className="w-full md:w-auto"
      >
        Completed
      </Button>
    </div>
  );

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

      <Card>
        <CardContent className="p-0">
          <div className="h-[calc(100vh-16rem)] md:h-[calc(100vh-12rem)]">
            <MapContainer
              center={[23.2156, 72.6369]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {markers.map((marker) => (
                <Marker
                  key={marker.id}
                  position={[marker.lat, marker.lng]}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold">{marker.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Status: {marker.status}
                      </p>
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