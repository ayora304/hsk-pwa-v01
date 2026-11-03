import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { pinyin } from 'pinyin-pro';
import { STORIES } from '../../data/stories';
import './reading.css';

const KEY = 'hsk-reading-finished-v1';
export function ReadingPage() {
  const [params, setParams] = useSearchParams();
  const story = STORIES.find(item => item.id === params.get('story'));
  const [level, setLevel] = useState('All');
  const [showPinyin, setShowPinyin] = useState(false);
  const [translations, setTranslations] = useState(false);
  const [error, setError] = useState('');
  const [audioStatus, setAudioStatus] = useState('');
  const [finished, setFinished] = useState<string[]>(() => {
    try { const saved: unknown = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(saved) ? saved.filter((id): id is string => typeof id === 'string' && STORIES.some(s => s.id === id)) : []; } catch { return []; }
  });
  useEffect(() => { window.scrollTo(0, 0); setAudioStatus(''); return () => { window.speechSynthesis?.cancel(); }; }, [story?.id]);
  function listen(text: string) {
    if (!('speechSynthesis' in window)) { setAudioStatus('Audio is unavailable in this browser.'); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'zh-CN'; utterance.rate = 0.8;
    utterance.onerror = () => setAudioStatus('Audio could not play. Check that a Chinese voice is installed on your device.');
    utterance.onend = () => setAudioStatus('');
    setAudioStatus('Playing Chinese audio…'); window.speechSynthesis.speak(utterance);
  }
  function complete() {
    if (!story) return;
    const next = finished.includes(story.id) ? finished.filter(id => id !== story.id) : [...finished, story.id];
    try { localStorage.setItem(KEY, JSON.stringify(next)); setFinished(next); setError(''); } catch { setError('Could not save reading progress. Device storage may be full or unavailable.'); }
  }
  return <div className="reading-page">
    {story ? <>
      <Link className="reading-back" to="/reading">← All stories</Link>
      <header className="reading-reader-heading"><p className="reading-eyebrow">HSK {story.level} · {story.theme}</p><h1 lang="zh-CN">{story.title}</h1><p>{story.english}</p></header>
      <div className="reading-tools"><button aria-pressed={showPinyin} onClick={() => setShowPinyin(!showPinyin)}>Pinyin {showPinyin ? 'on' : 'off'}</button><button aria-pressed={translations} onClick={() => setTranslations(!translations)}>Translation {translations ? 'on' : 'off'}</button><button onClick={() => listen(story.lines.map(line => line[0]).join(''))}>▷ Listen to story</button><button onClick={() => { window.speechSynthesis?.cancel(); setAudioStatus(''); }}>Stop audio</button></div>
      <p className="reading-hint">Read at your own pace. Reveal a sentence’s meaning whenever you need it.</p>
      {audioStatus && <p role="status">{audioStatus}</p>}
      <article className="reading-passage" aria-label={story.english}>{story.lines.map(([chinese, english], index) => <section key={chinese}>
        {showPinyin && <p className="reading-pinyin">{pinyin(chinese)}</p>}
        <p className="reading-chinese" lang="zh-CN">{chinese}</p>
        <div className="reading-line-actions"><button aria-label={`Listen to sentence ${index + 1}`} onClick={() => listen(chinese)}>▷ Listen</button></div>
        <details open={translations} key={`${index}-${translations}`}><summary>Show meaning</summary><p>{english}</p></details>
      </section>)}</article>
      <footer className="reading-finish"><div><h2>A little Chinese, every day.</h2><p>One more story on your shelf.</p></div><button className="reading-primary" onClick={complete}>{finished.includes(story.id) ? '✓ Finished · mark unread' : 'Mark as finished →'}</button></footer>
      {error && <p role="alert">{error}</p>}
    </> : <>
      <header className="reading-hero"><div><p className="reading-eyebrow">Graded reading studio</p><h1>Read the story.<br/>Understand the moment.</h1><p className="reading-intro">A little Chinese. A new perspective. Explore everyday moments with pinyin, sentence audio, and meaning just a tap away.</p></div><div className="reading-shelf"><span aria-hidden="true">▤</span><small>Your shelf</small><strong>{finished.length}<span>/{STORIES.length}</span></strong><small>stories finished</small></div></header>
      <div className="reading-filters" role="group" aria-label="Filter by suggested HSK level">{['All', 'HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'].map(filter => <button key={filter} aria-pressed={level === filter} onClick={() => setLevel(filter)}>{filter}</button>)}</div>
      <div className="reading-library-heading"><p>{level === 'All' ? 'Find your next small adventure' : `Your HSK ${level.slice(-1)} reading shelf`}</p><small>Original stories · suggested HSK levels</small></div>
      <div className="reading-grid">{STORIES.filter(item => level === 'All' || level === `HSK ${item.level}`).map(item => <Link key={item.id} to={`?story=${item.id}`} className={`reading-story reading-color-${item.level}`}><div className="reading-card-top"><span className="reading-badge">HSK {item.level}</span>{finished.includes(item.id) && <span className="reading-badge">✓ Finished</span>}</div><span className="reading-number">0{item.level}</span><p className="reading-category">{item.theme} · 1 min</p><h2 lang="zh-CN">{item.title}</h2><p className="reading-english">{item.english}</p><div className="reading-card-footer"><span>Read the story</span><span aria-hidden="true">↗</span></div></Link>)}</div>
      <p className="reading-footnote">Start small. Read often. Your finished stories are saved on this device.</p>
    </>}
  </div>;
}
