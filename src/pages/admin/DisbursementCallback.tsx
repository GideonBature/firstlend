import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { adminApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "@/components/admin/AdminLayout";

const AdminDisbursementCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState<string>("Confirming payment with Paystack...");

  useEffect(() => {
    const loanId = searchParams.get("loanId");
    const reference =
      searchParams.get("reference") || searchParams.get("txref") || searchParams.get("trxref");

    if (!loanId || !reference) {
      setStatus("error");
      setErrorMessage("Missing disbursement reference. Please try again or contact support.");
      return;
    }

    const verifyDisbursement = async () => {
      try {
        const response = await adminApi.verifyDisbursement(loanId, reference);
        if (response.success) {
          setStatus("success");
          toast({
            title: "Disbursement Successful",
            description: response.message || "Loan has been disbursed successfully.",
          });
          navigate(
            `/admin/disbursement?disburse_status=success&disburse_message=${
              encodeURIComponent(response.message || "Loan disbursed successfully")
            }`,
            { replace: true }
          );
        } else {
          throw new Error(response.message || "Unable to verify disbursement");
        }
      } catch (error) {
        const description =
          error instanceof Error ? error.message : "An unexpected error occurred during verification.";
        setStatus("error");
        setErrorMessage(description);
        toast({
          title: "Disbursement Failed",
          description,
          variant: "destructive",
        });
        navigate(
          `/admin/disbursement?disburse_status=failed&disburse_message=${encodeURIComponent(description)}`,
          { replace: true }
        );
      }
    };

    verifyDisbursement();
  }, [navigate, searchParams, toast]);

  return (
    <AdminLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        {status === "verifying" && (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-lg font-medium text-foreground">Verifying disbursement...</p>
            <p className="text-sm text-muted-foreground">
              Hang tight while we confirm the payment with Paystack.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            <p className="text-lg font-medium text-foreground">Redirecting you back...</p>
          </>
        )}

        {status === "error" && (
          <>
            <AlertTriangle className="h-10 w-10 text-red-500" />
            <p className="text-lg font-medium text-foreground">Verification failed</p>
            <p className="text-sm text-muted-foreground max-w-md">{errorMessage}</p>
            <button
              className="text-primary underline"
              onClick={() => navigate("/admin/disbursement")}
            >
              Return to Disbursements
            </button>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDisbursementCallback;
