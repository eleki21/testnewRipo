import { useRef } from 'react';
import { useQuizDataStore } from '../../store/quizDataStore';
import { Button } from '../common/Button';
import type { QuizDataFile } from '../../types/quizData';

export const DataManager: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { categories, questions, exportData, importData, loadDefaultData, clearData } =
    useQuizDataStore();

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data: QuizDataFile = JSON.parse(text);

      // Basic validation
      if (!data.categories || !Array.isArray(data.categories)) {
        throw new Error('カテゴリデータが見つかりません');
      }
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error('問題データが見つかりません');
      }

      importData(data);
      alert(
        `インポート完了: ${data.categories.length}カテゴリ、${data.questions.length}問`
      );
    } catch (error) {
      alert(
        `インポートエラー: ${error instanceof Error ? error.message : '不明なエラー'}`
      );
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    if (confirm('すべてのカスタムデータを削除して、デフォルトデータを再読み込みしますか？')) {
      clearData();
      loadDefaultData();
    }
  };

  return (
    <div className="data-manager">
      <h4>クイズデータ管理</h4>

      <div className="data-stats">
        <div className="data-stat">
          <span className="data-stat-value">{categories.length}</span>
          <span className="data-stat-label">カテゴリ</span>
        </div>
        <div className="data-stat">
          <span className="data-stat-value">{questions.length}</span>
          <span className="data-stat-label">問題数</span>
        </div>
      </div>

      <div className="data-actions">
        <Button variant="primary" onClick={handleExport}>
          エクスポート (JSON)
        </Button>

        <Button variant="secondary" onClick={handleImportClick}>
          インポート
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <Button variant="danger" size="small" onClick={handleReset}>
          リセット
        </Button>
      </div>

      <p className="data-hint">
        JSONファイルをエクスポートして編集したり、カスタム問題をインポートできます。
      </p>
    </div>
  );
};
