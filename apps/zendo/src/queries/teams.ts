import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";

const keys = {
  teams: () => ["teams"],
  team: (teamId: string) => ["team", teamId],
};

export function useTeamsQuery() {
  const sb = getSupabaseBrowserClient();

  return useQuery(keys.teams(), async () => {
    const { data, error } = await sb.from("teams").select("*");

    if (error) {
      throw error;
    }

    return data;
  });
}

export function useCreateTeamMutation() {
  const sb = getSupabaseBrowserClient();

  return useMutation(
    async ({ owner_id, name }: { owner_id: string; name: string }) => {
      const { data, error } = await sb.from("teams").insert({
        owner_id,
        name,
      });

      console.log("create team", data, error);

      if (error) {
        throw error;
      }

      return data;
    }
  );
}
