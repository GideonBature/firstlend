import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Lock, Bell, Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("personal");
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard / Profile Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      BA
                    </AvatarFallback>
                  </Avatar>
      <div>
                    <h3 className="font-semibold text-lg">Bamidele Adekunle</h3>
                    <p className="text-sm text-muted-foreground">b.adekunle@email.com</p>
                    <Badge className="mt-2 bg-green-500 hover:bg-green-600 text-white">Online</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings Navigation */}
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

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {activeTab === "personal" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <p className="text-sm text-muted-foreground">View and update your personal details below.</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Personal Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" defaultValue="Bamidele" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" defaultValue="Adekunle" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Contact Information</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <div className="flex items-center gap-2">
                            <Input id="email" defaultValue="b.adekunle@email.com" />
                            <Badge className="bg-green-500 hover:bg-green-600 text-white">Verified</Badge>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" defaultValue="+234 801 234 5678" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Role & Department</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Input id="role" defaultValue="Super Admin" disabled />
                          <p className="text-xs text-muted-foreground">Role is assigned by system administrator</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Input id="department" defaultValue="Loan Operations" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="employeeId">Employee ID</Label>
                          <Input id="employeeId" defaultValue="FB-ADM-2024-001" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button variant="outline">Cancel</Button>
                      <Button>Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
            )}

            {activeTab === "security" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <p className="text-sm text-muted-foreground">Manage your account security and password.</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Change Password</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input id="currentPassword" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input id="newPassword" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input id="confirmPassword" type="password" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button variant="outline">Cancel</Button>
                      <Button>Update Password</Button>
                    </div>
                  </CardContent>
                </Card>
            )}

            {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <p className="text-sm text-muted-foreground">Configure how you receive notifications.</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Notification settings will be displayed here.</p>
                  </CardContent>
                </Card>
            )}

            {activeTab === "preferences" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Account Preferences</CardTitle>
                    <p className="text-sm text-muted-foreground">Manage your account preferences and settings.</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Account preferences will be displayed here.</p>
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
