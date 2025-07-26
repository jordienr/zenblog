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
import { useState } from "react";
import { UserProvider } from "@/utils/supabase/browser";
import { trpc } from "@/trpc/utils";

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

  return (
    <div className={`${inter.variable}`}>
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
    </div>
  );
}

export default trpc.withTRPC(MyApp);
