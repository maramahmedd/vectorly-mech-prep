import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Trophy, Target, Zap, Clock, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useDashboardStats, useWeeklyProgress, useSubjectProgress } from '@/hooks/useDashboardData';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch real data from Supabase with React Query
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: weeklyData, isLoading: weeklyLoading } = useWeeklyProgress();
  const { data: subjectData, isLoading: subjectLoading } = useSubjectProgress();

  const loading = statsLoading || weeklyLoading || subjectLoading;

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Please log in to view your dashboard</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Show skeleton while loading
  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="mb-2">Dashboard</h1>
          <p className="text-gray-600">Track your progress and mastery across engineering topics</p>
        </div>

      {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Current Streak</span>
                <Zap className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-3xl mb-1">{stats.currentStreak}</div>
              <p className="text-sm text-gray-500">days in a row</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Problems Solved</span>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-3xl mb-1">{stats.totalSolved}</div>
              <p className="text-sm text-gray-500">total completed</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Accuracy Rate</span>
                <Target className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl mb-1">{stats.accuracy}%</div>
              <p className="text-sm text-gray-500">correct solutions</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Study Hours</span>
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl mb-1">{stats.totalHours}</div>
              <p className="text-sm text-gray-500">total hours</p>
            </Card>
          </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Progress */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5" />
              <h3>Weekly Progress</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="attempted" fill="#9ca3af" radius={[8, 8, 0, 0]} name="Attempted" />
                <Bar dataKey="solved" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Solved" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Subject Distribution */}
          <Card className="p-6">
            <h3 className="mb-6">Subject Distribution</h3>
            {subjectData.length === 0 || subjectData.every(s => s.value === 0) ? (
              <div className="flex items-center justify-center h-[300px] text-gray-400">
                <div className="text-center">
                  <p className="text-lg mb-2">No data yet</p>
                  <p className="text-sm">Start solving problems to see your subject distribution</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => value > 0 ? `${name}: ${value}%` : ''}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        {/* Subject Mastery Radar Chart */}
        <Card className="p-6 mb-8">
          <h3 className="mb-6">Subject Mastery</h3>
          {subjectData.length === 0 || subjectData.every(s => s.total === 0) ? (
            <div className="flex items-center justify-center h-[400px] text-gray-400">
              <div className="text-center">
                <p className="text-lg mb-2">No mastery data yet</p>
                <p className="text-sm">Solve problems to build your subject mastery</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={subjectData.map(s => ({
                subject: s.name,
                mastery: s.total > 0 ? Math.round((s.solved / s.total) * 100) : 0
              }))}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Mastery"
                  dataKey="mastery"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Subject Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {subjectData.map((subject) => {
            const mastery = subject.total > 0 ? Math.round((subject.solved / subject.total) * 100) : 0;
            return (
              <Card key={subject.name} className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3>{subject.name}</h3>
                  <span className="text-2xl">{mastery}%</span>
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  {subject.solved} solved / {subject.total} attempted
                </div>
                <Progress value={mastery} className="mb-2" />
                <p className="text-sm text-gray-500">
                  {mastery < 30
                    ? 'Beginner - Keep practicing!'
                    : mastery < 60
                    ? 'Intermediate - Good progress!'
                    : mastery < 80
                    ? 'Advanced - Almost there!'
                    : 'Expert - Well done!'}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
