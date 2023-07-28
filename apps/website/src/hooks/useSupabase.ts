import { useAuth } from "@clerk/nextjs";
import { getClient as getSupaClient } from "@/lib/supabase";

export function useSupabase() {
  const auth = useAuth();

  async function getToken() {
    const token = await auth.getToken({ template: "supabase" });

    return token;
  }

  async function getClient() {
    const token = await getToken();

    if (!token) throw new Error("No token found");

    const supabase = getSupaClient(token);

    return supabase;
  }

  return {
    getToken,
    getClient,
  };
}
