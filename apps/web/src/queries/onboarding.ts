import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const onboardingKeys = ["onboarding_steps"];

export const getOnboardingItems = (currentBlogId: string) =>
  [
    {
      id: "has_blog",
      label: "Create your blog",
      href: "/blogs/create",
    },
    {
      id: "has_published_post",
      label: "Publish your first post",
      href: `/blogs/${currentBlogId || "_"}/create`,
    },
    {
      id: "has_integrated_api",
      label: "Integrate to your website",
      href: "/docs/getting-started",
    },
  ] as const;

type OnboardingSteps = {
  has_blog: boolean;
  has_published_post: boolean;
  has_integrated_api: boolean;
};

export const useOnboardingQuery = () => {
  const sb = createSupabaseBrowserClient();

  return useQuery({
    queryKey: onboardingKeys,
    queryFn: async () => {
      const { data } = await sb
        .from("onboarding_steps")
        .select("has_blog, has_published_post, has_integrated_api")
        .limit(1)
        .throwOnError();

      return (
        data?.[0] || {
          has_blog: false,
          has_published_post: false,
          has_integrated_api: false,
        }
      );
    },
  });
};

export const useOnboardingMutation = () => {
  const sb = createSupabaseBrowserClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (step: keyof OnboardingSteps) => {
      const { data } = await sb.auth.getUser();
      if (!data.user?.id) return;
      await sb
        .from("onboarding_steps")
        .upsert(
          { [step]: true, user_id: data.user.id },
          {
            onConflict: "user_id",
          }
        )
        .eq("user_id", data.user.id)
        .throwOnError();
    },
    onSuccess: () => {
      toast.success("Onboarding step completed");
      queryClient.invalidateQueries({ queryKey: onboardingKeys });
    },
  });
};
