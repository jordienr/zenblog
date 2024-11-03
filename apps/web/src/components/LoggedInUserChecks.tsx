import { useSubscriptionQuery } from "@/queries/subscription";
import { Loader2 } from "lucide-react";
import React, { PropsWithChildren } from "react";

type Props = {};

export const GlobalAppLoading = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-zinc-50">
      <Loader2 className="animate-spin text-orange-500" size={32} />
    </div>
  );
};

const LoggedInUserChecks = (props: PropsWithChildren<Props>) => {
  const { data: subscription, isLoading } = useSubscriptionQuery();

  const validSubscriptionStatus = ["active", "trialing", "past_due"];
  const isValidSubscription =
    subscription?.status &&
    validSubscriptionStatus.includes(subscription.status);

  return <>{props.children}</>;
};

export default LoggedInUserChecks;
