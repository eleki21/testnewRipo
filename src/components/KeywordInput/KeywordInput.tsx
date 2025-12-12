import React, { useState } from 'react';
import { useQuizStore } from '../../store/quizStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Button } from '../common/Button';
import { KeywordSuggestions } from './KeywordSuggestions';

export const KeywordInput: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const {
    status,
    validationResult,
    validateAndStart,
    selectSuggestion,
    error,
  } = useQuizStore();
  const { isApiKeySet } = useSettingsStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && isApiKeySet) {
      validateAndStart(inputValue.trim());
    }
  };

  const isLoading = status === 'validating' || status === 'generating';

  return (
    <div className="keyword-input-container">
      <form onSubmit={handleSubmit} className="keyword-form">
        <div className="input-group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="クイズのキーワードを入力..."
            className="keyword-input"
            disabled={isLoading || !isApiKeySet}
          />
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={!inputValue.trim() || !isApiKeySet}
          >
            クイズ開始
          </Button>
        </div>
      </form>

      {!isApiKeySet && (
        <p className="api-key-warning">
          クイズを開始するには、設定画面でClaude APIキーを設定してください。
        </p>
      )}

      {error && <p className="error-message">{error}</p>}

      {validationResult && validationResult.status !== 'valid' && (
        <KeywordSuggestions
          result={validationResult}
          onSelect={(suggestion) => {
            setInputValue(suggestion);
            selectSuggestion(suggestion);
          }}
        />
      )}
    </div>
  );
};
