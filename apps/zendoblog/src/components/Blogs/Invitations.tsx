import { createAPIClient } from "@/lib/app/api";
import { Blog } from "@/lib/models/blogs/Blogs";
import { useBlogQuery } from "@/queries/blogs";
import {
  useCreateInvitation,
  useInvitationsQuery,
} from "@/queries/invitations";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { HiTrash } from "react-icons/hi";
export function Invitations({ blog }: { blog: Blog }) {
  const router = useRouter();
  const blogId = router.query.blogId as string;

  const invitationForm = useForm<{
    email: string;
    name: string;
  }>();

  const api = createAPIClient();

  const invitations = useQuery(["invitations", blogId], () =>
    api.invitations.getAll(blogId)
  );

  const deleteInvitation = useMutation(
    ["invitations", blogId, "delete"],
    (invitationId: string) => api.invitations.delete(blogId, invitationId)
  );

  const createInvitation = useMutation(
    ["invitations", blogId, "create"],
    ({ name, email }: { name: string; email: string }) =>
      api.invitations.create(blogId, name, email)
  );

  const onSubmit = invitationForm.handleSubmit(async (formData) => {
    try {
      console.log(formData);
      await createInvitation.mutateAsync(formData);
      invitationForm.reset();
      invitations.refetch();
    } catch (error) {
      console.error(error);
      alert("Error inviting user, please try again");
    }
  });

  async function onDeleteClick(id: string) {
    await deleteInvitation.mutateAsync(id);
    invitations.refetch();
  }
  return (
    <div>
      <ul className="mt-4 flex flex-col gap-2">
        {invitations.data?.length === 0 && (
          <div className="rounded-xl bg-slate-100 py-8 text-center font-mono text-gray-500">
            No invitations sent yet
          </div>
        )}
        {invitations.data?.map((invitation) => (
          <li
            key={invitation.id}
            className="flex justify-between gap-4 rounded-md border"
          >
            <ul className="flex flex-grow items-center gap-4">
              <li className="w-3/4 p-2 font-semibold">{invitation.name}</li>
              <li className="w-3/4 p-2 font-mono">{invitation.email}</li>
              <li className="w-3/4 ">
                <span className="rounded-lg bg-orange-100 px-1.5 py-1 text-sm text-orange-600">
                  Pending
                </span>
              </li>
            </ul>
            <button
              className="btn btn-icon"
              onClick={() => onDeleteClick(invitation.id)}
            >
              <HiTrash />
            </button>
          </li>
        ))}
      </ul>
      <form className="flex flex-col gap-2" onSubmit={onSubmit}>
        <h3 className="mt-4 font-medium">Invite people to {blog.title}</h3>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Name"
            {...invitationForm.register("name")}
          />
          <input
            type="text"
            placeholder="Email"
            {...invitationForm.register("email")}
          />
        </div>

        <div className="actions">
          <button type="submit" className="btn btn-primary">
            Invite team member
          </button>
        </div>
      </form>
    </div>
  );
}
