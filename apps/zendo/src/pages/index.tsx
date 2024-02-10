import Head from "next/head";
import Link from "next/link";
import { FaTwitter } from "react-icons/fa";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { getClientClient } from "@/lib/supabase";
import { useEffect, useState } from "react";
import ZendoLogo from "@/components/ZendoLogo";
import { useUser } from "@supabase/auth-helpers-react";
import { LoggedInUser } from "@/components/LoggedInUser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Home = () => {
  const user = useUser();

  useEffect(() => {
    const client = getClientClient();
    client.auth.getSession().then((res) => {
      console.log("sess", res);
    });

    client.auth.getUser().then((res) => {
      console.log("user", res);
    });
  }, []);

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const formSchema = z.object({
    name: z.string(),
    email: z.string().email(),
  });

  type FormData = z.infer<typeof formSchema>;

  const { register, handleSubmit, formState } = useForm<FormData>({});

  const onSubmit = handleSubmit(async (data) => {
    const formData = formSchema.parse(data);

    const sb = getClientClient();

    await sb.from("homepage_signup").insert(formData);

    setHasSubmitted(true);

    return;
  });

  return (
    <>
      <Head>
        <title>zenblog</title>
        <meta
          name="description"
          content="blogging cms and api for typescript devs"
        />
        <link rel="icon" href="/static/favicon.ico" />
      </Head>
      <div className="bg-zinc-100">
        <div className="mx-auto flex max-w-3xl flex-col">
          <nav className="flex items-center justify-between p-3">
            <div className="flex-grow">
              <ZendoLogo />
            </div>

            <div className="flex flex-grow items-center justify-end gap-4 font-medium text-zinc-600">
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
                <Button asChild>
                  <Link
                    href="/sign-in"
                    className="btn btn-primary inline-block"
                    title="Sign in"
                    aria-label="Sign in"
                  >
                    Sign in
                  </Link>
                </Button>
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
              <div className="">
                <Link
                  className=" inline-flex items-center gap-1 p-2 font-mono text-sm text-zinc-400 underline hover:text-amber-500"
                  target="_blank"
                  href="https://github.com/jordienr/zenblog"
                >
                  Star us on GitHub
                </Link>
              </div>
              <h1 className="mt-2 bg-gradient-to-b from-zinc-800 via-zinc-500 to-zinc-800 bg-clip-text text-3xl font-medium tracking-tight text-transparent md:text-5xl">
                Add a blog to your <br /> website{" "}
                <span className="bg-gradient-to-br from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  in 2 minutes
                </span>
              </h1>
              <p className="mt-2 text-lg font-light text-zinc-500">
                Open source, headless, blogging CMS.
              </p>
            </div>
            {!hasSubmitted && (
              <form
                className="mt-6 flex max-w-sm flex-col gap-2"
                onSubmit={onSubmit}
              >
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
          </main>

          <div className="mx-4 mt-12 flex max-w-xl flex-col gap-4 py-6 font-mono text-zinc-800">
            <h2 className="text-lg font-medium"># features </h2>
            <ul className="flex flex-col gap-3">
              <li>- Open source.</li>
              <li>- Type safe content.</li>
              <li>- No GraphQL.</li>
              <li>- API.</li>
              <li>- A *great* editing experience.</li>
              <li>- Easy to extend.</li>
              <li>- Gets you up and running in 2 minutes.</li>
              <li>- Have as many blogs as you want.</li>
              <li>- Invite friends to contribute to your blog.</li>
              <li>- Analytics.</li>
            </ul>
          </div>
        </div>
        <footer>
          <div className="mt-24 bg-gradient-to-b from-transparent to-white p-24 text-center font-mono text-zinc-800">
            <div className="mx-auto max-w-3xl">
              thanks for checking out zen
              <span className="text-orange-500">blog</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
