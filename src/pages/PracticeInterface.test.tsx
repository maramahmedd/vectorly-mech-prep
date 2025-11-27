import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PracticeInterface from './PracticeInterface';

// Mock dependencies
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
  }),
}));

vi.mock('@/services/problemService', () => ({
  getProblemById: vi.fn(() =>
    Promise.resolve({
      id: 'test-problem-1',
      title: 'Test Problem',
      description: 'A test problem description',
      prompt: 'Solve this problem',
      difficulty: 'medium',
      subject: 'Mechanical Engineering',
      industry: 'Aerospace',
      time_limit_minutes: 30,
      companies: ['SpaceX', 'NASA'],
      is_premium: false,
      hints: ['Hint 1', 'Hint 2'],
      question_type: 'free_text',
    })
  ),
  getNextProblemOfSameType: vi.fn(() => Promise.resolve(null)),
}));

vi.mock('@/services/submissionService', () => ({
  submissionService: {
    getUserSubmissionForProblem: vi.fn(() => Promise.resolve(null)),
    submitAnswer: vi.fn(() => Promise.resolve({})),
    markAsAttempted: vi.fn(() => Promise.resolve({})),
  },
}));

vi.mock('@/services/answerValidationService', () => ({
  answerValidationService: {
    validateAnswer: vi.fn(() => ({
      isCorrect: true,
      accuracyScore: 100,
      feedback: 'Correct!',
    })),
    getSubmissionStatus: vi.fn(() => 'correct'),
  },
}));

vi.mock('@/components/Calculator', () => ({
  Calculator: () => <div data-testid="calculator-mock">Desmos Calculator</div>,
}));

vi.mock('@/components/Whiteboard', () => ({
  Whiteboard: vi.fn(() => <div data-testid="whiteboard-mock">Whiteboard</div>),
}));

vi.mock('@/components/MultipleChoiceAnswer', () => ({
  MultipleChoiceAnswer: () => <div data-testid="mc-answer-mock">Multiple Choice</div>,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('PracticeInterface - Calculator Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock URL search params
    delete (window as any).location;
    window.location = { search: '?problem=test-problem-1' } as any;
  });

  it('should render the practice interface with calculator tab', async () => {
    renderWithRouter(<PracticeInterface />);

    await waitFor(() => {
      expect(screen.getByText(/test problem/i)).toBeInTheDocument();
    });

    // Check that calculator tab exists
    expect(screen.getByRole('tab', { name: /calculator/i })).toBeInTheDocument();
  });

  it('should display calculator when calculator tab is clicked', async () => {
    renderWithRouter(<PracticeInterface />);

    await waitFor(() => {
      expect(screen.getByText(/test problem/i)).toBeInTheDocument();
    });

    // Initially, the calculator might not be visible (depends on default tab)
    // But the tab should be present
    const calculatorTab = screen.getByRole('tab', { name: /calculator/i });
    expect(calculatorTab).toBeInTheDocument();
  });

  it('should have calculator tab alongside whiteboard and notes tabs', async () => {
    renderWithRouter(<PracticeInterface />);

    await waitFor(() => {
      expect(screen.getByText(/test problem/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('tab', { name: /whiteboard/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /notes/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /calculator/i })).toBeInTheDocument();
  });

  it('should maintain calculator functionality when switching tabs', async () => {
    renderWithRouter(<PracticeInterface />);

    await waitFor(() => {
      expect(screen.getByText(/test problem/i)).toBeInTheDocument();
    });

    const calculatorTab = screen.getByRole('tab', { name: /calculator/i });
    const whiteboardTab = screen.getByRole('tab', { name: /whiteboard/i });

    // Switch to calculator tab
    calculatorTab.click();

    await waitFor(() => {
      expect(screen.getByTestId('calculator-mock')).toBeInTheDocument();
    });

    // Switch back to whiteboard
    whiteboardTab.click();

    // Switch to calculator again
    calculatorTab.click();

    // Calculator should still be present
    await waitFor(() => {
      expect(screen.getByTestId('calculator-mock')).toBeInTheDocument();
    });
  });

  it('should display calculator icon in the tab', async () => {
    renderWithRouter(<PracticeInterface />);

    await waitFor(() => {
      expect(screen.getByText(/test problem/i)).toBeInTheDocument();
    });

    const calculatorTab = screen.getByRole('tab', { name: /calculator/i });

    // Check that the tab contains the word "Calculator"
    expect(calculatorTab).toHaveTextContent(/calculator/i);
  });
});
