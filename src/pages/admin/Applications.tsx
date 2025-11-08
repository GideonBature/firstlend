import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const applications = [
  { id: "FB-836490", name: "Adekunle Adebayo", amount: "₦5,000,000", submitted: "2023-10-26", status: "Pending" },
  { id: "FB-836490", name: "Chidinma Okoro", amount: "₦750,000", submitted: "2023-10-26", status: "Pending" },
  { id: "FB-836488", name: "Musa Ibrahim", amount: "₦12,300,000", submitted: "2023-10-25", status: "Approved" },
  { id: "FB-836487", name: "Folake Silva", amount: "₦45,000,000", submitted: "2023-10-25", status: "Rejected" },
];

const AdminApplications = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Loan Applications</h1>
            <p className="text-muted-foreground">Review and manage loan applications</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Application
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by Applicant Name or ID..." 
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select defaultValue="date">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Sort by Date</SelectItem>
                    <SelectItem value="amount">Sort by Amount</SelectItem>
                    <SelectItem value="status">Sort by Status</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Loan Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="personal">Personal Loan</SelectItem>
                    <SelectItem value="business">Business Loan</SelectItem>
                    <SelectItem value="mortgage">Mortgage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">
                      <Checkbox />
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Applicant Name</th>
                    <th className="text-left py-3 px-4 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 font-medium">Submitted</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <Checkbox />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{app.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {app.id}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">{app.amount}</td>
                      <td className="py-3 px-4">{app.submitted}</td>
                      <td className="py-3 px-4">
                        <Badge 
                          variant={
                            app.status === "Approved" ? "default" : 
                            app.status === "Rejected" ? "destructive" : 
                            "secondary"
                          }
                          className={
                            app.status === "Pending" ? "bg-yellow-500 hover:bg-yellow-600" : ""
                          }
                        >
                          {app.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="default">Approve</Button>
                          <Button size="sm" variant="destructive">Reject</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button variant="outline" size="sm">&lt;</Button>
              <Button size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">...</Button>
              <Button variant="outline" size="sm">8</Button>
              <Button variant="outline" size="sm">9</Button>
              <Button variant="outline" size="sm">10</Button>
              <Button variant="outline" size="sm">&gt;</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminApplications;
