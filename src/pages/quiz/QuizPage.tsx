import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Gem, RotateCcw, Star, Volume2, X } from 'lucide-react';
import { updateLearning, newId, saveError } from '../../data/learningStore';
import { QUIZ_DIAMOND_REWARD, recordQuizCompletion } from '../../data/learningState';
import './quiz.css';

const questions = [
  { chinese: '谢谢', pinyin: 'xièxie', options: ['Sorry', 'Thank you', 'Goodbye', 'Please'], answer: 1 },
  { chinese: '苹果', pinyin: 'píngguǒ', options: ['Apple', 'Watermelon', 'Banana', 'Milk'], answer: 0 },
  { chinese: '多少钱', pinyin: 'duōshao qián', options: ['Where is it?', 'What time is it?', 'How much is it?', 'Who are you?'], answer: 2 },
  { chinese: '再见', pinyin: 'zàijiàn', options: ['Hello', 'See you tomorrow', 'Thank you', 'Goodbye'], answer: 3 },
];
export const QuizPage = () => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState('');
  const [audioError, setAudioError] = useState('');
  const started = useRef(Date.now());
  const id = useRef(newId());
  const q = questions[index];
  const correct = answers.filter((a, i) => a === questions[i].answer).length;
  useEffect(() => () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }, []);
  function next() {
    if (!locked) return;
    if (index < questions.length - 1) { setIndex(index + 1); setSelected(null); setLocked(false); setAudioError(''); }
    else {
      try {
        const attempt = { id: id.current, correct, total: questions.length, seconds: Math.max(1, Math.round((Date.now() - started.current) / 1000)), createdAt: Date.now(), words: questions.filter((x, i) => answers[i] === x.answer).map(x => x.chinese) };
        updateLearning(s => recordQuizCompletion(s, attempt));
        setFinished(true); setError('');
      } catch (e) { setError(saveError(e)); }
    }
  }
  function speak() {
    if (!('speechSynthesis' in window)) { setAudioError('Audio is not available in this browser. Use the pinyin below.'); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(q.chinese);
    utterance.lang = 'zh-CN'; utterance.rate = .8;
    utterance.onerror = () => setAudioError('Audio is unavailable. You can still practise using the pinyin.');
    window.speechSynthesis.speak(utterance);
  }
  return <main className="lingora-quiz">
    <header className="quiz-top"><Link to="/home" aria-label="Exit vocabulary practice"><X size={28}/></Link><progress max={questions.length} value={finished ? questions.length : index + (locked ? 1 : 0)} aria-label="Quiz progress"/><span>{finished ? questions.length : index + 1}<small> / {questions.length}</small></span></header>
    {finished ? <section className="quiz-complete"><span className="quiz-complete-star"><Star size={42} fill="currentColor"/></span><h1>Practice complete!</h1><p className="quiz-score">{correct} <small>/ {questions.length}</small></p><p>Your result is saved on this device.</p><p className="quiz-diamond-reward" role="status"><Gem size={22} aria-hidden="true"/> +{QUIZ_DIAMOND_REWARD} diamonds earned</p><Link className="lingora-button" to="/stats">View progress</Link><button className="quiz-again" onClick={() => { id.current = newId(); started.current = Date.now(); setIndex(0); setSelected(null); setAnswers([]); setLocked(false); setFinished(false); setError(''); }}><RotateCcw size={17}/> Practice again</button></section> : <>
      <div className="quiz-prompt"><h1>Translate this expression</h1><p>Choose the correct answer</p></div>
      <section className="quiz-question" aria-label="Chinese expression"><img src="/lingora/penguin-guide.png" alt="Your penguin learning companion"/><div className="quiz-speech"><button onClick={speak} aria-label={`Listen to ${q.chinese}`}><Volume2 size={25}/></button><div><strong lang="zh">{q.chinese}</strong><span>{q.pinyin}</span></div></div></section>
      {audioError && <p className="quiz-audio-note" role="status">{audioError}</p>}
      <div className="quiz-options" role="group" aria-label="Choose a translation">{q.options.map((option, i) => <button key={`${index}-${option}`} className={`quiz-option${selected === i ? ' selected' : ''}${locked && i === q.answer ? ' correct' : ''}${locked && selected === i && i !== q.answer ? ' incorrect' : ''}`} disabled={locked} aria-pressed={selected === i} onClick={() => setSelected(i)}><span className="quiz-choice-indicator">{locked && i === q.answer ? <Check size={16}/> : selected === i ? <span/> : null}</span><span>{option}</span></button>)}</div>
      <div className={`quiz-feedback${locked ? ' checked' : ''}${locked && selected !== q.answer ? ' try-again' : ''}`}>
        {locked && <div className="quiz-feedback-message" role="status"><span className="quiz-feedback-icon">{selected === q.answer ? <Star size={27} fill="currentColor"/> : <BookAnswer/>}</span><div><b>{selected === q.answer ? 'Excellent!' : 'Keep learning!'}</b><p>{selected === q.answer ? "You're correct." : `The answer is ${q.options[q.answer]}.`}</p></div></div>}
        {!locked ? <button className="lingora-button" disabled={selected === null} onClick={() => { if (selected === null) return; setAnswers([...answers, selected]); setLocked(true); }}>Check answer</button> : <button className="lingora-button" onClick={next}>{index === questions.length - 1 ? 'Save result' : 'Continue'}</button>}
        {error && <p role="alert" className="student-error">{error}</p>}
      </div>
    </>}
  </main>;
};
function BookAnswer() { return <RotateCcw size={25}/>; }
export default QuizPage;

