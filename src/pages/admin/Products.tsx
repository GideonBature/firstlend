import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { adminApi, AdminLoanProduct } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const AdminProducts = () => {
  const [loanProducts, setLoanProducts] = useState<AdminLoanProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminLoanProduct | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    interest: "",
    maxTermMonths: "",
  });
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLoanProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getLoanProducts(1, 100);
      if (response.success) {
        setLoanProducts(response.data || []);
      } else {
        setError(response.message || "Unable to load loan products.");
      }
    } catch (err) {
      console.error("Failed to fetch loan products:", err);
      setError("Failed to load loan products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoanProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return loanProducts;
    return loanProducts.filter((product) =>
      product.name.toLowerCase().includes(term)
    );
  }, [loanProducts, searchTerm]);

  const openCreateDialog = () => {
    setEditingProduct(null);
    setFormData({ name: "", interest: "", maxTermMonths: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (product: AdminLoanProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      interest: String(product.interest),
      maxTermMonths: product.maxTermMonths ? String(product.maxTermMonths) : "",
    });
    setDialogOpen(true);
  };

  const handleFormSubmit = async () => {
    if (!formData.name.trim() || !formData.interest) {
      toast({
        title: "Validation error",
        description: "Name and interest are required.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      name: formData.name.trim(),
      interest: Number(formData.interest),
      maxTermMonths: formData.maxTermMonths ? Number(formData.maxTermMonths) : undefined,
    };

    try {
      setFormSubmitting(true);
      const response = editingProduct
        ? await adminApi.updateLoanProduct(editingProduct.id, payload)
        : await adminApi.createLoanProduct(payload);

      if (response.success) {
        toast({
          title: "Success",
          description: editingProduct ? "Loan product updated." : "Loan product created.",
        });
        setDialogOpen(false);
        fetchLoanProducts();
      } else {
        toast({
          title: "Error",
          description: response.message || "Unable to save loan product.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Failed to submit loan product form:", err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleStatus = async (product: AdminLoanProduct) => {
    try {
      setActionLoadingId(product.id);
      const response = await adminApi.toggleLoanProductStatus(product.id);
      if (response.success) {
        toast({
          title: "Success",
          description: `Loan product ${product.isActive ? "deactivated" : "activated"}.`,
        });
        fetchLoanProducts();
      } else {
        toast({
          title: "Error",
          description: response.message || "Unable to update status.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Failed to toggle loan product status:", err);
      toast({
        title: "Error",
        description: "Something went wrong while updating status.",
        variant: "destructive",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatInterest = (value: number) => `${value}%`;
  const formatTerm = (value?: number | null) =>
    value === null || value === undefined ? "—" : `${value} Months`;

  const renderStatusBadge = (product: AdminLoanProduct) =>
    product.isActive ? (
      <Badge className="bg-green-500 hover:bg-green-600 text-white">Active</Badge>
    ) : (
      <Badge className="bg-gray-500 hover:bg-gray-600 text-white">Inactive</Badge>
    );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Loan Products</h1>
            <p className="text-muted-foreground">
              Manage and configure all loan products offered by the bank.
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Loan Product
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search for a loan product..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Products Table */}
        <Card>
          <CardContent className="p-0">
            {error && !loading && (
              <Alert variant="destructive" className="m-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                Loading loan products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No loan products found.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>LOAN NAME</TableHead>
                    <TableHead>INTEREST RATE</TableHead>
                    <TableHead>MAX TERM</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{formatInterest(product.interest)}</TableCell>
                      <TableCell>{formatTerm(product.maxTermMonths)}</TableCell>
                      <TableCell>{renderStatusBadge(product)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Button
                            variant="link"
                            className="text-primary p-0 h-auto"
                            onClick={() => openEditDialog(product)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="link"
                            className={`p-0 h-auto ${
                              product.isActive ? "text-red-500" : "text-green-500"
                            }`}
                            disabled={actionLoadingId === product.id}
                            onClick={() => handleToggleStatus(product)}
                          >
                            {actionLoadingId === product.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : product.isActive ? (
                              "Deactivate"
                            ) : (
                              "Activate"
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Loan Product" : "Add New Loan Product"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loan-name">Loan Name</Label>
              <Input
                id="loan-name"
                placeholder="Enter loan name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interest-rate">Interest Rate (%)</Label>
              <Input
                id="interest-rate"
                type="number"
                step="0.1"
                placeholder="e.g. 12.5"
                value={formData.interest}
                onChange={(e) => setFormData((prev) => ({ ...prev, interest: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-term">Max Term (Months)</Label>
              <Input
                id="max-term"
                type="number"
                placeholder="e.g. 36"
                value={formData.maxTermMonths}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, maxTermMonths: e.target.value }))
                }
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={formSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleFormSubmit} disabled={formSubmitting}>
              {formSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : editingProduct ? (
                "Save Changes"
              ) : (
                "Create Product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProducts;
