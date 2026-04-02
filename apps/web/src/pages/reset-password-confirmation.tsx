import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ResetPasswordConfirmation() {
  const [loading, setLoading] = useState(false);
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      if (!res.data.user) {
        void router.push("/sign-in");
      }
    });
  }, [router, supabase]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const password2 = formData.get("password2") as string;

    if (password !== password2) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Password updated");
    void router.push("/blogs");
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
