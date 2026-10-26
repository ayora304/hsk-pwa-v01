import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/** Excalidraw has no toolbar-position API; keep this adapter isolated. */
export function MovableToolbar({ container }: { container: React.RefObject<HTMLDivElement | null> }) {
  const [toolbar, setToolbar] = useState<HTMLElement | null>(null);
  const position = useRef({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const root = container.current;
    if (!root) return;
    const locate = () => setToolbar(root.querySelector<HTMLElement>('.App-toolbar'));
    locate();
    const observer = new MutationObserver(locate);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [container]);
  const move = (dx: number, dy: number) => {
    if (!toolbar || !container.current) return;
    const bar = toolbar.getBoundingClientRect(), bounds = container.current.getBoundingClientRect();
    const x = Math.max(bounds.left - bar.left, Math.min(dx, bounds.right - bar.right));
    const y = Math.max(bounds.top + 24 - bar.top, Math.min(dy, bounds.bottom - bar.bottom - 16));
    position.current = { x: position.current.x + x, y: position.current.y + y };
    toolbar.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`;
  };
  useEffect(() => {
    if (!toolbar) return;
    const observer = new ResizeObserver(() => move(0, 0));
    observer.observe(container.current!);
    return () => observer.disconnect();
  }, [toolbar]);
  if (!toolbar) return null;
  return createPortal(<button className="board-toolbar-grip" aria-label="Move drawing toolbar" title="Drag to move toolbar. Use arrow keys when focused; double-click to reset."
    onPointerDown={e => { e.preventDefault(); e.stopPropagation(); e.currentTarget.focus(); e.currentTarget.setPointerCapture(e.pointerId); drag.current = { x: e.clientX, y: e.clientY }; }}
    onPointerMove={e => { if (!drag.current) return; move(e.clientX - drag.current.x, e.clientY - drag.current.y); drag.current = { x: e.clientX, y: e.clientY }; }}
    onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}
    onDoubleClick={() => { position.current = { x: 0, y: 0 }; toolbar.style.transform = ''; }}
    onKeyDown={e => { const delta: Record<string, [number, number]> = { ArrowLeft: [-20, 0], ArrowRight: [20, 0], ArrowUp: [0, -20], ArrowDown: [0, 20] }; if (delta[e.key]) { e.preventDefault(); e.stopPropagation(); move(...delta[e.key]); } }}
  >⠿ <span>Move tools</span></button>, toolbar);
}
