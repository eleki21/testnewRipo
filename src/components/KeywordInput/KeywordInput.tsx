import { useState } from 'react';
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
  const { isApiKeySet, isDemoMode, setDemoMode } = useSettingsStore();

  const canStart = isApiKeySet || isDemoMode;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && canStart) {
      validateAndStart(inputValue.trim());
    }
  };

  const handleStartDemo = () => {
    setDemoMode(true);
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
            disabled={isLoading || !canStart}
          />
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={!inputValue.trim() || !canStart}
          >
            クイズ開始
          </Button>
        </div>
      </form>

      {isDemoMode && (
        <p className="demo-mode-notice">
          デモモードで実行中 - サンプルのクイズが表示されます
        </p>
      )}

      {!canStart && (
        <div className="setup-options">
          <p className="api-key-warning">
            クイズを開始するには、設定画面でClaude APIキーを設定するか、デモモードをお試しください。
          </p>
          <Button
            variant="secondary"
            onClick={handleStartDemo}
          >
            デモモードで試す
          </Button>
        </div>
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
