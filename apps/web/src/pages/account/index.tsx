import { IsDevMode } from "@/components/is-dev-mode";
import { Button } from "@/components/ui/button";
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";
import AppLayout from "@/layouts/AppLayout";
import { usePricesQuery } from "@/queries/prices";
import { useProductsQuery } from "@/queries/products";
import { useSubscriptionQuery } from "@/queries/subscription";
import { useUser } from "@/utils/supabase/browser";
import { Landmark, Loader } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {};

export const SubscribeSection = () => {
  const products = useProductsQuery();
  const prices = usePricesQuery();
  const [interval, setInterval] = React.useState<"year" | "month">("year");
  const [isLoading, setIsLoading] = useState(false);

  function openCheckoutPage(product_id: string) {
    setIsLoading(true);

    const pricesForProduct = prices.data?.filter(
      (p) => p.price.product === product_id
    );
    if (!pricesForProduct) {
      setIsLoading(false);
      return;
    }

    const price = pricesForProduct.find(
      (p) => p.price.recurring?.interval === interval
    );

    if (!price) {
      setIsLoading(false);
      return;
    }

    const res = fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_id: price.price.id,
      }),
    });

    res.then(async (res) => {
      const json = await res.json();
      if (json.error) {
        console.error(json.error);
        setIsLoading(false);
        return;
      }

      if (json.url) {
        window.location.href = json.url;
      } else {
        setIsLoading(false);
        toast.error("Error creating session");
        console.error("Error creating session");
      }
    });
  }

  const loading = products.isLoading || prices.isLoading || isLoading;

  function formatAmount(price: number) {
    if (!price) {
      return "";
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price / 100);
  }

  function getAmountFromProduct(prodId: string) {
    const price = prices.data?.find(
      (p) =>
        p.price.product === prodId && p.price.recurring?.interval === interval
    );
    if (!price) {
      return;
    }
    const amount = price.price.unit_amount;
    if (!amount) {
      return;
    }
    return formatAmount(amount);
  }

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center py-24">
        <Loader className="animate-spin text-orange-500" size={24} />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-medium">Pricing</h2>
      <p className="font-mono text-sm text-zinc-500">Cancel anytime</p>

      <IsDevMode>
        <pre>
          Run this to sync stripe with the local database:
          <br />
          `npm run stripe:webhook` // listen for stripe events
          <br />
          `npm run stripe:sync` // sync stripe products and prices
          <br />
          Then refresh the page and subscribe to a plan
        </pre>
      </IsDevMode>

      <Tabs
        className="mt-4"
        value={interval}
        onValueChange={setInterval as any}
      >
        <TabsList>
          <TabsTrigger value="year">
            Yearly
            <span className="ml-2 rounded-full bg-orange-100 px-1.5 py-0.5 text-xs text-orange-600">
              Best
            </span>
          </TabsTrigger>
          <TabsTrigger value="month">Monthly</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4 ">
        {products.data?.map((product) => (
          <div
            key={product.id}
            className="relative max-w-sm rounded-xl border border-b-2 border-orange-500 p-3"
          >
            {interval === "year" && (
              <span className="absolute -top-3 right-4 rounded-full border border-b-2 border-orange-500 bg-orange-100 px-2 py-1 text-xs font-medium text-orange-600">
                2 Months Free!
              </span>
            )}
            <h3 className="text-lg font-semibold">{product.product.name}</h3>
            <p className="text-zinc-500">{product.product.description}</p>
            <ul>
              {product.product.features.map((feat, featIdx) => (
                <li key={product.id + "-feat-" + featIdx}>{feat.name}</li>
              ))}
            </ul>

            <h4 className="mt-4 text-sm font-bold text-zinc-500">Price</h4>
            <div className="text-xl font-semibold">
              {getAmountFromProduct(product.product.id)}
              <span className="text-sm text-zinc-400">/{interval}</span>
            </div>

            <div className="mt-4 flex">
              <Button onClick={() => openCheckoutPage(product.product.id)}>
                Subscribe to {product.product.name}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AccountPage = (props: Props) => {
  const [loading, setLoading] = React.useState(false);
  const user = useUser();

  async function onManageSubscriptionClick() {
    setLoading(true);
    const response = await fetch("/api/customer-portal", {
      method: "POST",
    });

    const json = await response.json();

    if (json.error) {
      toast.error(json.error);
      console.error(json.error);
      setLoading(false);
      return;
    }

    if (json.session) {
      window.location.href = json.session;
    } else {
      toast.error(json.error);
      console.error("Error creating session");
      setLoading(false);
    }
  }

  const subscription = useSubscriptionQuery();

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString();
  }

  return (
    <AppLayout loading={loading || subscription.isLoading}>
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-xl font-medium">Account settings</h1>

        <section className="my-4 rounded-xl border border-b-2 bg-white p-4">
          <h2 className="text-lg font-medium">Account</h2>
          <div className="mt-4 max-w-lg divide-y *:grid *:grid-cols-2 *:p-2">
            <div>
              <div>Email</div>
              <div className="font-mono">{user?.email}</div>
            </div>
            <div>
              <div>Created at</div>
              <div className="font-mono">
                {formatDate(user?.created_at || "")}
              </div>
            </div>
          </div>

          {/* <h3 className="mt-8 font-medium">Teams</h3>
          <ul>
            {teams.data?.map((team) => (
              <li key={team.id}>{team.name}</li>
            ))}
          </ul> */}
        </section>
        <section className="my-4 rounded-xl border border-b-2 bg-white p-4">
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
                    {subscription.data?.status || "Not found"}
                  </span>
                </span>
              )}
            </p>
          )}

          <div className="">
            {loading ? (
              <pre>Loading...</pre>
            ) : (
              <>
                {subscription.data?.status !== "active" ? (
                  <>
                    <hr className="my-8 max-w-lg" />
                    <SubscribeSection />
                  </>
                ) : (
                  <>
                    {/* <pre>{JSON.stringify(subscription.data, null, 2)}</pre> */}
                  </>
                )}
              </>
            )}
          </div>

          <hr className="my-6 max-w-lg" />

          <h3 className="text-lg font-medium">Manage your subscription</h3>
          <p className="text-zinc-500">
            Check invoices, billing and payment information.
          </p>
          <Button
            className="mt-4"
            variant="secondary"
            onClick={onManageSubscriptionClick}
          >
            <Landmark />
            Manage subscription
          </Button>
        </section>
      </div>
    </AppLayout>
  );
};

export default AccountPage;
