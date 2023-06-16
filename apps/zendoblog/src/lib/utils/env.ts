import { z } from "zod";

const envSchema = z.object({
  ZENDO_API_TOKEN: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  const env = process.env;
  const parsed = envSchema.safeParse(env);

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }
  return parsed.data;
}
