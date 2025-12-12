import { useMemo } from 'react';
import type { ReactNode } from 'react';
import type { QuizQuestion } from '../../types/quiz';
import { Tooltip } from './Tooltip';
import { getUnsplashImageUrl } from '../../services/unsplashApi';

interface ExplanationCardProps {
  question: QuizQuestion;
  isCorrect: boolean;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  question,
  isCorrect,
}) => {
  const imageUrl = useMemo(() => {
    if (question.imageKeyword) {
      return getUnsplashImageUrl(question.imageKeyword, 600, 300);
    }
    return null;
  }, [question.imageKeyword]);

  // Replace technical terms in explanation with tooltips
  const renderExplanationWithTooltips = () => {
    const explanation = question.explanation;
    const terms = question.technicalTerms;

    if (!terms || terms.length === 0) {
      return <p>{explanation}</p>;
    }

    // Sort terms by length (longest first) to avoid partial replacements
    const sortedTerms = [...terms].sort((a, b) => b.term.length - a.term.length);

    // Create a map of term positions
    const elements: ReactNode[] = [];
    let lastIndex = 0;

    // Find all term occurrences
    const occurrences: { term: typeof terms[0]; start: number; end: number }[] = [];

    for (const termObj of sortedTerms) {
      const regex = new RegExp(termObj.term, 'g');
      let match;
      while ((match = regex.exec(explanation)) !== null) {
        // Check if this position overlaps with existing occurrences
        const overlaps = occurrences.some(
          (occ) => match!.index < occ.end && match!.index + termObj.term.length > occ.start
        );
        if (!overlaps) {
          occurrences.push({
            term: termObj,
            start: match.index,
            end: match.index + termObj.term.length,
          });
        }
      }
    }

    // Sort occurrences by position
    occurrences.sort((a, b) => a.start - b.start);

    // Build elements array
    for (const occ of occurrences) {
      if (occ.start > lastIndex) {
        elements.push(explanation.slice(lastIndex, occ.start));
      }
      elements.push(
        <Tooltip key={occ.start} term={occ.term.term} definition={occ.term.definition}>
          {occ.term.term}
        </Tooltip>
      );
      lastIndex = occ.end;
    }

    if (lastIndex < explanation.length) {
      elements.push(explanation.slice(lastIndex));
    }

    return <p>{elements}</p>;
  };

  return (
    <div className={`explanation-card ${isCorrect ? 'correct' : 'incorrect'}`}>
      <div className="explanation-header">
        <span className={`result-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
          {isCorrect ? '正解!' : '不正解'}
        </span>
      </div>

      {imageUrl && (
        <div className="explanation-image">
          <img src={imageUrl} alt="解説画像" loading="lazy" />
        </div>
      )}

      <div className="explanation-content">
        <h4>解説</h4>
        {renderExplanationWithTooltips()}

        {question.technicalTerms && question.technicalTerms.length > 0 && (
          <div className="terms-hint">
            <span className="hint-icon">💡</span>
            <span>青い文字をホバー/タップすると用語の説明が表示されます</span>
          </div>
        )}
      </div>

      {question.referenceLinks && question.referenceLinks.length > 0 && (
        <div className="reference-links">
          <h5>参考リンク</h5>
          <ul>
            {question.referenceLinks.map((link, index) => (
              <li key={index}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
