import { useEffect, useMemo, useState } from "react";
import { CustomerLayout } from "@/components/customer/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Calendar, Download } from "lucide-react";

type PaymentStatus = "Successful" | "Failed" | "Pending";

type PaymentRecord = {
  transactionId: string;
  date: string; // ISO date string
  loanId: string;
  amount: number;
  principal: number;
  interest: number;
  method: string;
  status: PaymentStatus;
};

const paymentTransactions: PaymentRecord[] = [
  {
    transactionId: "TXN-20240615-001",
    date: "2024-06-15",
    loanId: "LN-0012345",
    amount: 150000,
    principal: 124500,
    interest: 25500,
    method: "Bank Transfer",
    status: "Successful",
  },
  {
    transactionId: "TXN-20240601-002",
    date: "2024-06-01",
    loanId: "LN-0012345",
    amount: 200000,
    principal: 166000,
    interest: 34000,
    method: "Direct Debit",
    status: "Successful",
  },
  {
    transactionId: "TXN-20240515-003",
    date: "2024-05-15",
    loanId: "LN-0012345",
    amount: 150000,
    principal: 124500,
    interest: 25500,
    method: "Bank Transfer",
    status: "Successful",
  },
  {
    transactionId: "TXN-20240501-004",
    date: "2024-05-01",
    loanId: "LN-0012345",
    amount: 150000,
    principal: 124500,
    interest: 25500,
    method: "Direct Debit",
    status: "Failed",
  },
  {
    transactionId: "TXN-20240415-005",
    date: "2024-04-15",
    loanId: "LN-0012345",
    amount: 100000,
    principal: 83000,
    interest: 17000,
    method: "Bank Transfer",
    status: "Pending",
  },
  {
    transactionId: "TXN-20240315-006",
    date: "2024-03-15",
    loanId: "LN-0012345",
    amount: 150000,
    principal: 123000,
    interest: 27000,
    method: "Direct Debit",
    status: "Successful",
  },
  {
    transactionId: "TXN-20240215-007",
    date: "2024-02-15",
    loanId: "LN-0012345",
    amount: 150000,
    principal: 122500,
    interest: 27500,
    method: "Bank Transfer",
    status: "Pending",
  },
  {
    transactionId: "TXN-20240115-008",
    date: "2024-01-15",
    loanId: "LN-0012345",
    amount: 150000,
    principal: 122000,
    interest: 28000,
    method: "Direct Debit",
    status: "Successful",
  },
  {
    transactionId: "TXN-20231215-009",
    date: "2023-12-15",
    loanId: "LN-0012345",
    amount: 140000,
    principal: 115000,
    interest: 25000,
    method: "Bank Transfer",
    status: "Failed",
  },
  {
    transactionId: "TXN-20231115-010",
    date: "2023-11-15",
    loanId: "LN-0012345",
    amount: 120000,
    principal: 100000,
    interest: 20000,
    method: "Direct Debit",
    status: "Successful",
  },
];

type StatusFilterValue = (typeof STATUS_FILTER_OPTIONS)[number]["value"];

type DateRangeValue = (typeof DATE_RANGE_OPTIONS)[number]["value"];

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "Successful", label: "Successful" },
  { value: "Failed", label: "Failed" },
  { value: "Pending", label: "Pending" },
] as const;

type StatusFilterValue = (typeof STATUS_FILTER_OPTIONS)[number]["value"];

const DATE_RANGE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "365", label: "Last 12 months" },
] as const;

type DateRangeValue = (typeof DATE_RANGE_OPTIONS)[number]["value"];

const PAGE_SIZE = 5;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(value);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const PaymentHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [dateRange, setDateRange] = useState<DateRangeValue>("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateRange]);

  const filteredTransactions = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase();
    const now = new Date();
    const threshold = new Date(now);
    if (dateRange !== "all") {
      threshold.setDate(now.getDate() - Number(dateRange));
    }

    return paymentTransactions.filter((transaction) => {
      const matchesSearch =
        !lowerSearch ||
        transaction.transactionId.toLowerCase().includes(lowerSearch) ||
        transaction.loanId.toLowerCase().includes(lowerSearch);

      const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;

      const matchesDate =
        dateRange === "all" || new Date(transaction.date).getTime() >= threshold.getTime();

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [searchTerm, statusFilter, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredTransactions.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredTransactions, currentPage]);

  const summary = useMemo(() => {
    const totalPayments = filteredTransactions.length;
    const totalAmountPaid = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const successful = filteredTransactions.filter((transaction) => transaction.status === "Successful").length;
    const failedPending = filteredTransactions.filter((transaction) => transaction.status !== "Successful").length;

    return {
      totalPayments,
      totalAmountPaid,
      successful,
      failedPending,
    };
  }, [filteredTransactions]);

  const startItem = filteredTransactions.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, filteredTransactions.length);

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "Successful":
        return <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">Successful</Badge>;
      case "Failed":
        return <Badge className="bg-red-100 text-red-700 border border-red-200">Failed</Badge>;
      case "Pending":
        return <Badge className="bg-amber-100 text-amber-700 border border-amber-200">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <CustomerLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Payment History</h1>
          <p className="text-muted-foreground">View all your loan repayment transactions.</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
          <div className="flex flex-1 flex-col sm:flex-row gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by loan ID or transaction ID"
                className="pl-10 h-12 rounded-xl border-muted-foreground/20"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilterValue)}>
              <SelectTrigger className="h-12 rounded-xl border-muted-foreground/20 sm:w-[160px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRangeValue)}>
              <SelectTrigger className="h-12 rounded-xl border-muted-foreground/20 sm:w-[170px]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <SelectValue placeholder="Date Range" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {DATE_RANGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="h-12 rounded-xl px-6">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-2xl border border-border/60 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-foreground">{summary.totalPayments}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-border/60 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Amount Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-primary">{formatCurrency(summary.totalAmountPaid)}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-border/60 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Successful</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-emerald-600">{summary.successful}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-border/60 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Failed/Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-red-500">{summary.failedPending}</p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions */}
        <Card className="rounded-2xl border border-border/60 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="uppercase text-xs tracking-wide">
                  <TableHead className="py-4">Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Loan ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                      No transactions match your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTransactions.map((transaction) => (
                    <TableRow key={transaction.transactionId}>
                      <TableCell className="font-medium text-foreground">{transaction.transactionId}</TableCell>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>{transaction.loanId}</TableCell>
                      <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell>{formatCurrency(transaction.principal)}</TableCell>
                      <TableCell>{formatCurrency(transaction.interest)}</TableCell>
                      <TableCell>{transaction.method}</TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground whitespace-nowrap">
            {filteredTransactions.length === 0
              ? "No payments to display"
              : `Showing ${startItem}-${endItem} of ${filteredTransactions.length} payments`}
          </p>
          <Pagination className="sm:justify-end">
            <PaginationContent className="flex items-center gap-2">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    handlePrevious();
                  }}
                  className="rounded-full border border-primary/20 bg-white px-5 py-2 text-primary transition-colors hover:bg-primary/5"
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                const isActive = page === currentPage;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        handlePageChange(page);
                      }}
                      isActive={isActive}
                      className={`rounded-full border border-primary/20 px-4 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-primary hover:bg-primary/5"
                      }`}
                      size="default"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    handleNext();
                  }}
                  className="rounded-full border border-primary/20 bg-white px-5 py-2 text-primary transition-colors hover:bg-primary/5"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default PaymentHistory;

