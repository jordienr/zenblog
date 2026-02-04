/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Link from "next/link";
import {
  FaCode,
  FaHandPeace,
  FaImage,
  FaLock,
  FaPencilAlt,
  FaRocket,
} from "react-icons/fa";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navigation from "@/components/marketing/Navigation";
import { Lora } from "next/font/google";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { HeroImages } from "@/components/Homepage/hero-images";
import { useRouter } from "next/router";

const h1Font = Lora({
  subsets: ["latin"],
  variable: "--font-h1",
});

const FEATURES = [
  {
    Icon: (props: any) => <FaRocket {...props} />,
    title: "Speed & Simplicity",
    description:
      "No need to configure models, create a blog, write a post, publish. Get up and running in minutes.",
  },
  {
    Icon: (props: any) => <FaCode {...props} />,
    title: "Developer first",
    description: "Type‑safe SDK, REST API, framework-friendly.",
  },
  {
    Icon: (props: any) => <FaImage {...props} />,
    title: "Image & Video Hosting",
    description:
      "We host your media for you. No need to upload them to another service. Forget about S3 or CDNs.",
  },
  {
    Icon: (props: any) => <FaPencilAlt {...props} />,
    title: "Writer friendly",
    description:
      "Inspired by tools like Notion, we made an editor that is both powerful and simple to use.",
  },
  {
    Icon: (props: any) => <FaHandPeace {...props} />,
    title: "Fully featured",
    description:
      "You can manage tags, categories, authors, multiple blogs, images and videos without configuring anything!",
  },
  {
    Icon: (props: any) => <FaLock {...props} />,
    title: "Privacy friendly",
    description:
      "You decide the limit. You have full control over your data. We just give you your content.",
  },
];

const Home = () => {
  const router = useRouter();
  useEffect(() => {
    // if we have code in the url redirect to /blogs
    if (router.query.code) {
      router.push("/blogs");
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Zenblog - A tiny blogging CMS</title>
        <meta name="description" content="Simple, headless, blogging CMS." />
        <link rel="icon" href="/static/logo.svg" />
        <meta property="og:url" content="https://www.zenblog.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Zenblog" />
        <meta
          property="og:description"
          content="Simple, headless, blogging CMS."
        />
        <meta property="og:image" content="/static/og.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="zenblog.com" />
        <meta property="twitter:url" content="https://www.zenblog.com/" />
        <meta name="twitter:title" content="Zenblog" />
        <meta
          name="twitter:description"
          content="Simple, headless, blogging CMS."
        />
        <meta name="twitter:image" content="/static/og.jpg" />
      </Head>
      <div className={`${h1Font.variable}`}>
        <div className="flex flex-col">
          <Navigation />
          <main className="mt-12 px-4 pb-24">
            <div className="mx-auto mt-8 max-w-5xl">
              <h1
                className={`mt-4 text-balance text-3xl font-semibold tracking-tight text-slate-800`}
              >
                Focused writing and the best
                <br />
                developer experience in one tool
              </h1>

              <div className="mt-4 text-slate-500">
                <p className="max-w-2xl text-balance text-lg font-medium">
                  Zenblog is a headless CMS with Notion-style editor, hosted
                  image and video uploads, and a type-safe API client.
                </p>
                <div className="mt-5 flex items-center gap-4">
                  <Link className="inline-flex" href="/sign-up">
                    <Button
                      size="default"
                      className="rounded-full bg-gradient-to-b from-slate-800 to-slate-900 font-medium"
                    >
                      Start blogging for free <ArrowRight className="ml-0.5" />
                    </Button>
                  </Link>

                  <button
                    className="cursor-copy rounded-lg px-3 py-1.5 text-sm text-slate-600 transition-all hover:bg-slate-100"
                    onClick={() => {
                      navigator.clipboard.writeText("npm i zenblog");
                      toast.success("Copied to clipboard");
                    }}
                  >
                    <code>npm i zenblog</code>
                  </button>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-12 flex max-w-7xl items-center justify-center">
              <HeroImages />
            </div>

            <div className="mx-auto mt-24 max-w-2xl justify-center gap-6 p-6 text-center">
              <h2 className="text-2xl font-medium">
                <span className="rounded-lg bg-gray-100 px-1 font-mono font-semibold tracking-tight text-orange-500">
                  Developers
                </span>{" "}
                love it
              </h2>
              <p className="mb-6 text-slate-500">
                What people say about zenblog.
              </p>

              {tweets.map((tweet) => (
                <TweetItem key={tweet.username} {...tweet} />
              ))}
            </div>

            <div className="mx-auto mt-24 max-w-4xl pt-24">
              <h2 className="text-center text-2xl font-medium">
                Why should you use Zenblog?
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-center text-slate-500">
                Every feature developers love.
              </p>
              <div className="mx-auto mt-8 grid grid-cols-1 rounded-xl border bg-slate-50 md:grid-cols-2">
                {FEATURES.map((feature) => (
                  <div
                    key={feature.title}
                    className="border-1 group flex flex-col gap-2 overflow-hidden p-6"
                  >
                    <div className="">
                      <feature.Icon className="size-6 text-slate-400/70 transition-all group-hover:scale-105 group-hover:text-orange-500" />
                    </div>
                    <h3 className="mt-1 font-semibold">{feature.title}</h3>
                    <p className="max-w-sm text-balance text-slate-600">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <section className="mt-24 py-24 text-center">
              <h2 className="text-2xl font-medium">Framework examples</h2>
              <div className="mx-auto mt-8 max-w-4xl space-y-12">
                {[
                  {
                    id: "zenbloghq/nextjs",
                    name: "Zenblog, Next.js, Tailwind CSS, TypeScript",
                    link: "https://github.com/zenbloghq/nextjs",
                    demo: "https://zenblog-nextjs-template.vercel.app/blog",
                    desc: "Next.js Zenblog example with Tailwind CSS and TypeScript",
                    image: "/static/zenblog-nextjs-template.webp",
                  },
                  // {
                  //   id: "zenbloghq/astro",
                  //   name: "Zenblog, Astro, Tailwind CSS, TypeScript",
                  //   link: "https://github.com/zenbloghq/astro",
                  //   demo: "https://zenblog-astro-template.vercel.app/blog",
                  //   desc: "Astro Zenblog example with Tailwind CSS and TypeScript",
                  //   image: "/static/zenblog-astro-template.webp",
                  // },
                ].map((fw) => (
                  <article
                    key={fw.id}
                    className="grid rounded-xl border border-slate-200 bg-slate-100/50 p-2 md:grid-cols-2"
                  >
                    <div>
                      <Image
                        className="w-full rounded-lg border shadow-sm"
                        src={fw.image}
                        width={800}
                        height={400}
                        alt={`${fw.name} - ${fw.desc}`}
                      />
                    </div>
                    <div className="p-4 text-left">
                      <h3 className="text-lg font-medium">{fw.name}</h3>
                      <p className="text-balance text-lg text-slate-400">
                        {fw.desc}
                      </p>
                      <div className="mt-4 grid gap-4 text-orange-600">
                        <Link
                          href={fw.link}
                          target="_blank"
                          className="mt-4 flex items-center gap-2 underline"
                        >
                          Open in Github
                        </Link>
                        <Link
                          href={fw.demo}
                          target="_blank"
                          className="mt-1 flex items-center gap-2 underline"
                        >
                          Try the demo
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-24 py-24 text-center">
              <h2 className="text-2xl font-medium">
                Frequently asked questions
              </h2>
              <div className="mx-auto mt-12 max-w-2xl text-left">
                <Accordion
                  type="multiple"
                  className="divide-y rounded-xl border bg-slate-100/50 *:px-4 [&_div]:text-lg"
                >
                  <AccordionItem value="zenblog">
                    <AccordionTrigger>What is zenblog?</AccordionTrigger>
                    <AccordionContent className="text-lg">
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
                      Yes, you should use a backend server to fetch your content
                      from zenblog and cache it. This will protect your blog id
                      and make your website faster and SEO friendly.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="apihow">
                    <AccordionTrigger>How do I use the API?</AccordionTrigger>
                    <AccordionContent>
                      Once you create your blog, you&apos;ll be able to use the
                      blog id to fetch your content from the public API. Find
                      more info in the{" "}
                      <Link className="underline" href="/docs">
                        API docs
                      </Link>
                      .
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

const tweets = [
  {
    content:
      "I started using @zenbloghq yesterday. I literally got it running on my Astro site in 10 minutes. Really great product",
    name: "Alvaro",
    username: "metasurfero",
    image: "/static/tweets/metasurfero.jpg",
  },
  {
    content: "I'm using @zenbloghq and you probably should too",
    name: "Duncan Lutz",
    username: "duncanthedev",
    image: "/static/tweets/duncanthedev.jpg",
  },
  {
    content:
      "By the way, the CMS is @zenbloghq. A brilliant CMS that simply works. Integrating it with the website didn't take 5 minutes.",
    name: "Narix Hine",
    username: "leximory",
    image: "/static/tweets/leximory.jpg",
  },
  {
    content: "@zenbloghq is the best",
    name: "dmytro",
    username: "pqoqubbw",
    image: "/static/tweets/pqoqubbw.jpg",
  },
  {
    content: "zenblog gud",
    name: "william",
    username: "williamhzo",
    image: "/static/tweets/williamhzo.jpg",
  },
];

const TweetItem = ({
  content,
  name,
  username,
  image,
}: {
  content: string;
  name: string;
  username: string;
  image: string;
}) => {
  return (
    <div
      className={cn(
        "relative mb-4 flex gap-4 rounded-lg border bg-slate-50 p-4 text-left"
      )}
    >
      <div className="flex-shrink-0">
        <Image
          src={image}
          alt={name}
          width={48}
          height={48}
          className="rounded-full"
        />
      </div>
      <div className={cn("")}>
        <div className="flex items-center gap-2">
          <p className="font-semibold">{name}</p>
          <p className=" text-slate-500">@{username}</p>
        </div>
        <p className={cn("text-balance text-slate-800")}>{content}</p>
      </div>
    </div>
  );
};

export default Home;
