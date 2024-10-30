"use client";
import React from "react";
import { ZendoLogo } from "../ZendoLogo";
import Link from "next/link";
import { FaTwitter } from "react-icons/fa";
import { Button } from "../ui/button";
import { useUser } from "@/utils/supabase/browser";

type Props = {};

const Navigation = (props: Props) => {
  const user = useUser();

  return (
    <div className="px-4">
      <nav className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between py-8">
        <Link href="/" className="">
          <ZendoLogo className="" size={31} />
        </Link>

        <div className="flex flex-grow items-center justify-end gap-1 font-medium text-zinc-500">
          <Link
            className="rounded-lg px-2 py-1 hover:text-zinc-800"
            href="/pricing"
          >
            Pricing
          </Link>
          <Link
            className="rounded-lg px-2 py-1 hover:text-zinc-800"
            href="/docs"
          >
            Docs
          </Link>
          <Link
            className="rounded-lg px-2 py-1 hover:text-zinc-800"
            href="/blog"
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

          {user ? (
            <div className="ml-2 flex">
              <Button asChild variant={"secondary"} size="default">
                <Link href="/blogs">Dashboard</Link>
              </Button>
            </div>
          ) : (
            <div className="ml-2 flex gap-2">
              <Button asChild variant={"ghost"}>
                <Link href="/sign-in">Login</Link>
              </Button>
              <Button asChild variant={"default"}>
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
