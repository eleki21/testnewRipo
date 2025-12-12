import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuizHistory, KeywordStats } from '../types/history';
import { trimHistory, trimAskedQuestions } from '../utils/storage';

interface HistoryState {
  histories: QuizHistory[];
  keywordStats: Record<string, KeywordStats>;
  addHistory: (history: QuizHistory) => void;
  getKeywordStats: (keyword: string) => KeywordStats | undefined;
  getAskedQuestionIds: (keyword: string) => string[];
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      histories: [],
      keywordStats: {},

      addHistory: (history) =>
        set((state) => {
          const newHistories = trimHistory([history, ...state.histories]);

          const existingStats = state.keywordStats[history.keyword];
          const newAskedIds = trimAskedQuestions([
            ...(existingStats?.askedQuestionIds || []),
            ...history.questionIds,
          ]);

          const totalAttempts = (existingStats?.totalAttempts || 0) + 1;
          const totalCorrect =
            (existingStats?.totalCorrect || 0) + history.score;
          const totalQuestions =
            (existingStats?.totalQuestions || 0) + history.totalQuestions;

          const newStats: KeywordStats = {
            keyword: history.keyword,
            totalAttempts,
            totalCorrect,
            totalQuestions,
            averageScore:
              totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0,
            lastAttemptAt: history.completedAt,
            askedQuestionIds: newAskedIds,
          };

          return {
            histories: newHistories,
            keywordStats: {
              ...state.keywordStats,
              [history.keyword]: newStats,
            },
          };
        }),

      getKeywordStats: (keyword) => {
        return get().keywordStats[keyword];
      },

      getAskedQuestionIds: (keyword) => {
        return get().keywordStats[keyword]?.askedQuestionIds || [];
      },

      clearHistory: () =>
        set({
          histories: [],
          keywordStats: {},
        }),
    }),
    {
      name: 'quiz-history',
    }
  )
);
