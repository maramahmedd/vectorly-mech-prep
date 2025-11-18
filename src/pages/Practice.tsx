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
    if (user) {
      const channel = supabase
        .channel('ui-updates', { config: { broadcast: { self: false } } })
        .on('broadcast', { event: 'attempts_changed' }, (msg) => {
          if (msg?.payload?.userId === user.id) {
            fetchSubmissions();
          }
        })
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }
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
    // Store the selected problem ID in sessionStorage
    sessionStorage.setItem('selectedProblemId', problemId);
    navigate('/practice/interface');
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
                className="font-semibold text-sm text-black border-b-2 border-black"
              >
                Practice
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="font-semibold text-sm hover:text-black transition-colors"
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
