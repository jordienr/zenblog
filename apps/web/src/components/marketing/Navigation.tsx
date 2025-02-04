"use client";
import React, { useState } from "react";
import { ZendoLogo } from "../ZendoLogo";
import Link from "next/link";
import { FaBars, FaTwitter } from "react-icons/fa";
import { Button } from "../ui/button";
import { useUser } from "@/utils/supabase/browser";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { Drawer, DrawerContent } from "../ui/drawer";

type Props = {};

const Navigation = (props: Props) => {
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "Docs",
      href: "/docs",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: <FaTwitter />,
      href: "https://twitter.com/zenbloghq",
      target: "_blank",
    },
  ];

  const mobileLinks = [
    {
      label: "Home",
      href: "/",
    },
    ...links,
  ];

  return (
    <nav className="sticky top-0 z-20 mx-auto flex w-full max-w-5xl items-center justify-between border-b bg-white px-6 py-4 md:relative md:border-none md:py-8">
      <Link href="/" className="">
        <ZendoLogo className="" size={32} />
      </Link>

      <div className="flex flex-grow items-center justify-end gap-1 font-medium text-zinc-500 md:justify-end">
        <div className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              target={link.target}
              className="rounded-lg px-2 py-1 hover:text-zinc-800"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {user ? (
          <div className="ml-2 flex">
            <Button asChild variant={"secondary"} size="default">
              <Link href="/blogs">Dashboard</Link>
            </Button>
          </div>
        ) : (
          <div className="ml-2 flex gap-2">
            <Button asChild variant={"ghost"} size="default">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild variant={"ghost"} size="default">
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        )}
        <div className="ml-2 md:hidden">
          <button
            className="rounded-lg p-2 hover:bg-zinc-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            <HiOutlineMenu size={24} />
          </button>
        </div>
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
            <div className="flex h-full flex-col items-center justify-center py-12">
              {mobileLinks.map((link) => (
                <Link
                  key={link.href}
                  target={link.target}
                  className="rounded-lg px-4 py-4 text-xl font-medium tracking-tight text-zinc-700 hover:text-zinc-800"
                  href={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  );
};

export default Navigation;
