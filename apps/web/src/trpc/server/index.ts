import { createServerClient } from "@/lib/server/supabase";
import { publicProcedure, router } from "./trpc";
import { z } from "zod";

export const appRouter = router({
  queryExample: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input: { id } }) => {
      const users = {};
      return users;
    }),
  mutationExample: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async (opts) => {
      const { input } = opts;

      // Create a new user in the database
      //   const user = await db.user.create(input);
      //   return user;
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
