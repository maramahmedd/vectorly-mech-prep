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

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch real data from Supabase
  const { stats, loading: statsLoading } = useDashboardStats();
  const { weeklyData, loading: weeklyLoading } = useWeeklyProgress();
  const { subjectData, loading: subjectLoading } = useSubjectProgress();

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <svg
                className="w-8 h-8 text-black"
                fill="currentColor"
                viewBox="0 0 53 48"
              >
                <path d="M45.0379 0C51.1627 0 54.9872 6.62654 51.9177 11.9204L41.0495 30.6637C40.5418 31.5393 39.4195 31.8381 38.5429 31.331C37.6662 30.8239 37.3671 29.703 37.8748 28.8273L48.743 10.084C50.3961 7.23303 48.3364 3.6643 45.0379 3.6643C43.5102 3.66432 42.0983 4.47729 41.3327 5.79767L30.3497 24.7408C29.249 26.6393 29.2454 28.9802 30.3405 30.882L33.3731 36.1488C34.7788 38.59 34.7787 41.5937 33.3729 44.0348C30.3294 49.3195 22.6963 49.3223 19.6489 44.0398L1.06662 11.8288C-1.96768 6.56892 1.83324 0 7.91101 0C10.7297 1.871e-05 13.3349 1.5002 14.7472 3.93668L20.1168 13.2004C20.6243 14.0761 20.325 15.197 19.4483 15.704C18.5715 16.211 17.4493 15.912 16.9417 15.0363L11.5721 5.77263C10.8157 4.46778 9.42057 3.66432 7.91101 3.6643C4.65598 3.6643 2.62028 7.18238 4.2453 9.99937L22.8276 42.2104C24.463 45.0453 28.5594 45.0438 30.1927 42.2077C30.9472 40.8976 30.9473 39.2856 30.1929 37.9755L27.1603 32.7089C25.412 29.6726 25.4177 25.9355 27.1751 22.9044L38.1581 3.96131C39.5796 1.50956 42.2013 1.47685e-05 45.0379 0Z" />
              </svg>
              <h1 className="text-xl font-semibold">Vectorly</h1>
            </div>

            <div className="flex gap-6 items-center">
              <button
                onClick={() => navigate('/')}
                className="font-semibold text-sm hover:text-black transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => navigate('/practice')}
                className="font-semibold text-sm hover:text-black transition-colors"
              >
                Practice
              </button>
              <button
                className="font-semibold text-sm text-black border-b-2 border-black"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="mb-2">Dashboard</h1>
          <p className="text-gray-600">Track your progress and mastery across engineering topics</p>
        </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      )}

      {/* Stats Cards */}
      {!loading && (
        <>
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
        </>
      )}
      </div>
    </div>
  );
}
