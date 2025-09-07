import { createSupabaseBrowserClient } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "app/utils/api-client";
import { toast } from "sonner";

export type BlogMemberRole = "owner" | "admin" | "editor" | "viewer";

export interface BlogMember {
  id: number;
  blog_id: string;
  user_id: string;
  email: string;
  role: BlogMemberRole;
  created_at: string;
}

export interface BlogInvitation {
  id: number;
  blog_id: string;
  email: string;
  role: BlogMemberRole;
  created_at: string;
  blog_name: string | null;
}

// Query to get blog members
export const useBlogMembersQuery = (
  blogId: string,
  { enabled = true }: { enabled?: boolean } = {}
) => {
  const supa = createSupabaseBrowserClient();

  return useQuery({
    queryKey: ["blog-members", blogId],
    queryFn: async (): Promise<BlogMember[]> => {
      const { data, error } = await supa
        .from("blog_members")
        .select("*")
        .eq("blog_id", blogId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: enabled && !!blogId,
  });
};

// Query to get blog invitations
export const useBlogInvitationsQuery = (
  blogId: string,
  { enabled = true }: { enabled?: boolean } = {}
) => {
  const supa = createSupabaseBrowserClient();

  return useQuery({
    queryKey: ["blog-invitations", blogId],
    queryFn: async (): Promise<BlogInvitation[]> => {
      const { data, error } = await supa
        .from("blog_invitations")
        .select("id, blog_id, email, role, created_at, blog_name")
        .eq("blog_id", blogId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching blog invitations:", error);
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: enabled && !!blogId,
  });
};

export const useUserInvitationsQuery = (userEmail: string) => {
  const api = API();
  return useQuery({
    queryKey: ["blog-invitations", userEmail],
    queryFn: async () => {
      const res = await api.v2.invitations.$get();

      if (res.status !== 200) {
        const error = await res.json();
        if ("message" in error) {
          throw new Error(error.message);
        } else if ("error" in error) {
          throw new Error(error.error);
        }
        throw new Error("Failed to fetch invitations");
      }

      const data = await res.json();

      // Type guard to check if response has invitations
      if ("invitations" in data && Array.isArray(data.invitations)) {
        return data.invitations as BlogInvitation[];
      }

      throw new Error("Invalid response format from invitations API");
    },
    enabled: !!userEmail,
  });
};

// Mutation to send invitation
export const useSendInvitationMutation = () => {
  const queryClient = useQueryClient();
  const api = API();

  return useMutation({
    mutationFn: async ({
      blogId,
      email,
      role = "editor",
    }: {
      blogId: string;
      email: string;
      role?: "editor" | "viewer";
    }) => {
      const res = await api.v2.blogs[":blog_id"].invitations.$post({
        param: {
          blog_id: blogId,
        },
        json: {
          email,
          role,
        },
      });

      if (res.status !== 201) {
        const error = await res.json();
        if ("message" in error) {
          throw new Error(error.message);
        } else if ("error" in error) {
          throw new Error(error.error);
        }
        throw new Error("Failed to send invitation");
      }

      return res.json();
    },
    onSuccess: (data, variables) => {
      toast.success(`Invitation sent to ${variables.email}`);
      // Invalidate both members and invitations queries
      queryClient.invalidateQueries({
        queryKey: ["blog-members", variables.blogId],
      });
      queryClient.invalidateQueries({
        queryKey: ["blog-invitations", variables.blogId],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Mutation to accept/deny invitation
export const useUpdateInvitationMutation = () => {
  const queryClient = useQueryClient();
  const api = API();

  return useMutation({
    mutationFn: async ({
      invitationId,
      action,
    }: {
      invitationId: string;
      action: "accept" | "deny";
    }) => {
      const res = await api.v2.invitations[":invitation_id"].update.$post({
        param: {
          invitation_id: invitationId,
        },
        json: {
          action,
        },
      });

      if (res.status !== 200 && res.status !== 201) {
        const error = (await res.json()) as {
          message?: string;
          error?: string;
        };
        if ("message" in error && typeof error.message === "string") {
          throw new Error(error.message);
        } else if ("error" in error && typeof error.error === "string") {
          throw new Error(error.error);
        }
        throw new Error("Failed to update invitation");
      }

      return res.json();
    },
    onSuccess: (data, variables) => {
      if (variables.action === "accept") {
        toast.success("Invitation accepted! Welcome to the team!");
      } else {
        toast.success("Invitation declined");
      }
      // Invalidate all member-related queries since we don't know the blog ID here
      queryClient.invalidateQueries({ queryKey: ["blog-members"] });
      queryClient.invalidateQueries({ queryKey: ["blog-invitations"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Mutation to revoke invitation (for blog owners)
export const useRevokeInvitationMutation = () => {
  const queryClient = useQueryClient();
  const supa = createSupabaseBrowserClient();

  return useMutation({
    mutationFn: async ({
      invitationId,
      blogId,
    }: {
      invitationId: string;
      blogId: string;
    }) => {
      const { error } = await supa
        .from("blog_invitations")
        .delete()
        .eq("id", invitationId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    },
    onSuccess: (data, variables) => {
      toast.success("Invitation revoked");
      queryClient.invalidateQueries({
        queryKey: ["blog-invitations", variables.blogId],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Mutation to remove member (for blog owners)
export const useRemoveMemberMutation = () => {
  const queryClient = useQueryClient();
  const supa = createSupabaseBrowserClient();

  return useMutation({
    mutationFn: async ({
      memberId,
      blogId,
    }: {
      memberId: number;
      blogId: string;
    }) => {
      const { error } = await supa
        .from("blog_members")
        .delete()
        .eq("id", memberId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    },
    onSuccess: (data, variables) => {
      toast.success("Member removed from blog");
      queryClient.invalidateQueries({
        queryKey: ["blog-members", variables.blogId],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Mutation to update member role (for blog owners)
export const useUpdateMemberRoleMutation = () => {
  const queryClient = useQueryClient();
  const supa = createSupabaseBrowserClient();

  return useMutation({
    mutationFn: async ({
      memberId,
      blogId,
      role,
    }: {
      memberId: number;
      blogId: string;
      role: "owner" | "admin" | "editor" | "viewer";
    }) => {
      const { data, error } = await supa
        .from("blog_members")
        .update({ role })
        .eq("id", memberId)
        .select("*")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data, variables) => {
      toast.success("Member role updated");
      queryClient.invalidateQueries({
        queryKey: ["blog-members", variables.blogId],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
