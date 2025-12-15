import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuizCategory, QuizQuestionData, QuizDataFile } from '../types/quizData';

interface QuizDataState {
  categories: QuizCategory[];
  questions: QuizQuestionData[];
  isLoaded: boolean;
  error: string | null;
  selectedCategoryId: string | null;

  // Actions
  loadDefaultData: () => Promise<void>;
  importData: (data: QuizDataFile) => void;
  exportData: () => QuizDataFile;
  setSelectedCategory: (categoryId: string | null) => void;
  getQuestionsByCategory: (categoryId: string) => QuizQuestionData[];
  addQuestion: (question: QuizQuestionData) => void;
  addCategory: (category: QuizCategory) => void;
  clearData: () => void;
}

export const useQuizDataStore = create<QuizDataState>()(
  persist(
    (set, get) => ({
      categories: [],
      questions: [],
      isLoaded: false,
      error: null,
      selectedCategoryId: null,

      loadDefaultData: async () => {
        try {
          const response = await fetch('/quiz-data.json');
          if (!response.ok) {
            throw new Error('Failed to load quiz data');
          }
          const data: QuizDataFile = await response.json();
          set({
            categories: data.categories,
            questions: data.questions,
            isLoaded: true,
            error: null,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'データの読み込みに失敗しました',
            isLoaded: false,
          });
        }
      },

      importData: (data: QuizDataFile) => {
        // Validate data structure
        if (!data.categories || !data.questions) {
          set({ error: '無効なデータ形式です' });
          return;
        }

        // Merge with existing data or replace
        const existingCategories = get().categories;
        const existingQuestions = get().questions;

        // Create maps for deduplication
        const categoryMap = new Map(existingCategories.map((c) => [c.id, c]));
        const questionMap = new Map(existingQuestions.map((q) => [q.id, q]));

        // Add/update categories
        data.categories.forEach((cat) => {
          categoryMap.set(cat.id, cat);
        });

        // Add/update questions
        data.questions.forEach((q) => {
          questionMap.set(q.id, q);
        });

        set({
          categories: Array.from(categoryMap.values()),
          questions: Array.from(questionMap.values()),
          isLoaded: true,
          error: null,
        });
      },

      exportData: () => {
        const { categories, questions } = get();
        return {
          version: '1.0.0',
          exportedAt: new Date().toISOString(),
          categories,
          questions,
        };
      },

      setSelectedCategory: (categoryId) => {
        set({ selectedCategoryId: categoryId });
      },

      getQuestionsByCategory: (categoryId) => {
        return get().questions.filter((q) => q.categoryId === categoryId);
      },

      addQuestion: (question) => {
        set((state) => ({
          questions: [...state.questions, question],
        }));
      },

      addCategory: (category) => {
        set((state) => ({
          categories: [...state.categories, category],
        }));
      },

      clearData: () => {
        set({
          categories: [],
          questions: [],
          isLoaded: false,
          selectedCategoryId: null,
        });
      },
    }),
    {
      name: 'quiz-data',
      partialize: (state) => ({
        categories: state.categories,
        questions: state.questions,
        isLoaded: state.isLoaded,
      }),
    }
  )
);
