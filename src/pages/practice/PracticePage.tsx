import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { CURRICULUM_DESCRIPTION, getLesson, HSK_LEVELS, LESSONS, lessonQuestions, lessonSkills, type Skill } from '../../data/curriculum';
import { useLearning } from '../../data/learningStore';
import { VOCABULARY } from '../../data/vocabulary';
import { ExercisePlayer } from '../lessons/ExercisePlayer';
import './practice.css';

const skills: Skill[] = ['Vocabulary', 'Reading', 'Listening', 'Writing'];
export function PracticePage() {
  const data = useLearning();
  const [params, setParams] = useSearchParams();
  const requestedSkill = params.get('skill');
  const skill: Skill = skills.includes(requestedSkill as Skill) ? requestedSkill as Skill : 'Vocabulary';
  const rawLevel = params.get('level');
  const level = rawLevel === 'all' ? 'all' : HSK_LEVELS.includes(Number(rawLevel) as typeof HSK_LEVELS[number]) ? rawLevel! : String(data.profile.hskLevel ?? 'all');
  const topic = params.get('topic') ?? 'All';
  const flashcards = params.get('mode') === 'flashcards';
  const selected = getLesson(params.get('lesson') ?? undefined);
  const topics = Array.from(new Set(LESSONS.filter(lesson => lessonSkills(lesson).includes(skill) && (level === 'all' || lesson.level === Number(level))).map(lesson => lesson.topic)));
  const filtered = LESSONS.filter(lesson => lessonSkills(lesson).includes(skill) && (level === 'all' || lesson.level === Number(level)) && (topic === 'All' || lesson.topic === topic));
  function filter(name: string, value: string) {
    const next = new URLSearchParams(params); next.set(name, value); next.delete('lesson');
    if (name === 'skill' || name === 'level') next.delete('topic');
    setParams(next);
  }
  return <div className="study-page practice-page">
    <header className="study-header"><div><p className="practice-eyebrow">Make a little progress</p><h1>Strengthen your skills</h1><p className="study-muted">Choose an activity, get immediate feedback, and save your completed round.</p></div><Link className="study-button" to="/learn"><BookOpen size={18}/> Explore lessons</Link></header>
    <div className="study-tabs" role="group" aria-label="Practice mode"><button className="study-button" aria-pressed={!flashcards} onClick={() => { const next = new URLSearchParams(params); next.delete('mode'); next.delete('lesson'); setParams(next); }}>Exercises</button><button className="study-button" aria-pressed={flashcards} onClick={() => { const next = new URLSearchParams(params); next.set('mode', 'flashcards'); next.delete('lesson'); setParams(next); }}>Flashcards</button><Link className="study-button" to="/whiteboard">Handwriting whiteboard</Link></div>
    {flashcards ? <Flashcards/> : <>
      <section className="study-card practice-filters" aria-label="Activity filters">
        <label className="study-field">Suggested level<select value={level} onChange={event => filter('level', event.target.value)}><option value="all">All levels</option>{HSK_LEVELS.map(item => <option key={item} value={item}>HSK {item}</option>)}</select></label>
        <label className="study-field">Skill<select value={skill} onChange={event => filter('skill', event.target.value)}>{skills.map(item => <option key={item}>{item}</option>)}</select></label>
        <label className="study-field">Topic<select value={topic} onChange={event => filter('topic', event.target.value)}><option>All</option>{topics.map(item => <option key={item}>{item}</option>)}</select></label>
      </section>
      <p className="study-muted">{CURRICULUM_DESCRIPTION}. Grammar exercises and speech scoring are unavailable. Listening uses your device’s Chinese voice.</p>
      {selected && lessonSkills(selected).includes(skill) ? <>
        <div className="practice-activity-heading"><div><p className="study-muted">Suggested HSK {selected.level} · {selected.topic}</p><h2>{selected.english}</h2></div><button className="study-button" onClick={() => { const next = new URLSearchParams(params); next.delete('lesson'); setParams(next); }}>Return to activities</button></div>
        <p className="study-muted">Answers remain in this round until you save at the end. Leaving or changing filters discards unfinished answers.</p>
        <ExercisePlayer key={`${selected.id}:${skill}`} lesson={selected} skill={skill} questions={lessonQuestions(selected, skill)}/>
      </> : <>
        <div className="practice-activity-heading"><h2>Find your next activity</h2><span className="study-muted">{filtered.reduce((count, lesson) => count + lessonQuestions(lesson, skill).length, 0)} exercises · {filtered.length} activities</span></div>
        {filtered.length ? <div className="study-grid practice-activities">{filtered.map(lesson => <article className="study-card" key={lesson.id}><span className={`practice-skill practice-skill-${skill.toLowerCase()}`}>{skill}</span><p className="study-muted">Suggested HSK {lesson.level} · {lesson.topic}</p><h3 lang="zh-CN">{lesson.title}</h3><p>{lesson.english}</p><p className="study-muted">{lessonQuestions(lesson, skill).length} questions · {lesson.sourceLabel}</p><button className="study-button primary" onClick={() => filter('lesson', lesson.id)}>Start activity <ArrowRight size={17}/></button><Link className="practice-lesson-link" to={`/lessons/${lesson.id}`}>Review lesson first</Link></article>)}</div> : <section className="study-card study-empty"><h2>No activities match these filters</h2><p>Reading passages are available at suggested levels 1–6. Vocabulary, typing, and listening currently use the beginner word collection.</p><button className="study-button primary" onClick={() => { const next = new URLSearchParams(); next.set('skill', skill); next.set('level', 'all'); setParams(next); }}><RotateCcw size={17}/> Show all available activities</button></section>}
      </>}
    </>}
  </div>;
}
function Flashcards() {
  const data = useLearning();
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const word = VOCABULARY[index];
  function move(offset: number) { setIndex((index + offset + VOCABULARY.length) % VOCABULARY.length); setRevealed(false); }
  return <section className="study-card practice-flashcards" aria-label="Vocabulary flashcards"><div><p className="practice-eyebrow">Original beginner practice</p><h2>One word at a time</h2><p className="study-muted">{VOCABULARY.length} words from this app’s vocabulary collection. Self-review does not award diamonds or mark words mastered.</p></div><p className="study-muted" aria-live="polite">Card {index + 1} of {VOCABULARY.length}</p><div className="practice-flashcard"><strong lang="zh-CN">{word.chinese}</strong>{data.profile.pinyin !== false && <p className="study-muted">{word.pinyin}</p>}{revealed ? <div id="flashcard-meaning" aria-live="polite"><h3>{word.meaning}</h3><p lang="zh-CN">{word.example}</p><p className="study-muted">{word.exampleEn}</p></div> : <p className="study-muted">Think of the meaning, then reveal the answer.</p>}</div><div className="practice-flashcard-actions"><button className="study-button" onClick={() => move(-1)}><ChevronLeft size={18}/> Previous</button><button className="study-button primary" aria-expanded={revealed} onClick={() => setRevealed(!revealed)}>{revealed ? 'Hide meaning' : 'Reveal meaning'}</button><button className="study-button" onClick={() => move(1)}>Next <ChevronRight size={18}/></button></div></section>;
}
export default PracticePage;
