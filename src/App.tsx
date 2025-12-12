import { useState } from 'react';
import { KeywordInput } from './components/KeywordInput/KeywordInput';
import { QuizContainer } from './components/Quiz/QuizContainer';
import { HistoryPanel } from './components/History/HistoryPanel';
import { SettingsPanel } from './components/Settings/SettingsPanel';
import { useQuizStore } from './store/quizStore';
import './styles/index.css';

type Tab = 'quiz' | 'history' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('quiz');
  const { status } = useQuizStore();

  const showQuizUI = status === 'in_progress' || status === 'generating' || status === 'completed';

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
            {!showQuizUI && <KeywordInput />}
            <QuizContainer />
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
