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
      className={`min-h-screen border-b bg-slate-100 bg-grid-slate-200/50 ${
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
            {isSignedIn && (
              <Link
                href="/blogs"
                className="rounded-md px-2 py-1 text-slate-600 transition-all hover:bg-orange-200/30 hover:text-orange-500"
              >
                Blogs
              </Link>
            )}
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
