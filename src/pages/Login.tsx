import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      clearError();

      // Validate inputs
      if (!email.trim()) {
        toast({
          title: "Error",
          description: "Please enter your email or username",
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

      // Attempt login
      await login(email, password, "customer");

      // Show success toast
      toast({
        title: "Success",
        description: "Login successful!",
      });

      navigate("/customer/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      toast({
        title: "Login Failed",
        description: error || "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Loan Management Portal</CardTitle>
            <CardDescription>Welcome back, please enter your details.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
              {error}
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer-email">Username or Email</Label>
              <Input
                id="customer-email"
                type="text"
                placeholder="Enter your username or email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-password">Password</Label>
              <div className="relative">
                <Input
                  id="customer-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="button" className="text-sm text-primary hover:underline disabled:opacity-50" disabled={isLoading}>
                Forgot Password?
              </button>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              Need to verify your email?{" "}
              <button
                type="button"
                onClick={() =>
                  navigate(`/verify-email${email ? `?email=${encodeURIComponent(email)}` : ""}`)
                }
                className="text-primary hover:underline font-medium disabled:opacity-50"
                disabled={isLoading}
              >
                Enter verification code
              </button>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login as Customer"
              )}
            </Button>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                disabled={isLoading}
                className="text-primary hover:underline font-medium disabled:opacity-50"
              >
                Register
              </button>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Admin user?{" "}
              <button
                type="button"
                onClick={() => navigate("/admin/login")}
                disabled={isLoading}
                className="text-primary hover:underline font-medium disabled:opacity-50"
              >
                Go to Admin Login
              </button>
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/")}
                disabled={isLoading}
                className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
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

export default Login;
