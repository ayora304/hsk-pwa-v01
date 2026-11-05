import type { LearningState } from '../../data/learningState';

export const dayKey = (time: number) => {
  const date = new Date(time);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
export function weekStart(now: number) {
  const date = new Date(now);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - (date.getDay() + 6) % 7);
  return date.getTime();
}
export function activityEvents(data: LearningState) {
  return [
    ...data.attempts.map(event => ({ at: event.createdAt, kind: 'Practice' })),
    ...data.reviews.map(event => ({ at: event.createdAt, kind: 'Handwriting' })),
    ...(data.lessonCompletions ?? []).map(event => ({ at: event.completedAt, kind: 'Lessons' })),
  ].filter(event => Number.isFinite(event.at));
}
export function activityDays(data: LearningState, days: number, now: number) {
  const events = activityEvents(data).filter(event => event.at <= now);
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - days + index + 1);
    const key = dayKey(date.getTime());
    const records = events.filter(event => dayKey(event.at) === key);
    return { key, label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), practice: records.filter(x => x.kind === 'Practice').length, handwriting: records.filter(x => x.kind === 'Handwriting').length, lessons: records.filter(x => x.kind === 'Lessons').length, total: records.length };
  });
}
export function challengeProgress(data: LearningState, now: number) {
  const start = weekStart(now);
  const weekly = data.attempts.filter(a => a.createdAt >= start && a.createdAt <= now);
  const days = new Set(activityEvents(data).filter(event => event.at >= start && event.at <= now).map(event => dayKey(event.at))).size;
  return [
    { id: 'weekly', title: 'Three days of Chinese', description: 'Complete a practice, handwriting review, or lesson on three different days this week.', count: days, goal: 3, href: '/practice', weekly: true },
    { id: 'first-practice', title: 'First steps', description: 'Save one completed practice result. Any score qualifies.', count: data.attempts.length, goal: 1, href: '/practice', weekly: false },
    { id: 'vocabulary', title: 'Vocabulary sprint', description: 'Save three Vocabulary practice results this week. Earlier untagged quizzes also qualify as vocabulary.', count: weekly.filter(a => !a.skill || a.skill === 'Vocabulary').length, goal: 3, href: '/practice?skill=Vocabulary', weekly: true },
    { id: 'handwriting', title: 'Character explorer', description: 'Save one handwriting review, scored or unscored.', count: data.reviews.length, goal: 1, href: '/whiteboard', weekly: false },
    { id: 'lesson', title: 'Lesson finisher', description: 'Complete one available lesson and save its completion.', count: new Set((data.lessonCompletions ?? []).map(x => x.lessonId)).size, goal: 1, href: '/classroom', weekly: false },
    { id: 'listening', title: 'Listening focus', description: 'Save two Listening practice results this week. Audio playback alone does not count.', count: weekly.filter(a => a.skill === 'Listening').length, goal: 2, href: '/practice?skill=Listening', weekly: true },
  ];
}
