import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { getTurnstileSiteKey, isTurnstileEnabled } from "@/lib/turnstile";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [step1Success, setStep1Success] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const turnstileSiteKey = getTurnstileSiteKey();
  const turnstileEnabled = isTurnstileEnabled();

  async function onSubmitStep1(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    const form = e.currentTarget;
    const email = form.email.value;

    const url = process.env.NEXT_PUBLIC_BASE_URL;

    if (turnstileEnabled && !captchaToken) {
      toast.error("Please complete the captcha");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${url || ""}/reset-password-confirmation`,
      ...(captchaToken ? { captchaToken } : {}),
    });

    if (error) {
      toast.error(error.message);
      turnstileRef.current?.reset();
      setCaptchaToken(null);
      setLoading(false);
      return;
    }

    setStep1Success(true);
    setLoading(false);
  }

  if (step1Success) {
    return (
      <>
        <div className="py-40 text-center">
          <h2 className="text-2xl font-medium">Reset password</h2>
          <p className="text-slate-500">
            We have sent you a link to reset your password.
          </p>
          <Link target="_blank" href="https://gmail.com">
            Open gmail
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <form
        className="mx-auto my-32 flex max-w-xs flex-col gap-4"
        onSubmit={onSubmitStep1}
      >
        <h2 className="text-2xl font-medium">Reset password</h2>
        <p className="text-slate-500">
          We will send you a link to reset your password.
        </p>
        {loading ? (
          <div>
            <Spinner />
          </div>
        ) : (
          <>
            <Label htmlFor="email">Email</Label>
            <Input required type="email" name="email" id="email" />
            {turnstileSiteKey ? (
              <Turnstile
                ref={turnstileRef}
                siteKey={turnstileSiteKey}
                onSuccess={setCaptchaToken}
                onExpire={() => setCaptchaToken(null)}
              />
            ) : (
              <p className="text-sm text-zinc-500">
                Captcha is not configured for this environment.
              </p>
            )}
            <Button type="submit">Send reset link</Button>
          </>
        )}
      </form>
    </>
  );
}
