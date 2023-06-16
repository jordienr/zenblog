export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      api_keys: {
        Row: {
          blog_id: string
          created_at: string
          id: string
          key: string
          name: string
          user_id: string
        }
        Insert: {
          blog_id: string
          created_at?: string
          id?: string
          key: string
          name: string
          user_id?: string
        }
        Update: {
          blog_id?: string
          created_at?: string
          id?: string
          key?: string
          name?: string
          user_id?: string
        }
      }
      blogs: {
        Row: {
          created_at: string
          description: string | null
          emoji: string
          id: string
          slug: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          emoji: string
          id?: string
          slug: string
          title: string
          user_id?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          emoji?: string
          id?: string
          slug?: string
          title?: string
          user_id?: string
        }
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
      }
      posts: {
        Row: {
          blog_id: string
          blog_slug: string
          content: string
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
          blog_slug: string
          content: string
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
          blog_slug?: string
          content?: string
          created_at?: string
          id?: string
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
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
