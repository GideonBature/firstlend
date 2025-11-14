import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, ShieldCheck, Timer, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const RESEND_DELAY = 30;

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const { verifyEmail, resendVerification } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let timer: number | undefined;
    if (resendCountdown > 0) {
      timer = window.setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [resendCountdown]);

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !token.trim()) {
      toast({
        title: "Missing fields",
        description: "Enter both your email and the 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await verifyEmail(email.trim(), token.trim());
      toast({
        title: "Email verified",
        description: "You can now sign in to your account.",
      });
      navigate("/login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Verification failed. Please try again.";
      toast({
        title: "Verification Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Enter the email you registered with so we can resend the code.",
        variant: "destructive",
      });
      return;
    }

    setResending(true);
    try {
      await resendVerification(email.trim());
      toast({
        title: "Code sent",
        description: "Check your email inbox or spam folder for the new code.",
      });
      setResendCountdown(RESEND_DELAY);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to resend code. Please try again.";
      toast({
        title: "Resend Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-3 text-primary">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">Secure Verification</span>
          </div>
          <CardTitle className="text-2xl">Verify your email</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code we emailed you. If the email does not arrive after a minute, request another code.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-blue-200 bg-blue-50">
            <AlertDescription className="space-y-2 text-sm text-blue-900">
              <p>Didn&apos;t receive the email? Check your spam folder or resend the verification code.</p>
            </AlertDescription>
          </Alert>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verify-email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email address
              </Label>
              <Input
                id="verify-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                disabled={submitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="verify-token">6-digit code</Label>
              <Input
                id="verify-token"
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={6}
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter code"
                disabled={submitting}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleResend}
                disabled={resending || resendCountdown > 0 || submitting}
                className="w-full sm:w-auto"
              >
                {resendCountdown > 0 ? (
                  <>
                    <Timer className="mr-2 h-4 w-4" />
                    Resend in {resendCountdown}s
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend Code
                  </>
                )}
              </Button>
              <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
                {submitting ? "Verifying..." : "Verify Email"}
              </Button>
            </div>
          </form>

          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p>Already verified?</p>
            <Button variant="link" className="px-0" onClick={() => navigate("/login")}>
              Go to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
