import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCaseSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { 
  Camera, 
  MapPin, 
  Upload, 
  AlertTriangle,
  CheckCircle,
  Info,
  Loader2,
  Navigation,
  Smartphone
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

function LocationMarker({ position, setPosition }: { position: [number, number] | null; setPosition: (pos: [number, number] | null) => void }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function Report() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<{
    detected: boolean;
    confidence: number;
    issueType: string;
  } | null>(null);
  const [position, setPosition] = useState<[number, number] | null>(null);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      priority: "medium",
      location: "",
      latitude: "",
      longitude: "",
    },
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          setPosition([latitude, longitude]);
          setLocationAccuracy(accuracy);
          form.setValue("latitude", latitude.toString());
          form.setValue("longitude", longitude.toString());
          form.setValue("location", `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          
          toast({
            title: "Location Detected",
            description: `Location found with ${Math.round(accuracy)}m accuracy`,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          let errorMessage = "Could not get your location. ";
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Please allow location access in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "Location request timed out. Try again.";
              break;
            default:
              errorMessage += "An unknown error occurred.";
              break;
          }
          
          toast({
            title: "Location Error",
            description: errorMessage,
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive",
      });
    }
  }, []);

  // Mock AI Analysis (would connect to YOLOv8 backend in production)
  const analyzeImage = async (file: File) => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI analysis results based on filename or random
    const mockResults = [
      { detected: true, confidence: 85, issueType: "Pothole" },
      { detected: true, confidence: 92, issueType: "Road Crack" },
      { detected: true, confidence: 78, issueType: "Damaged Pavement" },
      { detected: false, confidence: 45, issueType: "No Infrastructure Issue" },
    ];
    
    return mockResults[Math.floor(Math.random() * mockResults.length)];
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Start AI analysis
      toast({
        title: "Analyzing Image",
        description: "AI is analyzing your photo for infrastructure issues...",
      });

      try {
        const analysis = await analyzeImage(file);
        setAiAnalysis(analysis);
        
        if (analysis.detected && analysis.confidence > 60) {
          form.setValue("category", "Infrastructure");
          form.setValue("title", `${analysis.issueType} Detected`);
          toast({
            title: "Issue Detected!",
            description: `AI detected: ${analysis.issueType} (${analysis.confidence}% confidence)`,
          });
        } else {
          toast({
            title: "No Issues Detected",
            description: "AI couldn't detect infrastructure issues. You can still submit your report.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Analysis Failed",
          description: "Could not analyze image. Please continue manually.",
          variant: "destructive",
        });
      }
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setPosition([latitude, longitude]);
        setLocationAccuracy(accuracy);
        form.setValue("latitude", latitude.toString());
        form.setValue("longitude", longitude.toString());
        setIsGettingLocation(false);
        
        toast({
          title: "Location Updated",
          description: `Accurate to ${Math.round(accuracy)}m`,
        });
      },
      (error) => {
        setIsGettingLocation(false);
        toast({
          title: "Location Error",
          description: "Could not get your location. Please enter manually or try again.",
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/v1/cases", data);
      if (!response.ok) {
        throw new Error("Failed to submit report");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your report has been submitted successfully.",
      });
      form.reset();
      setSelectedFile(null);
      setImagePreview(null);
      setAiAnalysis(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (formData: any) => {
    // Validate required fields on frontend
    if (!formData.title || !formData.description || !formData.category || !formData.latitude || !formData.longitude) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields: title, description, category, and location.",
        variant: "destructive",
      });
      return;
    }

    console.log("Form data being submitted:", formData);

    const data = new FormData();
    data.append("title", formData.title.trim());
    data.append("description", formData.description.trim());
    data.append("category", formData.category);
    data.append("priority", formData.priority || "medium");
    data.append("latitude", formData.latitude);
    data.append("longitude", formData.longitude);
    data.append("location", formData.location || `${formData.latitude}, ${formData.longitude}`);

    if (selectedFile) {
      data.append("image", selectedFile);
    }

    // Debug log the form submission
    console.log("Submitting form data with required fields:", {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      latitude: formData.latitude,
      longitude: formData.longitude
    });

    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Report Infrastructure Issue
          </h1>
          <p className="text-gray-600">
            Help improve your community by reporting infrastructure problems. Your contribution earns you points!
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Image Upload Section - Mobile First */}
              <div className="xl:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Photo Upload & AI Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Camera Input */}
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="camera-input"
                      />
                      <label
                        htmlFor="camera-input"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <Camera className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Tap to capture or upload photo</span>
                      </label>
                    </div>

                    {/* Image Preview & AI Analysis */}
                    {imagePreview && (
                      <div className="space-y-3">
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Issue Preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>

                        {/* AI Analysis Results */}
                        {aiAnalysis && (
                          <Card className={`border ${
                            aiAnalysis.detected 
                              ? 'border-green-200 bg-green-50' 
                              : 'border-orange-200 bg-orange-50'
                          }`}>
                            <CardContent className="p-3">
                              <div className="flex items-center gap-2 mb-2">
                                {aiAnalysis.detected ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                                )}
                                <span className="font-medium text-sm">
                                  AI Analysis Complete
                                </span>
                              </div>
                              {aiAnalysis.detected ? (
                                <div className="space-y-1">
                                  <p className="text-sm text-green-700">
                                    Issue detected: <strong>{aiAnalysis.issueType}</strong>
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-green-200 rounded-full h-2">
                                      <div 
                                        className="bg-green-600 h-2 rounded-full" 
                                        style={{ width: `${aiAnalysis.confidence}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-green-600 font-medium">
                                      {aiAnalysis.confidence}%
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm text-orange-700">
                                  No infrastructure issues detected. You can still submit your report.
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Form Fields Section */}
              <div className="xl:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Issue Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Issue Title *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Brief description of the issue"
                              className="w-full"
                              required
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} required>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select issue type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                              <SelectItem value="Road">Road Damage</SelectItem>
                              <SelectItem value="Lighting">Street Lighting</SelectItem>
                              <SelectItem value="Drainage">Drainage</SelectItem>
                              <SelectItem value="Utilities">Utilities</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority Level</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Detailed Description *</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Provide detailed information about the issue..."
                              className="min-h-[100px]"
                              required
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Location Section */}
              <div className="xl:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Location & Map
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Location Status */}
                    {!position && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-800 mb-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="font-medium">Location Required</span>
                        </div>
                        <p className="text-sm text-yellow-700 mb-3">
                          Please allow location access or enter manually to submit your report.
                        </p>
                        <div className="space-y-2">
                          <p className="text-xs text-yellow-600">
                            <strong>To enable location:</strong>
                          </p>
                          <ul className="text-xs text-yellow-600 space-y-1">
                            <li>• Click the location icon in your browser address bar</li>
                            <li>• Select "Allow" when prompted for location access</li>
                            <li>• Or click "Use My Location" button below</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Location Controls */}
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={position ? "outline" : "default"}
                          onClick={getCurrentLocation}
                          disabled={isGettingLocation}
                          className="flex-1"
                        >
                          {isGettingLocation ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Navigation className="w-4 h-4 mr-2" />
                          )}
                          {isGettingLocation ? 'Detecting Location...' : position ? 'Update Location' : 'Use My Location'}
                        </Button>
                        {position && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setPosition(null);
                              setLocationAccuracy(null);
                              form.setValue("latitude", "");
                              form.setValue("longitude", "");
                              form.setValue("location", "");
                            }}
                          >
                            Clear
                          </Button>
                        )}
                      </div>

                      {position && locationAccuracy && (
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                          <CheckCircle className="w-4 h-4" />
                          <span>Location detected (±{Math.round(locationAccuracy)}m accuracy)</span>
                        </div>
                      )}
                    </div>

                    {/* Address Input */}
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address/Location Description</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Street address or landmark"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Manual Location Entry */}
                    {!position && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">Manual Location Entry</h4>
                        <p className="text-xs text-blue-600 mb-3">
                          If location detection isn't working, you can enter coordinates manually:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <FormField
                            control={form.control}
                            name="latitude"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Latitude *</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="e.g. 23.0225"
                                    type="number"
                                    step="any"
                                    onChange={(e) => {
                                      field.onChange(e);
                                      const lat = parseFloat(e.target.value);
                                      const lng = parseFloat(form.getValues("longitude"));
                                      if (!isNaN(lat) && !isNaN(lng)) {
                                        setPosition([lat, lng]);
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="longitude"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Longitude *</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="e.g. 72.5714"
                                    type="number"
                                    step="any"
                                    onChange={(e) => {
                                      field.onChange(e);
                                      const lat = parseFloat(form.getValues("latitude"));
                                      const lng = parseFloat(e.target.value);
                                      if (!isNaN(lat) && !isNaN(lng)) {
                                        setPosition([lat, lng]);
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <p className="text-xs text-blue-500 mt-2">
                          You can find coordinates using Google Maps or any map application
                        </p>
                      </div>
                    )}

                    {/* Coordinates Display */}
                    {position && (
                      <div className="grid grid-cols-2 gap-2">
                        <FormField
                          control={form.control}
                          name="latitude"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Latitude</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="0.0000" readOnly />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="longitude"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Longitude</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="0.0000" readOnly />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Map Preview */}
                    {position && (
                      <div className="w-full h-48 rounded-lg overflow-hidden border">
                        <MapContainer
                          center={position}
                          zoom={16}
                          style={{ height: "100%", width: "100%" }}
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="© OpenStreetMap contributors"
                          />
                          <LocationMarker position={position} setPosition={setPosition} />
                        </MapContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Submit Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-blue-500" />
                    <div className="text-sm text-gray-600">
                      <p>Your report will be reviewed and earn you <strong>10 points</strong> when submitted.</p>
                      <p>Verified reports earn an additional <strong>15 points</strong>.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => form.reset()}
                      className="flex-1 sm:flex-none"
                    >
                      Reset Form
                    </Button>
                    <Button
                      type="submit"
                      disabled={mutation.isPending}
                      className="flex-1 sm:flex-none"
                    >
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Submit Report
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}