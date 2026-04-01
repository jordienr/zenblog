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
import { toast, Toaster } from "sonner";
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
  const router = useRouter();
  const { pathname, isReady } = router;
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

  useEffect(() => {
    if (!isReady) return;

    const { error, error_code: errorCode, error_description: errorDescription } =
      router.query;

    if (
      typeof error !== "string" ||
      typeof errorCode !== "string" ||
      typeof errorDescription !== "string"
    ) {
      return;
    }

    let message = decodeURIComponent(errorDescription.replace(/\+/g, " "));

    if (errorCode === "otp_expired") {
      message =
        "This confirmation link has expired. Please request a new one and try again.";
    } else if (error === "access_denied" && !message) {
      message = "This sign-in link is invalid or has expired.";
    }

    toast.error(message);

    const nextQuery = { ...router.query };
    delete nextQuery.error;
    delete nextQuery.error_code;
    delete nextQuery.error_description;

    void router.replace(
      {
        pathname: router.pathname,
        query: nextQuery,
      },
      undefined,
      { shallow: true }
    );
  }, [isReady, router]);

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
