// src/services/submissionService.ts
import { supabase } from '@/lib/supabase'

export interface SubmissionData {
  problem_id: string
  status: 'attempted' | 'solved' | 'partially_solved' | 'skipped'
  user_answer?: string
  time_spent_minutes: number
  hints_used?: number
  accuracy_score?: number
  notes?: string
}

export const submissionService = {
  async submitAnswer(data: SubmissionData) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: submission, error } = await supabase
      .from('submissions')
      .insert({
        user_id: user.id,
        ...data
      })
      .select()
      .single()

    if (error) throw error

    // Update problem view count
    await supabase.rpc('increment_view_count', { problem_id: data.problem_id })

    return submission
  },

  async getUserSubmissions(userId: string, limit?: number) {
    let query = supabase
      .from('submissions')
      .select(`
        *,
        problems(title, slug, difficulty, topic_id)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getSubmissionStats(userId: string) {
    const { data, error } = await supabase
      .from('submissions')
      .select('status, time_spent_minutes')
      .eq('user_id', userId)

    if (error) throw error

    const stats = {
      total: data.length,
      solved: data.filter(s => s.status === 'solved').length,
      attempted: data.filter(s => s.status === 'attempted').length,
      totalTime: data.reduce((sum, s) => sum + s.time_spent_minutes, 0)
    }

    return stats
  }
}

