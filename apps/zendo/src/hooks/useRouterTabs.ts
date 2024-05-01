import { useRouter } from "next/router";

export function useRouterTabs(name = "tab") {
  const router = useRouter();

  return {
    tabValue: router.query.tab as string,
    onTabChange: (tab: string) => {
      router.push({
        query: {
          ...router.query,
          [name]: tab,
        },
      });
    },
  };
}
