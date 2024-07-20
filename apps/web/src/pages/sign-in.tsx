import { ZendoLogo } from "@/components/ZendoLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useUser } from "@/utils/supabase/browser";
import { TabsContent } from "@radix-ui/react-tabs";
import { CornerUpLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const supabase = createSupabaseBrowserClient();
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then((res) => {
      if (res.data.session?.user) {
        router.push("/blogs");
      }
    });
  }, [router, supabase]);

  async function onSubmitMagicLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    const form = e.currentTarget;
    const email = form.email.value;

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + "/blogs",
      },
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email for the login link!");
    }

    setLoading(false);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      window.location.pathname = "/blogs";
    }

    setLoading(false);
  }

  return (
    <div className="mx-auto my-32 flex max-w-sm flex-col gap-4 px-4">
      <div>
        <Link className="text-zinc-400" href="/">
          <CornerUpLeft size={18} />
        </Link>
      </div>
      <form className="mt-4 flex flex-col gap-2" onSubmit={onSubmit}>
        <h1 className="text-2xl font-medium">Sign in with Password</h1>

        <div className="mt-4">
          <Label htmlFor="email">Email</Label>
          <Input required type="email" name="email" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input required type="password" name="password" />
        </div>
        <div className="mt-2 flex flex-col">
          <Button type="submit">Sign in</Button>
        </div>
      </form>
      <div className="grid gap-4">
        <Link className="text-zinc-500" href="/reset-password">
          Forgot your password?
        </Link>
        <Link className="text-zinc-500" href="/sign-up">
          Don&apos;t have an account?
        </Link>
      </div>
    </div>
  );
}
