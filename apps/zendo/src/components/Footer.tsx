import React from "react";
import ZendoLogo from "./ZendoLogo";
import Link from "next/link";
import { IoLogoGithub, IoLogoTwitter } from "react-icons/io5";

type Props = {};

const Footer = (props: Props) => {
  const navLinks = [
    {
      label: "Home",
      href: "/",
    },
    // {
    //   label: "Blog",
    //   href: "/blog",
    // },
    // {
    //   label: "Docs",
    //   href: "/docs/getting-started",
    // },
    // {
    //   label: "Pricing",
    //   href: "/pricing",
    // },
  ];

  return (
    <footer className="mt-6 border-t bg-zinc-100 p-12 text-xs text-zinc-700">
      <div className="mx-auto flex max-w-3xl justify-between">
        <div>
          <ZendoLogo />
          <p className="text-zinc-500">thanks for trying zenblog</p>
          <ul className="mt-4 flex gap-4 text-zinc-400">
            <li>
              <Link href="https://github.com/jordienr/zenblog">
                <IoLogoGithub size="24" />
              </Link>
            </li>
            <li>
              <Link href="https://twitter.com/zenbloghq">
                <IoLogoTwitter size="24" />
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-right">
          <ul className="space-y-2">
            {navLinks.map((link) => {
              return (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
