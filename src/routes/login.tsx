"use client";

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import adzLogo from "@/assets/adz-logo.png";

export const Route = createFileRoute("/login")({ component: LoginPage });

interface EyeBallProps {
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
  forceLookX?: number;
  forceLookY?: number;
}

const EyeBall = ({
  size = 48,
  pupilSize = 16,
  maxDistance = 10,
  eyeColor = "white",
  pupilColor = "black",
  isBlinking = false,
  forceLookX,
  forceLookY,
}: EyeBallProps) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const getPupilPos = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined)
      return { x: forceLookX, y: forceLookY };
    const eye = eyeRef.current.getBoundingClientRect();
    const cx = eye.left + eye.width / 2;
    const cy = eye.top + eye.height / 2;
    const dx = mouseX - cx;
    const dy = mouseY - cy;
    const dist = Math.min(Math.sqrt(dx ** 2 + dy ** 2), maxDistance);
    const angle = Math.atan2(dy, dx);
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
  };

  const pos = getPupilPos();

  return (
    <div
      ref={eyeRef}
      className="rounded-full flex items-center justify-center transition-all duration-150"
      style={{
        width: `${size}px`,
        height: isBlinking ? "2px" : `${size}px`,
        backgroundColor: eyeColor,
        overflow: "hidden",
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            transition: "transform 0.1s ease-out",
          }}
        />
      )}
    </div>
  );
};

interface PupilProps {
  size?: number;
  maxDistance?: number;
  pupilColor?: string;
  forceLookX?: number;
  forceLookY?: number;
}

const Pupil = ({
  size = 12,
  maxDistance = 5,
  pupilColor = "black",
  forceLookX,
  forceLookY,
}: PupilProps) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const pupilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const getPos = () => {
    if (!pupilRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined)
      return { x: forceLookX, y: forceLookY };
    const p = pupilRef.current.getBoundingClientRect();
    const cx = p.left + p.width / 2;
    const cy = p.top + p.height / 2;
    const dx = mouseX - cx;
    const dy = mouseY - cy;
    const dist = Math.min(Math.sqrt(dx ** 2 + dy ** 2), maxDistance);
    const angle = Math.atan2(dy, dx);
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
  };

  const pos = getPos();

  return (
    <div
      ref={pupilRef}
      className="rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: pupilColor,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: "transform 0.1s ease-out",
      }}
    />
  );
};

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [totpCode, setTotpCode] = useState("");
  const [mfaFactorId, setMfaFactorId] = useState("");

  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return;
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      // Only redirect if MFA is fully satisfied (or no MFA enrolled yet)
      if (aal && aal.currentLevel === aal.nextLevel) navigate({ to: "/" });
      // If AAL1 but needs AAL2 → stay here, user must complete TOTP step
    });
  }, [navigate]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Random blink — purple
  useEffect(() => {
    const schedule = () => {
      const t = setTimeout(() => {
        setIsPurpleBlinking(true);
        setTimeout(() => { setIsPurpleBlinking(false); schedule(); }, 150);
      }, Math.random() * 4000 + 3000);
      return t;
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  // Random blink — black
  useEffect(() => {
    const schedule = () => {
      const t = setTimeout(() => {
        setIsBlackBlinking(true);
        setTimeout(() => { setIsBlackBlinking(false); schedule(); }, 150);
      }, Math.random() * 4000 + 3000);
      return t;
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  // Look at each other when typing starts
  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const t = setTimeout(() => setIsLookingAtEachOther(false), 800);
      return () => clearTimeout(t);
    } else {
      setIsLookingAtEachOther(false);
    }
  }, [isTyping]);

  // Purple peek when password is visible
  useEffect(() => {
    if (password.length > 0 && showPassword) {
      const t = setTimeout(() => {
        setIsPurplePeeking(true);
        setTimeout(() => setIsPurplePeeking(false), 800);
      }, Math.random() * 3000 + 2000);
      return () => clearTimeout(t);
    } else {
      setIsPurplePeeking(false);
    }
  }, [password, showPassword, isPurplePeeking]);

  const calcPos = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 3;
    const dx = mouseX - cx;
    const dy = mouseY - cy;
    return {
      faceX: Math.max(-15, Math.min(15, dx / 20)),
      faceY: Math.max(-10, Math.min(10, dy / 30)),
      bodySkew: Math.max(-6, Math.min(6, -dx / 120)),
    };
  };

  const purplePos = calcPos(purpleRef);
  const blackPos = calcPos(blackRef);
  const yellowPos = calcPos(yellowRef);
  const orangePos = calcPos(orangeRef);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const { data: factors } = await supabase.auth.mfa.listFactors();
      const verifiedTotp = (factors?.totp ?? []).filter((f) => f.status === "verified");

      if (verifiedTotp.length > 0) {
        setMfaFactorId(verifiedTotp[0].id);
        setStep(2);
      } else {
        navigate({ to: "/setup-2fa" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleTotpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: mfaFactorId,
        code: totpCode,
      });
      if (error) throw error;
      toast.success("Welcome back!");
      navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Mali ang code. Subukan ulit.");
      setTotpCode("");
    } finally {
      setLoading(false);
    }
  };

  const passwordVisible = password.length > 0 && showPassword;

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — animated characters */}
      <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary/90 via-primary to-primary/80 p-12 text-primary-foreground">
        {/* Logo */}
        <div className="relative z-20">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <div className="size-10 rounded-lg bg-black flex items-center justify-center overflow-hidden">
              <img src={adzLogo} alt="ADZ Garage" className="w-full h-full object-contain" />
            </div>
            <span>ADZ Garage</span>
          </div>
        </div>

        {/* Characters */}
        <div className="relative z-20 flex items-end justify-center h-[500px]">
          <div className="relative" style={{ width: "550px", height: "400px" }}>
            {/* Purple — back layer */}
            <div
              ref={purpleRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: "70px",
                width: "180px",
                height: passwordVisible ? "440px" : isTyping || (password.length > 0 && !showPassword) ? "440px" : "400px",
                backgroundColor: "#6C3FF5",
                borderRadius: "10px 10px 0 0",
                zIndex: 1,
                transform: passwordVisible
                  ? "skewX(0deg)"
                  : isTyping || (password.length > 0 && !showPassword)
                  ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(40px)`
                  : `skewX(${purplePos.bodySkew || 0}deg)`,
                transformOrigin: "bottom center",
              }}
            >
              <div
                className="absolute flex gap-8 transition-all duration-700 ease-in-out"
                style={{
                  left: passwordVisible ? "20px" : isLookingAtEachOther ? "55px" : `${45 + purplePos.faceX}px`,
                  top: passwordVisible ? "35px" : isLookingAtEachOther ? "65px" : `${40 + purplePos.faceY}px`,
                }}
              >
                <EyeBall size={18} pupilSize={7} maxDistance={5} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isPurpleBlinking}
                  forceLookX={passwordVisible ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                  forceLookY={passwordVisible ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined} />
                <EyeBall size={18} pupilSize={7} maxDistance={5} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isPurpleBlinking}
                  forceLookX={passwordVisible ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                  forceLookY={passwordVisible ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined} />
              </div>
            </div>

            {/* Black — middle layer */}
            <div
              ref={blackRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: "240px",
                width: "120px",
                height: "310px",
                backgroundColor: "#2D2D2D",
                borderRadius: "8px 8px 0 0",
                zIndex: 2,
                transform: passwordVisible
                  ? "skewX(0deg)"
                  : isLookingAtEachOther
                  ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
                  : isTyping || (password.length > 0 && !showPassword)
                  ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)`
                  : `skewX(${blackPos.bodySkew || 0}deg)`,
                transformOrigin: "bottom center",
              }}
            >
              <div
                className="absolute flex gap-6 transition-all duration-700 ease-in-out"
                style={{
                  left: passwordVisible ? "10px" : isLookingAtEachOther ? "32px" : `${26 + blackPos.faceX}px`,
                  top: passwordVisible ? "28px" : isLookingAtEachOther ? "12px" : `${32 + blackPos.faceY}px`,
                }}
              >
                <EyeBall size={16} pupilSize={6} maxDistance={4} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isBlackBlinking}
                  forceLookX={passwordVisible ? -4 : isLookingAtEachOther ? 0 : undefined}
                  forceLookY={passwordVisible ? -4 : isLookingAtEachOther ? -4 : undefined} />
                <EyeBall size={16} pupilSize={6} maxDistance={4} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isBlackBlinking}
                  forceLookX={passwordVisible ? -4 : isLookingAtEachOther ? 0 : undefined}
                  forceLookY={passwordVisible ? -4 : isLookingAtEachOther ? -4 : undefined} />
              </div>
            </div>

            {/* Orange — front left */}
            <div
              ref={orangeRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: "0px",
                width: "240px",
                height: "200px",
                zIndex: 3,
                backgroundColor: "#FF9B6B",
                borderRadius: "120px 120px 0 0",
                transform: passwordVisible ? "skewX(0deg)" : `skewX(${orangePos.bodySkew || 0}deg)`,
                transformOrigin: "bottom center",
              }}
            >
              <div
                className="absolute flex gap-8 transition-all duration-200 ease-out"
                style={{
                  left: passwordVisible ? "50px" : `${82 + (orangePos.faceX || 0)}px`,
                  top: passwordVisible ? "85px" : `${90 + (orangePos.faceY || 0)}px`,
                }}
              >
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D"
                  forceLookX={passwordVisible ? -5 : undefined}
                  forceLookY={passwordVisible ? -4 : undefined} />
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D"
                  forceLookX={passwordVisible ? -5 : undefined}
                  forceLookY={passwordVisible ? -4 : undefined} />
              </div>
            </div>

            {/* Yellow — front right */}
            <div
              ref={yellowRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: "310px",
                width: "140px",
                height: "230px",
                backgroundColor: "#E8D754",
                borderRadius: "70px 70px 0 0",
                zIndex: 4,
                transform: passwordVisible ? "skewX(0deg)" : `skewX(${yellowPos.bodySkew || 0}deg)`,
                transformOrigin: "bottom center",
              }}
            >
              <div
                className="absolute flex gap-6 transition-all duration-200 ease-out"
                style={{
                  left: passwordVisible ? "20px" : `${52 + (yellowPos.faceX || 0)}px`,
                  top: passwordVisible ? "35px" : `${40 + (yellowPos.faceY || 0)}px`,
                }}
              >
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D"
                  forceLookX={passwordVisible ? -5 : undefined}
                  forceLookY={passwordVisible ? -4 : undefined} />
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D"
                  forceLookX={passwordVisible ? -5 : undefined}
                  forceLookY={passwordVisible ? -4 : undefined} />
              </div>
              <div
                className="absolute w-20 h-[4px] bg-[#2D2D2D] rounded-full transition-all duration-200 ease-out"
                style={{
                  left: passwordVisible ? "10px" : `${40 + (yellowPos.faceX || 0)}px`,
                  top: passwordVisible ? "88px" : `${88 + (yellowPos.faceY || 0)}px`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="relative z-20 flex items-center gap-8 text-sm text-primary-foreground/60">
          <Link to="/" className="hover:text-primary-foreground transition-colors">← Back to home</Link>
        </div>

        {/* Decorative blobs */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute top-1/4 right-1/4 size-64 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>

      {/* Right — login form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 text-lg font-semibold mb-12">
            <div className="size-10 rounded-lg bg-black flex items-center justify-center overflow-hidden">
              <img src={adzLogo} alt="ADZ Garage" className="w-full h-full object-contain" />
            </div>
            <span>ADZ Garage</span>
          </div>

          {step === 1 ? (
            <>
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back!</h1>
                <p className="text-muted-foreground text-sm">Please enter your details</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@adzgarage.ph"
                    value={email}
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsTyping(true)}
                    onBlur={() => setIsTyping(false)}
                    required
                    className="h-12 bg-background border-border/60 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 pr-10 bg-background border-border/60 focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                      Remember for 30 days
                    </Label>
                  </div>
                  <a href="#" className="text-sm text-primary hover:underline font-medium">
                    Forgot password?
                  </a>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-medium" size="lg" disabled={loading}>
                  {loading ? "Signing in..." : "Log in"}
                </Button>
              </form>
            </>
          ) : (
            <form onSubmit={handleTotpSubmit} className="space-y-5">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold tracking-tight mb-2">2-Step Verification</h1>
                <p className="text-muted-foreground text-sm">
                  Buksan ang iyong authenticator app at i-enter ang 6-digit na code.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totp" className="text-sm font-medium">Authenticator code</Label>
                <Input
                  id="totp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="000000"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                  className="h-12 text-center text-2xl tracking-[0.5em] font-mono bg-background border-border/60 focus:border-primary"
                  autoComplete="one-time-code"
                  autoFocus
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium"
                size="lg"
                disabled={loading || totpCode.length !== 6}
              >
                {loading ? "Vini-verify…" : "Verify"}
              </Button>

              <button
                type="button"
                onClick={() => { setStep(1); setTotpCode(""); }}
                className="w-full text-sm text-muted-foreground hover:text-foreground text-center transition-colors"
              >
                ← Bumalik sa login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
