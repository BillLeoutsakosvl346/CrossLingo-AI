import { LearnedWord } from './vocabulary';

export interface QuizQuestion {
  id: string;
  type: 'spanish-to-english' | 'english-to-spanish';
  question: string;
  correctAnswer: string;
  options: string[];
  word: LearnedWord;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  completedAt: Date;
  xpEarned?: number;
}

export interface QuizState {
  questions: QuizQuestion[];
  currentIndex: number;
  userAnswers: string[];
  isComplete: boolean;
  result?: QuizResult;
}
