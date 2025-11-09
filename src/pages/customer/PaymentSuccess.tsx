import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CustomerLayout } from "@/components/customer/CustomerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, XCircle, ArrowRight } from "lucide-react";
import { paymentApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const reference = searchParams.get("reference");

    if (!reference) {
      setError("No payment reference found");
      setIsVerifying(false);
      return;
    }

    // Verify payment with backend
    const verifyPayment = async () => {
      try {
        setIsVerifying(true);
        const response = await paymentApi.verifyPayment(reference);

        if (response.success && response.data) {
          setPaymentVerified(true);
          setPaymentDetails(response.data);
          
          toast({
            title: "Payment Successful!",
            description: `Your payment of ₦${response.data.amount?.toLocaleString()} has been confirmed.`,
            variant: "default",
          });
        } else {
          setError(response.message || "Payment verification failed");
          toast({
            title: "Verification Failed",
            description: response.message || "Could not verify your payment",
            variant: "destructive",
          });
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to verify payment";
        setError(errorMsg);
        console.error("Payment verification error:", err);
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, toast]);

  // Auto-redirect countdown
  useEffect(() => {
    if (!isVerifying && paymentVerified) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/customer/my-loans");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isVerifying, paymentVerified, navigate]);

  const handleViewLoans = () => {
    navigate("/customer/my-loans");
  };

  const handleViewHistory = () => {
    navigate("/customer/payment-history");
  };

  return (
    <CustomerLayout>
      <div className="max-w-2xl mx-auto py-12">
        {isVerifying ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
              <p className="text-muted-foreground text-center">
                Please wait while we confirm your payment with Paystack...
              </p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <XCircle className="w-20 h-20 text-red-500" />
              </div>
              <CardTitle className="text-2xl">Verification Failed</CardTitle>
              <CardDescription>We couldn't verify your payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                <p className="font-semibold mb-2">What to do next:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Check your email for payment confirmation from Paystack</li>
                  <li>Contact support if money was deducted from your account</li>
                  <li>Your payment reference: {searchParams.get("reference")}</li>
                </ul>
              </div>

              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={handleViewLoans}>
                  View My Loans
                </Button>
                <Button onClick={() => navigate("/customer/support")}>
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : paymentVerified && paymentDetails ? (
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-20 h-20 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
              <CardDescription>Your loan payment has been processed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="text-2xl font-bold text-green-700">
                    ₦{paymentDetails.amount?.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="h-px bg-green-200" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Transaction Reference</span>
                  <span className="font-mono font-semibold">{paymentDetails.reference}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Payment Status</span>
                  <span className="font-semibold text-green-600">{paymentDetails.status || "Successful"}</span>
                </div>
                {paymentDetails.paidAt && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="font-semibold">
                      {new Date(paymentDetails.paidAt).toLocaleString("en-NG")}
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-semibold mb-1">What happens next?</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Your loan balance has been updated</li>
                  <li>A receipt has been sent to your email</li>
                  <li>You can view this transaction in your payment history</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={handleViewLoans} className="flex-1">
                  View My Loans
                </Button>
                <Button variant="outline" onClick={handleViewHistory} className="flex-1">
                  Payment History
                </Button>
                <Button onClick={() => navigate("/customer/dashboard")} className="flex-1">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Redirecting to your loans in {countdown} seconds...
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </CustomerLayout>
  );
}
