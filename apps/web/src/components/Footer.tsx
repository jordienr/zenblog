import React from "react";
import { ZendoLogo } from "./ZendoLogo";
import Link from "next/link";
import { IoLogoGithub, IoLogoTwitter } from "react-icons/io5";

type Props = {};

const Footer = (props: Props) => {
  const navLinks = [
    {
      label: "Contact",
      href: "/contact",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "Terms",
      href: "/terms",
    },
    {
      label: "Privacy",
      href: "/privacy",
    },
  ];

  const navLinksLeft = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "Docs",
      href: "/docs",
    },
  ];

  return (
    <footer className="mt-6 border-t bg-slate-50/80 p-6 text-slate-700 md:p-12">
      <div className="mx-auto flex max-w-3xl justify-between text-sm font-medium">
        <div>
          <ZendoLogo />
          <ul className="mt-4 flex gap-4 text-slate-400">
            <li>
              <Link
                className="flex items-center gap-1 px-1"
                href="https://twitter.com/zenbloghq"
              >
                <IoLogoTwitter size="18" />
                Twitter
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex gap-12 text-right">
          <ul className="space-y-2">
            {navLinksLeft.map((link) => {
              return (
                <li key={link.href}>
                  <Link className="hover:underline" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ul className="space-y-2">
            {navLinks.map((link) => {
              return (
                <li key={link.href}>
                  <Link className="hover:underline" href={link.href}>
                    {link.label}
                  </Link>
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
