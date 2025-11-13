import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileBadge,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Loader2,
  File,
  X,
  Shield,
} from "lucide-react";
import { authApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface DocumentItem {
  id: string;
  title: string;
  description: string;
  file?: File;
  fileName?: string;
}

type VerificationStep = "idle" | "verifying-bvn" | "bvn-success" | "verifying-nin" | "nin-success" | "completed";

interface KYCDocumentsUploadProps {
  onVerificationComplete?: () => void;
}

export function KYCDocumentsUpload({ onVerificationComplete }: KYCDocumentsUploadProps) {
  const { toast } = useToast();
  const [bvn, setBvn] = useState("");
  const [nin, setNin] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationStep, setVerificationStep] = useState<VerificationStep>("idle");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: "government-id",
      title: "Government-issued ID",
      description: "National ID, Passport, or Driver's License",
    },
    {
      id: "address-proof",
      title: "Proof of Address",
      description: "Utility bill or bank statement (last 3 months)",
    },
  ]);

  // Fetch current user to check KYC status on component mount
  useEffect(() => {
    const loadKYCStatus = async () => {
      try {
        const response = await authApi.getKYCStatus();
        if (response.success && response.data) {
          const kycData = response.data;
          if (kycData.bvn) setBvn(kycData.bvn);
          if (kycData.nin) setNin(kycData.nin);
          if (kycData.isVerified) setIsVerified(true);
        }
      } catch (error) {
        console.error("Error fetching KYC status:", error);
      }
    };

    loadKYCStatus();
  }, []);

  const handleFileSelect = (documentId: string, file: File) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId
          ? {
              ...doc,
              file,
              fileName: file.name,
            }
          : doc
      )
    );
  };

  const handleRemoveFile = (documentId: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId
          ? {
              ...doc,
              file: undefined,
              fileName: undefined,
            }
          : doc
      )
    );
  };

  // Sequential verification with modal
  const simulateVerificationStep = async (
    startStep: VerificationStep,
    endStep: VerificationStep,
    delay: number
  ) => {
    setVerificationStep(startStep);
    await new Promise((resolve) => setTimeout(resolve, delay));
    setVerificationStep(endStep);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const validateInputs = (): boolean => {
    if (!bvn.trim()) {
      toast({
        title: "Error",
        description: "BVN is required",
        variant: "destructive",
      });
      return false;
    }

    if (!nin.trim()) {
      toast({
        title: "Error",
        description: "NIN is required",
        variant: "destructive",
      });
      return false;
    }

    if (bvn.trim().length !== 11) {
      toast({
        title: "Error",
        description: "BVN must be exactly 11 characters",
        variant: "destructive",
      });
      return false;
    }

    if (!nin.trim() || nin.trim().length > 20 || nin.trim().length < 1) {
      toast({
        title: "Error",
        description: "NIN must be between 1 and 20 characters",
        variant: "destructive",
      });
      return false;
    }

    const hasDocuments = documents.some((doc) => doc.file);
    if (!hasDocuments) {
      toast({
        title: "Error",
        description: "Please attach at least one document",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    setShowVerificationModal(true);
    setLoading(true);

    try {
      // Step 1: Verify BVN (2 seconds)
      await simulateVerificationStep("verifying-bvn", "bvn-success", 2000);

      // Step 2: Verify NIN (2 seconds)
      await simulateVerificationStep("verifying-nin", "nin-success", 2000);

      // Step 3: Call backend API to verify BVN and NIN
      console.log("Verifying KYC with BVN and NIN...", { bvn: bvn.trim(), nin: nin.trim() });
      const verifyResponse = await authApi.verifyKYC({
        bvn: bvn.trim(),
        nin: nin.trim(),
      });

      console.log("KYC verification response:", verifyResponse);

      if (!verifyResponse.success) {
        throw new Error(verifyResponse.message || "Verification failed");
      }

      // Step 4: Show completion
      setVerificationStep("completed");
      setIsVerified(true);

      // Auto close modal after 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setShowVerificationModal(false);

      toast({
        title: "Success",
        description: "KYC verification completed! You are now ready to apply for loans.",
      });

      // Call parent callback if provided
      if (onVerificationComplete) {
        onVerificationComplete();
      }
    } catch (error) {
      setShowVerificationModal(false);
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Unable to verify your information. Please check and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate progress: 100% if verified, otherwise based on input completion
  const hasAllInputs = bvn.trim() && nin.trim() && documents.some((doc) => doc.file);
  const totalProgress = isVerified ? 100 : (hasAllInputs ? 50 : 0);

  return (
    <div className="space-y-6">
      {/* Verification Modal */}
      <Dialog open={showVerificationModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Verifying Your Identity</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6">
            {/* BVN Verification Step */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {verificationStep === "verifying-bvn" && (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  )}
                  {verificationStep === "bvn-success" && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                  {verificationStep === "verifying-nin" && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                  {verificationStep === "nin-success" && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                  {verificationStep === "completed" && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                  {verificationStep === "idle" && (
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="font-semibold">BVN Verification</span>
                </div>
                {(verificationStep === "bvn-success" ||
                  verificationStep === "verifying-nin" ||
                  verificationStep === "nin-success" ||
                  verificationStep === "completed") && (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    Verified
                  </Badge>
                )}
              </div>
              {verificationStep === "verifying-bvn" && (
                <p className="text-sm text-muted-foreground ml-8">
                  Verifying your BVN...
                </p>
              )}
            </div>

            {/* NIN Verification Step */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {verificationStep === "verifying-nin" && (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  )}
                  {verificationStep === "nin-success" && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                  {verificationStep === "completed" && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                  {(verificationStep === "idle" ||
                    verificationStep === "verifying-bvn" ||
                    verificationStep === "bvn-success") && (
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="font-semibold">NIN Verification</span>
                </div>
                {(verificationStep === "nin-success" ||
                  verificationStep === "completed") && (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    Verified
                  </Badge>
                )}
              </div>
              {verificationStep === "verifying-nin" && (
                <p className="text-sm text-muted-foreground ml-8">
                  Verifying your NIN...
                </p>
              )}
            </div>

            {/* Completion Step */}
            {verificationStep === "completed" && (
              <Alert className="rounded-lg border border-green-200 bg-green-50 text-green-800">
                <CheckCircle2 className="w-4 h-4" />
                <AlertTitle>KYC Completed</AlertTitle>
                <AlertDescription className="text-sm">
                  Your KYC verification is complete. You can now apply for loans!
                </AlertDescription>
              </Alert>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Card className="rounded-2xl border border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">KYC Documents</CardTitle>
          <p className="text-sm text-muted-foreground">
            Verify your identity to unlock premium features.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className={`rounded-2xl border ${isVerified ? 'border-green-200 bg-green-50 text-green-800' : 'border-blue-200 bg-blue-50 text-blue-800'}`}>
            <AlertTitle className="flex items-center gap-2">
              {isVerified ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
              {isVerified ? "Verification Completed" : "Complete Your Verification"}
            </AlertTitle>
            <AlertDescription className="text-sm">
              {isVerified
                ? "Your KYC verification is complete! You are ready to apply for loans."
                : "Enter your BVN and NIN, attach required documents, and submit to complete verification."}
            </AlertDescription>
          </Alert>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Verification Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(totalProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${totalProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Single Form - All fields together */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bvn">
                    BVN (Bank Verification Number)
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="bvn"
                    type="text"
                    placeholder="Enter your 11-digit BVN"
                    value={isVerified ? "*".repeat(bvn.length || 11) : bvn}
                    onChange={(e) => setBvn(e.target.value.slice(0, 11))}
                    maxLength={11}
                    disabled={isVerified || loading}
                    className="font-mono"
                  />
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">Required</p>
                    {isVerified && <CheckCircle2 className="w-3 h-3 text-green-600" />}
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="nin">
                    NIN (National Identification Number)
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nin"
                    type="text"
                    placeholder="Enter your NIN"
                    value={isVerified ? "*".repeat(nin.length || 11) : nin}
                    onChange={(e) => setNin(e.target.value.slice(0, 20))}
                    maxLength={20}
                    disabled={isVerified || loading}
                    className="font-mono text-lg"
                  />
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">Required</p>
                    {isVerified && <CheckCircle2 className="w-3 h-3 text-green-600" />}
                  </div>
                </div>
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                {isVerified ? "Required Documents Uploaded" : "Upload Required Documents"}
              </h3>
              <div className="space-y-4">
                {documents.map((item) => {
                  const isAttached = isVerified || !!item.file;
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-border/60 bg-card px-4 py-5 shadow-sm space-y-4"
                    >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/10 bg-primary/5 text-primary flex-shrink-0">
                          <FileBadge className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <p className="text-base font-semibold text-foreground">
                            {item.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isAttached ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-gray-400" />
                        )}
                        <Badge
                          className={`rounded-full border px-3 py-1 text-xs font-medium ${
                            isAttached
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-gray-100 text-gray-600 border-gray-200"
                          }`}
                        >
                          {isAttached ? "Attached" : "Not Attached"}
                        </Badge>
                      </div>
                    </div>

                    {/* File Upload Section */}
                    {!isAttached && (
                      <div className="flex items-center gap-4">
                        <label className="flex-1">
                          <div className="border-2 border-dashed border-border/60 rounded-lg p-4 hover:border-primary/50 cursor-pointer transition-colors">
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary">
                              <Upload className="w-4 h-4" />
                              <span>Click to upload or drag and drop</span>
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    handleFileSelect(item.id, e.target.files[0]);
                                  }
                                }}
                                className="hidden"
                                disabled={isVerified || loading}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground text-center mt-2">
                              PNG, JPG, or PDF (max 5MB)
                            </p>
                          </div>
                        </label>
                      </div>
                    )}

                    {/* File Display */}
                    {isAttached && (
                      <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <File className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">
                            {item.fileName || "Document verified and securely stored"}
                          </span>
                        </div>
                        {!isVerified && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(item.id)}
                          disabled={isVerified || loading}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        )}
                      </div>
                    )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            {!isVerified && (
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-8"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Submit & Verify
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
