export interface Note { id: string; title: string; body: string; tag: string; type: 'video' | 'audio' | 'folder' | 'flashcard'; url?: string; date: string; duration: string; updatedAt: number }
export interface Message { id: string; chatId: string; text: string; createdAt: number }
export interface Conversation { id: string; title: string; updatedAt: number }
export interface Schedule { id: string; title: string; startsAt: string; completed: boolean }
export interface QuizAttempt { id: string; correct: number; total: number; seconds: number; createdAt: number; words: string[] }
export interface Review { id: string; character: string; score: number | null; summary: string; createdAt: number }
export interface DiamondTransaction { id: string; amount: number; reason: 'quiz-completed'; quizAttemptId: string; createdAt: number }
export interface DiamondWallet { diamonds: number; transactions: DiamondTransaction[] }
export interface LearningState { version: 1; profile: { name: string }; notes: Note[]; tags: string[]; conversations: Conversation[]; messages: Message[]; schedules: Schedule[]; attempts: QuizAttempt[]; reviews: Review[]; wallet: DiamondWallet }
export const QUIZ_DIAMOND_REWARD = 10;
export function emptyLearningState(): LearningState { return { version: 1, profile: { name: '' }, notes: [], tags: ['HSK 1', 'HSK 2', 'HSK 3', 'Grammar', 'Audio'], conversations: [], messages: [], schedules: [], attempts: [], reviews: [], wallet: { diamonds: 0, transactions: [] } }; }
export function readLearningState(raw: string | null): LearningState {
  if (!raw) return emptyLearningState();
  const parsed = JSON.parse(raw);
  if (parsed?.version !== 1 || !['notes', 'tags', 'conversations', 'messages', 'schedules', 'attempts', 'reviews'].every(k => Array.isArray(parsed[k]))) throw new Error('Your saved study data could not be read. Export a backup before making changes.');
  const wallet = parsed.wallet === undefined ? { diamonds: 0, transactions: [] } : parsed.wallet;
  if (!wallet || !Number.isSafeInteger(wallet.diamonds) || wallet.diamonds < 0 || !Array.isArray(wallet.transactions) || !wallet.transactions.every((t: DiamondTransaction) => t && typeof t.id === 'string' && Number.isSafeInteger(t.amount) && t.reason === 'quiz-completed' && typeof t.quizAttemptId === 'string' && Number.isFinite(t.createdAt))) throw new Error('Your saved diamond balance could not be read. Export a backup before making changes.');
  return { ...emptyLearningState(), ...parsed, wallet, profile: { name: typeof parsed.profile?.name === 'string' ? parsed.profile.name : '' } };
}
/** Save the result and reward together; retries must never award a second reward. */
export function recordQuizCompletion(state: LearningState, attempt: QuizAttempt): LearningState {
  if (state.attempts.some(a => a.id === attempt.id)) return state;
  const attempts = [...state.attempts, attempt];
  if (state.wallet.transactions.some(t => t.quizAttemptId === attempt.id)) return { ...state, attempts };
  const diamonds = state.wallet.diamonds + QUIZ_DIAMOND_REWARD;
  if (!Number.isSafeInteger(diamonds)) throw new Error('Your diamond balance could not be updated.');
  return { ...state, attempts, wallet: { diamonds, transactions: [...state.wallet.transactions, { id: `quiz:${attempt.id}`, amount: QUIZ_DIAMOND_REWARD, reason: 'quiz-completed', quizAttemptId: attempt.id, createdAt: attempt.createdAt }] } };
}
export function learningStats(state: LearningState, now = Date.now()) {
  const dates = new Set([...state.attempts, ...state.reviews].map(x => new Date(x.createdAt).toLocaleDateString('en-CA')));
  let streak = 0;
  const day = new Date(now); day.setHours(12, 0, 0, 0);
  if (!dates.has(day.toLocaleDateString('en-CA'))) day.setDate(day.getDate() - 1);
  while (dates.has(day.toLocaleDateString('en-CA'))) { streak++; day.setDate(day.getDate() - 1); }
  const total = state.attempts.reduce((n, x) => n + x.total, 0);
  const correct = state.attempts.reduce((n, x) => n + x.correct, 0);
  return { streak, quizCount: state.attempts.length, reviews: state.reviews.length, minutes: Math.floor(state.attempts.reduce((n, x) => n + x.seconds, 0) / 60), accuracy: total ? Math.round(correct / total * 100) : null, words: new Set(state.attempts.flatMap(x => x.words)).size };
}
