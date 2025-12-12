import { useMemo } from 'react';
import { useHistoryStore } from '../../store/historyStore';
import { useQuizStore } from '../../store/quizStore';
import { Button } from '../common/Button';

export const HistoryPanel: React.FC = () => {
  const { keywordStats, clearHistory } = useHistoryStore();
  const { setKeyword, validateAndStart, status } = useQuizStore();

  const groupedStats = useMemo(() => {
    return Object.values(keywordStats).sort(
      (a, b) =>
        new Date(b.lastAttemptAt).getTime() - new Date(a.lastAttemptAt).getTime()
    );
  }, [keywordStats]);

  const handlePlayAgain = (keyword: string) => {
    setKeyword(keyword);
    validateAndStart(keyword);
  };

  if (groupedStats.length === 0) {
    return (
      <div className="history-panel">
        <h3>履歴</h3>
        <p className="history-empty">まだクイズを受けていません。</p>
      </div>
    );
  }

  return (
    <div className="history-panel">
      <div className="history-header">
        <h3>履歴</h3>
        <Button
          variant="danger"
          size="small"
          onClick={() => {
            if (confirm('すべての履歴を削除しますか？')) {
              clearHistory();
            }
          }}
        >
          履歴をクリア
        </Button>
      </div>

      <div className="history-list">
        {groupedStats.map((stat) => (
          <div key={stat.keyword} className="history-item">
            <div className="history-item-header">
              <span className="history-keyword">{stat.keyword}</span>
              <span className="history-attempts">
                {stat.totalAttempts}回挑戦
              </span>
            </div>

            <div className="history-item-stats">
              <div className="stat">
                <span className="stat-label">正答率</span>
                <span className="stat-value">
                  {Math.round(stat.averageScore)}%
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">正解数</span>
                <span className="stat-value">
                  {stat.totalCorrect}/{stat.totalQuestions}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">最終挑戦</span>
                <span className="stat-value">
                  {new Date(stat.lastAttemptAt).toLocaleDateString('ja-JP')}
                </span>
              </div>
            </div>

            <Button
              variant="secondary"
              size="small"
              onClick={() => handlePlayAgain(stat.keyword)}
              disabled={status !== 'idle' && status !== 'completed'}
            >
              再挑戦
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
