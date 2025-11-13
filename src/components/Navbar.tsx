import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, Settings } from "lucide-react";
import { getInitials } from "@/lib/utils";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isLoading, userType } = useAuth();
  const { toast } = useToast();
  const userInitials = getInitials(user?.fullName, "U");

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const handleDashboard = () => {
    if (userType === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/customer/dashboard");
    }
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-primary/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-xl">F</span>
            </div>
            <span className="text-primary-foreground font-bold text-xl">FirstLend</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-primary-foreground hover:text-accent transition-colors font-medium">
              Home
            </Link>
            <a href="#products" className="text-primary-foreground hover:text-accent transition-colors font-medium">
              Loan Products
            </a>
            <a href="#calculator" className="text-primary-foreground hover:text-accent transition-colors font-medium">
              Calculator
            </a>
            <a href="#about" className="text-primary-foreground hover:text-accent transition-colors font-medium">
              About Us
            </a>
            <a href="#testimonials" className="text-primary-foreground hover:text-accent transition-colors font-medium">
              Testimonials
            </a>
            <a href="#contact" className="text-primary-foreground hover:text-accent transition-colors font-medium">
              Contact
            </a>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDashboard}
                >
                  Dashboard
                </Button>
                
                {/* User Menu Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.fullName || 'User'}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {userType === "admin" ? "Administrator" : "Customer"}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {userType === "customer" && (
                      <DropdownMenuItem onClick={() => navigate("/customer/profile")}>
                        <User className="mr-2 h-4 w-4" />
                        <span>My Profile</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout} disabled={isLoading} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-primary-foreground hover:text-accent hover:bg-primary-foreground/10">
                    Customer Login
                  </Button>
                </Link>
                <Link to="/admin/login">
                  <Button variant="ghost" className="text-primary-foreground hover:text-accent hover:bg-primary-foreground/10">
                    Admin Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-yellow">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
