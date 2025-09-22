// src/hooks/useDashboardData.ts (Fixed version)
import { useState, useEffect } from 'react';
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

export const useDashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalSolved: 0,
    currentStreak: 0,
    averageTime: 0,
    accuracy: 0,
    totalHours: 0,
    weeklyGoal: 50,
    weeklyProgress: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchDashboardStats();
  }, [user]);

  const fetchDashboardStats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching dashboard stats for user:', user.id);

      // Get user's basic stats from the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('total_problems_solved, current_streak, best_streak, total_study_time_minutes')
        .eq('id', user.id)
        .single();

      if (userError) {
        console.log('User data error (this is normal for new users):', userError);
        // For new users, we'll create default stats
      }

      // Get all submissions for this user
      const { data: submissions, error: submissionError } = await supabase
        .from('submissions')
        .select('status, time_spent_minutes, created_at')
        .eq('user_id', user.id);

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

      // Use submission data as the source of truth, fallback to user table data
      const finalStats: DashboardStats = {
        totalSolved: totalSolved,
        currentStreak: userData?.current_streak || 0,
        averageTime,
        accuracy,
        totalHours: Math.round(totalMinutes / 60 * 10) / 10,
        weeklyGoal: 50, // This could be user-configurable
        weeklyProgress
      };

      console.log('Calculated stats:', finalStats);
      setStats(finalStats);

    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, refetch: fetchDashboardStats };
};

export const useWeeklyProgress = () => {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchWeeklyProgress();
  }, [user]);

  const fetchWeeklyProgress = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Fetching weekly progress for user:', user.id);

      // Get last 7 days of submissions
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date;
      });

      const startDate = dates[0];
      startDate.setHours(0, 0, 0, 0);
      const endDate = dates[6];
      endDate.setHours(23, 59, 59, 999);

      const { data: submissions, error } = await supabase
        .from('submissions')
        .select('created_at, status')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) {
        console.error('Weekly submissions error:', error);
        throw error;
      }

      console.log('Weekly submissions:', submissions);

      // Map data to chart format
      const chartData = dates.map(date => {
        const dateStr = date.toISOString().split('T')[0];
        const daySubmissions = submissions?.filter(s => 
          s.created_at.startsWith(dateStr)
        ) || [];
        
        return {
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          attempted: daySubmissions.length,
          solved: daySubmissions.filter(s => s.status === 'solved').length
        };
      });

      console.log('Weekly chart data:', chartData);
      setWeeklyData(chartData);
    } catch (error) {
      console.error('Error fetching weekly progress:', error);
      // Set empty data on error but with proper structure
      const emptyData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          attempted: 0,
          solved: 0
        };
      });
      setWeeklyData(emptyData);
    } finally {
      setLoading(false);
    }
  };

  return { weeklyData, loading, refetch: fetchWeeklyProgress };
};

export const useSubjectProgress = () => {
  const { user } = useAuth();
  const [subjectData, setSubjectData] = useState<SubjectProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchSubjectProgress();
  }, [user]);

  const fetchSubjectProgress = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Fetching subject progress for user:', user.id);

      // Get all submissions with subject mapping
      const { data: submissions, error: submissionError } = await supabase
        .from('submissions')
        .select('problem_id, status, time_spent_minutes')
        .eq('user_id', user.id);

      if (submissionError) {
        console.error('Subject submissions error:', submissionError);
        throw submissionError;
      }

      console.log('Subject submissions:', submissions);

      // Mock mapping of problem IDs to subjects (since we don't have a problems table yet)
      const problemSubjectMap: Record<string, string> = {
        've-thermo-001': 'Thermodynamics',
        've-solid-002': 'Solid Mechanics',
        've-fluids-003': 'Fluid Dynamics',
        've-materials-004': 'Materials Science',
        've-dynamics-005': 'Dynamics',
        've-heat-006': 'Heat Transfer',
        've-statics-007': 'Statics',
        've-advanced-008': 'Advanced CFD'
      };

      // Group submissions by subject
      const subjectStats: Record<string, { attempted: number; solved: number; time: number }> = {};
      
      submissions?.forEach(submission => {
        const subject = problemSubjectMap[submission.problem_id] || 'Other';
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

      // Calculate total time for percentage
      const totalTime = Object.values(subjectStats).reduce((sum, stats) => sum + stats.time, 0);

      const chartData = Object.entries(subjectStats).map(([subject, stats], index) => ({
        name: subject,
        value: totalTime > 0 ? Math.round((stats.time / totalTime) * 100) : 0,
        color: colors[index] || "#6B7280",
        solved: stats.solved,
        total: stats.attempted
      }));

      // If no data, show default subjects
      if (chartData.length === 0) {
        const defaultSubjects = ['Thermodynamics', 'Solid Mechanics', 'Fluid Dynamics', 'Materials Science'];
        const emptyData = defaultSubjects.map((subject, index) => ({
          name: subject,
          value: 0,
          color: colors[index] || "#6B7280",
          solved: 0,
          total: 0
        }));
        setSubjectData(emptyData);
      } else {
        setSubjectData(chartData);
      }

      console.log('Subject chart data:', chartData);
      
    } catch (error) {
      console.error('Error fetching subject progress:', error);
      setSubjectData([]);
    } finally {
      setLoading(false);
    }
  };

  return { subjectData, loading, refetch: fetchSubjectProgress };
};