import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('./progressMetrics.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { activityDays, challengeProgress, weekStart } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const now = new Date(2026, 10, 4, 12).getTime();
const empty = () => ({ attempts: [], reviews: [], lessonCompletions: [] });
const attempt = (id, createdAt, skill) => ({ id, createdAt, skill, correct: 1, total: 2, seconds: 20, words: [] });

test('new learner has zero activity and no completed missions', () => {
  assert.ok(activityDays(empty(), 7, now).every(day => day.total === 0));
  assert.ok(challengeProgress(empty(), now).every(mission => mission.count === 0));
});
test('weekly mission uses local Monday and distinct activity dates', () => {
  const monday = new Date(2026, 10, 2, 0).getTime();
  assert.equal(weekStart(now), monday);
  const state = empty();
  state.attempts = [attempt('old', monday - 1), attempt('one', monday + 1000), attempt('two', monday + 2000), attempt('future', now + 86400000)];
  state.reviews = [{ createdAt: now, character: '你' }];
  assert.equal(challengeProgress(state, now)[0].count, 2);
  assert.equal(challengeProgress(state, now).find(m => m.id === 'vocabulary').count, 2);
});
test('skill missions require tagged results and lesson starter deduplicates lessons', () => {
  const state = empty();
  state.attempts = [attempt('old-format', now), attempt('audio', now, 'Listening')];
  state.lessonCompletions = [{ lessonId: 'one', completedAt: now }, { lessonId: 'one', completedAt: now }];
  const missions = challengeProgress(state, now);
  assert.equal(missions.find(m => m.id === 'listening').count, 1);
  assert.equal(missions.find(m => m.id === 'vocabulary').count, 1);
  assert.equal(missions.find(m => m.id === 'lesson').count, 1);
});
test('period chart includes each event type and excludes future and older events', () => {
  const state = empty();
  state.attempts = [attempt('today', now), attempt('future', now + 86400000), attempt('old', now - 10 * 86400000)];
  state.reviews = [{ createdAt: now }];
  state.lessonCompletions = [{ lessonId: 'one', completedAt: now }];
  const rows = activityDays(state, 7, now);
  assert.equal(rows.length, 7);
  assert.deepEqual([rows.at(-1).practice, rows.at(-1).handwriting, rows.at(-1).lessons], [1, 1, 1]);
  assert.equal(rows.reduce((sum, day) => sum + day.total, 0), 3);
});
