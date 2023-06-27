import { BlogSelector } from "@/components/Blogs/BlogSelector";
import ZendoLogo from "@/components/ZendoLogo";
import { useAppStore } from "@/store/app";
import { UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";

type Props = {
  children?: React.ReactNode;
  loading?: boolean;
};
export default function AppLayout({ children, loading }: Props) {
  const { isSignedIn } = useAuth();

  return (
    <div
      className={`bg-grid-slate-200/50 min-h-screen border-b bg-slate-100 ${
        loading ? "overflow-hidden" : ""
      }`}
    >
      {loading && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <div className="animate-spin text-5xl">🍊</div>
        </div>
      )}

      <nav className="bg-gradient-to-b from-white to-transparent">
        <div className="mx-auto flex max-w-5xl justify-between p-3">
          <div className="flex items-center gap-2">
            <Link href="/" className="rounded-md px-1 text-lg font-medium">
              <ZendoLogo />
            </Link>
            {isSignedIn && <BlogSelector />}
          </div>

          <UserButton />
        </div>
      </nav>
      <div className="min-h-[640px]">{children}</div>
      <footer>
        <div className=" mt-24 bg-gradient-to-b from-transparent to-white pb-40 pt-24 text-center font-mono text-slate-800">
          <span className="text-slate-600">thanks for using </span>
          <ZendoLogo />
        </div>
      </footer>
    </div>
  );
}
