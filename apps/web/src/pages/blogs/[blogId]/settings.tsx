import AppLayout, {
  Section,
  SectionDescription,
  SectionTitle,
} from "@/layouts/AppLayout";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { EmojiPicker } from "@/components/EmojiPicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  useBlogQuery,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
} from "@/queries/blogs";
import {
  useBlogMembersQuery,
  useBlogInvitationsQuery,
  useSendInvitationMutation,
  useRevokeInvitationMutation,
  useUpdateMemberRoleMutation,
  type BlogMemberRole,
  useRemoveMemberMutation,
} from "@/queries/members";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Mail, Trash2, User, Clock, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserRole } from "@/queries/user-role";
import { useUser } from "@/utils/supabase/browser";

export default function BlogSettings() {
  type FormData = {
    title: string;
    description: string;
    emoji: string;
    slug: string;
  };

  const {
    register,
    handleSubmit,
    formState: { isDirty },
    reset,
    control,
  } = useForm<FormData>();
  const router = useRouter();
  const blogId = router.query.blogId as string;

  const { data: userRole } = useUserRole(blogId);

  const {
    isLoading: blogLoading,
    data: blog,
    error: blogError,
    refetch: refetchBlog,
  } = useBlogQuery(blogId, { enabled: !!userRole });

  const updateBlog = useUpdateBlogMutation();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      console.log(formData);
      const res = await updateBlog.mutateAsync({ ...formData, id: blogId });
      toast.success("Blog updated successfully");

      reset(formData);
      refetchBlog();
    } catch (error) {
      console.error(error);
      alert("Error updating blog, please try again");
    }
  });

  const { mutateAsync: deleteBlogMutation } = useDeleteBlogMutation();

  async function deleteBlog() {
    await deleteBlogMutation(blogId);
    await router.push("/blogs");
  }

  async function onDeleteBlogClick() {
    const confirm1 = prompt(
      `To confirm you want to delete this blog, type "Delete ${blog?.title}"`
    );
    if (confirm1 === `Delete ${blog?.title}`) {
      if (
        confirm(
          "This action is irreversible. Are you sure you want to delete this blog?"
        )
      ) {
        await deleteBlog();
      }
    }
  }

  const [newAPIKey, setNewAPIKey] = useState("");
  const [showNewAPIKeyDialog, setShowNewAPIKeyDialog] = useState(false);

  // Team management state
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("editor");

  // Team management queries
  const {
    data: members = [],
    isLoading: membersLoading,
    error: membersError,
  } = useBlogMembersQuery(blogId, { enabled: !!blogId });

  const {
    data: invitations = [],
    isLoading: invitationsLoading,
    error: invitationsError,
  } = useBlogInvitationsQuery(blogId, { enabled: !!blogId });

  // Team management mutations
  const sendInvitation = useSendInvitationMutation();
  const revokeInvitation = useRevokeInvitationMutation();
  const updateMemberRole = useUpdateMemberRoleMutation();
  const removeMember = useRemoveMemberMutation();

  const user = useUser();

  // Team management functions
  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !blogId) return;

    if (selectedRole !== "editor" && selectedRole !== "viewer") return;

    try {
      await sendInvitation.mutateAsync({
        blogId,
        email: inviteEmail.trim(),
        role: selectedRole,
      });
      setInviteEmail("");
      setSelectedRole("editor"); // Reset to default role
    } catch (error) {
      // Error handling is done in the mutation
      console.error("Failed to send invitation:", error);
    }
  };

  const handleRevokeInvitation = async (
    invitationId: number,
    email: string
  ) => {
    if (!blogId) return;

    try {
      await revokeInvitation.mutateAsync({
        invitationId: invitationId.toString(),
        blogId,
      });
    } catch (error) {
      // Error handling is done in the mutation
      console.error("Failed to revoke invitation:", error);
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    if (confirm("Are you sure you want to remove this member?")) {
      await removeMember.mutateAsync({
        blogId,
        memberId,
      });
    }
  };

  const handleRoleChange = async (memberId: number, role: BlogMemberRole) => {
    await updateMemberRole.mutateAsync({
      blogId,
      memberId,
      role,
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (blogLoading) {
    return <AppLayout loading={true}></AppLayout>;
  }

  if (blogError) {
    return <div>Error loading blog</div>;
  }

  if (!blog) {
    return <div>Blog not found</div>;
  }

  const canManageBlog = ["owner", "admin"].includes(userRole || "");

  return (
    <AppLayout title="Settings">
      <div className="space-y-8">
        <Section>
          <div className="px-4">
            <form onSubmit={onSubmit} className="flex flex-col gap-2">
              <div className="flex items-end gap-4">
                <label htmlFor="emoji" title="Emoji">
                  <Controller
                    control={control}
                    name="emoji"
                    defaultValue={blog.emoji}
                    render={({ field: { onChange, value } }) => (
                      <EmojiPicker
                        onEmojiChange={onChange}
                        emoji={value}
                        disabled={userRole === "viewer"}
                      />
                    )}
                  ></Controller>
                </label>
                <div className="flex-grow">
                  <Label className="flex-grow" htmlFor="title">
                    Title
                  </Label>
                  <Input
                    type="text"
                    id="title"
                    disabled={userRole === "viewer"}
                    className="flex w-full flex-grow"
                    required
                    {...register("title", {
                      value: blog.title,
                    })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  disabled={userRole === "viewer"}
                  className="resize-none"
                  id="description"
                  {...register("description", {
                    value: blog.description || "",
                  })}
                />
              </div>

              <div className="actions mt-1 pb-2">
                <Button type="submit" disabled={userRole === "viewer"}>
                  Save
                </Button>
              </div>
            </form>
          </div>
        </Section>

        <Section className="p-4 pt-3">
          <h2 className="text-lg font-medium">Blog ID</h2>
          <p className="text-zinc-500">
            Use this ID to fetch your blogs content through the API.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Input
              className="font-mono font-medium text-slate-900"
              value={blogId}
              readOnly
            />
            <Button
              variant={"outline"}
              onClick={() => {
                navigator.clipboard.writeText(blogId);
                toast.success("Blog ID copied to clipboard");
              }}
            >
              Copy
            </Button>
          </div>
          <Dialog open={showNewAPIKeyDialog}>
            <DialogContent className="flex max-w-sm flex-col gap-4">
              <DialogHeader>
                <DialogTitle>New API key</DialogTitle>
                <DialogDescription>
                  Make sure to save this key in a secure location. <br /> It
                  will not be shown again.{" "}
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-2">
                <Input
                  value={newAPIKey}
                  readOnly
                  className="flex-grow font-mono"
                />
                <Button
                  variant={"outline"}
                  onClick={() => {
                    navigator.clipboard.writeText(newAPIKey || "");
                    toast.success("API key copied to clipboard");
                  }}
                >
                  Copy
                </Button>
              </div>

              <DialogFooter className="p-2">
                <Button onClick={() => setShowNewAPIKeyDialog(false)}>
                  I have saved the key securely
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Section>

        <Section className="">
          <div className="border-b px-4 pb-4 pt-1">
            <SectionTitle>Team Management</SectionTitle>
            <SectionDescription>
              Invite team members to collaborate on your blog. Members can help
              create and manage content.
            </SectionDescription>
            {/* Invite form */}
            <div className="mt-4">
              <form
                onSubmit={handleSendInvitation}
                className="flex max-w-sm gap-2"
              >
                <div className="flex-grow">
                  <Input
                    disabled={!canManageBlog}
                    type="email"
                    placeholder="Enter email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full min-w-[240px]"
                    required
                    autoComplete="off"
                    data-bwignore
                    data-1p-ignore
                    data-lpignore="true"
                    data-form-type="other"
                  />
                </div>
                <div className="relative">
                  <Select
                    value={selectedRole}
                    onValueChange={(value) => setSelectedRole(value)}
                    disabled={!canManageBlog}
                  >
                    <SelectTrigger
                      className="w-full min-w-[100px]"
                      disabled={!canManageBlog}
                    >
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  disabled={
                    sendInvitation.isPending ||
                    !inviteEmail.trim() ||
                    !canManageBlog
                  }
                >
                  <Mail className="h-4 w-4" />
                  {sendInvitation.isPending ? "Sending..." : "Invite"}
                </Button>
              </form>
            </div>
          </div>

          {/* Current members */}
          <div className="mt-4 px-4">
            <h3 className="mb-3 text-sm font-medium text-slate-700">
              Team Members ({membersLoading ? "..." : members.length})
            </h3>
            {membersLoading ? (
              <div className="p-4 text-center text-sm text-slate-500">
                Loading members...
              </div>
            ) : membersError ? (
              <div className="p-4 text-center text-sm text-red-500">
                Error loading members
              </div>
            ) : members.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-500">
                No team members yet
              </div>
            ) : (
              <div className="divide-y">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between py-1.5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">
                        <User className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={member.role}
                        onValueChange={(value) =>
                          handleRoleChange(member.id, value as BlogMemberRole)
                        }
                        disabled={member.role === "owner" || !canManageBlog}
                      >
                        <SelectTrigger className="w-[120px] capitalize">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      {member.user_id === user?.id || !canManageBlog ? null : (
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={member.role === "owner" || !canManageBlog}
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending invitations */}
          {(invitationsLoading || invitations.length > 0) && canManageBlog && (
            <div className="mt-6">
              <h3 className="mb-3 px-4 text-sm font-medium text-slate-700">
                Pending Invitations (
                {invitationsLoading ? "..." : invitations.length})
              </h3>
              {invitationsLoading ? (
                <div className="p-4 text-center text-sm text-slate-500">
                  Loading invitations...
                </div>
              ) : invitationsError ? (
                <div className="p-4 text-center text-sm text-red-500">
                  Error loading invitations
                </div>
              ) : invitations.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500">
                  No pending invitations
                </div>
              ) : (
                <div className="space-y-2 divide-y">
                  {invitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between p-3 hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-200">
                          <Clock className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {invitation.email}
                          </p>
                          <p className="text-xs capitalize text-slate-500">
                            {invitation.role} • Sent{" "}
                            {formatTimeAgo(invitation.created_at)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleRevokeInvitation(
                            invitation.id,
                            invitation.email
                          )
                        }
                        disabled={revokeInvitation.isPending}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                        {revokeInvitation.isPending ? "Revoking..." : "Revoke"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Section>
        {canManageBlog ? (
          <>
            <Section className="p-4">
              <SectionTitle>Manage subscription</SectionTitle>
              <SectionDescription>
                You can manage your subscription from the account page.
              </SectionDescription>
              <div className="mt-4">
                <Link href="/account">
                  <Button variant={"outline"}>Go to account</Button>
                </Link>
              </div>
            </Section>

            <div className="py-8 text-center text-zinc-400">~</div>

            <Section className="p-4">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-medium text-red-600">
                Danger zone
              </h2>
              <p className="text-zinc-500">
                This action cannot be undone. This will delete all posts in the
                blog.
              </p>
              <div className="actions">
                <Button
                  onClick={onDeleteBlogClick}
                  variant={"destructive"}
                  className="mt-4"
                >
                  Delete blog
                </Button>
              </div>
            </Section>
          </>
        ) : null}
      </div>
    </AppLayout>
  );
}
