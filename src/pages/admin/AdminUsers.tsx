import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Plus, Shield, MoreVertical } from "lucide-react";

const adminUsersData = [
  { name: "Adewale Johnson", email: "adewale.j@firstlend.com", role: "Super Admin", status: "Active", lastLogin: "2024-11-02 09:30 AM" },
  { name: "Ngozi Okafor", email: "ngozi.o@firstlend.com", role: "Loan Officer", status: "Active", lastLogin: "2024-11-02 08:15 AM" },
  { name: "Chukwudi Eze", email: "chukwudi.e@firstlend.com", role: "Support", status: "Active", lastLogin: "2024-11-01 05:45 PM" },
  { name: "Fatima Bello", email: "fatima.b@firstlend.com", role: "Auditor", status: "Inactive", lastLogin: "2024-10-28 02:20 PM" },
  { name: "Ibrahim Musa", email: "ibrahim.m@firstlend.com", role: "Loan Officer", status: "Suspended", lastLogin: "2024-10-15 11:00 AM" },
];

const roleClasses: Record<string, string> = {
  "Super Admin": "bg-purple-100 text-purple-700",
  "Loan Officer": "bg-blue-100 text-blue-600",
  Support: "bg-cyan-100 text-cyan-600",
  Auditor: "bg-amber-100 text-amber-600",
};

const statusClasses: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-600",
  Inactive: "bg-slate-200 text-slate-600",
  Suspended: "bg-red-100 text-red-600",
};

const statusDotClasses: Record<string, string> = {
  Active: "bg-emerald-500",
  Inactive: "bg-slate-400",
  Suspended: "bg-red-500",
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part.at(0))
    .join("")
    .toUpperCase();

const AdminUsers = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin User Management</h1>
          <p className="text-muted-foreground">Manage admin users, roles, and permissions.</p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-3 w-full sm:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by name or email..."
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Role: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="super-admin">Super Admin</SelectItem>
                <SelectItem value="loan-officer">Loan Officer</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="auditor">Auditor</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Admin
          </Button>
        </div>

        {/* Admin Users Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ADMIN USER</TableHead>
                  <TableHead>EMAIL</TableHead>
                  <TableHead>ROLE</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead>LAST LOGIN</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminUsersData.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{user.name}</span>
                          {user.role === "Super Admin" && (
                            <span className="text-xs text-purple-600">Super Admin</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          roleClasses[user.role] ?? "bg-muted text-foreground"
                        }`}
                      >
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                          statusClasses[user.status] ?? "bg-muted text-foreground"
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${statusDotClasses[user.status] ?? "bg-slate-400"}`} />
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <button className="text-sm font-medium text-blue-600 hover:underline">Edit</button>
                        {user.status === "Active" && (
                          <button className="text-sm font-medium text-red-500 hover:underline">Deactivate</button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing 1 to 5 of 5 admin users</p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* Role Permissions Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <CardTitle>Role Permissions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <div className="font-semibold mb-2">Super Admin</div>
                <p className="text-sm text-muted-foreground">Full system access</p>
              </div>
              <div>
                <div className="font-semibold mb-2">Support</div>
                <p className="text-sm text-muted-foreground">View customers, handle tickets</p>
              </div>
              <div>
                <div className="font-semibold mb-2">Loan Officer</div>
                <p className="text-sm text-muted-foreground">Approve loans, manage customers</p>
              </div>
              <div>
                <div className="font-semibold mb-2">Auditor</div>
                <p className="text-sm text-muted-foreground">View reports, export data</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
