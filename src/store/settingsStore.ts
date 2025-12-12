import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuizSettings } from '../types/quiz';
import { initializeClient } from '../services/claudeApi';

interface SettingsState {
  settings: QuizSettings;
  isApiKeySet: boolean;
  isDemoMode: boolean;
  setQuestionCount: (count: 3 | 5 | 10) => void;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  setDemoMode: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: {
        questionCount: 5,
        apiKey: '',
      },
      isApiKeySet: false,
      isDemoMode: false,

      setQuestionCount: (count) =>
        set((state) => ({
          settings: { ...state.settings, questionCount: count },
        })),

      setApiKey: (key) => {
        initializeClient(key);
        set((state) => ({
          settings: { ...state.settings, apiKey: key },
          isApiKeySet: true,
          isDemoMode: false,
        }));
      },

      clearApiKey: () =>
        set((state) => ({
          settings: { ...state.settings, apiKey: '' },
          isApiKeySet: false,
        })),

      setDemoMode: (enabled) =>
        set({
          isDemoMode: enabled,
        }),
    }),
    {
      name: 'quiz-settings',
      onRehydrateStorage: () => (state) => {
        if (state?.settings.apiKey) {
          initializeClient(state.settings.apiKey);
          state.isApiKeySet = true;
        }
      },
    }
  )
);
