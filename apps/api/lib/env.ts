import { z } from "zod";

export function env() {
  const envSchema = z.object({
    BASE_API_URL: z.string(),
    SUPABASE_URL: z.string(),
    SUPABASE_SERVICE_ROLE_KEY: z.string(),
    UPSTASH_REDIS_REST_URL: z.string(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
  });

  const envMap = {
    BASE_API_URL: process.env.BASE_API_URL,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  };

  try {
    const env = envSchema.parse(envMap);

    return env;
  } catch (error) {
    console.error(error);
    throw new Error("Invalid environment variables");
  }
}
