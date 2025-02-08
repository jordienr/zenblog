import UserButton from "@/components/UserButton";
import { ZendoLogo } from "@/components/ZendoLogo";
import Link from "next/link";
import { motion } from "framer-motion";
import Notifications from "@/components/Notifications";
import Feedback from "@/components/Feedback";
import Footer from "@/components/Footer";
import AppChecks from "@/components/LoggedInUserChecks";
import { Loader, Loader2 } from "lucide-react";
import { useUser } from "@/utils/supabase/browser";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBlogsQuery } from "@/queries/blogs";
import { cn } from "@/lib/utils";
import Head from "next/head";
import { useSubscriptionQuery } from "@/queries/subscription";
import { ZenblogToolbar } from "@/components/dev/zenblog-toolbar";
import { IS_DEV } from "@/lib/constants";
import { OnboardingDropdown } from "@/components/onboarding";

type Props = {
  children?: React.ReactNode;
  loading?: boolean;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  description?: string;
};
export default function AppLayout({
  children,
  loading = false,
  title,
  actions,
  description,
}: Props) {
  const { data: sub } = useSubscriptionQuery();
  const user = useUser();
  const router = useRouter();
  const { data: blogs, isLoading: blogsLoading } = useBlogsQuery({
    enabled: true,
  });

  useEffect(() => {
    if (!user && !loading && !IS_DEV) {
      console.log("User not found. Redirecting to sign-in page.");
      router.push("/sign-in");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  const selectedBlog = blogs?.find((blog) => blog.id === router.query.blogId);

  const isDev = IS_DEV;

  const BlogNavItems = [
    {
      label: "Posts",
      href: `/blogs/${selectedBlog?.id}/posts`,
    },
    {
      label: "Media",
      href: `/blogs/${selectedBlog?.id}/media`,
    },
    ...(isDev
      ? [
          {
            label: "Authors",
            href: `/blogs/${selectedBlog?.id}/authors`,
          },
        ]
      : []),
    {
      label: "Categories",
      href: `/blogs/${selectedBlog?.id}/categories`,
    },
    {
      label: "Tags",
      href: `/blogs/${selectedBlog?.id}/tags`,
    },
    {
      label: "Settings",
      href: `/blogs/${selectedBlog?.id}/settings`,
    },
    // {
    //   label: "Usage",
    //   href: `/blogs/${selectedBlog?.id}/usage`,
    // },
  ];

  return (
    <div
      className={`flex min-h-screen flex-col border-b bg-slate-50 font-sans`}
    >
      {IS_DEV && <ZenblogToolbar />}
      <Head>
        <title>Zenblog</title>
        <meta name="description" content="Simple, headless, blogging CMS." />
        <link rel="icon" href="/static/favicon.ico" />
        <meta property="og:title" content="Zenblog" />
        <meta
          property="og:description"
          content="Simple, headless, blogging CMS."
        />
        <meta property="og:image" content="/static/og.jpg" />
      </Head>
      <TooltipProvider>
        <AppChecks>
          <nav
            className={cn("mx-auto w-full bg-white", {
              "border-b shadow-sm": !selectedBlog,
            })}
          >
            <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-2">
              <div className="flex h-full items-center py-3">
                {!selectedBlog && (
                  <Link
                    tabIndex={-1}
                    href="/blogs"
                    className="flex items-center justify-center rounded-xl px-1 py-4 text-lg font-medium"
                  >
                    <ZendoLogo hideText />
                    <span className="ml-2">zenblog</span>
                  </Link>
                )}
                {selectedBlog && (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="flex items-center gap-2 rounded-lg py-1 pr-3 text-sm font-medium hover:bg-slate-50 focus-visible:ring-0"
                      disabled={blogsLoading}
                    >
                      <span className="mx-1 flex h-7 w-7 items-center justify-center rounded-full border bg-slate-50 text-lg">
                        {selectedBlog?.emoji}
                      </span>
                      {selectedBlog?.title}
                      {blogsLoading && (
                        <Loader2
                          className="animate-spin text-orange-500"
                          size={16}
                        />
                      )}
                      {sub?.plan === "hobby" && (
                        <Link
                          title="Upgrade to Pro"
                          href="/account"
                          className=" rounded-full p-1 text-center text-xs font-medium text-emerald-500"
                        >
                          Hobby
                        </Link>
                      )}
                      {sub?.plan === "pro" && (
                        <div className="rounded-full text-xs font-medium text-blue-500">
                          Pro
                        </div>
                      )}
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="start"
                      className="-ml-1 w-48 rounded-lg"
                    >
                      {blogs?.map((blog) => (
                        <DropdownMenuItem asChild key={blog.id}>
                          <Link
                            href={`/blogs/${blog.id}/posts`}
                            className="flex items-center gap-1 px-3"
                          >
                            <span className="mr-1 flex items-center text-lg">
                              {blog.emoji}
                            </span>
                            {blog.title}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem asChild>
                        <Link
                          href="/blogs"
                          className="flex items-center gap-1 px-3"
                        >
                          All blogs
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              <a
                className="
              sr-only px-4
              py-2 text-sm font-medium text-orange-600 hover:text-orange-700 focus:not-sr-only
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50
            "
                href="#main"
              >
                Skip to content
              </a>

              <div className="flex items-center gap-1 pr-2">
                <Link
                  title="API docs"
                  className="rounded-full px-3 py-4 text-sm font-medium text-slate-600 hover:text-orange-600"
                  href="/docs"
                >
                  Docs
                </Link>
                <Feedback />
                {/* <Notifications /> */}
                <OnboardingDropdown />
                <span className="ml-2">
                  <UserButton />
                </span>
              </div>
            </div>
          </nav>
          {selectedBlog && (
            <div className="border-b bg-white shadow-sm">
              <div className="mx-auto flex max-w-5xl items-center justify-between pr-4">
                <div className="flex max-w-5xl items-center px-2">
                  {BlogNavItems.map((item) => (
                    <NavItem
                      key={item.href}
                      href={item.href}
                      selected={item.href === router.asPath}
                    >
                      {item.label}
                    </NavItem>
                  ))}
                </div>
              </div>
            </div>
          )}
          {loading ? (
            <div className="flex h-[600px] items-center justify-center">
              <Loader2 className="animate-spin text-orange-500" size={32} />
            </div>
          ) : (
            <div className="">
              <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
                <div className="flex flex-col">
                  <SectionTitle>{title}</SectionTitle>
                  {description && (
                    <SectionDescription>{description}</SectionDescription>
                  )}
                </div>
                <SectionActions>{actions}</SectionActions>
              </div>

              <motion.main
                id="main"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mx-auto min-h-screen max-w-5xl px-3 pb-8"
              >
                {children}
              </motion.main>
            </div>
          )}
          <Footer />
        </AppChecks>
      </TooltipProvider>
    </div>
  );
}

function NavItem({
  children,
  href,
  selected,
}: {
  children: React.ReactNode;
  href: string;
  selected?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        `relative mb-2 flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-500 transition-all hover:bg-slate-100/70 hover:text-slate-800 md:px-2 md:py-1`,
        {
          "text-slate-950": selected,
          "after:absolute after:inset-x-0 after:bottom-[-9px] after:z-10 after:h-[2px] after:w-full after:rounded-full after:bg-orange-500 after:content-['']":
            selected,
        }
      )}
    >
      {children}
    </Link>
  );
}

export function Section({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border bg-white py-2 shadow-sm", className)}>
      {children}
    </div>
  );
}

export function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4">{children}</div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-medium">{children}</h2>;
}
export function SectionActions({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-2">{children}</div>;
}
export function SectionDescription({
  children,
}: {
  children: React.ReactNode;
}) {
  return <p className="text-sm text-slate-500">{children}</p>;
}
