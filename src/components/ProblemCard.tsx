import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Lock, Clock, Briefcase, CheckCircle, PlayCircle } from 'lucide-react';
import { Problem } from '@/types';

interface ProblemCardProps {
  problem: Problem & { status?: 'not_started' | 'attempted' | 'solved' };
  onContinue: (problemId: string) => void;
  onToggleStar: (problemId: string) => void;
  isLocked: boolean;
  onUpgrade?: () => void;
}

export function ProblemCard({ problem, onContinue, onToggleStar, isLocked, onUpgrade }: ProblemCardProps) {
  const getButtonText = () => {
    if (isLocked) {
      return (
        <>
          <Lock className="w-4 h-4 mr-2" />
          Locked
        </>
      );
    }

    switch (problem.status) {
      case 'solved':
        return (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Review
          </>
        );
      case 'attempted':
        return (
          <>
            <PlayCircle className="w-4 h-4 mr-2" />
            Continue
          </>
        );
      default:
        return 'Solve';
    }
  };

  const getButtonVariant = () => {
    if (problem.status === 'solved') return 'outline';
    return 'default';
  };
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Hard':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Card className={`p-6 hover:shadow-lg transition-shadow ${isLocked ? 'opacity-60' : ''} ${problem.status === 'solved' ? 'border-green-500 border-2' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-2 flex-wrap">
          <Badge className={getDifficultyColor(problem.difficulty)}>
            {problem.difficulty}
          </Badge>
          <Badge variant="outline">{problem.topic}</Badge>
          <Badge variant="outline">{problem.field}</Badge>
          {problem.status === 'solved' && (
            <Badge className="bg-green-100 text-green-800 border-green-300">
              <CheckCircle className="w-3 h-3 mr-1" />
              Solved
            </Badge>
          )}
        </div>
        <button
          onClick={() => onToggleStar(problem.id)}
          className={`transition-colors ${isLocked ? 'cursor-not-allowed' : ''}`}
          disabled={isLocked}
        >
          <Star
            className={`w-5 h-5 ${
              problem.isStarred ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-gray-400'
            }`}
          />
        </button>
      </div>

      <div className="flex items-center gap-2 text-gray-600 mb-3">
        <Clock className="w-4 h-4" />
        <span className="text-sm">{problem.timeToSolve} min</span>
      </div>

      <h3 className="mb-2">{problem.title}</h3>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{problem.description}</p>

      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Briefcase className="w-4 h-4" />
        <span>Asked at: {problem.companies.join(', ')}</span>
      </div>

      <Button
        onClick={() => {
          if (isLocked && onUpgrade) {
            onUpgrade();
          } else {
            onContinue(problem.id);
          }
        }}
        variant={getButtonVariant() as any}
        className="w-full"
      >
        {getButtonText()}
      </Button>
    </Card>
  );
}
