import { Tinybird } from "@chronark/zod-bird";
import { z } from "zod";

const tb = new Tinybird({ token: process.env.TINYBIRD_TOKEN! });

const send_api_request = tb.buildIngestEndpoint({
  datasource: "api_requests",
  event: z.object({
    id: z.string(),
    blogId: z.string(),
    timestamp: z.number().int(),
    path: z.string(),
  }),
});

const get_api_requests = tb.buildPipe({
  pipe: "api_requests",
  parameters: z.object({
    blogId: z.string(),
  }),
  data: z.object({
    id: z.string(),
    blogId: z.string(),
    timestamp: z.number().int(),
    path: z.string(),
  }),
});

export const tinybird = {
  send: {
    api_request: send_api_request,
  },
  get: {
    api_requests: get_api_requests,
  },
};
