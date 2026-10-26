import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Excalidraw, convertToExcalidrawElements, serializeAsJSON, exportToBlob } from '@excalidraw/excalidraw';
import { MovableToolbar } from './MovableToolbar';
import { addMissingPinyin, pronunciation } from './practice';
import type { ExcalidrawImperativeAPI, ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types';
import '@excalidraw/excalidraw/index.css';
import './whiteboard.css';

const KEY = 'hsk-whiteboard-v1';
function readBoard(): ExcalidrawInitialDataState {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) { const board = JSON.parse(saved); return { ...board, elements: addMissingPinyin(board.elements || []), scrollToContent: true }; }
  } catch { /* Recover with a blank board if storage is unavailable or damaged. */ }
  return { appState: { viewBackgroundColor: '#fffdf8', currentItemStrokeColor: '#292524', activeTool: { type: 'freedraw', customType: null, lastActiveTool: null, locked: false } } };
}

export default function WhiteboardPage() {
  const navigate = useNavigate();
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null);
  const [initialData] = useState(readBoard);
  const [status, setStatus] = useState('Saved on this device');
  const [character, setCharacter] = useState('永');
  const [showSessions, setShowSessions] = useState(false);
  const [roomLink, setRoomLink] = useState('');
  const [linkError, setLinkError] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);
  const [reviewImage, setReviewImage] = useState('');
  const [reviewCharacter, setReviewCharacter] = useState('永');
  const [reviewError, setReviewError] = useState('');
  const [reviewBusy, setReviewBusy] = useState(false);
  const [review, setReview] = useState<{ score: number | null; summary: string; strengths: string[]; improvements: string[] } | null>(null);
  const reviewAbort = useRef<AbortController | null>(null);
  useEffect(() => () => reviewAbort.current?.abort(), []);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pending = useRef<string | null>(null);
  const persist = () => {
    if (!pending.current) return;
    try { localStorage.setItem(KEY, pending.current); pending.current = null; setStatus('Saved on this device'); }
    catch { setStatus('Could not save — download your board'); }
  };
  useEffect(() => {
    const flush = () => persist();
    window.addEventListener('pagehide', flush);
    return () => { clearTimeout(timer.current); flush(); window.removeEventListener('pagehide', flush); };
  }, []);

  const addPractice = () => {
    if (!api || !/^\p{Script=Han}$/u.test(character)) { setReviewError('Enter one Chinese character to create a writing grid.'); return; }
    const existing = api.getSceneElements();
    const y = existing.length ? Math.max(...existing.map(e => e.y + e.height)) + 60 : 100;
    const guides: Parameters<typeof convertToExcalidrawElements>[0] = [
      { type: 'text', x: 80, y: y - 75, text: `Character practice · ${character}`, fontSize: 24, fontFamily: 2 },
      { type: 'text', x: 80, y: y - 40, text: pronunciation(character), fontSize: 20, fontFamily: 2, strokeColor: '#9c6c51' },
    ];
    for (let row = 0; row < 2; row++) for (let col = 0; col < 4; col++) {
      const x = 80 + col * 150, top = y + row * 180;
      guides.push(
        { type: 'rectangle', x, y: top, width: 140, height: 140, strokeColor: '#d6a48c', roughness: 0, locked: true },
        { type: 'line', x: x + 70, y: top, points: [[0, 0], [0, 140]], strokeColor: '#e6c9ba', strokeStyle: 'dashed', roughness: 0, locked: true },
        { type: 'line', x, y: top + 70, points: [[0, 0], [140, 0]], strokeColor: '#e6c9ba', strokeStyle: 'dashed', roughness: 0, locked: true },
      );
      guides.push({ type: 'text', x: x + 45, y: top + 145, text: pronunciation(character), fontSize: 18, fontFamily: 2, strokeColor: '#9c6c51', locked: true });
      if (col === 0) guides.push({ type: 'text', x: x + 20, y: top + 10, text: Array.from(character.trim() || '永')[0], fontSize: 100, fontFamily: 2, strokeColor: '#d8c5bb', locked: true });
    }
    const elements = [...existing, ...convertToExcalidrawElements(guides)];
    api.updateScene({ elements });
    api.scrollToContent(elements.slice(existing.length), { fitToContent: true });
    api.setActiveTool({ type: 'freedraw' });
  };
  const prepareReview = async () => {
    if (!api) return;
    setReviewError(''); setReview(null);
    const selected = api.getAppState().selectedElementIds;
    const strokes = api.getSceneElements().filter(e => selected[e.id] && e.type === 'freedraw' && !e.isDeleted);
    if (!strokes.length) { setReviewError('Use the arrow tool to select the handwritten strokes of one character, then choose Rate writing. Printed examples are not rated.'); return; }
    try {
      const blob = await exportToBlob({ elements: strokes, appState: { viewBackgroundColor: '#ffffff', exportBackground: true }, files: {}, maxWidthOrHeight: 768 });
      const reader = new FileReader();
      reader.onload = () => { setReviewImage(String(reader.result)); setReviewCharacter(character); };
      reader.readAsDataURL(blob);
    } catch { setReviewError('Could not prepare this drawing. Please select your strokes again.'); }
  };
  const rateWriting = async () => {
    setReviewBusy(true); setReviewError(''); setReview(null);
    const controller = new AbortController(); reviewAbort.current = controller;
    const timeout = setTimeout(() => controller.abort(), 65000);
    try {
      const response = await fetch('/api/handwriting-review', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ character: reviewCharacter, image: reviewImage }), signal: controller.signal });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Review unavailable. Please try again.');
      setReview(result);
    } catch (error) { setReviewError(error instanceof Error && error.name !== 'AbortError' ? error.message : 'The review took too long. Please try again.'); }
    finally { clearTimeout(timeout); setReviewBusy(false); }
  };
  const download = () => {
    if (!api) return;
    const blob = new Blob([serializeAsJSON(api.getSceneElements(), api.getAppState(), api.getFiles(), 'local')], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'hsk-study-board.excalidraw'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const joinSession = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const url = new URL(roomLink);
      if (url.origin !== 'https://excalidraw.com' || !/^#room=[a-zA-Z0-9_-]+,[a-zA-Z0-9_-]+$/.test(url.hash)) throw new Error();
      window.open(url.href, '_blank', 'noopener,noreferrer'); setLinkError('');
    } catch { setLinkError('Paste a valid https://excalidraw.com/#room=… invitation link.'); }
  };

  return <div className="study-board">
    <header className="board-header">
      <button onClick={() => { persist(); navigate('/home'); }} aria-label="Back to home">←</button>
      <div className="board-heading"><h1>Study whiteboard</h1><p role="status">{status}</p></div>
      <button onClick={download} disabled={!api}>Download</button>
      <button className="board-primary" onClick={() => setShowSessions(true)}>Study together ↗</button>
    </header>
    <section className="board-practice" aria-label="Chinese character practice">
      <span>写字 <strong>Character practice</strong></span>
      <label>Character <input value={character} onChange={e => setCharacter(Array.from(e.target.value).slice(0, 1).join(''))} aria-label="Character to practice" /></label>
      <span className="board-pinyin">{character && pronunciation(character)}</span>
      <button onClick={addPractice} disabled={!api}>+ Writing grid</button>
      <button onClick={prepareReview} disabled={!api}>✦ Rate writing</button>
      <span className="board-tip">Trace, then try it yourself. Select your strokes to rate your writing.</span>
    </section>
    {reviewError && !reviewImage && <div className="board-review-notice" role="alert">{reviewError}<button onClick={() => setReviewError('')} aria-label="Dismiss message">✕</button></div>}
    <div className="board-canvas" ref={canvasRef}>
      <MovableToolbar container={canvasRef} />
      <Excalidraw initialData={initialData} excalidrawAPI={setApi} onChange={(elements, appState, files) => {
        pending.current = serializeAsJSON(elements, appState, files, 'local');
        clearTimeout(timer.current); timer.current = setTimeout(persist, 600);
      }} UIOptions={{ canvasActions: { saveToActiveFile: false } }} />
    </div>
    {reviewImage && <div className="board-overlay">
      <dialog open ref={node => { if (node && !node.matches(':modal')) { node.close(); node.showModal(); } }} className="board-dialog" aria-labelledby="review-title" onCancel={e => { if (reviewBusy) e.preventDefault(); else { setReviewImage(''); setReviewError(''); } }}>
        <button className="board-close" disabled={reviewBusy} onClick={() => { setReviewImage(''); setReviewError(''); }} aria-label="Close handwriting review" autoFocus>✕</button>
        <p className="board-eyebrow">YOUR WRITING COACH</p><h2 id="review-title">A little better, every stroke.</h2>
        <img className="board-review-image" src={reviewImage} alt="Selected handwriting to review" />
        <label className="board-review-target">Target character <input aria-label="Review target character" value={reviewCharacter} disabled={reviewBusy} onChange={e => { setReviewCharacter(Array.from(e.target.value).slice(0, 1).join('')); setReview(null); }} /> <span>{reviewCharacter && pronunciation(reviewCharacter)}</span></label>
        <p>Review sends only this selected handwriting and its target character to OpenAI. Feedback covers visual shape and proportions, not stroke order.</p>
        <button className="board-primary" onClick={rateWriting} disabled={reviewBusy || !/^\p{Script=Han}$/u.test(reviewCharacter)}>{reviewBusy ? 'Reviewing your writing…' : 'Review with AI'}</button>
        {reviewError && <p role="alert">{reviewError}</p>}
        {review && <section className="board-review-result" aria-live="polite"><h3>{review.score === null ? 'Try a clearer attempt' : `${review.score}/100 · Practice feedback`}</h3><p>{review.summary}</p>{review.strengths.length > 0 && <><h4>What’s working</h4><ul>{review.strengths.map((tip, i) => <li key={i}>{tip}</li>)}</ul></>}<h4>Try next</h4><ul>{review.improvements.map((tip, i) => <li key={i}>{tip}</li>)}</ul><p>AI feedback is an estimate for practice.</p></section>}
      </dialog>
    </div>}
    {showSessions && <div className="board-overlay" onClick={() => setShowSessions(false)}>
      <dialog open ref={node => { if (node && !node.matches(':modal')) { node.close(); node.showModal(); } }} className="board-dialog" aria-labelledby="session-title" onCancel={() => setShowSessions(false)} onClick={e => e.stopPropagation()}>
        <button className="board-close" onClick={() => setShowSessions(false)} aria-label="Close session dialog" autoFocus>✕</button>
        <p className="board-eyebrow">A LITTLE SPACE TO THINK TOGETHER</p>
        <h2 id="session-title">Bring your study group.</h2>
        <p>Live sessions open in Excalidraw. Start a session using its Live collaboration menu, then share the invitation with your classmates.</p>
        <a className="board-primary" href="https://excalidraw.com" target="_blank" rel="noopener noreferrer">Open Excalidraw ↗</a>
        <p>To use this board together, download it first, then open the file in Excalidraw before starting your session. Your local board and the live session save separately.</p>
        <form onSubmit={joinSession}><label htmlFor="room-link">Already have an invitation?</label><input id="room-link" type="url" value={roomLink} onChange={e => setRoomLink(e.target.value)} placeholder="https://excalidraw.com/#room=…" required /><button type="submit">Join live session ↗</button>{linkError && <p role="alert">{linkError}</p>}</form>
      </dialog>
    </div>}
  </div>;
}
