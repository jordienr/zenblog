import Spinner from "@/components/Spinner";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useEffect } from "react";

export default function SignOut() {
  const supa = getSupabaseBrowserClient();

  useEffect(() => {
    supa.auth.signOut().then((res) => {
      console.log("Sign out: ", res);
      if (res.error) {
        console.error(res.error);
        alert("An error occurred while signing out. Please try again.");
        return;
      }

      window.location.pathname = "/";
    });
  }, [supa]);

  return (
    <div className="p-24">
      <Spinner />
    </div>
  );
}
