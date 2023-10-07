import { Button } from "@/components/Button";
import { ZenButton } from "@/components/ZenButton";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [step1Success, setStep1Success] = useState(false);
  const supabase = useSupabaseClient();

  async function onSubmitStep1(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    const form = e.currentTarget;
    const email = form.email.value;

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "/reset-password-confirmation",
    });

    if (error) {
      alert(error.message);
    }

    setStep1Success(true);
    setLoading(false);
  }

  if (step1Success) {
    return (
      <>
        <form>
          <h2 className="text-2xl font-medium">Reset password</h2>
          <p className="text-slate-500">
            We`ve sent you a link to reset your password.
          </p>
        </form>
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
          We`ll send you a link to reset your password.
        </p>
        <label htmlFor="email">
          Email
          <input type="email" name="email" id="email" />
        </label>
        <ZenButton type="submit" variant="primary">
          Send reset link
        </ZenButton>
      </form>
    </>
  );
}
