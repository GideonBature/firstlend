import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart, Legend } from "recharts";
import { TrendingUp, Sparkles } from "lucide-react";

const applicationStatusData = [
  { name: "Pending", value: 0.9, fill: "#F4C430" },
  { name: "Approved", value: 0.7, fill: "#1E3A8A" },
  { name: "Rejected", value: 0.6, fill: "#EF4444" },
  { name: "Under Review", value: 0.5, fill: "#8B5CF6" },
];

const loanTypeDistributionData = [
  { name: "Personal", value: 35, fill: "#1E3A8A" },
  { name: "SME", value: 17, fill: "#F4C430" },
  { name: "Mortgage", value: 7, fill: "#10B981" },
  { name: "Auto", value: 25, fill: "#60A5FA" },
  { name: "Education", value: 11, fill: "#F59E0B" },
];

const monthlyTrendData = [
  { month: "Jan", amount: 25 },
  { month: "Feb", amount: 30 },
  { month: "Mar", amount: 35 },
  { month: "Apr", amount: 40 },
  { month: "May", amount: 45 },
  { month: "Jun", amount: 50 },
  { month: "Jul", amount: 55 },
  { month: "Aug", amount: 60 },
  { month: "Sep", amount: 65 },
  { month: "Oct", amount: 70 },
];


const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">A summary of key operational metrics and recent activities.</p>
          </div>
          <Button>
            <span className="mr-2">+</span>
            New Application
          </Button>
        </div>

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
                  Based on current trends, loan applications are expected to <strong>increase by 18%</strong> next month. Consider reviewing approval workflows and staffing levels.
                </p>
                <div className="flex gap-2">
                  <Badge className="bg-purple-500 hover:bg-purple-600 text-white">High Confidence</Badge>
                  <Badge variant="outline" className="border-purple-300 text-purple-700 bg-purple-50">Predictive Analytics</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Filters */}
        <div className="flex gap-2">
          <Button
            variant={selectedPeriod === "today" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("today")}
          >
            Today
          </Button>
          <Button
            variant={selectedPeriod === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("week")}
          >
            Last 7 Days
          </Button>
          <Button
            variant={selectedPeriod === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("month")}
          >
            This Month
          </Button>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total New Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">4</div>
              <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                <TrendingUp className="w-4 h-4" />
                <span>+8.7%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Disbursed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">₦27,800,000</div>
              <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                <TrendingUp className="w-4 h-4" />
                <span>+12.1%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">₦21,099,715</div>
              <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                <TrendingUp className="w-4 h-4" />
                <span>+5.4%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Loan Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={applicationStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 1]} tickFormatter={(value) => value.toFixed(2)} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {applicationStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Loan Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
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
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => value}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Disbursement Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Disbursement Trend</CardTitle>
          </CardHeader>
          <CardContent>
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
                    if (value >= 1000000) return `₦${value / 1000000}M`;
                    if (value >= 1000) return `₦${value / 1000}M`;
                    return `₦${value}M`;
                  }}
                />
                <Tooltip 
                  formatter={(value: number) => `₦${value}M`}
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
          </CardContent>
        </Card>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
