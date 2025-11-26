// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { config } from './env'

export const supabase = createClient(config.supabase.url, config.supabase.anonKey)

// Database types (generated with Supabase CLI)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          university?: string
          major?: string
          graduation_year?: string
          created_at: string
          updated_at: string
          last_login_at?: string
          is_active: boolean
          subscription_tier: 'free' | 'premium'
          subscription_expires_at?: string
          total_problems_solved: number
          current_streak: number
          best_streak: number
          last_activity_date?: string
          total_study_time_minutes: number
          preferred_industries: string[]
        }
        Insert: {
          id: string
          name: string
          email: string
          university?: string
          major?: string
          graduation_year?: string
          subscription_tier?: 'free' | 'premium'
          preferred_industries?: string[]
        }
        Update: {
          name?: string
          university?: string
          major?: string
          graduation_year?: string
          subscription_tier?: 'free' | 'premium'
          preferred_industries?: string[]
        }
      }
      problems: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          difficulty: 'easy' | 'medium' | 'hard'
          topic_id: string
          industry: string
          estimated_time_minutes: number
          theory_links: string[]
          hints: string[]
          solution?: string
          solution_explanation?: string
          created_at: string
          updated_at: string
          is_active: boolean
          difficulty_score: number
          upvotes: number
          downvotes: number
          view_count: number
        }
      }
      submissions: {
        Row: {
          id: string
          user_id: string
          problem_id: string
          status: 'attempted' | 'solved' | 'partially_solved' | 'skipped'
          user_answer?: string
          time_spent_minutes: number
          hints_used: number
          created_at: string
          updated_at: string
          accuracy_score?: number
          notes?: string
        }
        Insert: {
          user_id: string
          problem_id: string
          status: 'attempted' | 'solved' | 'partially_solved' | 'skipped'
          user_answer?: string
          time_spent_minutes?: number
          hints_used?: number
          accuracy_score?: number
          notes?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          topic_id: string
          problems_attempted: number
          problems_solved: number
          total_time_spent_minutes: number
          mastery_score: number
          last_practiced_at?: string
          created_at: string
          updated_at: string
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string
          icon?: string
          category: string
          requirement_type: string
          requirement_value: number
          requirement_data?: any
          points: number
          rarity: 'common' | 'rare' | 'epic' | 'legendary'
          created_at: string
          is_active: boolean
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          earned_at: string
          progress_data?: any
        }
      }
    }
  }
}

