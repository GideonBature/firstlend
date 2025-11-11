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
import { Clock, Shield, FileText, CheckCircle2, Loader2, AlertCircle, ShieldAlert } from "lucide-react";
import { loanApi, authApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { LoanType } from "@/services/api";

const ApplyLoan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [isKYCVerified, setIsKYCVerified] = useState<boolean | null>(null);
  const [checkingKYC, setCheckingKYC] = useState(true);
  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [checkingCreditScore, setCheckingCreditScore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    loanTypeId: "",
    loanTypeName: "",
    principal: "",
    rate: "",
    term: "",
    employmentStatus: "",
    monthlyIncome: "",
    purpose: "",
  });

  // Check KYC status and credit score
  useEffect(() => {
    const checkEligibility = async () => {
      try {
        setCheckingKYC(true);
        setCheckingCreditScore(true);

        // Check KYC status
        const kycResponse = await authApi.getKYCStatus();
        if (kycResponse.success && kycResponse.data) {
          setIsKYCVerified(kycResponse.data.isVerified);
          
          // Only check credit score if KYC is verified
          if (kycResponse.data.isVerified) {
            try {
              const creditResponse = await authApi.getCreditScore();
              if (creditResponse.success && creditResponse.data) {
                setCreditScore(creditResponse.data.score);
              }
            } catch (err) {
              console.error("Error fetching credit score:", err);
            }
          } else {
            toast({
              title: "KYC Verification Required",
              description: "Please complete your KYC verification to apply for loans.",
              variant: "destructive",
            });
          }
        } else {
          setIsKYCVerified(false);
        }
      } catch (err) {
        console.error("Error checking eligibility:", err);
        setIsKYCVerified(false);
      } finally {
        setCheckingKYC(false);
        setCheckingCreditScore(false);
      }
    };

    checkEligibility();
  }, [toast]);

  // Fetch loan types when user is eligible
  useEffect(() => {
    const fetchLoanTypes = async () => {
      // Only fetch if KYC is verified and credit score is sufficient
      if (!isKYCVerified || (creditScore !== null && creditScore < 50)) {
        return;
      }

      try {
        setLoadingTypes(true);
        const response = await loanApi.getLoanTypes(1, 50);
        console.log("Loan types response:", response);
        if (response.success && response.data && response.data.length > 0) {
          setLoanTypes(response.data);
          console.log("Loaded loan types:", response.data);
        } else {
          console.log("No loan types in response");
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

    if (isKYCVerified !== null && !checkingKYC && !checkingCreditScore) {
      fetchLoanTypes();
    }
  }, [toast, isKYCVerified, creditScore, checkingKYC, checkingCreditScore]);

  // Calculate monthly payment
  const calculateMonthlyPayment = () => {
    const principal = parseFloat(formData.principal);
    const annualRate = parseFloat(formData.rate);
    const termMonths = parseInt(formData.term);

    if (!principal || !annualRate || !termMonths) return 0;

    const monthlyRate = annualRate / 100 / 12;
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
    
    return monthlyPayment;
  };

  const calculateTotalPayment = () => {
    const monthlyPayment = calculateMonthlyPayment();
    const termMonths = parseInt(formData.term);
    return monthlyPayment * termMonths;
  };

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
    if (!formData.rate || parseFloat(formData.rate) <= 0) {
      setError("Interest rate is required");
      return;
    }

    // Show confirmation modal instead of submitting directly
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    try {
      const response = await loanApi.applyLoan({
        loanTypeName: formData.loanTypeName,
        principal: parseFloat(formData.principal),
        rate: parseFloat(formData.rate),
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

        {/* KYC Verification Check */}
        {checkingKYC || checkingCreditScore ? (
          <Card>
            <CardContent className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-lg text-muted-foreground">Verifying your account...</p>
              </div>
            </CardContent>
          </Card>
        ) : !isKYCVerified ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-10 h-10 text-red-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-red-900">KYC Verification Required</h2>
                  <p className="text-red-700 max-w-md mx-auto">
                    You need to complete your KYC (Know Your Customer) verification before you can apply for a loan.
                    This helps us verify your identity and protect your account.
                  </p>
                </div>
                <Alert className="max-w-md mx-auto bg-white border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-900">Verification Steps Required:</AlertTitle>
                  <AlertDescription className="text-red-700">
                    <ul className="list-disc list-inside mt-2 space-y-1 text-left">
                      <li>Verify your BVN (Bank Verification Number)</li>
                      <li>Verify your NIN (National Identification Number)</li>
                      <li>Upload required documents (Government ID, Proof of Address)</li>
                    </ul>
                  </AlertDescription>
                </Alert>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate("/customer/profile")}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Complete KYC Verification
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/customer/dashboard")}
                    className="border-red-300 hover:bg-red-50"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : creditScore !== null && creditScore < 50 ? (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-10 h-10 text-orange-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-orange-900">Insufficient Credit Score</h2>
                  <p className="text-orange-700 max-w-md mx-auto">
                    Your current credit score of <strong>{creditScore}%</strong> does not meet the minimum requirement of 50% to apply for a loan.
                  </p>
                </div>
                <Alert className="max-w-md mx-auto bg-white border-orange-200">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertTitle className="text-orange-900">How to Improve Your Credit Score:</AlertTitle>
                  <AlertDescription className="text-orange-700">
                    <ul className="list-disc list-inside mt-2 space-y-1 text-left">
                      <li>Make timely payments on existing loans</li>
                      <li>Keep your credit utilization low</li>
                      <li>Avoid applying for multiple loans at once</li>
                      <li>Review your credit report for errors</li>
                    </ul>
                  </AlertDescription>
                </Alert>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate("/customer/dashboard")}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    View Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/customer/support")}
                    className="border-orange-300 hover:bg-orange-50"
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
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
                      value={formData.loanTypeId}
                      onValueChange={(value) => {
                        console.log("Loan type selected:", value);
                        const selectedLoan = loanTypes.find(loan => loan.id === value);
                        if (!selectedLoan) {
                          console.error("Selected loan type not found:", value);
                          setFormData({
                            ...formData,
                            loanTypeId: "",
                            loanTypeName: "",
                            term: "",
                            rate: "",
                          });
                          return;
                        }
                        console.log("Selected loan details:", selectedLoan);
                        // Handle both 'interest' and 'interestRate' property names
                        const interestRate = (selectedLoan as any).interest || selectedLoan.interestRate || 0;
                        setFormData({ 
                          ...formData,
                          loanTypeId: selectedLoan.id, 
                          loanTypeName: selectedLoan.name, 
                          term: "",
                          rate: interestRate.toString(),
                        });
                      }}
                    >
                      <SelectTrigger id="loanTypeName" className="w-full">
                        <SelectValue placeholder="Select loan type" />
                      </SelectTrigger>
                      <SelectContent position="popper" sideOffset={5}>
                        {loanTypes.length > 0 ? (
                          loanTypes.map((loanType) => (
                            <SelectItem key={loanType.id} value={loanType.id}>
                              {loanType.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-muted-foreground">No loan types available</div>
                        )}
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
                      Interest Rate (%)
                    </Label>
                    <Input
                      id="rate"
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="100"
                      placeholder="Select a loan type to see rate"
                      value={formData.rate}
                      readOnly
                      disabled={!formData.loanTypeName}
                      className="bg-muted"
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
        )}

        {/* Feature Cards - Only show if eligible */}
        {isKYCVerified && (creditScore === null || creditScore >= 50) && (
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
        )}
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm Loan Application</DialogTitle>
            <DialogDescription>
              Please review your loan details before submitting your application.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Loan Type:</span>
                <span className="font-semibold">{formData.loanTypeName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Principal Amount:</span>
                <span className="font-semibold">₦{parseFloat(formData.principal || "0").toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Interest Rate:</span>
                <span className="font-semibold">{formData.rate}% per annum</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Term:</span>
                <span className="font-semibold">{formData.term} months</span>
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold text-primary mb-3">Payment Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Monthly Payment:</span>
                  <span className="font-bold text-lg">₦{calculateMonthlyPayment().toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Interest:</span>
                  <span className="font-semibold">₦{(calculateTotalPayment() - parseFloat(formData.principal || "0")).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-semibold">Total Repayment:</span>
                  <span className="font-bold text-lg text-primary">₦{calculateTotalPayment().toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                By proceeding, you confirm that all information provided is accurate and you agree to the terms and conditions of this loan.
              </AlertDescription>
            </Alert>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Confirm & Submit"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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

