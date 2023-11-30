import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useState } from "react";
import { HiArrowLeft } from "react-icons/hi";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();

  async function onSubmitMagicLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    const form = e.currentTarget;
    const email = form.email.value;

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/blogs`,
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
    const form = e.currentTarget;
    const email = form.email.value;
    const password = form.password.value;

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
    <div className="mx-auto my-32 flex max-w-sm flex-col gap-4">
      <div>
        <Link className="text-slate-400" href="/">
          <HiArrowLeft size={24} />
        </Link>
      </div>
      <Tabs defaultValue="password">
        <TabsList>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
        </TabsList>

        <TabsContent value="password">
          <form className="mt-4 flex flex-col gap-4" onSubmit={onSubmit}>
            <h1 className="text-2xl font-medium">Sign in with Password</h1>
            <label>
              Email
              <input required type="email" name="email" />
            </label>
            <label>
              Password
              <input required type="password" name="password" />
            </label>
            <Button type="submit">Sign in</Button>
          </form>
        </TabsContent>

        <TabsContent value="magic-link">
          <form
            className="mt-4 flex flex-col gap-4"
            onSubmit={onSubmitMagicLink}
          >
            <h1 className="text-2xl font-medium">Sign in with Magic Link</h1>
            <label>
              Email
              <input required type="email" name="email" />
            </label>
            <Button type="submit">Sign in</Button>
          </form>
        </TabsContent>
      </Tabs>
      <Link className="link" href="/reset-password">
        Forgot your password?
      </Link>
    </div>
  );
}
