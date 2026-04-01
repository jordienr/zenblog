"use client";
import { ZendoLogo } from "@/components/ZendoLogo";
import Link from "next/link";
import { SidebarLink, SidebarTitle } from "../ui/sidebar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useState } from "react";
import { MenuIcon } from "lucide-react";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const Links = () => (
    <div className="flex flex-col gap-px">
      <SidebarTitle>Docs</SidebarTitle>
      <SidebarLink href="/docs/getting-started">Getting Started</SidebarLink>
      <SidebarLink href="/docs/typescript">TypeScript</SidebarLink>
      <SidebarLink href="/docs/ai-rules">AI Rules</SidebarLink>
      {/* <SidebarLink href="/docs/fetching-posts">Fetching posts</SidebarLink>
      <SidebarLink href="/docs/fetching-a-post">Fetching a post</SidebarLink>
      <SidebarLink href="/docs/rendering-a-post">Rendering a post</SidebarLink>
      <SidebarLink href="/docs/fetching-categories">
        Fetching categories
      </SidebarLink> */}
      <SidebarTitle>Guides</SidebarTitle>
      {/* <SidebarLink href="/docs/typescript">TypeScript client</SidebarLink> */}
      <SidebarLink href="/docs/nextjs">Next.js</SidebarLink>
      <SidebarTitle>API Reference</SidebarTitle>
      <SidebarLink href="/api/public/docs">
        API Documentation
      </SidebarLink>
    </div>
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="">
      <nav className="sticky top-0 z-20 border-b bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between p-4">
          <div className="mx-auto flex w-full max-w-7xl items-center gap-4">
            <h2 className="text-lg font-semibold">
              <Link href="/docs">
                <ZendoLogo />
              </Link>
            </h2>
            <Link
              title="homepage"
              href="/"
              className="text-sm font-medium text-slate-800 hover:text-orange-500"
            >
              Home
            </Link>
            <Link
              title="blog"
              href="/blog"
              className="text-sm font-medium text-slate-800 hover:text-orange-500"
            >
              Blog
            </Link>
          </div>
          <button
            className="p-2 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon />
          </button>
        </div>
      </nav>
      <Drawer open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <DrawerContent className="px-6 pb-8">
          <DrawerHeader>
            <DrawerTitle>Docs</DrawerTitle>
          </DrawerHeader>
          <Links />
        </DrawerContent>
      </Drawer>
      <div className="relative mx-auto flex h-full w-full max-w-7xl">
        <div className="hidden md:block">
          <div className="sticky top-[60px]  flex min-w-[240px] flex-col px-4">
            <Links />
          </div>
        </div>

        <main className="mt-6 w-full max-w-full">{children}</main>
      </div>
      <footer className="mt-12 border-t p-8 text-center text-sm text-slate-400">
        <p>Now go ship something cool</p>
      </footer>
    </div>
  );
}
