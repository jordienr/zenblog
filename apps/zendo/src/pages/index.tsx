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
import { Command, Star } from "lucide-react";
import { CgTrees } from "react-icons/cg";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { getClientClient } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ZendoLogo from "@/components/ZendoLogo";
import Image from "next/image";
import { useUser } from "@supabase/auth-helpers-react";
import { HiArrowLeft } from "react-icons/hi";
import { LoggedInUser } from "@/components/LoggedInUser";
import { OpenSource } from "@/components/Homepage/Cards/OpenSource";
import TypeSafety from "@/components/Homepage/Cards/TypeSafety";
import { ZendoEditor } from "@/components/Editor/ZendoEditor";
import { CodeBlock } from "@/components/CodeBlock";
import BaseCard from "@/components/Homepage/Cards/BaseCard";
import ReactComponents from "@/components/Homepage/Cards/ReactComponents";
import CodeExamples from "@/components/Homepage/Cards/CodeExamples";
import Demo from "@/components/Homepage/Cards/Demo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Home = () => {
  const features = [
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
    {
      title: "Open Source",
      description: "Built with Next.js and Supabase.",
      icon: <FaCode size="24" className="text-orange-500" />,
    },
  ];

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
        <title>zendoblog</title>
        <meta name="description" content="Headless CMS for TS devs" />
        <link rel="icon" href="/static/favicon.ico" />
      </Head>
      <div className="bg-grid-slate-200/50 min-h-screen bg-slate-50">
        <div className="mx-auto flex max-w-5xl flex-col">
          <nav className="flex items-center justify-between p-3">
            <div className="flex-grow">
              <ZendoLogo />
            </div>

            <div className="flex flex-grow items-center justify-end gap-4">
              <LoggedInUser>
                <Link href="/blog" className="text-lg underline">
                  Blog
                </Link>
              </LoggedInUser>
              <LoggedInUser>
                <Link href="/insights" className="text-lg underline">
                  Insights
                </Link>
              </LoggedInUser>
              <Link
                target="_blank"
                href="https://twitter.com/zenbloghq"
                className="flex items-center justify-center rounded-full p-2 text-lg text-blue-500 hover:bg-blue-100"
                title="Follow us on Twitter"
                aria-label="Follow us on Twitter"
              >
                <FaTwitter size="24" />
              </Link>

              {!user && (
                <Link
                  href="/sign-in"
                  className="btn btn-primary inline-block"
                  title="Sign in"
                  aria-label="Sign in"
                >
                  Sign in
                </Link>
              )}

              {user && (
                <div className="flex">
                  <Link className="btn btn-primary inline-block" href="/blogs">
                    My Blogs
                  </Link>
                </div>
              )}
            </div>
          </nav>

          <main className="px-4 font-sans">
            <div className="mx-auto mt-12 max-w-2xl text-center">
              <div className="flex justify-center">
                <Link
                  className="flex items-center gap-1 rounded-xl border bg-white px-3 py-1 text-sm font-medium shadow-sm hover:text-amber-500"
                  target="_blank"
                  href="https://github.com/jordienr/zendo"
                >
                  <Star className="text-amber-500" size="20" />
                  Star us on GitHub
                </Link>
              </div>
              <h1 className="mt-2 text-3xl font-bold leading-[55px] tracking-tight text-slate-900 md:text-5xl">
                Add a blog to your <br /> website in 2 minutes
              </h1>
              <p className="mx-auto mt-4 max-w-md text-lg text-slate-600">
                Open source blogging CMS <br /> Works with any stack
              </p>
            </div>
            {!hasSubmitted && (
              <form
                className="mx-auto mt-6 flex max-w-sm flex-col gap-2"
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

          <div className="mt-12 grid gap-4 p-2 md:grid-cols-2">
            <div className="col-span-2">
              <Demo />
            </div>

            <OpenSource />
            <TypeSafety />
            <div className="col-span-2">
              <ReactComponents />
            </div>
            <div className="col-span-2">
              <CodeExamples />
            </div>
          </div>
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
