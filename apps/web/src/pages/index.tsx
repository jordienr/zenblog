/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Link from "next/link";
import {
  FaBlog,
  FaCheckCircle,
  FaCode,
  FaImage,
  FaNetworkWired,
  FaPalette,
  FaPen,
  FaPencilAlt,
  FaPencilRuler,
  FaRocket,
  FaSmile,
  FaWordpress,
} from "react-icons/fa";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navigation from "@/components/marketing/Navigation";
import { CgArrowTopRight } from "react-icons/cg";

const FEATURES = [
  {
    icon: <FaRocket />,
    title: "Get started in minutes",
    description:
      "No need to configure models, create a blog, write a post, publish.",
  },
  // {
  //   icon: <FaPencilAlt />,
  //   title: "More than blogs",
  //   description:
  //     "Manage your website content easily. Blog, job postings, changelog, docs, help center, etc.",
  // },
  {
    icon: <FaNetworkWired />,
    title: "Easy to integrate",
    description:
      "Use our HTTP API to fetch your content and display it on your website however you want. Works with any stack.",
  },
  {
    icon: <FaCode />,
    title: "Type safety",
    description:
      "Use our typesafe API client to fetch your content. No more parsing issues.",
  },
  {
    icon: <FaSmile />,
    title: "It's not Wordpress",
    description:
      "Forget about wordpress headaches. Just focus on writing great content.",
  },
  {
    icon: <FaImage />,
    title: "Image hosting",
    description:
      "We host your images for you. No need to upload them to another service.",
  },
  {
    icon: <FaPencilRuler />,
    title: "Simple editor",
    description:
      "Inspired by tools like Notion, we made an editor that is both powerful and simple to use.",
  },
  // {
  //   icon: <FaPalette />,
  //   title: "Themes!",
  //   description:
  //     "We offer free themes for the most popular frameworks. Or you can build your own.",
  // },
];

const Home = () => {
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const formSchema = z.object({
    name: z.string(),
    email: z.string().email(),
  });

  type FormData = z.infer<typeof formSchema>;

  const { register, handleSubmit, formState } = useForm<FormData>({});

  const onSubmit = handleSubmit(async (data) => {
    const formData = formSchema.parse(data);

    const sb = createSupabaseBrowserClient();

    await sb.from("homepage_signup").insert(formData);

    setHasSubmitted(true);

    return;
  });

  return (
    <>
      <Head>
        <title>Zenblog - A tiny blogging CMS</title>
        <meta name="description" content="Simple, headless, blogging CMS." />
        <link rel="icon" href="/static/favicon.ico" />
      </Head>
      <div className="">
        <div className="flex flex-col">
          <Navigation />

          <main className="mt-12 px-6 pb-24 font-sans">
            <div className="mx-auto max-w-4xl">
              <h1
                className={`mt-2 text-4xl font-medium tracking-tight text-zinc-800`}
              >
                A tiny blogging CMS
              </h1>
              <div className="mt-3 text-xl font-medium text-slate-400">
                <p className="">
                  Simple, headless blogging CMS that will make you want to write
                  more
                </p>
                <Link className="mt-8 flex" href="/sign-up">
                  <Button size="default" className="text-sm">
                    Get started
                  </Button>
                </Link>
                {/* <Dialog>
                  <div className="mt-8 flex items-center gap-4">
                    <DialogTrigger asChild>
                      <Button size="default" className="text-sm">
                        Request access
                      </Button>
                    </DialogTrigger>
                  </div>
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
                </Dialog> */}
              </div>
            </div>
            <div className="mx-auto mt-24 max-w-6xl rounded-xl border bg-white p-1.5 shadow-sm">
              <Image
                className="w-full rounded-lg border border-zinc-200 shadow-sm transition-all"
                src="/static/zenblog-ui.png"
                loading="lazy"
                blurDataURL="/static/zenblog-ui.png"
                placeholder="blur"
                width={1200}
                height={300}
                alt="The zenblog editor UI"
              />
            </div>

            <div className="mx-auto mt-24 max-w-4xl">
              <h2 className="text-2xl font-medium">Features</h2>
              <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
                {FEATURES.map((feature) => (
                  <div key={feature.title} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-400">
                      {feature.icon && feature.icon}
                    </div>
                    <h3 className="text-lg font-medium">{feature.title}</h3>
                    <p className="max-w-xs text-sm text-zinc-500">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <section className="mt-24 py-24 text-center">
              <h2 className="text-2xl font-medium">Framework examples</h2>
              <div className="mt-8 flex flex-wrap justify-center gap-8">
                {[
                  {
                    id: "zenbloghq/nextjs",
                    name: "Next.js",
                    link: "https://github.com/zenbloghq/nextjs",
                    desc: "Next.js Zenblog example with Tailwind CSS and TypeScript",
                  },
                  {
                    id: "zenbloghq/astro",
                    name: "Astro",
                    link: "https://github.com/zenbloghq/astro",
                    desc: "Astro Zenblog example with Tailwind CSS and TypeScript",
                  },
                ].map((fw) => (
                  <div
                    key={fw.id}
                    className="flex max-w-xs flex-col gap-2 rounded-xl border px-6 py-4 text-left shadow-sm"
                  >
                    <h3 className="text-lg font-medium">{fw.name}</h3>
                    <p className="text-sm text-zinc-500">{fw.desc}</p>
                    <Link
                      href={fw.link}
                      className="mt-4 flex items-center gap-2 font-mono underline"
                    >
                      View on Github <CgArrowTopRight className="mt-0.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-24 py-24 text-center">
              <h2 className="text-2xl font-medium">
                Frequently asked questions
              </h2>
              <div className="mx-auto mt-12 max-w-xl text-left">
                <Accordion
                  type="multiple"
                  className="divide-y rounded-xl border *:px-4"
                >
                  <AccordionItem value="zenblog">
                    <AccordionTrigger>What is zenblog?</AccordionTrigger>
                    <AccordionContent>
                      Zenblog is a simple, headless blogging CMS. You can use it
                      to manage your own blog, build blogs for your clients, use
                      it to manage content in a website like a blog, job
                      postings, a changelog, docs, help center, etc.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="headless">
                    <AccordionTrigger>
                      What does headless mean?
                    </AccordionTrigger>
                    <AccordionContent>
                      Headless means that zenblog will work with any stack you
                      have. You just have to fetch your content with the zenblog
                      API and display it on your website however you want.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="backend">
                    <AccordionTrigger>
                      Do I need a backend server to use it?
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes, you need a backend server to use zenblog. You should
                      fetch your content from a backend server to protect your
                      API key.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="howmany">
                    <AccordionTrigger>
                      How many blogs can I have?
                    </AccordionTrigger>
                    <AccordionContent>
                      During beta, you can have unlimited blogs on the pro plan.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="apihow">
                    <AccordionTrigger>How do I use the API?</AccordionTrigger>
                    <AccordionContent>
                      Once you create your blog, you&apos;ll be able to generate
                      an API key. You can use this key to fetch content from
                      your blog. You will find API docs and code examples.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
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
    <div className="flex w-full max-w-lg flex-1 flex-col rounded-lg border px-4 py-3 pb-8 text-left shadow-sm">
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
