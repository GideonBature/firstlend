import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, Download } from "lucide-react";

const chartData = [
  { week: "Week 1", outstanding: 800, repaid: 200 },
  { week: "Week 2", outstanding: 750, repaid: 250 },
  { week: "Week 3", outstanding: 700, repaid: 300 },
  { week: "Week 4", outstanding: 650, repaid: 350 },
];

const recentActivities = [
  { loanId: "LN-84521", loanType: "Personal", borrower: "Adekunle Gold", amount: "₦ 2,500,000", status: "Approved" },
  { loanId: "LN-84520", loanType: "SME", borrower: "Tiwa Savage", amount: "₦ 15,000,000", status: "Pending" },
  { loanId: "LN-84519", loanType: "Mortgage", borrower: "Burna Boy", amount: "₦ 75,000,000", status: "Approved" },
  { loanId: "LN-84518", loanType: "Auto", borrower: "Wizkid Balogun", amount: "₦ 8,200,000", status: "Rejected" },
];

const AdminReports = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
      <div>
            <h1 className="text-3xl font-bold mb-2">Loan Summary Report</h1>
            <p className="text-muted-foreground">View key loan metrics for the selected period.</p>
          </div>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Period Selection */}
        <div className="flex gap-2">
          <Button variant="default">Last 30 Days</Button>
          <Button variant="outline">This Quarter</Button>
          <Button variant="outline">Last Year</Button>
          <Button variant="outline">Custom Range</Button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Active Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">1,423</div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+2.5% vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Amount Repaid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">₦ 1.25B</div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+5.1% vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Outstanding Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">₦ 875.4M</div>
              <div className="flex items-center gap-1 text-sm text-red-600">
                <TrendingDown className="w-4 h-4" />
                <span>-1.2% vs last period</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Outstanding vs. Repaid Balance</CardTitle>
            <p className="text-sm text-muted-foreground">Trend for the last 30 days</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="outstanding" stroke="#1E3A8A" strokeWidth={2} name="Outstanding" />
                <Line type="monotone" dataKey="repaid" stroke="#F4C430" strokeWidth={2} strokeDasharray="5 5" name="Repaid" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activities Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Loan Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>LOAN ID</TableHead>
                  <TableHead>LOAN TYPE</TableHead>
                  <TableHead>BORROWER</TableHead>
                  <TableHead>AMOUNT</TableHead>
                  <TableHead>STATUS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity) => (
                  <TableRow key={activity.loanId}>
                    <TableCell className="font-medium">{activity.loanId}</TableCell>
                    <TableCell>{activity.loanType}</TableCell>
                    <TableCell>{activity.borrower}</TableCell>
                    <TableCell>{activity.amount}</TableCell>
                    <TableCell>
                      {activity.status === "Approved" ? (
                        <Badge className="bg-green-500 hover:bg-green-600 text-white">Approved</Badge>
                      ) : activity.status === "Pending" ? (
                        <Badge className="bg-orange-500 hover:bg-orange-600 text-white">Pending</Badge>
                      ) : (
                        <Badge className="bg-red-500 hover:bg-red-600 text-white">Rejected</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
