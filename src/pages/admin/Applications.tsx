import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Plus, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { adminApi, LoanResponse } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const AdminApplications = () => {
  const [applications, setApplications] = useState<LoanResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(new Set());
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingLoanId, setRejectingLoanId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processingLoanId, setProcessingLoanId] = useState<string | null>(null);
  const { toast } = useToast();

  const totalPages = Math.ceil(totalCount / pageSize);

  // Fetch applications from backend
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminApi.getLoans({
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchTerm || undefined,
        sortBy: sortBy,
        sortOrder: "desc",
        page: currentPage,
        pageSize: pageSize,
      });

      if (response.success) {
        setApplications(response.data || []);
        setTotalCount(response.totalCount || 0);
      } else {
        setError(response.message || "Failed to load applications");
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch applications on mount and when filters change
  useEffect(() => {
    fetchApplications();
  }, [statusFilter, sortBy, currentPage]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchApplications();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleApprove = async (loanId: string) => {
    try {
      setProcessingLoanId(loanId);
      const response = await adminApi.approveLoan(loanId);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Loan application approved successfully",
        });
        fetchApplications(); // Refresh the list
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to approve loan",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error approving loan:", err);
      toast({
        title: "Error",
        description: "Failed to approve loan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingLoanId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectingLoanId || !rejectReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    try {
      setProcessingLoanId(rejectingLoanId);
      const response = await adminApi.rejectLoan(rejectingLoanId, rejectReason);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Loan application rejected",
        });
        setRejectDialogOpen(false);
        setRejectingLoanId(null);
        setRejectReason("");
        fetchApplications(); // Refresh the list
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to reject loan",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error rejecting loan:", err);
      toast({
        title: "Error",
        description: "Failed to reject loan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingLoanId(null);
    }
  };

  const openRejectDialog = (loanId: string) => {
    setRejectingLoanId(loanId);
    setRejectDialogOpen(true);
  };

  const toggleSelectAll = () => {
    if (selectedApplications.size === applications.length) {
      setSelectedApplications(new Set());
    } else {
      setSelectedApplications(new Set(applications.map(app => app.id)));
    }
  };

  const toggleSelectApplication = (id: string) => {
    const newSelected = new Set(selectedApplications);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedApplications(newSelected);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusClassName = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus === "pending") {
      return "bg-yellow-500 hover:bg-yellow-600 text-white";
    }
    return "";
  };

  const shouldDisableAction = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    return (
      normalizedStatus === "approved" ||
      normalizedStatus === "rejected" ||
      normalizedStatus === "active"
    );
  };

  const renderVerificationCell = (app: LoanResponse) => {
    const links = [
      {
        label: "BS",
        url: app.bankStatementUrl,
        srLabel: "View bank statement",
      },
      {
        label: "GD",
        url: app.guarantorDocumentUrl,
        srLabel: "View guarantor document",
      },
    ];

    return (
      <div className="flex flex-wrap gap-4">
        {links.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <span>{item.label}</span>
            {item.url ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full border border-border hover:bg-primary/10"
                asChild
              >
                <a href={item.url} target="_blank" rel="noreferrer">
                  <Eye className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="sr-only">{item.srLabel}</span>
                </a>
              </Button>
            ) : (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground/60">
                <EyeOff className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">{`${item.label === "BS" ? "Bank statement" : "Guarantor document"} not uploaded`}</span>
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Loan Applications</h1>
            <p className="text-muted-foreground">Review and manage loan applications</p>
            <p className="text-xs text-muted-foreground mt-1">
              BS = Bank Statement • GD = Guarantor Document
            </p>
          </div>
          <Button className="gap-2 w-full justify-center sm:w-auto">
            <Plus className="w-4 h-4" />
            New Application
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by Applicant Name or ID..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Sort by Date</SelectItem>
                    <SelectItem value="amount">Sort by Amount</SelectItem>
                    <SelectItem value="status">Sort by Status</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                  <p className="text-muted-foreground">Loading applications...</p>
                </div>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No applications found.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">
                          <Checkbox 
                            checked={selectedApplications.size === applications.length && applications.length > 0}
                            onCheckedChange={toggleSelectAll}
                          />
                        </th>
                        <th className="text-left py-3 px-4 font-medium">Applicant Name</th>
                        <th className="text-left py-3 px-4 font-medium">Amount</th>
                        <th className="text-left py-3 px-4 font-medium">Submitted</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Verify</th>
                        <th className="text-left py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr key={app.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <Checkbox 
                              checked={selectedApplications.has(app.id)}
                              onCheckedChange={() => toggleSelectApplication(app.id)}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium">{app.borrowerName}</div>
                              <div className="text-sm text-muted-foreground">{app.borrowerEmail}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium">{formatCurrency(app.principal)}</td>
                          <td className="py-3 px-4">{formatDate(app.createdAt)}</td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant={getStatusBadgeVariant(app.status)}
                              className={getStatusClassName(app.status)}
                            >
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {renderVerificationCell(app)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => handleApprove(app.id)}
                                disabled={
                                  processingLoanId === app.id || 
                                  shouldDisableAction(app.status)
                                }
                              >
                                {processingLoanId === app.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  "Approve"
                                )}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => openRejectDialog(app.id)}
                                disabled={
                                  processingLoanId === app.id || 
                                  shouldDisableAction(app.status)
                                }
                              >
                                Reject
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      &lt;
                    </Button>
                    
                    {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = idx + 1;
                      } else if (currentPage <= 3) {
                        pageNum = idx + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + idx;
                      } else {
                        pageNum = currentPage - 2 + idx;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          size="sm"
                          variant={currentPage === pageNum ? "default" : "outline"}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="px-2">...</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      &gt;
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Loan Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this loan application.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectingLoanId(null);
                setRejectReason("");
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!rejectReason.trim() || !!processingLoanId}
            >
              {processingLoanId ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Rejecting...
                </>
              ) : (
                "Reject Application"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminApplications;
