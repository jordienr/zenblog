/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Link from "next/link";
import {
  FaCheckCircle,
  FaCode,
  FaImage,
  FaNetworkWired,
  FaPencilRuler,
  FaPenFancy,
  FaRocket,
  FaSmile,
} from "react-icons/fa";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
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
import { CodeBlockComponent } from "@/components/code-block";
import { Lora } from "next/font/google";

const h1Font = Lora({
  subsets: ["latin"],
  variable: "--font-h1",
});

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
      <div className={`${h1Font.variable}`}>
        <div className="flex flex-col">
          <Navigation />

          <main className="mt-12 px-6 pb-24 font-sans">
            <div className="mx-auto max-w-5xl px-6 text-center">
              <span className="rounded-full bg-orange-50 px-3 py-1 font-mono text-xs font-medium text-orange-500">
                Now in Open beta
              </span>
              <h1
                className={`mt-2 text-4xl tracking-tight text-slate-800 md:text-5xl`}
                style={{ fontFamily: h1Font.style.fontFamily }}
              >
                The hassle-free blogging platform for growing businesses
              </h1>

              <div className="mt-3 text-slate-500">
                <p className="text-balance text-2xl">
                  Simple, headless blogging CMS
                  <br /> that works with any stack.
                </p>
                <Link className="mt-8 inline-flex" href="/sign-up">
                  <Button size="default" className="text-sm">
                    Start blogging for free
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto mt-24 max-w-6xl rounded-xl shadow-xl">
              <Image
                className="w-full rounded-lg border border-zinc-200 shadow-sm transition-all"
                src="/static/zenblog-ui.webp"
                loading="lazy"
                blurDataURL="/static/zenblog-ui.webp"
                placeholder="blur"
                width={1200}
                height={300}
                alt="The zenblog editor UI"
              />
            </div>

            <div className="mx-auto mt-24 max-w-5xl rounded-xl bg-slate-950 p-2 font-mono text-white">
              <div className="mb-3 p-2 px-4">
                <FaCode className="text-2xl text-emerald-400" />
                <h2 className="mt-2 text-xl font-medium">Developer friendly</h2>
                <p className="mt-2 text-balance font-sans text-sm text-slate-300">
                  Zenblog is very easy to integrate into any stack by using our
                  HTTP API or our typesafe, typescript API client.
                </p>
                <Link
                  className="mt-2 flex items-center gap-2 text-emerald-400 underline"
                  href="/docs"
                >
                  Go to docs
                </Link>
              </div>
              <CodeBlockComponent
                filename="blog.tsx"
                language="typescript"
                highlightedLines={[]}
              >
                {`import { createZenblogClient } from "zenblog";

const client = createZenblogClient({ blogId: "your-blog-id" });

const posts = await client.posts.list();
const post = await client.posts.get({ slug: "hello-world" });`}
              </CodeBlockComponent>
            </div>

            <div className="mx-auto mt-24 max-w-5xl rounded-xl border p-2">
              <div className="p-2 px-4">
                <FaPenFancy className="text-2xl text-orange-400" />
                <h2 className="mt-2 text-2xl font-medium">
                  <span className="font-serif italic">Wonderful,</span> simple,
                  writing experience
                </h2>
                <p className="mt-2 text-balance font-sans text-sm text-slate-500">
                  Our editor is designed to be both powerful and simple to use.
                  You can focus on writing without worrying about the rest.
                </p>
                <Link
                  className="mt-2 flex items-center gap-2 text-orange-600 underline"
                  href="/sign-up"
                >
                  Try it for free
                </Link>
              </div>
              <div className="mt-4">
                <Image
                  className="w-full rounded-lg border shadow-sm"
                  src="/static/editor-screenshot.webp"
                  width={1200}
                  height={400}
                  alt="The zenblog editor UI"
                />
              </div>
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
                  <article key={fw.id} className="grid grid-cols-2">
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
                      <p className="text-balance text-sm text-zinc-500">
                        {fw.desc}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-4 text-orange-600">
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
                          className="mt-4 flex items-center gap-2 underline"
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
