import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import adzLogo from "@/assets/adz-logo.png";
import { ShieldCheck, Copy, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/setup-2fa")({ component: SetupTwoFaPage });

function SetupTwoFaPage() {
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [factorId, setFactorId] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        navigate({ to: "/login" });
        return;
      }

      const { data: factors } = await supabase.auth.mfa.listFactors();
      const verified = (factors?.totp ?? []).filter((f) => f.status === "verified");
      if (verified.length > 0) {
        navigate({ to: "/" });
        return;
      }

      const { data: enrollData, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "ADZ Garage Authenticator",
      });
      if (error || !enrollData) {
        toast.error("Hindi ma-setup ang 2FA. Subukan ulit.");
        return;
      }

      setQrCode(enrollData.totp.qr_code);
      setSecret(enrollData.totp.secret);
      setFactorId(enrollData.id);
      setEnrolling(false);
    })();
  }, [navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("Ilagay ang 6-digit na code mula sa iyong authenticator app.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
      if (error) throw error;
      toast.success("2FA na-activate! Protektado na ang iyong account.");
      navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Mali ang code. Subukan ulit.");
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 text-lg font-semibold mb-8">
          <div className="size-10 rounded-lg bg-black flex items-center justify-center overflow-hidden">
            <img src={adzLogo} alt="ADZ Garage" className="w-full h-full object-contain" />
          </div>
          <span>ADZ Garage</span>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ShieldCheck className="size-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">I-setup ang 2-Step Verification</h1>
            <p className="text-muted-foreground text-sm mt-1">
              I-scan ang QR code gamit ang <strong>Microsoft Authenticator</strong>, <strong>Google Authenticator</strong>, o <strong>Authy</strong>.
            </p>
          </div>

          {enrolling ? (
            <div className="flex justify-center py-8">
              <div className="text-sm text-muted-foreground">Naghahanda…</div>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="flex flex-col items-center gap-3">
                <div className="border border-border rounded-lg p-3 bg-white">
                  <img src={qrCode} alt="QR Code para sa 2FA" className="size-48" />
                </div>
                <p className="text-xs text-muted-foreground">Hindi makaka-scan? Gamitin ang manual na code:</p>
                <div className="flex items-center gap-2 bg-muted rounded-md px-3 py-2 w-full">
                  <code className="text-xs flex-1 break-all select-all font-mono">{secret}</code>
                  <button
                    type="button"
                    onClick={copySecret}
                    className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copied
                      ? <CheckCircle2 className="size-4 text-green-500" />
                      : <Copy className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium">
                  I-enter ang verification code
                </Label>
                <Input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="h-12 text-center text-2xl tracking-[0.5em] font-mono"
                  autoComplete="one-time-code"
                  autoFocus
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium"
                disabled={loading || code.length !== 6}
              >
                {loading ? "Vini-verify…" : "I-activate ang 2FA"}
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Required ito para sa lahat ng accounts. Makipag-ugnayan sa admin kung may problema.
        </p>
      </div>
    </div>
  );
}
