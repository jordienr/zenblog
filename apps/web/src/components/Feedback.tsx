import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { FeedbackForm } from "./Feedback/feedback-form";

type Props = {};

const Feedback = (props: Props) => {
  const sb = getSupabaseBrowserClient();
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setIsSuccess(false);
      }, 4000);
    }
  }, [isSuccess]);

  return (
    <div>
      <FeedbackForm
        isSuccess={isSuccess}
        onSubmit={async ({ feedback, type }) => {
          try {
            const user = await sb.auth.getUser();

            if (user.error) {
              throw user.error;
            }

            const { data, error } = await sb
              .from("feedback")
              .insert({ feedback, type, user_email: user.data.user.email });

            if (error) {
              throw error;
            }

            toast.success("Thanks for the feedback!");
            setIsSuccess(true);
          } catch (error) {
            toast.error(
              "Failed to submit feedback. Check the console for more details."
            );
            console.error("Failed to submit feedback", error);
          }
        }}
      ></FeedbackForm>
    </div>
  );
};

export default Feedback;
