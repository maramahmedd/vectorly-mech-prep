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

// Type matching the actual problems table in Supabase
export interface DbProblem {
  id: string
  title: string
  description: string
  prompt?: string
  difficulty: 'easy' | 'medium' | 'hard'
  subject: string
  industry: string
  time_estimate: string
  time_limit_minutes?: number
  companies: string[]
  hints?: string[]
  solution?: string
  solution_explanation?: string
  is_premium: boolean
  created_at?: string
  question_type?: 'free_text' | 'multiple_choice'
  mc_options?: Array<{key: string; text: string}>
  mc_correct_answer?: string
}

export interface ProblemFilters {
  difficulty?: string
  topic?: string
  industry?: string
  search?: string
  subject?: string
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

// Function specifically for the Practice page with proper filters
export async function listProblems(filters: {
  search?: string
  difficulty?: string
  subject?: string
  industry?: string
}): Promise<DbProblem[]> {
  let query = supabase
    .from('problems')
    .select('*')

  // Apply filters
  if (filters.search && filters.search.trim() !== '') {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters.difficulty && filters.difficulty !== 'all') {
    query = query.eq('difficulty', filters.difficulty)
  }

  if (filters.subject && filters.subject !== 'all') {
    query = query.eq('subject', filters.subject)
  }

  if (filters.industry && filters.industry !== 'all') {
    query = query.eq('industry', filters.industry)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching problems:', error)
    throw error
  }

  return data as DbProblem[]
}

// Get a single problem by ID
export async function getProblemById(problemId: string): Promise<DbProblem | null> {
  const { data, error } = await supabase
    .from('problems')
    .select('*')
    .eq('id', problemId)
    .single()

  if (error) {
    console.error('Error fetching problem:', error)
    return null
  }

  return data as DbProblem
}

