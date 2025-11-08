import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "lucide-react";

// Format date for input field
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

interface MakePaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loanAccount?: string;
  outstandingBalance?: string;
  onSuccess?: () => void;
}

export function MakePaymentModal({
  open,
  onOpenChange,
  loanAccount = "LN-FB0012345678",
  outstandingBalance = "₦1,500,000.00",
  onSuccess,
}: MakePaymentModalProps) {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(formatDate(new Date()));
  const [simulatePayment, setSimulatePayment] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmPayment = () => {
    if (!paymentAmount || parseFloat(paymentAmount.replace(/[₦,]/g, "")) <= 0) {
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
      // Reset form
      setPaymentAmount("");
      setPaymentDate(formatDate(new Date()));
    }, 1500);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setPaymentAmount(value);
  };

  const formatAmount = (value: string) => {
    if (!value) return "";
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;
    return `₦ ${numValue.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Make a Repayment</DialogTitle>
          <DialogDescription>
            This is for local simulation and does not process a real payment.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Loan Account</Label>
            <Input value={loanAccount} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label>Outstanding Balance</Label>
            <Input value={outstandingBalance} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentAmount">
              Payment Amount <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="paymentAmount"
                type="text"
                placeholder="₦ 0.00"
                value={formatAmount(paymentAmount)}
                onChange={handleAmountChange}
                className="pl-2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentDate">
              Payment Date <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="paymentDate"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center justify-between space-x-2 py-2">
            <Label htmlFor="simulate-payment" className="text-sm font-normal cursor-pointer">
              Simulate Payment
            </Label>
            <Switch
              id="simulate-payment"
              checked={simulatePayment}
              onCheckedChange={setSimulatePayment}
            />
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
            {isProcessing ? "Processing..." : "Confirm Payment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

