import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Brain, Download, Shield, AlertTriangle, TrendingUp, TrendingDown, BadgeDollarSign } from "lucide-react";

const riskDistributionData = [
  { name: "Low", value: 67, color: "#22C55E" },
  { name: "Medium", value: 33, color: "#F59E0B" },
  { name: "High", value: 0, color: "#EF4444" },
];

const portfolioHealthData = [
  { category: "Personal", healthy: 2, atRisk: 0 },
  { category: "SME", healthy: 1, atRisk: 0 },
  { category: "Mortgage", healthy: 1, atRisk: 0 },
  { category: "Auto", healthy: 0, atRisk: 1 },
];

const highRiskAccounts = [
  {
    borrower: "Blessing Eze",
    loanId: "LN-004",
    loanAmount: 800000,
    riskScore: 68,
    overdueAmount: 49556,
    reason: "Overdue payments",
  },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(value);

const AdminRisk = () => {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Risk Assessment Dashboard</h1>
          <p className="text-muted-foreground">Monitor portfolio risk and identify high-risk accounts.</p>
        </div>

        <Card className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 shadow-sm">
          <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md">
                <Brain className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold text-indigo-900">AI Risk Prediction</h2>
                  <Badge className="rounded-full bg-indigo-600 text-white hover:bg-indigo-600">ML Model</Badge>
                </div>
                <p className="text-sm text-indigo-900/80">
                  Our AI model predicts <span className="font-semibold text-indigo-900">2 additional accounts</span> may become high-risk within the next 30 days based on payment patterns and economic indicators. Early intervention recommended.
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-indigo-900/80">
                  <Badge variant="outline" className="border-indigo-200 bg-white/60 text-indigo-900">Accuracy: 94%</Badge>
                  <Badge variant="outline" className="border-indigo-200 bg-white/60 text-indigo-900">Updated 2h ago</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="w-full space-y-6">
          <TabsList className="flex w-fit gap-3 rounded-full bg-muted/60 p-1">
            <TabsTrigger
              value="overview"
              className="rounded-full px-6 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="high-risk"
              className="rounded-full px-6 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              High Risk
            </TabsTrigger>
            <TabsTrigger
              value="trends"
              className="rounded-full px-6 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="rounded-3xl border border-red-100 bg-red-50">
              <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3 text-red-600">
                  <AlertTriangle className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">
                      1 account requires immediate attention due to missed payments and declining credit scores.
                    </p>
                  </div>
                </div>
                <Button className="rounded-full bg-red-600 px-5 text-white hover:bg-red-700">View All</Button>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <Card className="rounded-3xl border border-border/60 bg-white shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <Shield className="h-5 w-5" />
                    </div>
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Portfolio Health</p>
                    <p className="text-3xl font-semibold text-foreground">67%</p>
                  </div>
                  <Progress value={67} className="h-2 bg-muted" indicatorClassName="bg-primary" />
                </CardContent>
              </Card>

              <Card className="rounded-3xl border border-border/60 bg-white shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-500">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <TrendingUp className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">High Risk Accounts</p>
                    <p className="text-3xl font-semibold text-foreground">0</p>
                    <p className="text-xs font-medium text-red-500">Immediate attention</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border border-border/60 bg-white shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-500">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <TrendingDown className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Default Rate</p>
                    <p className="text-3xl font-semibold text-foreground">0.0%</p>
                    <p className="text-xs font-medium text-emerald-500">-0.4% from last month</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border border-border/60 bg-white shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                      <BadgeDollarSign className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">At-Risk Amount</p>
                    <p className="text-3xl font-semibold text-foreground">₦3,083,540</p>
                    <p className="text-xs text-muted-foreground">Across all categories</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="rounded-3xl border border-border/60 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-foreground">Risk Distribution</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ResponsiveContainer width="100%" height={340}>
                    <PieChart>
                      <Pie
                        data={riskDistributionData}
                        cx="50%"
                        cy="45%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {riskDistributionData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number, name) => [`${value}%`, name]} />
                      <Legend
                        verticalAlign="bottom"
                        align="center"
                        iconType="circle"
                        formatter={(value) => {
                          const item = riskDistributionData.find((data) => data.name === value);
                          return `${value} (${item?.value ?? 0}%)`;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border border-border/60 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-foreground">Portfolio Health by Category</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ResponsiveContainer width="100%" height={330}>
                    <BarChart data={portfolioHealthData} barGap={16}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} allowDecimals={false} />
                      <Tooltip formatter={(value: number, name) => [value, name === "healthy" ? "Healthy" : "At Risk"]} />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: 16 }} />
                      <Bar dataKey="healthy" fill="#22C55E" name="Healthy" radius={[10, 10, 0, 0]} />
                      <Bar dataKey="atRisk" fill="#EF4444" name="At Risk" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-3xl border border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <CardTitle className="text-lg font-semibold text-foreground">High Risk Accounts Requiring Attention</CardTitle>
                  <Button variant="outline" className="rounded-full border border-primary text-primary hover:bg-primary/5">
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="uppercase text-xs tracking-wide text-muted-foreground">
                      <TableHead>Borrower</TableHead>
                      <TableHead>Loan ID</TableHead>
                      <TableHead>Loan Amount</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Overdue</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {highRiskAccounts.map((account) => (
                      <TableRow key={account.loanId} className="text-sm">
                        <TableCell className="font-semibold text-foreground">{account.borrower}</TableCell>
                        <TableCell className="text-muted-foreground">{account.loanId}</TableCell>
                        <TableCell>{formatCurrency(account.loanAmount)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Progress
                              value={account.riskScore}
                              className="h-2 w-32 bg-muted"
                              indicatorClassName="bg-yellow-500"
                            />
                            <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">
                              {account.riskScore}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-red-500">{formatCurrency(account.overdueAmount)}</TableCell>
                        <TableCell className="text-muted-foreground">{account.reason}</TableCell>
                        <TableCell className="text-right">
                          <Button className="rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90">
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="high-risk" className="space-y-6">
            <Card className="rounded-3xl border border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle>High Risk Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Detailed high-risk analytics will appear here once available.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="rounded-3xl border border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle>Risk Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Historical risk trends will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminRisk;
