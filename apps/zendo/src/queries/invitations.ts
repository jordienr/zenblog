import { createAPIClient } from "@/lib/http/api";
import { useQuery } from "@tanstack/react-query";

const api = createAPIClient();

export const useInvitationsQuery = (blogId: string) =>
  useQuery(["invitations", blogId], () => api.invitations.getAll(blogId));

export const useCreateInvitation = (
  blogId: string,
  name: string,
  email: string
) =>
  useQuery(["invitations", blogId, "create"], () =>
    api.invitations.create(blogId, name, email)
  );

export const useDeleteInvitation = (blogId: string, invitationId: string) =>
  useQuery(["invitations", blogId, "delete", invitationId], () =>
    api.invitations.delete(blogId, invitationId)
  );
