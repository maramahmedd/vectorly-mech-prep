// src/pages/Dashboard.tsx - Complete updated version
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/ui/navbar";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { 
  Trophy, Target, Clock, TrendingUp, BookOpen, Award, Flame, Star,
  ArrowRight, Calendar, Users, Loader2
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { Link } from 'react-router-dom';
import { useDashboardStats, useWeeklyProgress, useSubjectProgress } from '@/hooks/useDashboardData';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { stats, loading: statsLoading } = useDashboardStats();
  const { weeklyData, loading: weeklyLoading } = useWeeklyProgress();
  const { subjectData, loading: subjectLoading } = useSubjectProgress();

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-card">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show auth prompt if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-card">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome to Vectorly</CardTitle>
              <p className="text-muted-foreground">
                Sign in to access your personal dashboard and track your mechanical engineering interview prep progress
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <AuthDialog defaultMode="signup">
                  <Button size="lg" className="flex-1">
                    Get Started Free
                  </Button>
                </AuthDialog>
                <AuthDialog defaultMode="login">
                  <Button variant="outline" size="lg" className="flex-1">
                    Sign In
                  </Button>
                </AuthDialog>
              </div>
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Join thousands of ME students</p>
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-primary" />
                    <span>500+ Students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span>1000+ Problems</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Custom tooltip for cleaner pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-primary">{data.value}% of study time</p>
          <p className="text-sm text-muted-foreground">
            {data.solved}/{data.total} problems solved
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label function for pie chart
  const renderLabel = (entry: any) => {
    return entry.value > 0 ? `${entry.value}%` : '';
  };

  // KPI Component
  function Kpi({ label, value, sub, icon: Icon, trend, loading }: { 
    label: string; 
    value: string; 
    sub?: string; 
    icon: any;
    trend?: "up" | "down" | "neutral";
    loading?: boolean;
  }) {
    return (
      <Card className="shadow-medium hover:shadow-strong transition-all duration-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
            <Icon className="w-4 h-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="flex items-end gap-2">
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          ) : (
            <>
              <div className="text-3xl font-semibold">{value}</div>
              {sub && (
                <div className={`text-xs flex items-center gap-1 ${
                  trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
                }`}>
                  {trend === 'up' && <TrendingUp className="w-3 h-3" />}
                  {sub}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  // Mock industry data (since we don't have this data yet)
  const industryPrep = [
    { industry: "Automotive", problems: 0, hours: 0 },
    { industry: "Aerospace", problems: 0, hours: 0 },
    { industry: "Energy", problems: 0, hours: 0 },
    { industry: "Manufacturing", problems: 0, hours: 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-card">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
            <p className="text-muted-foreground">
              {user.university && user.major ? (
                <>{user.major} • {user.university} • Class of {user.graduation_year}</>
              ) : (
                'Ready to ace your mechanical engineering interviews?'
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Trophy className="mr-2 h-4 w-4"/>
              View Achievements
            </Button>
            <Button variant="hero">
              <Target className="mr-2 h-4 w-4"/>
              Set Goals
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Kpi 
            label="Problems Solved" 
            value={stats.totalSolved.toString()} 
            sub={stats.weeklyProgress > 0 ? `↑ ${stats.weeklyProgress} this week` : "Start solving!"} 
            icon={Target}
            trend={stats.weeklyProgress > 0 ? "up" : "neutral"}
            loading={statsLoading}
          />
          <Kpi 
            label="Current Streak" 
            value={`${stats.currentStreak}d`} 
            sub={stats.currentStreak > 0 ? `🔥 Keep it up!` : "Start your streak!"} 
            icon={Flame}
            loading={statsLoading}
          />
          <Kpi 
            label="Accuracy Rate" 
            value={`${stats.accuracy}%`} 
            sub={stats.totalSolved > 0 ? "Great progress!" : "No attempts yet"} 
            icon={TrendingUp}
            loading={statsLoading}
          />
          <Kpi 
            label="Study Hours" 
            value={`${stats.totalHours}h`} 
            sub="This month" 
            icon={Clock}
            loading={statsLoading}
          />
        </div>

        {/* Weekly Goal Progress */}
        <Card className="shadow-medium">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-warning" />
                Weekly Goal Progress
              </CardTitle>
              <Badge variant="outline">{stats.weeklyProgress}/{stats.weeklyGoal} problems</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading progress...</span>
              </div>
            ) : (
              <>
                <Progress value={(stats.weeklyProgress / stats.weeklyGoal) * 100} className="h-3 mb-2" />
                <p className="text-sm text-muted-foreground">
                  {stats.weeklyGoal - stats.weeklyProgress > 0 
                    ? `${stats.weeklyGoal - stats.weeklyProgress} problems remaining to reach your weekly goal`
                    : "🎉 Congratulations! You've reached your weekly goal!"
                  }
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2 shadow-medium">
            <CardHeader>
              <CardTitle>Weekly Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              {weeklyLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="attempted" 
                      stroke="#8884d8" 
                      strokeWidth={2} 
                      name="Attempted"
                      dot={{ r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="solved" 
                      stroke="#82ca9d" 
                      strokeWidth={2} 
                      name="Solved"
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* CLEAN PIE CHART */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Subject Focus</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              {subjectLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : subjectData.length > 0 && subjectData.some(item => item.value > 0) ? (
                <>
                  <ResponsiveContainer width="100%" height="70%">
                    <PieChart>
                      <Pie
                        data={subjectData.filter(item => item.value > 0)}
                        cx="50%"
                        cy="45%"
                        outerRadius={70}
                        dataKey="value"
                        label={renderLabel}
                        labelLine={false}
                      >
                        {subjectData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Clean Legend */}
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {subjectData.filter(item => item.value > 0).map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="truncate">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No study data yet</p>
                  <p className="text-xs text-muted-foreground">Start solving problems to see your progress!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Subject Progress Detail */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Subject Mastery Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            {subjectLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading subject progress...</span>
              </div>
            ) : subjectData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjectData.map((subject) => (
                  <div key={subject.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{subject.name}</span>
                      <span className="text-muted-foreground">{subject.solved}/{subject.total}</span>
                    </div>
                    <Progress 
                      value={subject.total > 0 ? (subject.solved / subject.total) * 100 : 0} 
                      className="h-2" 
                    />
                    <div className="text-xs text-muted-foreground">
                      {subject.total > 0 
                        ? `${Math.round((subject.solved / subject.total) * 100)}% completed`
                        : 'No problems attempted yet'
                      }
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-muted-foreground">No progress data available yet</p>
                <Button asChild className="mt-4">
                  <Link to="/practice">Start Practicing</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Industry Preparation */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Industry Preparation</CardTitle>
            <p className="text-sm text-muted-foreground">Coming soon - practice problems by industry focus</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={industryPrep}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="industry" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="problems" fill="#8884d8" name="Problems Solved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-medium hover:shadow-strong transition-all cursor-pointer group">
            <CardContent className="pt-6 text-center">
              <Target className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-1">Practice Problems</h3>
              <p className="text-sm text-muted-foreground mb-3">Solve new interview questions</p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/practice">
                  Start Practicing <ArrowRight className="ml-1 w-3 h-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-medium hover:shadow-strong transition-all cursor-pointer group">
            <CardContent className="pt-6 text-center">
              <BookOpen className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-1">Study Theory</h3>
              <p className="text-sm text-muted-foreground mb-3">Review fundamental concepts</p>
              <Button variant="outline" size="sm">
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-medium hover:shadow-strong transition-all cursor-pointer group">
            <CardContent className="pt-6 text-center">
              <Trophy className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-1">Mock Interview</h3>
              <p className="text-sm text-muted-foreground mb-3">Practice with AI interviewer</p>
              <Button variant="outline" size="sm">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Highlights - Show empty state for now */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-medium border-l-4 border-l-muted">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted/10 rounded-lg">
                  <Trophy className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-semibold text-muted-foreground">Ready to Start!</div>
                  <div className="text-sm text-muted-foreground">Solve your first problem to earn achievements</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Set Your Goals</div>
                  <div className="text-sm text-muted-foreground">Customize your weekly problem-solving target</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium border-l-4 border-l-accent">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <BookOpen className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="font-semibold">Learn & Grow</div>
                  <div className="text-sm text-muted-foreground">Track progress across all ME subjects</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;