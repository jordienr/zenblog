import UserButton from "@/components/UserButton";
import { ZendoLogo } from "@/components/ZendoLogo";
import Link from "next/link";
import { motion } from "framer-motion";
import Notifications from "@/components/Notifications";
import Feedback from "@/components/Feedback";
import Footer from "@/components/Footer";
import { usePlan } from "@/queries/subscription";
import AppChecks from "@/components/LoggedInUserChecks";
import { Loader } from "lucide-react";
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

type Props = {
  children?: React.ReactNode;
  loading?: boolean;
};
export default function AppLayout({ children, loading = false }: Props) {
  const plan = usePlan();
  const user = useUser();
  const router = useRouter();
  const { data: blogs, isLoading: blogsLoading } = useBlogsQuery({
    enabled: true,
  });

  useEffect(() => {
    if (!user && !loading) {
      console.log("User not found. Redirecting to sign-in page.");
      router.push("/sign-in");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  const selectedBlog = blogs?.find((blog) => blog.id === router.query.blogId);

  return (
    <div className={`flex min-h-screen flex-col border-b bg-zinc-50 font-sans`}>
      <TooltipProvider>
        <AppChecks>
          <nav className="sticky top-0 z-20 mx-auto w-full max-w-5xl bg-zinc-50">
            <div className="mx-auto flex h-full items-center justify-between px-4">
              <div className="z-20  flex h-full items-center gap-2">
                <Link
                  tabIndex={-1}
                  href="/blogs"
                  className="flex items-center justify-center rounded-xl py-4 text-lg font-medium"
                >
                  <ZendoLogo hideText />
                </Link>
                {selectedBlog && (
                  <DropdownMenu>
                    <div className="flex items-center gap-2">
                      <DropdownMenuTrigger
                        className="ml-6 flex items-center gap-2 rounded-lg border bg-white px-2 py-1 text-xs font-medium focus-visible:ring-0"
                        disabled={blogsLoading}
                      >
                        <span className="mx-1 -mt-1 flex items-center text-lg">
                          {selectedBlog?.emoji}
                        </span>
                        {selectedBlog?.title}
                        {blogsLoading ? (
                          <Loader
                            className="animate-spin text-orange-500"
                            size={16}
                          />
                        ) : (
                          <div className="rounded-full p-1 px-2 text-xs font-medium text-blue-500">
                            Pro
                          </div>
                        )}
                        {plan === "free" && (
                          <Link
                            title="Upgrade to Pro"
                            href="/account"
                            className=" rounded-full
                 bg-emerald-100 p-1
                px-2 text-center text-xs font-medium text-emerald-600"
                          >
                            Free
                          </Link>
                        )}
                      </DropdownMenuTrigger>
                    </div>
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
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              <a
                className="
              sr-only px-4
              py-2 text-sm font-medium text-orange-600 hover:text-orange-700 focus:not-sr-only
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50
            "
                href="#main"
              >
                Skip to content
              </a>

              <div className="flex items-center gap-1">
                <Feedback />
                {/* <Link
                className="rounded-full px-3 py-4 text-sm font-medium text-slate-600 hover:text-orange-600"
                href="/docs/getting-started"
              >
                Docs
              </Link> */}
                <Notifications />
                <span className="ml-2">
                  <UserButton />
                </span>
              </div>
            </div>
          </nav>
          {loading ? (
            <div className="flex h-[600px] items-center justify-center">
              <Loader className="animate-spin text-orange-500" size={32} />
            </div>
          ) : (
            <motion.main
              id="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="min-h-screen pb-24"
            >
              {children}
            </motion.main>
          )}
          <Footer />
        </AppChecks>
      </TooltipProvider>
    </div>
  );
}
