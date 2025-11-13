import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { adminApi, AdminUser } from "@/services/api";
import { Search, Plus, Shield } from "lucide-react";

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

const PAGE_SIZE = 10;

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [createForm, setCreateForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "Support",
  });

  const [statusValue, setStatusValue] = useState("Active");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const normalizedRole =
        roleFilter !== "all"
          ? roleFilter
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          : undefined;
      const normalizedStatus =
        statusFilter !== "all"
          ? statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)
          : undefined;
      const response = await adminApi.getUsers({
        page: currentPage,
        pageSize: PAGE_SIZE,
        userType: "Admin",
        role: normalizedRole,
        status: normalizedStatus,
      });
      if (response.success) {
        const adminsOnly = (response.data || []).filter(
          (user) => user.userType?.toLowerCase() === "admin"
        );
        setUsers(adminsOnly);
        setTotalCount(response.totalCount || 0);
      } else {
        setError(response.message || "Failed to load admin users");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load admin users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, roleFilter, statusFilter]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || (user.role || "Support").toLowerCase() === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleCreateAdmin = async () => {
    if (!createForm.fullName || !createForm.email || !createForm.password || !createForm.phoneNumber) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    try {
      setFormLoading(true);
      const response = await adminApi.createAdminUser(createForm);
      if (response.success) {
        toast({ title: "Success", description: "Admin user created successfully." });
        setCreateForm({ fullName: "", email: "", password: "", phoneNumber: "", role: "Support" });
        setIsCreateOpen(false);
        fetchUsers();
      } else {
        toast({ title: "Error", description: response.message || "Failed to create admin user", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Unable to create admin user.", variant: "destructive" });
    } finally {
      setFormLoading(false);
    }
  };

  const openStatusModal = (user: AdminUser) => {
    setSelectedUser(user);
    setStatusValue(user.status || "Active");
    setIsStatusOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedUser) return;
    try {
      setFormLoading(true);
      const response = await adminApi.updateAdminStatus(selectedUser.id, statusValue);
      if (response.success) {
        toast({ title: "Status updated", description: `${selectedUser.fullName} is now ${statusValue}.` });
        setIsStatusOpen(false);
        fetchUsers();
      } else {
        toast({ title: "Error", description: response.message || "Failed to update status", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Unable to update status.", variant: "destructive" });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      setFormLoading(true);
      const response = await adminApi.deleteAdminUser(selectedUser.id);
      if (response.success) {
        toast({ title: "Deleted", description: `${selectedUser.fullName} removed.` });
        setIsDeleteOpen(false);
        fetchUsers();
      } else {
        toast({ title: "Error", description: response.message || "Failed to delete user", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Unable to delete user.", variant: "destructive" });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin User Management</h1>
          <p className="text-muted-foreground">Manage admin users, roles, and permissions.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-3 w-full sm:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by name or email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Role: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Role: All</SelectItem>
                <SelectItem value="super admin">Super Admin</SelectItem>
                <SelectItem value="loan officer">Loan Officer</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="auditor">Auditor</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Status: All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Admin
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-16 text-center text-muted-foreground">Loading users...</div>
            ) : error ? (
              <div className="py-16 text-center text-red-500">{error}</div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">No admin users found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ADMIN USER</TableHead>
                    <TableHead>EMAIL</TableHead>
                    <TableHead>ROLE</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead>CREATED</TableHead>
                    <TableHead>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {getInitials(user.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{user.fullName}</span>
                            <span className="text-xs text-muted-foreground">{user.role || "Support"}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            roleClasses[user.role || "Support"] ?? "bg-muted text-foreground"
                          }`}
                        >
                          {user.role || "Support"}
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
                      <TableCell>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <button className="text-sm font-medium text-blue-600 hover:underline" onClick={() => openStatusModal(user)}>
                            Edit
                          </button>
                          <button
                            className={`text-sm font-medium ${user.status === "Active" ? "text-red-500" : "text-emerald-600"}`}
                            onClick={() => {
                              setSelectedUser(user);
                              setStatusValue(user.status === "Active" ? "Suspended" : "Active");
                              setIsStatusOpen(true);
                            }}
                          >
                            {user.status === "Active" ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            className="text-sm font-medium text-muted-foreground hover:text-red-500"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDeleteOpen(true);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {!loading && filteredUsers.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}-
              {Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount} admin users
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => Math.max(1, prev - 1));
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    {currentPage}
                  </PaginationLink>
                </PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => prev + 1);
                  }}
                />
              </PaginationContent>
            </Pagination>
          </div>
        )}

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

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Admin</DialogTitle>
            <DialogDescription>Provide details to create an admin user.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={createForm.fullName} onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input value={createForm.phoneNumber} onChange={(e) => setCreateForm({ ...createForm, phoneNumber: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={createForm.role} onValueChange={(value) => setCreateForm({ ...createForm, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                  <SelectItem value="Loan Officer">Loan Officer</SelectItem>
                  <SelectItem value="Auditor">Auditor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={formLoading}>
              Cancel
            </Button>
            <Button onClick={handleCreateAdmin} disabled={formLoading}>
              {formLoading ? "Creating..." : "Create Admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
            <DialogDescription>Set the availability status for {selectedUser?.fullName}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={statusValue} onValueChange={setStatusValue}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusOpen(false)} disabled={formLoading}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={formLoading}>
              {formLoading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove admin user</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedUser?.fullName}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={formLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} disabled={formLoading}>
              {formLoading ? "Removing..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminUsers;
