import { useEffect } from 'react';
import { useQuizDataStore } from '../../store/quizDataStore';
import { Button } from '../common/Button';
import { Loading } from '../common/Loading';

interface CategorySelectorProps {
  onSelectCategory: (categoryId: string) => void;
  onSelectAll: () => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  onSelectCategory,
  onSelectAll,
}) => {
  const { categories, isLoaded, error, loadDefaultData } = useQuizDataStore();

  useEffect(() => {
    if (!isLoaded && categories.length === 0) {
      loadDefaultData();
    }
  }, [isLoaded, categories.length, loadDefaultData]);

  if (!isLoaded && categories.length === 0) {
    return <Loading message="カテゴリを読み込み中..." />;
  }

  if (error) {
    return (
      <div className="category-error">
        <p>{error}</p>
        <Button onClick={loadDefaultData}>再読み込み</Button>
      </div>
    );
  }

  const getQuestionCount = (categoryId: string) => {
    const questions = useQuizDataStore.getState().questions;
    return questions.filter((q) => q.categoryId === categoryId).length;
  };

  return (
    <div className="category-selector">
      <h3 className="category-title">カテゴリを選択</h3>
      <p className="category-subtitle">挑戦したいカテゴリを選んでください</p>

      <div className="category-grid">
        <button
          className="category-card category-all"
          onClick={onSelectAll}
        >
          <span className="category-icon">🎯</span>
          <span className="category-name">すべてのカテゴリ</span>
          <span className="category-description">全カテゴリからランダムに出題</span>
          <span className="category-count">
            {useQuizDataStore.getState().questions.length}問
          </span>
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            className="category-card"
            onClick={() => onSelectCategory(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
            <span className="category-description">{category.description}</span>
            <span className="category-count">
              {getQuestionCount(category.id)}問
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
