import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isProductionDeployment } from "@/lib/runtime-env";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { getOAuthRedirectUrl } from "@/lib/utils/auth";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { CornerUpLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [isTurnstileEnabled, setIsTurnstileEnabled] = useState(false);

  useEffect(() => {
    setIsTurnstileEnabled(isProductionDeployment());

    supabase.auth.getSession().then((res) => {
      if (res.data.session?.user) {
        router.push("/blogs");
      }
    });
  }, [router, supabase]);

  async function onGoogleAuth() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getOAuthRedirectUrl("/sign-in"),
      },
    });

    if (error) {
      console.error("Error signing in with Google", error);
      toast.error(error.message || "Error signing in with Google");
      setLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    try {
      const form = e.currentTarget;
      const email = form.email.value;
      const password = form.password.value;

      if (isTurnstileEnabled && !captchaToken) {
        toast.error("Please complete the captcha");
        setLoading(false);
        return;
      }

      const sb = createSupabaseBrowserClient();
      const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: isTurnstileEnabled
          ? {
              captchaToken: captchaToken ?? undefined,
            }
          : undefined,
      });

      if (error) {
        console.error(error);
        throw error;
      }

      setSuccess(true);
    } catch (error) {
      console.error("Error creating account", error);
      toast.error("Error creating account");
      turnstileRef.current?.reset();
      setCaptchaToken(null);
    }

    setLoading(false);
  }

  if (success) {
    return (
      <div className="mx-auto my-32 flex max-w-sm flex-col gap-4">
        <p className="text-4xl">🚀</p>
        <h1 className="text-2xl font-medium">Account created!</h1>
        <p className="bg-white">
          Please, <span className="underline">check your email</span> 📧 to
          confirm your account.
        </p>
        <p className="">
          After signing in, add a payment method to start your 7-day trial.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto my-32 flex max-w-sm flex-col gap-4">
      <div>
        <Link className="text-slate-400" href="/">
          <CornerUpLeft size={18} />
        </Link>
      </div>
      <form className="mt-4 flex flex-col gap-4" onSubmit={onSubmit}>
        <h1 className="text-2xl font-medium">Create your account</h1>
        <div className="flex flex-col gap-4">
          <GoogleAuthButton onClick={onGoogleAuth} />
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.35em] text-slate-400">
            Or create an account with email
          </p>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input required type="email" name="email" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input required type="password" name="password" />
        </div>
        {isTurnstileEnabled ? (
          <div className="flex justify-center rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-4 shadow-sm">
            <Turnstile
              ref={turnstileRef}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={setCaptchaToken}
              onExpire={() => setCaptchaToken(null)}
            />
          </div>
        ) : null}
        {loading ? (
          <Spinner />
        ) : (
          <>
            <Button type="submit">Create account</Button>
          </>
        )}
      </form>

      <Link className="text-zinc-500" href="/sign-in">
        Already have an account?
      </Link>
    </div>
  );
}
