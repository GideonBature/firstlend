import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Download, MoreVertical, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { adminApi, AdminUserStats } from "@/services/api";

const customers = [
  { name: "Adewale Adeyemi", account: "3090XXXXX", email: "adewale.a@email.com", registered: "12 Jan 2023", status: "Active Loan" },
  { name: "Ngozi Okonkwo", account: "3091XXXXX", email: "ngozi.o@email.com", registered: "15 Feb 2023", status: "No Loan" },
  { name: "Emeka Nwosu", account: "3092XXXXX", email: "emeka.n@email.com", registered: "21 Mar 2023", status: "Overdue" },
  { name: "Fatima Bello", account: "3093XXXXX", email: "fatima.b@email.com", registered: "05 Apr 2023", status: "No Loan" },
  { name: "Chinedu Eze", account: "3094XXXXX", email: "chinedu.e@email.com", registered: "18 May 2023", status: "Active Loan" },
];

const AdminCustomers = () => {
  const [userStats, setUserStats] = useState<AdminUserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError(null);
        const response = await adminApi.getUserStats();
        if (response.success && response.data) {
          setUserStats(response.data);
        } else {
          setStatsError(response.message || "Unable to fetch user statistics.");
        }
      } catch (error) {
        console.error("Failed to load user stats:", error);
        setStatsError("An unexpected error occurred while loading stats.");
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

  const formatCurrency = (amount?: number) => {
    if (typeof amount !== "number") return "--";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statsCards = [
    {
      label: "Total Users",
      value: userStats?.totalUsers?.toLocaleString() ?? "--",
      helper: "All registered customers",
    },
    {
      label: "Active Users",
      value: userStats?.activeUsers?.toLocaleString() ?? "--",
      helper: "Currently active accounts",
    },
    {
      label: "Users With Loans",
      value: userStats?.usersWithLoans?.toLocaleString() ?? "--",
      helper: "At least one loan",
    },
    {
      label: "Total Borrowed",
      value: formatCurrency(userStats?.totalBorrowedAmount),
      helper: "Total principal disbursed",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Customers</h1>
            <p className="text-muted-foreground">View all registered users and their loan history.</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add New Customer
          </Button>
        </div>

        {statsError && (
          <Alert variant="destructive">
            <AlertDescription>{statsError}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {statsCards.map((card) => (
            <Card key={card.label}>
              <CardHeader className="pb-2">
                <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary flex items-center gap-2 min-h-[32px]">
                  {statsLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  ) : (
                    card.value
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{card.helper}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, account number, or email..." 
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status: All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Status: All</SelectItem>
                    <SelectItem value="active">Active Loan</SelectItem>
                    <SelectItem value="none">No Loan</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="registered">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="registered">Date Registered</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export List
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">
                      <Checkbox />
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Customer Name</th>
                    <th className="text-left py-3 px-4 font-medium">Account Number</th>
                    <th className="text-left py-3 px-4 font-medium">Email Address</th>
                    <th className="text-left py-3 px-4 font-medium">Date Registered</th>
                    <th className="text-left py-3 px-4 font-medium">Loan Status</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <Checkbox />
                      </td>
                      <td className="py-3 px-4 font-medium text-primary">{customer.name}</td>
                      <td className="py-3 px-4 text-primary">{customer.account}</td>
                      <td className="py-3 px-4 text-primary">{customer.email}</td>
                      <td className="py-3 px-4">{customer.registered}</td>
                      <td className="py-3 px-4">
                        <Badge 
                          variant={
                            customer.status === "Active Loan" ? "default" : 
                            customer.status === "Overdue" ? "destructive" : 
                            "secondary"
                          }
                          className={
                            customer.status === "Overdue" ? "bg-yellow-500 hover:bg-yellow-600" : ""
                          }
                        >
                          {customer.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">Showing 1 to 5 of 97 results</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">&lt;</Button>
                <Button size="sm">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">...</Button>
                <Button variant="outline" size="sm">20</Button>
                <Button variant="outline" size="sm">&gt;</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
