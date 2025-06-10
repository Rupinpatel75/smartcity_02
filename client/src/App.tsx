
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { AdminLayout } from "@/components/layouts/admin-layout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/context/AuthContext";
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
import AdminLogin from "@/pages/admin-login";
import EmployeeLogin from "@/pages/employee-login";
import AdminDashboard from "@/pages/admin-dashboard";
import EmployeeDashboard from "@/pages/employee-dashboard";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Switch>
        {/* Public routes */}
        <Route path="/" component={Home} />
        
        {/* Login routes for different user types */}
        <Route path="/login" component={Login} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/employee/login" component={EmployeeLogin} />
        <Route path="/signup" component={SignUp} />
        
        {/* Citizen routes */}
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

        {/* Admin routes */}
        <Route path="/admin/dashboard">
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </Route>

        {/* Employee routes */}
        <Route path="/employee/dashboard">
          <AuthLayout>
            <EmployeeDashboard />
          </AuthLayout>
        </Route>

        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <QueryClientProvider client={queryClient}>
          <Router />
          <Toaster />
        </QueryClientProvider>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;
