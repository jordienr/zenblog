import Head from "next/head";
import Link from "next/link";
import {
  FaChartLine,
  FaCode,
  FaImage,
  FaImages,
  FaRegChartBar,
  FaTwitter,
} from "react-icons/fa";
import { SiTypescript } from "react-icons/si";
import { Command } from "lucide-react";
import { CgTrees } from "react-icons/cg";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { getClient } from "@/lib/supabase";
import { useState } from "react";
import { motion } from "framer-motion";
import ZendoLogo from "@/components/ZendoLogo";
import { useAuth } from "@clerk/nextjs";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { oneDark as dark } from "react-syntax-highlighter/dist/esm/styles/prism";

// import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import Image from "next/image";

const Home = () => {
  const features = [
    {
      title: "Headless CMS",
      description: "Built for developers. Stack agnostic.",
      icon: <FaCode size="24" className="text-orange-500" />,
    },
    {
      title: "Type safety",
      description:
        "Fully typed API client that you can use in your app to fetch your content. No GraphQL.",
      icon: <SiTypescript size="24" className="text-orange-500" />,
    },
    {
      title: "Cmd + V Images",
      description:
        "Imagine having to open the system file picker just to upload an image.",
      icon: <FaImages size="24" className="text-orange-500" />,
    },
    {
      title: "SEO",
      description: "Easily manage SEO metadata for your posts.",
      icon: <FaChartLine size="24" className="text-orange-500" />,
    },
    {
      title: "Open graph images",
      description: "Automatic generation of open graph images for your posts.",
      icon: <FaImage size="24" className="text-orange-500" />,
    },
    {
      title: "Cmd + K",
      description: "A modern dashboard that you can navigate easily.",
      icon: <Command className="text-orange-500" />,
    },
    {
      title: "Unlimited blogs",
      description:
        "It doesn't matter how many blogs you have. Simple usage based pricing.",
      icon: <CgTrees size="24" className="text-orange-500" />,
    },
    {
      title: "Analytics",
      description: "Easily find out how many page views your blog posts have.",
      icon: <FaRegChartBar size="24" className="text-orange-500" />,
    },
  ];

  const pricing = [
    {
      title: "Indie",
      description:
        "Zendo offers a free plan for personal use. You can have as many blogs as you want. You can have as many posts as you want. You can have as many authors as you want.",
      price: "9",
      features: [
        "Unlimited blogs",
        "Unlimited posts",
        "Up to 10 thousand page views per month",
      ],
    },
    {
      title: "Pro",
      description:
        "Zendo offers a fair pricing for businesses. You can have as many blogs as you want. You can have as many posts as you want. You can have as many authors as you want.",
      price: "49",
      features: [
        "Unlimited blogs",
        "Unlimited posts",
        "Up to 500 thousand page views per month",
      ],
    },
    {
      title: "Agency",
      description:
        "Zendo offers a fair pricing for agencies. You can have as many blogs as you want. You can have as many posts as you want. You can have as many authors as you want.",
      price: "199",
      features: [
        "Unlimited blogs",
        "Unlimited posts",
        "Up to 5 million page views per month",
      ],
    },
  ];

  const { isSignedIn } = useAuth();

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const formSchema = z.object({
    name: z.string(),
    email: z.string().email(),
  });

  type FormData = z.infer<typeof formSchema>;

  const { register, handleSubmit, formState } = useForm<FormData>({});

  const onSubmit = handleSubmit(async (data) => {
    const formData = formSchema.parse(data);
    console.log(formData);

    const sb = getClient();

    await sb.from("homepage_signup").insert(formData);

    setHasSubmitted(true);

    return;
  });

  return (
    <>
      <Head>
        <title>zendoblog</title>
        <meta name="description" content="Headless CMS for TS devs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-grid-slate-200/50 min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl">
          <nav className="flex items-center justify-between p-3">
            <ZendoLogo />
            <div className="flex items-center gap-4">
              {/* <Link href="/blog" className="text-lg underline">
                Blog
              </Link> */}
              <Link
                target="_blank"
                href="https://twitter.com/tryzendo"
                className="flex items-center justify-center rounded-full p-2 text-lg text-blue-500 hover:bg-blue-100"
                title="Follow us on Twitter"
                aria-label="Follow us on Twitter"
              >
                <FaTwitter size="24" />
              </Link>
              {isSignedIn && (
                <div>
                  <Link className="btn btn-primary inline-block" href="/blogs">
                    My Blogs
                  </Link>
                </div>
              )}
            </div>
          </nav>
          <main className="px-4">
            <div className="mt-12 max-w-sm">
              <p className="inline-flex items-center rounded-full border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 px-3 py-1 text-xs text-orange-500">
                Sign up for a special launch discount
              </p>
              <h1 className="mt-2 flex max-w-sm flex-wrap gap-2 text-left text-3xl font-semibold">
                {"Add a blog to your website in 2 lines of code"
                  .split(" ")
                  .map((w, i) => (
                    <motion.span
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.2,
                        delay: i * 0.1,
                      }}
                      className="inline-block"
                      key={w}
                    >
                      {w}
                    </motion.span>
                  ))}
              </h1>
              <p className="mt-2 text-lg text-slate-500">
                The modern headless CMS for TypeScript developers
              </p>
            </div>
            {!hasSubmitted && (
              <form
                className="mt-6 flex max-w-sm flex-col gap-2"
                onSubmit={onSubmit}
              >
                <div className="flex gap-2">
                  <label htmlFor="name">
                    <input
                      type="text"
                      id="name"
                      className="rounded-t-xl px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Name"
                      aria-label="Name"
                      title="Name"
                      {...register("name", { required: true })}
                    />
                  </label>
                  <label htmlFor="email">
                    <input
                      {...register("email", { required: true })}
                      type="email"
                      id="email"
                      aria-label="Email"
                      className="rounded-b-xl px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Email"
                      title="Email"
                    />
                  </label>
                </div>
                <div className="actions">
                  <button
                    type="submit"
                    className="btn btn-primary w-full min-w-full"
                  >
                    Let me know when you launch
                  </button>
                </div>
              </form>
            )}
            {hasSubmitted && (
              <div className="mt-6 flex max-w-xs flex-col gap-4">
                <p className="text-lg font-semibold">
                  Thank you for signing up!
                </p>
                <p className="text-gray-600">
                  We will let you know when we launch.
                </p>
              </div>
            )}
          </main>
          <section className="section mx-3 mt-16 px-3">
            <ul className="mt-4 grid-cols-2 md:grid">
              {features.map((feature, index) => {
                return (
                  <motion.li
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.1,
                    }}
                    className="cursor-default px-4 py-3"
                    key={feature.title}
                  >
                    <div className="flex gap-4">
                      <div className="py-2">{feature.icon}</div>
                      <div>
                        <h3 className="text-lg font-medium">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </section>

          <section className="section mx-3 mt-12 p-3">
            <h2 className="section-title">
              Get your content easily, fully typed.
            </h2>
            <div className="mt-4">
              <pre className="overflow-auto rounded-lg bg-slate-800 text-blue-100">
                {`
  import { createClient } from "@zendoblog/cms";

  const cms = createClient({
    blogId: env.ZENDO_BLOG_ID,
  });

  const posts = await cms.posts.getAll();
                `}
              </pre>
            </div>
          </section>

          <section className="section mx-3 mt-12 p-3">
            <h2 className="section-title">Simple UI to manage your blogs</h2>
            <Image
              className="mt-4 rounded-lg shadow-sm"
              src="/zendoblog-screenshot-1.png"
              alt="Screenshot of the ZendoBlog UI"
              loading="lazy"
              blurDataURL="/zendoblog-screenshot-1.png"
              placeholder="blur"
              width={1440}
              height={900}
            />
          </section>

          {/* <section className="m-3 mt-16 rounded-xl border-[0.3px] bg-gradient-to-b from-white to-slate-50 px-3 py-4 shadow-sm">
            <h2 className="my-4 text-center text-2xl font-semibold">
              Simple usage based pricing
            </h2>
            <ul className="mx-auto mt-4 grid-cols-3 md:grid">
              {pricing.map((price, index) => {
                return (
                  <motion.li
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.1,
                    }}
                    className="cursor-default px-4 py-3"
                    key={price.title}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-xl font-medium">{price.title}</h3>
                        <div className="rounded-lg border border-orange-100 bg-orange-50 p-1 text-sm font-medium text-orange-600">
                          €{price.price}/mo
                        </div>
                      </div>
                      <div className="flex flex-col">
                        {price.features.map((feature) => {
                          return (
                            <p className="text-gray-600" key={feature}>
                              {feature}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </section> */}
        </div>
        <footer>
          <div className=" mt-24 bg-gradient-to-b from-transparent to-white pb-40 pt-24 text-center font-semibold text-slate-800">
            thanks for checking out zendo
            <span className="text-orange-500">blog</span>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
