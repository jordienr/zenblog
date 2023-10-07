import { env } from "@/env.mjs";
import { GroundControlClient } from "@groundcontrolsh/groundcontrol";

export const flags = new GroundControlClient({
  apiKey: env.GROUNDCONTROL_API_KEY,
  projectId: "P0IQ7MWH2EQZLDU8",
  cache: 60, // Optional. For how long results are cached in seconds. Defaults to not caching
});
