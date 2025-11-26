// src/services/answerValidationService.ts
import { DbProblem } from './problemService';

export interface ValidationResult {
  isCorrect: boolean;
  accuracyScore: number; // 0-100
  feedback: string;
}

export const answerValidationService = {
  /**
   * Validates user answer against the problem's correct answer
   */
  validateAnswer(problem: DbProblem, userAnswer: string): ValidationResult {
    // For multiple choice questions
    if (problem.question_type === 'multiple_choice') {
      const normalizedUser = userAnswer.trim().toUpperCase();
      const normalizedCorrect = problem.mc_correct_answer?.trim().toUpperCase();

      const isCorrect = normalizedUser === normalizedCorrect;

      return {
        isCorrect,
        accuracyScore: isCorrect ? 100 : 0,
        feedback: isCorrect
          ? `Correct! The answer is ${normalizedCorrect}.`
          : `Incorrect. You selected ${normalizedUser}, but the correct answer is ${normalizedCorrect}.`
      };
    }

    // For free-text questions, we don't auto-validate in MVP
    // Could add manual review or AI validation later
    return {
      isCorrect: false,
      accuracyScore: 0,
      feedback: 'Answer submitted for review.'
    };
  },

  /**
   * Determines submission status based on validation result
   */
  getSubmissionStatus(validationResult: ValidationResult): 'solved' | 'partially_solved' | 'attempted' {
    if (validationResult.accuracyScore === 100) {
      return 'solved';
    } else if (validationResult.accuracyScore > 0) {
      return 'partially_solved';
    } else {
      return 'attempted';
    }
  }
};
