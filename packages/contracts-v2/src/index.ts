import { z } from "@hono/zod-openapi";

export const V2BlogIdParamSchema = z.object({
  blogId: z.string().openapi({
    param: { name: "blogId", in: "path" },
    example: "53a970ef-cc74-40ac-ac53-c322cd4848cb",
  }),
});

export const V2HealthSchema = z.object({
  ok: z.boolean(),
});
