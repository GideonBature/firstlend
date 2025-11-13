import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart, Legend } from "recharts";
import { TrendingUp, Sparkles, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { adminApi, AdminDashboardSummary, AdminAIInsight } from "@/services/api";

const loanStatusColors = {
  pending: "#F4C430",
  approved: "#1E3A8A",
  rejected: "#EF4444",
  underReview: "#8B5CF6",
};

const loanTypeColors = ["#1E3A8A", "#F4C430", "#10B981", "#60A5FA", "#F59E0B", "#EF4444", "#6366F1"];

const periodOptions = [
  { key: "today", label: "Today" },
  { key: "week", label: "Last 7 Days" },
  { key: "month", label: "This Month" },
];

const periodQueryMap: Record<string, string> = {
  today: "day",
  week: "week",
  month: "month",
};

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiInsight, setAIInsight] = useState<AdminAIInsight | null>(null);
  const [aiLoading, setAILoading] = useState(true);
  const [aiMode, setAiMode] = useState<"HighConfidence" | "Predictive">("HighConfidence");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        const periodParam = periodQueryMap[selectedPeriod] || "month";
        const response = await adminApi.getDashboardSummary(periodParam);

        if (response.success && response.data) {
          setSummary(response.data);
        } else {
          setError(response.message || "Unable to load dashboard summary.");
        }
      } catch (err) {
        console.error("Failed to fetch dashboard summary:", err);
        setError("Failed to load dashboard summary. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [selectedPeriod]);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        setAILoading(true);
        const response = await adminApi.getDashboardAIInsight(aiMode);
        if (response.success && response.data) {
          setAIInsight(response.data);
        }
      } catch (error) {
        console.error("Failed to load AI insight:", error);
      } finally {
        setAILoading(false);
      }
    };
    fetchInsight();
  }, [aiMode]);

  const formatCurrency = (value?: number, maximumFractionDigits = 0) => {
    if (typeof value !== "number") return "--";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits,
    }).format(value);
  };

  const formatChange = (value?: number) => {
    if (typeof value !== "number") return "--";
    const formatted = value.toFixed(1).replace(/\.0$/, "");
    return `${value >= 0 ? "+" : ""}${formatted}%`;
  };

  const metrics = [
    {
      label: "Total New Applications",
      value: summary?.totalNewApplications,
      change: summary?.applicationsChangePercentage,
    },
    {
      label: "Total Disbursed",
      value: summary?.totalDisbursed,
      change: summary?.disbursedChangePercentage,
      isCurrency: true,
      precision: 2,
    },
    {
      label: "Total Outstanding",
      value: summary?.totalOutstanding,
      change: summary?.outstandingChangePercentage,
      isCurrency: true,
      precision: 2,
    },
  ];

  const periodCopy: Record<string, string> = {
    today: "today",
    week: "over the last 7 days",
    month: "this month",
  };

  const insightMessage = aiInsight?.insight
    ? aiInsight.insight
    : summary
    ? `Loan operations processed ${summary.totalNewApplications?.toLocaleString() || 0} new applications ${periodCopy[selectedPeriod]}, disbursing ${formatCurrency(summary.totalDisbursed, 0)} while keeping outstanding exposure around ${formatCurrency(summary.totalOutstanding, 0)}.`
    : "Based on current trends, loan applications are expected to increase, so keep an eye on approval workflows and staffing levels.";

  const additionalTags =
    aiInsight?.tags?.filter(
      (tag) => !/high|confidence|predictive/i.test(tag)
    ) || [];

  const applicationStatusData = [
    {
      name: "Pending",
      value: summary?.loanApplicationStatus.pending ?? 0,
      fill: loanStatusColors.pending,
    },
    {
      name: "Approved",
      value: summary?.loanApplicationStatus.approved ?? 0,
      fill: loanStatusColors.approved,
    },
    {
      name: "Rejected",
      value: summary?.loanApplicationStatus.rejected ?? 0,
      fill: loanStatusColors.rejected,
    },
    {
      name: "Under Review",
      value: summary?.loanApplicationStatus.underReview ?? 0,
      fill: loanStatusColors.underReview,
    },
  ];

  const loanTypeDistributionData =
    summary?.loanTypeDistribution.map((type, index) => ({
      name: type.loanType,
      value: type.count,
      fill: loanTypeColors[index % loanTypeColors.length],
    })) ?? [];

  const monthlyTrendData =
    summary?.monthlyDisbursementTrend.map((item) => ({
      month: item.month,
      amount: item.amount,
    })) ?? [];

  const hasStatusData = applicationStatusData.some((item) => item.value > 0);
  const hasLoanTypeData = loanTypeDistributionData.some((item) => item.value > 0);
  const hasTrendData = monthlyTrendData.some((item) => item.amount > 0);

  const renderChartLoadingState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
      <Loader2 className="w-6 h-6 animate-spin mb-2" />
      Loading chart...
    </div>
  );

  const renderChartEmptyState = (message: string) => (
    <div className="py-12 text-center text-muted-foreground">{message}</div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">A summary of key operational metrics and recent activities.</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* AI-Powered Insights */}
        <Card className="border-purple-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">AI-Powered Insights</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {aiLoading ? "Generating AI insight..." : insightMessage}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: "High Confidence", value: "HighConfidence" as const },
                    { label: "Predictive Analytics", value: "Predictive" as const },
                  ].map((mode) => (
                    <Button
                      key={mode.value}
                      variant={aiMode === mode.value ? "default" : "outline"}
                      size="sm"
                      className={
                        aiMode === mode.value
                          ? "bg-purple-500 hover:bg-purple-600 text-white"
                          : "border-purple-300 text-purple-700 bg-purple-50 hover:bg-purple-100"
                      }
                      onClick={() => setAiMode(mode.value)}
                    >
                      {mode.label}
                    </Button>
                  ))}
                  {additionalTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-purple-300 text-purple-700 bg-purple-50"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Filters */}
        <div className="flex gap-2">
          {periodOptions.map((option) => (
            <Button
              key={option.key}
              variant={selectedPeriod === option.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(option.key)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric) => {
            const change = typeof metric.change === "number" ? metric.change : undefined;
            const changePositive = (change ?? 0) >= 0;
            return (
              <Card key={metric.label}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{metric.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary min-h-[40px] flex items-center">
                    {loading && !summary ? (
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    ) : metric.isCurrency ? (
                      formatCurrency(metric.value, metric.precision)
                    ) : (
                      metric.value ?? "--"
                    )}
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm mt-1 ${
                      changePositive ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    <TrendingUp className={`w-4 h-4 ${changePositive ? "" : "rotate-180"}`} />
                    <span>{formatChange(metric.change)}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Loan Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                renderChartLoadingState()
              ) : hasStatusData ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={applicationStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {applicationStatusData.map((entry, index) => (
                        <Cell key={`status-cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                renderChartEmptyState("No loan application status data for this period.")
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Loan Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                renderChartLoadingState()
              ) : hasLoanTypeData ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={loanTypeDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {loanTypeDistributionData.map((entry, index) => (
                        <Cell key={`loan-type-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                renderChartEmptyState("No loan type distribution data for this period.")
              )}
            </CardContent>
          </Card>
        </div>

        {/* Monthly Disbursement Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Disbursement Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              renderChartLoadingState()
            ) : hasTrendData ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyTrendData}>
                  <defs>
                    <linearGradient id="colorDisbursement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => {
                      if (value >= 1000000) return `₦${(value / 1000000).toFixed(1)}M`;
                      if (value >= 1000) return `₦${(value / 1000).toFixed(0)}K`;
                      return `₦${value}`;
                    }}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value, 2)}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#1E3A8A" 
                    fillOpacity={1} 
                    fill="url(#colorDisbursement)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              renderChartEmptyState("No disbursement data available for this period.")
            )}
          </CardContent>
        </Card>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
