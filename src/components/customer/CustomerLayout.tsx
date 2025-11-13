import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MakePaymentModal } from "./MakePaymentModal";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Bell, LayoutDashboard, FileText, History, User, HelpCircle, LogOut, Settings, Menu } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";

interface CustomerLayoutProps {
  children: ReactNode;
}

export function CustomerLayout({ children }: CustomerLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isLoading } = useAuth();
  const { toast } = useToast();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const userInitials = getInitials(user?.fullName, "CL");

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { title: "Dashboard", path: "/customer/dashboard", icon: LayoutDashboard },
    { title: "My Loans", path: "/customer/loans", icon: FileText },
    { title: "History", path: "/customer/history", icon: History },
    { title: "Profile", path: "/customer/profile", icon: User },
    { title: "Support", path: "/customer/support", icon: HelpCircle },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
        <header className="sticky top-0 z-50 w-full border-b bg-background">
          <div className="container flex flex-wrap items-center gap-3 px-4 py-3 md:h-16">
            <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="w-5 h-5" />
                    <span className="sr-only">Open navigation menu</span>
                  </Button>
                </SheetTrigger>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">FL</span>
                  </div>
                  <span className="font-bold text-xl">FirstLend</span>
                </div>
              </div>
              <nav className="hidden md:flex flex-wrap items-center gap-4 md:gap-6">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={cn(
                      "flex items-center gap-2 text-sm font-medium transition-colors",
                      isActive(item.path)
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.title}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigate("/customer/loans")}
                className="hidden lg:inline-flex"
              >
                View Schedule
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setPaymentModalOpen(true); setIsMobileNavOpen(false); }}
                className="hidden lg:inline-flex"
              >
                Make Payment
              </Button>
              <Button
                size="sm"
                onClick={() => handleNavigate("/customer/apply-loan")}
                className="hidden lg:inline-flex"
              >
                Apply for New Loan
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* User Menu Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-8 h-8 cursor-pointer">
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
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigate("/customer/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigate("/customer/profile")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} disabled={isLoading} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <SheetContent side="left" className="w-full sm:max-w-sm">
          <SheetHeader className="items-start">
            <SheetTitle>Quick Actions</SheetTitle>
            <p className="text-sm text-muted-foreground">
              Navigate through your account and manage payments.
            </p>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  className="justify-start"
                  onClick={() => handleNavigate(item.path)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              ))}
            </nav>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleNavigate("/customer/loans")}
              >
                View Schedule
              </Button>
              <Button
                className="w-full justify-center"
                onClick={() => { setPaymentModalOpen(true); setIsMobileNavOpen(false); }}
              >
                Make Payment
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-center"
                onClick={() => handleNavigate("/customer/apply-loan")}
              >
                Apply for New Loan
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Make Payment Modal */}
      <MakePaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        loanId=""
        outstandingBalance={0}
        monthlyPayment={0}
        onSuccess={() => {
          // Optionally refresh data or show notification
          console.log("Payment successful!");
        }}
      />
    </div>
  );
}

