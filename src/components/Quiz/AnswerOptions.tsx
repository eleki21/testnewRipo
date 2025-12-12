import React from 'react';

interface AnswerOptionsProps {
  options: string[];
  selectedAnswer: number | null;
  correctAnswer: number;
  showResult: boolean;
  onSelect: (index: number) => void;
}

export const AnswerOptions: React.FC<AnswerOptionsProps> = ({
  options,
  selectedAnswer,
  correctAnswer,
  showResult,
  onSelect,
}) => {
  const getOptionClass = (index: number) => {
    const baseClass = 'answer-option';

    if (!showResult) {
      return `${baseClass} ${selectedAnswer === index ? 'selected' : ''}`;
    }

    if (index === correctAnswer) {
      return `${baseClass} correct`;
    }

    if (selectedAnswer === index && index !== correctAnswer) {
      return `${baseClass} incorrect`;
    }

    return baseClass;
  };

  const getOptionLabel = (index: number) => {
    const labels = ['A', 'B', 'C', 'D'];
    return labels[index];
  };

  return (
    <div className="answer-options">
      {options.map((option, index) => (
        <button
          key={index}
          className={getOptionClass(index)}
          onClick={() => !showResult && onSelect(index)}
          disabled={showResult}
        >
          <span className="option-label">{getOptionLabel(index)}</span>
          <span className="option-text">{option}</span>
          {showResult && index === correctAnswer && (
            <span className="option-icon correct-icon">✓</span>
          )}
          {showResult && selectedAnswer === index && index !== correctAnswer && (
            <span className="option-icon incorrect-icon">✗</span>
          )}
        </button>
      ))}
    </div>
  );
};
