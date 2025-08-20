import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/ui/navbar";
import { Calendar, TrendingUp, Target, Award, BookOpen, Clock, Flame, Star } from "lucide-react";

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
    rank: "Advanced"
  };

  const difficultyStats = [
    { level: "Easy", solved: 25, total: 45, color: "bg-success" },
    { level: "Medium", solved: 18, total: 67, color: "bg-warning" },
    { level: "Hard", solved: 4, total: 44, color: "bg-destructive" }
  ];

  const subjectStats = [
    { subject: "Thermodynamics", solved: 12, total: 28, progress: 43 },
    { subject: "Solid Mechanics", solved: 15, total: 32, progress: 47 },
    { subject: "Fluid Dynamics", solved: 8, total: 25, progress: 32 },
    { subject: "Materials Science", solved: 7, total: 22, progress: 32 },
    { subject: "Dynamics", solved: 3, total: 18, progress: 17 },
    { subject: "Heat Transfer", solved: 2, total: 31, progress: 6 }
  ];

  const recentActivity = [
    { date: "2024-01-15", problem: "Heat Engine Efficiency Analysis", difficulty: "medium", solved: true },
    { date: "2024-01-14", problem: "Beam Deflection Under Load", difficulty: "easy", solved: true },
    { date: "2024-01-13", problem: "Material Selection for High Temperature", difficulty: "medium", solved: true },
    { date: "2024-01-12", problem: "Vibration Analysis of Rotating Shaft", difficulty: "hard", solved: false },
    { date: "2024-01-11", problem: "Heat Transfer in Electronics Cooling", difficulty: "easy", solved: true }
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

  return (
    <div className="min-h-screen bg-gradient-card">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <Card className="flex-1 shadow-medium">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {userStats.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{userStats.name}</CardTitle>
                    <p className="text-muted-foreground">{userStats.major} • {userStats.university}</p>
                    <p className="text-sm text-muted-foreground">Class of {userStats.graduationYear}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userStats.totalSolved}</div>
                    <div className="text-sm text-muted-foreground">Problems Solved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{userStats.currentStreak}</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">{userStats.accuracy}%</div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning">{userStats.averageTime}</div>
                    <div className="text-sm text-muted-foreground">Avg Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:w-80 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Progress</span>
                      <span>{Math.round((userStats.totalSolved / userStats.totalProblems) * 100)}%</span>
                    </div>
                    <Progress value={(userStats.totalSolved / userStats.totalProblems) * 100} className="h-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {difficultyStats.map((stat) => (
                      <div key={stat.level} className="p-3 rounded-lg bg-gradient-card">
                        <div className="text-lg font-semibold">{stat.solved}</div>
                        <div className="text-xs text-muted-foreground">{stat.level}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Activity Calendar */}
          <div className="lg:col-span-2">
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

            {/* Subject Progress */}
            <Card className="mt-8 shadow-medium">
              <CardHeader>
                <CardTitle>Subject Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjectStats.map((subject) => (
                    <div key={subject.subject}>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{subject.subject}</span>
                        <span>{subject.solved}/{subject.total}</span>
                      </div>
                      <Progress value={subject.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Achievements */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.title}
                      className={`p-3 rounded-lg border text-center ${
                        achievement.earned
                          ? "bg-gradient-primary text-white border-primary"
                          : "bg-muted/50 text-muted-foreground border-muted"
                      }`}
                    >
                      <achievement.icon className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-xs font-medium">{achievement.title}</div>
                    </div>
                  ))}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;