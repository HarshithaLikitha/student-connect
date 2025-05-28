export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          username: string
          avatar_url: string | null
          bio: string | null
          university: string | null
          major: string | null
          year: string | null
          location: string | null
          github_url: string | null
          linkedin_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          username: string
          avatar_url?: string | null
          bio?: string | null
          university?: string | null
          major?: string | null
          year?: string | null
          location?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          username?: string
          avatar_url?: string | null
          bio?: string | null
          university?: string | null
          major?: string | null
          year?: string | null
          location?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      communities: {
        Row: {
          id: string
          name: string
          description: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          status: string
          team_name: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          status: string
          team_name?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          status?: string
          team_name?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          name: string
          description: string | null
          date: string
          time: string
          location: string
          type: string
          organizer: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          date: string
          time: string
          location: string
          type: string
          organizer: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          date?: string
          time?: string
          location?: string
          type?: string
          organizer?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          created_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          is_user: boolean
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          is_user: boolean
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          is_user?: boolean
          content?: string
          created_at?: string
        }
      }
    }
  }
}
