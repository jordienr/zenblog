export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blog_tags: {
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
        ]
      }
      blogs: {
        Row: {
          created_at: string
          description: string
          emoji: string
          id: string
          order: Database["public"]["Enums"]["blog_sort_order"]
          slug: string
          theme: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string
          emoji: string
          id?: string
          order?: Database["public"]["Enums"]["blog_sort_order"]
          slug: string
          theme?: string
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          description?: string
          emoji?: string
          id?: string
          order?: Database["public"]["Enums"]["blog_sort_order"]
          slug?: string
          theme?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blogs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blogs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string
          feedback: string | null
          id: number
          user_email: string | null
        }
        Insert: {
          created_at?: string
          feedback?: string | null
          id?: number
          user_email?: string | null
        }
        Update: {
          created_at?: string
          feedback?: string | null
          id?: number
          user_email?: string | null
        }
        Relationships: []
      }
      homepage_signup: {
        Row: {
          created_at: string | null
          email: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          name?: string
        }
        Relationships: []
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
            referencedRelation: "posts_with_blog_and_subscription_status"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_blog_and_subscription_status_v2"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_tags"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_tags_v2"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_tags_v3"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "public_posts_v1"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "public_posts_v2"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "public_posts_v3"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tag_usage_count_v2"
            referencedColumns: ["tag_id"]
          },
        ]
      }
      posts: {
        Row: {
          abstract: string
          blog_id: string
          content: Json
          cover_image: string | null
          created_at: string
          deleted: boolean
          html_content: string
          id: string
          metadata: Json[] | null
          published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          abstract?: string
          blog_id: string
          content?: Json
          cover_image?: string | null
          created_at?: string
          deleted?: boolean
          html_content?: string
          id?: string
          metadata?: Json[] | null
          published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          abstract?: string
          blog_id?: string
          content?: Json
          cover_image?: string | null
          created_at?: string
          deleted?: boolean
          html_content?: string
          id?: string
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
            foreignKeyName: "public_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      prices: {
        Row: {
          created_at: string
          id: number
          price: Json
          stripe_price_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          price: Json
          stripe_price_id: string
        }
        Update: {
          created_at?: string
          id?: number
          price?: Json
          stripe_price_id?: string
        }
        Relationships: []
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
          created_at: string
          status: string
          stripe_subscription_id: string
          subscription: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          status: string
          stripe_subscription_id: string
          subscription: Json
          user_id: string
        }
        Update: {
          created_at?: string
          status?: string
          stripe_subscription_id?: string
          subscription?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
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
        Relationships: [
          {
            foreignKeyName: "public_teams_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_teams_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      post_tags_with_tags: {
        Row: {
          created_at: string | null
          id: number | null
          post_id: string | null
          tag_description: string | null
          tag_id: string | null
          tag_name: string | null
          tag_slug: string | null
        }
        Relationships: [
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
            referencedRelation: "posts_with_blog_and_subscription_status"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_blog_and_subscription_status_v2"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_tags"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_tags_v2"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_tags_v3"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "public_posts_v1"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "public_posts_v2"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "public_posts_v3"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tag_usage_count_v2"
            referencedColumns: ["tag_id"]
          },
        ]
      }
      posts_with_blog_and_subscription_status: {
        Row: {
          blog_id: string | null
          content: Json | null
          cover_image: string | null
          created_at: string | null
          deleted: boolean | null
          metadata: Json[] | null
          post_id: string | null
          published: boolean | null
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
        ]
      }
      posts_with_blog_and_subscription_status_v2: {
        Row: {
          blog_id: string | null
          content: Json | null
          cover_image: string | null
          created_at: string | null
          deleted: boolean | null
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
        ]
      }
      posts_with_tags: {
        Row: {
          blog_id: string | null
          content: Json | null
          cover_image: string | null
          created_at: string | null
          deleted: boolean | null
          metadata: Json[] | null
          post_id: string | null
          published: boolean | null
          slug: string | null
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
        ]
      }
      posts_with_tags_v2: {
        Row: {
          blog_id: string | null
          content: Json | null
          cover_image: string | null
          created_at: string | null
          deleted: boolean | null
          metadata: Json[] | null
          post_id: string | null
          published: boolean | null
          published_at: string | null
          slug: string | null
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
        ]
      }
      posts_with_tags_v3: {
        Row: {
          abstract: string | null
          blog_id: string | null
          content: Json | null
          cover_image: string | null
          created_at: string | null
          deleted: boolean | null
          metadata: Json[] | null
          post_id: string | null
          published: boolean | null
          published_at: string | null
          slug: string | null
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
        ]
      }
      public_posts_v1: {
        Row: {
          blog_id: string | null
          blog_slug: string | null
          content: Json | null
          cover_image: string | null
          created_at: string | null
          deleted: boolean | null
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
        ]
      }
      public_posts_v2: {
        Row: {
          blog_id: string | null
          blog_slug: string | null
          content: Json | null
          cover_image: string | null
          created_at: string | null
          deleted: boolean | null
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
        ]
      }
      public_posts_v3: {
        Row: {
          abstract: string | null
          blog_id: string | null
          blog_slug: string | null
          content: Json | null
          cover_image: string | null
          created_at: string | null
          deleted: boolean | null
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
        ]
      }
      users: {
        Row: {
          aud: string | null
          banned_until: string | null
          confirmation_sent_at: string | null
          confirmation_token: string | null
          confirmed_at: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          email_change: string | null
          email_change_confirm_status: number | null
          email_change_sent_at: string | null
          email_change_token_current: string | null
          email_change_token_new: string | null
          email_confirmed_at: string | null
          encrypted_password: string | null
          id: string | null
          instance_id: string | null
          invited_at: string | null
          is_sso_user: boolean | null
          is_super_admin: boolean | null
          last_sign_in_at: string | null
          phone: string | null
          phone_change: string | null
          phone_change_sent_at: string | null
          phone_change_token: string | null
          phone_confirmed_at: string | null
          raw_app_meta_data: Json | null
          raw_user_meta_data: Json | null
          reauthentication_sent_at: string | null
          reauthentication_token: string | null
          recovery_sent_at: string | null
          recovery_token: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          aud?: string | null
          banned_until?: string | null
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          email_change?: string | null
          email_change_confirm_status?: number | null
          email_change_sent_at?: string | null
          email_change_token_current?: string | null
          email_change_token_new?: string | null
          email_confirmed_at?: string | null
          encrypted_password?: string | null
          id?: string | null
          instance_id?: string | null
          invited_at?: string | null
          is_sso_user?: boolean | null
          is_super_admin?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          phone_change?: string | null
          phone_change_sent_at?: string | null
          phone_change_token?: string | null
          phone_confirmed_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          reauthentication_sent_at?: string | null
          reauthentication_token?: string | null
          recovery_sent_at?: string | null
          recovery_token?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          aud?: string | null
          banned_until?: string | null
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          email_change?: string | null
          email_change_confirm_status?: number | null
          email_change_sent_at?: string | null
          email_change_token_current?: string | null
          email_change_token_new?: string | null
          email_confirmed_at?: string | null
          encrypted_password?: string | null
          id?: string | null
          instance_id?: string | null
          invited_at?: string | null
          is_sso_user?: boolean | null
          is_super_admin?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          phone_change?: string | null
          phone_change_sent_at?: string | null
          phone_change_token?: string | null
          phone_confirmed_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          reauthentication_sent_at?: string | null
          reauthentication_token?: string | null
          recovery_sent_at?: string | null
          recovery_token?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      generate_random_string: {
        Args: {
          length: number
        }
        Returns: string
      }
      generate_slug: {
        Args: {
          title: string
        }
        Returns: string
      }
      is_blog_owner: {
        Args: {
          blog_id: string
          given_user_id: string
        }
        Returns: boolean
      }
      requesting_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      blog_sort_order: "asc" | "desc"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
