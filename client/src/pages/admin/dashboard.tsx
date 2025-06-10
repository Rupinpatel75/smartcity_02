
import { Card, CardContent } from "@/components/ui/card";
import { AdminLayout } from "@/components/layouts/admin-layout";
import { Bar } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const { user } = useAuth();
  
  const { data: cases = [], isLoading: casesLoading } = useQuery({
    queryKey: ["/api/v1/cases"],
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["/api/v1/admin/users"],
  });

  // Calculate statistics from real data
  const totalCases = Array.isArray(cases) ? cases.length : 0;
  const resolvedCases = Array.isArray(cases) ? cases.filter((c: any) => c.status === 'resolved').length : 0;
  const pendingCases = Array.isArray(cases) ? cases.filter((c: any) => c.status === 'pending').length : 0;
  const highPriorityCases = Array.isArray(cases) ? cases.filter((c: any) => c.priority === 'high').length : 0;
  const mediumPriorityCases = Array.isArray(cases) ? cases.filter((c: any) => c.priority === 'medium').length : 0;
  const lowPriorityCases = Array.isArray(cases) ? cases.filter((c: any) => c.priority === 'low').length : 0;
  const totalUsers = Array.isArray(users) ? users.length : 0;

  const barChartData = {
    labels: ['Total', 'Resolved', 'Pending', 'High Priority', 'Medium Priority', 'Low Priority'],
    datasets: [
      {
        label: 'Cases Count',
        data: [totalCases, resolvedCases, pendingCases, highPriorityCases, mediumPriorityCases, lowPriorityCases],
        backgroundColor: ['#3b82f6', '#4ade80', '#fbbf24', '#ef4444', '#f97316', '#22c55e'],
      },
    ],
  };

  return (
    // <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user?.username}!</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Export Report
          </button>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Overview</h2>
          <p className="text-sm text-gray-500 mb-4">Metrics Summary</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-200 rounded-full">👥</div>
                  <div>
                    <p className="text-2xl font-bold">{usersLoading ? "..." : totalUsers}</p>
                    <p className="text-sm text-gray-500">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-orange-200 rounded-full">📁</div>
                  <div>
                    <p className="text-2xl font-bold">{casesLoading ? "..." : totalCases}</p>
                    <p className="text-sm text-gray-500">Total Cases</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-200 rounded-full">✅</div>
                  <div>
                    <p className="text-2xl font-bold">{casesLoading ? "..." : resolvedCases}</p>
                    <p className="text-sm text-gray-500">Solved Cases</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-red-200 rounded-full">⏳</div>
                  <div>
                    <p className="text-2xl font-bold">{casesLoading ? "..." : pendingCases}</p>
                    <p className="text-sm text-gray-500">Pending Cases</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-emerald-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-emerald-200 rounded-full">🔴</div>
                  <div>
                    <p className="text-2xl font-bold">{casesLoading ? "..." : highPriorityCases}</p>
                    <p className="text-sm text-gray-500">High Priority</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-200 rounded-full">🟡</div>
                  <div>
                    <p className="text-2xl font-bold">{casesLoading ? "..." : mediumPriorityCases}</p>
                    <p className="text-sm text-gray-500">Medium Priority</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-pink-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-pink-200 rounded-full">🟢</div>
                  <div>
                    <p className="text-2xl font-bold">{casesLoading ? "..." : lowPriorityCases}</p>
                    <p className="text-sm text-gray-500">Low Priority</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4">Solved vs Pending Metrics</h3>
                <Bar data={barChartData} />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4">Cases Mapping by Areas</h3>
                <div className="h-[300px] bg-yellow-300 rounded-lg">
                  {/* Map placeholder - You'll need to implement actual map here */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    // {/* </AdminLayout> */}
  );
}
