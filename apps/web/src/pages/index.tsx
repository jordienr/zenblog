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
import Footer from "@/components/Footer";
import { useUser } from "@/utils/supabase/browser";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Spline_Sans } from "next/font/google";

const headlineFont = Spline_Sans({
  display: "swap",
  subsets: ["latin"],
});

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
      <div className="bg-white">
        <div className="flex flex-col">
          <nav className="mx-auto flex w-full max-w-4xl items-center justify-between p-5">
            <div className="flex-grow cursor-default">
              <ZendoLogo className="text-xl" size={31} />
            </div>

            <div className="flex flex-grow items-center justify-end gap-1 text-sm font-medium text-zinc-600">
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
                className="flex items-center justify-center rounded-full p-2 text-lg transition-all hover:text-black"
                title="Follow us on Twitter"
                aria-label="Follow us on Twitter"
              >
                <FaTwitter size="18" />
              </Link>

              {/* {!user && (
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
              )} */}

              {user && (
                <div className="ml-2 flex">
                  <Button asChild variant={"secondary"}>
                    <Link
                      className="btn btn-primary inline-block"
                      href="/blogs"
                    >
                      Dashboard
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </nav>

          <main className="px-4 pb-24 font-sans">
            <div className="mx-auto  mt-12 max-w-xl text-center">
              <div className="">
                <Link
                  className="group inline-flex items-center gap-1 rounded-lg bg-zinc-200/70 px-3 py-1 font-mono text-xs font-medium text-zinc-700 transition-all "
                  target="_blank"
                  href="https://git.new/zenblog"
                >
                  Star us on GitHub
                </Link>
              </div>
              <h1
                className={`mt-4 text-3xl font-semibold tracking-tight text-zinc-800 md:text-4xl`}
              >
                A tiny blogging CMS
              </h1>
              <div className="text-sm font-light leading-4 text-zinc-600 md:text-lg md:leading-8">
                <p className="mx-auto mt-3 max-w-sm">
                  Simple, fast, and open-source blogging.
                  <br />
                  Built for devs and writers.
                </p>
                <Dialog>
                  <DialogTrigger className="mt-4 h-8 rounded-full bg-zinc-900 px-5 text-sm font-medium text-white transition-all hover:bg-zinc-700">
                    Request access
                  </DialogTrigger>
                  <DialogContent className="rounded-xl px-6 md:max-w-sm">
                    {!hasSubmitted && (
                      <form
                        className="flex flex-col gap-2 py-4"
                        onSubmit={onSubmit}
                      >
                        <div>
                          <h2 className="text-xl font-medium text-zinc-800">
                            Be the first to try it.
                          </h2>
                          <p className="text-sm text-zinc-500">
                            We will send the first invites in summer 2024
                          </p>
                        </div>
                        <div className="mt-2 flex flex-col gap-2 [&>*]:w-full">
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
                        <div className="actions">
                          <Button type="submit">Request invite!</Button>
                        </div>
                      </form>
                    )}
                    {hasSubmitted && (
                      <div className="mx-auto mt-6 flex max-w-xs flex-col gap-4 rounded-xl py-4 text-center">
                        <span className="-mb-2 text-3xl">🎉</span>
                        <p className="text-lg font-semibold">
                          Thank you for signing up!
                        </p>
                        <p className="-mt-4 pb-8 text-gray-600">
                          We will let you know when we launch.
                        </p>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                {/* <Carousel className="mt-12 max-w-full">
                  <CarouselContent className="[&_img]:rounded-lg">
                    <CarouselItem>
                      <Image
                        src="/static/ui-1.png"
                        alt="zenblog"
                        width={800}
                        height={400}
                      />
                    </CarouselItem>
                    <CarouselItem>
                      <Image
                        src="/static/ui-2.png"
                        alt="zenblog"
                        width={800}
                        height={400}
                      />
                    </CarouselItem>
                    <CarouselItem>
                      <Image
                        src="/static/ui-3.png"
                        alt="zenblog"
                        width={800}
                        height={400}
                      />
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex" />
                  <CarouselNext className="hidden md:flex" />
                </Carousel> */}
              </div>
            </div>
            <div className="mx-auto mt-14 max-w-4xl rounded-xl border bg-zinc-50 p-1.5 shadow-sm *:rounded-lg">
              <Image
                className="w-full rounded-lg border border-zinc-200 shadow-sm transition-all hover:border-orange-200"
                src="/static/zenblogui.png"
                loading="lazy"
                blurDataURL="/static/zenblogui.png"
                placeholder="blur"
                width={1200}
                height={700}
                alt="The zenblog editor UI"
              />
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
