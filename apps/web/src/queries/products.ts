import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import Stripe from "stripe";

export function useProductsQuery() {
  const sb = createSupabaseBrowserClient();

  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await sb.from("products").select("*");

      if (error) {
        console.error(error);
        throw error;
      }

      type DataItemType = (typeof data)[0] & { product: Stripe.Product };

      return data as DataItemType[];
    },
  });
}
