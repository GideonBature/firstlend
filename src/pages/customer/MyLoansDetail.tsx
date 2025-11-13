import { CustomerLayout } from "@/components/customer/CustomerLayout";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { loanApi, paymentApi, LoanResponse, PaymentHistoryRecord } from "@/services/api";
import { calculateCurrentAmountDue, calculateLoanProgress } from "@/lib/loan-utils";

type TabType = "overview" | "repayment" | "terms";

// Helper for formatting dates
const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    try {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch (error) {
        return "Invalid Date";
    }
};

const MyLoansDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    const [activeTab, setActiveTab] = useState<TabType>("overview");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Reduced for better view with payment history

    // API Data State
    const [loan, setLoan] = useState<LoanResponse | null>(
        (location.state as { loan?: LoanResponse } | undefined)?.loan || null
    );
    const [payments, setPayments] = useState<PaymentHistoryRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("No loan ID specified.");
            setLoading(false);
            navigate("/customer/my-loans");
            return;
        }

        const fetchLoanData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch loan details and payment history concurrently
                const [detailsResponse, historyResponse] = await Promise.all([
                    loanApi.getLoanDetails(id),
                    paymentApi.getPaymentHistory({ loanId: id, pageSize: 100 }), // Fetch all history
                ]);

                // Handle Loan Details
                if (detailsResponse.success && detailsResponse.data) {
                    setLoan(detailsResponse.data);
                } else {
                    throw new Error(detailsResponse.message || "Failed to fetch loan details");
                }

                // Handle Payment History
                if (historyResponse.success && historyResponse.data) {
                    setPayments(historyResponse.data);
                } else {
                    // Non-critical error, just log it and show a toast
                    console.warn("Could not fetch payment history:", historyResponse.message);
                    toast({
                        title: "Warning",
                        description: "Could not fetch payment history. The list may be empty.",
                        variant: "default",
                    });
                }
            } catch (err) {
                const errorMsg = err instanceof Error ? err.message : "An unknown error occurred";
                setError(errorMsg);
                toast({
                    title: "Error",
                    description: errorMsg,
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchLoanData();
    }, [id, toast, navigate]);

    // safe pagination calculations
    const totalPages = Math.max(1, Math.ceil(payments.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPayments = payments.slice(startIndex, endIndex);

    const outstandingBalance = loan?.outstandingBalance ?? 0;
    const principal = loan?.principal ?? 0;
    const computedTotalPaid = Math.max(0, principal - outstandingBalance);
    const progressValue = loan ? calculateLoanProgress(loan) : 0;
    const currentAmountDue = loan ? calculateCurrentAmountDue(loan) : 0;

    const tabs = [
        { id: "overview" as TabType, label: "Overview" },
        { id: "repayment" as TabType, label: "Payment History" }, // Renamed tab
        { id: "terms" as TabType, label: "Terms & Conditions" },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    if (loading) {
        return (
            <CustomerLayout>
                <div className="flex items-center justify-center p-20">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-lg text-muted-foreground">Loading loan details...</p>
                    </div>
                </div>
            </CustomerLayout>
        );
    }

    if (error) {
        return (
            <CustomerLayout>
                <div className="p-6">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            </CustomerLayout>
        );
    }

    if (!loan) {
        return (
            <CustomerLayout>
                <div className="p-6">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>Loan data could not be loaded.</AlertDescription>
                    </Alert>
                </div>
            </CustomerLayout>
        );
    }

    // Calculate total paid
    const totalPaid = loan.principal - loan.outstandingBalance;

    return (
        <CustomerLayout>
            <div className="min-h-screen bg-background p-6">
                <div className="max-w-7xl mx-auto">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/customer/dashboard">Back</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/customer/my-loans">My Loans</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{loan.loanTypeName}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 my-6">
                        <div>
                            <h1 className="text-3xl font-bold text-primary mb-1">{loan.loanTypeName}</h1>
                            <p className="text-sm text-muted-foreground">Loan ID: {loan.id}</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="gap-2">
                                {/* <Download className="w-4 h-4" /> // Import Download if needed */}
                                Download Statement
                            </Button>
                            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                                Make Payment
                            </Button>
                        </div>
                    </div>

                    <Card className="p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Remaining Balance</p>
                                <p className="text-2xl font-bold text-primary">
                                    {formatCurrency(outstandingBalance)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    out of {formatCurrency(loan.principal)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
                                <p className="text-xl font-semibold text-foreground">
                                    {formatCurrency(computedTotalPaid)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Next Payment</p>
                                <p className="text-xl font-semibold text-foreground">
                                    {formatCurrency(currentAmountDue || loan?.amountDue || 0)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Next Payment Date</p>
                                <p className="text-xl font-semibold text-primary">
                                    {formatDate(loan.nextPaymentDate)}
                                </p>
                            </div>
                        </div>
                        <Progress value={progressValue} />
                    </Card>

                    <div className="flex gap-4 mb-6 border-b border-border">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === tab.id
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                                )}
                            </button>
                        ))}
                    </div>

                    {activeTab === "overview" && (
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-primary mb-4">Loan Overview</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Borrower Name</p>
                                    <p className="font-medium">{loan.borrowerName}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Borrower Email</p>
                                    <p className="font-medium">{loan.borrowerEmail}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Interest Rate</p>
                                    <p className="font-medium">{loan.rate}% p.a.</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Loan Term</p>
                                    <p className="font-medium">{loan.term} months</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Employment Status</p>
                                    <p className="font-medium">{loan.employmentStatus}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Monthly Income</p>
                                    <p className="font-medium">{formatCurrency(loan.monthlyIncome)}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Loan Purpose</p>
                                    <p className="font-medium">{loan.purpose}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Application Date</p>
                                    <p className="font-medium">{formatDate(loan.createdAt)}</p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === "repayment" && (
                        <div>
                            <Card className="p-6 mb-6">
                                <h3 className="text-lg font-semibold text-primary mb-4">Payment History</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-border">
                                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                                                    PAYMENT DATE
                                                </th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                                                    AMOUNT PAID
                                                </th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                                                    PRINCIPAL
                                                </th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                                                    INTEREST
                                                </th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                                                    STATUS
                                                </th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                                                    METHOD
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentPayments.length > 0 ? (
                                                currentPayments.map((payment) => (
                                                    <tr key={payment.id} className="border-b border-border last:border-0">
                                                        <td className="py-3 px-4 text-sm text-primary">
                                                            {formatDate(payment.createdAt)}
                                                        </td>
                                                        <td className="py-3 px-4 text-sm font-medium text-foreground">
                                                            {formatCurrency(payment.amount)}
                                                        </td>
                                                        <td className="py-3 px-4 text-sm text-foreground">
                                                            {formatCurrency(payment.principal)}
                                                        </td>
                                                        <td className="py-3 px-4 text-sm text-foreground">
                                                            {formatCurrency(payment.interest)}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <Badge>{payment.status}</Badge>
                                                        </td>
                                                        <td className="py-3 px-4 text-sm text-foreground">
                                                            {payment.method || "-"}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="text-center py-10 text-muted-foreground">
                                                        No payment history found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                                    <p className="text-sm text-muted-foreground">
                                        Showing {payments.length === 0 ? 0 : startIndex + 1} to{" "}
                                        {Math.min(endIndex, payments.length)} of {payments.length} entries
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </Button>
                                        {/* Simple Pagination - for complex, generate page numbers */}
                                        <span className="flex items-center justify-center px-3 py-1 text-sm">
                                            {currentPage} / {totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            {/* ... [Help Cards] ... */}
                        </div>
                    )}

                    {activeTab === "terms" && (
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-primary mb-4">Terms & Conditions</h3>
                            <div className="prose max-w-none text-foreground">
                                <p className="text-muted-foreground mb-4">
                                    Please review the terms and conditions of your loan agreement.
                                </p>
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <h4 className="font-semibold mb-2">1. Loan Amount and Disbursement</h4>
                                        <p className="text-muted-foreground">
                                            The loan amount of {formatCurrency(loan.principal)} was disbursed to your
                                            account upon approval of this loan agreement.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">2. Repayment Terms</h4>
                                        <p className="text-muted-foreground">
                                            Monthly repayments of {formatCurrency(loan.amountDue)} are due on the date
                                            specified in your schedule. Late payments may incur additional fees.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">3. Interest Rate</h4>
                                        <p className="text-muted-foreground">
                                            The interest rate applied to this loan is {loan.rate}% p.a.,
                                            calculated based on the reducing balance method.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">4. Early Repayment</h4>
                                        <p className="text-muted-foreground">
                                            You may make early or additional repayments at any time without penalty to
                                            reduce your overall interest charges.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
};

export default MyLoansDetail;
