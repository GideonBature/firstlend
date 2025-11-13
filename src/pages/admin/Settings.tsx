import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Lock, Bell, Settings as SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { authApi, CurrentUserResponse } from "@/services/api";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [profile, setProfile] = useState<CurrentUserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await authApi.getCurrentUser();
        if (response.success && response.data) {
          setProfile(response.data);
        } else {
          setError(response.message || "Unable to load admin profile.");
        }
      } catch (err) {
        console.error("Failed to fetch admin profile", err);
        setError("Unable to load admin profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const fullName = profile?.fullName || "Admin User";
  const initials = useMemo(() => {
    return fullName
      .split(" ")
      .map((part) => part.at(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [fullName]);

  const [firstName, lastName] = useMemo(() => {
    const parts = fullName.split(" ");
    return [parts[0] || "", parts.slice(1).join(" ") || ""];
  }, [fullName]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard / Profile Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{fullName}</h3>
                    <p className="text-sm text-muted-foreground">{profile?.email || "—"}</p>
                    <Badge className="mt-2 bg-green-500 hover:bg-green-600 text-white">
                      {profile?.status === "Active" ? "Online" : profile?.status || "Offline"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardContent className="p-0">
                <div className="flex flex-col">
                  <button
                    onClick={() => setActiveTab("personal")}
                    className={cn(
                      "w-full flex items-center justify-start gap-3 p-4 text-left hover:bg-muted transition-colors",
                      activeTab === "personal" && "bg-primary text-primary-foreground hover:bg-primary"
                    )}
                  >
                    <User className="w-4 h-4" />
                    Personal Information
                  </button>
                  <button
                    onClick={() => setActiveTab("security")}
                    className={cn(
                      "w-full flex items-center justify-start gap-3 p-4 text-left hover:bg-muted transition-colors",
                      activeTab === "security" && "bg-primary text-primary-foreground hover:bg-primary"
                    )}
                  >
                    <Lock className="w-4 h-4" />
                    Security
                  </button>
                  <button
                    onClick={() => setActiveTab("notifications")}
                    className={cn(
                      "w-full flex items-center justify-start gap-3 p-4 text-left hover:bg-muted transition-colors",
                      activeTab === "notifications" && "bg-primary text-primary-foreground hover:bg-primary"
                    )}
                  >
                    <Bell className="w-4 h-4" />
                    Notifications
                  </button>
                  <button
                    onClick={() => setActiveTab("preferences")}
                    className={cn(
                      "w-full flex items-center justify-start gap-3 p-4 text-left hover:bg-muted transition-colors",
                      activeTab === "preferences" && "bg-primary text-primary-foreground hover:bg-primary"
                    )}
                  >
                    <SettingsIcon className="w-4 h-4" />
                    Account Preferences
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {activeTab === "personal" && (
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <p className="text-sm text-muted-foreground">View and update your personal details below.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
                  )}
                  {loading ? (
                    <div className="py-12 text-center text-muted-foreground">Loading profile...</div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <h3 className="font-semibold">Personal Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" value={firstName} readOnly />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" value={lastName} readOnly />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" value={profile?.email || ""} readOnly />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" value={profile?.phoneNumber || ""} readOnly />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold">Role & Department</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Input id="role" value={profile?.userType || "Admin"} readOnly />
                            <p className="text-sm text-muted-foreground">Role is assigned by system administrator</p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Input id="department" value={profile?.address || "—"} readOnly />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold">Account Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="employeeId">Employee ID</Label>
                            <Input id="employeeId" value={profile?.userId || ""} readOnly />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="accountNumber">Account Number</Label>
                            <Input id="accountNumber" value={profile?.accountNumber || "—"} readOnly />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-4">
                        <Button variant="outline" disabled>
                          Cancel
                        </Button>
                        <Button disabled>Save Changes</Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Security settings coming soon.</p>
                </CardContent>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Notification preferences coming soon.</p>
                </CardContent>
              </Card>
            )}

            {activeTab === "preferences" && (
              <Card>
                <CardHeader>
                  <CardTitle>Account Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Preference settings coming soon.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
