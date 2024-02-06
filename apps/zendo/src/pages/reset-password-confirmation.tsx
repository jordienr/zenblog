import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ResetPasswordConfirmation() {
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const password2 = formData.get("password2") as string;

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
        <Label htmlFor="password">New password</Label>
        <Input type="password" name="password" id="password" />
        <Label htmlFor="password2">Repeat new password</Label>
        <Input type="password" name="password2" id="password2" />
        <Button type="submit" variant="default">
          Save
        </Button>
      </form>
    </>
  );
}
