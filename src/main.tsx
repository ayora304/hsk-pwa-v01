import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import { initializeTheme } from './data/theme';

initializeTheme();

function AppStartup() {
  React.useEffect(() => {
    if (new URLSearchParams(window.location.search).get('splash') === 'preview') {
      clearTimeout((window as Window & { __splashRecovery?: number }).__splashRecovery);
      return;
    }
    let removalTimer: ReturnType<typeof setTimeout>;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Let the app shell mount immediately, then hold the branded animation long
    // enough to be seen. The recovery timer in index.html remains the upper bound
    // for unusually slow or failed startup.
    const splashMinimum = 3200;
    const timer = setTimeout(() => {
      const splash = document.getElementById('app-splash');
      document.getElementById('root')?.removeAttribute('inert');
      clearTimeout((window as Window & { __splashRecovery?: number }).__splashRecovery);
      splash?.classList.add('splash-leaving');
      removalTimer = setTimeout(() => splash?.remove(), reduceMotion ? 0 : 320);
    }, reduceMotion ? 0 : Math.max(0, splashMinimum - performance.now()));
    return () => { clearTimeout(timer); clearTimeout(removalTimer); };
  }, []);
  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppStartup />
  </React.StrictMode>
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
