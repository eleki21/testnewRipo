export interface QuizHistory {
  id: string;
  keyword: string;
  score: number;
  totalQuestions: number;
  completedAt: Date;
  questionIds: string[];
}

export interface KeywordStats {
  keyword: string;
  totalAttempts: number;
  totalCorrect: number;
  totalQuestions: number;
  averageScore: number;
  lastAttemptAt: Date;
  askedQuestionIds: string[];
}

export interface HistoryStore {
  histories: QuizHistory[];
  keywordStats: Record<string, KeywordStats>;
}
