import { ZendoLogo } from "@/components/ZendoLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useUser } from "@/utils/supabase/browser";
import { TabsContent } from "@radix-ui/react-tabs";
import { CornerUpLeft, Loader, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const supabase = createSupabaseBrowserClient();
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/blogs");
      return;
    }
    supabase.auth.getSession().then((res) => {
      if (res.data.session?.user) {
        router.push("/blogs");
      }
    });
  }, [router, supabase, user]);

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
      setLoading(false);
    } else {
      await router.push("/blogs");
    }
  }

  return (
    <div className="mx-auto my-32 flex max-w-sm flex-col gap-4 px-4">
      {loading ? (
        <div className="flex h-[600px] items-center justify-center">
          <Loader2 className="animate-spin text-orange-500" size={24} />
        </div>
      ) : (
        <>
          <div className="">
            <Link title="Back to home" className="text-zinc-400" href="/">
              <CornerUpLeft size={18} />
            </Link>
          </div>
          <form className="mt-4 flex flex-col gap-2" onSubmit={onSubmit}>
            <h1 className="text-2xl font-medium">Sign in</h1>
            <p className="text-slate-500">
              Don&apos;t have an account?{" "}
              <Link className="text-slate-800 underline" href="/sign-up">
                Sign up
              </Link>
            </p>
            <div className="mt-4">
              <Label htmlFor="email">Email</Label>
              <Input required type="email" name="email" />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="flex items-center justify-between gap-2 py-2"
              >
                Password
                <Link className="text-zinc-500" href="/reset-password">
                  Forgot your password?
                </Link>
              </Label>
              <Input required type="password" name="password" />
            </div>
            <div className="mt-2 flex flex-col">
              <Button type="submit">Sign in</Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
