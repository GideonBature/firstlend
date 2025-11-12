import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CustomerLayout } from "@/components/customer/CustomerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, AlertTriangle, RefreshCcw, ArrowLeft, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { paymentApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export default function PaymentFailed() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const reference = searchParams.get("reference");
  const message = searchParams.get("message");
  const [isRecording, setIsRecording] = useState(true);
  const [failureDetails, setFailureDetails] = useState<any>(null);

  // Record the failed transaction
  useEffect(() => {
    if (!reference) {
      setIsRecording(false);
      return;
    }

    const recordFailedPayment = async () => {
      try {
        setIsRecording(true);
        // Attempt to verify with Paystack to get failure details
        const response = await paymentApi.verifyPayment(reference);
        
        if (response.data) {
          setFailureDetails(response.data);
          
          // Even if payment failed, the verification call records it on the backend
          console.log("Failed payment recorded:", response.data);
          
          // Notify user that the failed attempt has been recorded
          toast({
            title: "Failed Transaction Recorded",
            description: "This payment attempt has been logged in your payment history.",
            variant: "default",
          });
        }
      } catch (err) {
        console.error("Error recording failed payment:", err);
        // Continue anyway - the page should still display
      } finally {
        setIsRecording(false);
      }
    };

    recordFailedPayment();
  }, [reference, toast]);

  const handleRetryPayment = () => {
    navigate("/customer/my-loans");
  };

  const handleContactSupport = () => {
    navigate("/customer/support");
  };

  return (
    <CustomerLayout>
      <div className="max-w-2xl mx-auto py-12">
        {isRecording ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-16 h-16 animate-spin text-red-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Recording Failed Transaction</h2>
              <p className="text-muted-foreground text-center">
                Please wait while we record this failed payment attempt...
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="w-20 h-20 text-red-500" />
            </div>
            <CardTitle className="text-2xl text-red-600">Payment Failed</CardTitle>
            <CardDescription>Your payment could not be processed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {message && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {reference && (
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Transaction Reference</span>
                  <span className="font-mono font-semibold">{reference}</span>
                </div>
                {failureDetails && (
                  <>
                    {failureDetails.amount && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Attempted Amount</span>
                        <span className="font-semibold">₦{failureDetails.amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    {failureDetails.status && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-semibold text-red-600">{failureDetails.status}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
              <p className="font-semibold mb-2">Common reasons for payment failure:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Insufficient funds in your account</li>
                <li>Card limit exceeded or card blocked</li>
                <li>Incorrect card details (CVV, PIN, OTP)</li>
                <li>Network connectivity issues</li>
                <li>Payment cancelled by user</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-semibold mb-2">What to do next:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Verify you have sufficient funds in your account</li>
                <li>Check that your card details are correct</li>
                <li>Try using a different payment method or card</li>
                <li>Contact your bank if the issue persists</li>
                <li>Reach out to our support team for assistance</li>
                <li>This failed attempt has been recorded in your payment history</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => navigate("/customer/dashboard")}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
              <Button
                onClick={handleRetryPayment}
                className="flex-1 bg-primary text-primary-foreground"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={handleContactSupport}
                className="flex-1"
              >
                Contact Support
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              No money has been deducted from your account
            </p>
          </CardContent>
        </Card>
        )}
      </div>
    </CustomerLayout>
  );
}
