import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, DollarSign, Clock, CheckCircle2, TrendingUp, Calendar, Filter, ArrowUpRight } from "lucide-react";

const disbursementData = [
  {
    loanId: "LN-84521",
    borrower: "Adewale Johnson",
    amount: 5000000,
    accountNumber: "3090XXXXX",
    date: "2024-11-01",
    status: "Completed",
    method: "Bank Transfer",
  },
  {
    loanId: "LN-84520",
    borrower: "Ngozi Okafor",
    amount: 2500000,
    accountNumber: "3091XXXXX",
    date: "2024-11-02",
    status: "Processing",
    method: "Mobile Money",
  },
  {
    loanId: "LN-84519",
    borrower: "Chukwudi Eze",
    amount: 10000000,
    accountNumber: "3092XXXXX",
    date: "2024-11-02",
    status: "Pending",
    method: "Bank Transfer",
  },
  {
    loanId: "LN-84518",
    borrower: "Fatima Bello",
    amount: 750000,
    accountNumber: "3093XXXXX",
    date: "2024-11-01",
    status: "Failed",
    method: "Bank Transfer",
  },
  {
    loanId: "LN-84517",
    borrower: "Ibrahim Musa",
    amount: 3200000,
    accountNumber: "3094XXXXX",
    date: "2024-10-31",
    status: "Completed",
    method: "Mobile Money",
  },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(value);

const statusStyles: Record<
  string,
  { badge: string; dot: string; label: string }
> = {
  Completed: {
    badge: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
    label: "Completed",
  },
  Processing: {
    badge: "bg-blue-50 text-blue-600",
    dot: "bg-blue-500",
    label: "Processing",
  },
  Pending: {
    badge: "bg-amber-50 text-amber-600",
    dot: "bg-amber-500",
    label: "Pending",
  },
  Failed: {
    badge: "bg-red-50 text-red-600",
    dot: "bg-red-500",
    label: "Failed",
  },
};

const AdminDisbursement = () => {
  const renderStatusBadge = (status: string) => {
    const style = statusStyles[status] ?? statusStyles.Pending;
    return (
      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${style.badge}`}>
        <span className={`h-2 w-2 rounded-full ${style.dot}`} />
        {style.label}
      </span>
    );
  };

  const renderAction = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <button className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View Receipt
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        );
      case "Processing":
        return <span className="text-sm font-medium text-primary/70">In Progress...</span>;
      case "Pending":
        return (
          <Button className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Initiate
          </Button>
        );
      case "Failed":
        return (
          <Button className="rounded-full bg-orange-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-orange-600">
            Retry
          </Button>
        );
      default:
        return null;
    }
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
                <p className="text-2xl font-semibold text-foreground">₦125.4M</p>
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
                <p className="text-2xl font-semibold text-foreground">₦18.2M</p>
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
                <p className="text-2xl font-semibold text-foreground">15</p>
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
                <p className="text-2xl font-semibold text-foreground">98.5%</p>
                <Progress value={98.5} className="mt-3 h-2 bg-muted" indicatorClassName="bg-primary" />
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
                />
              </div>

              <Select>
                <SelectTrigger className="h-12 rounded-full border border-border/60 bg-white px-4 text-sm font-medium shadow-sm">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="h-12 rounded-full border border-border/60 bg-white px-4 text-sm font-medium shadow-sm">
                  <SelectValue placeholder="Method: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="mobile-money">Mobile Money</SelectItem>
                </SelectContent>
              </Select>

              <Select>
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

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="text-xs uppercase tracking-wide text-muted-foreground">
                    <TableHead>Loan ID</TableHead>
                    <TableHead>Borrower</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Account Number</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disbursementData.map((disbursement) => (
                    <TableRow key={disbursement.loanId} className="text-sm">
                      <TableCell className="font-semibold text-foreground">{disbursement.loanId}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{disbursement.borrower}</span>
                          <span className="text-xs text-muted-foreground">{disbursement.method}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(disbursement.amount)}</TableCell>
                      <TableCell>{disbursement.accountNumber}</TableCell>
                      <TableCell>{disbursement.date}</TableCell>
                      <TableCell>{renderStatusBadge(disbursement.status)}</TableCell>
                      <TableCell className="text-right">{renderAction(disbursement.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>Showing 1-5 of 28 disbursements</p>
          <Pagination className="md:justify-end">
            <PaginationContent className="flex items-center gap-2">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className="rounded-full border border-primary/20 bg-white px-5 py-2 text-primary transition-colors hover:bg-primary/5"
                />
              </PaginationItem>
              {[1, 2, 3, 4, 5, 6].map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === 1}
                    className={`rounded-full border border-primary/20 px-4 py-2 text-sm font-medium transition-colors ${
                      page === 1 ? "bg-primary text-primary-foreground" : "text-primary hover:bg-primary/5"
                    }`}
                    size="default"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  className="rounded-full border border-primary/20 bg-white px-5 py-2 text-primary transition-colors hover:bg-primary/5"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDisbursement;
