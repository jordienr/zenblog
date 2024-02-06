import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect } from "react";

export default function SignOut() {
  const supa = useSupabaseClient();

  useEffect(() => {
    supa.auth.signOut().then((res) => {
      console.log("Sign out: ", res);

      window.location.pathname = "/";
    });
  }, [supa]);

  return <>Signing out...</>;
}
