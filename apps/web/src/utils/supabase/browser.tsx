import { createSupabaseBrowserClient } from "@/lib/supabase";
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
    supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  const user = useContext(UserContext);

  return user;
}
