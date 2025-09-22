// src/pages/Practice.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/ui/navbar";
import { Search, Filter, Star, Clock, CheckCircle, Target, ArrowRight, Lock, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { submissionService } from "@/services/submissionService";
import { supabase } from "@/lib/supabase"; // ← adjust path if your client lives elsewhere

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  subject: string;
  industry: string;
  description: string;
  timeEstimate: string;
  companies: string[];
  isPremium: boolean;
}

interface UserSubmission {
  id: string;
  problem_id: string;
  status: "attempted" | "solved" | "partially_solved" | "skipped";
}

const Practice = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [submissionStats, setSubmissionStats] = useState({
    total: 0,
    solved: 0,
    attempted: 0,
    totalTime: 0,
    accuracy: 0,
  });
  const [loading, setLoading] = useState(true);
  const [processingProblem, setProcessingProblem] = useState<string | null>(null);

  // Mock problems data
  const problems: Problem[] = [
    {
      id: "ve-thermo-001",
      title: "Heat Engine Efficiency Analysis",
      difficulty: "medium",
      subject: "Thermodynamics",
      industry: "Automotive",
      description:
        "Design a heat engine operating between two thermal reservoirs and calculate efficiency.",
      timeEstimate: "30 min",
      companies: ["Ford", "GM", "Tesla"],
      isPremium: false,
    },
    {
      id: "ve-solid-002",
      title: "Beam Deflection Under Load",
      difficulty: "easy",
      subject: "Solid Mechanics",
      industry: "Civil",
      description:
        "Calculate maximum deflection of a simply supported beam under distributed load.",
      timeEstimate: "20 min",
      companies: ["Boeing", "Lockheed Martin"],
      isPremium: false,
    },
    {
      id: "ve-fluids-003",
      title: "Turbomachinery Design Challenge",
      difficulty: "hard",
      subject: "Fluid Dynamics",
      industry: "Aerospace",
      description:
        "Design a centrifugal compressor stage with given pressure ratio and efficiency requirements.",
      timeEstimate: "45 min",
      companies: ["SpaceX", "Blue Origin", "NASA"],
      isPremium: true,
    },
    {
      id: "ve-materials-004",
      title: "Material Selection for High Temperature",
      difficulty: "medium",
      subject: "Materials Science",
      industry: "Energy",
      description:
        "Select appropriate materials for gas turbine blades considering temperature and stress.",
      timeEstimate: "25 min",
      companies: ["GE", "Siemens", "Rolls-Royce"],
      isPremium: true,
    },
    {
      id: "ve-dynamics-005",
      title: "Vibration Analysis of Rotating Shaft",
      difficulty: "hard",
      subject: "Dynamics",
      industry: "Manufacturing",
      description:
        "Analyze critical speeds and vibration modes of a rotating shaft system.",
      timeEstimate: "40 min",
      companies: ["Caterpillar", "John Deere", "3M"],
      isPremium: true,
    },
    {
      id: "ve-heat-006",
      title: "Heat Transfer in Electronics Cooling",
      difficulty: "easy",
      subject: "Heat Transfer",
      industry: "Electronics",
      description:
        "Design cooling system for electronic components using natural convection.",
      timeEstimate: "25 min",
      companies: ["Apple", "Intel", "NVIDIA"],
      isPremium: false,
    },
    {
      id: "ve-statics-007",
      title: "Truss Force Analysis",
      difficulty: "easy",
      subject: "Statics",
      industry: "Civil",
      description:
        "Determine forces in truss members using method of joints.",
      timeEstimate: "20 min",
      companies: ["Bechtel", "AECOM"],
      isPremium: false,
    },
    {
      id: "ve-advanced-008",
      title: "Advanced Computational Fluid Analysis",
      difficulty: "hard",
      subject: "Advanced CFD",
      industry: "Aerospace",
      description:
        "Complex turbulence modeling for hypersonic vehicle design.",
      timeEstimate: "60 min",
      companies: ["NASA", "Boeing", "Lockheed Martin"],
      isPremium: true,
    },
  ];

  // Helpers
  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "easy";
      case "medium":
        return "medium";
      case "hard":
        return "hard";
      default:
        return "default";
    }
  };

  const getSubmissionStatus = (problemId: string) => {
    const submission = submissions.find((s) => s.problem_id === problemId);
    return submission?.status || null;
  };

  const getButtonText = (problemId: string) => {
    const status = getSubmissionStatus(problemId);
    switch (status) {
      case "solved":
        return "Review";
      case "partially_solved":
        return "Continue";
      case "attempted":
        return "Continue";
      case "skipped":
        return "Retry";
      default:
        return "Solve";
    }
  };

  const getButtonVariant = (problemId: string) => {
    const status = getSubmissionStatus(problemId);
    return status === "solved" ? "success" : "default";
  };

  // Initial load
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Fetch submissions + stats
  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userSubmissions = await submissionService.getUserSubmissions(user.id);
      setSubmissions(userSubmissions);

      const stats = await submissionService.getSubmissionStats(user.id);
      setSubmissionStats(stats);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔔 Broadcast listener (placed AFTER loadUserData so we can call it)
  useEffect(() => {
    if (!user) return;

    const ch = supabase
      .channel("ui-updates", { config: { broadcast: { self: false } } })
      .on("broadcast", { event: "attempts_changed" }, (msg) => {
        if (msg?.payload?.userId === user.id) {
          loadUserData(); // refresh list & stats when any attempt/solve happens
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Click → navigate + mark attempted (optimistic background)
  const handleProblemClick = (problemId: string) => {
    if (!user) {
      console.log("No user logged in");
      return;
    }

    navigate(`/practice/interface?problem=${problemId}`);

    submissionService
      .markAsAttempted(problemId)
      .then(() => {
        // local refresh in case broadcast is slow/offline
        loadUserData();
      })
      .catch((error) => {
        console.error("Background marking failed:", error);
      });
  };

  // Filters
  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === "all" || problem.difficulty === difficultyFilter;
    const matchesSubject =
      subjectFilter === "all" || problem.subject === subjectFilter;
    const matchesIndustry =
      industryFilter === "all" || problem.industry === industryFilter;

    return (
      matchesSearch &&
      matchesDifficulty &&
      matchesSubject &&
      matchesIndustry
    );
  });

  const freeProblems = filteredProblems.filter((p) => !p.isPremium);
  const premiumProblems = filteredProblems.filter((p) => p.isPremium);
  const canAccessPremium = (user as any)?.subscription_tier === "premium";

  return (
    <div className="min-h-screen bg-gradient-card">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Debug Test Button - Remove this after testing */}
        <Card className="mb-4 bg-yellow-50 border-yellow-200">
          <CardContent className="pt-4">
            <h3 className="font-semibold mb-2">🧪 Debug Test</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => navigate("/practice/interface?problem=ve-thermo-001")}
              >
                Test Direct Navigation
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  console.log("🧪 Current user:", user);
                  console.log("🧪 Current submissions:", submissions);
                }}
              >
                Log Debug Info
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Practice Problems</h1>
              <p className="text-muted-foreground">
                Master mechanical engineering interviews with real questions
              </p>
            </div>

            <div className="flex gap-4">
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-primary">
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  ) : (
                    submissionStats.solved
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Solved</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-accent">
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  ) : (
                    Math.round(submissionStats.totalTime / 60)
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Hours</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-warning">
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  ) : (
                    `${submissionStats.accuracy}%`
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </Card>
            </div>
          </div>

          {/* Interactive Practice Mode Banner */}
          <Card className="border-primary shadow-strong bg-gradient-primary text-white mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    🚀 Interactive Practice Mode
                  </h3>
                  <p className="text-white/90 text-sm">
                    Experience real interview conditions with whiteboard, timer,
                    and structured feedback
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

        {/* Free Problems */}
        {freeProblems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-success" />
              Free Problems ({freeProblems.length})
            </h2>
            <div className="space-y-4">
              {freeProblems.map((problem) => (
                <Card
                  key={problem.id}
                  className="shadow-medium hover:shadow-strong transition-all duration-200 hover:scale-[1.01]"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getSubmissionStatus(problem.id) && (
                            <CheckCircle className="w-5 h-5 text-success" />
                          )}
                          <Badge variant={getDifficultyVariant(problem.difficulty)}>
                            {problem.difficulty.charAt(0).toUpperCase() +
                              problem.difficulty.slice(1)}
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
                        <p className="text-muted-foreground mt-2">
                          {problem.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                          <Target className="w-4 h-4" />
                          <span>Asked at: {problem.companies.join(", ")}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Star className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={getButtonVariant(problem.id)}
                          onClick={() => handleProblemClick(problem.id)}
                        >
                          {getButtonText(problem.id)}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Premium Problems */}
        {premiumProblems.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-warning" />
              Premium Problems ({premiumProblems.length})
            </h2>
            <div className="space-y-4">
              {premiumProblems.map((problem) => (
                <Card
                  key={problem.id}
                  className={`shadow-medium ${
                    !canAccessPremium
                      ? "opacity-60"
                      : "hover:shadow-strong transition-all duration-200 hover:scale-[1.01]"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {!canAccessPremium && (
                            <Lock className="w-4 h-4 text-warning" />
                          )}
                          {canAccessPremium && getSubmissionStatus(problem.id) && (
                            <CheckCircle className="w-5 h-5 text-success" />
                          )}
                          <Badge variant={getDifficultyVariant(problem.difficulty)}>
                            {problem.difficulty.charAt(0).toUpperCase() +
                              problem.difficulty.slice(1)}
                          </Badge>
                          <Badge variant="outline">{problem.subject}</Badge>
                          <Badge variant="outline">{problem.industry}</Badge>
                          <Badge variant="warning" className="text-xs">
                            Premium
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {problem.timeEstimate}
                          </div>
                        </div>
                        <CardTitle
                          className={`text-lg ${
                            canAccessPremium ? "hover:text-primary cursor-pointer" : ""
                          } transition-colors`}
                        >
                          {problem.title}
                        </CardTitle>
                        <p className="text-muted-foreground mt-2">
                          {problem.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                          <Target className="w-4 h-4" />
                          <span>Asked at: {problem.companies.join(", ")}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm" disabled={!canAccessPremium}>
                          <Star className="w-4 h-4" />
                        </Button>
                        {canAccessPremium ? (
                          <Button
                            variant={getButtonVariant(problem.id)}
                            onClick={() => handleProblemClick(problem.id)}
                          >
                            {getButtonText(problem.id)}
                          </Button>
                        ) : (
                          <Button variant="outline" asChild>
                            <Link to="/upgrade">
                              <Lock className="w-4 h-4 mr-1" />
                              Upgrade
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upgrade Banner */}
        {!canAccessPremium && premiumProblems.length > 0 && (
          <Card className="mt-8 border-warning shadow-strong bg-gradient-to-r from-warning/10 to-warning/5">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Unlock All Problems</h3>
                <p className="text-muted-foreground mb-4">
                  Get access to {premiumProblems.length} premium problems and advanced
                  features
                </p>
                <Button variant="hero" size="lg" asChild>
                  <Link to="/upgrade">Upgrade to Premium - $30/month</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
