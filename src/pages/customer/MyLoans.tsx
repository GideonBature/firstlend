import { useState, useEffect } from "react";
import { CustomerLayout } from "@/components/customer/CustomerLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MakePaymentModal } from "@/components/customer/MakePaymentModal";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { loanApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { LoanResponse } from "@/services/api";
import { useNavigate } from "react-router-dom";

const statusFilters = ["All", "pending", "approved", "active", "paid", "overdue", "rejected"] as const;

type StatusFilter = (typeof statusFilters)[number];

const getStatusDisplay = (status: string) => {
  const statusMap: { [key: string]: string } = {
    pending: "Pending",
    active: "Active",
    paid: "Paid",
    overdue: "Overdue",
    rejected: "Rejected",
    approved: "Approved",
  };
  return statusMap[status.toLowerCase()] || status;
};

const getStatusBadge = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case "approved":
      return <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">Approved</Badge>;
    case "active":
      return <Badge className="bg-blue-100 text-blue-700 border border-blue-200">Active</Badge>;
    case "pending":
      return <Badge className="bg-slate-100 text-slate-600 border border-slate-200">Pending</Badge>;
    case "rejected":
      return <Badge className="bg-slate-200 text-slate-600 border border-slate-300">Rejected</Badge>;
    case "overdue":
      return <Badge className="bg-red-100 text-red-700 border border-red-200">Overdue</Badge>;
    case "paid":
      return <Badge className="bg-green-100 text-green-700 border border-green-200">Paid</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const getProgressValue = (loan: LoanResponse) => {
  if (loan.status.toLowerCase() === "paid") return 100;
  if (!loan.principal || !loan.outstandingBalance) return 0;
  return Math.round(((loan.principal - loan.outstandingBalance) / loan.principal) * 100);
};

const getProgressIndicatorClass = (status: string) => {
  if (status.toLowerCase() === "overdue") {
    return "bg-red-500";
  }
  return "bg-primary";
};

const MyLoans = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<{ id: string; outstanding: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loans, setLoans] = useState<LoanResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch loans on mount or page change
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await loanApi.getMyLoans({ page: currentPage, pageSize: 10 });
        if (response.success && response.data && Array.isArray(response.data)) {
          setLoans(response.data);
          // Get total count from response metadata if available
          setTotalCount(response.data.length);
        } else {
          setError(response.message || "Failed to load loans");
          toast({
            title: "Error",
            description: response.message || "Failed to load loans",
            variant: "destructive",
          });
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to load your loans";
        setError(errorMsg);
        console.error("Error fetching loans:", err);
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [currentPage, toast]);

  const handleMakePayment = (loan: LoanResponse) => {
    setSelectedLoan({
      id: loan.id,
      outstanding: loan.outstandingBalance,
    });
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    // Refresh loans after payment
    const fetchLoans = async () => {
      try {
        const response = await loanApi.getMyLoans({ page: currentPage, pageSize: 10 });
        if (response.success && response.data && Array.isArray(response.data)) {
          setLoans(response.data);
        }
      } catch (err) {
        console.error("Error refreshing loans:", err);
      }
    };

    fetchLoans();
    setPaymentModalOpen(false);
  };

  const filterLoans = (status: StatusFilter) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return loans.filter((loan) => {
      const matchesStatus = status === "All" ? true : loan.status.toLowerCase() === status;
      const matchesSearch =
        !normalizedSearch ||
        loan.loanTypeName.toLowerCase().includes(normalizedSearch) ||
        loan.id.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  };

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Loans</h1>
            <p className="text-muted-foreground">View and manage all your loan accounts.</p>
          </div>
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2"
            onClick={() => navigate("/customer/apply-loan")}
          >
            Apply for a New Loan
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-muted-foreground">Loading your loans...</p>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="All" className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[220px] max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by loan type or ID"
                  className="pl-10"
                />
              </div>
              <TabsList className="flex flex-wrap gap-2 bg-transparent p-0">
                {statusFilters.map((status) => (
                  <TabsTrigger
                    key={status}
                    value={status}
                    className="rounded-full border border-transparent bg-muted/60 px-4 py-2 text-sm font-medium text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {status === "All" ? "All" : getStatusDisplay(status)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {statusFilters.map((status) => {
              const filteredLoans = filterLoans(status);
              return (
                <TabsContent key={status} value={status} className="space-y-4">
                  {filteredLoans.length === 0 ? (
                    <Card>
                      <CardContent className="p-10 text-center text-muted-foreground">
                        No loans found in this category.
                      </CardContent>
                    </Card>
                  ) : (
                    filteredLoans.map((loan) => {
                      const progressValue = getProgressValue(loan);
                      const nextPaymentDate = loan.nextPaymentDate
                        ? new Date(loan.nextPaymentDate).toLocaleDateString()
                        : "N/A";
                      const createdDate = loan.createdAt
                        ? new Date(loan.createdAt).toLocaleDateString()
                        : "N/A";

                      return (
                        <Card key={loan.id} className="border border-border/60 shadow-sm">
                          <CardContent className="p-6 space-y-6">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-foreground">{loan.loanTypeName}</h3>
                                <p className="text-2xl font-bold text-foreground">
                                  ₦{loan.principal.toLocaleString("en-NG", { maximumFractionDigits: 2 })}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(loan.status)}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                                <span>Progress</span>
                                <span className="text-foreground">{progressValue}%</span>
                              </div>
                              <Progress
                                value={progressValue}
                                className="h-2 bg-muted"
                                indicatorClassName={getProgressIndicatorClass(loan.status)}
                              />
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-sm text-muted-foreground">
                              <div className="flex flex-col gap-1">
                                <p>
                                  Loan ID: <span className="font-semibold text-foreground">{loan.id.substring(0, 8)}...</span>
                                </p>
                                <p>
                                  Interest Rate: <span className="font-semibold text-foreground">{loan.rate}%</span>
                                </p>
                                <p>
                                  Term: <span className="font-semibold text-foreground">{loan.term} months</span>
                                </p>
                                <p>
                                  Outstanding: <span className="font-semibold text-foreground">₦{loan.outstandingBalance.toLocaleString("en-NG", { maximumFractionDigits: 2 })}</span>
                                </p>
                                <p>
                                  Amount Due: <span className="font-semibold text-foreground">₦{loan.amountDue.toLocaleString("en-NG", { maximumFractionDigits: 2 })}</span>
                                </p>
                                <p>
                                  Next Payment: <span className="font-semibold text-foreground">{nextPaymentDate}</span>
                                </p>
                                <p>
                                  Created: <span className="font-semibold text-foreground">{createdDate}</span>
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center justify-center gap-3">
                                {loan.status.toLowerCase() === "active" ? (
                                  <>
                                    <Button
                                      className="min-w-[150px]"
                                      onClick={() => handleMakePayment(loan)}
                                    >
                                      Make Payment
                                    </Button>
                                    <Button variant="outline" className="min-w-[130px]">
                                      View Details
                                    </Button>
                                  </>
                                ) : loan.status.toLowerCase() === "overdue" ? (
                                  <>
                                    <Button
                                      variant="destructive"
                                      className="min-w-[150px]"
                                      onClick={() => handleMakePayment(loan)}
                                    >
                                      Pay Now
                                    </Button>
                                    <Button variant="outline" className="min-w-[130px]">
                                      View Details
                                    </Button>
                                  </>
                                ) : loan.status.toLowerCase() === "paid" ? (
                                  <Button variant="outline" className="min-w-[150px]">
                                    View Statement
                                  </Button>
                                ) : (
                                  <Button variant="outline" className="min-w-[130px]">
                                    View Details
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        )}

        <MakePaymentModal
          open={paymentModalOpen}
          onOpenChange={setPaymentModalOpen}
          loanId={selectedLoan?.id || ""}
          loanAccount={selectedLoan ? `LN-${selectedLoan.id.substring(0, 8)}` : ""}
          outstandingBalance={selectedLoan?.outstanding || 0}
          onSuccess={handlePaymentSuccess}
        />
      </div>
    </CustomerLayout>
  );
};

export default MyLoans;

