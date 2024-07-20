import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useUser } from "@/utils/supabase/browser";
import { PropsWithChildren } from "react";

export function LoggedInUser({ children }: PropsWithChildren) {
  const sb = createSupabaseBrowserClient();
  const user = useUser();

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
