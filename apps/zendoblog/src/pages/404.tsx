import AppLayout from "@/layouts/AppLayout";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

export default function Custom404() {
  const { isSignedIn } = useAuth();

  return (
    <AppLayout>
      <div className="mx-auto max-w-md p-12 font-mono">
        <h1 className="text-4xl font-bold">404</h1>
        {isSignedIn && (
          <Link className="btn btn-primary mt-4" href="/blogs">
            Back to blogs
          </Link>
        )}
        {!isSignedIn && (
          <Link className="btn btn-primary mt-4" href="/">
            Back to home
          </Link>
        )}
      </div>
    </AppLayout>
  );
}
