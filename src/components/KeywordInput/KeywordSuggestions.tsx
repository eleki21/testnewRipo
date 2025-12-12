import React from 'react';
import type { KeywordValidationResult } from '../../types/quiz';
import { Button } from '../common/Button';

interface KeywordSuggestionsProps {
  result: KeywordValidationResult;
  onSelect: (suggestion: string) => void;
}

export const KeywordSuggestions: React.FC<KeywordSuggestionsProps> = ({
  result,
  onSelect,
}) => {
  if (result.status === 'valid') {
    return null;
  }

  const getTitle = () => {
    switch (result.status) {
      case 'ambiguous':
        return 'このキーワードは複数の意味があります。どれを選びますか？';
      case 'not_found':
        return result.message || 'このキーワードは見つかりませんでした。';
      case 'inappropriate':
        return result.message || 'このキーワードは使用できません。';
      default:
        return '';
    }
  };

  const getVariant = () => {
    switch (result.status) {
      case 'ambiguous':
        return 'warning';
      case 'not_found':
      case 'inappropriate':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <div className={`keyword-suggestions suggestions-${getVariant()}`}>
      <p className="suggestions-title">{getTitle()}</p>

      {result.suggestions && result.suggestions.length > 0 && (
        <div className="suggestions-list">
          {result.suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="secondary"
              size="small"
              onClick={() => onSelect(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
