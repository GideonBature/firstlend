import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  DollarSign,
  Clock,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Filter,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { adminApi } from "@/services/api";
import type { LoanResponse, AdminDisbursementStats } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(value);

const statusStyles: Record<string, { badge: string; dot: string; label: string }> = {
  active: {
    badge: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
    label: "Completed",
  },
  approved: {
    badge: "bg-amber-50 text-amber-600",
    dot: "bg-amber-500",
    label: "Pending",
  },
  pending: {
    badge: "bg-blue-50 text-blue-600",
    dot: "bg-blue-500",
    label: "Processing",
  },
  rejected: {
    badge: "bg-red-50 text-red-600",
    dot: "bg-red-500",
    label: "Failed",
  },
};

const PAGE_SIZE = 10;

const AdminDisbursement = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loans, setLoans] = useState<LoanResponse[]>([]);
  const [stats, setStats] = useState<AdminDisbursementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [disbursingId, setDisbursingId] = useState<string | null>(null);
  const [detailLoan, setDetailLoan] = useState<LoanResponse | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const disburseStatus = searchParams.get("disburse_status");
    if (!disburseStatus) return;
    const normalizedStatus = disburseStatus.toLowerCase();

    const message = searchParams.get("disburse_message");
    if (normalizedStatus === "success") {
      toast({
        title: "Disbursement Successful",
        description: message || "Loan has been disbursed successfully.",
      });
      fetchLoans();
      fetchStats();
    } else {
      toast({
        title: "Disbursement Failed",
        description: message || "Unable to complete disbursement.",
        variant: "destructive",
      });
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("disburse_status");
    nextParams.delete("disburse_message");
    setSearchParams(nextParams, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await adminApi.getDisbursementStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Failed to load disbursement stats", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getDisbursementLoans({
        page: currentPage,
        pageSize: PAGE_SIZE,
        search: debouncedSearch || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });

      if (response.success) {
        setLoans(response.data || []);
        setTotalCount(response.totalCount || 0);
      } else {
        toast({
          title: "Error",
          description: response.message || "Unable to load disbursements.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch disbursements:", error);
      toast({
        title: "Error",
        description: "Something went wrong while loading disbursements.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchLoans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, statusFilter, currentPage]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const metrics = useMemo(() => {
    if (stats) {
      return {
        totalDisbursed: stats.totalDisbursedMTD,
        pendingAmount: stats.pendingAmount,
        completedToday: stats.completedToday,
        successRate: stats.successRate,
      };
    }

    const totals = loans.reduce(
      (acc, loan) => {
        const status = loan.status.toLowerCase();
        if (status === "active") {
          acc.completedCount += 1;
          acc.disbursed += loan.principal || 0;
        }
        if (status === "approved") {
          acc.pending += loan.principal || 0;
        }
        return acc;
      },
      { disbursed: 0, pending: 0, completedCount: 0 }
    );

    const completedToday = loans.filter((loan) => {
      if (loan.status.toLowerCase() !== "active") return false;
      if (!loan.createdAt) return false;
      const createdDate = new Date(loan.createdAt);
      const now = new Date();
      return (
        createdDate.getFullYear() === now.getFullYear() &&
        createdDate.getMonth() === now.getMonth() &&
        createdDate.getDate() === now.getDate()
      );
    }).length;

    const successRate = loans.length ? (totals.completedCount / loans.length) * 100 : 0;

    return {
      totalDisbursed: totals.disbursed,
      pendingAmount: totals.pending,
      completedToday,
      successRate: Math.round(successRate * 10) / 10,
    };
  }, [loans, stats]);

  const getStatusBadge = (status: string) => {
    const normalized = status.toLowerCase();
    return statusStyles[normalized] || statusStyles.pending;
  };

  const renderStatusBadge = (loan: LoanResponse) => {
    const style = getStatusBadge(loan.status);
    return (
      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${style.badge}`}>
        <span className={`h-2 w-2 rounded-full ${style.dot}`} />
        {style.label}
      </span>
    );
  };

  const handleDisburse = async (loan: LoanResponse) => {
    try {
      setDisbursingId(loan.id);
      const response = await adminApi.initializeDisbursement(loan.id);
      const authorizationUrl = response.data?.authorizationUrl;

      if (response.success) {
        if (authorizationUrl) {
          toast({
            title: "Redirecting to Paystack",
            description: "Complete the checkout to finalize this disbursement.",
          });
          window.location.assign(authorizationUrl);
        } else {
          toast({
            title: "Disbursement Initiated",
            description: response.message || "Loan marked as disbursed successfully.",
          });
          await Promise.all([fetchLoans(), fetchStats()]);
        }
        return;
      }

      const errorMessage = response.message || "Unable to initialize disbursement.";
      throw new Error(errorMessage);
    } catch (error) {
      const description = error instanceof Error ? error.message : "An unexpected error occurred.";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    } finally {
      setDisbursingId(null);
    }
  };

  const handleViewDetails = async (loanId: string) => {
    try {
      setDetailLoading(true);
      setDetailOpen(true);
      const response = await adminApi.getLoanById(loanId);
      if (response.success && response.data) {
        setDetailLoan(response.data);
      } else {
        toast({
          title: "Error",
          description: response.message || "Unable to fetch loan details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load loan details.",
        variant: "destructive",
      });
    } finally {
      setDetailLoading(false);
    }
  };

  const renderAction = (loan: LoanResponse) => {
    const status = loan.status.toLowerCase();
    if (status === "active") {
      return (
        <button
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          onClick={() => handleViewDetails(loan.id)}
        >
          View Receipt
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      );
    }
    if (status === "approved") {
      const isLoading = disbursingId === loan.id;
      return (
        <Button
          className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          onClick={() => handleDisburse(loan)}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Initiating...
            </>
          ) : (
            "Initiate"
          )}
        </Button>
      );
    }
    if (status === "pending") {
      return <span className="text-sm font-medium text-primary/70">Awaiting approval</span>;
    }
    if (status === "rejected") {
      return (
        <Button className="rounded-full bg-orange-500 px-4 py-1.5 text-sm font-semibold text-white" disabled>
          Retry
        </Button>
      );
    }
    return null;
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Disbursement Management</h1>
          <p className="text-muted-foreground">Track and manage loan disbursements</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-3xl border border-border/60 shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Disbursed (MTD)</p>
                <p className="text-2xl font-semibold text-foreground">
                  {statsLoading ? (
                    <span className="inline-flex items-center gap-2 text-base text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                    </span>
                  ) : (
                    formatCurrency(metrics.totalDisbursed)
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-border/60 shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-500">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Amount</p>
                <p className="text-2xl font-semibold text-foreground">
                  {statsLoading ? "—" : formatCurrency(metrics.pendingAmount)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-border/60 shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-semibold text-foreground">
                  {statsLoading ? "—" : metrics.completedToday}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-border/60 shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-500">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-semibold text-foreground">
                  {statsLoading ? "—" : `${metrics.successRate.toFixed(1)}%`}
                </p>
                <Progress
                  value={statsLoading ? 0 : metrics.successRate}
                  className="mt-3 h-2 bg-muted"
                  indicatorClassName="bg-primary"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-3xl border border-border/60 shadow-sm">
          <CardContent className="space-y-6 p-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto_auto] lg:items-center">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by Loan ID or Borrower..."
                  className="h-12 rounded-full border border-border/60 bg-white pl-11 text-sm shadow-sm"
                  value={searchTerm}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setSearchTerm(e.target.value);
                  }}
                />
              </div>

              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-12 rounded-full border border-border/60 bg-white px-4 text-sm font-medium shadow-sm">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status">
                    Status: {statusFilter === "all" ? "All" : statusFilter}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Pending</SelectItem>
                  <SelectItem value="active">Completed</SelectItem>
                  <SelectItem value="pending">Processing</SelectItem>
                  <SelectItem value="rejected">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="h-12 rounded-full border border-border/60 bg-white px-4 text-sm font-medium shadow-sm">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Method">
                    Method: {methodFilter === "all" ? "All" : methodFilter}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="mobile">Mobile Money</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="h-12 rounded-full border border-border/60 bg-white px-4 text-sm font-medium shadow-sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-3xl border border-dashed border-border/60">
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading disbursements...
                </div>
              ) : loans.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground">
                  No disbursement records match your filters.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="text-xs uppercase tracking-wide text-muted-foreground">
                      <TableHead>Loan ID</TableHead>
                      <TableHead>Borrower</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loans.map((loan) => (
                      <TableRow key={loan.id} className="text-sm">
                        <TableCell className="font-semibold text-primary">
                          {loan.id.split("-")[0].toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{loan.borrowerName}</span>
                            <span className="text-xs text-muted-foreground">
                              {loan.loanTypeName || "Loan Product"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(loan.principal)}</TableCell>
                        <TableCell>
                          {loan.createdAt ? new Date(loan.createdAt).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell>{renderStatusBadge(loan)}</TableCell>
                        <TableCell className="text-right">{renderAction(loan)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {!loading && loans.length > 0 && (
              <div className="flex flex-col gap-4 border-t border-border/60 pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Showing {(currentPage - 1) * PAGE_SIZE + 1}-
                  {Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount} disbursements
                </p>
                <Pagination className="sm:justify-end">
                  <PaginationContent className="gap-2">
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((prev) => Math.max(1, prev - 1));
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
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
                      if (pageNum < 1 || pageNum > totalPages) return null;
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            isActive={pageNum === currentPage}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(pageNum);
                            }}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) setDetailLoan(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Loan Details</DialogTitle>
            <DialogDescription>Summary of the disbursed loan.</DialogDescription>
          </DialogHeader>
          {detailLoading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading details...
            </div>
          ) : detailLoan ? (
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Borrower</p>
                <p className="font-semibold text-foreground">{detailLoan.borrowerName}</p>
                <p className="text-xs text-muted-foreground">{detailLoan.borrowerEmail}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Amount</p>
                  <p className="font-semibold">{formatCurrency(detailLoan.principal)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  {renderStatusBadge(detailLoan)}
                </div>
                <div>
                  <p className="text-muted-foreground">Loan Type</p>
                  <p className="font-semibold">{detailLoan.loanTypeName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Next Payment</p>
                  <p className="font-semibold">
                    {detailLoan.nextPaymentDate
                      ? new Date(detailLoan.nextPaymentDate).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">Purpose</p>
                <p className="text-foreground">{detailLoan.purpose || "N/A"}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Loan information unavailable.</p>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminDisbursement;
