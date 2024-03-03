import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useEffect } from "react";

export default function SignOut() {
  const supa = getSupabaseBrowserClient();

  useEffect(() => {
    supa.auth.signOut().then((res) => {
      console.log("Sign out: ", res);

      window.location.pathname = "/";
    });
  }, [supa]);

  return <></>;
}
