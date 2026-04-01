import posthog from "posthog-js";
import { isPreviewOrDevDeployment } from "@/lib/runtime-env";

type EventId = "feedback";

export function posthogCapture(
  eventId: EventId,
  payload: Record<string, any> = {}
) {
  posthog.capture(eventId, {
    ...payload,
    is_dev: isPreviewOrDevDeployment(),
  });
}

export function posthogCaptureException(
  error: Error,
  payload: Record<string, any> = {}
) {
  posthog.captureException(error, {
    ...payload,
    is_dev: isPreviewOrDevDeployment(),
  });
}

export function posthogIdentify({ email }: { email: string }) {
  posthog.identify(email, {
    email,
    is_dev: isPreviewOrDevDeployment(),
  });
}

export function posthogReset() {
  posthog.reset();
}
