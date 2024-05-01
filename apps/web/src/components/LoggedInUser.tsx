import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useUser } from "@/utils/supabase/browser";
import { PropsWithChildren } from "react";

export function LoggedInUser({ children }: PropsWithChildren) {
  const sb = getSupabaseBrowserClient();
  const user = useUser();

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
