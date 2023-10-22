import { useUser } from "@supabase/auth-helpers-react";
import { PropsWithChildren } from "react";

export function LoggedInUser({ children }: PropsWithChildren) {
  const user = useUser();

  if (!user?.id) {
    return null;
  }

  return <>{children}</>;
}
