import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminApplications from "./pages/admin/Applications";
import AdminCustomers from "./pages/admin/Customers";
import AdminPayments from "./pages/admin/Payments";
import AdminProducts from "./pages/admin/Products";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDisbursement from "./pages/admin/Disbursement";
import AdminSettings from "./pages/admin/Settings";
import CustomerDashboard from "./pages/customer/Dashboard";
import CustomerLoans from "./pages/customer/MyLoans";
import MyLoansDetails from "./pages/customer/MyLoansDetail";
import CustomerHistory from "./pages/customer/PaymentHistory";
import CustomerProfile from "./pages/customer/Profile";
import CustomerSupport from "./pages/customer/Support";
import ApplyLoan from "./pages/customer/ApplyLoan";
import PaymentSuccess from "./pages/customer/PaymentSuccess";
import PaymentFailed from "./pages/customer/PaymentFailed";
import NotFound from "./pages/NotFound";
import FirstLendChat from "./pages/customer/FirstLendChat";

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
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedUserTypes={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/applications"
              element={
                <ProtectedRoute allowedUserTypes={["admin"]}>
                  <AdminApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/customers"
              element={
                <ProtectedRoute allowedUserTypes={["admin"]}>
                  <AdminCustomers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/payments"
              element={
                <ProtectedRoute allowedUserTypes={["admin"]}>
                  <AdminPayments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute allowedUserTypes={["admin"]}>
                  <AdminProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedUserTypes={["admin"]}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/disbursement"
              element={
                <ProtectedRoute allowedUserTypes={["admin"]}>
                  <AdminDisbursement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedUserTypes={["admin"]}>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/dashboard"
              element={
                <ProtectedRoute allowedUserTypes={["customer"]}>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/loans"
              element={
                <ProtectedRoute allowedUserTypes={["customer"]}>
                  <CustomerLoans />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/my-loans"
              element={
                <ProtectedRoute allowedUserTypes={["customer"]}>
                  <CustomerLoans />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/loan-details/:id"
              element={
                <ProtectedRoute allowedUserTypes={['customer']}>
                  <MyLoansDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/history"
              element={
                <ProtectedRoute allowedUserTypes={["customer"]}>
                  <CustomerHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/payment-history"
              element={
                <ProtectedRoute allowedUserTypes={["customer"]}>
                  <CustomerHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/profile"
              element={
                <ProtectedRoute allowedUserTypes={["customer"]}>
                  <CustomerProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/support"
              element={
                <ProtectedRoute allowedUserTypes={["customer"]}>
                  <CustomerSupport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/chat"
              element={
                <ProtectedRoute allowedUserTypes={["customer"]}>
                  <FirstLendChat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/apply-loan"
              element={
                <ProtectedRoute allowedUserTypes={["customer"]}>
                  <ApplyLoan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/success"
              element={
                <ProtectedRoute allowedUserTypes={["customer"]}>
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/failed"
              element={
                <ProtectedRoute allowedUserTypes={["customer"]}>
                  <PaymentFailed />
                </ProtectedRoute>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
