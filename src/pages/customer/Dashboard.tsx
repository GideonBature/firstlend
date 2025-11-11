import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomerLayout } from "@/components/customer/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell } from "recharts";
import { DollarSign, TrendingUp, Calendar, Lightbulb, X, Brain, Handshake, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/services/api";

const paymentTrendData = [
  { month: "Jan", amount: 0 },
  { month: "Feb", amount: 100 },
  { month: "Mar", amount: 150 },
  { month: "Apr", amount: 200 },
  { month: "May", amount: 250 },
  { month: "Jun", amount: 300 },
  { month: "Jul", amount: 280 },
  { month: "Aug", amount: 320 },
  { month: "Sep", amount: 350 },
  { month: "Oct", amount: 400 },
];

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

const recentTransactions = [
  { date: "2024-09-25", type: "Repayment", amount: "₦180,238", status: "Successful" },
  { date: "2024-09-25", type: "Repayment", amount: "₦180,238", status: "Successful" },
  { date: "2024-10-30", type: "Repayment", amount: "₦232,285", status: "Successful" },
  { date: "2024-10-26", type: "Repayment", amount: "₦23,154", status: "Successful" },
  { date: "2024-10-10", type: "Repayment", amount: "₦9,156", status: "Failed" },
];

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [creditRating, setCreditRating] = useState<string>("");
  const [isLoadingCreditScore, setIsLoadingCreditScore] = useState(true);
  const [totalAccounts, setTotalAccounts] = useState<number>(0);
  const [scoreBreakdown, setScoreBreakdown] = useState<any>(null);
  
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
  
  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userFirstName}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your loans today.</p>
        </div>

        {/* Alert Banner */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">
                    Excellent Payment Record! You've made 6 on-time payments. Keep it up to improve your credit score!
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Loan Balance</CardTitle>
                <DollarSign className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">₦20,604,155</div>
              <Button variant="outline" size="sm">Action</Button>
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
              <div className="text-3xl font-bold text-green-600">₦8,239,104</div>
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
              <div className="text-3xl font-bold mb-1">₦180,238</div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Due: 2024-11-25</p>
                <Badge className="bg-green-500 hover:bg-green-600 text-white">Paid</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Loan Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Loan Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Loan ID</p>
                    <p className="font-semibold">LN-001</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Next Payment</p>
                    <p className="font-semibold">₦180,238</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Interest Rate</p>
                    <p className="font-semibold">15%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="font-semibold">2024-11-25</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tenure</p>
                    <p className="font-semibold">6 of 12 months</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">54% Paid</span>
                  </div>
                  <Progress value={54} className="h-3" />
                </div>
                <Button className="w-full">Repay Now</Button>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>DATE</TableHead>
                      <TableHead>TYPE</TableHead>
                      <TableHead>AMOUNT</TableHead>
                      <TableHead>STATUS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((transaction, index) => (
                      <TableRow key={index}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell>{transaction.amount}</TableCell>
                        <TableCell>
                          {transaction.status === "Successful" ? (
                            <Badge className="bg-green-500 hover:bg-green-600 text-white">{transaction.status}</Badge>
                          ) : (
                            <Badge className="bg-red-500 hover:bg-red-600 text-white">{transaction.status}</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                <div className="flex items-start gap-3">
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
                <div className="flex items-start gap-3">
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
    </CustomerLayout>
  );
};

export default CustomerDashboard;

