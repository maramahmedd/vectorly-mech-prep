import { UserStats } from '../types';

export const mockUserStats: UserStats = {
  streak: 7,
  problemsSolved: 23,
  totalProblems: 150,
  accuracyRate: 85,
  totalStudyHours: 34.5,
  weeklyProgress: [
    { day: 'Mon', problems: 2 },
    { day: 'Tue', problems: 4 },
    { day: 'Wed', problems: 3 },
    { day: 'Thu', problems: 5 },
    { day: 'Fri', problems: 2 },
    { day: 'Sat', problems: 6 },
    { day: 'Sun', problems: 4 }
  ],
  topicsStudied: [
    { topic: 'Solid Mechanics', count: 8 },
    { topic: 'Thermodynamics', count: 6 },
    { topic: 'Fluid Mechanics', count: 4 },
    { topic: 'Heat Transfer', count: 3 },
    { topic: 'Circuits', count: 2 }
  ],
  subjectsMastered: [
    { subject: 'Mechanical', mastery: 65 },
    { subject: 'Electrical', mastery: 45 },
    { subject: 'Civil', mastery: 30 },
    { subject: 'Architecture', mastery: 20 }
  ]
};
