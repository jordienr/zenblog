import { useEffect, useState } from "react";
import { AuthError, AuthUser, User } from "@supabase/supabase-js";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

type UseAuthStatus = {
  loading: boolean;
  user: User | null;
  error: AuthError | null;
};

export function useAuth() {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    supabaseClient.auth.getUser().then(({ data, error }) => {
      if (data) {
        setIsSignedIn(true);
        setUser(data.user);
      } else {
        setIsSignedIn(false);
        setUser(null);
      }
    });

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          setIsSignedIn(true);
        }
        if (event === "SIGNED_OUT") {
          setIsSignedIn(false);
          setUser(null);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return {
    auth: supabaseClient.auth,
    isSignedIn,
  };
}
