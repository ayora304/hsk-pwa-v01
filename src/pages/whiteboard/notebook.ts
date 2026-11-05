import type { ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types';

export const NOTEBOOK_KEY = 'hsk-notebook-v2';
export const LEGACY_BOARD_KEY = 'hsk-whiteboard-v1';
export const paperSizes = { A3: [297, 420], A4: [210, 297], A5: [148, 210] } as const;
export const templates = ['Blank', 'Ruled', 'Dotted', 'Graph', 'Vocabulary', 'Character grid', 'Grammar'] as const;
export type PaperSize = keyof typeof paperSizes;
export type Template = typeof templates[number];
export type Page = { id: string; template: Template; scene: string };
export type Notebook = {
  version: 2;
  id: string;
  title: string;
  mode: 'paper' | 'infinite';
  size: PaperSize;
  orientation: 'portrait' | 'landscape';
  activePage: string;
  pages: Page[];
  infiniteScene: string;
};

export function newPage(template: Template = 'Blank'): Page {
  return { id: crypto.randomUUID(), template, scene: '' };
}

export function newNotebook(legacy = ''): Notebook {
  const page = newPage();
  return { version: 2, id: crypto.randomUUID(), title: 'Study notebook', mode: legacy ? 'infinite' : 'paper', size: 'A4', orientation: 'portrait', activePage: page.id, pages: [page], infiniteScene: legacy };
}

export function dimensions(notebook: Pick<Notebook, 'size' | 'orientation'>) {
  const [width, height] = paperSizes[notebook.size];
  return notebook.orientation === 'portrait' ? [width, height] : [height, width];
}

export function paperPixels(notebook: Pick<Notebook, 'size' | 'orientation'>) {
  return dimensions(notebook).map(mm => mm * 96 / 25.4);
}

export function sceneData(scene: string): ExcalidrawInitialDataState {
  if (!scene) return {};
  const saved = JSON.parse(scene);
  if (!saved || !Array.isArray(saved.elements) || (saved.files != null && (typeof saved.files !== 'object' || Array.isArray(saved.files)))) throw new Error('The board scene could not be read.');
  return saved;
}

export function parseNotebook(raw: string): Notebook {
  const value = JSON.parse(raw);
  if (value?.version !== 2 || typeof value.id !== 'string' || typeof value.title !== 'string' || !['paper', 'infinite'].includes(value.mode)
    || !Object.prototype.hasOwnProperty.call(paperSizes, value.size) || !['portrait', 'landscape'].includes(value.orientation)
    || !Array.isArray(value.pages) || !value.pages.length || typeof value.infiniteScene !== 'string') throw new Error('This is not a supported HSK notebook.');
  const ids = new Set<string>();
  for (const page of value.pages) {
    if (typeof page?.id !== 'string' || ids.has(page.id) || !templates.includes(page.template) || typeof page.scene !== 'string') throw new Error('The notebook contains an invalid page.');
    ids.add(page.id);
    sceneData(page.scene);
  }
  if (!ids.has(value.activePage)) throw new Error('The notebook has no active page.');
  sceneData(value.infiniteScene);
  return value;
}

export function readNotebook(): { notebook: Notebook; error: string } {
  try {
    const saved = localStorage.getItem(NOTEBOOK_KEY);
    if (saved) return { notebook: parseNotebook(saved), error: '' };
    const legacy = localStorage.getItem(LEGACY_BOARD_KEY) || '';
    sceneData(legacy);
    return { notebook: newNotebook(legacy), error: '' };
  } catch {
    return { notebook: newNotebook(), error: 'Saved notebook data could not be opened. Automatic saving is paused to protect it. Open a backup or download this workspace to keep new work.' };
  }
}

export function currentScene(notebook: Notebook) {
  return notebook.mode === 'infinite' ? notebook.infiniteScene : notebook.pages.find(page => page.id === notebook.activePage)!.scene;
}

export function setCurrentScene(notebook: Notebook, scene: string): Notebook {
  if (notebook.mode === 'infinite') return { ...notebook, infiniteScene: scene };
  return { ...notebook, pages: notebook.pages.map(page => page.id === notebook.activePage ? { ...page, scene } : page) };
}

export function parsePageRange(range: string, pageCount: number) {
  if (!range.trim()) return Array.from({ length: pageCount }, (_, index) => index);
  const pages = new Set<number>();
  for (const part of range.split(',')) {
    const match = /^(\d+)(?:\s*-\s*(\d+))?$/.exec(part.trim());
    if (!match) throw new Error('Enter page numbers such as 1, 3–5 using a hyphen for ranges.');
    const start = Number(match[1]);
    const end = Number(match[2] || match[1]);
    if (start < 1 || end < start || end > pageCount) throw new Error(`Choose pages from 1 to ${pageCount}.`);
    for (let page = start; page <= end; page++) pages.add(page - 1);
  }
  return [...pages].sort((a, b) => a - b);
}
