import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, CreditCard } from "lucide-react";
import { paymentApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MakePaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loanId: string;
  loanAccount?: string;
  outstandingBalance: number;
  monthlyPayment?: number;
  onSuccess?: () => void;
}

export function MakePaymentModal({
  open,
  onOpenChange,
  loanId,
  loanAccount = "",
  outstandingBalance = 0,
  monthlyPayment = 0,
  onSuccess,
}: MakePaymentModalProps) {
  const { toast } = useToast();
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill with monthly payment when modal opens
  useEffect(() => {
    if (open && monthlyPayment > 0) {
      setPaymentAmount(monthlyPayment.toString());
    } else if (!open) {
      // Reset when modal closes
      setPaymentAmount("");
      setError(null);
    }
  }, [open, monthlyPayment]);

  const handleConfirmPayment = async () => {
    const amount = parseFloat(paymentAmount.replace(/[₦,]/g, ""));
    
    // Validation
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (amount < 1000) {
      setError("Minimum payment amount is ₦1,000");
      return;
    }

    if (amount > outstandingBalance) {
      setError(`Payment amount cannot exceed outstanding balance of ₦${outstandingBalance.toLocaleString()}`);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Get the current origin for callback URLs
      const baseUrl = window.location.origin;
      const callbackUrl = `${baseUrl}/customer/payment-success`;
      const cancelUrl = `${baseUrl}/customer/payment-failed`;
      
      // Initialize payment with Paystack
      const response = await paymentApi.initializePayment({
        loanId,
        amount,
        callbackUrl,
        cancelUrl,
      });

      if (response.success && response.data) {
        // Redirect to Paystack checkout page
        window.location.href = response.data.authorizationUrl;
      } else {
        setError(response.message || "Failed to initialize payment");
        toast({
          title: "Payment Failed",
          description: response.message || "Failed to initialize payment",
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to initialize payment";
      setError(errorMsg);
      console.error("Payment initialization error:", err);
      toast({
        title: "Payment Failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and one decimal point
    const value = e.target.value.replace(/[^0-9.]/g, "");
    
    // Prevent multiple decimal points
    const parts = value.split(".");
    if (parts.length > 2) {
      return;
    }
    
    setPaymentAmount(value);
    setError(null);
  };

  const handleQuickAmount = (percentage: number) => {
    const amount = (outstandingBalance * percentage) / 100;
    setPaymentAmount(amount.toString());
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Make a Payment
          </DialogTitle>
          <DialogDescription>
            Pay your loan using Paystack secure payment gateway
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loanAccount && (
            <div className="space-y-2">
              <Label>Loan Account</Label>
              <Input value={loanAccount} disabled className="bg-muted" />
            </div>
          )}

          <div className="space-y-2">
            <Label>Outstanding Balance</Label>
            <Input 
              value={`₦${outstandingBalance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
              disabled 
              className="bg-muted font-semibold" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentAmount">
              Payment Amount <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">₦</span>
              <Input
                id="paymentAmount"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={paymentAmount}
                onChange={handleAmountChange}
                className="pl-8 text-lg font-semibold"
                disabled={isProcessing}
              />
            </div>
            <p className="text-xs text-muted-foreground">Minimum: ₦1,000</p>
          </div>

          {/* Quick amount buttons */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Quick Select</Label>
            <div className="grid grid-cols-4 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount(25)}
                disabled={isProcessing}
                className="text-xs"
              >
                25%
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount(50)}
                disabled={isProcessing}
                className="text-xs"
              >
                50%
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount(75)}
                disabled={isProcessing}
                className="text-xs"
              >
                75%
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount(100)}
                disabled={isProcessing}
                className="text-xs"
              >
                100%
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
            <p className="font-semibold mb-1">Payment Information:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>You will be redirected to Paystack for secure payment</li>
              <li>Test card: 4084084084084081 (CVV: 408, PIN: 0000, OTP: 123456)</li>
              <li>Your loan balance will be updated after successful payment</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmPayment}
            disabled={isProcessing || !paymentAmount || parseFloat(paymentAmount.replace(/[₦,]/g, "")) <= 0}
            className="bg-primary text-primary-foreground"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Pay with Paystack
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

