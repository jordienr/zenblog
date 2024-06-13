import Head from "next/head";
import Link from "next/link";
import { FaCheckCircle, FaTwitter } from "react-icons/fa";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { ZendoLogo } from "@/components/ZendoLogo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { useUser } from "@/utils/supabase/browser";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/router";

const Home = () => {
  const user = useUser();
  const router = useRouter();

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

            <div className="flex flex-grow items-center justify-end gap-1 text-sm font-medium text-zinc-500 ">
              <Link
                className="rounded-lg px-2 py-1 hover:text-zinc-800"
                href="https://blog.zenblog.com"
              >
                Blog
              </Link>
              <Link
                target="_blank"
                href="https://twitter.com/zenbloghq"
                className="flex items-center justify-center rounded-full p-2 text-lg transition-all hover:text-zinc-800"
                title="Follow us on Twitter"
                aria-label="Follow us on Twitter"
              >
                <FaTwitter size="18" />
              </Link>

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
                  className="group inline-flex items-center gap-1 rounded-lg bg-orange-100/70 px-3 py-1 font-mono text-xs font-medium text-orange-600 transition-all "
                  target="_blank"
                  href="https://github.com/jordienr/zenblog"
                >
                  Star us on GitHub
                </Link>
              </div>
              <h1
                className={`mt-4 font-serif text-3xl font-medium italic tracking-tighter text-zinc-800 md:text-4xl`}
              >
                A tiny blogging{" "}
                <span className="font-serif font-extralight italic">
                  platform
                </span>
              </h1>
              <div className="text-sm leading-4 text-zinc-500 md:text-lg md:leading-8">
                <p className="mx-auto mt-3 max-w-sm leading-6">
                  Simple, fast, and open-source blogging.
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
              </div>
            </div>
            <div className="mx-auto mt-14 max-w-4xl rounded-xl border bg-zinc-50 p-1.5 shadow-sm *:rounded-lg hover:bg-zinc-50/50">
              <Image
                className="w-full rounded-lg border border-zinc-200 shadow-sm transition-all"
                src="/static/zenblogui.png"
                loading="lazy"
                blurDataURL="/static/zenblogui.png"
                placeholder="blur"
                width={1200}
                height={700}
                alt="The zenblog editor UI"
              />
            </div>

            <section className="mt-24 border-t py-24 text-center">
              <h2 className="text-2xl font-medium">Simple pricing</h2>
              <p className="text-zinc-500">
                Cancel anytime. No questions asked.
              </p>
              <div className="mx-auto mt-8 flex max-w-3xl justify-center gap-4">
                <PricingItem
                  price="0"
                  title="Free plan"
                  description="Simple, fast, free, and open source blogging."
                  features={[
                    "1 blog",
                    "Unlimited posts",
                    "Free themes",
                    "zenblog domain",
                  ]}
                  action="Get started"
                  onClick={() => {
                    router.push("/sign-up");
                  }}
                />
                <PricingItem
                  price="8.25"
                  title="Pro plan"
                  description="Support Zenblog and unlock exclusive features."
                  features={[
                    "Unlimited blogs",
                    "Unlimited posts",
                    "Free themes",
                    "zenblog domain",
                    "Premium themes <soon>",
                    "Custom domains <soon>",
                    "API Access <soon>",
                  ]}
                  action="Unlock features"
                  onClick={() => {
                    router.push("/sign-up");
                  }}
                />
              </div>
            </section>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

function PricingItem({
  title,
  description,
  features,
  action,
  price,
  onClick,
}: {
  title: string;
  description: string;
  features: string[];
  price: string;
  action: string;
  onClick?: () => void;
}) {
  const formattedFeatures = features.map((feat) => {
    if (feat.includes("<soon>")) {
      const [feature, soon] = feat.split("<soon>");
      return (
        <span key={feature}>
          {feature}{" "}
          <span className="rounded-full bg-orange-50 px-1 py-0.5 text-xs text-orange-500">
            Coming soon
          </span>
        </span>
      );
    }
    return <span key={feat}>{feat}</span>;
  });

  return (
    <div className="flex w-full max-w-[280px] flex-col rounded-lg border bg-white px-4 py-3 text-left shadow-sm">
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="text-sm text-zinc-500">{description}</p>
      <ul className="mt-6 space-y-3 text-left">
        {formattedFeatures.map((feature, idx) => (
          <li
            className="flex items-center gap-2 font-mono text-sm"
            key={idx + "-feat"}
          >
            <FaCheckCircle size="16" className="text-green-500" />
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-auto justify-self-end">
        {+price > 0 && (
          <div>
            <p className="mt-8 font-mono text-2xl font-medium">
              ${price}
              <span className="text-sm text-zinc-500">/month</span>
            </p>
            <p className="text-xs font-medium text-zinc-500">
              ${String(+price * 12)} Billed annually
            </p>
          </div>
        )}

        {/* <div className="flex justify-center pt-4">
          <Button onClick={onClick} className="w-full">
            {action}
          </Button>
        </div> */}
      </div>
    </div>
  );
}

export default Home;
