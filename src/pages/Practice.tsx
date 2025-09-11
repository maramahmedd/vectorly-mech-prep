// src/pages/Practice.tsx (Updated)
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/ui/navbar";
import { Search, Filter, Star, Clock, CheckCircle, Target, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Practice = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");

  const problems = [
    {
      id: 1,
      title: "Heat Engine Efficiency Analysis",
      difficulty: "medium",
      subject: "Thermodynamics",
      industry: "Automotive",
      description: "Design a heat engine operating between two thermal reservoirs and calculate efficiency.",
      solved: true,
      timeEstimate: "30 min",
      companies: ["Ford", "GM", "Tesla"]
    },
    {
      id: 2,
      title: "Beam Deflection Under Load",
      difficulty: "easy",
      subject: "Solid Mechanics",
      industry: "Civil",
      description: "Calculate maximum deflection of a simply supported beam under distributed load.",
      solved: false,
      timeEstimate: "20 min",
      companies: ["Boeing", "Lockheed Martin"]
    },
    {
      id: 3,
      title: "Turbomachinery Design Challenge",
      difficulty: "hard",
      subject: "Fluid Dynamics",
      industry: "Aerospace",
      description: "Design a centrifugal compressor stage with given pressure ratio and efficiency requirements.",
      solved: false,
      timeEstimate: "45 min",
      companies: ["SpaceX", "Blue Origin", "NASA"]
    },
    {
      id: 4,
      title: "Material Selection for High Temperature",
      difficulty: "medium",
      subject: "Materials Science",
      industry: "Energy",
      description: "Select appropriate materials for gas turbine blades considering temperature and stress.",
      solved: true,
      timeEstimate: "25 min",
      companies: ["GE", "Siemens", "Rolls-Royce"]
    },
    {
      id: 5,
      title: "Vibration Analysis of Rotating Shaft",
      difficulty: "hard",
      subject: "Dynamics",
      industry: "Manufacturing",
      description: "Analyze critical speeds and vibration modes of a rotating shaft system.",
      solved: false,
      timeEstimate: "40 min",
      companies: ["Caterpillar", "John Deere", "3M"]
    },
    {
      id: 6,
      title: "Heat Transfer in Electronics Cooling",
      difficulty: "easy",
      subject: "Heat Transfer",
      industry: "Electronics",
      description: "Design cooling system for electronic components using natural convection.",
      solved: false,
      timeEstimate: "25 min",
      companies: ["Apple", "Intel", "NVIDIA"]
    }
  ];

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "easy";
      case "medium": return "medium";
      case "hard": return "hard";
      default: return "default";
    }
  };

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === "all" || problem.difficulty === difficultyFilter;
    const matchesSubject = subjectFilter === "all" || problem.subject === subjectFilter;
    const matchesIndustry = industryFilter === "all" || problem.industry === industryFilter;
    
    return matchesSearch && matchesDifficulty && matchesSubject && matchesIndustry;
  });

  const stats = {
    totalSolved: problems.filter(p => p.solved).length,
    totalProblems: problems.length,
    currentStreak: 7
  };

  return (
    <div className="min-h-screen bg-gradient-card">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Practice Problems</h1>
              <p className="text-muted-foreground">Master mechanical engineering interviews with real questions</p>
            </div>
            
            <div className="flex gap-4">
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-primary">{stats.totalSolved}</div>
                <div className="text-sm text-muted-foreground">Solved</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-accent">{stats.currentStreak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-warning">{stats.totalProblems}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </Card>
            </div>
          </div>

          {/* New Practice Mode Banner */}
          <Card className="border-primary shadow-strong bg-gradient-primary text-white mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">🚀 New: Interactive Practice Mode</h3>
                  <p className="text-white/90 text-sm">
                    Experience real interview conditions with whiteboard, timer, and structured feedback
                  </p>
                </div>
                <Button variant="secondary" size="lg" asChild>
                  <Link to="interface">
                    Try Interactive Mode
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="Thermodynamics">Thermodynamics</SelectItem>
                  <SelectItem value="Solid Mechanics">Solid Mechanics</SelectItem>
                  <SelectItem value="Fluid Dynamics">Fluid Dynamics</SelectItem>
                  <SelectItem value="Materials Science">Materials Science</SelectItem>
                  <SelectItem value="Dynamics">Dynamics</SelectItem>
                  <SelectItem value="Heat Transfer">Heat Transfer</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="Automotive">Automotive</SelectItem>
                  <SelectItem value="Aerospace">Aerospace</SelectItem>
                  <SelectItem value="Energy">Energy</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Civil">Civil</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Problems List */}
        <div className="space-y-4">
          {filteredProblems.map((problem) => (
            <Card key={problem.id} className="shadow-medium hover:shadow-strong transition-all duration-200 hover:scale-[1.01]">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {problem.solved && <CheckCircle className="w-5 h-5 text-success" />}
                      <Badge variant={getDifficultyVariant(problem.difficulty)}>
                        {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                      </Badge>
                      <Badge variant="outline">{problem.subject}</Badge>
                      <Badge variant="outline">{problem.industry}</Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {problem.timeEstimate}
                      </div>
                    </div>
                    <CardTitle className="text-lg hover:text-primary cursor-pointer transition-colors">
                      {problem.title}
                    </CardTitle>
                    <p className="text-muted-foreground mt-2">{problem.description}</p>
                    <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                      <Target className="w-4 h-4" />
                      <span>Asked at: {problem.companies.join(", ")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Star className="w-4 h-4" />
                    </Button>
                    <Button variant={problem.solved ? "success" : "default"} asChild>
                      <Link to="interface">    {/* link relative to current route bc using HashRouter (vs absolute route) */}
                        {problem.solved ? "Review" : "Solve"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No problems found matching your filters.</p>
                <p>Try adjusting your search criteria.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Practice;