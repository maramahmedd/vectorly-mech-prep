// src/pages/PracticeInterface.tsx (Updated with all fixes)
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Navbar from "@/components/ui/navbar";
import { useAuth } from "@/contexts/AuthContext";
import { submissionService } from "@/services/submissionService";
import { getProblemById, type DbProblem } from "@/services/problemService";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { 
  AlarmClock, BookText, Calculator, Check, ChevronRight, ChevronLeft, ClipboardCopy, Clock, FileQuestion,
  Flag, HelpCircle, Highlighter, Info, Lightbulb, Loader2, Mic, MicOff, NotebookPen, Play, 
  Save, Settings, Sparkles, Square, StopCircle, TimerReset, Trash2, Upload, Home, Star,
  Target, TrendingUp, ChevronDown, Lock
} from "lucide-react";

// Countdown timer hook
function useCountdown(minutes = 45) {
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const [running, setRunning] = useState(true);
  
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [running]);
  
  const mins = Math.floor(secondsLeft / 60);
  const secs = (secondsLeft % 60).toString().padStart(2, "0");
  return { secondsLeft, display: `${mins}:${secs}`, running, setRunning, setSecondsLeft };
}

// Whiteboard Canvas Component
const Whiteboard = ({ height = 280 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(3);
  const [erase, setErase] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const handlePointer = (type: string, e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x: number, y: number;

    // Support both mouse and touch events
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    if (type === "down") {
      setDrawing(true);
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else if (type === "move" && drawing) {
      ctx.globalCompositeOperation = erase ? "destination-out" : "source-over";
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = "#0f172a";
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (type === "up") {
      setDrawing(false);
    }
  };

  const clearBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-3">
        <Badge variant="outline" className="text-xs">Whiteboard</Badge>
        <div className="flex items-center gap-2">
          <Highlighter className="w-4 h-4" />
          <Slider 
            value={[lineWidth]} 
            max={10} 
            min={1} 
            step={1} 
            onValueChange={(v) => setLineWidth(v[0])} 
            className="w-20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch id="erase" checked={erase} onCheckedChange={setErase} />
          <label htmlFor="erase" className="text-xs text-muted-foreground">Eraser</label>
        </div>
        <Button size="sm" variant="outline" onClick={clearBoard}>
          <Trash2 className="w-3 h-3 mr-1"/>Clear
        </Button>
      </div>
      <div className="rounded-lg border-2 border-dashed border-muted bg-background">
        <canvas
          ref={canvasRef}
          className="w-full rounded-lg cursor-crosshair touch-none"
          style={{ height: `${height}px` }}
          onMouseDown={(e) => handlePointer("down", e)}
          onMouseMove={(e) => handlePointer("move", e)}
          onMouseUp={(e) => handlePointer("up", e)}
          onMouseLeave={(e) => handlePointer("up", e)}
          onTouchStart={(e) => { e.preventDefault(); handlePointer("down", e); }}
          onTouchMove={(e) => { e.preventDefault(); handlePointer("move", e); }}
          onTouchEnd={(e) => { e.preventDefault(); handlePointer("up", e); }}
        />
      </div>
    </div>
  );
};

// Vectorly Question Bank
const VECTORLY_QUESTIONS = [
  {
    id: "ve-thermo-001",
    type: "Technical",
    subject: "Thermodynamics",
    industry: "Automotive",
    difficulty: "Medium",
    title: "Heat Engine Efficiency Analysis",
    prompt: "Design a heat engine operating between two thermal reservoirs at 800K and 300K. Calculate the maximum theoretical efficiency and explain how real-world factors would affect this efficiency in an automotive application. Consider practical limitations and propose improvements.",
    timeLimit: 30,
    companies: ["Tesla", "Ford", "GM"],
    hints: [
      "Start with the Carnot efficiency formula for maximum theoretical efficiency",
      "Consider friction, heat losses, and material limitations in real engines", 
      "Think about automotive-specific constraints like weight, cost, and emissions"
    ],
    isPremium: false
  },
  {
    id: "ve-solid-002", 
    type: "Technical",
    subject: "Solid Mechanics",
    industry: "Aerospace",
    difficulty: "Medium",
    title: "Beam Deflection Under Load",
    prompt: "A 1.5m cantilever beam with rectangular cross-section (30mm × 60mm) supports a 500N load at the tip. Calculate the maximum deflection and stress. If the deflection must be under 3mm, propose design changes and discuss trade-offs.",
    timeLimit: 25,
    companies: ["Boeing", "SpaceX", "Lockheed Martin"],
    hints: [
      "Use the cantilever beam deflection formula: δ = FL³/(3EI)",
      "Calculate moment of inertia: I = bh³/12 for rectangular section",
      "Consider material properties, geometry changes, and weight implications"
    ],
    isPremium: false
  },
  {
    id: "ve-fluids-003",
    type: "Technical", 
    subject: "Fluid Mechanics",
    industry: "Energy",
    difficulty: "Hard",
    title: "Turbine Design Challenge",
    prompt: "Design a small wind turbine for residential use. Estimate the power output for 15 m/s wind speed, determine optimal blade geometry, and address practical challenges like noise, maintenance, and grid integration.",
    timeLimit: 40,
    companies: ["GE", "Siemens", "Vestas"],
    hints: [
      "Apply Betz limit and actuator disk theory for maximum theoretical power",
      "Consider tip-speed ratio and blade angle optimization",
      "Think about real-world constraints: noise regulations, maintenance access, electrical integration"
    ],
    isPremium: true
  },
  {
    id: "ve-materials-004",
    type: "Technical",
    subject: "Materials Science", 
    industry: "Manufacturing",
    difficulty: "Medium",
    title: "Material Selection for High Temperature",
    prompt: "Select materials for a heat exchanger operating at 450°C with aggressive chemical exposure. Compare at least three material options, considering cost, performance, and manufacturing constraints.",
    timeLimit: 20,
    companies: ["3M", "Caterpillar", "John Deere"],
    hints: [
      "Consider high-temperature strength, corrosion resistance, and thermal conductivity",
      "Evaluate stainless steels, superalloys, and ceramic options",
      "Factor in material cost, availability, and manufacturing processes"
    ],
    isPremium: true
  }
];

// Hint System Component
function HintSystem({ hints = [] }) {
  const [revealedHints, setRevealedHints] = useState(0);
  
  const revealNext = () => setRevealedHints(prev => Math.min(hints.length, prev + 1));
  const resetHints = () => setRevealedHints(0);
  
  return (
    <Card className="shadow-medium">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-warning" />
            Hints ({revealedHints}/{hints.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={revealNext} disabled={revealedHints >= hints.length}>
              <ChevronRight className="w-3 h-3 mr-1"/>Reveal
            </Button>
            <Button size="sm" variant="ghost" onClick={resetHints}>
              <TimerReset className="w-3 h-3 mr-1"/>Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {revealedHints === 0 ? (
          <p className="text-sm text-muted-foreground">
            Use hints progressively to guide your solution approach
          </p>
        ) : (
          <ul className="space-y-2">
            {hints.slice(0, revealedHints).map((hint, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">
                  {index + 1}
                </span>
                <span>{hint}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

// Quick Calculator Component
function QuickCalculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  
  const calculate = () => {
    try {
      // Simple safe evaluation (numbers and basic operators only)
      const sanitized = expression.replace(/[^0-9+\-*/(). ]/g, "");
      const calculated = Function(`"use strict"; return (${sanitized})`)();
      setResult(calculated.toString());
    } catch (error) {
      setResult("Error");
    }
  };

  return (
    <Card className="shadow-medium">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calculator className="w-4 h-4" />
          Quick Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input 
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="e.g., (500*1.5^3)/(3*210e9*1e-6)"
            className="text-sm"
          />
          <Button size="sm" onClick={calculate}>=</Button>
        </div>
        {result && (
          <div className="text-sm">
            <span className="text-muted-foreground">Result: </span>
            <span className="font-mono font-medium">{result}</span>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Use SI units for consistency (N, m, Pa, W, °C)
        </p>
      </CardContent>
    </Card>
  );
}

// Quick Reference Component (Now Collapsible)
function QuickReference() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="shadow-medium">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookText className="w-4 h-4" />
                Quick Reference
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-medium mb-1">Common Formulas:</h4>
                <ul className="space-y-1 text-muted-foreground font-mono">
                  <li>• σ = F/A (stress)</li>
                  <li>• δ = FL/(AE) (elongation)</li>
                  <li>• I = bh³/12 (rect. moment)</li>
                  <li>• P = ½ρAv³Cp (wind power)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-1">SI Units:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Force: N (Newton)</li>
                  <li>• Pressure: Pa (Pascal)</li>
                  <li>• Energy: J (Joule)</li>
                  <li>• Power: W (Watt)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

// Main Practice Interface Component
const PracticeInterface = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flagged, setFlagged] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [solutionDialogOpen, setSolutionDialogOpen] = useState(false);

  const [notes, setNotes] = useState("");
  const [notesLoaded, setNotesLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // Dynamic problem loading from Supabase
  const [currentQuestion, setCurrentQuestion] = useState<DbProblem | null>(null);
  const [problemLoading, setProblemLoading] = useState(true);

  const { display, running, setRunning, secondsLeft, setSecondsLeft } = useCountdown(45);

  // Get problem ID from URL params
  const problemId = searchParams.get('problem');
  const progress = 0; // Can be updated if you want to track multiple problems

  // Fetch problem from Supabase when problemId changes
  useEffect(() => {
    const loadProblem = async () => {
      if (!problemId) {
        setProblemLoading(false);
        return;
      }

      try {
        setProblemLoading(true);
        const problem = await getProblemById(problemId);
        if (problem) {
          setCurrentQuestion(problem);
          // Set timer based on problem's time limit
          if (problem.time_limit_minutes) {
            setSecondsLeft(problem.time_limit_minutes * 60);
          }
        } else {
          console.error('Problem not found:', problemId);
        }
      } catch (error) {
        console.error('Error loading problem:', error);
      } finally {
        setProblemLoading(false);
      }
    };

    loadProblem();
  }, [problemId]);

  // Load existing submission data
  useEffect(() => {
    if (user && currentQuestion) {
      loadSubmissionData();
    }
  }, [user, currentQuestion]);

  const loadSubmissionData = async () => {
    if (!user || !currentQuestion) return;
    
    try {
      console.log('Loading submission data for problem:', currentQuestion.id);
      const submission = await submissionService.getUserSubmissionForProblem(user.id, currentQuestion.id);
      if (submission) {
        console.log('Found existing submission:', submission);
        setNotes(submission.notes || "");
        setHintsUsed(submission.hints_used || 0);
        // Update timer if there's previous time spent
        if (submission.time_spent_minutes > 0 && currentQuestion.time_limit_minutes) {
          const remainingTime = Math.max(0, currentQuestion.time_limit_minutes * 60 - submission.time_spent_minutes * 60);
          setSecondsLeft(remainingTime);
        }
      }
      setNotesLoaded(true);
    } catch (error) {
      console.error('Error loading submission data:', error);
      setNotesLoaded(true);
    }
  };

  // Auto-save notes
  // Update the auto-save notes effect:
useEffect(() => {
  // Don't auto-save until notes are loaded and there's actual content
  if (!notesLoaded || !user || !currentQuestion || !notes.trim()) {
    return;
  }

  const saveNotes = async () => {
    try {
      setSaveStatus('saving');
      console.log('Auto-saving notes for problem:', currentQuestion.id);
      
      await submissionService.submitAnswer({
        problem_id: currentQuestion.id,
        status: 'attempted',
        user_answer: notes,
        time_spent_minutes: Math.max(1, Math.round(((currentQuestion.time_limit_minutes || 30) * 60 - secondsLeft) / 60)),
        hints_used: hintsUsed,
        notes: notes
      });
      
      setSaveStatus('saved');
      console.log('Notes auto-saved successfully');
    } catch (error) {
      console.error('Error auto-saving notes:', error);
      setSaveStatus('unsaved');
    }
  };

  setSaveStatus('unsaved');
  const timeoutId = setTimeout(saveNotes, 2000); // Auto-save after 2 seconds of inactivity
  return () => clearTimeout(timeoutId);
}, [notes, user, currentQuestion, hintsUsed, notesLoaded]); 

  const nextQuestion = () => setCurrentIndex(prev => prev + 1);
  const prevQuestion = () => setCurrentIndex(prev => Math.max(0, prev - 1));
  const resetTimer = () => setSecondsLeft((currentQuestion?.time_limit_minutes || 30) * 60);

  const handleSubmitSolution = async (status: 'solved' | 'partially_solved' | 'skipped') => {
    if (!user || !currentQuestion) return;
    
    try {
      setLoading(true);
      
      await submissionService.submitAnswer({
        problem_id: currentQuestion.id,
        status: status,
        user_answer: notes,
        time_spent_minutes: Math.round(((currentQuestion.time_limit_minutes || 30) * 60 - secondsLeft) / 60),
        hints_used: hintsUsed,
        notes: notes
      });
      
      // Navigate back to practice page
      navigate('/practice');
    } catch (error) {
      console.error('Error submitting solution:', error);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-card">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6 text-center">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
              <p className="text-muted-foreground mb-4">Please sign in to access practice problems</p>
              <Button asChild>
                <Link to="../dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Loading state
  if (problemLoading) {
    return (
      <div className="min-h-screen bg-gradient-card">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">Loading Problem...</h2>
              <p className="text-muted-foreground">Please wait while we fetch the problem details.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Problem not found
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-card">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <FileQuestion className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Problem Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The problem you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <Link to="/practice">Back to Practice</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Check premium access
  if (currentQuestion.is_premium && (user as any)?.subscription_tier !== 'premium') {
    return (
      <div className="min-h-screen bg-gradient-card">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6 text-center">
              <Lock className="w-12 h-12 text-warning mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Premium Problem</h2>
              <p className="text-muted-foreground mb-4">This problem requires a premium subscription</p>
              <Button asChild variant="hero">
                <Link to="/practice">Back to Practice</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-card">
        <Navbar />
        
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/practice">
                  <ChevronLeft className="w-4 h-4 mr-1"/>Back to Practice
                </Link>
              </Button>
              <div className="h-6 w-px bg-border" />
              <Badge variant="outline">{currentQuestion.subject}</Badge>
              <Badge variant="outline">{currentQuestion.industry}</Badge>
              <Badge variant={currentQuestion.difficulty === "easy" ? "easy" : currentQuestion.difficulty === "medium" ? "medium" : "hard"}>
                {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
              </Badge>
              {currentQuestion.is_premium && <Badge variant="warning">Premium</Badge>}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-lg font-semibold">{display}</span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" onClick={() => setRunning(!running)}>
                    {running ? <StopCircle className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{running ? "Pause" : "Resume"} timer</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" onClick={resetTimer}>
                    <TimerReset className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset timer</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Main Content */}
            <div className="xl:col-span-8 space-y-6">
              {/* Question Card */}
              <Card className="shadow-medium">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{currentQuestion.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <AlarmClock className="w-4 h-4" />
                        <span>Suggested time: {currentQuestion.time_limit_minutes} minutes</span>
                        <span>•</span>
                        <span>Asked at: {currentQuestion.companies.join(", ")}</span>
                      </div>
                    </div>
                    <Button
                      variant={flagged ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setFlagged(!flagged)}
                    >
                      <Flag className="w-4 h-4 mr-1" />
                      {flagged ? "Flagged" : "Flag"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none mb-6">
                    <p className="text-base leading-relaxed">{currentQuestion.prompt}</p>
                  </div>
                  
                  {/* Whiteboard and Tools */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Whiteboard />
                    <div className="space-y-4">
                      <HintSystem hints={currentQuestion.hints || []} />
                      <QuickCalculator />
                    </div>
                  </div>
                </CardContent>
              </Card>

              

              {/* Notes Section */}
              {/* Notes Section */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <NotebookPen className="w-4 h-4" />
                    Your Solution Notes
                    <Badge 
                      variant={saveStatus === 'saved' ? 'success' : saveStatus === 'saving' ? 'outline' : 'destructive'} 
                      className="text-xs"
                    >
                      {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Unsaved'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    className="min-h-[150px] resize-none"
                    placeholder={notesLoaded ? "Walk through your solution step by step. State assumptions, show calculations, and explain your reasoning..." : "Loading notes..."}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={!notesLoaded}
                  />
                  <div className="flex items-center gap-2 mt-3">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => navigator.clipboard?.writeText(notes)}
                      disabled={!notes.trim()}
                    >
                      <ClipboardCopy className="w-4 h-4 mr-1" />
                      Copy Notes
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {saveStatus === 'saved' && 'Notes saved automatically'}
                      {saveStatus === 'saving' && 'Saving notes...'}
                      {saveStatus === 'unsaved' && 'Changes will be saved automatically'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={() => handleSubmitSolution('skipped')}
                    variant="outline"
                    disabled={loading}
                  >
                    Skip Problem
                  </Button>
                  <Button 
                    onClick={() => handleSubmitSolution('partially_solved')}
                    variant="secondary"
                    disabled={loading}
                  >
                    Save Progress
                  </Button>
                  <Button 
                    onClick={() => handleSubmitSolution('solved')}
                    disabled={loading}
                  >
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Mark as Solved
                  </Button>
                </div>

                <Button 
                  variant="outline"
                  onClick={() => navigate('/practice')}
                >
                  <Square className="w-4 h-4 mr-2" />
                  End Session
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-4 space-y-6">
              {/* Interview Context */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Interview Context
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Position</span>
                      <span>Mechanical Engineer</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Round</span>
                      <span>Technical Interview</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Focus</span>
                      <span>{currentQuestion.subject}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-muted/50">
                    <h4 className="text-sm font-medium mb-2">What they're evaluating:</h4>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Problem-solving approach</li>
                      <li>• Technical knowledge application</li>
                      <li>• Communication clarity</li>
                      <li>• Practical considerations</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Reference (Now Collapsible) */}
              <QuickReference />

              {/* Solution Dialog */}
              <Dialog open={solutionDialogOpen} onOpenChange={setSolutionDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    View Solution Approach
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Solution Approach</DialogTitle>
                    <DialogDescription>
                      One possible way to tackle this problem systematically
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    {(currentQuestion.hints || []).map((hint, index) => (
                      <div key={index} className="flex gap-3">
                        <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {index + 1}
                        </span>
                        <p className="text-sm">{hint}</p>
                      </div>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setSolutionDialogOpen(false)}>
                      <Check className="w-4 h-4 mr-2" />
                      Got it
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PracticeInterface;