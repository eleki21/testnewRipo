export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  keywords: Record<string, string>;
}

export interface KeywordValidationResult {
  status: 'valid' | 'ambiguous' | 'not_found' | 'inappropriate';
  suggestions?: string[];
  message?: string;
}

export interface QuizSession {
  id: string;
  keyword: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: number[];
  score: number;
  totalQuestions: number;
  startedAt: Date;
  completedAt?: Date;
}

export interface QuizSettings {
  questionCount: 3 | 5 | 10;
  apiKey: string;
}

export type QuizStatus =
  | 'idle'
  | 'validating'
  | 'generating'
  | 'ready'
  | 'in_progress'
  | 'completed'
  | 'error';
