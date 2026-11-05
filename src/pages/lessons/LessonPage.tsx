import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { pinyin } from 'pinyin-pro';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { CURRICULUM_DESCRIPTION, getLesson, LESSONS, lessonQuestions, lessonStory, lessonWords, type Lesson } from '../../data/curriculum';
import { recordLessonCompletion } from '../../data/learningState';
import { saveError, updateLearning, useLearning } from '../../data/learningStore';
import { ExercisePlayer } from './ExercisePlayer';
import './lessons.css';

export function LessonPage() {
  const { id, lessonId } = useParams();
  const lesson = getLesson(id ?? lessonId);
  return lesson ? <LessonContent key={lesson.id} lesson={lesson}/> : <div className="study-page"><h1>Lesson unavailable</h1><p className="study-muted">This lesson is not in the local practice collection.</p><Link className="study-button primary" to="/learn">Browse available lessons</Link></div>;
}
function LessonContent({ lesson }: { lesson: Lesson }) {
  const data = useLearning();
  const [tab, setTab] = useState('Overview');
  const [error, setError] = useState('');
  const [round, setRound] = useState(0);
  const story = lessonStory(lesson);
  const words = lessonWords(lesson);
  const questions = lessonQuestions(lesson);
  const position = LESSONS.findIndex(item => item.id === lesson.id);
  const completed = data.lessonCompletions?.some(item => item.lessonId === lesson.id) ?? false;
  const masteredAttempt = data.attempts.find(item => item.lessonId === lesson.id && item.total === questions.length && item.correct === item.total);
  function complete() {
    if (!masteredAttempt) return;
    try { updateLearning(state => recordLessonCompletion(state, lesson.id, masteredAttempt.id)); setError(''); }
    catch (reason) { setError(saveError(reason)); }
  }
  return <div className="study-page lesson-page">
    <nav className="lesson-breadcrumb" aria-label="Breadcrumb"><Link to="/learn">Learn</Link><span>/</span><Link to={`/learn?level=${lesson.level}`}>HSK {lesson.level} practice</Link><span>/</span><span>{lesson.english}</span></nav>
    <header className="study-header"><div><p className="study-muted">Suggested HSK {lesson.level} · {lesson.topic} · {lesson.skill}</p><h1 lang="zh-CN">{lesson.title}</h1>{lesson.pinyin && data.profile.pinyin !== false && <p>{lesson.pinyin}</p>}<p>{lesson.english}</p></div>{completed && <span className="lesson-completed"><Check size={18}/> Completed</span>}</header>
    <p className="study-muted">{CURRICULUM_DESCRIPTION}. No prerequisites; practise at your own pace.</p>
    <div className="study-tabs" role="group" aria-label="Lesson sections">{['Overview', 'Practice', 'Review'].map(item => <button key={item} className="study-button" aria-pressed={tab === item} onClick={() => setTab(item)}>{item}</button>)}</div>
    {tab === 'Overview' && <>
      <section className="study-card"><h2>Your learning plan</h2><p>{story ? 'Read each original sentence and explore its meaning. Then match every sentence to its English translation.' : 'Read the words, pinyin, and example sentences. Then choose each word’s meaning.'}</p><p className="study-muted">{questions.length} practice questions. Answer every question correctly in one saved round to unlock lesson completion.</p><button className="study-button primary" onClick={() => setTab('Practice')}>Start lesson practice <ChevronRight size={18}/></button></section>
      {words.length > 0 && <section className="study-card"><h2>Vocabulary & examples</h2><div className="lesson-word-list">{words.map(word => <article key={word.chinese}><h3 lang="zh-CN">{word.chinese}</h3>{data.profile.pinyin !== false && <p className="study-muted">{word.pinyin}</p>}<p>{word.meaning}</p><p lang="zh-CN">{word.example}</p><p className="study-muted">{word.exampleEn}</p></article>)}</div></section>}
      {story && <section className="study-card"><h2>Read the passage</h2><div className="lesson-story">{story.lines.map(([chinese, english]) => <article key={chinese}><p lang="zh-CN">{chinese}</p>{data.profile.pinyin && <p className="study-muted">{pinyin(chinese)}</p>}<details><summary>Show meaning</summary><p>{english}</p></details></article>)}</div><Link className="study-button" to={`/reading?story=${story.id}`}>Open reading tools & audio</Link></section>}
    </>}
    {tab === 'Practice' && <ExercisePlayer key={`${lesson.id}:${round}`} lesson={lesson} questions={questions} skill={lesson.skill}/>}
    {tab === 'Review' && <section className="study-card"><h2>Review your saved rounds</h2>{data.attempts.filter(item => item.lessonId === lesson.id).length ? <ul className="lesson-history">{data.attempts.filter(item => item.lessonId === lesson.id).slice(-10).reverse().map(item => <li key={item.id}><span>{item.skill ?? lesson.skill} · {item.correct}/{item.total} correct</span><time dateTime={new Date(item.createdAt).toISOString()}>{new Date(item.createdAt).toLocaleString()}</time></li>)}</ul> : <p className="study-empty">No saved practice yet. Finish and save a round to see it here.</p>}<button className="study-button" onClick={() => { setRound(round + 1); setTab('Practice'); }}>Practise again</button></section>}
    <section className="study-card lesson-completion"><div><h2>{completed ? 'Lesson complete' : 'Ready to complete?'}</h2><p className="study-muted">{completed ? 'Your completion is saved on this device.' : masteredAttempt ? 'A fully correct activity is saved. Mark this lesson complete.' : 'Complete and save one fully correct activity for this lesson first.'}</p></div><button className="study-button primary" disabled={completed || !masteredAttempt} onClick={complete}>{completed ? <><Check size={17}/> Completed</> : 'Mark lesson complete'}</button>{error && <p role="alert">{error}</p>}</section>
    <nav className="lesson-pagination" aria-label="Lesson navigation">{position > 0 ? <Link className="study-button" to={`/lessons/${LESSONS[position - 1].id}`}><ChevronLeft size={18}/> Previous lesson</Link> : <span/>}{position < LESSONS.length - 1 ? <Link className="study-button" to={`/lessons/${LESSONS[position + 1].id}`}>Next lesson <ChevronRight size={18}/></Link> : <Link className="study-button" to="/learn">Back to Learn</Link>}</nav>
  </div>;
}
export default LessonPage;
