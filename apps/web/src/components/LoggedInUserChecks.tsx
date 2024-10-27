import { SubscribeSection } from "@/pages/account";
import { useSubscriptionQuery } from "@/queries/subscription";
import { Loader } from "lucide-react";
import Link from "next/link";
import React, { PropsWithChildren, useEffect } from "react";

type Props = {};

export const GlobalAppLoading = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-zinc-50">
      <Loader className="animate-spin text-orange-500" size={32} />
    </div>
  );
};

const LoggedInUserChecks = (props: PropsWithChildren<Props>) => {
  const { data: subscription, isLoading } = useSubscriptionQuery();

  const validSubscriptionStatus = ["active", "trialing", "past_due"];
  const isValidSubscription =
    subscription?.status &&
    validSubscriptionStatus.includes(subscription.status);

  if (!isLoading && !isValidSubscription) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-zinc-50">
        <div className="max-w-xl">
          <SubscribeSection />
        </div>
        <div className="mt-4">
          <Link href="/sign-out" className="text-slate-500 underline">
            Sign out
          </Link>
        </div>
      </div>
    );
  }

  return <>{props.children}</>;
};

export default LoggedInUserChecks;
