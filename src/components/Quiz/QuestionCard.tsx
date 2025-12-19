import React from 'react';
import type { QuizQuestion } from '../../types/quiz';
import { AnswerOptions } from './AnswerOptions';
import { ExplanationCard } from './ExplanationCard';
import { Button } from '../common/Button';

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  showExplanation: boolean;
  isLoadingNext: boolean;
  onSelectAnswer: (index: number) => void;
  onNext: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  showExplanation,
  isLoadingNext,
  onSelectAnswer,
  onNext,
}) => {
  const isCorrect = selectedAnswer === question.answer;
  const isLastQuestion = questionNumber === totalQuestions;

  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-number">
          問題 {questionNumber} / {totalQuestions}
        </span>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className="question-content">
        <h3 className="question-text">{question.question}</h3>

        <AnswerOptions
          options={question.options}
          selectedAnswer={selectedAnswer}
          correctAnswer={question.answer}
          showResult={showExplanation}
          onSelect={onSelectAnswer}
        />

        {showExplanation && (
          <>
            <ExplanationCard question={question} isCorrect={isCorrect} />

            <div className="question-actions">
              <Button
                variant="primary"
                size="large"
                onClick={onNext}
                loading={isLoadingNext}
              >
                {isLastQuestion ? '結果を見る' : '次の問題へ'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
