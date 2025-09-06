// src/hooks/useDashboardData.ts
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

      // Get user's basic stats
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('total_problems_solved, current_streak, best_streak, total_study_time_minutes')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      // Get submission stats for accuracy calculation
      const { data: submissions, error: submissionError } = await supabase
        .from('submissions')
        .select('status, time_spent_minutes')
        .eq('user_id', user.id);

      if (submissionError) throw submissionError;

      // Calculate stats
      const totalAttempts = submissions?.length || 0;
      const totalSolved = submissions?.filter(s => s.status === 'solved').length || 0;
      const accuracy = totalAttempts > 0 ? Math.round((totalSolved / totalAttempts) * 100) : 0;
      const totalMinutes = userData?.total_study_time_minutes || 0;
      const averageTime = totalSolved > 0 ? Math.round(totalMinutes / totalSolved) : 0;

      // Get weekly progress
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data: weeklyActivity, error: weeklyError } = await supabase
        .from('user_daily_activity')
        .select('problems_solved')
        .eq('user_id', user.id)
        .gte('activity_date', oneWeekAgo.toISOString().split('T')[0]);

      if (weeklyError) throw weeklyError;

      const weeklyProgress = weeklyActivity?.reduce((sum, day) => sum + (day.problems_solved || 0), 0) || 0;

      setStats({
        totalSolved: userData?.total_problems_solved || 0,
        currentStreak: userData?.current_streak || 0,
        averageTime,
        accuracy,
        totalHours: Math.round(totalMinutes / 60 * 10) / 10, // Convert to hours with 1 decimal
        weeklyGoal: 50, // This could be fetched from user_goals table
        weeklyProgress
      });

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

      // Get last 7 days
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date;
      });

      const { data: activities, error } = await supabase
        .from('user_daily_activity')
        .select('activity_date, problems_attempted, problems_solved')
        .eq('user_id', user.id)
        .gte('activity_date', dates[0].toISOString().split('T')[0])
        .lte('activity_date', dates[6].toISOString().split('T')[0]);

      if (error) throw error;

      // Map data to chart format
      const chartData = dates.map(date => {
        const dateStr = date.toISOString().split('T')[0];
        const dayData = activities?.find(a => a.activity_date === dateStr);
        
        return {
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          attempted: dayData?.problems_attempted || 0,
          solved: dayData?.problems_solved || 0
        };
      });

      setWeeklyData(chartData);
    } catch (error) {
      console.error('Error fetching weekly progress:', error);
      // Set empty data on error
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

      // First, get all topics
      const { data: topics, error: topicsError } = await supabase
        .from('topics')
        .select('id, name')
        .eq('is_active', true);

      if (topicsError) throw topicsError;

      // Get user progress by topic
      const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select('topic_id, problems_attempted, problems_solved, total_time_spent_minutes')
        .eq('user_id', user.id);

      if (progressError) throw progressError;

      const colors = ["#DC2626", "#EA580C", "#D97706", "#CA8A04", "#65A30D", "#16A34A"];

      // If no progress data, show topics with zero progress
      if (!progress || progress.length === 0) {
        const emptyData = topics?.slice(0, 6).map((topic, index) => ({
          name: topic.name,
          value: 0,
          color: colors[index] || "#6B7280",
          solved: 0,
          total: 0
        })) || [];

        setSubjectData(emptyData);
        setLoading(false);
        return;
      }

      // Create a map of topic names for easy lookup
      const topicMap = new Map(topics.map(topic => [topic.id, topic.name]));

      // Calculate total time for percentage
      const totalTime = progress.reduce((sum, p) => sum + (p.total_time_spent_minutes || 0), 0);

      const chartData = progress.map((item, index) => ({
        name: topicMap.get(item.topic_id) || 'Unknown Topic',
        value: totalTime > 0 ? Math.round((item.total_time_spent_minutes || 0) / totalTime * 100) : 0,
        color: colors[index] || "#6B7280",
        solved: item.problems_solved || 0,
        total: item.problems_attempted || 0
      }));

      setSubjectData(chartData);
    } catch (error) {
      console.error('Error fetching subject progress:', error);
      setSubjectData([]);
    } finally {
      setLoading(false);
    }
  };

  return { subjectData, loading, refetch: fetchSubjectProgress };
};