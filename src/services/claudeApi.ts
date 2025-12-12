import Anthropic from '@anthropic-ai/sdk';
import type {
  QuizQuestion,
  KeywordValidationResult,
} from '../types/quiz';

let anthropicClient: Anthropic | null = null;

export function initializeClient(apiKey: string): void {
  anthropicClient = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  });
}

export function getClient(): Anthropic {
  if (!anthropicClient) {
    throw new Error('Claude API client not initialized. Please set your API key.');
  }
  return anthropicClient;
}

export async function validateKeyword(
  keyword: string
): Promise<KeywordValidationResult> {
  const client = getClient();

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `あなたはキーワード検証システムです。以下のキーワードを分析し、クイズ生成に適しているか判断してください。

キーワード: "${keyword}"

以下のJSON形式で回答してください（JSON以外は出力しないでください）:

1. 有効なキーワード（具体的で明確なトピック）の場合:
{"status": "valid"}

2. 曖昧なキーワード（複数の解釈が可能）の場合:
{"status": "ambiguous", "suggestions": ["候補1", "候補2", "候補3", "候補4", "候補5"]}

3. 存在しない・意味不明な言葉の場合:
{"status": "not_found", "suggestions": ["修正候補1", "修正候補2", "修正候補3"], "message": "エラーメッセージ"}

4. 不適切なキーワード（暴力的、差別的など）の場合:
{"status": "inappropriate", "message": "このキーワードは使用できません。"}`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  try {
    return JSON.parse(content.text) as KeywordValidationResult;
  } catch {
    return { status: 'valid' };
  }
}

export async function* generateQuizQuestions(
  keyword: string,
  count: number,
  excludeQuestionIds: string[]
): AsyncGenerator<QuizQuestion> {
  const client = getClient();

  for (let i = 0; i < count; i++) {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `あなたはクイズ作成の専門家です。「${keyword}」に関する中程度〜難しめの4択クイズを1問作成してください。

${excludeQuestionIds.length > 0 ? `注意: 以下の問題IDと似た問題は避けてください: ${excludeQuestionIds.slice(-10).join(', ')}` : ''}

問題番号: ${i + 1}/${count}

以下のJSON形式で回答してください（JSON以外は出力しないでください）:
{
  "id": "一意のID（keyword_timestamp_index形式）",
  "question": "問題文",
  "options": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
  "correctAnswer": 0,
  "explanation": "詳しい解説文（200-300文字程度）",
  "technicalTerms": [
    {"term": "専門用語1", "definition": "定義1"},
    {"term": "専門用語2", "definition": "定義2"}
  ],
  "referenceLinks": [
    {"title": "Wikipedia - 関連記事", "url": "https://ja.wikipedia.org/wiki/..."},
    {"title": "参考サイト", "url": "https://..."}
  ],
  "imageKeyword": "Unsplash検索用の英語キーワード"
}

注意:
- correctAnswerは0-3の数値（正解の選択肢のインデックス）
- technicalTermsは2〜4個
- referenceLinksは1〜3個（実在するURLを推測で記載）
- imageKeywordは解説に関連する画像検索用キーワード（英語）`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    try {
      const question = JSON.parse(content.text) as QuizQuestion;
      question.id = `${keyword}_${Date.now()}_${i}`;
      excludeQuestionIds.push(question.id);
      yield question;
    } catch (error) {
      console.error('Failed to parse question:', error);
      const fallbackQuestion: QuizQuestion = {
        id: `${keyword}_${Date.now()}_${i}`,
        question: `${keyword}に関する問題の生成に失敗しました。`,
        options: ['選択肢A', '選択肢B', '選択肢C', '選択肢D'],
        correctAnswer: 0,
        explanation: '問題の生成中にエラーが発生しました。',
        technicalTerms: [],
        referenceLinks: [],
      };
      yield fallbackQuestion;
    }
  }
}

export async function generateSingleQuestion(
  keyword: string,
  excludeQuestionIds: string[],
  questionNumber: number,
  totalQuestions: number
): Promise<QuizQuestion> {
  const client = getClient();

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `あなたはクイズ作成の専門家です。「${keyword}」に関する中程度〜難しめの4択クイズを1問作成してください。

${excludeQuestionIds.length > 0 ? `注意: 以下の問題IDと似た問題は避けてください: ${excludeQuestionIds.slice(-10).join(', ')}` : ''}

問題番号: ${questionNumber}/${totalQuestions}

以下のJSON形式で回答してください（JSON以外は出力しないでください）:
{
  "id": "一意のID",
  "question": "問題文",
  "options": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
  "correctAnswer": 0,
  "explanation": "詳しい解説文（200-300文字程度）",
  "technicalTerms": [
    {"term": "専門用語1", "definition": "定義1"},
    {"term": "専門用語2", "definition": "定義2"}
  ],
  "referenceLinks": [
    {"title": "Wikipedia - 関連記事", "url": "https://ja.wikipedia.org/wiki/..."},
    {"title": "参考サイト", "url": "https://..."}
  ],
  "imageKeyword": "Unsplash検索用の英語キーワード"
}`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  const question = JSON.parse(content.text) as QuizQuestion;
  question.id = `${keyword}_${Date.now()}_${questionNumber}`;
  return question;
}
