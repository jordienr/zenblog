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
      authors: {
        Row: {
          bio: string | null
          blog_id: string
          created_at: string
          id: number
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
          name?: string
          slug?: string
          twitter?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_authors_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_authors_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "category_post_count"
            referencedColumns: ["blog_id"]
          },
        ]
      }
      blog_images: {
        Row: {
          blog_id: string
          content_type: string | null
          created_at: string
          file_name: string
          file_url: string
          id: number
          size_in_bytes: number
        }
        Insert: {
          blog_id: string
          content_type?: string | null
          created_at?: string
          file_name: string
          file_url: string
          id?: number
          size_in_bytes?: number
        }
        Update: {
          blog_id?: string
          content_type?: string | null
          created_at?: string
          file_name?: string
          file_url?: string
          id?: number
          size_in_bytes?: number
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
          id: number
          post_id: string
        }
        Insert: {
          author_id: number
          id?: number
          post_id: string
        }
        Update: {
          author_id?: number
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
            referencedRelation: "posts_v4"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_authors_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_v5"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_authors_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_v6"
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
            referencedRelation: "posts_v4"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_v5"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_v6"
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
          plan: string | null
          status: string
          stripe_subscription_id: string
          subscription: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          plan?: string | null
          status: string
          stripe_subscription_id: string
          subscription: Json
          user_id: string
        }
        Update: {
          created_at?: string
          plan?: string | null
          status?: string
          stripe_subscription_id?: string
          subscription?: Json
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
      posts_v4: {
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
      posts_v6: {
        Row: {
          blog_id: string | null
          blog_slug: string | null
          category: Json | null
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
      posts_v8: {
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
      get_blog_post: {
        Args: {
          p_blog_id: string
          p_slug: string
        }
        Returns: {
          title: string
          html_content: string
          slug: string
          category_name: string
          category_slug: string
          tags: Json
          abstract: string
          published_at: string
        }[]
      }
      get_posts_by_blog: {
        Args: {
          p_blog_id: string
          p_limit: number
          p_offset: number
        }
        Returns: Json
      }
      get_tags_by_post_slug: {
        Args: {
          post_slug: string
        }
        Returns: {
          id: string
          slug: string
          name: string
        }[]
      }
      get_tags_by_post_slug_and_blog_id: {
        Args: {
          post_slug: string
          blog_id: string
        }
        Returns: {
          id: string
          slug: string
          name: string
        }[]
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
