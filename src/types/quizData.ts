import type { TechnicalTerm, ReferenceLink } from './quiz';

export interface QuizCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface QuizQuestionData {
  id: string;
  categoryId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  technicalTerms: TechnicalTerm[];
  referenceLinks: ReferenceLink[];
  imageKeyword?: string;
}

export interface QuizDataFile {
  version: string;
  exportedAt: string;
  categories: QuizCategory[];
  questions: QuizQuestionData[];
}

export interface QuizDataState {
  categories: QuizCategory[];
  questions: QuizQuestionData[];
  isLoaded: boolean;
  error: string | null;
}
