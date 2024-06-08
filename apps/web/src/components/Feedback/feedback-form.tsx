import { PropsWithChildren, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export function FeedbackFormTypeButton({
  label,
  icon,
  onClick,
  selected,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-grow items-center gap-1.5 rounded-lg border border-transparent px-2 py-0.5 text-center text-xs font-medium text-zinc-600 transition-all hover:text-zinc-800",
        {
          "border-zinc-200 bg-zinc-50 text-zinc-800": selected,
        }
      )}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export function FeedbackForm({
  onSubmit,
  isSuccess,
}: {
  onSubmit: (data: { feedback: string; type: string }) => Promise<void>;
  isSuccess: boolean;
}) {
  const [type, setType] = useState<"issue" | "idea" | "other">("issue");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-2 py-1 text-sm font-medium text-zinc-600 hover:text-zinc-800">
        Feedback
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64">
        {isSuccess ? (
          <div className="flex flex-col gap-2 p-4 text-center font-medium text-zinc-600">
            <h2>Thanks for the feedback! 🙏</h2>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const feedback = formData.get("feedback") as string;
              onSubmit({ feedback, type });
            }}
          >
            <div className="mb-2 flex gap-2">
              <FeedbackFormTypeButton
                label="Issue"
                value="issue"
                icon="🐛"
                onClick={() => setType("issue")}
                selected={type === "issue"}
              />
              <FeedbackFormTypeButton
                label="Idea"
                value="idea"
                icon="💡"
                onClick={() => setType("idea")}
                selected={type === "idea"}
              />
              <FeedbackFormTypeButton
                label="Other"
                value="other"
                icon="💬"
                onClick={() => setType("other")}
                selected={type === "other"}
              />
            </div>
            <Textarea
              required
              className="resize-none"
              placeholder="Your feedback"
            ></Textarea>
            <div className="actions mt-2">
              <Button>Send feedback</Button>
            </div>
          </form>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
