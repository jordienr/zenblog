import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/AppLayout";
import { useSubscriptionQuery } from "@/queries/subscription";
import { useMutation } from "@tanstack/react-query";
import React from "react";

type Props = {};

const AccountPage = (props: Props) => {
  const [loading, setLoading] = React.useState(false);

  async function onSubscribeClick() {
    setLoading(true);
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plan: "pro" }),
    });

    const json = await response.json();

    if (json.error) {
      console.error(json.error);
      return;
    }

    console.log(json);
    if (json.url) {
      window.location.href = json.url;
    } else {
      console.error("Error creating session");
    }

    setLoading(false);
  }

  async function onManageSubscriptionClick() {
    setLoading(true);
    const response = await fetch("/api/customer-portal", {
      method: "POST",
    });

    const json = await response.json();

    if (json.error) {
      console.error(json.error);
      return;
    }

    if (json.session) {
      window.location.href = json.session;
    } else {
      console.error("Error creating session");
    }

    setLoading(false);
  }

  const subscription = useSubscriptionQuery();

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-xl font-medium">Account settings</h1>
        <section className="my-4 rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-medium">Subscription details</h2>
          {subscription.isLoading ? (
            <></>
          ) : (
            <p className="mt-4">
              Subscription status:{" "}
              {subscription.data?.status === "active" ? (
                <span className="rounded-md bg-emerald-100 px-3 py-1 font-mono text-emerald-700">
                  {subscription.data?.status}
                </span>
              ) : (
                <span>
                  <span className="rounded-md bg-zinc-100 px-3 py-1 font-mono">
                    {subscription.data?.status}
                  </span>
                </span>
              )}
            </p>
          )}
          <div className="mt-8 flex gap-3">
            {loading ? (
              <pre>Loading...</pre>
            ) : (
              <>
                {subscription.data?.status !== "active" ? (
                  <Button onClick={onSubscribeClick}>
                    Subcribe to Pro plan
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={onManageSubscriptionClick}
                  >
                    Manage subscription
                  </Button>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default AccountPage;
