
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
      users: {
        Row: {
          id: string
          username: string
          full_name: string
          bio: string | null
          dob: string | null
          gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | null
          college: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          username: string
          full_name: string
          bio?: string | null
          dob?: string | null
          gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | null
          college?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string
          bio?: string | null
          dob?: string | null
          gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | null
          college?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      user_sports: {
        Row: {
          id: string
          user_id: string
          sport: string
          skill_level: number | null
        }
        Insert: {
          id?: string
          user_id: string
          sport: string
          skill_level?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          sport?: string
          skill_level?: number | null
        }
      }
      user_locations: {
        Row: {
          id: string
          user_id: string
          district: string
          coordinates: unknown // PostGIS geometry
          last_updated: string
        }
        Insert: {
          id?: string
          user_id: string
          district: string
          coordinates: unknown
          last_updated?: string
        }
        Update: {
          id?: string
          user_id?: string
          district?: string
          coordinates?: unknown
          last_updated?: string
        }
      }
      challenges: {
        Row: {
          id: string
          creator_id: string
          sport: string
          bid_amount: number
          status: 'open' | 'accepted' | 'completed' | 'canceled'
          start_time: string
          location: string
          coordinates: unknown // PostGIS geometry
          created_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          sport: string
          bid_amount?: number
          status?: 'open' | 'accepted' | 'completed' | 'canceled'
          start_time: string
          location: string
          coordinates: unknown
          created_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          sport?: string
          bid_amount?: number
          status?: 'open' | 'accepted' | 'completed' | 'canceled'
          start_time?: string
          location?: string
          coordinates?: unknown
          created_at?: string
        }
      }
      challenge_participants: {
        Row: {
          id: string
          challenge_id: string
          user_id: string
          status: 'pending' | 'accepted' | 'rejected'
        }
        Insert: {
          id?: string
          challenge_id: string
          user_id: string
          status?: 'pending' | 'accepted' | 'rejected'
        }
        Update: {
          id?: string
          challenge_id?: string
          user_id?: string
          status?: 'pending' | 'accepted' | 'rejected'
        }
      }
      matches: {
        Row: {
          id: string
          challenge_id: string
          winner_id: string
          loser_id: string
          score: string | null
          verified: boolean
          ended_at: string
        }
        Insert: {
          id?: string
          challenge_id: string
          winner_id: string
          loser_id: string
          score?: string | null
          verified?: boolean
          ended_at?: string
        }
        Update: {
          id?: string
          challenge_id?: string
          winner_id?: string
          loser_id?: string
          score?: string | null
          verified?: boolean
          ended_at?: string
        }
      }
      user_rankings: {
        Row: {
          id: string
          user_id: string
          sport: string
          district: string
          elo_rating: number
          wins: number
          losses: number
          rank: number | null
        }
        Insert: {
          id?: string
          user_id: string
          sport: string
          district: string
          elo_rating?: number
          wins?: number
          losses?: number
          rank?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          sport?: string
          district?: string
          elo_rating?: number
          wins?: number
          losses?: number
          rank?: number | null
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          match_id: string | null
          type: 'win' | 'lose' | 'achievement'
          image_url: string | null
          content: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          match_id?: string | null
          type: 'win' | 'lose' | 'achievement'
          image_url?: string | null
          content?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          match_id?: string | null
          type?: 'win' | 'lose' | 'achievement'
          image_url?: string | null
          content?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          data: Json
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          data?: Json
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          data?: Json
          read?: boolean
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          challenge_id: string
          payer_id: string
          amount: number
          status: 'held' | 'released' | 'refunded'
          stripe_payment_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          challenge_id: string
          payer_id: string
          amount: number
          status: 'held' | 'released' | 'refunded'
          stripe_payment_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          challenge_id?: string
          payer_id?: string
          amount?: number
          status?: 'held' | 'released' | 'refunded'
          stripe_payment_id?: string | null
          created_at?: string
        }
      }
    }
    Functions: {
      nearby_challenges: {
        Args: {
          user_latitude: number
          user_longitude: number
          radius_meters?: number
          sport_filter?: string | null
        }
        Returns: {
          id: string
          creator_id: string
          sport: string
          bid_amount: number
          status: string
          start_time: string
          location: string
          distance: number
          creator_name: string
        }[]
      }
      recalculate_ranks: {
        Args: Record<string, never>
        Returns: undefined
      }
    }
  }
}

// Helper types for common Supabase operations
export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row']

export type InsertDTO<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert']

export type UpdateDTO<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update']
