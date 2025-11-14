import { useState, useEffect, useCallback } from "react";
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
  Shield,
} from "lucide-react";
import { authApi, KYCDocumentType } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface DocumentDefinition {
  id: string;
  title: string;
  description: string;
  cardKey: string;
  apiDocumentType: string;
  helper: string;
}

const REQUIRED_DOCUMENTS: DocumentDefinition[] = [
  {
    id: "government-id",
    title: "Government-issued ID",
    description: "National ID, Passport, or Driver's License",
    cardKey: "government_issued_id",
    apiDocumentType: "government_issued_id",
    helper: "Document verified and securely stored",
  },
  {
    id: "address-proof",
    title: "Proof of Address",
    description: "Utility bill or bank statement (last 3 months)",
    cardKey: "proof_of_address",
    apiDocumentType: "proof_of_address",
    helper: "Document verified and securely stored",
  },
  {
    id: "bank-statement",
    title: "Bank Statement",
    description: "Most recent 3-month bank statement (PDF preferred)",
    cardKey: "bank_statement",
    apiDocumentType: "bank_statement",
    helper: "Statement received and stored securely",
  },
  {
    id: "guarantor-doc",
    title: "Guarantor Document",
    description: "Single PDF containing atleast 3-month bank statement, passport photo, government-issued ID, CAC/work ID, signed guarantor form, and utility bill",
    cardKey: "guarantor_document",
    apiDocumentType: "guarantor_document",
    helper: "All guarantor evidence received and stored securely",
  },
];

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
  const [documentsMap, setDocumentsMap] = useState<Record<string, KYCDocumentType>>({});
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [uploadingDocKey, setUploadingDocKey] = useState<string | null>(null);

  const getCardKeyFromApiType = (apiType: string) =>
    REQUIRED_DOCUMENTS.find((doc) => doc.apiDocumentType === apiType)?.cardKey || apiType;

  const loadKYCStatus = useCallback(async () => {
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
  }, []);

  const loadDocuments = useCallback(async () => {
    try {
      setDocumentsLoading(true);
      setDocumentsError(null);
      const response = await authApi.getKYCDocuments();
      if (response.success && response.data) {
        const mapped = response.data.reduce<Record<string, KYCDocumentType>>((acc, doc) => {
          const cardKey = getCardKeyFromApiType(doc.documentType);
          acc[cardKey] = { ...doc, documentType: cardKey };
          return acc;
        }, {});
        setDocumentsMap(mapped);
      } else {
        setDocumentsError(response.message || "Unable to load uploaded documents.");
      }
    } catch (error) {
      console.error("Error loading KYC documents:", error);
      setDocumentsError("Failed to load documents. Please try again.");
    } finally {
      setDocumentsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadKYCStatus();
    loadDocuments();
  }, [loadKYCStatus, loadDocuments]);

  const uploadDocument = async (definition: DocumentDefinition, file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File Too Large",
        description: "Each document must be under 5MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadingDocKey(definition.cardKey);
      const response = await authApi.uploadKYCDocument(definition.apiDocumentType, file, bvn || undefined, nin || undefined);

      if (response.success && response.data) {
        setDocumentsMap((prev) => ({
          ...prev,
          [definition.cardKey]: {
            ...response.data,
            documentType: definition.cardKey,
            fileName: file.name,
          },
        }));
        toast({
          title: "Document Uploaded",
          description: "Document uploaded successfully and stored securely.",
        });
      } else {
        toast({
          title: "Upload Failed",
          description: response.message || "Unable to upload document. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error uploading KYC document:", error);
      toast({
        title: "Upload Failed",
        description: "Something went wrong while uploading your document.",
        variant: "destructive",
      });
    } finally {
      setUploadingDocKey(null);
    }
  };

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

    if (nin.trim().length < 1 || nin.trim().length > 20) {
      toast({
        title: "Error",
        description: "NIN must be between 1 and 20 characters",
        variant: "destructive",
      });
      return false;
    }

    const hasAllDocuments = REQUIRED_DOCUMENTS.every((doc) => documentsMap[doc.cardKey]);
    if (!hasAllDocuments) {
      toast({
        title: "Error",
        description: "Please attach all required documents",
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
      await simulateVerificationStep("verifying-bvn", "bvn-success", 2000);
      await simulateVerificationStep("verifying-nin", "nin-success", 2000);

      const verifyResponse = await authApi.verifyKYC({
        bvn: bvn.trim(),
        nin: nin.trim(),
      });

      if (!verifyResponse.success) {
        throw new Error(verifyResponse.message || "Verification failed");
      }

      setVerificationStep("completed");
      setIsVerified(true);

      await new Promise((resolve) => setTimeout(resolve, 2000));
      setShowVerificationModal(false);

      toast({
        title: "Success",
        description: "KYC verification completed! You are now ready to apply for loans.",
      });

      if (onVerificationComplete) {
        onVerificationComplete();
      }

      await loadDocuments();
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

  const infoCompleted = bvn.trim().length === 11 && nin.trim().length >= 8;
  const uploadedDocumentsCount = REQUIRED_DOCUMENTS.filter((doc) => documentsMap[doc.cardKey]).length;
  const documentProgress = (uploadedDocumentsCount / REQUIRED_DOCUMENTS.length) * 50;
  const totalProgress = isVerified ? 100 : Math.round((infoCompleted ? 50 : 0) + documentProgress);

  const formatUploadedDate = (iso?: string) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDocumentDisplayName = (docType?: string) => {
    if (!docType) return "Uploaded Document";
    const definition = REQUIRED_DOCUMENTS.find((doc) => doc.cardKey === docType);
    return definition?.title || "Uploaded Document";
  };

  return (
    <div className="space-y-6">
      <Dialog open={showVerificationModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Verifying Your Identity</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {verificationStep === "verifying-bvn" && (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  )}
                  {verificationStep !== "verifying-bvn" && verificationStep !== "idle" && (
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
                <p className="text-sm text-muted-foreground ml-8">Verifying your BVN...</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {verificationStep === "verifying-nin" && (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  )}
                  {(verificationStep === "nin-success" || verificationStep === "completed") && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                  {(verificationStep === "idle" ||
                    verificationStep === "verifying-bvn" ||
                    verificationStep === "bvn-success") && (
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="font-semibold">NIN Verification</span>
                </div>
                {(verificationStep === "nin-success" || verificationStep === "completed") && (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    Verified
                  </Badge>
                )}
              </div>
              {verificationStep === "verifying-nin" && (
                <p className="text-sm text-muted-foreground ml-8">Verifying your NIN...</p>
              )}
            </div>

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
          <Alert
            className={`rounded-2xl border ${
              isVerified ? "border-green-200 bg-green-50 text-green-800" : "border-blue-200 bg-blue-50 text-blue-800"
            }`}
          >
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

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Verification Progress</span>
              <span className="text-sm text-muted-foreground">{totalProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${totalProgress}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <FileBadge className="w-5 h-5 text-primary" />
                {isVerified ? "Required Documents Uploaded" : "Upload Required Documents"}
              </h3>

              {documentsLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {documentsError && (
                    <Alert variant="destructive" className="rounded-xl">
                      <AlertTitle>Unable to load documents</AlertTitle>
                      <AlertDescription>{documentsError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-4">
                    {REQUIRED_DOCUMENTS.map((item) => {
                      const uploadedDocument = documentsMap[item.cardKey];
                      const isAttached = Boolean(uploadedDocument);
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
                                <p className="text-base font-semibold text-foreground">{item.title}</p>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {isAttached || isVerified ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-gray-400" />
                              )}
                              <Badge
                                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                                  isAttached || isVerified
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : "bg-gray-100 text-gray-600 border-gray-200"
                                }`}
                              >
                                {isAttached || isVerified ? "Attached" : "Not Attached"}
                              </Badge>
                            </div>
                          </div>

                          {!(isAttached || isVerified) && (
                            <label className="flex flex-col gap-2 cursor-pointer">
                              <div className="border-2 border-dashed border-border/60 rounded-lg p-6 hover:border-primary/50 transition-colors">
                                <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                                  <Upload className="w-4 h-4" />
                                  <span>Click to upload or drag and drop</span>
                                  <span className="text-xs text-muted-foreground">
                                    {item.cardKey === "guarantor_document"
                                      ? "Upload a single PDF containing all guarantor evidence"
                                      : item.cardKey === "bank_statement"
                                      ? "Upload your latest statement (PDF preferred, max 5MB)"
                                      : "PNG, JPG, or PDF (max 5MB)"}
                                  </span>
                                </div>
                              </div>
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                disabled={isVerified || loading || uploadingDocKey === item.cardKey}
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    uploadDocument(item, e.target.files[0]);
                                  }
                                }}
                              />
                            </label>
                          )}

                          {(isAttached || isVerified) && (
                            <div className="space-y-3">
                              <div className="flex flex-col gap-3 rounded-lg bg-muted/40 p-3 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-center gap-3">
                                  <File className="w-4 h-4 text-primary" />
                                  <div>
                                    <p className="text-sm font-semibold">
                                      {uploadedDocument?.fileName ||
                                        getDocumentDisplayName(uploadedDocument?.documentType || item.cardKey)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Uploaded {formatUploadedDate(uploadedDocument?.uploadedAt)}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-medium text-primary">
                                  {uploadedDocument?.documentUrl && (
                                    <a
                                      href={uploadedDocument.documentUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="hover:underline"
                                    >
                                      View Document
                                    </a>
                                  )}
                                  {!isVerified && (
                                    <label className="cursor-pointer hover:underline">
                                      {uploadingDocKey === item.cardKey ? "Uploading..." : "Replace"}
                                      <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        disabled={uploadingDocKey === item.cardKey}
                                        onChange={(e) => {
                                          if (e.target.files?.[0]) {
                                            uploadDocument(item, e.target.files[0]);
                                          }
                                        }}
                                      />
                                    </label>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                {item.helper}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

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
