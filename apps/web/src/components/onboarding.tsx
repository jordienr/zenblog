import { ChevronRightIcon, CircleDashedIcon, PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { getOnboardingItems, useOnboardingQuery } from "@/queries/onboarding";
import { useOnboardingMutation } from "@/queries/onboarding";
import { CircleCheckIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useRouter } from "next/router";

export function OnboardingDropdown() {
  const router = useRouter();
  const currentBlogId = router.query.blogId as string;

  const items = getOnboardingItems(currentBlogId);

  const { data } = useOnboardingQuery();
  const { mutate: markAsDone } = useOnboardingMutation();

  const allAreDone = items.every((item) => data?.[item.id]);

  if (allAreDone) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <CircleCheckIcon /> Things to do
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="-mr-1">
          {items.map((item) => (
            <DropdownMenuItem
              className="flex items-center p-0"
              key={item.label}
            >
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      if (data?.[item.id]) return;
                      markAsDone(item.id);
                    }}
                    className="flex items-center gap-2 p-2 [&>svg]:size-5 [&>svg]:hover:text-green-500"
                  >
                    {data?.[item.id] ? (
                      <CircleCheckIcon className="text-green-500" />
                    ) : (
                      <CircleDashedIcon className="text-gray-500" />
                    )}
                  </button>
                </TooltipTrigger>
                {data?.[item.id] ? null : (
                  <TooltipContent>Mark as done</TooltipContent>
                )}
              </Tooltip>
              <Link
                className="flex h-full flex-1 items-center gap-2 py-2 pr-2"
                href={item.href}
              >
                {item.label}
                <ChevronRightIcon className="ml-auto size-4" />
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
