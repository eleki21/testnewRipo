import type { QuizQuestion, KeywordValidationResult } from '../types/quiz';
import type { QuizQuestionData } from '../types/quizData';
import { useQuizDataStore } from '../store/quizDataStore';

export function getDemoKeywordValidation(keyword: string): KeywordValidationResult {
  // Simulate keyword validation
  const invalidKeywords = ['test', 'aaa', 'xxx'];
  const ambiguousKeywords = ['apple', 'python', 'java'];

  if (invalidKeywords.includes(keyword.toLowerCase())) {
    return {
      status: 'not_found',
      message: 'このキーワードは見つかりませんでした。',
      suggestions: ['プログラミング', 'Web開発', 'データベース'],
    };
  }

  if (ambiguousKeywords.includes(keyword.toLowerCase())) {
    return {
      status: 'ambiguous',
      suggestions: [
        `${keyword} (プログラミング言語)`,
        `${keyword} (テクノロジー)`,
        `${keyword} (コンピュータサイエンス)`,
        `${keyword} (ソフトウェア開発)`,
        `${keyword} (IT全般)`,
      ],
    };
  }

  return { status: 'valid' };
}

function convertToQuizQuestion(data: QuizQuestionData, keyword: string, index: number): QuizQuestion {
  return {
    id: `${keyword}_${Date.now()}_${index}`,
    question: data.question,
    options: data.options,
    correctAnswer: data.correctAnswer,
    explanation: data.explanation,
    technicalTerms: data.technicalTerms,
    referenceLinks: data.referenceLinks,
    imageKeyword: data.imageKeyword,
  };
}

export function getDemoQuizQuestions(keyword: string, count: number, categoryId?: string): QuizQuestion[] {
  const store = useQuizDataStore.getState();
  let questions = store.questions;

  // Filter by category if specified
  if (categoryId) {
    questions = questions.filter((q) => q.categoryId === categoryId);
  }

  // If no questions available, return empty array
  if (questions.length === 0) {
    return [];
  }

  // Shuffle and return requested number of questions
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled
    .slice(0, Math.min(count, shuffled.length))
    .map((q, index) => convertToQuizQuestion(q, keyword, index));
}

export function getQuestionsByCategoryId(categoryId: string, count: number): QuizQuestion[] {
  const store = useQuizDataStore.getState();
  const questions = store.questions.filter((q) => q.categoryId === categoryId);

  if (questions.length === 0) {
    return [];
  }

  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled
    .slice(0, Math.min(count, shuffled.length))
    .map((q, index) => convertToQuizQuestion(q, categoryId, index));
}
