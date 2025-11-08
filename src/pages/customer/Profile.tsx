import { CustomerLayout } from "@/components/customer/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  User,
  Lock,
  FileText,
  Settings,
  Camera,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileBadge,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getInitials } from "@/lib/utils";

const Profile = () => {
  const { user, refreshUserData, changePassword, updateProfile, isLoading, error } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editedAddress, setEditedAddress] = useState(user?.address || "");
  const [addressLoading, setAddressLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user data on component mount
  useEffect(() => {
    refreshUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update edited address when user data changes
  useEffect(() => {
    setEditedAddress(user?.address || "");
  }, [user?.address]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "All password fields are required",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "New password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!editedAddress.trim()) {
      toast({
        title: "Error",
        description: "Address cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setAddressLoading(true);
    try {
      await updateProfile(editedAddress);
      toast({
        title: "Success",
        description: "Address updated successfully",
      });
      setIsEditingAddress(false);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update address",
        variant: "destructive",
      });
    } finally {
      setAddressLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedAddress(user?.address || "");
    setIsEditingAddress(false);
  };

  const userInitials = useMemo(() => getInitials(user?.fullName, "AJ"), [user?.fullName]);

  const kycRequirements = useMemo(
    () => [
      {
        id: "government-id",
        title: "Government-issued ID",
        description: "National ID, Passport, or Driver's License",
        status: "Not Uploaded",
      },
      {
        id: "address-proof",
        title: "Proof of Address",
        description: "Utility bill or bank statement (last 3 months)",
        status: "Not Uploaded",
      },
      {
        id: "utility-bill",
        title: "Recent Utility Bill",
        description: "Electricity, water, or gas bill",
        status: "Not Uploaded",
      },
    ],
    [],
  );

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information and preferences.</p>
        </div>

        {/* User Summary Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{user?.fullName || "User"}</h2>
                  <div className="flex flex-col gap-1 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{user?.email || "email@example.com"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{user?.phoneNumber || "Not provided"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{user?.address || "Not provided"}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="outline">Upload Photo</Button>
            </div>
          </CardContent>
        </Card>

        {/* KYC Verification Card */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">Complete Your KYC Verification</h3>
                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Pending</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    To unlock full access to all loan features and increase your credit limit, please complete your profile verification by uploading the required documents.
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Unlock higher loan limits
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Faster loan approval process
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Access to premium loan products
                    </li>
                  </ul>
                </div>
              </div>
              <Button>Complete KYC</Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap gap-2 bg-muted/50 p-1 rounded-full w-fit">
            <TabsTrigger value="personal" className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="w-4 h-4 mr-2" />
              Personal Information
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Lock className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="kyc" className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="w-4 h-4 mr-2" />
              KYC Documents
            </TabsTrigger>
            <TabsTrigger value="preferences" className="rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Settings className="w-4 h-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input id="fullName" value={user?.fullName || ""} readOnly className="pl-10 bg-muted" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input id="email" value={user?.email || ""} readOnly className="pl-10 bg-muted" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input id="phone" value={user?.phoneNumber || "Not provided"} readOnly className="pl-10 bg-muted" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userType">Account Type</Label>
                    <Input id="userType" value={user?.userType?.charAt(0).toUpperCase() + user?.userType?.slice(1) || ""} readOnly className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Input id="status" value={user?.status?.charAt(0).toUpperCase() + user?.status?.slice(1) || ""} readOnly className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input 
                        id="address" 
                        value={isEditingAddress ? editedAddress : (user?.address || "Not provided")}
                        onChange={(e) => setEditedAddress(e.target.value)}
                        readOnly={!isEditingAddress}
                        className={`pl-10 ${isEditingAddress ? "" : "bg-muted"}`}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  {isEditingAddress ? (
                    <>
                      <Button variant="outline" onClick={handleCancelEdit} disabled={addressLoading}>
                        Cancel
                      </Button>
                      <Button 
                        className="bg-primary text-primary-foreground" 
                        onClick={handleSaveAddress}
                        disabled={addressLoading}
                      >
                        {addressLoading ? "Saving..." : "Save Address"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        className="bg-primary text-primary-foreground"
                        onClick={() => setIsEditingAddress(true)}
                      >
                        Edit Address
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <p className="text-sm text-muted-foreground">Manage your account security and password.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handlePasswordChange}>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Change Password</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                          }
                          disabled={passwordLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                          }
                          disabled={passwordLoading}
                          placeholder="Minimum 8 characters"
                        />
                        <p className="text-xs text-muted-foreground">
                          Password must be at least 8 characters long with uppercase, lowercase, number, and special character.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                          }
                          disabled={passwordLoading}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-6">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() =>
                        setPasswordForm({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        })
                      }
                      disabled={passwordLoading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={passwordLoading}>
                      {passwordLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kyc" className="space-y-6">
            <Card className="rounded-2xl border border-border/60 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">KYC Documents</CardTitle>
                <p className="text-sm text-muted-foreground">Verify your identity to unlock premium features.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="rounded-2xl border border-blue-200 bg-blue-50 text-blue-800">
                  <AlertTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Document Verification Status
                  </AlertTitle>
                  <AlertDescription className="text-sm">
                    Your documents are pending verification. Complete the process to unlock premium features.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Required Documents</h3>
                  <div className="space-y-4">
                    {kycRequirements.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-border/60 bg-card px-4 py-5 shadow-sm"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/10 bg-primary/5 text-primary">
                            <FileBadge className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-base font-semibold text-foreground">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                        <Badge className="w-fit rounded-full bg-amber-100 text-amber-600 border border-amber-200 px-3 py-1 text-xs font-medium">
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button className="rounded-full bg-yellow-400 px-8 py-5 text-base font-semibold text-white hover:bg-yellow-500">
                    Upload Documents
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <p className="text-sm text-muted-foreground">Manage your account preferences.</p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Preferences settings will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CustomerLayout>
  );
};

export default Profile;

