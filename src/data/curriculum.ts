import { STORIES } from './stories';
import { VOCABULARY } from './vocabulary';

/** Versioned local practice collection. This is not an official HSK syllabus. */
export const CURRICULUM_VERSION = 'local-practice-v1' as const;
export const CURRICULUM_DESCRIPTION = 'Original practice material · suggested HSK 1–6 difficulty · not a complete or official HSK curriculum';
export type Skill = 'Vocabulary' | 'Reading' | 'Listening' | 'Writing';
export interface Lesson {
  id: string;
  title: string;
  english: string;
  pinyin?: string;
  level: number;
  topic: string;
  skill: Skill;
  curriculumVersion: typeof CURRICULUM_VERSION;
  sourceLabel: string;
  wordIndices?: number[];
  storyId?: string;
}
export interface Exercise {
  id: string;
  prompt: string;
  answer: string;
  choices: string[];
  word?: string;
  audio?: string;
  pinyin?: string;
  input?: boolean;
}
const sourceLabel = 'Original practice material';
const storyTopics: Record<string, string> = { tea: 'Daily Life', home: 'Travel', rain: 'Daily Life', shop: 'Shopping', letter: 'Work & Study', city: 'Culture' };
export const LESSONS: Lesson[] = [
  { id: 'words-everyday', title: '日常用语', english: 'Everyday expressions', pinyin: 'rìcháng yòngyǔ', level: 1, topic: 'Daily Life', skill: 'Vocabulary', curriculumVersion: CURRICULUM_VERSION, sourceLabel, wordIndices: [0, 3, 4, 5, 6] },
  { id: 'words-study', title: '学习汉语', english: 'Learning Chinese', pinyin: 'xuéxí Hànyǔ', level: 1, topic: 'Work & Study', skill: 'Vocabulary', curriculumVersion: CURRICULUM_VERSION, sourceLabel, wordIndices: [1, 2] },
  ...STORIES.map(story => ({ id: `story-${story.id}`, title: story.title, english: story.english, level: story.level, topic: storyTopics[story.id] || 'Daily Life', skill: 'Reading' as const, curriculumVersion: CURRICULUM_VERSION, sourceLabel, storyId: story.id })),
];
export const HSK_LEVELS = [1, 2, 3, 4, 5, 6] as const;
export const getLesson = (id: string | undefined) => LESSONS.find(lesson => lesson.id === id);
export const lessonSkills = (lesson: Lesson): Skill[] => lesson.wordIndices ? ['Vocabulary', 'Listening', 'Writing'] : ['Reading'];
export const lessonWords = (lesson: Lesson) => (lesson.wordIndices ?? []).map(index => VOCABULARY[index]);
export const lessonStory = (lesson: Lesson) => STORIES.find(story => story.id === lesson.storyId);
/** Rotate choices predictably so answers are not always in the same position. */
function options(answer: string, alternatives: string[], index: number): string[] {
  const choices = [answer, ...alternatives.filter(item => item !== answer)].slice(0, 4);
  const rotate = index % choices.length;
  return [...choices.slice(rotate), ...choices.slice(0, rotate)];
}
export function lessonQuestions(lesson: Lesson, skill: Skill = lesson.skill): Exercise[] {
  if (!lessonSkills(lesson).includes(skill)) return [];
  if (lesson.wordIndices) return lessonWords(lesson).map((word, index) => ({
    id: `${lesson.id}:${skill}:${index}`,
    prompt: skill === 'Listening' ? 'Listen, then choose the meaning.' : skill === 'Writing' ? `Type the Chinese word for “${word.meaning}”.` : word.chinese,
    answer: skill === 'Writing' ? word.chinese : word.meaning,
    choices: skill === 'Writing' ? [] : options(word.meaning, VOCABULARY.map(item => item.meaning), index + 1),
    word: word.chinese,
    audio: skill === 'Listening' ? word.chinese : undefined,
    pinyin: skill === 'Vocabulary' ? word.pinyin : undefined,
    input: skill === 'Writing',
  }));
  const story = lessonStory(lesson);
  return story?.lines.map(([chinese, english], index) => ({
    id: `${lesson.id}:Reading:${index}`, prompt: chinese, answer: english,
    choices: options(english, story.lines.map(line => line[1]), index + 1),
  })) ?? [];
}
export function normalizeExerciseAnswer(value: string) { return value.normalize('NFKC').trim().replace(/\s+/g, '').toLocaleLowerCase(); }
export const isCorrectAnswer = (exercise: Exercise, answer: string) => normalizeExerciseAnswer(exercise.answer) === normalizeExerciseAnswer(answer);
