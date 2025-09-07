import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useUser } from "@/utils/supabase/browser";
import { useQuery } from "@tanstack/react-query";
import { Database } from "@/types/supabase";

export type UserRole = Database["public"]["Enums"]["blog_member_role"];

export const USER_ROLES = ["owner", "admin", "editor", "viewer"] as const;

export function useUserRole(blogId: string) {
  const sb = createSupabaseBrowserClient();
  const user = useUser();

  return useQuery({
    queryKey: ["user-role", blogId],
    queryFn: async () => {
      const { data, error } = await sb
        .from("blog_members")
        .select("role")
        .eq("blog_id", blogId)
        .eq("user_id", user?.id || "")
        .single();
      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
      return data?.role;
    },
    enabled: !!user?.id && !!blogId,
    retry: false,
  });
}
