import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomerLayout } from "@/components/customer/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Shield, FileText, CheckCircle2, Upload } from "lucide-react";

const ApplyLoan = () => {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    loanType: "",
    loanAmount: "",
    duration: "",
    employmentStatus: "",
    monthlyIncome: "",
    loanPurpose: "",
    documents: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    // For now, we'll just show the success modal
    setShowSuccessModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, documents: e.target.files[0] });
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="loanType">
                    Loan Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.loanType}
                    onValueChange={(value) => setFormData({ ...formData, loanType: value })}
                    required
                  >
                    <SelectTrigger id="loanType">
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto-loan">Auto Loan</SelectItem>
                      <SelectItem value="personal-loan">Personal Loan</SelectItem>
                      <SelectItem value="mortgage">Mortgage</SelectItem>
                      <SelectItem value="business-loan">Business Loan</SelectItem>
                      <SelectItem value="education-loan">Education Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loanAmount">
                    Loan Amount (₦) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="loanAmount"
                    type="text"
                    placeholder="e.g., 1,000,000"
                    value={formData.loanAmount}
                    onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">
                    Duration (Months) <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) => setFormData({ ...formData, duration: value })}
                    required
                  >
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 Months</SelectItem>
                      <SelectItem value="12">12 Months</SelectItem>
                      <SelectItem value="24">24 Months</SelectItem>
                      <SelectItem value="36">36 Months</SelectItem>
                      <SelectItem value="48">48 Months</SelectItem>
                      <SelectItem value="60">60 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employmentStatus">
                    Employment Status <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.employmentStatus}
                    onValueChange={(value) => setFormData({ ...formData, employmentStatus: value })}
                    required
                  >
                    <SelectTrigger id="employmentStatus">
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employed">Employed</SelectItem>
                      <SelectItem value="self-employed">Self-Employed</SelectItem>
                      <SelectItem value="business-owner">Business Owner</SelectItem>
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
                  <Label htmlFor="loanPurpose">
                    Loan Purpose <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="loanPurpose"
                    placeholder="Please describe the purpose of this loan..."
                    value={formData.loanPurpose}
                    onChange={(e) => setFormData({ ...formData, loanPurpose: e.target.value })}
                    className="min-h-[120px]"
                    required
                  />
                </div>
              </div>

              {/* Supporting Documents */}
              <div className="space-y-2">
                <Label>Supporting Documents (Optional)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Upload ID, proof of income, or other documents</p>
                      <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
                    </div>
                    <div>
                      <Input
                        type="file"
                        id="documents"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Label htmlFor="documents" asChild>
                        <Button type="button" variant="outline" className="cursor-pointer">
                          Choose File
                        </Button>
                      </Label>
                      {formData.documents && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Selected: {formData.documents.name}
                        </p>
                      )}
                    </div>
                  </div>
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
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground">
                  Submit Application
                </Button>
              </div>
            </form>
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

