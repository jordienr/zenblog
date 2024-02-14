import UserButton from "@/components/UserButton";
import ZendoLogo from "@/components/ZendoLogo";
import { Github, Twitter } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Notifications from "@/components/Notifications";
import Feedback from "@/components/Feedback";
import { IoLogoGithub, IoLogoTwitter } from "react-icons/io5";
import Footer from "@/components/Footer";
import { useIsSubscribed, useSubscriptionQuery } from "@/queries/subscription";

type Props = {
  children?: React.ReactNode;
};
export default function AppLayout({ children }: Props) {
  const isSubscribed = useIsSubscribed();
  return (
    <div className={`flex min-h-screen flex-col border-b bg-zinc-50 font-sans`}>
      <nav className="sticky top-0 z-20 mx-auto w-full max-w-5xl border-b bg-zinc-50">
        <div className="mx-auto flex h-full items-center justify-between p-4">
          <div className="z-20  flex h-full items-center gap-2">
            <Link href="/blogs" className="rounded-md px-1 text-lg font-medium">
              <ZendoLogo />
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <Feedback />
            <Link
              className="rounded-full px-3 py-1 text-sm font-medium text-slate-600 hover:bg-orange-50 hover:text-orange-600"
              href="/docs/getting-started"
            >
              Docs
            </Link>
            <Notifications />
            <span className="ml-2">
              <UserButton />
            </span>
          </div>
        </div>
        {!isSubscribed && (
          <div className="bg-red-500">
            <div className="mx-auto max-w-5xl p-4 text-center font-medium text-white">
              <p>
                You are not subscribed to a plan. Please{" "}
                <Link className="underline" href="/account">
                  subscribe to a plan
                </Link>{" "}
                to keep using Zenblog.
              </p>
            </div>
          </div>
        )}
      </nav>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-zinc-50 pb-24"
      >
        {children}
      </motion.div>
      <Footer />
    </div>
  );
}
