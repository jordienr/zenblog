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
import { Toaster } from "sonner";
import { useState } from "react";
import AppChecks from "@/components/LoggedInUserChecks";
import { UserProvider } from "@/utils/supabase/browser";

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

  return (
    <div className={`${ibmPlexMono.variable} ${inter.variable}`}>
      <UserProvider>
        <PlausibleProvider domain="zendo.blog">
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
              <Component key={pathname} {...pageProps} />
              <Toaster />
            </Hydrate>
          </QueryClientProvider>
        </PlausibleProvider>
      </UserProvider>
    </div>
  );
}

export default MyApp;
