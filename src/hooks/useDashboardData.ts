// src/hooks/useDashboardData.ts - Refactored with React Query
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface DashboardStats {
  totalSolved: number;
  currentStreak: number;
  averageTime: number;
  accuracy: number;
  totalHours: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

export interface WeeklyData {
  day: string;
  attempted: number;
  solved: number;
}

export interface SubjectProgress {
  name: string;
  value: number;
  color: string;
  solved: number;
  total: number;
}

// Fetch function for dashboard stats
const fetchDashboardStats = async (userId: string): Promise<DashboardStats> => {
  console.log('Fetching dashboard stats for user:', userId);

  // Get user's basic stats from the users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('total_problems_solved, current_streak, best_streak, total_study_time_minutes')
    .eq('id', userId)
    .single();

  if (userError) {
    console.log('User data error (this is normal for new users):', userError);
  }

  // Get all submissions for this user
  const { data: submissions, error: submissionError } = await supabase
    .from('submissions')
    .select('status, time_spent_minutes, created_at')
    .eq('user_id', userId);

  if (submissionError) {
    console.error('Submissions error:', submissionError);
    throw submissionError;
  }

  console.log('Loaded submissions:', submissions);

  // Calculate stats from submissions
  const totalAttempts = submissions?.length || 0;
  const totalSolved = submissions?.filter(s => s.status === 'solved').length || 0;
  const accuracy = totalAttempts > 0 ? Math.round((totalSolved / totalAttempts) * 100) : 0;
  const totalMinutes = submissions?.reduce((sum, s) => sum + (s.time_spent_minutes || 0), 0) || 0;
  const averageTime = totalSolved > 0 ? Math.round(totalMinutes / totalSolved) : 0;

  // Get weekly progress (last 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const weeklySubmissions = submissions?.filter(s => {
    const submissionDate = new Date(s.created_at);
    return submissionDate >= oneWeekAgo && s.status === 'solved';
  }) || [];

  const weeklyProgress = weeklySubmissions.length;

  return {
    totalSolved,
    currentStreak: userData?.current_streak || 0,
    averageTime,
    accuracy,
    totalHours: Math.round(totalMinutes / 60 * 10) / 10,
    weeklyGoal: 50,
    weeklyProgress
  };
};

/**
 * Hook to fetch dashboard statistics with React Query
 * Features:
 * - Automatic caching (5 minutes)
 * - Automatic refetching on window focus
 * - Manual refetch available
 */
export const useDashboardStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      return fetchDashboardStats(user.id);
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Fetch function for weekly progress
const fetchWeeklyProgress = async (userId: string): Promise<WeeklyData[]> => {
  console.log('Fetching weekly progress for user:', userId);

  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - (6 - i));
    date.setHours(0, 0, 0, 0);
    return date;
  });

  const startDate = new Date(dates[0]);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(dates[6]);
  endDate.setHours(23, 59, 59, 999);

  const { data: submissions, error } = await supabase
    .from('submissions')
    .select('created_at, status')
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (error) {
    console.error('Weekly submissions error:', error);
    throw error;
  }

  console.log('Weekly submissions fetched:', submissions?.length || 0);

  return dates.map(date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const localDateStr = `${year}-${month}-${day}`;

    const daySubmissions = submissions?.filter(s => {
      const submissionDate = new Date(s.created_at);
      const subYear = submissionDate.getFullYear();
      const subMonth = String(submissionDate.getMonth() + 1).padStart(2, '0');
      const subDay = String(submissionDate.getDate()).padStart(2, '0');
      const submissionLocalDateStr = `${subYear}-${subMonth}-${subDay}`;
      return submissionLocalDateStr === localDateStr;
    }) || [];

    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      attempted: daySubmissions.length,
      solved: daySubmissions.filter(s => s.status === 'solved').length
    };
  });
};

/**
 * Hook to fetch weekly progress data with React Query
 */
export const useWeeklyProgress = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['weekly-progress', user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      return fetchWeeklyProgress(user.id);
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};

// Fetch function for subject progress
const fetchSubjectProgress = async (userId: string): Promise<SubjectProgress[]> => {
  console.log('Fetching subject progress for user:', userId);

  const { data: submissions, error: submissionError } = await supabase
    .from('submissions')
    .select('problem_id, status, time_spent_minutes')
    .eq('user_id', userId);

  if (submissionError) {
    console.error('Subject submissions error:', submissionError);
    throw submissionError;
  }

  console.log('Subject submissions:', submissions);

  const { mockProblems } = await import('@/data/mockProblems');

  const problemMap: Record<string, { topic: string; field: string }> = {};
  mockProblems.forEach(p => {
    problemMap[p.id] = { topic: p.topic, field: p.field };
  });

  const subjectStats: Record<string, { attempted: number; solved: number; time: number }> = {};

  submissions?.forEach(submission => {
    const problemInfo = problemMap[submission.problem_id];
    const subject = problemInfo?.topic || 'Other';
    if (!subjectStats[subject]) {
      subjectStats[subject] = { attempted: 0, solved: 0, time: 0 };
    }
    subjectStats[subject].attempted++;
    if (submission.status === 'solved') {
      subjectStats[subject].solved++;
    }
    subjectStats[subject].time += submission.time_spent_minutes || 0;
  });

  const colors = ["#DC2626", "#EA580C", "#D97706", "#CA8A04", "#65A30D", "#16A34A", "#059669", "#0891B2"];
  const totalTime = Object.values(subjectStats).reduce((sum, stats) => sum + stats.time, 0);

  const chartData = Object.entries(subjectStats).map(([subject, stats], index) => ({
    name: subject,
    value: totalTime > 0 ? Math.round((stats.time / totalTime) * 100) : 0,
    color: colors[index] || "#6B7280",
    solved: stats.solved,
    total: stats.attempted
  }));

  if (chartData.length === 0) {
    const defaultSubjects = ['Thermodynamics', 'Solid Mechanics', 'Fluid Dynamics', 'Materials Science'];
    return defaultSubjects.map((subject, index) => ({
      name: subject,
      value: 0,
      color: colors[index] || "#6B7280",
      solved: 0,
      total: 0
    }));
  }

  return chartData;
};

/**
 * Hook to fetch subject progress data with React Query
 */
export const useSubjectProgress = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['subject-progress', user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      return fetchSubjectProgress(user.id);
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
