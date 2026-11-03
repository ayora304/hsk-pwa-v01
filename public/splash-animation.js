// Runs before React: eight rendered mascot poses and five Chinese writing strokes.
(() => {
  const scene = document.getElementById('panda-writing-scene');
  const sprite = document.getElementById('panda-sprite');
  if (!scene || !sprite) return;
  const strokes = [...scene.querySelectorAll('[data-writing-stroke]')];
  const characterLabel = document.getElementById('splash-character-label');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const lengths = strokes.map(stroke => stroke.getTotalLength());
  strokes.forEach((stroke, i) => { stroke.style.strokeDasharray = String(lengths[i]); });
  // The panda pose loop is rendered in the animated WebP; this script keeps
  // the vector writing strokes synchronized over it.
  const start = performance.now();
  let frameId;
  function frame(now) {
    if (!scene.isConnected) { motion.removeEventListener('change', restart); return; }
    if (motion.matches) {
      strokes.forEach(stroke => { stroke.style.strokeDashoffset = '0'; });
      if (characterLabel) characterLabel.style.opacity = '1';
      return;
    }
    const phase = (now - start) % 4800;
    if (characterLabel) characterLabel.style.opacity = phase > 3500 ? '1' : '0';
    strokes.forEach((stroke, i) => {
      const progress = Math.max(0, Math.min(1, (phase - 180 - i * 520) / 440));
      stroke.style.strokeDashoffset = String(lengths[i] * (1 - progress));
    });
    frameId = requestAnimationFrame(frame);
  }
  function restart() { cancelAnimationFrame(frameId); frameId = requestAnimationFrame(frame); }
  motion.addEventListener('change', restart);
  restart();
})();
