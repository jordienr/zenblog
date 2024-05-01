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
    <div className={`${ibmPlexMono.variable} ${inter.variable} font-sans`}>
      <UserProvider>
        <PlausibleProvider domain="zenblog.com">
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
              <Component key={pathname} {...pageProps} />
              <Toaster
                position="bottom-center"
                toastOptions={{
                  // style: {
                  //   background: "red",
                  //   borderRadius: "12px",
                  //   backgroundColor: "#333333",
                  //   color: "white",
                  //   padding: "10px 12px",
                  //   border: "none",
                  // },
                  unstyled: true,
                  classNames: {
                    toast:
                      "px-3 py-1.5 rounded-xl text-white flex gap-1 items-center justify-center",
                    title: "font-medium",
                    icon: "flex items-center justify-center",
                    error: "bg-red-500",
                    success: "bg-zinc-800",
                    info: "bg-blue-500",
                    warning: "bg-yellow-600",
                  },
                }}
              />
            </Hydrate>
          </QueryClientProvider>
        </PlausibleProvider>
      </UserProvider>
    </div>
  );
}

export default MyApp;
