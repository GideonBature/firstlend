import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CustomerLayout } from "@/components/customer/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Shield, FileText, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { loanApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { LoanType } from "@/services/api";

const ApplyLoan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    loanTypeName: "",
    principal: "",
    rate: "",
    term: "",
    employmentStatus: "",
    monthlyIncome: "",
    purpose: "",
  });

  // Fetch loan types on mount
  useEffect(() => {
    const fetchLoanTypes = async () => {
      try {
        setLoadingTypes(true);
        const response = await loanApi.getLoanTypes(1, 50);
        if (response.success && response.data && response.data.length > 0) {
          setLoanTypes(response.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to load loan types",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Error fetching loan types:", err);
        toast({
          title: "Error",
          description: "Failed to load loan types",
          variant: "destructive",
        });
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchLoanTypes();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.loanTypeName) {
      setError("Loan type is required");
      return;
    }
    if (!formData.principal || parseFloat(formData.principal) <= 0) {
      setError("Principal must be greater than 0");
      return;
    }
    if (!formData.term || parseInt(formData.term) < 1 || parseInt(formData.term) > 360) {
      setError("Term must be between 1 and 360 months");
      return;
    }
    if (!formData.employmentStatus) {
      setError("Employment status is required");
      return;
    }
    if (formData.monthlyIncome === "" || parseFloat(formData.monthlyIncome) < 0) {
      setError("Monthly income is required and must be 0 or greater");
      return;
    }
    if (!formData.purpose.trim()) {
      setError("Loan purpose is required");
      return;
    }
    if (formData.purpose.length > 500) {
      setError("Purpose description must be less than 500 characters");
      return;
    }

    // Optional field - only validate if provided
    if (formData.rate && (parseFloat(formData.rate) < 0.01 || parseFloat(formData.rate) > 100)) {
      setError("Interest rate must be between 0.01 and 100");
      return;
    }

    setLoading(true);
    try {
      const response = await loanApi.applyLoan({
        loanTypeName: formData.loanTypeName,
        principal: parseFloat(formData.principal),
        rate: formData.rate ? parseFloat(formData.rate) : undefined,
        term: parseInt(formData.term),
        employmentStatus: formData.employmentStatus,
        monthlyIncome: parseFloat(formData.monthlyIncome),
        purpose: formData.purpose,
      });

      console.log("Apply loan response:", response);

      if (response.success && response.data) {
        setSuccessMessage(`Loan application submitted! Application ID: ${response.data.id}`);
        setShowSuccessModal(true);
        toast({
          title: "Success",
          description: "Your loan application has been submitted successfully!",
        });
      } else {
        const errorMsg = response.message || "Failed to submit application";
        console.error("Application failed:", errorMsg);
        setError(errorMsg);
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error submitting application:", err);
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate("/customer/loans");
  };

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Apply for a Loan</h1>
          <p className="text-muted-foreground">Fill out the form below to apply for a new loan.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Loan Application Form</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loadingTypes ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                  <p className="text-muted-foreground">Loading loan types...</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="loanTypeName">
                      Loan Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.loanTypeName}
                      onValueChange={(value) => setFormData({ ...formData, loanTypeName: value, term: "" })}
                    >
                      <SelectTrigger id="loanTypeName">
                        <SelectValue placeholder="Select loan type" />
                      </SelectTrigger>
                      <SelectContent>
                        {loanTypes.map((loanType) => (
                          <SelectItem key={loanType.id} value={loanType.name}>
                            {loanType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="principal">
                      Principal (₦) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="principal"
                      type="number"
                      placeholder="e.g., 1000000"
                      value={formData.principal}
                      onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                      disabled={!formData.loanTypeName}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="term">
                      Term (Months) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="term"
                      type="number"
                      placeholder="e.g., 12"
                      value={formData.term}
                      onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                      disabled={!formData.loanTypeName}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rate">
                      Interest Rate (%) - Optional
                    </Label>
                    <Input
                      id="rate"
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="100"
                      placeholder="Leave blank to use loan type default"
                      value={formData.rate}
                      onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                      disabled={!formData.loanTypeName}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employmentStatus">
                      Employment Status <span className="text-red-500">*</span>
                    </Label>
                  <Select
                    value={formData.employmentStatus}
                    onValueChange={(value) => setFormData({ ...formData, employmentStatus: value })}
                  >
                    <SelectTrigger id="employmentStatus">
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Employed">Employed</SelectItem>
                      <SelectItem value="Self-employed">Self-Employed</SelectItem>
                      <SelectItem value="Unemployed">Unemployed</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="monthlyIncome">
                    Monthly Income (₦) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="monthlyIncome"
                    type="text"
                    placeholder="e.g., 250,000"
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="purpose">
                    Loan Purpose <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="purpose"
                    placeholder="Please describe the purpose of this loan..."
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="min-h-[120px]"
                    required
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <p className="text-sm text-muted-foreground">
                By submitting this application, you agree to FirstLend's terms and conditions. Your application will be reviewed within 3-5 business days.
              </p>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/customer/dashboard")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </form>
            )}
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Quick Processing</h3>
                  <p className="text-sm text-muted-foreground">Get approval within 3-5 business days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Competitive Rates</h3>
                  <p className="text-sm text-muted-foreground">Interest rates from 12% per annum</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Flexible Terms</h3>
                  <p className="text-sm text-muted-foreground">Repayment periods from 6 to 60 months</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">Application Submitted Successfully!</DialogTitle>
            <DialogDescription className="text-center pt-4">
              Your loan application has been received and is currently under review. You will be notified via email within 3-5 business days with the status of your application.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4">
            <Button onClick={handleSuccessClose} className="w-full">
              View My Loans
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/customer/dashboard");
              }}
              className="w-full"
            >
              Back to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </CustomerLayout>
  );
};

export default ApplyLoan;

