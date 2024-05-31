import { appRouter } from "@/trpc/server";
import { createTRPCContext } from "@/trpc/server/context";
import { createNextApiHandler } from "@trpc/server/adapters/next";

// @link https://nextjs.org/docs/api-routes/introduction
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
});
