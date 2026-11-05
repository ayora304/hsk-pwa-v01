import { requestBotJob } from '../../data/botService';
import { updateLearning, newId } from '../../data/learningStore';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, ChartNoAxesColumnIncreasing, Download, Home, Menu, MessageSquare, NotebookPen, PenLine, Target, Users } from 'lucide-react';
import { CaptureUpdateAction, Excalidraw, convertToExcalidrawElements, serializeAsJSON, exportToBlob, exportToSvg } from '@excalidraw/excalidraw';
import { MovableToolbar } from './MovableToolbar';
import { useBoardLasso } from './useBoardLasso';
import { addMissingPinyin, pronunciation } from './practice';
import { currentScene, dimensions, newNotebook, newPage, NOTEBOOK_KEY, paperPixels, paperSizes, parseNotebook, parsePageRange, readNotebook, sceneData, setCurrentScene, templates, type Notebook, type PaperSize, type Template } from './notebook';
import type { ExcalidrawImperativeAPI, ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types';
import '@excalidraw/excalidraw/index.css';
import './whiteboard.css';

const navigation = [
  { to: '/home', label: 'Home', icon: Home }, { to: '/classroom', label: 'Learn', icon: BookOpen },
  { to: '/practice', label: 'Practice', icon: PenLine }, { to: '/challenges', label: 'Challenges', icon: Target },
  { to: '/stats', label: 'Progress', icon: ChartNoAxesColumnIncreasing }, { to: '/chats', label: 'Conversations', icon: MessageSquare },
  { to: '/library', label: 'Library', icon: NotebookPen },
];
const PAPER_ID = 'hsk-notebook-paper';
const GUIDE_PREFIX = 'hsk-notebook-guide:';
const isGuide = (element: { id: string }) => element.id === PAPER_ID || element.id.startsWith(GUIDE_PREFIX);
const paperGuide = (notebook: Notebook) => {
  const [width, height] = paperPixels(notebook);
  return convertToExcalidrawElements([{ id: PAPER_ID, type: 'rectangle', x: 0, y: 0, width, height, locked: true, strokeColor: '#d6d1ca', backgroundColor: '#ffffff', fillStyle: 'solid', roughness: 0 }], { regenerateIds: false })[0];
};
function paperElements(notebook: Notebook, template: Template) {
  const [width, height] = paperPixels(notebook);
  const marks: Parameters<typeof convertToExcalidrawElements>[0] = [];
  const line = (x: number, y: number, dx: number, dy: number) => marks.push({ id: `${GUIDE_PREFIX}${marks.length}`, type: 'line', x, y, points: [[0, 0], [dx, dy]], locked: true, strokeColor: '#d9d5cf', strokeWidth: 1, roughness: 0 });
  if (template === 'Ruled' || template === 'Vocabulary' || template === 'Grammar' || template === 'Graph' || template === 'Character grid') {
    const gap = template === 'Character grid' ? 68 : template === 'Graph' ? 25 : 32;
    for (let y = 52; y < height - 35; y += gap) line(38, y, width - 76, 0);
    if (template === 'Graph' || template === 'Character grid') for (let x = 38; x < width - 35; x += gap) line(x, 52, 0, Math.floor((height - 87) / gap) * gap);
    if (template === 'Vocabulary') for (const fraction of [0.34, 0.65]) line(width * fraction, 52, 0, height - 95);
    if (template === 'Grammar') line(width * 0.42, 52, 0, height - 95);
  }
  if (template === 'Dotted') for (let x = 40; x < width - 38; x += 38) for (let y = 52; y < height - 35; y += 38) line(x, y, 1, 0);
  return [paperGuide(notebook), ...convertToExcalidrawElements(marks, { regenerateIds: false })];
}
function editorData(notebook: Notebook): ExcalidrawInitialDataState {
  const scene = sceneData(currentScene(notebook));
  const elements = addMissingPinyin(scene.elements || []).filter(element => !isGuide(element));
  const template = notebook.pages.find(page => page.id === notebook.activePage)!.template;
  return { ...scene, elements: notebook.mode === 'paper' ? [...paperElements(notebook, template), ...elements] : elements, scrollToContent: true, appState: { ...scene.appState, viewBackgroundColor: notebook.mode === 'paper' ? '#efede9' : scene.appState?.viewBackgroundColor || '#ffffff', currentItemStrokeColor: scene.appState?.currentItemStrokeColor || '#242a33' } };
}

export default function WhiteboardPage() {
  const navigate = useNavigate();
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null);
  const lasso = useBoardLasso(api);
  const [loaded] = useState(readNotebook);
  const [notebook, setNotebook] = useState(loaded.notebook);
  const notebookRef = useRef(loaded.notebook);
  const savingPaused = useRef(Boolean(loaded.error));
  const [status, setStatus] = useState(loaded.error ? 'Autosave paused' : 'Saved on this device');
  const [boardError, setBoardError] = useState(loaded.error);
  const [showPractice, setShowPractice] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showPages, setShowPages] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [confirm, setConfirm] = useState<'reset' | 'delete' | null>(null);
  const [revision, setRevision] = useState(0);
  const [range, setRange] = useState('');
  const [margin, setMargin] = useState(0);
  const [includeGuides, setIncludeGuides] = useState(true);
  const [printPages, setPrintPages] = useState<string[]>([]);
  const [exportBusy, setExportBusy] = useState(false);
  const [grid, setGrid] = useState<'tian' | 'mi' | 'blank'>('tian');
  const fileInput = useRef<HTMLInputElement>(null);
  const editorKey = `${notebook.id}:${notebook.mode}:${notebook.activePage}:${notebook.size}:${notebook.orientation}:${revision}`;
  const activeEditor = useRef(editorKey);
  activeEditor.current = editorKey;
  const initialData = useMemo(() => editorData(notebook), [editorKey]);
  const pageIndex = notebook.pages.findIndex(page => page.id === notebook.activePage);
  useEffect(() => {
    if (!api || notebook.mode !== 'paper') return;
    const frame = requestAnimationFrame(() => api.scrollToContent([paperGuide(notebook)], { fitToContent: true }));
    return () => cancelAnimationFrame(frame);
  }, [api, editorKey]);
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
  const pending = useRef(false);
  const persist = () => {
    if (!pending.current || savingPaused.current) return;
    try { localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(notebookRef.current)); pending.current = false; setStatus('Saved on this device'); }
    catch { setStatus('Could not save — download your board'); }
  };
  const capture = () => {
    const current = notebookRef.current;
    if (!api) return current;
    const scene = serializeAsJSON(api.getSceneElements().filter(element => !isGuide(element)), api.getAppState(), api.getFiles(), 'local');
    return setCurrentScene(current, scene);
  };
  const updateNotebook = (update: (current: Notebook) => Notebook, remount = false) => {
    const next = update(capture());
    notebookRef.current = next;
    if (remount) { setApi(null); setRevision(value => value + 1); }
    setNotebook(next);
    pending.current = true;
    persist();
  };
  const selectPage = (id: string) => updateNotebook(current => ({ ...current, activePage: id, mode: 'paper' }), true);
  const addPage = (duplicate = false) => updateNotebook(current => {
    const source = current.pages.find(page => page.id === current.activePage)!;
    const page = newPage(source.template);
    if (duplicate) page.scene = source.scene;
    const pages = [...current.pages];
    pages.splice(pages.indexOf(source) + 1, 0, page);
    return { ...current, pages, activePage: page.id, mode: 'paper' };
  }, true);
  const movePage = (from: number, to: number) => updateNotebook(current => {
    if (from < 0 || to < 0 || from >= current.pages.length || to >= current.pages.length) return current;
    const pages = [...current.pages];
    pages.splice(to, 0, pages.splice(from, 1)[0]);
    return { ...current, pages };
  });
  const confirmChange = () => {
    if (confirm === 'reset') updateNotebook(current => setCurrentScene(current, ''), true);
    if (confirm === 'delete') updateNotebook(current => {
      const pages = current.pages.filter(page => page.id !== current.activePage);
      if (!pages.length) pages.push(newPage());
      return { ...current, pages, activePage: pages[Math.max(0, pageIndex - 1)].id };
    }, true);
    setConfirm(null);
  };
  useEffect(() => {
    const flush = () => persist();
    window.addEventListener('pagehide', flush);
    return () => { clearTimeout(timer.current); flush(); window.removeEventListener('pagehide', flush); };
  }, []);

  const addPractice = () => {
    if (!api || !/^\p{Script=Han}$/u.test(character)) { setReviewError('Enter one Chinese character to create a writing grid.'); return; }
    const existing = api.getSceneElements();
    const content = existing.filter(element => element.id !== PAPER_ID);
    const y = content.length ? Math.max(...content.map(e => e.y + e.height)) + 60 : 130;
    const guides: Parameters<typeof convertToExcalidrawElements>[0] = [
      { type: 'text', x: 80, y: y - 75, text: `Character practice · ${character}`, fontSize: 24, fontFamily: 2 },
      { type: 'text', x: 80, y: y - 40, text: pronunciation(character), fontSize: 20, fontFamily: 2, strokeColor: '#9c6c51' },
    ];
    for (let row = 0; row < 2; row++) for (let col = 0; col < 4; col++) {
      const x = 80 + col * 150, top = y + row * 180;
      guides.push({ type: 'rectangle', x, y: top, width: 140, height: 140, strokeColor: '#d6a48c', roughness: 0, locked: true });
      if (grid !== 'blank') guides.push(
        { type: 'line', x: x + 70, y: top, points: [[0, 0], [0, 140]], strokeColor: '#e6c9ba', strokeStyle: 'dashed', roughness: 0, locked: true },
        { type: 'line', x, y: top + 70, points: [[0, 0], [140, 0]], strokeColor: '#e6c9ba', strokeStyle: 'dashed', roughness: 0, locked: true });
      if (grid === 'mi') guides.push(
        { type: 'line', x, y: top, points: [[0, 0], [140, 140]], strokeColor: '#e6c9ba', strokeStyle: 'dashed', roughness: 0, locked: true },
        { type: 'line', x: x + 140, y: top, points: [[0, 0], [-140, 140]], strokeColor: '#e6c9ba', strokeStyle: 'dashed', roughness: 0, locked: true });
      guides.push({ type: 'text', x: x + 45, y: top + 145, text: pronunciation(character), fontSize: 18, fontFamily: 2, strokeColor: '#9c6c51', locked: true });
      if (col === 0) guides.push({ type: 'text', x: x + 20, y: top + 10, text: Array.from(character.trim() || '永')[0], fontSize: 100, fontFamily: 2, strokeColor: '#d8c5bb', locked: true });
    }
    const elements = [...existing, ...convertToExcalidrawElements(guides)];
    api.updateScene({ elements, captureUpdate: CaptureUpdateAction.IMMEDIATELY });
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
    const timeout = setTimeout(() => controller.abort(), 190000);
    try {
      const result = await requestBotJob('/api/handwriting-review', { character: reviewCharacter, image: reviewImage }, controller.signal);
      if (!result || !(result.score === null || Number.isInteger(result.score) && result.score >= 0 && result.score <= 100)
          || typeof result.summary !== 'string' || !['strengths', 'improvements'].every(key => Array.isArray(result[key]) && result[key].every((tip: unknown) => typeof tip === 'string'))) throw new Error('The tutor returned an unreadable review. Please retry.');
      setReview(result);
      try { updateLearning(s => ({ ...s, reviews: [...s.reviews, { id: newId(), character: reviewCharacter, score: result.score, summary: result.summary, createdAt: Date.now() }] })); }
      catch { setReviewError('Review received, but device storage could not save it. Download your board before leaving.'); }
    } catch (error) { setReviewError(error instanceof Error && error.name !== 'AbortError' ? error.message : 'The review took too long. Please try again.'); }
    finally { clearTimeout(timeout); setReviewBusy(false); }
  };
  const downloadFile = (blob: Blob, extension: string) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${notebookRef.current.title.replace(/[^\p{L}\p{N} _-]/gu, '').trim() || 'study-notebook'}.${extension}`; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const download = () => downloadFile(new Blob([JSON.stringify(capture())], { type: 'application/json' }), 'hskboard');
  const importBoard = async (file: File) => {
    try {
      if (file.size > 25 * 1024 * 1024) throw new Error('Choose a board smaller than 25 MB.');
      const raw = await file.text();
      const header = JSON.parse(raw);
      const imported = header?.version === 2 && Array.isArray(header?.pages) ? parseNotebook(raw) : (sceneData(raw), newNotebook(raw));
      // Keep a recoverable copy before replacing the current notebook.
      localStorage.setItem(`${NOTEBOOK_KEY}-recovery`, JSON.stringify(capture()));
      savingPaused.current = false;
      updateNotebook(() => imported, true);
      setBoardError('');
      setShowMenu(false);
    } catch (error) { setBoardError(error instanceof Error ? error.message : 'This file could not be opened.'); }
  };
  const exportImage = async (format: 'png' | 'svg') => {
    if (!api) return;
    setExportBusy(true);
    try {
      await document.fonts.ready;
      const options = { elements: api.getSceneElements().filter(element => !isGuide(element) || includeGuides && element.id !== PAPER_ID), appState: { ...api.getAppState(), viewBackgroundColor: '#ffffff', exportBackground: true }, files: api.getFiles() };
      if (!options.elements.length) throw new Error('Add some content before exporting this page.');
      if (format === 'png') downloadFile(await exportToBlob({ ...options, maxWidthOrHeight: 2400 }), 'png');
      else downloadFile(new Blob([new XMLSerializer().serializeToString(await exportToSvg(options))], { type: 'image/svg+xml' }), 'svg');
      setBoardError('');
    } catch (error) { setBoardError(error instanceof Error ? error.message : 'Export failed.'); }
    finally { setExportBusy(false); }
  };
  const preparePrint = async () => {
    setExportBusy(true); setPrintPages([]);
    try {
      const current = capture();
      const indices = parsePageRange(range, current.pages.length);
      await document.fonts.ready;
      const pages = await Promise.all(indices.map(async index => {
        const page = current.pages[index];
        const scene = sceneData(page.scene);
        const elements = [...paperElements(current, includeGuides ? page.template : 'Blank'), ...(scene.elements || []).filter(element => !element.isDeleted && !isGuide(element))];
        const svg = await exportToSvg({ elements, appState: { ...scene.appState, viewBackgroundColor: '#ffffff', exportBackground: true, exportWithDarkMode: false }, files: scene.files || {}, exportPadding: 0 });
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}`;
      }));
      setPrintPages(pages); setBoardError('');
    } catch (error) { setBoardError(error instanceof Error ? error.message : 'Print preview could not be prepared.'); }
    finally { setExportBusy(false); }
  };
  const print = async () => {
    const frame = document.createElement('iframe');
    frame.className = 'board-print-frame';
    frame.title = 'Notebook print document';
    document.body.append(frame);
    const target = frame.contentDocument;
    if (!target || !frame.contentWindow) { frame.remove(); setBoardError('The print window is unavailable.'); return; }
    const [width, height] = dimensions(notebookRef.current);
    target.title = notebookRef.current.title;
    const style = target.createElement('style');
    style.textContent = `@page{size:${width}mm ${height}mm;margin:0}html,body{margin:0;padding:0}section{width:${width}mm;height:${height}mm;padding:${margin}mm;box-sizing:border-box;break-after:page;display:grid;place-items:center}section:last-child{break-after:auto}img{width:100%;height:100%;object-fit:contain}`;
    target.head.append(style);
    const images = printPages.map(src => {
      const page = target.createElement('section');
      const image = target.createElement('img'); image.src = src; page.append(image); target.body.append(page); return image;
    });
    try { await Promise.all(images.map(image => image.decode())); frame.contentWindow.addEventListener('afterprint', () => frame.remove(), { once: true }); frame.contentWindow.print(); }
    catch { frame.remove(); setBoardError('Print could not load one of the pages.'); }
  };
  const joinSession = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const url = new URL(roomLink);
      if (url.origin !== 'https://excalidraw.com' || !/^#room=[a-zA-Z0-9_-]+,[a-zA-Z0-9_-]+$/.test(url.hash)) throw new Error();
      window.open(url.href, '_blank', 'noopener,noreferrer'); setLinkError('');
    } catch { setLinkError('Paste a valid https://excalidraw.com/#room=… invitation link.'); }
  };

  return <div className="study-board-layout">
    <nav className="board-navigation" aria-label="Study navigation">
      <Link className="board-rail-brand" to="/home" aria-label="HSK Study KE home" title="HSK Study KE home"><img src="/lingora/logo-picture.png" alt="" /></Link>
      {navigation.map(({ to, label, icon: Icon }) => <Link key={to} to={to} onClick={persist} aria-label={label} title={label} aria-current={label === 'Practice' ? 'page' : undefined}><Icon size={22} aria-hidden="true"/></Link>)}
    </nav>
    <div className="study-board">
    <header className="board-header">
      <button type="button" onClick={() => { persist(); navigate('/home'); }} aria-label="Back to home" title="Back to home"><ArrowLeft size={19}/></button>
      <button type="button" onClick={() => setShowMenu(!showMenu)} aria-expanded={showMenu} aria-label="Whiteboard commands" title="Whiteboard commands"><Menu size={20}/></button>
      <div className="board-heading"><input aria-label="Notebook title" value={notebook.title} maxLength={120} onChange={event => updateNotebook(current => ({ ...current, title: event.target.value }))}/><p role="status">{status}</p></div>
      <button type="button" className={showPractice ? 'board-primary' : undefined} aria-expanded={showPractice} aria-label="Character Practice" title="Character Practice" onClick={() => setShowPractice(!showPractice)}><PenLine size={18}/><span>Character Practice</span></button>
      <button type="button" aria-label="Export" title="Export" onClick={() => { setShowExport(true); setPrintPages([]); }}><Download size={18}/><span>Export</span></button>
      <button type="button" aria-label="Study Together" title="Study Together" onClick={() => setShowSessions(true)}><Users size={18}/><span>Study Together</span></button>
    </header>
    <input type="file" ref={fileInput} accept=".hskboard,.excalidraw,.json" hidden onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; if (file) void importBoard(file); }}/>
    {showMenu && <section className="board-command-menu" aria-label="Whiteboard commands">
      <strong>Notebook</strong><button type="button" onClick={() => fileInput.current?.click()}>Open board</button><button type="button" onClick={download}>Save as .hskboard</button><button type="button" onClick={() => { setShowMenu(false); setShowExport(true); }}>Print or export</button><button type="button" onClick={() => { setShowMenu(false); setConfirm('reset'); }}>Reset current canvas</button>
      <strong>Practice</strong><button type="button" onClick={() => { setShowPractice(true); setShowMenu(false); }}>Character Practice</button><Link to="/practice/exercises" onClick={persist}>Practice exercises</Link><button type="button" onClick={() => { setShowMenu(false); setShowSessions(true); }}>Study Together</button>
      <strong>Workspace</strong><button type="button" onClick={() => { setShowPages(true); setShowMenu(false); }}>Page navigator</button><button type="button" onClick={() => setShowMenu(false)}>Close commands</button>
    </section>}
    {showPractice && <section className="board-practice" aria-label="Chinese character practice">
      <label>Character <input value={character} onChange={e => setCharacter(Array.from(e.target.value).slice(0, 1).join(''))} aria-label="Character to practice" /></label>
      <span className="board-pinyin">{character && pronunciation(character)}</span>
      <label>Writing grid <select value={grid} onChange={event => setGrid(event.target.value as typeof grid)}><option value="tian">Tian Zi Ge</option><option value="mi">Mi Zi Ge</option><option value="blank">Blank</option></select></label>
      <button onClick={addPractice} disabled={!api}>+ Writing grid</button>
      <button onClick={prepareReview} disabled={!api}>✦ Rate writing</button>
      <span className="board-tip">Trace, then try it yourself. Select your strokes to rate your writing.</span>
    </section>}
    <div className="board-paper-tools" aria-label="Notebook settings">
      <label><span>Workspace</span><select value={notebook.mode} onChange={event => updateNotebook(current => ({ ...current, mode: event.target.value as Notebook['mode'] }), true)}><option value="paper">Paper mode</option><option value="infinite">Infinite canvas</option></select></label>
      {notebook.mode === 'paper' && <>
        <label><span>Size</span><select aria-label="Paper size" value={notebook.size} onChange={event => updateNotebook(current => ({ ...current, size: event.target.value as PaperSize }), true)}>{Object.keys(paperSizes).map(size => <option key={size}>{size}</option>)}</select></label>
        <label><span>Orientation</span><select aria-label="Paper orientation" value={notebook.orientation} onChange={event => updateNotebook(current => ({ ...current, orientation: event.target.value as Notebook['orientation'] }), true)}><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></label>
        <label><span>Template</span><select aria-label="Page template" value={notebook.pages[pageIndex].template} onChange={event => updateNotebook(current => ({ ...current, pages: current.pages.map(page => page.id === current.activePage ? { ...page, template: event.target.value as Template } : page) }), true)}>{templates.map(template => <option key={template}>{template}</option>)}</select></label>
        <button type="button" disabled={!api} onClick={() => api?.scrollToContent([paperGuide(notebook)], { fitToContent: true })}>Fit Page</button>
        <button type="button" aria-expanded={showPages} onClick={() => setShowPages(!showPages)}>Pages · {pageIndex + 1}/{notebook.pages.length}</button>
      </>}
      <button type="button" aria-pressed={lasso.active} onClick={lasso.toggle} title="Lasso (L). Draw around objects to select them.">Lasso</button>
      <Link className="board-exercises" to="/practice/exercises" onClick={persist}>Exercises</Link>
    </div>
    {boardError && <div className="board-review-notice" role="alert">{boardError}<button onClick={() => setBoardError('')} aria-label="Dismiss notebook message">✕</button></div>}
    {reviewError && !reviewImage && <div className="board-review-notice" role="alert">{reviewError}<button onClick={() => setReviewError('')} aria-label="Dismiss message">✕</button></div>}
    <div className="board-workspace">
    <div className={`board-canvas${lasso.active ? ' board-lasso-active' : ''}`} ref={canvasRef} onPointerDownCapture={lasso.start} onPointerMoveCapture={lasso.move} onPointerUpCapture={lasso.finish} onPointerCancelCapture={lasso.cancel}>
      <MovableToolbar container={canvasRef} />
      {lasso.path.length > 1 && <svg className="board-lasso-path" aria-hidden="true"><polygon points={lasso.path.map(point => `${point.x},${point.y}`).join(' ')} /></svg>}
      <Excalidraw key={editorKey} initialData={initialData} excalidrawAPI={setApi} onChange={(elements, appState, files) => {
        if (editorKey !== activeEditor.current) return;
        const current = notebookRef.current;
        const scene = serializeAsJSON(elements.filter(element => !isGuide(element)), appState, files, 'local');
        if (scene === currentScene(current)) return;
        notebookRef.current = setCurrentScene(current, scene);
        pending.current = true;
        clearTimeout(timer.current); timer.current = setTimeout(persist, 600);
      }} UIOptions={{ canvasActions: { saveToActiveFile: false } }} />
    </div>
    {showPages && notebook.mode === 'paper' && <aside className="board-pages" aria-label="Page navigator">
      <div><strong>Pages</strong><button type="button" onClick={() => setShowPages(false)} aria-label="Close page navigator">✕</button></div>
      <ol>{notebook.pages.map((page, index) => <li key={page.id} draggable onDragStart={event => event.dataTransfer.setData('text/plain', String(index))} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); const indexText = event.dataTransfer.getData('text/plain'); if (/^\d+$/.test(indexText)) movePage(Number(indexText), index); }}><button type="button" aria-current={page.id === notebook.activePage ? 'page' : undefined} onClick={() => selectPage(page.id)}>Page {index + 1}<small>{page.template}</small></button></li>)}</ol>
      <div className="board-page-actions"><button type="button" onClick={() => addPage()}>Add page</button><button type="button" onClick={() => addPage(true)}>Duplicate</button><button type="button" disabled={pageIndex === 0} onClick={() => selectPage(notebook.pages[pageIndex - 1].id)}>Previous</button><button type="button" disabled={pageIndex === notebook.pages.length - 1} onClick={() => selectPage(notebook.pages[pageIndex + 1].id)}>Next</button><button type="button" disabled={pageIndex === 0} onClick={() => movePage(pageIndex, pageIndex - 1)}>Move up</button><button type="button" disabled={pageIndex === notebook.pages.length - 1} onClick={() => movePage(pageIndex, pageIndex + 1)}>Move down</button><button type="button" onClick={() => setConfirm('delete')}>Delete page</button></div>
    </aside>}
    </div>
    {confirm && <dialog ref={node => { if (node && !node.open) node.showModal(); }} className="board-dialog" onCancel={() => setConfirm(null)} aria-labelledby="board-confirm-title"><h2 id="board-confirm-title">{confirm === 'delete' ? 'Delete this page?' : 'Reset this canvas?'}</h2><p>{confirm === 'delete' ? 'This removes the active page and its drawings.' : 'This clears the current canvas. Other pages remain saved.'}</p><div className="board-dialog-actions"><button type="button" onClick={() => setConfirm(null)} autoFocus>Cancel</button><button type="button" className="board-primary" onClick={confirmChange}>{confirm === 'delete' ? 'Delete page' : 'Reset canvas'}</button></div></dialog>}
    {showExport && <dialog ref={node => { if (node && !node.open) node.showModal(); }} className="board-dialog board-export-dialog" onCancel={() => setShowExport(false)} aria-labelledby="board-export-title"><button type="button" className="board-close" aria-label="Close export" onClick={() => setShowExport(false)}>✕</button><h2 id="board-export-title">Export notebook</h2><div className="board-dialog-actions"><button type="button" onClick={download}>Editable .hskboard</button><button type="button" disabled={exportBusy || !api} onClick={() => void exportImage('png')}>PNG</button><button type="button" disabled={exportBusy || !api} onClick={() => void exportImage('svg')}>SVG</button></div><h3>Print or save as PDF</h3><p>{notebook.size} {notebook.orientation} · {notebook.pages.length} paper {notebook.pages.length === 1 ? 'page' : 'pages'}. Content outside the paper is scaled to fit the printed page.</p><div className="board-export-fields"><label>Page range<input placeholder="All pages" value={range} onChange={event => { setRange(event.target.value); setPrintPages([]); }}/></label><label>Margins<select value={margin} onChange={event => setMargin(Number(event.target.value))}><option value={0}>None</option><option value={10}>10 mm</option><option value={15}>15 mm</option></select></label><label><input type="checkbox" checked={includeGuides} onChange={event => { setIncludeGuides(event.target.checked); setPrintPages([]); }}/> Include template guides</label></div><div className="board-dialog-actions"><button type="button" disabled={exportBusy} onClick={() => void preparePrint()}>{exportBusy ? 'Preparing…' : 'Preview pages'}</button><button type="button" className="board-primary" disabled={!printPages.length} onClick={() => void print()}>Print / Save as PDF</button></div>{boardError && <p role="alert">{boardError}</p>}{printPages.length > 0 && <div className="board-print-preview">{printPages.map((src,index) => <img key={index} src={src} alt={`Print preview page ${index + 1}`}/>)}</div>}</dialog>}
    {reviewImage && <div className="board-overlay">
      <dialog open ref={node => { if (node && !node.matches(':modal')) { node.close(); node.showModal(); } }} className="board-dialog" aria-labelledby="review-title" onCancel={e => { if (reviewBusy) e.preventDefault(); else { setReviewImage(''); setReviewError(''); } }}>
        <button className="board-close" disabled={reviewBusy} onClick={() => { setReviewImage(''); setReviewError(''); }} aria-label="Close handwriting review" autoFocus>✕</button>
        <p className="board-eyebrow">YOUR WRITING COACH</p><h2 id="review-title">A little better, every stroke.</h2>
        <img className="board-review-image" src={reviewImage} alt="Selected handwriting to review" />
        <label className="board-review-target">Target character <input aria-label="Review target character" value={reviewCharacter} disabled={reviewBusy} onChange={e => { setReviewCharacter(Array.from(e.target.value).slice(0, 1).join('')); setReview(null); }} /> <span>{reviewCharacter && pronunciation(reviewCharacter)}</span></label>
        <p>Review sends only this selected handwriting and its target character through the bot’s shared AI tutor. Feedback covers visual shape and proportions, not stroke order.</p>
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
  </div></div>;
}
