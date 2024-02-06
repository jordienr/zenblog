import UserButton from "@/components/UserButton";
import ZendoLogo from "@/components/ZendoLogo";
import { Github, Twitter } from "lucide-react";
import Link from "next/link";

type Props = {
  children?: React.ReactNode;
  loading?: boolean;
};
export default function AppLayout({ children, loading }: Props) {
  // const { isSignedIn } = useAuth();

  return (
    <div
      className={`flex min-h-screen flex-col border-b bg-zinc-50 font-sans ${
        loading ? "overflow-hidden" : ""
      }`}
    >
      {loading && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <div className="animate-spin text-5xl">🍊</div>
        </div>
      )}

      <nav className="sticky top-0 mx-auto h-12 w-full max-w-5xl">
        <div className="mx-auto flex h-full items-center justify-between px-2">
          <div className="z-20 m-2 flex h-full items-center gap-2 rounded-full bg-slate-50">
            <Link href="/" className="rounded-md px-1 text-lg font-medium">
              <ZendoLogo />
            </Link>
            <Link
              href="/blogs"
              className="rounded-full px-3 py-1 text-sm font-medium text-slate-600 hover:bg-orange-50 hover:text-orange-600"
            >
              Blogs
            </Link>
          </div>
          <div>
            <UserButton />
          </div>
        </div>
      </nav>
      <div className="min-h-screen bg-slate-50 pb-24 shadow-md">{children}</div>
      <footer className="flex justify-between border-t bg-slate-100 p-8 font-mono text-slate-700">
        <ul>
          <li>thanks for checking out zenblog</li>
        </ul>
        <ul className="flex gap-4">
          <li>
            <Link href="https://github.com/jordienr/zenblog">
              <Github size="24" />
            </Link>
          </li>
          <li>
            <Link href="https://twitter.com/zenbloghq">
              <Twitter size="24" />
            </Link>
          </li>
        </ul>
      </footer>
    </div>
  );
}
