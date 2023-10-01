export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      blogs: {
        Row: {
          created_at: string
          description: string | null
          emoji: string
          id: string
          public_id: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          emoji: string
          id?: string
          public_id?: string
          title: string
          user_id?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          emoji?: string
          id?: string
          public_id?: string
          title?: string
          user_id?: string
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
      invitations: {
        Row: {
          blog_id: string
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          blog_id: string
          created_at?: string
          email: string
          id?: string
          name: string
        }
        Update: {
          blog_id?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_blog_id_fkey"
            columns: ["blog_id"]
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          }
        ]
      }
      members: {
        Row: {
          blog_id: string
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          blog_id: string
          created_at?: string
          id?: number
          user_id: string
        }
        Update: {
          blog_id?: string
          created_at?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_blog_id_fkey"
            columns: ["blog_id"]
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          }
        ]
      }
      posts: {
        Row: {
          blog_id: string
          content: Json
          cover_image: string | null
          created_at: string
          id: string
          published: boolean
          slug: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          blog_id: string
          content?: Json
          cover_image?: string | null
          created_at?: string
          id?: string
          published?: boolean
          slug: string
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          blog_id?: string
          content?: Json
          cover_image?: string | null
          created_at?: string
          id?: string
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_blog_id_fkey"
            columns: ["blog_id"]
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_slug: {
        Args: {
          title: string
        }
        Returns: string
      }
      requesting_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
