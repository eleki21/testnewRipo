import { useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { Button } from '../common/Button';

export const SettingsPanel: React.FC = () => {
  const { settings, isApiKeySet, isDemoMode, setQuestionCount, setApiKey, clearApiKey, setDemoMode } =
    useSettingsStore();
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      setApiKeyInput('');
    }
  };

  const questionCountOptions: (3 | 5 | 10)[] = [3, 5, 10];

  return (
    <div className="settings-panel">
      <h3>設定</h3>

      <div className="setting-group">
        <label className="setting-label">モード</label>
        <div className="setting-options">
          <button
            className={`setting-option ${isDemoMode ? 'active' : ''}`}
            onClick={() => setDemoMode(true)}
          >
            デモモード
          </button>
          <button
            className={`setting-option ${!isDemoMode && isApiKeySet ? 'active' : ''}`}
            onClick={() => setDemoMode(false)}
            disabled={!isApiKeySet}
          >
            APIモード
          </button>
        </div>
        <p className="setting-hint">
          デモモードではサンプルのクイズが表示されます。AIによる問題生成にはAPIキーが必要です。
        </p>
      </div>

      <div className="setting-group">
        <label className="setting-label">問題数</label>
        <div className="setting-options">
          {questionCountOptions.map((count) => (
            <button
              key={count}
              className={`setting-option ${
                settings.questionCount === count ? 'active' : ''
              }`}
              onClick={() => setQuestionCount(count)}
            >
              {count}問
            </button>
          ))}
        </div>
      </div>

      <div className="setting-group">
        <label className="setting-label">Claude API キー</label>
        {isApiKeySet ? (
          <div className="api-key-status">
            <span className="api-key-set">APIキー設定済み ✓</span>
            <Button
              variant="danger"
              size="small"
              onClick={() => {
                if (confirm('APIキーを削除しますか？')) {
                  clearApiKey();
                }
              }}
            >
              削除
            </Button>
          </div>
        ) : (
          <div className="api-key-input-group">
            <div className="input-with-toggle">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="sk-ant-..."
                className="api-key-input"
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? '🙈' : '👁️'}
              </button>
            </div>
            <Button
              variant="primary"
              size="small"
              onClick={handleSaveApiKey}
              disabled={!apiKeyInput.trim()}
            >
              保存
            </Button>
          </div>
        )}
        <p className="setting-hint">
          <a
            href="https://console.anthropic.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Anthropic Console
          </a>
          でAPIキーを取得できます。
        </p>
      </div>
    </div>
  );
};
