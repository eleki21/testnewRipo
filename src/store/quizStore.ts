import { create } from 'zustand';
import type {
  QuizQuestion,
  QuizSession,
  QuizStatus,
  KeywordValidationResult,
} from '../types/quiz';
import {
  validateKeyword,
  generateSingleQuestion,
} from '../services/claudeApi';
import { useHistoryStore } from './historyStore';
import { useSettingsStore } from './settingsStore';

interface PrefetchedQuiz {
  keyword: string;
  questions: QuizQuestion[];
  ready: boolean;
}

interface QuizState {
  status: QuizStatus;
  keyword: string;
  validationResult: KeywordValidationResult | null;
  session: QuizSession | null;
  currentQuestion: QuizQuestion | null;
  selectedAnswer: number | null;
  showExplanation: boolean;
  isLoadingNextQuestion: boolean;
  error: string | null;
  prefetchedQuiz: PrefetchedQuiz | null;

  // Actions
  setKeyword: (keyword: string) => void;
  validateAndStart: (keyword: string) => Promise<void>;
  selectSuggestion: (suggestion: string) => void;
  selectAnswer: (answerIndex: number) => void;
  nextQuestion: () => Promise<void>;
  restartQuiz: () => void;
  usePrefetchedQuiz: () => boolean;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => {
  // Helper function to start quiz
  const startQuiz = async (keyword: string) => {
    const { questionCount } = useSettingsStore.getState().settings;
    const askedQuestionIds = useHistoryStore.getState().getAskedQuestionIds(keyword);

    set({ status: 'generating' });

    try {
      const firstQuestion = await generateSingleQuestion(
        keyword,
        askedQuestionIds,
        1,
        questionCount
      );

      const session: QuizSession = {
        id: `session_${Date.now()}`,
        keyword,
        questions: [firstQuestion],
        currentQuestionIndex: 0,
        answers: [],
        score: 0,
        totalQuestions: questionCount,
        startedAt: new Date(),
      };

      set({
        status: 'in_progress',
        session,
        currentQuestion: firstQuestion,
        selectedAnswer: null,
        showExplanation: false,
      });

      // Generate remaining in background
      const existingIds = [...askedQuestionIds, firstQuestion.id];
      for (let i = 2; i <= questionCount; i++) {
        try {
          const question = await generateSingleQuestion(
            keyword,
            existingIds,
            i,
            questionCount
          );
          existingIds.push(question.id);

          const currentState = get();
          if (currentState.session) {
            set({
              session: {
                ...currentState.session,
                questions: [...currentState.session.questions, question],
              },
            });
          }
        } catch (error) {
          console.error(`Failed to generate question ${i}:`, error);
        }
      }
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'クイズの生成に失敗しました',
      });
    }
  };

  // Helper function to prefetch next quiz
  const prefetchNextQuiz = async (keyword: string) => {
    const { questionCount } = useSettingsStore.getState().settings;
    const askedQuestionIds = useHistoryStore.getState().getAskedQuestionIds(keyword);

    set({
      prefetchedQuiz: {
        keyword,
        questions: [],
        ready: false,
      },
    });

    try {
      const questions: QuizQuestion[] = [];
      const existingIds = [...askedQuestionIds];

      for (let i = 1; i <= questionCount; i++) {
        const question = await generateSingleQuestion(
          keyword,
          existingIds,
          i,
          questionCount
        );
        existingIds.push(question.id);
        questions.push(question);

        set({
          prefetchedQuiz: {
            keyword,
            questions: [...questions],
            ready: questions.length === questionCount,
          },
        });
      }
    } catch (error) {
      console.error('Failed to prefetch quiz:', error);
      set({ prefetchedQuiz: null });
    }
  };

  return {
    status: 'idle',
    keyword: '',
    validationResult: null,
    session: null,
    currentQuestion: null,
    selectedAnswer: null,
    showExplanation: false,
    isLoadingNextQuestion: false,
    error: null,
    prefetchedQuiz: null,

    setKeyword: (keyword) => set({ keyword }),

    validateAndStart: async (keyword) => {
      set({ status: 'validating', keyword, error: null, validationResult: null });

      try {
        const result = await validateKeyword(keyword);
        set({ validationResult: result });

        if (result.status === 'valid') {
          await startQuiz(keyword);
        } else {
          set({ status: 'idle' });
        }
      } catch (error) {
        set({
          status: 'error',
          error: error instanceof Error ? error.message : 'キーワードの検証に失敗しました',
        });
      }
    },

    selectSuggestion: (suggestion) => {
      set({ keyword: suggestion, validationResult: null });
      get().validateAndStart(suggestion);
    },

    selectAnswer: (answerIndex) => {
      const { currentQuestion, session } = get();
      if (!currentQuestion || !session) return;

      const isCorrect = answerIndex === currentQuestion.correctAnswer;
      const newScore = isCorrect ? session.score + 1 : session.score;
      const newAnswers = [...session.answers, answerIndex];

      set({
        selectedAnswer: answerIndex,
        showExplanation: true,
        session: {
          ...session,
          score: newScore,
          answers: newAnswers,
        },
      });
    },

    nextQuestion: async () => {
      const { session } = get();
      if (!session) return;

      const nextIndex = session.currentQuestionIndex + 1;

      // Check if quiz is completed
      if (nextIndex >= session.totalQuestions) {
        const completedSession = {
          ...session,
          completedAt: new Date(),
        };

        // Save to history
        useHistoryStore.getState().addHistory({
          id: session.id,
          keyword: session.keyword,
          score: session.score,
          totalQuestions: session.totalQuestions,
          completedAt: new Date(),
          questionIds: session.questions.map((q) => q.id),
        });

        set({
          status: 'completed',
          session: completedSession,
          showExplanation: false,
          selectedAnswer: null,
        });

        // Start prefetching next quiz
        prefetchNextQuiz(session.keyword);
        return;
      }

      // Check if next question is already loaded
      if (session.questions[nextIndex]) {
        set({
          session: {
            ...session,
            currentQuestionIndex: nextIndex,
          },
          currentQuestion: session.questions[nextIndex],
          selectedAnswer: null,
          showExplanation: false,
        });
      } else {
        // Need to fetch the next question on-demand
        set({ isLoadingNextQuestion: true });

        try {
          const askedQuestionIds = [
            ...useHistoryStore.getState().getAskedQuestionIds(session.keyword),
            ...session.questions.map((q) => q.id),
          ];

          const nextQuestion = await generateSingleQuestion(
            session.keyword,
            askedQuestionIds,
            nextIndex + 1,
            session.totalQuestions
          );

          const currentState = get();
          if (currentState.session) {
            const updatedQuestions = [...currentState.session.questions, nextQuestion];
            set({
              session: {
                ...currentState.session,
                questions: updatedQuestions,
                currentQuestionIndex: nextIndex,
              },
              currentQuestion: nextQuestion,
              selectedAnswer: null,
              showExplanation: false,
              isLoadingNextQuestion: false,
            });
          }
        } catch (error) {
          set({
            isLoadingNextQuestion: false,
            error: '次の問題の取得に失敗しました',
          });
        }
      }
    },

    usePrefetchedQuiz: () => {
      const { prefetchedQuiz } = get();
      if (!prefetchedQuiz?.ready) return false;

      const session: QuizSession = {
        id: `session_${Date.now()}`,
        keyword: prefetchedQuiz.keyword,
        questions: prefetchedQuiz.questions,
        currentQuestionIndex: 0,
        answers: [],
        score: 0,
        totalQuestions: prefetchedQuiz.questions.length,
        startedAt: new Date(),
      };

      set({
        status: 'in_progress',
        session,
        currentQuestion: prefetchedQuiz.questions[0],
        selectedAnswer: null,
        showExplanation: false,
        prefetchedQuiz: null,
      });

      return true;
    },

    restartQuiz: () => {
      const { keyword, prefetchedQuiz } = get();

      // Try to use prefetched quiz first
      if (prefetchedQuiz?.ready && prefetchedQuiz.keyword === keyword) {
        get().usePrefetchedQuiz();
      } else {
        get().validateAndStart(keyword);
      }
    },

    reset: () =>
      set({
        status: 'idle',
        keyword: '',
        validationResult: null,
        session: null,
        currentQuestion: null,
        selectedAnswer: null,
        showExplanation: false,
        isLoadingNextQuestion: false,
        error: null,
      }),
  };
});
