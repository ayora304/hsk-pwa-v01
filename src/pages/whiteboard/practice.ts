import { convertToExcalidrawElements } from '@excalidraw/excalidraw';
import { pinyin } from 'pinyin-pro';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';

export function pronunciation(character: string) { return pinyin(character, { toneType: 'symbol' }); }

export function addMissingPinyin(elements: readonly ExcalidrawElement[]) {
  const additions: Parameters<typeof convertToExcalidrawElements>[0] = [];
  const updated = elements.map(element => {
    if (element.type !== 'text' || !element.locked || element.fontSize !== 100 || !/^\p{Script=Han}$/u.test(element.text)) return element;
    const id = `pinyin-${element.id}`;
    if (elements.some(item => item.id === id)) return element;
    additions.push({ id, type: 'text', x: element.x + 22, y: element.y + 105, text: pronunciation(element.text), fontSize: 18, fontFamily: 2, strokeColor: '#9c6c51', locked: true });
    return { ...element, fontSize: 86, version: element.version + 1 };
  });
  return additions.length ? [...updated, ...convertToExcalidrawElements(additions, { regenerateIds: false })] : elements;
}
