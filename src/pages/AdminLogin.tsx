import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      clearError();

      if (!email.trim()) {
        toast({
          title: "Error",
          description: "Please enter your admin email",
          variant: "destructive",
        });
        return;
      }

      if (!password.trim()) {
        toast({
          title: "Error",
          description: "Please enter your password",
          variant: "destructive",
        });
        return;
      }

      await login(email, password, "admin");

      toast({
        title: "Welcome back",
        description: "Redirecting to the admin dashboard...",
      });

      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Admin login error:", err);
      toast({
        title: "Login Failed",
        description: error || "Unable to sign in. Please check your credentials.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-md shadow-2xl border-slate-800 bg-slate-950/70 text-white">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Admin Control Center</CardTitle>
            <CardDescription className="text-slate-300">
              Secure login for administrators and operational staff.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/40 rounded-md text-sm text-red-200">
              {error}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-white">
                Admin Email
              </Label>
              <Input
                id="admin-email"
                type="text"
                placeholder="e.g. admin@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white disabled:opacity-50"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-primary hover:underline disabled:opacity-50"
                disabled={isLoading}
              >
                Forgot Password?
              </button>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Login as Admin"
              )}
            </Button>
            <div className="text-center text-sm text-slate-400">
              Need to access the customer portal?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                disabled={isLoading}
                className="text-primary hover:underline font-medium disabled:opacity-50"
              >
                Go to Customer Login
              </button>
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/")}
                disabled={isLoading}
                className="text-sm text-slate-400 hover:text-white disabled:opacity-50"
              >
                ← Back to Home
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
      <footer className="absolute bottom-4 text-center text-sm text-white/60">
        © 2024 FirstLend Nigeria. All rights reserved.
      </footer>
    </div>
  );
};

export default AdminLogin;
