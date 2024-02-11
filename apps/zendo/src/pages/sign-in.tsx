import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { CornerUpLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.email) {
      router.push("/blogs");
    }
  }, [user, router]);

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
          <CornerUpLeft size={18} />
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
            <div>
              <Label htmlFor="password">Email</Label>
              <Input required type="email" name="email" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input required type="password" name="password" />
            </div>
            <Button type="submit">Sign in</Button>
          </form>
        </TabsContent>

        <TabsContent value="magic-link">
          <form
            className="mt-4 flex flex-col gap-4"
            onSubmit={onSubmitMagicLink}
          >
            <h1 className="text-2xl font-medium">Sign in with Magic Link</h1>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input required type="email" name="email" />
            </div>
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
