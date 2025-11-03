import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import PlausibleProvider from "next-plausible";
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import { UserProvider } from "@/utils/supabase/browser";
import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";

// Fonts
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

// Main Component
function MyApp({ Component, pageProps }: AppProps) {
  const { pathname, isReady } = useRouter();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: "https://eu.i.posthog.com",
      person_profiles: "always",
      defaults: "2025-05-24",
      // Enable debug mode in development
      loaded: (posthog) => {
        if (process.env.NODE_ENV === "development") posthog.debug();
      },
    });
    console.log("PostHog initialized", posthog);
  }, []);

  return (
    <div className={`${inter.variable}`}>
      <PostHogProvider client={posthog}>
        <UserProvider>
          <PlausibleProvider domain="zenblog.com">
            <QueryClientProvider client={queryClient}>
              <HydrationBoundary state={pageProps.dehydratedState}>
                <Component key={pathname} {...pageProps} />
                <Toaster
                  position="bottom-center"
                  toastOptions={{
                    style: {
                      borderRadius: "12px",
                      backgroundColor: "#333333",
                      color: "white",
                      padding: "10px 12px",
                      border: "none",
                    },
                  }}
                />
              </HydrationBoundary>
            </QueryClientProvider>
          </PlausibleProvider>
        </UserProvider>
      </PostHogProvider>
    </div>
  );
}

export default MyApp;
