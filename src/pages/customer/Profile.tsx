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
import { useMemo, useState } from "react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("personal");

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
                      AJ
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
                  <h2 className="text-2xl font-bold">Adewale Johnson</h2>
                  <div className="flex flex-col gap-1 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>adewale.johnson@email.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>+234 802 345 6789</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>Lagos, Nigeria</span>
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
                      <Input id="fullName" defaultValue="Adewale Johnson" className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input id="email" defaultValue="adewale.johnson@email.com" className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input id="phone" defaultValue="+234 802 345 6789" className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" defaultValue="1990-05-15" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input id="occupation" defaultValue="Software Engineer" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input id="address" defaultValue="15 Marina Street, Lagos Island, Lagos" className="pl-10" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-primary text-primary-foreground">Save Changes</Button>
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

