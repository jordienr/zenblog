import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

const InvitationPostBody = z.object({
  id: z.string(),
  name: z.string(),
  blogId: z.string(),
  email: z.string().email(),
});

export const contract = c.router({
  invitations: {
    method: "POST",
    path: "/invitations",
    responses: {
      204: z.null(),
    },
    body: InvitationPostBody,
    summary: "Invite a user to a blog",
  },
});
