/** Vocabulary shown on the dashboard. QuizPage keeps its own question set for now. */
export interface Word {
  chinese: string;
  pinyin: string;
  meaning: string;
  example: string;
  exampleEn: string;
}

export const VOCABULARY: Word[] = [
  { chinese: '朋友', pinyin: 'péngyou', meaning: 'friend', example: '我有很多朋友。', exampleEn: 'I have many friends.' },
  { chinese: '学习', pinyin: 'xuéxí', meaning: 'to study', example: '我每天学习汉语。', exampleEn: 'I study Chinese every day.' },
  { chinese: '老师', pinyin: 'lǎoshī', meaning: 'teacher', example: '她是我的汉语老师。', exampleEn: 'She is my Chinese teacher.' },
  { chinese: '喜欢', pinyin: 'xǐhuan', meaning: 'to like', example: '我喜欢喝茶。', exampleEn: 'I like drinking tea.' },
  { chinese: '今天', pinyin: 'jīntiān', meaning: 'today', example: '今天天气很好。', exampleEn: 'The weather is good today.' },
  { chinese: '谢谢', pinyin: 'xièxie', meaning: 'thank you', example: '谢谢你的帮助。', exampleEn: 'Thank you for your help.' },
  { chinese: '时间', pinyin: 'shíjiān', meaning: 'time', example: '现在几点？我没有时间。', exampleEn: 'I do not have time.' },
];

/** Deterministic by calendar day, so the word does not change on every render. */
export function wordOfTheDay(date = new Date()): Word {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  return VOCABULARY[dayOfYear % VOCABULARY.length];
}
