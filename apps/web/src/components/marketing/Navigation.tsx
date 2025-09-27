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
  ];

  const mobileLinks = [
    {
      label: "Home",
      href: "/",
    },
    ...links,
  ];

  return (
    <nav className="sticky top-0 z-20 mx-auto grid w-full max-w-5xl grid-cols-3 bg-white py-4 md:relative">
      <Link href="/">
        <ZendoLogo size={27} />
      </Link>

      <div className="flex items-center justify-center gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            className="hidden rounded-lg px-2 py-1 text-sm font-semibold hover:text-slate-800 md:block"
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2">
        <div className="hidden md:block">
          {user ? (
            <div className="ml-2 flex w-full justify-end">
              <Button asChild variant={"secondary"} size="default">
                <Link href="/blogs">Dashboard</Link>
              </Button>
            </div>
          ) : (
            <div className="ml-2 flex">
              <Button asChild variant={"ghost"} size="default">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild variant={"ghost"} size="default">
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
        <div className="md:hidden">
          <button
            className="rounded-lg p-1.5 hover:bg-zinc-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            <HiOutlineMenu size={24} />
          </button>
        </div>
      </div>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <div className="flex h-full flex-col items-center justify-center py-12">
            {mobileLinks.map((link) => (
              <Link
                key={link.href}
                className="rounded-lg px-4 py-4 text-xl font-medium tracking-tight text-slate-700 hover:text-slate-800"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex w-full flex-col gap-2 px-4">
              {user ? (
                <Button
                  className="w-full"
                  asChild
                  variant={"secondary"}
                  size="default"
                >
                  <Link href="/blogs">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button
                    className="w-full"
                    asChild
                    variant={"ghost"}
                    size="default"
                  >
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                  <Button
                    className="w-full"
                    asChild
                    variant={"ghost"}
                    size="default"
                  >
                    <Link href="/sign-up">Sign up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </nav>
  );
};

export default Navigation;
