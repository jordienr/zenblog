import { Axiom } from "@axiomhq/js";

export const AXIOM_DATASETS = {
  api: "api",
  stripe: "stripe",
};

/**
 * Keep this private, do not export it
 * Wrap it with utility functions that are typed
 */
const axiom = new Axiom({
  token: process.env.AXIOM_TOKEN!,
  orgId: process.env.AXIOM_ORG_ID!,
});

const IS_DEV = process.env.NODE_ENV === "development";
export const axiomIngest = (
  dataset: keyof typeof AXIOM_DATASETS,
  event: any
) => {
  if (IS_DEV) {
    return;
  }
  axiom.ingest(dataset, event);
};

export type ApiUsageEvent = {
  blogId: string;
  event: "api-usage";
  timestamp: string;
  path: string;
};

export function trackApiUsage(event: ApiUsageEvent) {
  axiomIngest("api", event);
}

export async function getApiUsageForBlog(
  blogId: string,
  startTime: string,
  endTime: string
) {
  const query = `
api 
| where (event =~ "api-usage" and blogId =~ "${blogId}") 
| summarize count() by bin_auto(_time)
`;
  const result = await axiom
    .query(query, {
      startTime,
      endTime,
    })
    .catch((e) => {
      console.error("⛩️ Error getting API usage", e);
      return {
        matches: [],
      };
    });

  if (!result.matches || result.matches.length === 0) {
    return [];
  }

  const data = result.matches[0]?.data;

  return data;
}
