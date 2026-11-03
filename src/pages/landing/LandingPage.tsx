import { useEffect, useRef, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import markup from './landing.html?raw';
import './landing.css';
import { currentTheme, setTheme } from '../../data/theme';

// This markup is the checked-in landing design, never user or server content.
export function LandingPage() {
  const page = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const root = page.current!;
    const previousTitle = document.title;
    document.title = 'HSK Study KE · One stroke at a time';
    const invite = import.meta.env.VITE_DISCORD_INVITE_URL;
    if (invite && /^https:\/\/(discord\.gg\/|discord\.com\/invite\/)/.test(invite)) {
      root.querySelectorAll<HTMLAnchorElement>('[data-discord-link]').forEach(link => {
        link.href = invite;
        link.textContent = 'Join Discord';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      });
    }
    const nav = root.querySelector('#nav');
    const scroll = () => nav?.classList.toggle('scrolled', window.scrollY > 8);
    scroll();
    window.addEventListener('scroll', scroll, { passive: true });
    return () => {
      document.title = previousTitle;
      window.removeEventListener('scroll', scroll);
    };
  }, []);

  function onClick(event: MouseEvent<HTMLDivElement>) {
    if (!(event.target instanceof Element)) return;
    const themeButton = event.target.closest('#th');
    if (themeButton) {
      setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
      return;
    }
    const link = event.target.closest<HTMLAnchorElement>('a[href]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') return;
    const href = link.getAttribute('href')!;
    if (href.startsWith('/')) {
      event.preventDefault();
      navigate(href);
      window.scrollTo(0, 0);
    } else if (href.startsWith('#')) {
      const target = page.current?.querySelector(href);
      if (target instanceof HTMLDetailsElement) target.open = true;
    }
  }

  return <div ref={page} className="landing-page" onClick={onClick} dangerouslySetInnerHTML={{ __html: markup }} />;
}
