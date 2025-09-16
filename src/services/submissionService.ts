// src/services/submissionService.ts
import { supabase } from '@/lib/supabase';

export interface SubmissionData {
  problem_id: string;
  status: 'attempted' | 'solved' | 'partially_solved' | 'skipped';
  user_answer?: string;
  time_spent_minutes: number;
  hints_used?: number;
  accuracy_score?: number;
  notes?: string;
}

export interface UserSubmission {
  id: string;
  user_id: string;
  problem_id: string;
  status: 'attempted' | 'solved' | 'partially_solved' | 'skipped';
  user_answer?: string;
  time_spent_minutes: number;
  hints_used: number;
  created_at: string;
  updated_at: string;
  accuracy_score?: number;
  notes?: string;
}

export const submissionService = {
  async submitAnswer(data: SubmissionData): Promise<UserSubmission> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if submission already exists
    const { data: existingSubmission } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', user.id)
      .eq('problem_id', data.problem_id)
      .single();

    if (existingSubmission) {
      // Update existing submission
      const { data: submission, error } = await supabase
        .from('submissions')
        .update({
          status: data.status,
          user_answer: data.user_answer,
          time_spent_minutes: data.time_spent_minutes,
          hints_used: data.hints_used || 0,
          accuracy_score: data.accuracy_score,
          notes: data.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSubmission.id)
        .select()
        .single();

      if (error) throw error;
      return submission;
    } else {
      // Create new submission
      const { data: submission, error } = await supabase
        .from('submissions')
        .insert({
          user_id: user.id,
          problem_id: data.problem_id,
          status: data.status,
          user_answer: data.user_answer,
          time_spent_minutes: data.time_spent_minutes,
          hints_used: data.hints_used || 0,
          accuracy_score: data.accuracy_score,
          notes: data.notes
        })
        .select()
        .single();

      if (error) throw error;
      return submission;
    }
  },

  async markAsAttempted(problemId: string): Promise<UserSubmission> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if already attempted
    const { data: existing } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', user.id)
      .eq('problem_id', problemId)
      .single();

    if (existing) {
      return existing;
    }

    // Mark as attempted
    return this.submitAnswer({
      problem_id: problemId,
      status: 'attempted',
      time_spent_minutes: 0,
      hints_used: 0
    });
  },

  async getUserSubmissions(userId: string, limit?: number): Promise<UserSubmission[]> {
    let query = supabase
      .from('submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getUserSubmissionForProblem(userId: string, problemId: string): Promise<UserSubmission | null> {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', userId)
      .eq('problem_id', problemId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async getSubmissionStats(userId: string) {
    const { data, error } = await supabase
      .from('submissions')
      .select('status, time_spent_minutes')
      .eq('user_id', userId);

    if (error) throw error;

    const stats = {
      total: data.length,
      attempted: data.filter(s => s.status === 'attempted').length,
      solved: data.filter(s => s.status === 'solved').length,
      partially_solved: data.filter(s => s.status === 'partially_solved').length,
      skipped: data.filter(s => s.status === 'skipped').length,
      totalTime: data.reduce((sum, s) => sum + s.time_spent_minutes, 0),
      accuracy: data.length > 0 ? Math.round((data.filter(s => s.status === 'solved').length / data.length) * 100) : 0
    };

    return stats;
  }
};