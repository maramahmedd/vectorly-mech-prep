import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Problem } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Whiteboard } from '@/components/Whiteboard';
import { Calculator } from '@/components/Calculator';
import {
  ArrowLeft,
  Play,
  Pause,
  Lightbulb,
  Save,
  SkipForward,
  CheckCircle,
  AlertCircle,
  Calculator as CalculatorIcon,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { submissionService } from '@/services/submissionService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { getProblemById } from '@/services/problemService';

export default function PracticeInterface() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [answer, setAnswer] = useState('');
  const [notes, setNotes] = useState('');
  const [hintsRevealed, setHintsRevealed] = useState<number>(0);
  const [activeTab, setActiveTab] = useState('whiteboard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProblem = async () => {
      const problemId = sessionStorage.getItem('selectedProblemId');
      if (!problemId) {
        navigate('/practice');
        return;
      }

      try {
        setLoading(true);
        const dbProblem = await getProblemById(problemId);

        if (!dbProblem) {
          console.error('Problem not found:', problemId);
          toast.error('Problem not found');
          navigate('/practice');
          return;
        }

        // Convert DbProblem to Problem format
        const mappedProblem: Problem = {
          id: dbProblem.id,
          title: dbProblem.title,
          description: dbProblem.description,
          detailedProblem: dbProblem.prompt || dbProblem.description,
          difficulty: dbProblem.difficulty.charAt(0).toUpperCase() + dbProblem.difficulty.slice(1) as any,
          topic: dbProblem.subject as any,
          field: dbProblem.industry as any,
          timeToSolve: dbProblem.time_limit_minutes || 30,
          companies: dbProblem.companies || [],
          isFree: !dbProblem.is_premium,
          isStarred: false,
          hints: dbProblem.hints || [],
        };

        setProblem(mappedProblem);
        const initialSeconds = mappedProblem.timeToSolve * 60;
        setTimeRemaining(initialSeconds);
        setInitialTime(initialSeconds);

        // Mark as attempted when user starts
        if (user) {
          submissionService.markAsAttempted(problemId).catch(console.error);
        }
      } catch (error) {
        console.error('Error loading problem:', error);
        toast.error('Failed to load problem');
        navigate('/practice');
      } finally {
        setLoading(false);
      }
    };

    loadProblem();
  }, [navigate, user]);

  useEffect(() => {
    if (isPaused || timeRemaining <= 0 || !problem) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, timeRemaining, problem]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const revealNextHint = () => {
    if (problem && hintsRevealed < problem.hints.length) {
      setHintsRevealed(hintsRevealed + 1);
    }
  };

  const handleSave = async () => {
    if (!problem || !user) {
      toast.error('Please log in to save your progress');
      return;
    }

    try {
      const timeSpentMinutes = Math.round((initialTime - timeRemaining) / 60);
      await submissionService.submitAnswer({
        problem_id: problem.id,
        status: 'attempted',
        user_answer: answer,
        notes,
        time_spent_minutes: timeSpentMinutes,
        hints_used: hintsRevealed,
      });
      toast.success('Progress saved!');
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error('Failed to save progress');
    }
  };

  const handleSkip = async () => {
    if (!confirm('Are you sure you want to skip this problem?')) return;

    if (problem && user) {
      try {
        const timeSpentMinutes = Math.round((initialTime - timeRemaining) / 60);
        await submissionService.submitAnswer({
          problem_id: problem.id,
          status: 'skipped',
          time_spent_minutes: timeSpentMinutes,
          hints_used: hintsRevealed,
        });
      } catch (error) {
        console.error('Error saving skip:', error);
      }
    }
    navigate('/practice');
  };

  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast.error('Please enter your answer before submitting.');
      return;
    }

    if (!problem || !user) {
      toast.error('Please log in to submit');
      return;
    }

    setIsSubmitting(true);
    try {
      const timeSpentMinutes = Math.round((initialTime - timeRemaining) / 60);
      await submissionService.submitAnswer({
        problem_id: problem.id,
        status: 'solved', // In real app, this would be evaluated
        user_answer: answer,
        notes,
        time_spent_minutes: timeSpentMinutes,
        hints_used: hintsRevealed,
      });
      toast.success('Solution submitted successfully!');
      setTimeout(() => navigate('/practice'), 1500);
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to submit solution');
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/practice');
  };

  const getTimeColor = () => {
    if (!problem) return 'text-gray-600';
    const percentage = (timeRemaining / (problem.timeToSolve * 60)) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading || !problem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading problem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Practice
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h2>{problem.title}</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsPaused(!isPaused)}>
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </Button>
                <span className={`text-xl ${getTimeColor()}`}>{formatTime(timeRemaining)}</span>
              </div>
              <Button variant="outline" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Progress
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge>{problem.difficulty}</Badge>
                <Badge variant="outline">{problem.topic}</Badge>
                <Badge variant="outline">{problem.field}</Badge>
              </div>
              <ScrollArea className="h-96">
                <div className="pr-4 whitespace-pre-wrap">{problem.detailedProblem}</div>
              </ScrollArea>
            </Card>
            <Card className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="calculator">
                    <CalculatorIcon className="w-4 h-4 mr-2" />
                    Calculator
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="whiteboard" className="mt-4">
                  <Whiteboard height={400} />
                </TabsContent>
                <TabsContent value="notes" className="mt-4">
                  <Textarea placeholder="Write your notes, calculations, and working here..." value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-[400px] font-mono" />
                </TabsContent>
                <TabsContent value="calculator" className="mt-4">
                  <div className="flex justify-center">
                    <Calculator />
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
            <Card className="p-6">
              <h3 className="mb-4">Your Answer</h3>
              <Textarea placeholder="Enter your final answer with all calculations and reasoning..." value={answer} onChange={(e) => setAnswer(e.target.value)} className="min-h-[200px] mb-4" />
              <div className="flex gap-4">
                <Button onClick={handleSubmit} className="flex-1" disabled={isSubmitting}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Submitting...' : 'Submit Solution'}
                </Button>
                <Button variant="outline" onClick={handleSkip} disabled={isSubmitting}>
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip Problem
                </Button>
              </div>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <h3>Hints</h3>
              </div>
              <div className="space-y-3">
                {problem.hints.map((hint, index) => (
                  <div key={index}>
                    {index < hintsRevealed ? (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <span className="font-semibold">Hint {index + 1}:</span> {hint}
                        </AlertDescription>
                      </Alert>
                    ) : index === hintsRevealed ? (
                      <Button variant="outline" className="w-full" onClick={revealNextHint}>
                        Reveal Hint {index + 1}
                      </Button>
                    ) : null}
                  </div>
                ))}
                {hintsRevealed === problem.hints.length && (
                  <p className="text-sm text-gray-500 text-center">All hints revealed</p>
                )}
              </div>
            </Card>
            {problem.interviewContext && (
              <Card className="p-6">
                <h3 className="mb-4">Interview Context</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">Position:</span>
                    <p>{problem.interviewContext.position}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Interview Round:</span>
                    <p>{problem.interviewContext.round}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Focus Area:</span>
                    <p>{problem.interviewContext.focusArea}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">What They're Evaluating:</span>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {problem.interviewContext.evaluationCriteria.map((criteria, index) => (
                        <li key={index}>{criteria}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            )}
            {problem.quickReferences && problem.quickReferences.length > 0 && (
              <Card className="p-6">
                <h3 className="mb-4">Quick References</h3>
                <ul className="space-y-2">
                  {problem.quickReferences.map((ref, index) => (
                    <li key={index}>
                      <a href="#" className="text-blue-600 hover:underline text-sm">{ref}</a>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
            <Card className="p-6">
              <h3 className="mb-4">Asked At</h3>
              <div className="flex flex-wrap gap-2">
                {problem.companies.map((company) => (
                  <Badge key={company} variant="secondary">{company}</Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
