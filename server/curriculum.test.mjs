import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const cache = new Map();
function compile(name, dependencies = {}, extras = {}) {
  const source = readFileSync(new URL(`../src/data/${name}.ts`, import.meta.url), 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {};
  vm.runInNewContext(output, { exports, require: path => {
    if (path in dependencies) return dependencies[path];
    if (!path.startsWith('./')) throw Error('Unexpected dependency: ' + path);
    const moduleName = path.slice(2);
    if (!cache.has(moduleName)) cache.set(moduleName, compile(moduleName));
    return cache.get(moduleName);
  }, ...extras });
  return exports;
}
const model = compile('learningState');
const curriculum = compile('curriculum');
const attempt = (overrides = {}) => ({ id: 'round-1', lessonId: 'words-study', skill: 'Vocabulary', topic: 'Work & Study', level: 1, correct: 2, total: 2, seconds: 20, words: ['学习', '老师'], createdAt: 1000, ...overrides });

test('catalog uses existing original passages and words, with valid answer choices for each supported skill', () => {
  assert.equal(curriculum.LESSONS.length, 8);
  const levels = new Set();
  const ids = new Set();
  for (const lesson of curriculum.LESSONS) {
    assert.ok(!ids.has(lesson.id)); ids.add(lesson.id); levels.add(lesson.level);
    assert.equal(lesson.curriculumVersion, 'local-practice-v1');
    assert.match(lesson.sourceLabel, /Original/);
    for (const skill of curriculum.lessonSkills(lesson)) {
      const questions = curriculum.lessonQuestions(lesson, skill);
      assert.ok(questions.length > 0);
      for (const question of questions) {
        assert.ok(question.prompt); assert.ok(question.answer);
        if (question.input) assert.equal(question.choices.length, 0);
        else { assert.ok(question.choices.includes(question.answer)); assert.equal(new Set(question.choices).size, question.choices.length); assert.ok(question.choices.length >= 2); }
        if (skill === 'Listening') assert.ok(question.audio);
      }
    }
  }
  assert.deepEqual([...levels].sort(), [1, 2, 3, 4, 5, 6]);
  assert.equal(curriculum.lessonQuestions(curriculum.LESSONS[0], 'Reading').length, 0);
  assert.equal(curriculum.getLesson('missing'), undefined);
});

test('Chinese entry allows IME spacing and compatibility forms without accepting a different word', () => {
  const question = { answer: '学习' };
  assert.equal(curriculum.isCorrectAnswer(question, ' 学 习 '), true);
  assert.equal(curriculum.isCorrectAnswer(question, '老师'), false);
});

test('legacy state gains empty lesson progress and validated preference fields survive serialization', () => {
  const old = model.emptyLearningState(); delete old.lessonCompletions;
  old.profile = { name: 'Learner', hskLevel: 3, pinyin: false, notifications: true, studyGoal: 15 };
  const read = model.readLearningState(JSON.stringify(old));
  assert.equal(read.lessonCompletions.length, 0);
  assert.equal(read.profile.name, 'Learner'); assert.equal(read.profile.hskLevel, 3);
  assert.equal(read.profile.pinyin, false); assert.equal(read.profile.notifications, true); assert.equal(read.profile.studyGoal, 15);
  old.profile = { name: 'Learner', hskLevel: 9, pinyin: 'yes', notifications: 1, studyGoal: -1 };
  const normalized = model.readLearningState(JSON.stringify(old));
  assert.equal(normalized.profile.name, 'Learner'); assert.equal(normalized.profile.hskLevel, undefined);
  assert.equal(normalized.profile.pinyin, undefined); assert.equal(normalized.profile.notifications, undefined); assert.equal(normalized.profile.studyGoal, undefined);
});

test('invalid optional lesson records are rejected without overwriting saved progress', () => {
  for (const value of [null, {}, [{ lessonId: '', completedAt: 1 }], [{ lessonId: 'valid', completedAt: 'yesterday' }]]) {
    const state = model.emptyLearningState(); state.lessonCompletions = value;
    assert.throws(() => model.readLearningState(JSON.stringify(state)), /lesson progress/);
  }
});

test('lesson completion needs a saved perfect matching round; duplicate completion creates no rewards', () => {
  const empty = model.emptyLearningState();
  assert.throws(() => model.recordLessonCompletion(empty, 'words-study', 'round-1'), /every question correctly/);
  const failed = model.recordQuizCompletion(empty, attempt({ correct: 1 }));
  assert.throws(() => model.recordLessonCompletion(failed, 'words-study', 'round-1'), /every question correctly/);
  const saved = model.recordQuizCompletion(empty, attempt());
  assert.throws(() => model.recordLessonCompletion(saved, 'words-everyday', 'round-1'), /every question correctly/);
  const complete = model.recordLessonCompletion(saved, 'words-study', 'round-1');
  const reload = model.readLearningState(JSON.stringify(complete));
  assert.equal(reload.lessonCompletions.length, 1); assert.equal(reload.lessonCompletions[0].lessonId, 'words-study');
  assert.equal(reload.wallet.diamonds, 10);
  const duplicate = model.recordLessonCompletion(reload, 'words-study', 'round-1');
  assert.equal(duplicate.lessonCompletions.length, 1); assert.equal(duplicate.wallet.diamonds, 10);
});

test('empty or impossible attempts cannot earn diamonds', () => {
  for (const invalid of [{ total: 0 }, { correct: 3 }, { correct: -1 }, { seconds: -1 }, { id: '' }]) {
    assert.throws(() => model.recordQuizCompletion(model.emptyLearningState(), attempt(invalid)), /valid practice/);
  }
});

test('lesson completion and preference updates survive store reload; write failure retains last saved state', () => {
  const entries = new Map(); let full = false;
  const extras = { localStorage: { getItem: key => entries.get(key) ?? null, setItem: (key, value) => { if (full) throw Error('full'); entries.set(key, value); } }, window: { addEventListener() {} } };
  const deps = { react: { useSyncExternalStore: (_subscribe, get) => get() }, './learningState': model };
  const store = compile('learningStore', deps, extras);
  store.updateLearning(state => model.recordQuizCompletion({ ...state, profile: { ...state.profile, hskLevel: 2, pinyin: false } }, attempt()));
  full = true;
  assert.throws(() => store.updateLearning(state => model.recordLessonCompletion(state, 'words-study', 'round-1')));
  assert.equal(store.useLearning().lessonCompletions.length, 0);
  full = false;
  store.updateLearning(state => model.recordLessonCompletion(state, 'words-study', 'round-1'));
  const reload = compile('learningStore', deps, extras).useLearning();
  assert.equal(reload.lessonCompletions.length, 1); assert.equal(reload.profile.hskLevel, 2); assert.equal(reload.profile.pinyin, false);
  assert.equal(reload.attempts.length, 1); assert.equal(reload.wallet.diamonds, 10);
});
