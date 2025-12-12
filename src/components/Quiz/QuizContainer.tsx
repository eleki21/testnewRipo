import React from 'react';
import { useQuizStore } from '../../store/quizStore';
import { QuestionCard } from './QuestionCard';
import { QuizResult } from './QuizResult';
import { Loading } from '../common/Loading';

export const QuizContainer: React.FC = () => {
  const {
    status,
    session,
    currentQuestion,
    selectedAnswer,
    showExplanation,
    isLoadingNextQuestion,
    selectAnswer,
    nextQuestion,
  } = useQuizStore();

  if (status === 'generating') {
    return (
      <div className="quiz-container">
        <Loading message="クイズを生成中..." size="large" />
      </div>
    );
  }

  if (status === 'completed' && session) {
    return (
      <div className="quiz-container">
        <QuizResult session={session} />
      </div>
    );
  }

  if (status === 'in_progress' && currentQuestion && session) {
    return (
      <div className="quiz-container">
        <QuestionCard
          question={currentQuestion}
          questionNumber={session.currentQuestionIndex + 1}
          totalQuestions={session.totalQuestions}
          selectedAnswer={selectedAnswer}
          showExplanation={showExplanation}
          isLoadingNext={isLoadingNextQuestion}
          onSelectAnswer={selectAnswer}
          onNext={nextQuestion}
        />
      </div>
    );
  }

  return null;
};
