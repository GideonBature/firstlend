
//   const endItem = Math.min(currentPage * PAGE_SIZE, filteredTransactions.length);

//   const getStatusBadge = (status: string) => {
//     const normalizedStatus = status.toLowerCase();
//     switch (normalizedStatus) {
//       case "success":
//         return <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">Successful</Badge>;
//       case "failed":
//         return <Badge className="bg-red-100 text-red-700 border border-red-200">Failed</Badge>;
//       case "pending":
//         return <Badge className="bg-amber-100 text-amber-700 border border-amber-200">Pending</Badge>;
//       default:
//         return <Badge className="capitalize">{status}</Badge>;
//     }
//   };

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handlePrevious = () => {
//     setCurrentPage((prev) => Math.max(1, prev - 1));
//   };

//   const handleNext = () => {
//     setCurrentPage((prev) => Math.min(totalPages, prev + 1));
//   };

//   const handleExport = () => {
//     toast({
//       title: "Export Started",
//       description: "Your payment history is being exported...",
//     });
//   };

//   if (loading) {
//     return (
//       <CustomerLayout>
//         <div className="flex items-center justify-center min-h-[60vh]">
//           <div className="text-center space-y-4">
//             <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
//             <p className="text-muted-foreground">Loading payment history...</p>
//           </div>
//         </div>
//       </CustomerLayout>
//     );
//   }

//   return (
//     <CustomerLayout>
//       <div className="space-y-8">
//         <div>
//           <h1 className="text-3xl font-bold">Payment History</h1>
//           <p className="text-muted-foreground">View all your loan repayment transactions.</p>
//         </div>

//         {error && (
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
//           <div className="flex flex-1 flex-col sm:flex-row gap-3">
//             <div className="relative flex-1 min-w-[220px]">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
//               <Input
//                 value={searchTerm}
//                 onChange={(event) => setSearchTerm(event.target.value)}
//                 placeholder="Search by loan ID or transaction ID"
//                 className="pl-10 h-12 rounded-xl border-muted-foreground/20"
//               />
//             </div>
//             <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilterValue)}>
//               <SelectTrigger className="h-12 rounded-xl border-muted-foreground/20 sm:w-[160px]">
//                 <SelectValue placeholder="All Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 {STATUS_FILTER_OPTIONS.map((option) => (
//                   <SelectItem key={option.value} value={option.value}>
//                     {option.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRangeValue)}>
//               <SelectTrigger className="h-12 rounded-xl border-muted-foreground/20 sm:w-[170px]">
//                 <div className="flex items-center gap-2">
//                   <Calendar className="w-4 h-4" />
//                   <SelectValue placeholder="Date Range" />
//                 </div>
//               </SelectTrigger>
//               <SelectContent>
//                 {DATE_RANGE_OPTIONS.map((option) => (
//                   <SelectItem key={option.value} value={option.value}>
//                     {option.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <Button onClick={handleExport} className="h-12 rounded-xl px-6">
//             <Download className="w-4 h-4 mr-2" />
//             Export
//           </Button>
//         </div>

//         <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
//           <Card className="rounded-2xl border border-border/60 shadow-sm">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">Total Payments</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-3xl font-semibold text-foreground">{summary.totalPayments}</p>
//             </CardContent>
//           </Card>
//           <Card className="rounded-2xl border border-border/60 shadow-sm">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">Total Amount Paid</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-3xl font-semibold text-primary">{formatCurrency(summary.totalAmountPaid)}</p>
//             </CardContent>
//           </Card>
//           <Card className="rounded-2xl border border-border/60 shadow-sm">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">Successful</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-3xl font-semibold text-emerald-600">{summary.successful}</p>
//             </CardContent>
//           </Card>
//           <Card className="rounded-2xl border border-border/60 shadow-sm">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">Failed/Pending</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-3xl font-semibold text-red-500">{summary.failedPending}</p>
//             </CardContent>
//           </Card>
//         </div>

//         <Card className="rounded-2xl border border-border/60 shadow-sm">
//           <CardContent className="p-0">
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader className="bg-muted/30">
//                   <TableRow className="uppercase text-xs tracking-wide">
//                     <TableHead className="py-4">Transaction ID</TableHead>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Loan ID</TableHead>
//                     <TableHead>Amount</TableHead>
//                     <TableHead>Principal</TableHead>
//                     <TableHead>Interest</TableHead>
//                     <TableHead>Method</TableHead>
//                     <TableHead>Status</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {paginatedTransactions.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
//                         {payments.length === 0 
//                           ? "No payment history found. Make your first payment to see it here."
//                           : "No transactions match your filters."}
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     paginatedTransactions.map((payment) => (
//                       <TableRow key={payment.id}>
//                         <TableCell className="font-medium text-foreground font-mono text-sm">
//                           {payment.reference}
//                         </TableCell>
//                         <TableCell>{formatDate(payment.createdAt)}</TableCell>
//                         <TableCell className="font-mono text-sm">{payment.loanId.substring(0, 8)}...</TableCell>
//                         <TableCell className="font-semibold">{formatCurrency(payment.amount)}</TableCell>
//                         <TableCell>{formatCurrency(payment.principal)}</TableCell>
//                         <TableCell>{formatCurrency(payment.interest)}</TableCell>
//                         <TableCell className="capitalize">{payment.paymentMethod || "Card"}</TableCell>
//                         <TableCell>{getStatusBadge(payment.status)}</TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>

//         {filteredTransactions.length > 0 && (
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <p className="text-sm text-muted-foreground whitespace-nowrap">
//               Showing {startItem}-{endItem} of {filteredTransactions.length} payments
//             </p>
//             <Pagination className="sm:justify-end">
//               <PaginationContent className="flex items-center gap-2">
//                 <PaginationItem>
//                   <PaginationPrevious
//                     href="#"
//                     onClick={(event) => {
//                       event.preventDefault();
//                       handlePrevious();
//                     }}
//                     className={`rounded-full border border-primary/20 bg-white px-5 py-2 text-primary transition-colors hover:bg-primary/5 ${
//                       currentPage === 1 ? "opacity-50 pointer-events-none" : ""
//                     }`}
//                   />
//                 </PaginationItem>
//                 {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
//                   const page = index + 1;
//                   const isActive = page === currentPage;
//                   return (
//                     <PaginationItem key={page}>
//                       <PaginationLink
//                         href="#"
//                         onClick={(event) => {
//                           event.preventDefault();
//                           handlePageChange(page);
//                         }}
//                         isActive={isActive}
//                         className={`rounded-full border transition-colors ${
//                           isActive
//                             ? "border-primary bg-primary text-white hover:bg-primary/90"
//                             : "border-primary/20 bg-white text-primary hover:bg-primary/5"
//                         }`}
//                       >
//                         {page}
//                       </PaginationLink>
//                     </PaginationItem>
//                   );
//                 })}
//                 <PaginationItem>
//                   <PaginationNext
//                     href="#"
//                     onClick={(event) => {
//                       event.preventDefault();
//                       handleNext();
//                     }}
//                     className={`rounded-full border border-primary/20 bg-white px-5 py-2 text-primary transition-colors hover:bg-primary/5 ${
//                       currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
//                     }`}
//                   />
//                 </PaginationItem>
//               </PaginationContent>
//             </Pagination>
//           </div>
//         )}
//       </div>
//     </CustomerLayout>
//   );
// };

// export default PaymentHistory;

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
import { Search, Calendar, Download, Loader2, AlertCircle } from "lucide-react";
import { paymentApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { PaymentHistoryRecord } from "@/services/api";

type StatusFilterValue = (typeof STATUS_FILTER_OPTIONS)[number]["value"];
type DateRangeValue = (typeof DATE_RANGE_OPTIONS)[number]["value"];

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "success", label: "Successful" },
  { value: "failed", label: "Failed" },
  { value: "pending", label: "Pending" },
] as const;

const DATE_RANGE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "365", label: "Last 12 months" },
] as const;

const PAGE_SIZE = 10;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(value);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const PaymentHistory = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [dateRange, setDateRange] = useState<DateRangeValue>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payments, setPayments] = useState<PaymentHistoryRecord[]>([]);

  // Fetch payment history
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await paymentApi.getPaymentHistory({
          page: currentPage,
          pageSize: PAGE_SIZE,
        });

        if (response.success && response.data && Array.isArray(response.data)) {
          setPayments(response.data);
        } else {
          // Handle API endpoint not found - show empty state instead of error
          if (response.message?.includes('404') || response.message?.includes('Not Found')) {
            setPayments([]);
            setError(null); // Don't show error for missing endpoint
          } else {
            setError(response.message || "Failed to load payment history");
            toast({
              title: "Error",
              description: response.message || "Failed to load payment history",
              variant: "destructive",
            });
          }
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to load payment history";
        
        // Handle endpoint not found gracefully
        if (errorMsg.includes('404') || errorMsg.includes('Not Found') || errorMsg.includes('Unexpected end of JSON')) {
          setPayments([]);
          setError(null);
          console.log("Payment history endpoint not yet implemented on backend");
        } else {
          setError(errorMsg);
          console.error("Error fetching payments:", err);
          toast({
            title: "Error",
            description: errorMsg,
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [currentPage, toast]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateRange]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    const lowerSearch = searchTerm.trim().toLowerCase();
    const now = new Date();
    const threshold = new Date(now);
    if (dateRange !== "all") {
      threshold.setDate(now.getDate() - Number(dateRange));
    }

    return payments.filter((payment) => {
      const matchesSearch =
        !lowerSearch ||
        payment.transactionId.toLowerCase().includes(lowerSearch) ||
        payment.loanReference.toLowerCase().includes(lowerSearch) ||
        payment.loanId.toLowerCase().includes(lowerSearch);

      const matchesStatus =
        statusFilter === "all" ||
        payment.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesDate =
        dateRange === "all" ||
        new Date(payment.createdAt).getTime() >= threshold.getTime();

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [searchTerm, statusFilter, dateRange, payments]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const totalPayments = filteredTransactions.length;
    const totalAmountPaid = filteredTransactions.reduce((sum, p) => sum + p.amount, 0);
    const successful = filteredTransactions.filter((p) => p.status.toLowerCase() === "success").length;
    const failedPending = totalPayments - successful;

    return {
      totalPayments,
      totalAmountPaid,
      successful,
      failedPending,
    };
  }, [filteredTransactions]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE));

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredTransactions.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredTransactions, currentPage]);

  const startItem = filteredTransactions.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, filteredTransactions.length);

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "success":
        return <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">Successful</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-700 border border-red-200">Failed</Badge>;
      case "pending":
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

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
          <div className="flex flex-1 flex-col sm:flex-row gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by loan reference or transaction ID"
                className="pl-10 h-12 rounded-xl border-muted-foreground/20"
                disabled={loading}
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilterValue)} disabled={loading}>
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
            <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRangeValue)} disabled={loading}>
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
          <Button className="h-12 rounded-xl px-6" disabled={loading || filteredTransactions.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-muted-foreground">Loading payment history...</p>
            </div>
          </div>
        ) : (
          <>
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
                      <TableHead>Loan Reference</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                          {payments.length === 0 
                            ? "No payment history found. Make your first payment to see it here."
                            : "No transactions match your filters."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedTransactions.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium text-foreground font-mono text-sm">{payment.transactionId}</TableCell>
                          <TableCell>{formatDate(payment.createdAt)}</TableCell>
                          <TableCell className="font-mono text-sm">{payment.loanReference}</TableCell>
                          <TableCell className="font-semibold">{formatCurrency(payment.amount)}</TableCell>
                          <TableCell>{payment.method}</TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Pagination */}
            {filteredTransactions.length > 0 && (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground whitespace-nowrap">
                  Showing {startItem}-{endItem} of {filteredTransactions.length} payments
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
            )}
          </>
        )}
      </div>
    </CustomerLayout>
  );
};

export default PaymentHistory;
