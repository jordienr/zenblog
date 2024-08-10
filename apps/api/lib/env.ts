export function env() {
  const envMap = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    BASE_URL: process.env.BASE_URL,
  };

  if (Object.values(envMap).some((value) => !value)) {
    throw new Error("Missing environment variables");
  }

  return envMap as Record<keyof typeof envMap, string>;
}
