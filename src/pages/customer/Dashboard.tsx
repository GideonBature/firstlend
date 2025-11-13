import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomerLayout } from "@/components/customer/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell } from "recharts";
import { DollarSign, TrendingUp, Calendar, Lightbulb, X, Brain, Handshake, Loader2, MessageCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import FirstLendChat from "@/pages/customer/FirstLendChat";
import { useAuth } from "@/contexts/AuthContext";
import { authApi, loanApi, paymentApi } from "@/services/api";
import type { LoanResponse, PaymentHistoryRecord } from "@/services/api";

const creditScoreTrendData = [
  { month: "Jan", score: 695 },
  { month: "Feb", score: 700 },
  { month: "Mar", score: 705 },
  { month: "Apr", score: 710 },
  { month: "May", score: 715 },
  { month: "Jun", score: 718 },
  { month: "Jul", score: 720 },
  { month: "Aug", score: 720 },
  { month: "Sep", score: 720 },
  { month: "Oct", score: 720 },
];

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [creditRating, setCreditRating] = useState<string>("");
  const [isLoadingCreditScore, setIsLoadingCreditScore] = useState(true);
  const [totalAccounts, setTotalAccounts] = useState<number>(0);
  const [scoreBreakdown, setScoreBreakdown] = useState<any>(null);
  
  // New state for dynamic dashboard data
  const [loans, setLoans] = useState<LoanResponse[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryRecord[]>([]);
  const [isLoadingLoans, setIsLoadingLoans] = useState(true);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [onTimePayments, setOnTimePayments] = useState(0);
  const [isKYCVerified, setIsKYCVerified] = useState<boolean | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const userFirstName = useMemo(() => {
    if (!user?.fullName) {
      return "User";
    }

    const parts = user.fullName.trim().split(/\s+/);
    return parts[0] || "User";
  }, [user?.fullName]);

  // Fetch credit score on mount
  useEffect(() => {
    const fetchCreditScore = async () => {
      try {
        setIsLoadingCreditScore(true);
        const response = await authApi.getCreditScore();
        if (response.success && response.data) {
          setCreditScore(response.data.score);
          setCreditRating(response.data.rating);
          setTotalAccounts(response.data.totalAccounts);
          setScoreBreakdown(response.data.breakdown);
        }
      } catch (error) {
        console.error("Error fetching credit score:", error);
      } finally {
        setIsLoadingCreditScore(false);
      }
    };

    fetchCreditScore();
  }, []);

  useEffect(() => {
    const fetchKYCStatus = async () => {
      try {
        const response = await authApi.getKYCStatus();
        if (response.success && response.data) {
          setIsKYCVerified(response.data.isVerified);
        } else {
          setIsKYCVerified(null);
        }
      } catch (error) {
        console.error("Error fetching KYC status:", error);
      }
    };

    fetchKYCStatus();
  }, []);

  // Fetch loans and payment history
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch loans
        setIsLoadingLoans(true);
        const loansResponse = await loanApi.getMyLoans({ page: 1, pageSize: 100 });
        if (loansResponse.success && loansResponse.data) {
          setLoans(loansResponse.data);
        }

        // Fetch payment history
        setIsLoadingPayments(true);
        const paymentsResponse = await paymentApi.getPaymentHistory({ page: 1, pageSize: 100 });
        if (paymentsResponse.success && paymentsResponse.data) {
          setPaymentHistory(paymentsResponse.data);
          
          // Count on-time payments
          const successfulPayments = paymentsResponse.data.filter(p => 
            p.status?.toLowerCase() === 'successful' || p.status?.toLowerCase() === 'completed'
          ).length;
          setOnTimePayments(successfulPayments);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoadingLoans(false);
        setIsLoadingPayments(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Get color based on credit rating
  const getCreditScoreColor = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'excellent':
        return 'border-green-500 text-green-600';
      case 'very good':
      case 'good':
        return 'border-blue-500 text-blue-600';
      case 'fair':
        return 'border-yellow-500 text-yellow-600';
      case 'poor':
        return 'border-red-500 text-red-600';
      default:
        return 'border-gray-500 text-gray-600';
    }
  };

  const getBadgeColor = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'excellent':
        return 'bg-green-500 hover:bg-green-600';
      case 'very good':
      case 'good':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'fair':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'poor':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  // Calculate dashboard metrics from loans
  const activeLoanBalance = useMemo(() => {
    return loans
      .filter(loan => loan.status.toLowerCase() === 'active')
      .reduce((sum, loan) => sum + (loan.outstandingBalance || 0), 0);
  }, [loans]);

  const totalRepaidAmount = useMemo(() => {
    return loans.reduce((sum, loan) => {
      const totalAmount = loan.principal || 0;
      const amountPaid = totalAmount - (loan.outstandingBalance || 0);
      return sum + Math.max(0, amountPaid);
    }, 0);
  }, [loans]);

  const nextPaymentAmount = useMemo(() => {
    const activeLoans = loans.filter(loan => loan.status.toLowerCase() === 'active');
    if (activeLoans.length === 0) return 0;
    
    // Get the first active loan's next payment
    const firstActiveLoan = activeLoans[0];
    return firstActiveLoan.amountDue / firstActiveLoan.term;
  }, [loans]);

  const nextPaymentDate = useMemo(() => {
    const activeLoans = loans.filter(loan => loan.status.toLowerCase() === 'active');
    if (activeLoans.length === 0) return 'N/A';
    
    return activeLoans[0].nextPaymentDate 
      ? new Date(activeLoans[0].nextPaymentDate).toLocaleDateString()
      : 'N/A';
  }, [loans]);

  const isNextPaymentPaid = useMemo(() => {
    if (loans.length === 0) return false;
    
    const activeLoans = loans.filter(loan => loan.status.toLowerCase() === 'active');
    if (activeLoans.length === 0) return false;
    
    // Check if there are any recent successful payments
    const recentPayments = paymentHistory.filter(p => 
      (p.status?.toLowerCase() === 'successful' || p.status?.toLowerCase() === 'completed') &&
      p.loanId === activeLoans[0].id
    );
    
    return recentPayments.length > 0;
  }, [loans, paymentHistory]);

  // Get the first active loan for the Personal Loan Overview section
  const primaryLoan = useMemo(() => {
    return loans.find(loan => loan.status.toLowerCase() === 'active');
  }, [loans]);

  // Calculate loan progress percentage
  const loanProgressPercentage = useMemo(() => {
    if (!primaryLoan) return 0;
    
    const principal = primaryLoan.principal || 0;
    if (principal === 0) return 0;
    
    const outstanding = primaryLoan.outstandingBalance || 0;
    const amountPaid = principal - outstanding;
    const percentage = (amountPaid / principal) * 100;
    
    const result = Math.round(Math.max(0, Math.min(100, percentage)));
    console.log("Progress calculation:", { principal, outstanding, amountPaid, percentage, result });
    return result;
  }, [primaryLoan]);

  // Calculate months elapsed and remaining
  const loanTenure = useMemo(() => {
    if (!primaryLoan) return { elapsed: 0, total: 0 };
    
    const createdDate = new Date(primaryLoan.createdAt);
    const today = new Date();
    const elapsedMonths = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    const totalMonths = primaryLoan.term || 0;
    
    return { 
      elapsed: Math.max(0, elapsedMonths + 1),
      total: totalMonths 
    };
  }, [primaryLoan]);

  // Calculate dynamic payment trend data from payment history
  const paymentTrendData = useMemo(() => {
    const successfulPayments = paymentHistory.filter(payment => {
      const status = payment.status?.toLowerCase();
      return status === 'success' || status === 'successful' || status === 'completed';
    });

    if (successfulPayments.length === 0) {
      // Return empty chart with last 10 months if no data
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const currentDate = new Date();
      const result = [];
      
      for (let i = 9; i >= 0; i--) {
        const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthName = months[d.getMonth()];
        result.push({ month: monthName, amount: 0 });
      }
      
      return result;
    }

    // Group payments by month-year and calculate cumulative totals
    const monthlyData: Record<string, { total: number, cumulative: number }> = {};
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentDate = new Date();

    // Create entries for the last 10 months
    const result = [];
    for (let i = 9; i >= 0; i--) {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = { total: 0, cumulative: 0 };
      result.push({
        monthKey,
        monthName: months[d.getMonth()],
        date: d
      });
    }

    // Add payments to their respective months
    successfulPayments.forEach(payment => {
      const date = new Date(payment.createdAt || '');
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].total += payment.amount || 0;
      }
    });

    // Calculate cumulative amounts
    let cumulative = 0;
    const chartData = result.map(item => {
      const monthData = monthlyData[item.monthKey];
      cumulative += monthData.total;
      return {
        month: item.monthName,
        amount: Math.round(cumulative)
      };
    });

    console.log("Payment trend data:", { successfulPayments: successfulPayments.length, chartData });
    return chartData;
  }, [paymentHistory]);
  
  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold mb-2 md:text-3xl">Welcome back, {userFirstName}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your loans today.</p>
        </div>

        {isKYCVerified === false && (
          <Alert className="border-blue-200 bg-blue-50">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <AlertTitle className="text-blue-900">Complete Your KYC Verification</AlertTitle>
                <AlertDescription>
                  Verify your identity to unlock higher loan limits and faster approvals.
                </AlertDescription>
              </div>
              <Button
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => navigate("/customer/profile", { state: { defaultTab: "kyc" } })}
              >
                Complete KYC
              </Button>
            </div>
          </Alert>
        )}

        {/* Alert Banner */}
        {onTimePayments > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">
                      Excellent Payment Record! You've made {onTimePayments} on-time payment{onTimePayments !== 1 ? 's' : ''}. Keep it up to improve your credit score!
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 self-end md:self-auto">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Loan Balance</CardTitle>
                <DollarSign className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingLoans ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ₦{activeLoanBalance.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/customer/my-loans')}>Action</Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Repaid Amount</CardTitle>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingLoans ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <div className="text-3xl font-bold text-green-600">
                  ₦{totalRepaidAmount.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Next Payment</CardTitle>
                <Calendar className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingLoans ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold mb-1">
                    ₦{nextPaymentAmount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Due: {nextPaymentDate}</p>
                    <Badge className={`text-white ${isNextPaymentPaid ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}`}>
                      {isNextPaymentPaid ? 'Paid' : 'Due'}
                    </Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Loan Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Loan Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingLoans ? (
                  <div className="flex items-center justify-center py-8 gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading loan details...</span>
                  </div>
                ) : !primaryLoan ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No active loans found
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Loan ID</p>
                        <p className="font-semibold">LN-{primaryLoan.id.substring(0, 8)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Next Payment</p>
                        <p className="font-semibold">₦{nextPaymentAmount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Interest Rate</p>
                        <p className="font-semibold">{primaryLoan.rate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Due Date</p>
                        <p className="font-semibold">{nextPaymentDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tenure</p>
                        <p className="font-semibold">{loanTenure.elapsed} of {loanTenure.total} months</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{loanProgressPercentage}% Paid</span>
                      </div>
                      <Progress
                        value={loanProgressPercentage}
                        className="h-3 bg-muted"
                        indicatorClassName="bg-primary"
                      />
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => navigate('/customer/my-loans')}
                    >
                      Repay Now
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Payment History Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Payment History Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={paymentTrendData}>
                    <defs>
                      <linearGradient id="colorPayment" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F4C430" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#F4C430" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="amount" stroke="#F4C430" fillOpacity={1} fill="url(#colorPayment)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <Table className="min-w-[520px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>DATE</TableHead>
                        <TableHead>TYPE</TableHead>
                        <TableHead>AMOUNT</TableHead>
                        <TableHead>STATUS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingPayments ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Loading transactions...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : paymentHistory.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                            No transactions yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        paymentHistory.slice(0, 5).map((transaction, index) => {
                          const status = (transaction.status || '').toLowerCase();
                          const isSuccess = status === 'success' || status === 'successful' || status === 'completed';
                          const isPending = status === 'pending';

                          return (
                            <TableRow key={index}>
                              <TableCell>{new Date(transaction.createdAt || '').toLocaleDateString()}</TableCell>
                              <TableCell>Repayment</TableCell>
                              <TableCell>₦{transaction.amount?.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                              <TableCell>
                                {isSuccess ? (
                                  <Badge 
                                    variant="outline" 
                                    className="border-emerald-200"
                                    style={{ backgroundColor: '#d1fae5', color: '#047857' }}
                                  >
                                    Success
                                  </Badge>
                                ) : isPending ? (
                                  <Badge 
                                    variant="outline" 
                                    className="border-amber-200"
                                    style={{ backgroundColor: '#fef3c7', color: '#b45309' }}
                                  >
                                    Pending
                                  </Badge>
                                ) : (
                                  <Badge 
                                    variant="outline" 
                                    className="border-red-200"
                                    style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}
                                  >
                                    {transaction.status || 'Failed'}
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Credit Score */}
            <Card>
              <CardHeader>
                <CardTitle>Credit Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingCreditScore ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Loading credit score...</p>
                  </div>
                ) : creditScore !== null ? (
                  <>
                    <div className="flex flex-col items-center">
                      <div className="relative w-32 h-32">
                        <div className={`absolute inset-0 rounded-full border-8 ${getCreditScoreColor(creditRating).split(' ')[0]}`}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className={`text-3xl font-bold ${getCreditScoreColor(creditRating).split(' ')[1]}`}>
                              {Math.round(creditScore)}
                            </div>
                            <div className="text-sm text-muted-foreground">{creditRating}</div>
                          </div>
                        </div>
                      </div>
                      {scoreBreakdown && (
                        <div className="mt-4 w-full space-y-2">
                          <div className="text-xs text-muted-foreground">
                            <div className="flex justify-between mb-1">
                              <span>Payment History</span>
                              <span className="font-medium">{scoreBreakdown.paymentHistoryScore}%</span>
                            </div>
                            <Progress value={scoreBreakdown.paymentHistoryScore} className="h-1" />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <div className="flex justify-between mb-1">
                              <span>Amounts Owed</span>
                              <span className="font-medium">{scoreBreakdown.amountsOwedScore.toFixed(1)}%</span>
                            </div>
                            <Progress value={scoreBreakdown.amountsOwedScore} className="h-1" />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <div className="flex justify-between mb-1">
                              <span>Credit History Length</span>
                              <span className="font-medium">{scoreBreakdown.lengthOfHistoryScore.toFixed(1)}%</span>
                            </div>
                            <Progress value={scoreBreakdown.lengthOfHistoryScore} className="h-1" />
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      {creditRating.toLowerCase() === 'poor' 
                        ? "Improve your credit by making on-time payments and reducing debt."
                        : creditRating.toLowerCase() === 'fair'
                        ? "Keep up the good work! Consistent payments will improve your score."
                        : creditRating.toLowerCase() === 'good'
                        ? "Good score! You qualify for competitive loan products."
                        : creditRating.toLowerCase() === 'very good'
                        ? "Very good score! You have access to our best loan products."
                        : "Excellent score! You unlock our premium loan products and best interest rates."}
                    </p>
                    <p className="text-xs text-muted-foreground text-center">
                      Total Accounts: {totalAccounts}
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-sm text-muted-foreground">No credit score data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Insight */}
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">AI Insight</h3>
                    <p className="text-sm text-muted-foreground">
                      Based on your payment history, you're on track to improve your credit score by +30 points in the next 6 months! Make timely payments to unlock better rates.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Loan Promotion */}
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Handshake className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Unlock a Business Loan!</h3>
                    <p className="text-sm opacity-90 mb-4">
                      Expand your business with our new SME loans. Get up to ₦10,000,000 with flexible repayment options.
                    </p>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate("/customer/apply-loan")}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Chat Assistant */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-8">
        {isChatOpen && (
          <div className="w-[92vw] max-w-md bg-white rounded-2xl shadow-2xl border border-blue-100 max-h-[70vh] overflow-hidden sm:w-[90vw] sm:max-h-[80vh]">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-blue-50 rounded-t-2xl">
              <div>
                <p className="font-semibold text-sm text-blue-900">FirstLend AI Assistant</p>
                <p className="text-xs text-blue-700">Get instant answers powered by AI</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)}>
                <XCircle className="w-5 h-5 text-blue-900" />
              </Button>
            </div>
            <div className="p-4">
              <FirstLendChat />
            </div>
          </div>
        )}

        <Button
          className="rounded-full shadow-lg bg-primary hover:bg-primary/90 w-14 h-14 sm:w-16 sm:h-16"
          onClick={() => setIsChatOpen((prev) => !prev)}
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </Button>
      </div>
    </CustomerLayout>
  );
};

export default CustomerDashboard;

