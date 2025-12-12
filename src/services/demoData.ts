import type { QuizQuestion, KeywordValidationResult } from '../types/quiz';

// Demo quiz data for various keywords
const demoQuizData: Record<string, QuizQuestion[]> = {
  default: [
    {
      id: 'demo_1',
      question: 'プログラミング言語Pythonの名前の由来は何ですか？',
      options: [
        'ヘビのパイソンから',
        'イギリスのコメディ番組「モンティ・パイソン」から',
        '開発者の愛称から',
        'ギリシャ神話のピュトンから',
      ],
      correctAnswer: 1,
      explanation:
        'Pythonは、オランダ人プログラマーのグイド・ヴァン・ロッサムが1991年に開発しました。名前はイギリスのコメディ番組「モンティ・パイソンの空飛ぶサーカス」に由来しています。ヴァン・ロッサムはこの番組の大ファンで、短くてユニークな名前を探していた時にこの名前を選びました。',
      technicalTerms: [
        { term: 'プログラマー', definition: 'コンピュータプログラムを作成する専門家' },
        { term: 'モンティ・パイソン', definition: '1969年から1974年に放送されたイギリスのコメディ番組' },
      ],
      referenceLinks: [
        { title: 'Wikipedia - Python', url: 'https://ja.wikipedia.org/wiki/Python' },
      ],
      imageKeyword: 'python programming',
    },
    {
      id: 'demo_2',
      question: 'HTTPステータスコード404は何を意味しますか？',
      options: [
        'サーバーエラー',
        'リクエスト成功',
        'リソースが見つからない',
        '認証が必要',
      ],
      correctAnswer: 2,
      explanation:
        'HTTPステータスコード404は「Not Found」を意味し、リクエストされたリソース（ページやファイルなど）がサーバー上に存在しないことを示します。これはウェブ開発において最もよく知られたエラーコードの一つです。',
      technicalTerms: [
        { term: 'HTTP', definition: 'HyperText Transfer Protocolの略。ウェブ上でデータを転送するためのプロトコル' },
        { term: 'ステータスコード', definition: 'HTTPレスポンスの状態を3桁の数字で表したもの' },
      ],
      referenceLinks: [
        { title: 'Wikipedia - HTTP 404', url: 'https://ja.wikipedia.org/wiki/HTTP_404' },
      ],
      imageKeyword: 'web error 404',
    },
    {
      id: 'demo_3',
      question: 'GitHubの「Fork」機能は何をするためのものですか？',
      options: [
        'リポジトリを削除する',
        'リポジトリのコピーを自分のアカウントに作成する',
        'コードをマージする',
        'イシューを作成する',
      ],
      correctAnswer: 1,
      explanation:
        'Forkは、他のユーザーのリポジトリを自分のGitHubアカウントにコピーする機能です。これにより、元のリポジトリに影響を与えることなく、自由に変更を加えることができます。オープンソースプロジェクトへの貢献でよく使われます。',
      technicalTerms: [
        { term: 'リポジトリ', definition: 'プロジェクトのファイルやバージョン履歴を保存する場所' },
        { term: 'オープンソース', definition: 'ソースコードが公開され、誰でも自由に使用・改変できるソフトウェア' },
      ],
      referenceLinks: [
        { title: 'GitHub Docs - Fork', url: 'https://docs.github.com/ja/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo' },
      ],
      imageKeyword: 'github collaboration',
    },
    {
      id: 'demo_4',
      question: 'CSSのFlexboxで、主軸方向に要素を中央揃えにするプロパティはどれですか？',
      options: [
        'align-items: center',
        'justify-content: center',
        'text-align: center',
        'margin: auto',
      ],
      correctAnswer: 1,
      explanation:
        'justify-contentプロパティは、Flexコンテナ内のアイテムを主軸（デフォルトでは水平方向）に沿って配置します。centerを指定すると、アイテムが主軸の中央に配置されます。一方、align-itemsは交差軸（デフォルトでは垂直方向）の配置を制御します。',
      technicalTerms: [
        { term: 'Flexbox', definition: 'CSSのレイアウトモジュール。要素の配置を柔軟に行える' },
        { term: '主軸', definition: 'Flexコンテナのメイン方向。flex-directionで設定される' },
        { term: '交差軸', definition: '主軸に垂直な方向' },
      ],
      referenceLinks: [
        { title: 'MDN - Flexbox', url: 'https://developer.mozilla.org/ja/docs/Web/CSS/CSS_flexible_box_layout' },
      ],
      imageKeyword: 'css flexbox layout',
    },
    {
      id: 'demo_5',
      question: 'ReactのuseStateフックで状態を更新する際、前の状態を参照する正しい方法はどれですか？',
      options: [
        'setState(state + 1)',
        'setState(prev => prev + 1)',
        'state = state + 1',
        'this.setState({ count: count + 1 })',
      ],
      correctAnswer: 1,
      explanation:
        'useStateの更新関数には、関数を渡すことで前の状態を安全に参照できます。setState(prev => prev + 1)のように関数を使うと、Reactは最新の状態値を引数として渡してくれます。これにより、複数の更新が連続で行われる場合でも正確な値を参照できます。',
      technicalTerms: [
        { term: 'useState', definition: 'Reactの関数コンポーネントで状態を管理するためのフック' },
        { term: 'フック', definition: 'Reactの機能を関数コンポーネントで使用するための特別な関数' },
      ],
      referenceLinks: [
        { title: 'React Docs - useState', url: 'https://ja.react.dev/reference/react/useState' },
      ],
      imageKeyword: 'react programming',
    },
    {
      id: 'demo_6',
      question: 'SQLのJOIN句で、両方のテーブルに一致するレコードのみを返すのはどれですか？',
      options: [
        'LEFT JOIN',
        'RIGHT JOIN',
        'INNER JOIN',
        'FULL OUTER JOIN',
      ],
      correctAnswer: 2,
      explanation:
        'INNER JOINは、両方のテーブルで結合条件に一致するレコードのみを返します。LEFT JOINは左テーブルの全レコードと一致する右テーブルのレコードを、RIGHT JOINはその逆を返します。FULL OUTER JOINは両方のテーブルの全レコードを返します。',
      technicalTerms: [
        { term: 'JOIN', definition: '複数のテーブルを結合してデータを取得するSQL操作' },
        { term: 'レコード', definition: 'データベーステーブルの1行のデータ' },
      ],
      referenceLinks: [
        { title: 'Wikipedia - JOIN (SQL)', url: 'https://ja.wikipedia.org/wiki/JOIN_(SQL)' },
      ],
      imageKeyword: 'database sql',
    },
    {
      id: 'demo_7',
      question: 'JavaScriptで配列の要素をすべて2倍にした新しい配列を作るのに最適なメソッドはどれですか？',
      options: [
        'forEach()',
        'filter()',
        'map()',
        'reduce()',
      ],
      correctAnswer: 2,
      explanation:
        'map()メソッドは、配列の各要素に対して関数を実行し、その結果から新しい配列を生成します。[1,2,3].map(x => x * 2)は[2,4,6]を返します。forEach()は新しい配列を返さず、filter()は条件に合う要素を抽出し、reduce()は配列を単一の値に縮約します。',
      technicalTerms: [
        { term: 'map()', definition: '配列の各要素を変換して新しい配列を生成するメソッド' },
        { term: 'コールバック関数', definition: '他の関数に引数として渡され、後で呼び出される関数' },
      ],
      referenceLinks: [
        { title: 'MDN - Array.map()', url: 'https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/map' },
      ],
      imageKeyword: 'javascript code',
    },
    {
      id: 'demo_8',
      question: 'DockerでイメージからコンテナをW起動するコマンドはどれですか？',
      options: [
        'docker build',
        'docker pull',
        'docker run',
        'docker push',
      ],
      correctAnswer: 2,
      explanation:
        'docker runコマンドは、指定したイメージから新しいコンテナを作成して起動します。docker buildはDockerfileからイメージを作成し、docker pullはレジストリからイメージをダウンロードし、docker pushはイメージをレジストリにアップロードします。',
      technicalTerms: [
        { term: 'コンテナ', definition: 'アプリケーションとその依存関係を含む軽量な実行環境' },
        { term: 'イメージ', definition: 'コンテナを作成するためのテンプレート' },
      ],
      referenceLinks: [
        { title: 'Docker Docs', url: 'https://docs.docker.com/engine/reference/commandline/run/' },
      ],
      imageKeyword: 'docker container',
    },
    {
      id: 'demo_9',
      question: 'REST APIでリソースを新規作成する際に使用するHTTPメソッドはどれですか？',
      options: [
        'GET',
        'POST',
        'PUT',
        'DELETE',
      ],
      correctAnswer: 1,
      explanation:
        'POSTメソッドは新しいリソースを作成するために使用されます。GETはリソースの取得、PUTはリソースの更新または作成、DELETEはリソースの削除に使用されます。RESTful APIでは、これらのHTTPメソッドを使ってCRUD操作を表現します。',
      technicalTerms: [
        { term: 'REST', definition: 'Representational State Transferの略。Webサービスの設計スタイル' },
        { term: 'CRUD', definition: 'Create, Read, Update, Deleteの頭文字。データ操作の基本4機能' },
      ],
      referenceLinks: [
        { title: 'Wikipedia - REST', url: 'https://ja.wikipedia.org/wiki/Representational_State_Transfer' },
      ],
      imageKeyword: 'api web service',
    },
    {
      id: 'demo_10',
      question: 'TypeScriptで「型が文字列または数値」を表す型注釈はどれですか？',
      options: [
        'string & number',
        'string | number',
        'string + number',
        'string, number',
      ],
      correctAnswer: 1,
      explanation:
        'TypeScriptでは、|演算子（パイプ）を使ってユニオン型を定義します。string | numberは「文字列または数値」を意味します。一方、&演算子はインターセクション型（両方の型を満たす）を定義するために使用されます。',
      technicalTerms: [
        { term: 'ユニオン型', definition: '複数の型のいずれかを表す型。|で結合する' },
        { term: 'インターセクション型', definition: '複数の型のすべてを満たす型。&で結合する' },
      ],
      referenceLinks: [
        { title: 'TypeScript Handbook - Union Types', url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types' },
      ],
      imageKeyword: 'typescript programming',
    },
  ],
};

export function getDemoKeywordValidation(keyword: string): KeywordValidationResult {
  // Simulate keyword validation
  const invalidKeywords = ['test', 'aaa', 'xxx'];
  const ambiguousKeywords = ['apple', 'python', 'java'];

  if (invalidKeywords.includes(keyword.toLowerCase())) {
    return {
      status: 'not_found',
      message: 'このキーワードは見つかりませんでした。',
      suggestions: ['プログラミング', 'Web開発', 'データベース'],
    };
  }

  if (ambiguousKeywords.includes(keyword.toLowerCase())) {
    return {
      status: 'ambiguous',
      suggestions: [
        `${keyword} (プログラミング言語)`,
        `${keyword} (テクノロジー)`,
        `${keyword} (コンピュータサイエンス)`,
        `${keyword} (ソフトウェア開発)`,
        `${keyword} (IT全般)`,
      ],
    };
  }

  return { status: 'valid' };
}

export function getDemoQuizQuestions(keyword: string, count: number): QuizQuestion[] {
  const questions = demoQuizData.default;

  // Shuffle and return requested number of questions
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, questions.length)).map((q, index) => ({
    ...q,
    id: `${keyword}_demo_${Date.now()}_${index}`,
  }));
}
