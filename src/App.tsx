import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminApplications from "./pages/admin/Applications";
import AdminCustomers from "./pages/admin/Customers";
import AdminPayments from "./pages/admin/Payments";
import AdminProducts from "./pages/admin/Products";
import AdminReports from "./pages/admin/Reports";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDisbursement from "./pages/admin/Disbursement";
import AdminRisk from "./pages/admin/Risk";
import AdminSettings from "./pages/admin/Settings";
import CustomerDashboard from "./pages/customer/Dashboard";
import CustomerLoans from "./pages/customer/MyLoans";
import CustomerHistory from "./pages/customer/PaymentHistory";
import CustomerProfile from "./pages/customer/Profile";
import CustomerSupport from "./pages/customer/Support";
import ApplyLoan from "./pages/customer/ApplyLoan";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/disbursement" element={<AdminDisbursement />} />
            <Route path="/admin/risk" element={<AdminRisk />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/loans" element={<CustomerLoans />} />
            <Route path="/customer/history" element={<CustomerHistory />} />
            <Route path="/customer/profile" element={<CustomerProfile />} />
            <Route path="/customer/support" element={<CustomerSupport />} />
            <Route path="/customer/apply-loan" element={<ApplyLoan />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
