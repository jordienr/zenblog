import { ManagementAPI } from "app/api/[...route]/route";
import { hc } from "hono/client";

export const API = () => {
  const client = hc<ManagementAPI>("");

  return client.api;
};
