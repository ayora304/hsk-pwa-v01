import { useEffect, useRef, useState, type PointerEvent } from 'react';
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types';

type Point = { x: number; y: number };

function contains(polygon: Point[], point: Point) {
  let inside = false;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
    const a = polygon[index], b = polygon[previous];
    if ((a.y > point.y) !== (b.y > point.y) && point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

export function useBoardLasso(api: ExcalidrawImperativeAPI | null) {
  const [active, setActive] = useState(false);
  const [path, setPath] = useState<Point[]>([]);
  const drag = useRef<{ id: number; path: Point[] } | null>(null);

  useEffect(() => {
    const shortcuts = (event: KeyboardEvent) => {
      if (!api || event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.repeat || document.querySelector('dialog:modal')) return;
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable=true]')) return;
      if (event.key === 'Escape') { drag.current = null; setPath([]); setActive(false); }
      if (event.key.toLowerCase() !== 'l') return;
      event.preventDefault(); event.stopPropagation();
      if (event.shiftKey) { setActive(false); api.setActiveTool({ type: 'line' }); }
      else setActive(value => !value);
    };
    window.addEventListener('keydown', shortcuts, true);
    return () => window.removeEventListener('keydown', shortcuts, true);
  }, [api]);

  const pointAt = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };
  const start = (event: PointerEvent<HTMLDivElement>) => {
    if (!active || !(event.target instanceof HTMLCanvasElement) || event.button !== 0) return;
    event.preventDefault(); event.stopPropagation();
    const point = pointAt(event);
    drag.current = { id: event.pointerId, path: [point] };
    setPath([point]);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    event.preventDefault(); event.stopPropagation();
    current.path.push(pointAt(event));
    setPath([...current.path]);
  };
  const finish = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    event.preventDefault(); event.stopPropagation();
    drag.current = null; setPath([]); setActive(false);
    if (!api || current.path.length < 3) return;
    const { scrollX, scrollY, zoom } = api.getAppState();
    const polygon = current.path.map(point => ({ x: point.x / zoom.value - scrollX, y: point.y / zoom.value - scrollY }));
    const selectedElementIds: Record<string, true> = {};
    for (const element of api.getSceneElements()) {
      if (element.locked) continue;
      const center = { x: element.x + element.width / 2, y: element.y + element.height / 2 };
      const cos = Math.cos(element.angle), sin = Math.sin(element.angle);
      const corners = [-1, 1].flatMap(x => [-1, 1].map(y => ({ x: x * element.width / 2, y: y * element.height / 2 })));
      if (corners.every(point => contains(polygon, { x: center.x + point.x * cos - point.y * sin, y: center.y + point.x * sin + point.y * cos }))) selectedElementIds[element.id] = true;
    }
    api.setActiveTool({ type: 'selection' });
    api.updateScene({ appState: { selectedElementIds } });
  };
  const cancel = () => { drag.current = null; setPath([]); };
  return { active, toggle: () => { cancel(); setActive(value => !value); }, path, start, move, finish, cancel };
}
