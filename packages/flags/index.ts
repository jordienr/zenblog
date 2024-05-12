import { createSource } from "./../../generated/hypertune";

const hypertune = createSource({
  token: process.env.NEXT_PUBLIC_HYPERTUNE_TOKEN!,
});

export default hypertune;
