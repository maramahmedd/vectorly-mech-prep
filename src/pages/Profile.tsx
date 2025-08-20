import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/ui/navbar";
import { Calendar, TrendingUp, Target, Award, BookOpen, Clock, Flame, Star, Trophy, User, BarChart3 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Profile = () => {
  const userStats = {
    name: "Alex Chen",
    university: "MIT",
    major: "Mechanical Engineering",
    graduationYear: "2025",
    totalSolved: 47,
    totalProblems: 156,
    currentStreak: 7,
    longestStreak: 23,
    averageTime: "28 min",
    accuracy: 87,
    rank: "Advanced",
    totalHours: 28.5,
    weeklyGoal: 50
  };

  // Dashboard data
  const weeklyProgress = [
    { day: "Mon", attempted: 8, solved: 6 },
    { day: "Tue", attempted: 12, solved: 9 },
    { day: "Wed", attempted: 15, solved: 12 },
    { day: "Thu", attempted: 10, solved: 8 },
    { day: "Fri", attempted: 14, solved: 11 },
    { day: "Sat", attempted: 6, solved: 5 },
    { day: "Sun", attempted: 4, solved: 3 },
  ];

  const subjectDistribution = [
    { subject: "Thermodynamics", value: 28, solved: 12, total: 18 },
    { subject: "Fluid Mechanics", value: 22, solved: 8, total: 15 },
    { subject: "Solid Mechanics", value: 20, solved: 15, total: 22 },
    { subject: "Materials Science", value: 15, solved: 7, total: 12 },
    { subject: "Heat Transfer", value: 10, solved: 3, total: 8 },
    { subject: "Dynamics", value: 5, solved: 2, total: 6 },
  ];

  const COLORS = ["#DC2626", "#EA580C", "#D97706", "#CA8A04", "#65A30D", "#16A34A"];

  const difficultyStats = [
    { level: "Easy", solved: 25, total: 45, color: "bg-success" },
    { level: "Medium", solved: 18, total: 67, color: "bg-warning" },
    { level: "Hard", solved: 4, total: 44, color: "bg-destructive" }
  ];

  const recentActivity = [
    { date: "2024-01-15", problem: "Heat Engine Efficiency Analysis", difficulty: "medium", solved: true, timeSpent: 28 },
    { date: "2024-01-14", problem: "Beam Deflection Under Load", difficulty: "easy", solved: true, timeSpent: 15 },
    { date: "2024-01-13", problem: "Material Selection for High Temperature", difficulty: "medium", solved: true, timeSpent: 22 },
    { date: "2024-01-12", problem: "Vibration Analysis of Rotating Shaft", difficulty: "hard", solved: false, timeSpent: 45 },
    { date: "2024-01-11", problem: "Heat Transfer in Electronics Cooling", difficulty: "easy", solved: true, timeSpent: 25 }
  ];

  const achievements = [
    { title: "First Steps", description: "Solved your first problem", icon: Target, earned: true },
    { title: "Hot Streak", description: "7-day solving streak", icon: Flame, earned: true },
    { title: "Subject Master", description: "80% completion in any subject", icon: BookOpen, earned: false },
    { title: "Speed Demon", description: "Solve 10 problems under average time", icon: Clock, earned: false },
    { title: "All-Rounder", description: "Solve problems in all subjects", icon: Star, earned: false },
    { title: "Expert Level", description: "Solve 20 hard problems", icon: Award, earned: false }
  ];

  // Generate calendar data for streak visualization
  const generateCalendarData = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 90); // Last 90 days
    
    const calendarData = [];
    for (let i = 0; i < 91; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Mock activity data
      const activity = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0;
      calendarData.push({
        date: date.toISOString().split('T')[0],
        count: activity
      });
    }
    return calendarData;
  };

  const calendarData = generateCalendarData();

  const getActivityColor = (count: number) => {
    if (count === 0) return "bg-muted";
    if (count === 1) return "bg-success/30";
    if (count === 2) return "bg-success/60";
    return "bg-success";
  };

  // KPI Component for Dashboard
  function Kpi({ label, value, sub, icon: Icon, trend }: { 
    label: string; 
    value: string; 
    sub?: string; 
    icon: any;
    trend?: "up" | "down" | "neutral";
  }) {
    return (
      <Card className="rounded-2xl shadow-medium hover:shadow-strong transition-all duration-200">
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
      
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="shadow-medium">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {userStats.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl">{userStats.name}</CardTitle>
                  <p className="text-muted-foreground">{userStats.major} • {userStats.university}</p>
                  <p className="text-sm text-muted-foreground">Class of {userStats.graduationYear}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-2">{userStats.rank}</Badge>
                  <div className="text-sm text-muted-foreground">
                    Rank: #{Math.floor(Math.random() * 500) + 100}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs for Profile sections */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Achievements
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
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
            <Card className="rounded-2xl shadow-medium">
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
              <Card className="xl:col-span-2 rounded-2xl shadow-medium">
                <CardHeader>
                  <CardTitle>Weekly Performance</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyProgress} margin={{ left: 8, right: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="attempted" 
                        stroke="#8884d8" 
                        strokeWidth={2} 
                        dot={false}
                        name="Attempted"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="solved" 
                        stroke="#82ca9d" 
                        strokeWidth={2} 
                        dot={false}
                        name="Solved"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-medium">
                <CardHeader>
                  <CardTitle>Subject Focus</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip 
                        formatter={(value, name) => [`${value}%`, 'Time Spent']}
                      />
                      <Legend />
                      <Pie 
                        data={subjectDistribution} 
                        dataKey="value" 
                        nameKey="subject" 
                        outerRadius={80} 
                        label={({subject, value}) => `${subject}: ${value}%`}
                      >
                        {subjectDistribution.map((entry, i) => (
                          <Cell key={entry.subject} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Subject Progress Detail */}
            <Card className="rounded-2xl shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Subject Mastery Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjectDistribution.map((subject) => (
                    <div key={subject.subject} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{subject.subject}</span>
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
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            {/* Activity Calendar */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Activity Calendar
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Current streak: {userStats.currentStreak} days • Longest streak: {userStats.longestStreak} days
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-13 gap-1">
                  {calendarData.map((day, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-sm ${getActivityColor(day.count)}`}
                      title={`${day.date}: ${day.count} problems solved`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-muted"></div>
                    <div className="w-3 h-3 rounded-sm bg-success/30"></div>
                    <div className="w-3 h-3 rounded-sm bg-success/60"></div>
                    <div className="w-3 h-3 rounded-sm bg-success"></div>
                  </div>
                  <span>More</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium truncate">{activity.problem}</div>
                        <div className="text-xs text-muted-foreground">{activity.date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={activity.difficulty === "easy" ? "easy" : activity.difficulty === "medium" ? "medium" : "hard"} className="text-xs">
                          {activity.difficulty}
                        </Badge>
                        <div className="text-xs text-muted-foreground">{activity.timeSpent}m</div>
                        {activity.solved ? (
                          <div className="w-2 h-2 rounded-full bg-success"></div>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-destructive"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" size="sm">
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.title}
                      className={`p-4 rounded-lg border text-center transition-all duration-200 ${
                        achievement.earned
                          ? "bg-gradient-primary text-white border-primary shadow-medium hover:shadow-strong"
                          : "bg-muted/50 text-muted-foreground border-muted hover:bg-muted/70"
                      }`}
                    >
                      <achievement.icon className="w-8 h-8 mx-auto mb-3" />
                      <div className="text-sm font-medium mb-1">{achievement.title}</div>
                      <div className="text-xs opacity-80">{achievement.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {difficultyStats.map((stat) => (
                <Card key={stat.level} className="text-center shadow-medium">
                  <CardHeader>
                    <CardTitle className="text-lg">{stat.level}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">{stat.solved}</div>
                    <div className="text-sm text-muted-foreground mb-3">out of {stat.total}</div>
                    <Progress value={(stat.solved / stat.total) * 100} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;