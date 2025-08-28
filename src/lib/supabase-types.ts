// 数据库类型定义
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          display_name: string | null
          avatar_url: string | null
          credits: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          credits?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          credits?: number
          created_at?: string
          updated_at?: string
        }
      }
      generations: {
        Row: {
          id: string
          user_id: string
          template_id: string
          original_image_url: string
          generated_image_url: string | null
          status: string
          error_message: string | null
          share_token: string | null
          is_public: boolean
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_id: string
          original_image_url: string
          generated_image_url?: string | null
          status?: string
          error_message?: string | null
          share_token?: string | null
          is_public?: boolean
          created_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          template_id?: string
          original_image_url?: string
          generated_image_url?: string | null
          status?: string
          error_message?: string | null
          share_token?: string | null
          is_public?: boolean
          created_at?: string
          expires_at?: string
        }
      }
      shares: {
        Row: {
          id: string
          generation_id: string
          share_token: string
          view_count: number
          created_at: string
        }
        Insert: {
          id?: string
          generation_id: string
          share_token: string
          view_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          generation_id?: string
          share_token?: string
          view_count?: number
          created_at?: string
        }
      }
    }
  }
}