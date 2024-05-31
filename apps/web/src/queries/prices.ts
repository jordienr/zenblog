import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import Stripe from "stripe";

const PRICES_KEYS = ["prices"];

export function usePricesQuery() {
  const sb = getSupabaseBrowserClient();

  return useQuery({
    queryKey: PRICES_KEYS,
    queryFn: async () => {
      const { data, error } = await sb.from("prices").select("*");

      if (error) {
        console.error(error);
        throw error;
      }

      type DataItemType = (typeof data)[0] & { price: Stripe.Price };

      return data as DataItemType[];
    },
  });
}
