/* eslint-disable react-hooks/rules-of-hooks */
import { ZendoLogo } from "@/components/ZendoLogo";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Twitter } from "lucide-react";
import Link from "next/link";
import React, { PropsWithChildren } from "react";

type Props = {};

export const revalidate = 60;
const layout = async ({
  children,
  params,
}: PropsWithChildren<{
  params: {
    slug: string;
  };
}>) => {
  return (
    <div className="mx-auto flex max-h-screen max-w-6xl">
      <aside className="flex min-h-screen min-w-[16rem] flex-col overflow-auto">
        <div className="p-3 text-center">
          <Link href="/">
            <ZendoLogo />
          </Link>
        </div>
        <ul className="flex-grow p-4 font-medium"></ul>
        <div className="mt-auto justify-self-end p-4 text-center text-xs text-zinc-500">
          <p>Docs site built with zenblog</p>
        </div>
      </aside>
      <main className="w-full flex-grow overflow-auto border-x">
        {children}
      </main>
      <aside className="min-w-[16rem]">
        <div className="flex h-12 items-center justify-end gap-0.5 border-b px-2">
          <Button variant={"ghost"} size="icon">
            <Link href="https://github.com/jordienr/zenblog">
              <Github size={16} />
            </Link>
          </Button>
          <Button variant={"ghost"} size="icon">
            <Link href="https://x.com/zenbloghq">
              <Twitter size={16} />
            </Link>
          </Button>
          <Button asChild variant={"secondary"}>
            <Link href="/blogs">Dashboard</Link>
          </Button>
        </div>
        <div className="p-2">
          {/* <h2 className="text-sm font-medium text-zinc-500">On this page</h2> */}
          <ul className="mt-2">
            {/* <li># title 1</li>
            <li># title 2</li>
            <li># title 3</li>
            <li># title 4</li> */}
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default layout;
