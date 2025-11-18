export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type FieldOfStudy = 'Mechanical' | 'Electrical' | 'Civil' | 'Architecture' | 'Chemical' | 'Aerospace';
export type Topic = 'Solid Mechanics' | 'Thermodynamics' | 'Fluid Mechanics' | 'Heat Transfer' | 'Circuits' | 'Structures' | 'Materials';

export interface Problem {
  id: string;
  title: string;
  description: string;
  detailedProblem: string;
  difficulty: Difficulty;
  topic: Topic;
  field: FieldOfStudy;
  timeToSolve: number; // in minutes
  companies: string[];
  isFree: boolean;
  isStarred: boolean;
  hints: string[];
  interviewContext?: {
    position: string;
    round: string;
    focusArea: string;
    evaluationCriteria: string[];
  };
  quickReferences?: string[];
}

export interface UserProgress {
  problemId: string;
  completed: boolean;
  timeSpent: number;
  answer: string;
  notes: string;
  hintsUsed: number;
}

export interface UserStats {
  streak: number;
  problemsSolved: number;
  totalProblems: number;
  accuracyRate: number;
  totalStudyHours: number;
  weeklyProgress: { day: string; problems: number }[];
  topicsStudied: { topic: string; count: number }[];
  subjectsMastered: { subject: string; mastery: number }[];
}
