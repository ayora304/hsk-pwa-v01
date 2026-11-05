import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, RotateCcw, Volume2 } from 'lucide-react';
import { isCorrectAnswer, type Exercise, type Lesson, type Skill } from '../../data/curriculum';
import { newId, saveError, updateLearning, useLearning } from '../../data/learningStore';
import { QUIZ_DIAMOND_REWARD, recordQuizCompletion, type QuizAttempt } from '../../data/learningState';
import './lessons.css';

interface Props { lesson: Lesson; questions: Exercise[]; skill: Skill }
export function ExercisePlayer({ lesson, questions, skill }: Props) {
  const data = useLearning();
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [results, setResults] = useState<boolean[]>([]);
  const [checked, setChecked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [audioStatus, setAudioStatus] = useState('');
  const [heard, setHeard] = useState(false);
  const [attemptId, setAttemptId] = useState(newId);
  const started = useRef(Date.now());
  const heading = useRef<HTMLHeadingElement>(null);
  const active = useRef(true);
  const current = questions[index];
  const correct = results.filter(Boolean).length;
  useEffect(() => {
    active.current = true;
    return () => { active.current = false; window.speechSynthesis?.cancel(); };
  }, []);
  useEffect(() => { heading.current?.focus(); }, [index, saved]);
  if (!current) return <p className="study-empty">No exercises are available for this activity.</p>;
  function speak() {
    if (!('speechSynthesis' in window) || !current.audio) { setAudioStatus('Chinese audio is unavailable here. Choose Vocabulary practice instead.'); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(current.audio);
    utterance.lang = 'zh-CN'; utterance.rate = 0.8;
    utterance.onstart = () => { if (active.current) setAudioStatus('Playing device-generated Chinese audio…'); };
    utterance.onend = () => { if (active.current) { setHeard(true); setAudioStatus('Audio finished. Choose the meaning.'); } };
    utterance.onerror = () => { if (active.current) { setHeard(false); setAudioStatus('Audio could not play. Try again with a Chinese voice installed, or choose Vocabulary practice.'); } };
    setAudioStatus('Preparing audio…');
    window.speechSynthesis.speak(utterance);
  }
  function save() {
    if (!checked || results.length !== questions.length) return;
    const attempt: QuizAttempt = {
      id: attemptId, correct, total: questions.length,
      seconds: Math.max(1, Math.round((Date.now() - started.current) / 1000)), createdAt: Date.now(),
      words: questions.filter((q, i) => q.word && results[i]).map(q => q.word!),
      skill, topic: lesson.topic, level: lesson.level, lessonId: lesson.id,
    };
    try { updateLearning(state => recordQuizCompletion(state, attempt)); setSaved(true); setError(''); }
    catch (reason) { setError(saveError(reason)); }
  }
  function retry() {
    window.speechSynthesis?.cancel(); setAttemptId(newId()); started.current = Date.now();
    setIndex(0); setAnswer(''); setResults([]); setChecked(false); setSaved(false); setError(''); setHeard(false); setAudioStatus('');
    heading.current?.focus();
  }
  return <section className="study-card lesson-player" aria-label={`${skill} activity`}>
    {saved ? <>
      <h2 ref={heading} tabIndex={-1}>Activity saved</h2><p className="lesson-result">{correct} / {questions.length} correct</p>
      <p role="status">+{QUIZ_DIAMOND_REWARD} diamonds · Saved on this device.</p>
      <p className="study-muted">{correct === questions.length ? 'Every answer is correct. You can now mark this lesson complete in its lesson page.' : 'Review the answers, then retry to answer every question correctly and complete this lesson.'}</p>
      <div className="lesson-actions"><button className="study-button primary" onClick={retry}><RotateCcw size={17}/> Try a new round</button><Link className="study-button" to="/stats">View progress</Link><Link className="study-button" to={`/lessons/${lesson.id}`}>Lesson overview</Link></div>
    </> : <>
      <div className="lesson-player-meta"><span>{skill} · Question {index + 1} of {questions.length}</span><span>{correct} correct</span></div>
      <progress className="study-progress" value={results.length} max={questions.length} aria-label="Activity progress"/>
      <h2 ref={heading} tabIndex={-1} lang={skill === 'Reading' || skill === 'Vocabulary' ? 'zh-CN' : undefined}>{current.prompt}</h2>
      {current.pinyin && data.profile.pinyin !== false && <p className="study-muted">{current.pinyin}</p>}
      {current.audio && <><button type="button" className="study-button" onClick={speak}><Volume2 size={18}/> Play Chinese audio</button><p className="study-muted">Device-generated speech. A Chinese voice must be available; audio is not downloaded.</p>{audioStatus && <p role="status">{audioStatus}</p>}</>}
      <form onSubmit={event => { event.preventDefault(); if (!answer.trim() || checked || (current.audio && !heard)) return; setResults([...results, isCorrectAnswer(current, answer)]); setChecked(true); }}>
        {current.input ? <label className="study-field">Chinese answer<input lang="zh-CN" autoComplete="off" value={answer} onChange={event => setAnswer(event.target.value)} disabled={checked} placeholder="Type Hanzi using your keyboard"/></label> : <fieldset className="lesson-options" disabled={checked}><legend>Choose the correct English meaning</legend>{current.choices.map(choice => <label key={choice} className={answer === choice ? 'selected' : ''}><input type="radio" name={`answer-${attemptId}-${index}`} value={choice} checked={answer === choice} onChange={() => setAnswer(choice)}/><span>{choice}</span></label>)}</fieldset>}
        {!checked && <button className="study-button primary" type="submit" disabled={!answer.trim() || !!current.audio && !heard}>Check answer</button>}
      </form>
      {checked && <div className="lesson-answer" role="status"><b>{results[index] ? <><Check size={18}/> Correct</> : 'Keep practising'}</b><p>{results[index] ? 'Well done.' : `Correct answer: ${current.answer}`}</p></div>}
      {checked && (index < questions.length - 1 ? <button className="study-button primary" onClick={() => { window.speechSynthesis?.cancel(); setIndex(index + 1); setAnswer(''); setChecked(false); setHeard(false); setAudioStatus(''); }}>Next question</button> : <button className="study-button primary" onClick={save}>Save completed activity</button>)}
      {error && <p role="alert">{error} Your answers remain here; retry saving.</p>}
    </>}
  </section>;
}
