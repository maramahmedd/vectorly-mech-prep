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
  ArrowRight, Calendar, Users
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, loading } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-card">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
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

  // Clean subject data with better formatting and colors
  const subjectData = [
    { name: "Thermodynamics", value: 28, color: "#DC2626", solved: 12, total: 18 },
    { name: "Fluid Mechanics", value: 22, color: "#EA580C", solved: 8, total: 15 },
    { name: "Solid Mechanics", value: 20, color: "#D97706", solved: 15, total: 22 },
    { name: "Materials Science", value: 15, color: "#CA8A04", solved: 7, total: 12 },
    { name: "Heat Transfer", value: 10, color: "#65A30D", solved: 3, total: 8 },
    { name: "Dynamics", value: 5, color: "#16A34A", solved: 2, total: 6 },
  ];

  const weeklyProgress = [
    { day: "Mon", attempted: 8, solved: 6 },
    { day: "Tue", attempted: 12, solved: 9 },
    { day: "Wed", attempted: 15, solved: 12 },
    { day: "Thu", attempted: 10, solved: 8 },
    { day: "Fri", attempted: 14, solved: 11 },
    { day: "Sat", attempted: 6, solved: 5 },
    { day: "Sun", attempted: 4, solved: 3 },
  ];

  const industryPrep = [
    { industry: "Automotive", problems: 15, hours: 8.5 },
    { industry: "Aerospace", problems: 12, hours: 7.2 },
    { industry: "Energy", problems: 8, hours: 4.8 },
    { industry: "Manufacturing", problems: 6, hours: 3.2 },
  ];

  // Mock user stats - in real app, fetch from Firestore
  const userStats = {
    totalSolved: 47,
    currentStreak: 7,
    averageTime: 24,
    accuracy: 87,
    totalHours: 28.5,
    weeklyGoal: 50
  };

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
    return `${entry.value}%`;
  };

  // KPI Component
  function Kpi({ label, value, sub, icon: Icon, trend }: { 
    label: string; 
    value: string; 
    sub?: string; 
    icon: any;
    trend?: "up" | "down" | "neutral";
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
          <div className="text-3xl font-semibold">{value}</div>
          {sub && (
            <div className={`text-xs flex items-center gap-1 ${
              trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              {trend === 'up' && <TrendingUp className="w-3 h-3" />}
              {sub}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

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
                <>{user.major} • {user.university} • Class of {user.graduationYear}</>
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
            value={userStats.totalSolved.toString()} 
            sub="↑ 6 this week" 
            icon={Target}
            trend="up"
          />
          <Kpi 
            label="Current Streak" 
            value={`${userStats.currentStreak}d`} 
            sub="🔥 Personal best: 23d" 
            icon={Flame}
          />
          <Kpi 
            label="Accuracy Rate" 
            value={`${userStats.accuracy}%`} 
            sub="↑ 3% this month" 
            icon={TrendingUp}
            trend="up"
          />
          <Kpi 
            label="Study Hours" 
            value={`${userStats.totalHours}h`} 
            sub="This month" 
            icon={Clock}
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
              <Badge variant="outline">{userStats.totalSolved}/{userStats.weeklyGoal} problems</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={(userStats.totalSolved / userStats.weeklyGoal) * 100} className="h-3 mb-2" />
            <p className="text-sm text-muted-foreground">
              {userStats.weeklyGoal - userStats.totalSolved} problems remaining to reach your weekly goal
            </p>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2 shadow-medium">
            <CardHeader>
              <CardTitle>Weekly Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyProgress}>
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
            </CardContent>
          </Card>

          {/* CLEAN PIE CHART */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Subject Focus</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectData}
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
              <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                {subjectData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>
                ))}
              </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjectData.map((subject) => (
                <div key={subject.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{subject.name}</span>
                    <span className="text-muted-foreground">{subject.solved}/{subject.total}</span>
                  </div>
                  <Progress value={(subject.solved / subject.total) * 100} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {Math.round((subject.solved / subject.total) * 100)}% completed
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Industry Preparation */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Industry Preparation</CardTitle>
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

        {/* Achievement Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-medium border-l-4 border-l-success">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Trophy className="w-6 h-6 text-success" />
                </div>
                <div>
                  <div className="font-semibold">Hot Streak!</div>
                  <div className="text-sm text-muted-foreground">7-day solving streak</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium border-l-4 border-l-warning">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Target className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <div className="font-semibold">Almost There!</div>
                  <div className="text-sm text-muted-foreground">3 more problems for weekly goal</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-medium border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Subject Expert</div>
                  <div className="text-sm text-muted-foreground">80% completion in Solid Mechanics</div>
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