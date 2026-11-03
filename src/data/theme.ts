export type Theme = 'light' | 'dark';
export function currentTheme(): Theme {
  const saved = document.documentElement.dataset.theme;
  return saved === 'light' || saved === 'dark' ? saved :
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('hsk-landing-theme', theme); } catch { /* Optional preference. */ }
}
export function initializeTheme() {
  try {
    const saved = localStorage.getItem('hsk-landing-theme');
    if (saved === 'light' || saved === 'dark') document.documentElement.dataset.theme = saved;
  } catch { /* Follow the device theme when storage is unavailable. */ }
}
