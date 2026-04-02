import { env } from "@/env.mjs";

function isTurnstileForceDisabled() {
  return env.NEXT_PUBLIC_DISABLE_TURNSTILE === "true";
}

export function getTurnstileSiteKey() {
  if (isTurnstileForceDisabled()) {
    return null;
  }

  if (
    env.NEXT_PUBLIC_VERCEL_ENV === "preview" &&
    env.NEXT_PUBLIC_TURNSTILE_PREVIEW_SITE_KEY
  ) {
    return env.NEXT_PUBLIC_TURNSTILE_PREVIEW_SITE_KEY;
  }

  return env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? null;
}

export function isTurnstileEnabled() {
  return !isTurnstileForceDisabled() && Boolean(getTurnstileSiteKey());
}
