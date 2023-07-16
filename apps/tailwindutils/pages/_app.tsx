import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>tailwindutils</title>
        <meta name="description" content="tailwindutils" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-dark.min.css"
        ></link>
      </Head>
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
