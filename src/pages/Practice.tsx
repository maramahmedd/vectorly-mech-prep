import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProblemCard } from '@/components/ProblemCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { listProblems, type DbProblem } from '@/services/problemService';
import { submissionService, type UserSubmission } from '@/services/submissionService';
import { useAuth } from '@/contexts/AuthContext';
import { Problem, Difficulty, FieldOfStudy, Topic } from '@/types';
import { supabase } from '@/lib/supabase';
import { PracticeSkeleton } from '@/components/skeletons/PracticeSkeleton';

// Extended Problem type with status
interface ProblemWithStatus extends Problem {
  status?: 'not_started' | 'attempted' | 'solved';
}

// Map DbProblem to our Problem type used in ProblemCard
function mapDbProblemToProblem(
  dbProblem: DbProblem,
  isStarred = false,
  status: 'not_started' | 'attempted' | 'solved' = 'not_started'
): ProblemWithStatus {
  const difficultyMap: Record<string, Difficulty> = {
    'easy': 'Easy',
    'medium': 'Medium',
    'hard': 'Hard'
  };

  return {
    id: dbProblem.id,
    title: dbProblem.title,
    description: dbProblem.description,
    detailedProblem: dbProblem.prompt || dbProblem.description,
    difficulty: difficultyMap[dbProblem.difficulty] || 'Medium',
    topic: dbProblem.subject as Topic,
    field: dbProblem.industry as FieldOfStudy,
    timeToSolve: dbProblem.time_limit_minutes || 30,
    companies: dbProblem.companies || [],
    isFree: !dbProblem.is_premium,
    isStarred,
    hints: dbProblem.hints || [],
    status,
  };
}

export default function Practice() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [problems, setProblems] = useState<ProblemWithStatus[]>([]);
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [fieldFilter, setFieldFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [starredProblems, setStarredProblems] = useState<Set<string>>(new Set());

  // Fetch user submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user) {
        setSubmissions([]);
        return;
      }

      try {
        const userSubmissions = await submissionService.getUserSubmissions(user.id);
        setSubmissions(userSubmissions);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    fetchSubmissions();

    // Set up real-time listener for submission changes
    let channel: ReturnType<typeof supabase.channel> | null = null;

    if (user) {
      channel = supabase
        .channel(`ui-updates-${user.id}`, { config: { broadcast: { self: false } } })
        .on('broadcast', { event: 'attempts_changed' }, (msg) => {
          if (msg?.payload?.userId === user.id) {
            fetchSubmissions();
          }
        })
        .subscribe();
    }

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [user]);

  // Fetch problems from Supabase when filters change
  useEffect(() => {
    let cancelled = false;
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const dbProblems = await listProblems({
          search: searchQuery,
          difficulty: difficultyFilter === 'all' ? undefined : difficultyFilter.toLowerCase(),
          subject: topicFilter === 'all' ? undefined : topicFilter,
          industry: fieldFilter === 'all' ? undefined : fieldFilter,
        });

        if (!cancelled) {
          // Create a map of problem statuses from submissions
          const statusMap = new Map<string, 'not_started' | 'attempted' | 'solved'>();
          submissions.forEach(sub => {
            if (sub.status === 'solved') {
              statusMap.set(sub.problem_id, 'solved');
            } else if (sub.status === 'attempted' || sub.status === 'partially_solved') {
              statusMap.set(sub.problem_id, 'attempted');
            }
          });

          const mappedProblems = dbProblems.map(p =>
            mapDbProblemToProblem(
              p,
              starredProblems.has(p.id),
              statusMap.get(p.id) || 'not_started'
            )
          );
          setProblems(mappedProblems);
        }
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProblems();
    return () => { cancelled = true; };
  }, [searchQuery, difficultyFilter, topicFilter, fieldFilter, starredProblems, submissions]);

  const handleSelectProblem = (problemId: string) => {
    // Navigate to problem interface with problem ID in URL
    navigate(`/practice/interface?problem=${problemId}`);
  };

  const handleToggleStar = (problemId: string) => {
    setStarredProblems(prev => {
      const next = new Set(prev);
      if (next.has(problemId)) {
        next.delete(problemId);
      } else {
        next.add(problemId);
      }
      return next;
    });

    setProblems(prev =>
      prev.map(problem =>
        problem.id === problemId
          ? { ...problem, isStarred: !problem.isStarred }
          : problem
      )
    );
  };

  const handleUpgrade = () => {
    navigate('/upgrade');
  };

  // Show skeleton while loading
  if (loading) {
    return <PracticeSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="mb-2">Practice Problems</h1>
          <p className="text-gray-600">
            Master engineering fundamentals through real interview questions from top companies
          </p>
        </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        <Select value={fieldFilter} onValueChange={setFieldFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fields</SelectItem>
            <SelectItem value="Mechanical">Mechanical</SelectItem>
            <SelectItem value="Electrical">Electrical</SelectItem>
            <SelectItem value="Civil">Civil</SelectItem>
            <SelectItem value="Architecture">Architecture</SelectItem>
            <SelectItem value="Chemical">Chemical</SelectItem>
            <SelectItem value="Aerospace">Aerospace</SelectItem>
          </SelectContent>
        </Select>

        <Select value={topicFilter} onValueChange={setTopicFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>
            <SelectItem value="Solid Mechanics">Solid Mechanics</SelectItem>
            <SelectItem value="Thermodynamics">Thermodynamics</SelectItem>
            <SelectItem value="Fluid Mechanics">Fluid Mechanics</SelectItem>
            <SelectItem value="Heat Transfer">Heat Transfer</SelectItem>
            <SelectItem value="Circuits">Circuits</SelectItem>
            <SelectItem value="Structures">Structures</SelectItem>
            <SelectItem value="Materials">Materials</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="mb-4 text-gray-600">
        {loading ? 'Loading...' : `Showing ${problems.length} problems`}
      </div>

      {/* Problem cards grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((problem) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                onContinue={handleSelectProblem}
                onToggleStar={handleToggleStar}
                isLocked={!problem.isFree}
                onUpgrade={handleUpgrade}
              />
            ))}
          </div>

          {problems.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No problems found matching your filters. Try adjusting your search criteria.
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
}
