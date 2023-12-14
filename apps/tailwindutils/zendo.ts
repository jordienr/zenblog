import { createClient } from "zenblog";

export function getCMS() {
  const cms = createClient({
    // _url: "http://localhost:3001/api/public",
    blogId: "eb37085e-2220-4404-bd07-ad2848094fa8",
    debug: true,
  });

  return cms;
}
