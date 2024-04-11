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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

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
          <nav className="flex items-center justify-between p-5">
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
                className="flex items-center justify-center rounded-full p-2 text-lg  transition-all hover:text-black"
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

          <main className="px-4 pb-24 font-sans">
            <div className="mx-auto mt-12">
              <div className="">
                <Link
                  className="group inline-flex items-center gap-1 rounded-lg   bg-zinc-200/70 px-3 py-1 font-mono text-xs font-medium text-zinc-700 transition-all "
                  target="_blank"
                  href="https://git.new/zenblog"
                >
                  Star us on GitHub
                </Link>
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                think, write & publish.
              </h1>
              <div className="text-lg font-light leading-8 text-zinc-600">
                <p className="mt-8 max-w-sm">
                  Zenblog is a headless CMS for blogging. It was built with
                  developers and writers in mind. It allows you to fetch your
                  content easily and is fully typesafe. The UI is minimal and
                  clean. It&apos;s open source. Hosts images for you.
                </p>
                <Dialog>
                  <DialogTrigger className="mt-4 h-9 rounded-full bg-black px-4 text-sm font-medium text-white shadow-lg ring-black transition-all hover:-translate-y-[2px] hover:shadow-xl ">
                    Request access
                  </DialogTrigger>
                  <DialogContent className="max-w-sm">
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
                  </DialogContent>
                </Dialog>

                <Carousel className="mt-12 max-w-full">
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
                </Carousel>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
