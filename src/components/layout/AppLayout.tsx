import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, BookOpen, ChartNoAxesColumnIncreasing, Check, Home, Menu, MessageSquare, Moon, NotebookPen, PenLine, Settings, Sun, Target, UserRound, X } from 'lucide-react';
import { useLearning, useStorageError } from '../../data/learningStore';
import { currentTheme, setTheme } from '../../data/theme';
import './appLayout.css';
import '../../styles/typography.css';

const navigation = [
  { to: '/home', name: 'Home', icon: Home },
  { to: '/classroom', name: 'Learn', icon: BookOpen },
  { to: '/whiteboard', name: 'Practice', icon: PenLine },
  { to: '/quiz', name: 'Challenges', icon: Target },
  { to: '/stats', name: 'Progress', icon: ChartNoAxesColumnIncreasing },
  { to: '/chats', name: 'Conversations', icon: MessageSquare },
  { to: '/reading', name: 'Library', icon: NotebookPen },
];
export const AppLayout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const data = useLearning();
  const storageError = useStorageError();
  const [online, setOnline] = useState(navigator.onLine);
  const [theme, updateTheme] = useState(currentTheme);
  const [open, setOpen] = useState(false);
  const drawer = useRef<HTMLDialogElement>(null);
  const menu = useRef<HTMLButtonElement>(null);
  const name = data.profile.name.trim() || 'Your profile';
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update); window.addEventListener('offline', update);
    return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update); };
  }, []);
  useEffect(() => { drawer.current?.close(); setOpen(false); }, [pathname]);
  if (pathname === '/' || pathname === '/whiteboard') return <>{children}</>;
  const sidebar = <>
    <Link to="/home" className="lingora-brand"><img src="/lingora/logo-picture.png" alt=""/><span><b>HSK Study KE</b><small>Learn · Practice · Speak</small></span></Link>
    <nav className="lingora-nav" aria-label="Main navigation">{navigation.map(({ to, name, icon: Icon }) => <NavLink key={to} to={to}><Icon size={20}/><span>{name}</span></NavLink>)}</nav>
    <nav className="lingora-mobile-tools" aria-label="More study tools"><Link to="/translate">Translation tutor</Link><Link to="/notes">Study notes</Link><Link to="/notifications">Study reminders</Link></nav>
    <div className="lingora-sidebar-bottom"><Link className="lingora-side-promo" to="/schedule-detail"><b><Target size={19}/> A little every day</b><p>Make room for your next adventure. Plan a study session.</p><span className="lingora-button">Your schedule <ArrowRight size={14}/></span><img src="/lingora/plus-picture.png" alt=""/></Link>
    <button className="lingora-theme" onClick={() => { const next = theme === 'dark' ? 'light' : 'dark'; setTheme(next); updateTheme(next); }}>{theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>} {theme === 'dark' ? 'Light' : 'Dark'} mode</button>
    <Link to="/profile" className="lingora-profile"><span className="lingora-avatar">{data.profile.name.trim().slice(0, 1).toUpperCase() || '你'}</span><span><b>{name}</b><small>Learning Chinese</small></span><Settings size={16}/></Link>
    <p className="lingora-device" role="status"><Check size={12}/>{online ? 'Saved on this device' : 'Offline · keep practising'}</p></div>
  </>;
  return <div className={`lingora-app${pathname === '/home' ? ' is-home' : ''}${pathname === '/quiz' ? ' is-quiz' : ''}`}>
    <aside className="lingora-sidebar">{sidebar}</aside>
    <div className="lingora-mobile-header"><Link to="/home"><img src="/lingora/logo-picture.png" alt=""/>HSK Study KE</Link><button ref={menu} aria-label="Open navigation" aria-expanded={open} onClick={() => { drawer.current?.showModal(); setOpen(true); }}><Menu size={23}/></button></div>
    <dialog ref={drawer} className="lingora-mobile-drawer" aria-label="Navigation" onClose={() => { setOpen(false); menu.current?.focus(); }} onClick={e => { if (e.target === e.currentTarget) e.currentTarget.close(); }}><button className="lingora-drawer-close" aria-label="Close navigation" onClick={() => drawer.current?.close()}><X size={22}/></button>{sidebar}</dialog>
    <div className={pathname === '/home' ? 'lingora-main' : 'lingora-main lingora-inner-page'}>{storageError && <p role="alert" className="student-error">{storageError}</p>}{children}</div>
    <nav className="lingora-bottom-nav" aria-label="Mobile navigation">{[
      { to: '/home', name: 'Home', icon: Home },
      { to: '/classroom', name: 'Learn', icon: BookOpen },
      { to: '/whiteboard', name: 'Practice', icon: PenLine },
      { to: '/stats', name: 'Progress', icon: ChartNoAxesColumnIncreasing },
      { to: '/profile', name: 'Profile', icon: UserRound },
    ].map(({ to, name, icon: Icon }) => <NavLink key={to} to={to}><Icon size={23}/><span>{name}</span></NavLink>)}</nav>
  </div>;
};
export default AppLayout;
