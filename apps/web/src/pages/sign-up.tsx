import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { Turnstile } from "@marsidev/react-turnstile";
import { CornerUpLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<{ reset: () => void }>(null);
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then((res) => {
      if (res.data.session?.user) {
        router.push("/blogs");
      }
    });
  }, [router, supabase]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    try {
      const form = e.currentTarget;
      const email = form.email.value;
      const password = form.password.value;

      if (!captchaToken) {
        toast.error("Please complete the captcha");
        setLoading(false);
        return;
      }

      const sb = createSupabaseBrowserClient();
      const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: {
          captchaToken,
        },
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
        <p className="">You can close this tab.</p>
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
        <div>
          <Label htmlFor="email">Email</Label>
          <Input required type="email" name="email" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input required type="password" name="password" />
        </div>
        <Turnstile
          ref={turnstileRef}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          onSuccess={setCaptchaToken}
          onExpire={() => setCaptchaToken(null)}
        />
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
