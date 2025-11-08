import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }

    if (!phone.trim()) {
      errors.phone = "Phone number is required";
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      errors.password = "Password must contain an uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      errors.password = "Password must contain a lowercase letter";
    } else if (!/[0-9]/.test(password)) {
      errors.password = "Password must contain a number";
    } else if (!/[!@#$%^&*]/.test(password)) {
      errors.password = "Password must contain a special character (!@#$%^&*)";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      clearError();
      setValidationErrors({});

      if (!validateForm()) {
        return;
      }

      // Attempt registration
      await register(fullName, email, phone, password, address);

      // Show success toast
      toast({
        title: "Success",
        description: "Registration successful! Please log in.",
      });

      // Navigate to login
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      toast({
        title: "Registration Failed",
        description: error || "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-yellow-400" />
          <span className="font-semibold">FirstLend</span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left welcome panel */}
          <Card className="bg-[#062a5b] text-white min-h-[560px] flex">
            <CardContent className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
              <div className="mb-8">
                <div className="w-12 h-12 rounded-lg bg-yellow-400/90 ring-4 ring-white/10" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold leading-snug">
                Welcome to FirstLend Digital Lending
              </h1>
              <p className="mt-4 text-white/80 max-w-md">
                Manage your loans with ease and security. Your financial goals are just a few clicks away.
              </p>
            </CardContent>
          </Card>

          {/* Right form panel */}
          <Card className="min-h-[560px]">
            <CardContent className="p-6 lg:p-10">
              <div className="space-y-1 mb-6">
                <h2 className="text-2xl font-semibold">Create Your Account</h2>
                <p className="text-sm text-muted-foreground">Let’s get you started.</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    placeholder="e.g., John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="e.g., 123 Main Street, Lagos"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Create Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    disabled={isLoading}
                    className="text-primary hover:underline font-medium disabled:opacity-50"
                  >
                    Log In
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    ← Back to Home
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;


