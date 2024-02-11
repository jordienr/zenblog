import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

type Props = {};

const Feedback = (props: Props) => {
  const sb = useSupabaseClient();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full px-3 py-1 text-sm font-medium text-slate-600 hover:bg-orange-50 hover:text-orange-600">
          Feedback
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const form = e.target as HTMLFormElement;
                const formData = new FormData(e.target as HTMLFormElement);
                const feedback = formData.get("feedback") as string;

                const user = await sb.auth.getUser();

                if (user.error) {
                  throw user.error;
                }

                const { data, error } = await sb
                  .from("feedback")
                  .insert({ feedback, user_email: user.data.user.email });

                if (error) {
                  throw error;
                }

                toast.success("Thanks for the feedback!");
                form.reset();
              } catch (error) {
                toast.error(
                  "Failed to submit feedback. Check the console for more details."
                );
                console.error("Failed to submit feedback", error);
              }
            }}
            className="grid gap-2"
          >
            <Label htmlFor="feedback">
              <div className="sr-only">Feedback</div>
              <Textarea
                placeholder="Your feedback"
                name="feedback"
                id="feedback"
              />
            </Label>
            <Button type="submit">Submit</Button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Feedback;
