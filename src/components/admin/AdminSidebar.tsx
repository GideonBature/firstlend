import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  DollarSign, 
  Package, 
  UserCog, 
  Wallet, 
  Settings,
  LogOut,
  Briefcase
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/admin/dashboard" },
  { title: "Applications", icon: FileText, url: "/admin/applications" },
  { title: "Customers", icon: Users, url: "/admin/customers" },
  { title: "Payments", icon: DollarSign, url: "/admin/payments" },
  { title: "Products", icon: Package, url: "/admin/products" },
  { title: "Admin Users", icon: UserCog, url: "/admin/users" },
  { title: "Disbursement", icon: Wallet, url: "/admin/disbursement" },
  { title: "Settings", icon: Settings, url: "/admin/settings" },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const { user, logout, isLoading } = useAuth();
  const { toast } = useToast();
  const userInitials = getInitials(user?.fullName, "AN");

  const isActive = (url: string) => location.pathname === url;

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      navigate("/admin/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-5 h-5 text-primary-foreground" />
          </div>
          {state === "expanded" && (
            <div>
              <h2 className="font-bold text-lg">FirstLend</h2>
              <p className="text-xs text-muted-foreground">Loan Management</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          {state === "expanded" && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user?.fullName || 'Admin'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          )}
        </div>
        <SidebarMenuButton
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
