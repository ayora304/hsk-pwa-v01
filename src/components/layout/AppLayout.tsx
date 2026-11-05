import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, BookOpen, ChartNoAxesColumnIncreasing, Check, Home, Menu, MessageSquare, Moon, NotebookPen, PanelLeftClose, PanelLeftOpen, PenLine, Settings, Sun, Target, UserRound, X } from 'lucide-react';
import { useLearning, useStorageError } from '../../data/learningStore';
import { currentTheme, setTheme } from '../../data/theme';
import './appLayout.css';
import '../../styles/typography.css';
import '../../styles/study.css';
import { StudyHeader } from './StudyHeader';

const fallbackBrandIcon = '/lingora/logo-picture.png';

function useDiscordServerIcon() {
  const [icon, setIcon] = useState(fallbackBrandIcon);
  useEffect(() => {
    const invite = import.meta.env.VITE_DISCORD_INVITE_URL;
    if (typeof invite !== 'string') return;
    let code: string | undefined;
    try {
      const url = new URL(invite);
      if (url.protocol !== 'https:') return;
      const match = url.hostname === 'discord.gg'
        ? /^\/([A-Za-z0-9-]+)\/?$/.exec(url.pathname)
        : url.hostname === 'discord.com'
          ? /^\/invite\/([A-Za-z0-9-]+)\/?$/.exec(url.pathname)
          : null;
      code = match?.[1];
    } catch { return; }
    if (!code) return;

    let active = true;
    let pending = false;
    let lastRefresh = 0;
    let controller: AbortController | undefined;
    const refresh = async () => {
      if (document.hidden || pending || Date.now() - lastRefresh < 30_000) return;
      pending = true;
      lastRefresh = Date.now();
      controller = new AbortController();
      const timeout = window.setTimeout(() => controller?.abort(), 10_000);
      try {
        const response = await fetch(`https://discord.com/api/v10/invites/${encodeURIComponent(code!)}`, {
          signal: controller.signal, cache: 'no-store', credentials: 'omit',
        });
        if (!response.ok) return;
        const { guild } = await response.json();
        if (!active) return;
        setIcon(typeof guild?.id === 'string' && /^\d+$/.test(guild.id)
          && typeof guild?.icon === 'string' && /^(a_)?[a-f0-9]+$/.test(guild.icon)
          ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${guild.icon.startsWith('a_') ? 'gif' : 'png'}?size=128`
          : fallbackBrandIcon);
      } catch { /* Keep the existing icon when offline or Discord is unavailable. */ }
      finally { window.clearTimeout(timeout); pending = false; }
    };
    void refresh();
    const timer = window.setInterval(refresh, 5 * 60_000);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      active = false;
      controller?.abort();
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);
  return icon;
}

const navigation = [
  { to: '/home', name: 'Home', icon: Home },
  { to: '/classroom', name: 'Learn', icon: BookOpen },
  { to: '/practice', name: 'Practice', icon: PenLine },
  { to: '/challenges', name: 'Challenges', icon: Target },
  { to: '/stats', name: 'Progress', icon: ChartNoAxesColumnIncreasing },
  { to: '/chats', name: 'Conversations', icon: MessageSquare },
  { to: '/library', name: 'Library', icon: NotebookPen },
];
export const AppLayout = ({ children }: { children: ReactNode }) => {
  const brandIcon = useDiscordServerIcon();
  const { pathname, search } = useLocation();
  const data = useLearning();
  const storageError = useStorageError();
  const [online, setOnline] = useState(navigator.onLine);
  const [theme, updateTheme] = useState(currentTheme);
  const [open, setOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const drawer = useRef<HTMLDialogElement>(null);
  const menu = useRef<HTMLButtonElement>(null);
  const name = data.profile.name.trim() || 'Your profile';
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update); window.addEventListener('offline', update);
    return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update); };
  }, []);
  useEffect(() => { drawer.current?.close(); setOpen(false); }, [pathname]);
  useEffect(() => {
    const observer = new MutationObserver(() => updateTheme(currentTheme()));
    observer.observe(document.documentElement, { attributes:true, attributeFilter:['data-theme'] });
    return () => observer.disconnect();
  }, []);
  const practiceFilters = new URLSearchParams(search);
  const isPracticeBoard = pathname === '/practice' && !['mode', 'skill', 'lesson', 'topic', 'level'].some(key => practiceFilters.has(key));
  if (pathname === '/' || pathname === '/whiteboard' || isPracticeBoard) return <>{children}</>;
  const sidebar = <>
    <Link to="/home" className="lingora-brand" aria-label="HSK Study KE home" title="HSK Study KE home"><img src={brandIcon} alt="" onError={e => { if (e.currentTarget.getAttribute('src') !== fallbackBrandIcon) e.currentTarget.src = fallbackBrandIcon; }}/><span><b>HSK Study KE</b><small>Learn · Practice · Speak</small></span></Link>
    <nav className="lingora-nav" aria-label="Main navigation">{navigation.map(({ to, name, icon: Icon }) => <NavLink key={to} to={to} aria-label={name} title={name}><Icon size={20} aria-hidden="true"/><span>{name}</span></NavLink>)}</nav>
    <nav className="lingora-mobile-tools" aria-label="More study tools"><Link to="/translate">Translation tutor</Link><Link to="/notes">Study notes</Link><Link to="/notifications">Study reminders</Link></nav>
    <div className="lingora-sidebar-bottom"><Link className="lingora-side-promo" to="/schedule-detail" aria-label="Your schedule" title="Your schedule"><b><Target size={19} aria-hidden="true"/><span>A little every day</span></b><p>Make room for your next adventure. Plan a study session.</p><span className="lingora-button">Your schedule <ArrowRight size={14}/></span><img src="/lingora/plus-picture.png" alt=""/></Link>
    <button className="lingora-theme" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} onClick={() => { const next = theme === 'dark' ? 'light' : 'dark'; setTheme(next); updateTheme(next); }}>{theme === 'dark' ? <Sun size={16} aria-hidden="true"/> : <Moon size={16} aria-hidden="true"/>}<span>{theme === 'dark' ? 'Light' : 'Dark'} mode</span></button>
    <Link to="/profile" className="lingora-profile" aria-label={`${name} profile`} title={`${name} profile`}><span className="lingora-avatar">{data.profile.name.trim().slice(0, 1).toUpperCase() || '你'}</span><span><b>{name}</b><small>Learning Chinese</small></span><Settings size={16}/></Link>
    <p className="lingora-device" role="status"><Check size={12}/>{online ? 'Saved on this device' : 'Offline · keep practising'}</p></div>
  </>;
  return <div className={`lingora-app${pathname === '/home' ? ' is-home' : ''}${pathname === '/quiz' ? ' is-quiz' : ''}${sidebarCollapsed ? ' is-sidebar-collapsed' : ''}`}>
    <aside className="lingora-sidebar"><button type="button" className="lingora-sidebar-toggle" aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!sidebarCollapsed} onClick={() => setSidebarCollapsed(value => !value)}>{sidebarCollapsed ? <PanelLeftOpen size={20} aria-hidden="true"/> : <PanelLeftClose size={20} aria-hidden="true"/>}</button>{sidebar}</aside>
    <div className="lingora-mobile-header"><Link to="/home"><img src={brandIcon} alt="" onError={e => { if (e.currentTarget.getAttribute('src') !== fallbackBrandIcon) e.currentTarget.src = fallbackBrandIcon; }}/>HSK Study KE</Link><button ref={menu} aria-label="Open navigation" aria-expanded={open} onClick={() => { drawer.current?.showModal(); setOpen(true); }}><Menu size={23}/></button></div>
    <dialog ref={drawer} className="lingora-mobile-drawer" aria-label="Navigation" onClose={() => { setOpen(false); menu.current?.focus(); }} onClick={e => { if (e.target === e.currentTarget) e.currentTarget.close(); }}><button className="lingora-drawer-close" aria-label="Close navigation" onClick={() => drawer.current?.close()}><X size={22}/></button>{sidebar}</dialog>
    <div className={pathname === '/home' ? 'lingora-main' : 'lingora-main lingora-inner-page'}>{storageError && <p role="alert" className="student-error">{storageError}</p>}{pathname !== '/home' && pathname !== '/quiz' && <StudyHeader key={pathname}/>} {children}</div>
    <nav className="lingora-bottom-nav" aria-label="Mobile navigation">{[
      { to: '/home', name: 'Home', icon: Home },
      { to: '/classroom', name: 'Learn', icon: BookOpen },
      { to: '/practice', name: 'Practice', icon: PenLine },
      { to: '/stats', name: 'Progress', icon: ChartNoAxesColumnIncreasing },
      { to: '/profile', name: 'Profile', icon: UserRound },
    ].map(({ to, name, icon: Icon }) => <NavLink key={to} to={to}><Icon size={23}/><span>{name}</span></NavLink>)}</nav>
  </div>;
};
export default AppLayout;
