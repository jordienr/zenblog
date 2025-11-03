import posthog from "posthog-js";
import { IS_DEV } from "./is-dev";

type EventId = "feedback";

export function posthogCapture(
  eventId: EventId,
  payload: Record<string, any> = {}
) {
  posthog.capture(eventId, {
    ...payload,
    is_dev: IS_DEV,
  });
}

export function posthogCaptureException(
  error: Error,
  payload: Record<string, any> = {}
) {
  posthog.captureException(error, {
    ...payload,
    is_dev: IS_DEV,
  });
}

export function posthogIdentify({ email }: { email: string }) {
  posthog.identify(email, {
    is_dev: IS_DEV,
  });
}
