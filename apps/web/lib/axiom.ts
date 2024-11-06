import { Axiom } from "@axiomhq/js";

export const AXIOM_DATASETS = {
  api: "api",
  stripe: "stripe",
};

const axiom = new Axiom({
  token: process.env.AXIOM_TOKEN!,
  orgId: process.env.AXIOM_ORG_ID!,
});

export type ApiUsageEvent = {
  blogId: string;
  event: "api-usage";
  timestamp: string;
  path: string;
};

export function trackApiUsage(event: ApiUsageEvent) {
  axiom.ingest(AXIOM_DATASETS.api, event);
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

  console.log("result", result);

  if (!result.matches || result.matches.length === 0) {
    return [];
  }

  const data = result.matches[0]?.data;

  console.log("data", data);

  return data;
}

export { axiom };
