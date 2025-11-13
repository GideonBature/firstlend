import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Download, Menu, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { adminApi, AdminUserStats, AdminUser } from "@/services/api";

const AdminCustomers = () => {
  const [userStats, setUserStats] = useState<AdminUserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [tableError, setTableError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("registered");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const pageSize = 10;

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

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setTableLoading(true);
        setTableError(null);
        const response = await adminApi.getUsers({ page: currentPage, pageSize });
        if (response.success) {
          setUsers(response.data || []);
          setTotalCount(response.totalCount || 0);
          setSelectedUsers(new Set());
        } else {
          setTableError(response.message || "Unable to fetch customers.");
        }
      } catch (error) {
        console.error("Failed to load users:", error);
        setTableError("Failed to load customers. Please try again.");
      } finally {
        setTableLoading(false);
      }
    };

    loadUsers();
  }, [currentPage, pageSize]);

  const formatCurrency = (amount?: number) => {
    if (typeof amount !== "number") return "--";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "--";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const normalizeLoanStatus = (status?: string) =>
    status?.toLowerCase().replace(/\s+/g, "") || "";

  const processedUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = users.filter((user) => {
      const matchesSearch =
        !term ||
        [user.fullName, user.email, user.accountNumber]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(term));

      const normalizedStatus = normalizeLoanStatus(user.loanStatus);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && normalizedStatus === "activeloan") ||
        (statusFilter === "none" && normalizedStatus === "noloan") ||
        (statusFilter === "overdue" && normalizedStatus === "overdue");

      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.fullName.localeCompare(b.fullName);
      }
      if (sortBy === "status") {
        return normalizeLoanStatus(a.loanStatus).localeCompare(
          normalizeLoanStatus(b.loanStatus)
        );
      }
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
  }, [users, searchTerm, statusFilter, sortBy]);

  const toggleSelectAll = () => {
    if (processedUsers.length === 0) {
      setSelectedUsers(new Set());
      return;
    }

    if (selectedUsers.size === processedUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(processedUsers.map((user) => user.id)));
    }
  };

  const toggleSelectUser = (id: string) => {
    setSelectedUsers((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const getLoanStatusProps = (status?: string) => {
    const normalized = normalizeLoanStatus(status);
    if (normalized === "overdue") {
      return {
        variant: "destructive" as const,
        className: "bg-yellow-500 hover:bg-yellow-600 text-white",
      };
    }
    if (normalized === "activeloan") {
      return {
        variant: "default" as const,
        className: "bg-blue-600 hover:bg-blue-700",
      };
    }
    if (normalized === "noloan") {
      return {
        variant: "outline" as const,
        className: "border-slate-200 bg-slate-100 text-slate-700",
      };
    }
    return { variant: "secondary" as const, className: "" };
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const showingStart =
    totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingEnd =
    totalCount === 0
      ? 0
      : Math.min(showingStart + users.length - 1, totalCount);

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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Status: All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Status: All</SelectItem>
                    <SelectItem value="active">Active Loan</SelectItem>
                    <SelectItem value="none">No Loan</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="registered">Date Registered</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2 w-full justify-center sm:w-auto">
                  <Download className="w-4 h-4" />
                  Export List
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {tableError && !tableLoading && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{tableError}</AlertDescription>
              </Alert>
            )}

            {tableLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                Loading customers...
              </div>
            ) : processedUsers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No customers match the current filters.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">
                          <Checkbox 
                            checked={
                              processedUsers.length > 0 &&
                              selectedUsers.size === processedUsers.length
                            }
                            onCheckedChange={toggleSelectAll}
                          />
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
                      {processedUsers.map((customer) => {
                        const { variant, className } = getLoanStatusProps(customer.loanStatus);
                        return (
                          <tr key={customer.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <Checkbox 
                                checked={selectedUsers.has(customer.id)}
                                onCheckedChange={() => toggleSelectUser(customer.id)}
                              />
                            </td>
                            <td className="py-3 px-4 font-medium text-primary">{customer.fullName}</td>
                            <td className="py-3 px-4 text-primary">{customer.accountNumber || "--"}</td>
                            <td className="py-3 px-4 text-primary">{customer.email}</td>
                            <td className="py-3 px-4">{formatDate(customer.createdAt)}</td>
                            <td className="py-3 px-4">
                              <Badge variant={variant} className={className}>
                                {customer.loanStatus || "No Loan"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Button variant="ghost" size="icon">
                                <Menu className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    {totalCount === 0
                      ? "No results"
                      : `Showing ${showingStart} to ${showingEnd} of ${totalCount} results`}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      &lt;
                    </Button>
                    
                    {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = idx + 1;
                      } else if (currentPage <= 3) {
                        pageNum = idx + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + idx;
                      } else {
                        pageNum = currentPage - 2 + idx;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          size="sm"
                          variant={currentPage === pageNum ? "default" : "outline"}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="px-2">...</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      &gt;
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;
