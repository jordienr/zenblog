export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      authors: {
        Row: {
          bio: string | null
          blog_id: string
          created_at: string
          id: number
          image_url: string | null
          name: string
          slug: string
          twitter: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          bio?: string | null
          blog_id: string
          created_at?: string
          id?: number
          image_url?: string | null
          name: string
          slug: string
          twitter?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          bio?: string | null
          blog_id?: string
          created_at?: string
          id?: number
          image_url?: string | null
          name?: string
          slug?: string
          twitter?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "authors_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "authors_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "category_post_count"
            referencedColumns: ["blog_id"]
          },
        ]
      }
      billing_prices: {
        Row: {
          active: boolean
          created_at: string
          currency: string
          interval: string
          metadata: Json | null
          plan_code: string
          price_id: string
          product_id: string
          unit_amount: number
          version: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          currency: string
          interval: string
          metadata?: Json | null
          plan_code: string
          price_id: string
          product_id: string
          unit_amount: number
          version?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          currency?: string
          interval?: string
          metadata?: Json | null
          plan_code?: string
          price_id?: string
          product_id?: string
          unit_amount?: number
          version?: number
        }
        Relationships: []
      }
      blog_images: {
        Row: {
          blog_id: string
          content_type: string | null
          created_at: string
          file_name: string
          file_url: string | null
          id: number
          is_video: boolean | null
          size_in_bytes: number
          upload_status: Database["public"]["Enums"]["media_status"] | null
        }
        Insert: {
          blog_id: string
          content_type?: string | null
          created_at?: string
          file_name: string
          file_url?: string | null
          id?: number
          is_video?: boolean | null
          size_in_bytes?: number
          upload_status?: Database["public"]["Enums"]["media_status"] | null
        }
        Update: {
          blog_id?: string
          content_type?: string | null
          created_at?: string
          file_name?: string
          file_url?: string | null
          id?: number
          is_video?: boolean | null
          size_in_bytes?: number
          upload_status?: Database["public"]["Enums"]["media_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_images_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_images_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "category_post_count"
            referencedColumns: ["blog_id"]
          },
        ]
      }
      blog_invitations: {
        Row: {
          blog_id: string
          blog_name: string | null
          created_at: string
          email: string
          id: number
          role: Database["public"]["Enums"]["blog_member_role"]
          status: string
        }
        Insert: {
          blog_id: string
          blog_name?: string | null
          created_at?: string
          email: string
          id?: number
          role?: Database["public"]["Enums"]["blog_member_role"]
          status?: string
        }
        Update: {
          blog_id?: string
          blog_name?: string | null
          created_at?: string
          email?: string
          id?: number
          role?: Database["public"]["Enums"]["blog_member_role"]
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_invitations_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_invitations_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "category_post_count"
            referencedColumns: ["blog_id"]
          },
        ]
      }
      blog_members: {
        Row: {
          blog_id: string
          created_at: string
          email: string
          id: number
          role: Database["public"]["Enums"]["blog_member_role"]
          user_id: string
        }
        Insert: {
          blog_id: string
          created_at?: string
          email: string
          id?: number
          role?: Database["public"]["Enums"]["blog_member_role"]
          user_id: string
        }
        Update: {
          blog_id?: string
          created_at?: string
          email?: string
          id?: number
          role?: Database["public"]["Enums"]["blog_member_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_members_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_members_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "category_post_count"
            referencedColumns: ["blog_id"]
          },
        ]
      }
      blogs: {
        Row: {
          access_token: string | null
          active: boolean
          created_at: string
          description: string
          emoji: string
          id: string
          instagram: string
          order: Database["public"]["Enums"]["blog_sort_order"]
          slug: string | null
          theme: string
          title: string
          twitter: string
          updated_at: string
          user_id: string
          website: string
        }
        Insert: {
          access_token?: string | null
          active?: boolean
          created_at?: string
          description?: string
          emoji: string
          id?: string
          instagram?: string
          order?: Database["public"]["Enums"]["blog_sort_order"]
          slug?: string | null
          theme?: string
          title: string
          twitter?: string
          updated_at?: string
          user_id?: string
          website?: string
        }
        Update: {
          access_token?: string | null
          active?: boolean
          created_at?: string
          description?: string
          emoji?: string
          id?: string
          instagram?: string
          order?: Database["public"]["Enums"]["blog_sort_order"]
          slug?: string | null
          theme?: string
          title?: string
          twitter?: string
          updated_at?: string
          user_id?: string
          website?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          blog_id: string
          created_at: string
          id: number
          name: string
          slug: string
        }
        Insert: {
          blog_id: string
          created_at?: string
          id?: number
          name?: string
          slug?: string
        }
        Update: {
          blog_id?: string
          created_at?: string
          id?: number
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "category_post_count"
            referencedColumns: ["blog_id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string
          feedback: string | null
          id: number
          type: string
          user_email: string | null
        }
        Insert: {
          created_at?: string
          feedback?: string | null
          id?: number
          type?: string
          user_email?: string | null
        }
        Update: {
          created_at?: string
          feedback?: string | null
          id?: number
          type?: string
          user_email?: string | null
        }
        Relationships: []
      }
      homepage_signup: {
        Row: {
          created_at: string | null
          email: string
          id: number
          invited: boolean
          name: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          invited?: boolean
          name: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          invited?: boolean
          name?: string
        }
        Relationships: []
      }
      onboarding_steps: {
        Row: {
          created_at: string
          has_blog: boolean
          has_integrated_api: boolean
          has_published_post: boolean
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          has_blog?: boolean
          has_integrated_api?: boolean
          has_published_post?: boolean
          id?: number
          user_id: string
        }
        Update: {
          created_at?: string
          has_blog?: boolean
          has_integrated_api?: boolean
          has_published_post?: boolean
          id?: number
          user_id?: string
        }
        Relationships: []
      }
      post_authors: {
        Row: {
          author_id: number
          blog_id: string
          id: number
          post_id: string
        }
        Insert: {
          author_id: number
          blog_id: string
          id?: number
          post_id: string
        }
        Update: {
          author_id?: number
          blog_id?: string
          id?: number
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_authors_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_authors_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_authors_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "category_post_count"
            referencedColumns: ["blog_id"]
          },
          {
            foreignKeyName: "post_authors_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_authors_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_v5"
            referencedColumns: ["post_id"]
          },
        ]
      }
      post_tags: {
        Row: {
          blog_id: string
          created_at: string
          id: number
          post_id: string
          tag_id: string
        }
        Insert: {
          blog_id: string
          created_at?: string
          id?: number
          post_id: string
          tag_id: string
        }
        Update: {
          blog_id?: string
          created_at?: string
          id?: number
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "category_post_count"
            referencedColumns: ["blog_id"]
          },
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_v5"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tag_usage_count_v2"
            referencedColumns: ["tag_id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          blog_id: string
          category_id: number | null
          content: Json
          cover_image: string | null
          created_at: string
          deleted: boolean
          excerpt: string
          html_content: string
          id: string
          meta: Json | null
          metadata: Json[] | null
          published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          blog_id: string
          category_id?: number | null
          content?: Json
          cover_image?: string | null
          created_at?: string
          deleted?: boolean
          excerpt?: string
          html_content?: string
          id?: string
          meta?: Json | null
          metadata?: Json[] | null
          published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          blog_id?: string
          category_id?: number | null
          content?: Json
          cover_image?: string | null
          created_at?: string
          deleted?: boolean
          excerpt?: string
          html_content?: string
          id?: string
          meta?: Json | null
          metadata?: Json[] | null
          published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "category_post_count"
            referencedColumns: ["blog_id"]
          },
          {
            foreignKeyName: "posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category_post_count"
            referencedColumns: ["category_id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          id: number
          product: Json
          stripe_product_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          product: Json
          stripe_product_id: string
        }
        Update: {
          created_at?: string
          id?: number
          product?: Json
          stripe_product_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          blog_limit: number | null
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          created_at: string
          currency: string | null
          current_period_end: string | null
          current_period_start: string | null
          interval: string | null
          plan: string | null
          plan_version: number | null
          price_id: string | null
          price_lookup_key: string | null
          product_id: string | null
          status: string
          stripe_subscription_id: string
          subscription: Json
          unit_amount: number | null
          user_id: string
        }
        Insert: {
          blog_limit?: number | null
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          created_at?: string
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          interval?: string | null
          plan?: string | null
          plan_version?: number | null
          price_id?: string | null
          price_lookup_key?: string | null
          product_id?: string | null
          status: string
          stripe_subscription_id: string
          subscription: Json
          unit_amount?: number | null
          user_id: string
        }
        Update: {
          blog_limit?: number | null
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          created_at?: string
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          interval?: string | null
          plan?: string | null
          plan_version?: number | null
          price_id?: string | null
          price_lookup_key?: string | null
          product_id?: string | null
          status?: string
          stripe_subscription_id?: string
          subscription?: Json
          unit_amount?: number | null
          user_id?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          blog_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          blog_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          blog_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_tags_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_tags_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "category_post_count"
            referencedColumns: ["blog_id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          id: number
          name: string
          owner_id: string | null
          ref: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          owner_id?: string | null
          ref?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          owner_id?: string | null
          ref?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      category_post_count: {
        Row: {
          blog_id: string | null
          category_id: number | null
          category_name: string | null
          category_slug: string | null
          created_at: string | null
          post_count: number | null
        }
        Relationships: []
      }
      posts_v10: {
        Row: {
          authors: number[] | null
          blog_id: string | null
          category_name: string | null
          category_slug: string | null
          content: Json | null
          cover_image: string | null
          created_at: string | null
          deleted: boolean | null
          excerpt: string | null
          html_content: string | null
          metadata: Json[] | null
          published: boolean | null
          published_at: string | null
          slug: string | null
          subscription_status: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "category_post_count"
            referencedColumns: ["blog_id"]
          },
        ]
      }
      posts_v5: {
        Row: {
          blog_id: string | null
          blog_slug: string | null
          category_name: string | null
          category_slug: string | null
          content: Json | null
          cover_image: string | null
          created_at: string | null
          deleted: boolean | null
          excerpt: string | null
          html_content: string | null
          metadata: Json[] | null
          post_id: string | null
          published: boolean | null
          published_at: string | null
          slug: string | null
          subscription_status: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "category_post_count"
            referencedColumns: ["blog_id"]
          },
        ]
      }
      posts_v7: {
        Row: {
          blog_id: string | null
          category: Json | null
          content: Json | null
          cover_image: string | null
          created_at: string | null
          deleted: boolean | null
          excerpt: string | null
          html_content: string | null
          metadata: Json[] | null
          published: boolean | null
          published_at: string | null
          slug: string | null
          subscription_status: string | null
          tags: Json[] | null
          title: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "category_post_count"
            referencedColumns: ["blog_id"]
          },
        ]
      }
      posts_v9: {
        Row: {
          blog_id: string | null
          category_name: string | null
          category_slug: string | null
          content: Json | null
          cover_image: string | null
          created_at: string | null
          deleted: boolean | null
          excerpt: string | null
          html_content: string | null
          metadata: Json[] | null
          published: boolean | null
          published_at: string | null
          slug: string | null
          subscription_status: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "category_post_count"
            referencedColumns: ["blog_id"]
          },
        ]
      }
      tag_usage_count_v2: {
        Row: {
          blog_id: string | null
          created_at: string | null
          post_count: number | null
          slug: string | null
          tag_id: string | null
          tag_name: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_tags_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_tags_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "category_post_count"
            referencedColumns: ["blog_id"]
          },
        ]
      }
    }
    Functions: {
      accept_blog_invitation: {
        Args: { invitation_id: number }
        Returns: boolean
      }
      check_blog_role: {
        Args: {
          blog_id: string
          min_role: Database["public"]["Enums"]["blog_member_role"]
        }
        Returns: boolean
      }
      create_blog_for_me: {
        Args: {
          p_description?: string
          p_emoji: string
          p_slug?: string
          p_title: string
        }
        Returns: {
          access_token: string | null
          active: boolean
          created_at: string
          description: string
          emoji: string
          id: string
          instagram: string
          order: Database["public"]["Enums"]["blog_sort_order"]
          slug: string | null
          theme: string
          title: string
          twitter: string
          updated_at: string
          user_id: string
          website: string
        }
      }
      generate_random_string: {
        Args: { length: number }
        Returns: string
      }
      generate_slug: {
        Args: { title: string }
        Returns: string
      }
      get_blog_post: {
        Args: { p_blog_id: string; p_slug: string }
        Returns: {
          abstract: string
          category_name: string
          category_slug: string
          html_content: string
          published_at: string
          slug: string
          tags: Json
          title: string
        }[]
      }
      get_posts_by_blog: {
        Args: { p_blog_id: string; p_limit: number; p_offset: number }
        Returns: Json
      }
      get_tags_by_post_slug: {
        Args: { post_slug: string }
        Returns: {
          id: string
          name: string
          slug: string
        }[]
      }
      get_tags_by_post_slug_and_blog_id: {
        Args: { blog_id: string; post_slug: string }
        Returns: {
          id: string
          name: string
          slug: string
        }[]
      }
      has_blog_role: {
        Args: {
          blog_id: string
          min_role: Database["public"]["Enums"]["blog_member_role"]
        }
        Returns: boolean
      }
      is_blog_owner: {
        Args: { blog_id: string; given_user_id: string }
        Returns: boolean
      }
      requesting_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      total_blog_members_for_current_user: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_members_excluding_owner: number
          total_members_including_owner: number
        }[]
      }
    }
    Enums: {
      blog_member_role: "owner" | "admin" | "editor" | "viewer"
      blog_sort_order: "asc" | "desc"
      media_status: "pending" | "uploaded"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      blog_member_role: ["owner", "admin", "editor", "viewer"],
      blog_sort_order: ["asc", "desc"],
      media_status: ["pending", "uploaded"],
    },
  },
} as const
