import React from 'react';
import type { QuizSession } from '../../types/quiz';
import { useQuizStore } from '../../store/quizStore';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface QuizResultProps {
  session: QuizSession;
}

export const QuizResult: React.FC<QuizResultProps> = ({ session }) => {
  const { restartQuiz, reset, prefetchedQuiz } = useQuizStore();

  const percentage = Math.round((session.score / session.totalQuestions) * 100);

  const getGrade = () => {
    if (percentage >= 90) return { text: '素晴らしい!', emoji: '🏆', variant: 'success' as const };
    if (percentage >= 70) return { text: 'よくできました!', emoji: '🎉', variant: 'success' as const };
    if (percentage >= 50) return { text: 'まずまず!', emoji: '👍', variant: 'warning' as const };
    return { text: 'もう少し頑張ろう!', emoji: '💪', variant: 'error' as const };
  };

  const grade = getGrade();
  const isPrefetchReady = prefetchedQuiz?.ready && prefetchedQuiz.keyword === session.keyword;

  return (
    <div className="quiz-result">
      <div className="result-header">
        <span className="result-emoji">{grade.emoji}</span>
        <h2 className="result-title">{grade.text}</h2>
      </div>

      <div className="result-score">
        <div className="score-circle">
          <span className="score-value">{session.score}</span>
          <span className="score-divider">/</span>
          <span className="score-total">{session.totalQuestions}</span>
        </div>
        <p className="score-percentage">{percentage}%</p>
      </div>

      <div className="result-details">
        <p className="result-keyword">
          キーワード: <strong>{session.keyword}</strong>
        </p>
      </div>

      <div className="result-actions">
        <Button
          variant="primary"
          size="large"
          onClick={restartQuiz}
        >
          {isPrefetchReady && (
            <Badge variant="success">準備完了</Badge>
          )}
          同じキーワードで再挑戦
        </Button>
        <Button
          variant="secondary"
          size="large"
          onClick={reset}
        >
          新しいキーワードで挑戦
        </Button>
      </div>

      {isPrefetchReady && (
        <p className="prefetch-hint">
          次のクイズは準備完了しています。すぐに開始できます!
        </p>
      )}
    </div>
  );
};
