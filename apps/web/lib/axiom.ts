import { Axiom } from "@axiomhq/js";

export const AXIOM_DATASETS = {
  api: "api",
  stripe: "stripe",
};

const axiom = new Axiom({
  token: process.env.AXIOM_TOKEN!,
});

export { axiom };
