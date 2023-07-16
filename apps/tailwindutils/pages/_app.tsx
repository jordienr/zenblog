import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <head>
        <title>tailwindutils</title>
        <meta name="description" content="tailwindutils" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <div className="min-h-screen bg-slate-50 p-8 font-mono text-slate-800 md:p-24">
        <Component {...pageProps} />
        <footer className="mt-24">
          <Link className="p-2" href="https://zendo.blog?ref=tailwindutils">
            Built with 🍊
          </Link>
        </footer>
      </div>
    </>
  );
}
