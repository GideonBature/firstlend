import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Filter, Calendar, Download } from "lucide-react";

const paymentsData = [
  { id: "PID-001", customerName: "Adebayo Adekunle", loanId: "LID-101", dueDate: "2023-10-25", amount: "₦60,000.00", status: "Paid" },
  { id: "PID-002", customerName: "Ngozi Okonjo", loanId: "LID-102", dueDate: "2023-10-28", amount: "₦75,000.00", status: "Pending" },
  { id: "PID-003", customerName: "Chinedu Eze", loanId: "LID-103", dueDate: "2023-09-30", amount: "₦120,000.00", status: "Overdue" },
  { id: "PID-004", customerName: "Fatima Bello", loanId: "LID-104", dueDate: "2023-11-05", amount: "₦30,000.00", status: "Pending" },
  { id: "PID-005", customerName: "Tunde Bakare", loanId: "LID-105", dueDate: "2023-10-15", amount: "₦200,000.00", status: "Paid" },
];

const AdminPayments = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">Paid</Badge>;
      case "Pending":
        return <Badge className="bg-orange-500 hover:bg-orange-600 text-white">Pending</Badge>;
      case "Overdue":
        return <Badge className="bg-red-500 hover:bg-red-600 text-white">Overdue</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Payments Management</h1>
          <p className="text-muted-foreground">Review and update loan repayment statuses.</p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-3 w-full sm:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by Customer, Loan ID, or Payment ID..."
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[150px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[150px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Payments Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead>PAYMENT ID</TableHead>
                  <TableHead>CUSTOMER NAME</TableHead>
                  <TableHead>LOAN ID</TableHead>
                  <TableHead>DUE DATE</TableHead>
                  <TableHead>AMOUNT</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentsData.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{payment.customerName}</TableCell>
                    <TableCell>{payment.loanId}</TableCell>
                    <TableCell>{payment.dueDate}</TableCell>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>
                      {payment.status === "Paid" ? (
                        <Button variant="link" className="text-primary">View Details</Button>
                      ) : (
                        <Button variant="link" className="text-primary">Update Status</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing 1 to 5 of 42 results</p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">9</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;
