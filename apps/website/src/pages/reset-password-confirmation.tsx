import { ZenButton } from "@/components/ZenButton";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";

export default function ResetPasswordConfirmation() {
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    const form = e.currentTarget;
    const password = form.email.password;
    const password2 = form.email.password2;

    if (password !== password2) {
      alert("Passwords do not match");
      return;
    }

    const { data, error } = await supabase.auth.updateUser({
      password,
    });
    if (error) {
      alert(error.message);
    }

    alert("Password updated");
    window.location.pathname = "/sign-in";
    setLoading(false);
  }

  return (
    <>
      <form
        className="mx-auto my-32 flex max-w-xs flex-col gap-4"
        onSubmit={onSubmit}
      >
        <h2 className="text-2xl font-medium">New password</h2>
        <p className="text-slate-500">Pick a new password for your account.</p>
        <label htmlFor="password">
          New password
          <input type="password" name="password" id="password" />
        </label>
        <label htmlFor="password2">
          Repeat new password
          <input type="password2" name="password2" id="password2" />
        </label>
        <ZenButton type="submit" variant="primary">
          Save
        </ZenButton>
      </form>
    </>
  );
}
