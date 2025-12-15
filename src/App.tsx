import { useState, useEffect } from 'react';
import { KeywordInput } from './components/KeywordInput/KeywordInput';
import { QuizContainer } from './components/Quiz/QuizContainer';
import { HistoryPanel } from './components/History/HistoryPanel';
import { SettingsPanel } from './components/Settings/SettingsPanel';
import { CategorySelector } from './components/Category/CategorySelector';
import { useQuizStore } from './store/quizStore';
import { useSettingsStore } from './store/settingsStore';
import { useQuizDataStore } from './store/quizDataStore';
import './styles/index.css';

type Tab = 'quiz' | 'history' | 'settings';
type QuizMode = 'select' | 'category' | 'keyword';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('quiz');
  const [quizMode, setQuizMode] = useState<QuizMode>('select');
  const { status, startWithCategory, reset } = useQuizStore();
  const { isDemoMode, isApiKeySet } = useSettingsStore();
  const { loadDefaultData, isLoaded } = useQuizDataStore();

  // Load quiz data on mount
  useEffect(() => {
    if (!isLoaded) {
      loadDefaultData();
    }
  }, [isLoaded, loadDefaultData]);

  const showQuizUI = status === 'in_progress' || status === 'generating' || status === 'completed';

  const handleSelectCategory = (categoryId: string) => {
    startWithCategory(categoryId);
  };

  const handleSelectAll = () => {
    startWithCategory(null);
  };

  const handleBackToSelect = () => {
    reset();
    setQuizMode('select');
  };

  const canStart = isApiKeySet || isDemoMode;

  const renderQuizContent = () => {
    if (showQuizUI) {
      return (
        <>
          <button className="back-button" onClick={handleBackToSelect}>
            ← カテゴリ選択に戻る
          </button>
          <QuizContainer />
        </>
      );
    }

    // Show mode selection if not ready
    if (!canStart) {
      return <KeywordInput />;
    }

    // Demo mode: show category selector or keyword input
    if (isDemoMode) {
      if (quizMode === 'select') {
        return (
          <div className="mode-selector">
            <h3>クイズの開始方法を選択</h3>
            <div className="mode-options">
              <button
                className="mode-option"
                onClick={() => setQuizMode('category')}
              >
                <span className="mode-icon">📚</span>
                <span className="mode-name">カテゴリから選ぶ</span>
                <span className="mode-description">
                  用意されたカテゴリからクイズを選択
                </span>
              </button>
              <button
                className="mode-option"
                onClick={() => setQuizMode('keyword')}
              >
                <span className="mode-icon">🔍</span>
                <span className="mode-name">キーワードで検索</span>
                <span className="mode-description">
                  キーワードを入力してクイズを開始
                </span>
              </button>
            </div>
          </div>
        );
      }

      if (quizMode === 'category') {
        return (
          <>
            <button className="back-button" onClick={() => setQuizMode('select')}>
              ← 戻る
            </button>
            <CategorySelector
              onSelectCategory={handleSelectCategory}
              onSelectAll={handleSelectAll}
            />
          </>
        );
      }

      if (quizMode === 'keyword') {
        return (
          <>
            <button className="back-button" onClick={() => setQuizMode('select')}>
              ← 戻る
            </button>
            <KeywordInput />
          </>
        );
      }
    }

    // API mode: show keyword input only
    return <KeywordInput />;
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">AI クイズマスター</h1>
        <p className="app-subtitle">AIが生成するクイズに挑戦しよう</p>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-tab ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          クイズ
        </button>
        <button
          className={`nav-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          履歴
        </button>
        <button
          className={`nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          設定
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'quiz' && (
          <div className="quiz-section">
            {renderQuizContent()}
          </div>
        )}

        {activeTab === 'history' && <HistoryPanel />}

        {activeTab === 'settings' && <SettingsPanel />}
      </main>

      <footer className="app-footer">
        <p>Powered by Claude AI</p>
      </footer>
    </div>
  );
}

export default App;
