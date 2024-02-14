import type { AppProps } from "next/app";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import PlausibleProvider from "next-plausible";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import AppChecks from "@/components/AppChecks";

// Fonts
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
});

// Main Component
function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const [queryClient] = useState(() => new QueryClient());
  const [supabaseClient] = useState(() =>
    createPagesBrowserClient({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    })
  );

  return (
    <div className={`${ibmPlexMono.variable} ${inter.variable}`}>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <PlausibleProvider domain="zendo.blog">
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
              <AppChecks>
                <Component key={pathname} {...pageProps} />
                <Toaster />
              </AppChecks>
            </Hydrate>

            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          </QueryClientProvider>
        </PlausibleProvider>
      </SessionContextProvider>
    </div>
  );
}

export default MyApp;
