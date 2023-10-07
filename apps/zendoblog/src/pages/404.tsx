import AppLayout from "@/layouts/AppLayout";
// import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Custom404() {
  // const { isSignedIn } = useAuth();

  return (
    <AppLayout>
      <div className="mx-auto flex flex-col items-center justify-center p-12 text-center font-mono">
        <h1 className="text-4xl font-bold">404</h1>
        <div>
          <Image
            src="/static/screaming-cowboy-cat.png"
            alt="screaming cowboy cat"
            width={600}
            quality={100}
            height={400}
            className="mt-8 rounded-sm"
          />
        </div>

        {/* {isSignedIn && (
          <Link className="btn btn-primary mt-4" href="/blogs">
            Back to blogs
          </Link>
        )}
        {!isSignedIn && (
          <Link className="btn btn-primary mt-4" href="/">
            Back to home
          </Link>
        )} */}
      </div>
    </AppLayout>
  );
}
