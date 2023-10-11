import { BlogSelector } from "@/components/Blogs/BlogSelector";
import ZendoLogo from "@/components/ZendoLogo";
import { useAppStore } from "@/store/app";
import { Github, Twitter } from "lucide-react";
// import { UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";

type Props = {
  children?: React.ReactNode;
  loading?: boolean;
};
export default function AppLayout({ children, loading }: Props) {
  // const { isSignedIn } = useAuth();

  return (
    <div
      className={`flex min-h-screen flex-col border-b bg-white ${
        loading ? "overflow-hidden" : ""
      }`}
    >
      {loading && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <div className="animate-spin text-5xl">🍊</div>
        </div>
      )}

      <nav className="sticky top-0 h-12 bg-white shadow-sm">
        <div className="mx-auto flex h-full items-center justify-between px-2">
          <div className="flex h-full items-center gap-2">
            <Link href="/" className="rounded-md px-1 text-lg font-medium">
              <ZendoLogo />
            </Link>
            <Link
              href="/blogs"
              className="flex h-full items-center border-x border-transparent px-2 text-slate-700 transition-all hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
            >
              Blogs
            </Link>
          </div>

          {/* <UserButton /> */}
        </div>
      </nav>
      <div className="min-h-screen bg-slate-50 pb-24 shadow-md">{children}</div>
      <footer className="flex justify-between border-t bg-slate-100 p-8 font-mono text-slate-700">
        <ul>
          <li>Thanks for checking out Zendo</li>
        </ul>
        <ul className="flex gap-2">
          <li>
            <Link href="https://github.com/jordienr/zendo">
              <Github size="24" />
            </Link>
          </li>
          <li>
            <Link href="https://twitter.com/tryzendo">
              <Twitter size="24" />
            </Link>
          </li>
        </ul>
      </footer>
    </div>
  );
}
