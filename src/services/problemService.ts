// src/services/problemService.ts
import { supabase } from '@/lib/supabase'

export interface Problem {
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
  companies?: Array<{ name: string; industry: string }>
}

export interface ProblemFilters {
  difficulty?: string
  topic?: string
  industry?: string
  search?: string
}

export const problemService = {
  async getProblems(filters: ProblemFilters = {}) {
    let query = supabase
      .from('problems')
      .select(`
        *,
        topics(name, slug),
        problem_companies(
          companies(name, industry)
        )
      `)
      .eq('is_active', true)

    if (filters.difficulty && filters.difficulty !== 'all') {
      query = query.eq('difficulty', filters.difficulty)
    }

    if (filters.industry && filters.industry !== 'all') {
      query = query.eq('industry', filters.industry)
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getProblemBySlug(slug: string) {
    const { data, error } = await supabase
      .from('problems')
      .select(`
        *,
        topics(name, slug),
        problem_companies(
          companies(name, industry)
        )
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return data
  },

  async getUserProgress(userId: string) {
    const { data, error } = await supabase
      .from('user_progress')
      .select(`
        *,
        topics(name, slug)
      `)
      .eq('user_id', userId)

    if (error) throw error
    return data
  }
}

