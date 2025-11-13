import type { LoanResponse } from "@/services/api";

export const calculateLoanProgress = (loan: LoanResponse): number => {
  if (typeof loan.paymentProgress === "number" && loan.paymentProgress >= 0) {
    return Math.max(0, Math.min(100, Math.round(loan.paymentProgress)));
  }

  if (loan.principal && typeof loan.outstandingBalance === "number") {
    const paid = loan.principal - loan.outstandingBalance;
    if (paid > 0) {
      return Math.max(0, Math.min(100, Math.round((paid / loan.principal) * 100)));
    }
  }

  return 0;
};

export const calculateCurrentAmountDue = (loan: LoanResponse): number => {
  if (!["active", "overdue"].includes(loan.status.toLowerCase())) {
    return 0;
  }

  const totalAmount = loan.amountDue || 0;
  const term = loan.term || 1;
  const monthlyInstallment = totalAmount / term;

  const loanStartDate = loan.createdAt ? new Date(loan.createdAt) : null;
  if (!loanStartDate) return monthlyInstallment;

  const today = new Date();
  const monthsPassed = Math.floor((today.getTime() - loanStartDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
  const installmentsDue = Math.min(monthsPassed + 1, term);

  const totalShouldBePaid = monthlyInstallment * installmentsDue;
  const outstanding = typeof loan.outstandingBalance === "number" ? loan.outstandingBalance : totalAmount;
  const amountPaid = totalAmount - outstanding;

  return Math.max(0, totalShouldBePaid - amountPaid);
};
