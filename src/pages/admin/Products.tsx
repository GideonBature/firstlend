import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus } from "lucide-react";

const productsData = [
  { name: "Personal Loan", interestRate: "15%", maxTerm: "36 Months", status: "Active" },
  { name: "SME Business Loan", interestRate: "12.5%", maxTerm: "60 Months", status: "Active" },
  { name: "Mortgage Advance", interestRate: "9%", maxTerm: "240 Months", status: "Inactive" },
  { name: "Auto Loan", interestRate: "18%", maxTerm: "48 Months", status: "Active" },
];

const AdminProducts = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Loan Products</h1>
            <p className="text-muted-foreground">Manage and configure all loan products offered by the bank.</p>
          </div>
          <Button>
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
          />
        </div>

        {/* Products Table */}
        <Card>
          <CardContent className="p-0">
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
                {productsData.map((product) => (
                  <TableRow key={product.name}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.interestRate}</TableCell>
                    <TableCell>{product.maxTerm}</TableCell>
                    <TableCell>
                      {product.status === "Active" ? (
                        <Badge className="bg-green-500 hover:bg-green-600 text-white">Active</Badge>
                      ) : (
                        <Badge className="bg-gray-500 hover:bg-gray-600 text-white">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Button variant="link" className="text-primary p-0 h-auto">Edit</Button>
                        {product.status === "Active" ? (
                          <Button variant="link" className="text-red-500 p-0 h-auto">Deactivate</Button>
                        ) : (
                          <Button variant="link" className="text-green-500 p-0 h-auto">Activate</Button>
                        )}
                      </div>
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

export default AdminProducts;
