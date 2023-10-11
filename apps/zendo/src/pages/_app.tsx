import type { AppProps } from "next/app";
import { Inter, IBM_Plex_Mono, Archivo } from "next/font/google";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
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

// Fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
});

// Main Component
function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const [queryClient] = useState(() => new QueryClient());
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <div className={`${inter.variable} ${ibmPlexMono.variable}`}>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <PlausibleProvider domain="zendo.blog">
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
              <>
                <motion.div
                  key={pathname}
                  initial="pageInitial"
                  animate="pageAnimate"
                  exit={{ opacity: 0 }}
                  variants={{
                    pageInitial: {
                      opacity: 0,
                      y: -10,
                    },
                    pageAnimate: {
                      opacity: 1,
                      y: 0,
                    },
                  }}
                >
                  <Component key={pathname} {...pageProps} />
                </motion.div>

                <Toaster />
              </>
            </Hydrate>

            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </PlausibleProvider>
      </SessionContextProvider>
    </div>
  );
}

export default MyApp;
