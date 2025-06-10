import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Award,
  TrendingUp,
  Camera,
  Star,
  Gift,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  
  const { data: userCases, isLoading: casesLoading } = useQuery({
    queryKey: ["/api/v1/cases"],
  });

  const { data: userProfile } = useQuery({
    queryKey: ["/api/v1/user/me"],
    enabled: !!user,
  });

  // Mock data for points and achievements (would come from backend)
  const pointsData = {
    totalPoints: userProfile?.points || 120,
    availableRewards: 3,
    recentEarnings: 25,
    nextRewardAt: 200,
  };

  const recentReports = userCases?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Welcome Header - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome back, {user?.username || 'Citizen'}!
              </h1>
              <p className="text-gray-600 mt-1">Monitor your reports and earn rewards for making your city better</p>
            </div>
            <Link href="/report">
              <Button className="w-full sm:w-auto">
                <Camera className="w-4 h-4 mr-2" />
                Report Issue
              </Button>
            </Link>
          </div>
        </div>

        {/* Points & Rewards Section - Mobile First */}
        <div className="mb-6 sm:mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Your Points</p>
                    <p className="text-2xl sm:text-3xl font-bold">{pointsData.totalPoints}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4" />
                    <span>{pointsData.nextRewardAt - pointsData.totalPoints} points to next reward</span>
                  </div>
                  <Link href="/rewards">
                    <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                      <Gift className="w-4 h-4 mr-2" />
                      Redeem Rewards
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Grid - Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userCases?.length || 0}</p>
                  <p className="text-sm text-gray-600">My Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {userCases?.filter(c => c.status === 'resolved')?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {userCases?.filter(c => c.status === 'pending')?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">+{pointsData.recentEarnings}</p>
                  <p className="text-sm text-gray-600">This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports & Quick Actions Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Reports */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle>Recent Reports</CardTitle>
                  <Link href="/cases">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {casesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : recentReports.length > 0 ? (
                  <div className="space-y-4">
                    {recentReports.map((report) => (
                      <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{report.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{report.location}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={report.status === 'resolved' ? 'default' : 'secondary'}
                              className={
                                report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                report.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }
                            >
                              {report.status}
                            </Badge>
                            <Badge variant="outline" className={
                              report.priority === 'high' ? 'border-red-200 text-red-700' :
                              report.priority === 'medium' ? 'border-yellow-200 text-yellow-700' :
                              'border-green-200 text-green-700'
                            }>
                              {report.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No reports yet</p>
                    <Link href="/report">
                      <Button>Create Your First Report</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/report" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Camera className="w-4 h-4 mr-2" />
                    Report New Issue
                  </Button>
                </Link>
                <Link href="/map" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="w-4 h-4 mr-2" />
                    View Map
                  </Button>
                </Link>
                <Link href="/cases" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    My Reports
                  </Button>
                </Link>
                <Link href="/rewards" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Gift className="w-4 h-4 mr-2" />
                    Rewards Center
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}