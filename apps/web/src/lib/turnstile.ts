import { env } from "@/env.mjs";

export function getTurnstileSiteKey() {
  if (
    env.NEXT_PUBLIC_VERCEL_ENV === "preview" &&
    env.NEXT_PUBLIC_TURNSTILE_PREVIEW_SITE_KEY
  ) {
    return env.NEXT_PUBLIC_TURNSTILE_PREVIEW_SITE_KEY;
  }

  return env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? null;
}

export function isTurnstileEnabled() {
  return Boolean(getTurnstileSiteKey());
}
