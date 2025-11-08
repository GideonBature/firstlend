import { useState } from "react";
import { CustomerLayout } from "@/components/customer/CustomerLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MakePaymentModal } from "@/components/customer/MakePaymentModal";
import { Search } from "lucide-react";

const loansData = [
  {
    id: "123456789",
    name: "SME Business Loan",
    amount: "₦5,000,000.00",
    status: "Approved",
    nextPayment: "15 Oct 2024",
    amountDue: "₦50,000.00",
    outstanding: "₦2,000,000.00",
    progress: 60,
  },
  {
    id: "987654321",
    name: "Personal Loan",
    amount: "₦3,000,000.00",
    status: "Active",
    nextPayment: "20 Nov 2024",
    amountDue: "₦35,000.00",
    outstanding: "₦2,500,000.00",
    progress: 25,
  },
  {
    id: "456789123",
    name: "Personal Loan",
    amount: "₦2,000,000.00",
    status: "Pending",
    applicationDate: "02 Sep 2023",
    progress: 0,
  },
  {
    id: "789123456",
    name: "Mortgage",
    amount: "₦15,000,000.00",
    status: "Rejected",
    applicationDate: "28 Aug 2024",
    progress: 0,
  },
  {
    id: "321654987",
    name: "Mortgage",
    amount: "₦12,000,000.00",
    status: "Overdue",
    nextPayment: "15 Oct 2024",
    amountDue: "₦75,000.00",
    outstanding: "₦2,750,000.00",
    progress: 20,
  },
  {
    id: "654987321",
    name: "Auto Loan",
    amount: "₦8,000,000.00",
    status: "Paid",
    completionDate: "15 Aug 2024",
    progress: 100,
  },
];

const statusFilters = ["All", "Active", "Pending", "Approved", "Rejected", "Paid", "Overdue"] as const;

type Loan = (typeof loansData)[number];

type StatusFilter = (typeof statusFilters)[number];

const getNormalizedProgress = (loan: Loan) => {
  switch (loan.status) {
    case "Active":
      return loan.progress || 0;
    case "Overdue":
      return loan.progress || 0;
    case "Paid":
      return 100;
    case "Approved":
    case "Pending":
    case "Rejected":
      return 0;
    default:
      return loan.progress || 0;
  }
};

const getProgressIndicatorClass = (status: Loan["status"]) => {
  if (status === "Overdue") {
    return "bg-red-500";
  }
  return "bg-primary";
};

const getStatusBadge = (status: Loan["status"]) => {
  switch (status) {
    case "Approved":
      return <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">Approved</Badge>;
    case "Active":
      return <Badge className="bg-blue-100 text-blue-700 border border-blue-200">Active</Badge>;
    case "Pending":
      return <Badge className="bg-slate-100 text-slate-600 border border-slate-200">Pending</Badge>;
    case "Rejected":
      return <Badge className="bg-slate-200 text-slate-600 border border-slate-300">Rejected</Badge>;
    case "Overdue":
      return <Badge className="bg-red-100 text-red-700 border border-red-200">Overdue</Badge>;
    case "Paid":
      return <Badge className="bg-green-100 text-green-700 border border-green-200">Paid</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const MyLoans = () => {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<{ id: string; outstanding: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleMakePayment = (loan: { id: string; outstanding: string }) => {
    setSelectedLoan(loan);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    // Placeholder for post-payment handling
    console.log("Payment successful!");
  };

  const filterLoans = (status: StatusFilter) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return loansData.filter((loan) => {
      const matchesStatus = status === "All" ? true : loan.status === status;
      const matchesSearch =
        !normalizedSearch ||
        loan.name.toLowerCase().includes(normalizedSearch) ||
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
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2">
            Apply for a New Loan
          </Button>
        </div>

        <Tabs defaultValue="All" className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[220px] max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by loan name or ID"
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
                  {status}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {statusFilters.map((status) => {
            const loans = filterLoans(status);
            return (
              <TabsContent key={status} value={status} className="space-y-4">
                {loans.map((loan) => {
                  const progressValue = getNormalizedProgress(loan);

                  const nextPaymentText =
                    loan.nextPayment ||
                    (loan.status === "Approved"
                      ? "Awaiting disbursement"
                      : loan.status === "Pending"
                        ? "Pending approval"
                        : loan.status === "Rejected"
                          ? "Not applicable"
                          : loan.status === "Paid" && loan.completionDate
                            ? `Completed on ${loan.completionDate}`
                            : "");

                  const amountDueText =
                    loan.amountDue ||
                    (loan.status === "Paid"
                      ? "₦0.00"
                      : loan.status === "Pending"
                        ? "₦0.00"
                        : "");

                  const outstandingText =
                    loan.outstanding ||
                    (loan.status === "Paid"
                      ? "₦0.00"
                      : loan.status === "Pending"
                        ? "Awaiting approval"
                        : "");

                  const primaryDetails = [
                    nextPaymentText && { label: "Next Payment", value: nextPaymentText },
                    amountDueText && { label: "Amount Due", value: amountDueText },
                    outstandingText && { label: "Outstanding", value: outstandingText },
                  ].filter(Boolean) as { label: string; value: string }[];

                  const secondaryDetails = [
                    loan.applicationDate && { label: "Application Date", value: loan.applicationDate },
                    loan.completionDate && { label: "Completion Date", value: loan.completionDate },
                  ].filter(Boolean) as { label: string; value: string }[];

                  return (
                    <Card key={loan.id} className="border border-border/60 shadow-sm">
                      <CardContent className="p-6 space-y-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-foreground">{loan.name}</h3>
                            <p className="text-2xl font-bold text-foreground">{loan.amount}</p>
                            <p className="text-sm text-muted-foreground">ID: {loan.id}</p>
                          </div>
                          <div className="flex items-start justify-end gap-2">
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
                            {primaryDetails.map(({ label, value }) => (
                              <p key={label}>
                                {label}: <span className="font-semibold text-foreground">{value}</span>
                              </p>
                            ))}
                            {secondaryDetails.map(({ label, value }) => (
                              <p key={label}>
                                {label}: <span className="font-semibold text-foreground">{value}</span>
                              </p>
                            ))}
                          </div>

                          <div className="flex flex-wrap items-center justify-center gap-3">
                          {loan.status === "Active" || loan.status === "Approved" ? (
                            <>
                              <Button
                                className="min-w-[150px]"
                                onClick={() => handleMakePayment({ id: loan.id, outstanding: loan.outstanding || "₦0.00" })}
                              >
                                Make Payment
                              </Button>
                              <Button variant="outline" className="min-w-[130px]">
                                View Details
                              </Button>
                            </>
                          ) : loan.status === "Overdue" ? (
                            <>
                              <Button
                                variant="destructive"
                                className="min-w-[150px]"
                                onClick={() => handleMakePayment({ id: loan.id, outstanding: loan.outstanding || "₦0.00" })}
                              >
                                Pay Now
                              </Button>
                              <Button variant="outline" className="min-w-[130px]">
                                View Details
                              </Button>
                            </>
                          ) : loan.status === "Paid" ? (
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
                })}

                {loans.length === 0 && (
                  <Card>
                    <CardContent className="p-10 text-center text-muted-foreground">
                      No loans match your current filters.
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>

      <MakePaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        loanAccount={selectedLoan ? `LN-${selectedLoan.id}` : undefined}
        outstandingBalance={selectedLoan?.outstanding}
        onSuccess={handlePaymentSuccess}
      />
    </CustomerLayout>
  );
};

export default MyLoans;

