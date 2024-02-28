import Head from "next/head";
import Link from "next/link";
import { FaTwitter } from "react-icons/fa";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import ZendoLogo from "@/components/ZendoLogo";
import { LoggedInUser } from "@/components/LoggedInUser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";
import Footer from "@/components/Footer";
import { useUser } from "@/utils/supabase/browser";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { SubscribeSection } from "./account";
import { HiStar } from "react-icons/hi";

const Home = () => {
  const user = useUser();

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const formSchema = z.object({
    name: z.string(),
    email: z.string().email(),
  });

  type FormData = z.infer<typeof formSchema>;

  const { register, handleSubmit, formState } = useForm<FormData>({});

  const onSubmit = handleSubmit(async (data) => {
    const formData = formSchema.parse(data);

    const sb = getSupabaseBrowserClient();

    await sb.from("homepage_signup").insert(formData);

    setHasSubmitted(true);

    return;
  });

  return (
    <>
      <Head>
        <title>zenblog</title>
        <meta name="description" content="Open source blogging cms" />
        <link rel="icon" href="/static/favicon.ico" />
      </Head>
      <div className="bg-zinc-50">
        <div className="mx-auto flex max-w-3xl flex-col">
          <nav className="flex items-center justify-between p-3">
            <div className="flex-grow cursor-default">
              <ZendoLogo />
            </div>

            <div className="flex flex-grow items-center justify-end gap-4 font-medium text-zinc-600">
              {/* <Link href="/blog">Blog</Link> */}
              <LoggedInUser>
                <Link
                  className="rounded-full px-3 py-1.5 hover:text-zinc-800"
                  href="/docs"
                >
                  Docs
                </Link>
              </LoggedInUser>
              <Link
                target="_blank"
                href="https://twitter.com/zenbloghq"
                className="flex items-center justify-center rounded-full p-2 text-lg text-blue-500 transition-all hover:bg-blue-100"
                title="Follow us on Twitter"
                aria-label="Follow us on Twitter"
              >
                <FaTwitter size="18" />
              </Link>

              {!user && (
                <div className="space-x-1.5">
                  <Button asChild variant={"outline"}>
                    <Link href="/sign-in" title="Sign in" aria-label="Sign in">
                      Log in
                    </Link>
                  </Button>
                  {/* <Button asChild>
                    <Link href="/sign-up" title="Sign up" aria-label="Sign up">
                      Sign up
                    </Link>
                  </Button> */}
                </div>
              )}

              {user && (
                <div className="flex">
                  <Button asChild>
                    <Link
                      className="btn btn-primary inline-block"
                      href="/blogs"
                    >
                      My Blogs
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </nav>

          <main className="px-4 font-sans">
            <div className="mx-auto mt-12">
              <div className="mx-1">
                <Link
                  className="highlight-zinc-700 group inline-flex items-center gap-1 rounded-full border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-600 px-3 py-1 text-xs text-zinc-100 transition-all hover:text-amber-300"
                  target="_blank"
                  href="https://github.com/jordienr/zenblog"
                >
                  {/* <StarIcon
                    size="15"
                    className="mr-1 text-zinc-300 group-hover:text-amber-200"
                  /> */}
                  <HiStar
                    size="15"
                    className="text-zinc-300 group-hover:text-amber-200"
                  />
                  Star us on GitHub
                </Link>
              </div>
              <h1 className="mt-4 bg-gradient-to-b from-zinc-800 via-zinc-500 to-zinc-800 bg-clip-text text-5xl font-medium tracking-tight text-transparent md:text-5xl">
                Add a blog to your <br /> website{" "}
                <span className="bg-gradient-to-br from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  in 2 minutes
                </span>
              </h1>
              <div className="mt-4 text-lg font-light text-zinc-500">
                <ul className="space-y-3">
                  <li>Open source.</li>
                  <li>Headless, works with any stack.</li>
                  <li>Type safe content.</li>
                  <li>Great editing experience.</li>
                  <li>Easy to extend.</li>
                  <li>Gets you up and running in 2 minutes.</li>
                </ul>
              </div>
            </div>
            <hr className="my-12" />
            {!hasSubmitted && (
              <form
                className="mt-6 flex max-w-sm flex-col gap-2 py-2 pb-12"
                onSubmit={onSubmit}
              >
                <h2>
                  <span className="text-xl font-medium text-zinc-800">
                    Be the first to try it.
                  </span>
                </h2>
                <div className="flex gap-2 [&>*]:w-full">
                  <label htmlFor="name">
                    <Input
                      type="text"
                      id="name"
                      placeholder="Name"
                      aria-label="Name"
                      title="Name"
                      {...register("name", { required: true })}
                    />
                  </label>
                  <label htmlFor="email">
                    <Input
                      {...register("email", { required: true })}
                      type="email"
                      id="email"
                      aria-label="Email"
                      placeholder="Email"
                      title="Email"
                    />
                  </label>
                </div>
                <div className="">
                  <Button className="w-full" type="submit">
                    Request invite!
                  </Button>
                </div>
              </form>
            )}
            {hasSubmitted && (
              <div className="mx-auto mt-6 flex max-w-xs flex-col gap-4 rounded-xl py-4 text-center">
                <span className="-mb-2 text-3xl">🎉</span>
                <p className="text-lg font-semibold">
                  Thank you for signing up!
                </p>
                <p className="-mt-4 text-gray-600">
                  We will let you know when we launch.
                </p>
              </div>
            )}

            {/* <hr className="my-12" /> */}

            {/* <section className="pb-8">
              <SubscribeSection />
            </section> */}
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
