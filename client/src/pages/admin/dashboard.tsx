
import { Card, CardContent } from "@/components/ui/card";
import { AdminLayout } from "@/components/layouts/admin-layout";
import { Bar } from "react-chartjs-2";
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
  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Solved Cases',
        data: [300, 280, 250, 300, 320, 310, 340],
        backgroundColor: '#4ade80',
      },
      {
        label: 'Pending Cases',
        data: [400, 350, 380, 370, 400, 380, 420],
        backgroundColor: '#fbbf24',
      },
    ],
  };

  return (
    // <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-500">Good Afternoon, Admin !</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Export
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
                    <p className="text-2xl font-bold">5000</p>
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
                    <p className="text-2xl font-bold">4500</p>
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
                    <p className="text-2xl font-bold">3000</p>
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
                    <p className="text-2xl font-bold">1500</p>
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
                    <p className="text-2xl font-bold">5000</p>
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
                    <p className="text-2xl font-bold">5000</p>
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
                    <p className="text-2xl font-bold">5000</p>
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
