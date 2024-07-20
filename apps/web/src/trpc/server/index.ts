import { publicProcedure, router } from "./trpc";
import { z } from "zod";

export const appRouter = router({
  posts: {
    get: {
      all: publicProcedure
        .input(
          z.object({
            blogId: z.string(),
            limit: z.number().min(1).max(100).optional(),
            offset: z.number().min(0).optional(),
          })
        )
        .query(async ({ input: { limit = 50, offset = 0 }, ctx }) => {
          // TODO: implement this
          const { data, error } = await ctx.supabase
            .from("posts")
            .select("*")
            .range(offset, offset + limit);
          return data;
        }),
      bySlug: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ input: { slug } }) => {
          // TODO: implement this
        }),
    },
  },
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
