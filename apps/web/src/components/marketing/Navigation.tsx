"use client";
import React from "react";
import ZendoLogo from "../ZendoLogo";
import Link from "next/link";
import { FaTwitter } from "react-icons/fa";
import { Button } from "../ui/button";
import { useUser } from "@/utils/supabase/browser";

type Props = {};

const Navigation = (props: Props) => {
  const user = useUser();

  return (
    <nav className="flex items-center justify-between p-3">
      <div className="flex-grow cursor-default">
        <Link href="/">
          <ZendoLogo />
        </Link>
      </div>

      <div className="flex flex-grow items-center justify-end gap-4 font-medium text-zinc-600">
        <Link href="/blog">Blog</Link>

        <Link
          className="rounded-full px-3 py-1.5 hover:text-zinc-800"
          href="/docs"
        >
          Docs
        </Link>
        <Link
          target="_blank"
          href="https://twitter.com/zenbloghq"
          className="flex items-center justify-center rounded-full p-2 text-lg text-blue-500 transition-all hover:bg-blue-100"
          title="Follow us on Twitter"
          aria-label="Follow us on Twitter"
        >
          <FaTwitter size="18" />
        </Link>

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
      </div>
    </nav>
  );
};

export default Navigation;
