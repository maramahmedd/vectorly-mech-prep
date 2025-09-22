// src/services/submissionService.ts
import { supabase } from '@/lib/supabase';

// --- Realtime helpers ---
let uiChannel: ReturnType<typeof supabase.channel> | null = null;

function getUiChannel() {
  if (!uiChannel) {
    uiChannel = supabase.channel('ui-updates', { config: { broadcast: { self: false } } });
    uiChannel.subscribe();
  }
  return uiChannel;
}

async function broadcastAttemptsChanged() {
  // Obtain current user id safely inside the service
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;
  if (!userId) return;

  getUiChannel().send({
    type: 'broadcast',
    event: 'attempts_changed',
    payload: { userId },
  });
}

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

    console.log('Submitting answer:', data);

    try {
      // Use upsert to handle both create and update in one operation
      const { data: submission, error } = await supabase
        .from('submissions')
        .upsert({
          user_id: user.id,
          problem_id: data.problem_id,
          status: data.status,
          user_answer: data.user_answer,
          time_spent_minutes: Math.max(0, data.time_spent_minutes), // Ensure non-negative
          hints_used: data.hints_used || 0,
          accuracy_score: data.accuracy_score,
          notes: data.notes,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,problem_id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) {
        console.error('Upsert failed, trying manual check:', error);
        
        // Fallback: manual check and update/insert
        const { data: existingSubmission, error: fetchError } = await supabase
          .from('submissions')
          .select('*')
          .eq('user_id', user.id)
          .eq('problem_id', data.problem_id)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (existingSubmission) {
          // Update existing
          const { data: updatedSubmission, error: updateError } = await supabase
            .from('submissions')
            .update({
              status: data.status,
              user_answer: data.user_answer,
              time_spent_minutes: Math.max(existingSubmission.time_spent_minutes, data.time_spent_minutes),
              hints_used: Math.max(existingSubmission.hints_used, data.hints_used || 0),
              accuracy_score: data.accuracy_score,
              notes: data.notes,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingSubmission.id)
            .select()
            .single();

          if (updateError) throw updateError;
          console.log('Updated existing submission:', updatedSubmission);
          await broadcastAttemptsChanged(); // 🔔 notify UI
          return updatedSubmission;
        } else {
          // Create new
          const { data: newSubmission, error: insertError } = await supabase
            .from('submissions')
            .insert({
              user_id: user.id,
              problem_id: data.problem_id,
              status: data.status,
              user_answer: data.user_answer,
              time_spent_minutes: Math.max(0, data.time_spent_minutes),
              hints_used: data.hints_used || 0,
              accuracy_score: data.accuracy_score,
              notes: data.notes
            })
            .select()
            .single();

          if (insertError) throw insertError;
          console.log('Created new submission:', newSubmission);
          await broadcastAttemptsChanged(); // 🔔 notify UI
          return newSubmission;
        }
      }

      console.log('Upserted submission successfully:', submission);
      await broadcastAttemptsChanged(); // 🔔 notify UI (success via upsert)
      return submission;
    } catch (error) {
      console.error('Error in submitAnswer:', error);
      throw error;
    }
  },

  async markAsAttempted(problemId: string): Promise<UserSubmission> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    console.log('Marking problem as attempted:', problemId);

    // Check if already exists
    const { data: existing, error: fetchError } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', user.id)
      .eq('problem_id', problemId)
      .maybeSingle();

    if (fetchError) {
      console.error('Error checking existing submission:', fetchError);
      throw fetchError;
    }

    if (existing) {
      console.log('Submission already exists:', existing);
      await broadcastAttemptsChanged(); // 🔔 keep UI in sync even if it already existed
      return existing;
    }

    // Create new attempted submission
    const created = await this.submitAnswer({
      problem_id: problemId,
      status: 'attempted',
      time_spent_minutes: 0,
      hints_used: 0
    });

    // submitAnswer already broadcasts on success, but calling again is harmless
    await broadcastAttemptsChanged();
    return created;
  },

  async getUserSubmissions(userId: string, limit?: number): Promise<UserSubmission[]> {
    console.log('Fetching user submissions for:', userId);
    
    let query = supabase
      .from('submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching user submissions:', error);
      throw error;
    }
    
    console.log('Fetched submissions:', data);
    return data || [];
  },

  async getUserSubmissionForProblem(userId: string, problemId: string): Promise<UserSubmission | null> {
    console.log('Fetching submission for user:', userId, 'problem:', problemId);
    
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', userId)
      .eq('problem_id', problemId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user submission for problem:', error);
      throw error;
    }

    console.log('Found submission:', data);
    return data;
  },

  async getSubmissionStats(userId: string) {
    console.log('Fetching submission stats for:', userId);
    
    const { data, error } = await supabase
      .from('submissions')
      .select('status, time_spent_minutes, created_at')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching submission stats:', error);
      throw error;
    }

    const submissions = data || [];
    console.log('Submissions for stats:', submissions);

    const stats = {
      total: submissions.length,
      attempted: submissions.filter(s => s.status === 'attempted').length,
      solved: submissions.filter(s => s.status === 'solved').length,
      partially_solved: submissions.filter(s => s.status === 'partially_solved').length,
      skipped: submissions.filter(s => s.status === 'skipped').length,
      totalTime: submissions.reduce((sum, s) => sum + (s.time_spent_minutes || 0), 0),
      accuracy: submissions.length > 0 ? Math.round((submissions.filter(s => s.status === 'solved').length / submissions.length) * 100) : 0
    };

    console.log('Calculated stats:', stats);
    return stats;
  }
};
