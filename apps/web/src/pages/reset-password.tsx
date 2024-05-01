import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [step1Success, setStep1Success] = useState(false);
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  async function onSubmitStep1(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    const form = e.currentTarget;
    const email = form.email.value;

    const url = new URL(window.location.href);

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${url.origin}/reset-password-confirmation`,
    });

    if (error) {
      alert(error.message);
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
          <Link href="https://gmail.com">Open gmail</Link>
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
          <p>
            <Spinner />
          </p>
        ) : (
          <>
            <Label htmlFor="email">Email</Label>
            <Input type="email" name="email" id="email" />
            <Button type="submit">Send reset link</Button>
          </>
        )}
      </form>
    </>
  );
}
