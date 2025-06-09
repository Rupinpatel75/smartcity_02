
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { AdminLayout } from "@/components/layouts/admin-layout";
import { SidebarProvider } from "@/components/ui/sidebar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import SignUp from "@/pages/signup";
import Dashboard from "@/pages/dashboard";
import Map from "@/pages/map";
import Report from "@/pages/report";
import Rewards from "@/pages/rewards";
import Cases from "@/pages/cases";
import Settings from "@/pages/settings";
import AdminDashboard from "@/pages/admin/dashboard";
import ViewEmployees from "@/pages/admin/employees";
import AddEmployee from "@/pages/admin/add-employee";
import AssignTask from "@/pages/admin/assign-task";
import Complani from "@/pages/admin/mange-complani";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Switch>
        {/* Public routes */}
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/SignUp" component={SignUp} />
        
        {/* Protected routes with AuthLayout */}
        <Route path="/dashboard">
          <AuthLayout>
            <Dashboard />
          </AuthLayout>
        </Route>
        <Route path="/map">
          <AuthLayout>
            <Map />
          </AuthLayout>
        </Route>
        <Route path="/report">
          <AuthLayout>
            <Report />
          </AuthLayout>
        </Route>
        <Route path="/rewards">
          <AuthLayout>
            <Rewards />
          </AuthLayout>
        </Route>
        <Route path="/cases">
          <AuthLayout>
            <Cases />
          </AuthLayout>
        </Route>
        <Route path="/settings">
          <AuthLayout>
            <Settings />
          </AuthLayout>
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/dashboard">
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </Route>
        <Route path="/admin/employees">
          <AdminLayout>
            <ViewEmployees />
          </AdminLayout>
        </Route>
        <Route path="/admin/add-employee">
          <AdminLayout>
            <AddEmployee />
          </AdminLayout>
        </Route>
        <Route path="/admin/mange-complani">
          <AdminLayout>
            <Complani />
          </AdminLayout>
        </Route>
        <Route path="/admin/assign-task">
          <AdminLayout>
            <AssignTask />
          </AdminLayout>
        </Route>
        <Route path="/admin/users">
          <AdminLayout>
            <div className="h-full p-6">
              <h1 className="text-2xl font-bold mb-6">Users Management</h1>
              <p>Manage system users here</p>
            </div>
          </AdminLayout>
        </Route>
        <Route path="/admin/reports">
          <AdminLayout>
            <div className="h-full p-6">
              <h1 className="text-2xl font-bold mb-6">Reports Management</h1>
              <p>Manage user reports here</p>
            </div>
          </AdminLayout>
        </Route>
        <Route path="/users">
          <AuthLayout>
            <div className="h-full p-6">
              <h1 className="text-2xl font-bold mb-6">Users</h1>
              <p>Users management page</p>
            </div>
          </AuthLayout>
        </Route>
        <Route path="/case-report">
          <AuthLayout>
            <div className="h-full p-6">
              <h1 className="text-2xl font-bold mb-6">Case Reports</h1>
              <p>Case reports and analytics</p>
            </div>
          </AuthLayout>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <SidebarProvider>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </SidebarProvider>
  );
}

export default App;
