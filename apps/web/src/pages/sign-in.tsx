import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { isProductionDeployment } from "@/lib/runtime-env";
import { getOAuthRedirectUrl } from "@/lib/utils/auth";
import { useUser } from "@/utils/supabase/browser";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { CornerUpLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const supabase = createSupabaseBrowserClient();
  const user = useUser();
  const router = useRouter();
  const [isGoogleSignInEnabled, setIsGoogleSignInEnabled] = useState(false);
  const [isTurnstileEnabled, setIsTurnstileEnabled] = useState(false);

  useEffect(() => {
    setIsTurnstileEnabled(isProductionDeployment());
    setIsGoogleSignInEnabled(
      window.localStorage.getItem("google-signin") === "true"
    );

    if (user) {
      router.push("/blogs");
      return;
    }
    supabase.auth.getSession().then((res) => {
      if (res.data.session?.user) {
        router.push("/blogs");
      }
    });
  }, [router, supabase, user]);

  async function onGoogleAuth() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getOAuthRedirectUrl("/sign-in"),
      },
    });

    if (error) {
      toast.error(error.message || "Error signing in with Google");
      setLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (isTurnstileEnabled && !captchaToken) {
      toast.error("Please complete the captcha");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: isTurnstileEnabled
          ? {
              captchaToken: captchaToken ?? undefined,
            }
          : undefined,
      });

      if (error) {
        throw error;
      }

      await router.push("/blogs");
    } catch (error: any) {
      toast.error(error.message || "Error signing in");
      turnstileRef.current?.reset();
      setCaptchaToken(null);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto my-32 flex max-w-sm flex-col gap-4 px-4">
      {loading ? (
        <div className="flex h-[600px] items-center justify-center">
          <Loader2 className="animate-spin text-orange-500" size={24} />
        </div>
      ) : (
        <>
          <div className="">
            <Link title="Back to home" className="text-zinc-400" href="/">
              <CornerUpLeft size={18} />
            </Link>
          </div>
          <form className="mt-4 flex flex-col gap-3" onSubmit={onSubmit}>
            <h1 className="text-2xl font-medium">Sign in</h1>
            <p className="text-slate-500">
              Don&apos;t have an account?{" "}
              <Link className="text-slate-800 underline" href="/sign-up">
                Sign up
              </Link>
            </p>
            {isGoogleSignInEnabled ? (
              <div className="mt-4 flex flex-col gap-4">
                <GoogleAuthButton onClick={onGoogleAuth} />
                <p className="text-center text-[11px] font-medium uppercase tracking-[0.35em] text-slate-400">
                  Or use email
                </p>
              </div>
            ) : null}
            <div className="mt-4">
              <Label htmlFor="email">Email</Label>
              <Input required type="email" name="email" />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="flex items-center justify-between gap-2 py-2"
              >
                Password
                <Link className="text-zinc-500" href="/reset-password">
                  Forgot your password?
                </Link>
              </Label>
              <Input required type="password" name="password" />
            </div>
            {isTurnstileEnabled ? (
              <div className="mt-2 flex justify-center rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-4 shadow-sm">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                  onSuccess={setCaptchaToken}
                  onExpire={() => setCaptchaToken(null)}
                />
              </div>
            ) : null}
            <div className="mt-2 flex flex-col">
              <Button type="submit">Sign in</Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
