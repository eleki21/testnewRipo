const STORAGE_KEYS = {
  HISTORY: 'quiz_history',
  KEYWORD_STATS: 'keyword_stats',
  SETTINGS: 'quiz_settings',
  PREFETCHED_QUIZ: 'prefetched_quiz',
} as const;

const MAX_HISTORY_COUNT = 100;
const MAX_QUESTIONS_PER_KEYWORD = 50;

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to storage:', error);
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item) as T;
    }
  } catch (error) {
    console.error('Failed to load from storage:', error);
  }
  return defaultValue;
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from storage:', error);
  }
}

export function trimHistory<T extends { completedAt: Date }>(
  histories: T[]
): T[] {
  if (histories.length <= MAX_HISTORY_COUNT) {
    return histories;
  }
  return histories
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )
    .slice(0, MAX_HISTORY_COUNT);
}

export function trimAskedQuestions(questionIds: string[]): string[] {
  if (questionIds.length <= MAX_QUESTIONS_PER_KEYWORD) {
    return questionIds;
  }
  return questionIds.slice(-MAX_QUESTIONS_PER_KEYWORD);
}

export { STORAGE_KEYS, MAX_HISTORY_COUNT, MAX_QUESTIONS_PER_KEYWORD };
