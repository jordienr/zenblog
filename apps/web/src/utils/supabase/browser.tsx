import { createSupabaseBrowserClient } from "@/lib/supabase";
import { posthogIdentify, posthogReset } from "lib/posthog";
import { UserResponse } from "@supabase/supabase-js";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type User = UserResponse["data"]["user"];

const UserContext = createContext<User | null>(null);
const supabase = createSupabaseBrowserClient();

export function UserProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser?.email) {
        posthogIdentify({ email: currentUser.email });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser?.email) {
        posthogIdentify({ email: currentUser.email });
      } else if (event === "SIGNED_OUT") {
        posthogReset();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  const user = useContext(UserContext);

  return user;
}
