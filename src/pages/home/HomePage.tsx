import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bell, BookOpen, Check, ChevronDown, ChevronRight, Flame, Gem, GraduationCap, Languages, NotebookPen, PenLine, Play, Search, Target, Trophy, X, MessageCircle, Library } from 'lucide-react';
import { useLearning } from '../../data/learningStore';
import { learningStats } from '../../data/learningState';
import { STORIES } from '../../data/stories';
import './home.css';

const tools = [
  { title: 'Handwriting', detail: 'Make your mark', to: '/whiteboard', icon: PenLine, color: 'purple' },
  { title: 'Translation', detail: 'Your online tutor', to: '/translate', icon: Languages, color: 'pink' },
  { title: 'Vocabulary', detail: 'Everyday Chinese', to: '/quiz', icon: GraduationCap, color: 'green' },
  { title: 'Reading', detail: 'Stories to explore', to: '/reading', icon: BookOpen, color: 'orange' },
];
const destinations = [...tools,
  { title: 'Study library', detail: 'Your learning resources', to: '/classroom' },
  { title: 'Study notes', detail: 'Your personal notebook', to: '/notes' },
  { title: 'Progress', detail: 'Your practice so far', to: '/stats' },
  { title: 'Study schedule', detail: 'Make time for Chinese', to: '/schedule-detail' },
];
function initialGoal() {
  try { const n = Number(localStorage.getItem('hsk-daily-goal')); return [5, 10, 15, 20, 30].includes(n) ? n : 20; } catch { return 20; }
}

export const HomePage = () => {
  const data = useLearning();
  const stats = learningStats(data);
  const [query, setQuery] = useState('');
  const [goal, setGoal] = useState(initialGoal);
  const [goalError, setGoalError] = useState('');
  const [now, setNow] = useState(() => new Date());
  const goalDialog = useRef<HTMLDialogElement>(null);
  const name = data.profile.name.trim() || 'learner';
  const minutes = Math.floor(data.attempts.filter(a => new Date(a.createdAt).toDateString() === now.toDateString()).reduce((n, a) => n + a.seconds, 0) / 60);
  const progress = Math.min(100, minutes / goal * 100);
  const completedDays = new Set([...data.attempts, ...data.reviews].map(a => new Date(a.createdAt).toDateString()));
  const week = Array.from({ length: 7 }, (_, i) => { const d = new Date(now); d.setDate(d.getDate() - (d.getDay() + 6) % 7 + i); return d; });
  const latest = [...data.attempts].sort((a, b) => b.createdAt - a.createdAt)[0];
  const results = [...destinations, ...STORIES.map(s => ({ title: s.english, detail: `${s.title} · HSK ${s.level}`, to: `/reading?story=${s.id}` }))].filter(item => `${item.title} ${item.detail}`.toLowerCase().includes(query.trim().toLowerCase()));
  const milestone = (Math.floor(stats.quizCount / 5) + 1) * 5;
  const milestoneProgress = stats.quizCount % 5;
  useEffect(() => {
    const title = document.title; document.title = 'Your dashboard · HSK Study KE';
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => { document.title = title; window.clearInterval(timer); };
  }, []);

  return <div className="lingora-dashboard">
    <header className="lingora-topbar">
      <div className="lingora-search-wrap">
        <label className="lingora-search"><Search size={18} /><input type="search" aria-label="Search lessons and study tools" placeholder="Search lessons, stories, study tools..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Escape') setQuery(''); }} /></label>
        {query.trim() && <div className="lingora-search-results"><div className="lingora-search-caption">YOUR STUDY SPACE <button aria-label="Close search results" onClick={() => setQuery('')}><X size={16} /></button></div>{results.length ? results.map(item => <Link key={item.to} to={item.to} onClick={() => setQuery('')}><span><b>{item.title}</b><small>{item.detail}</small></span><ChevronRight size={16} /></Link>) : <p role="status">No matches. Try “vocabulary” or “story”.</p>}</div>}
      </div>
      <div className="lingora-top-stats"><Link to="/stats" title="Practice streak"><Flame className="flame" size={23}/><b>{stats.streak}</b><span className="sr-only"> day streak</span></Link><Link to="/stats" title="Diamonds · earn 10 for every completed quiz"><Gem className="lingora-diamond" size={24} aria-hidden="true"/><b>{data.wallet.diamonds}</b><span className="sr-only"> diamonds</span></Link><Link className="lingora-bell" to="/notifications" aria-label="Notifications"><Bell size={22}/></Link></div>
    </header>

    <div className="lingora-columns"><main className="lingora-content">
      <section className="lingora-hero">
        <picture>
          <source media="(min-width:701px)" srcSet="/lingora/hero-panda-wide.png" />
          <img className="lingora-hero-art lingora-hero-panda" src="/lingora/hero-panda.png" alt="A cheerful panda explorer beside a Chinese pavilion and river" />
        </picture>
        <Link className="lingora-language" to="/classroom"><span>汉</span> Learning Chinese <ChevronDown size={14}/></Link>
        <div className="lingora-hero-copy"><h1>{now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening'},<br/><span>{name}!</span></h1><p className="lingora-desktop-greeting">One lesson closer to<br/>your next adventure!</p><p className="lingora-mobile-greeting">Let's learn something new today!</p><Link className="lingora-button" to={latest ? '/quiz' : '/classroom'}>Continue Learning <ArrowRight size={17}/></Link></div>
      </section>
      <section className="lingora-mobile-path"><h2>Your Path</h2><div>{[
        { title: 'Basics', to: '/quiz', icon: MessageCircle },
        { title: 'Reading', to: '/reading', icon: BookOpen },
        { title: 'Vocabulary', to: '/quiz', icon: GraduationCap },
        { title: 'Library', to: '/classroom', icon: Library },
      ].map(({ title, to, icon: Icon }) => <Link key={title} to={to}><span><Icon size={25}/></span><b>{title}</b></Link>)}</div></section>
      <section className="lingora-section lingora-continue-section"><div className="lingora-section-heading"><h2>Recent Activity</h2><Link to="/classroom">See All <ChevronRight size={14}/></Link></div>
        <div className="lingora-lesson"><span className="lesson-mobile-icon"><BookOpen size={24}/></span><img src="/lingora/lesson-picture.png" alt="Illustrated city and travel landmarks"/><div className="lingora-lesson-info"><h3>{latest ? 'Vocabulary Review' : 'Everyday Chinese'}</h3><p>{latest ? `${latest.correct} of ${latest.total} correct in your last quiz` : 'HSK 1 · Build your foundations'}</p><div className="lingora-progress-line"><progress max="100" value={stats.accuracy ?? 0} aria-label="Overall quiz accuracy"/><b>{stats.accuracy === null ? 'New' : `${stats.accuracy}%`}</b></div></div><Link className="lingora-button lesson-start" to="/quiz"><Play className="lesson-play" size={15} fill="currentColor"/><ChevronRight className="lesson-chevron" size={19}/> {latest ? 'Review' : 'Start'}</Link></div>
      </section>
      <section className="lingora-section lingora-skills-section"><div className="lingora-section-heading"><h2>Build Your Skills</h2></div><div className="lingora-skills">{tools.map(({ title, detail, to, icon: Icon, color }) => <Link key={title} className={`lingora-skill ${color}`} to={to}><span className="lingora-skill-icon"><Icon size={23}/></span><span><b>{title}</b><small>{detail}</small></span><ArrowRight size={13} className="skill-arrow"/></Link>)}</div></section>
      <section className="lingora-section lingora-resources-section"><div className="lingora-section-heading"><h2>Your Study Space</h2><Link to="/classroom">Explore <ChevronRight size={14}/></Link></div><div className="lingora-resources">{[
        { title: 'Study notes', detail: `${data.notes.length} saved`, to: '/notes', icon: NotebookPen },
        { title: 'Reading library', detail: `${STORIES.length} short stories`, to: '/reading', icon: BookOpen },
        { title: 'Study schedule', detail: `${data.schedules.filter(s => !s.completed).length} upcoming`, to: '/schedule-detail', icon: Target },
      ].map(({ title, detail, to, icon: Icon }) => <Link key={title} to={to}><span className="lingora-resource-icon"><Icon size={20}/></span><span><b>{title}</b><small>{detail}</small></span><ChevronRight size={14}/></Link>)}</div></section>
      <p className="lingora-footer">A little practice. A world of possibilities.</p>
    </main>
    <aside className="lingora-right" aria-label="Your learning progress">
      <section className="lingora-card"><div className="lingora-card-heading"><h2>Your Daily Goal</h2><button onClick={() => goalDialog.current?.showModal()}>Edit <ChevronRight size={13}/></button></div><div className="lingora-goal"><div className="lingora-ring" role="progressbar" aria-label="Daily quiz practice goal" aria-valuemin={0} aria-valuemax={goal} aria-valuenow={Math.min(minutes, goal)} ><svg className="lingora-ring-chart" viewBox="0 0 120 120" aria-hidden="true"><circle className="goal-ring-track" cx="60" cy="60" r="52"/><circle className="goal-ring-fill" cx="60" cy="60" r="52" pathLength="100" strokeDasharray={`${progress} 100`} opacity={progress ? 1 : 0}/></svg><div><Flame className="goal-ring-flame" size={23} aria-hidden="true"/><b>{minutes} <small>/ {goal} min</small></b><span>Today</span></div></div><div className="lingora-goal-copy"><b>{progress >= 100 ? 'Goal complete!' : minutes > 0 ? 'Great job!' : 'A fresh start!'}</b><p>{stats.streak ? `You're on a ${stats.streak} day streak.` : 'Your next adventure starts today.'}</p></div></div><div className="lingora-days">{week.map(d => { const done = completedDays.has(d.toDateString()); return <div key={d.toISOString()} className={done ? 'done' : ''} title={`${d.toLocaleDateString()}: ${done ? 'Practised' : 'No practice saved'}`}><span>{done && <Check size={11}/>}</span>{d.toLocaleDateString('en', { weekday: 'short' })}</div>; })}</div><p className="lingora-goal-note">Minutes from completed vocabulary quizzes.</p></section>
      <section className="lingora-card"><div className="lingora-card-heading"><h2>Your Progress</h2><Link to="/stats" className="lingora-pill">All time <ChevronRight size={12}/></Link></div><div className="lingora-progress-rows">{[
        { label: 'Quizzes completed', value: stats.quizCount, icon: Trophy, color: 'gold' },
        { label: 'Words practised', value: stats.words, icon: GraduationCap, color: 'blue' },
        { label: 'Handwriting reviews', value: stats.reviews, icon: PenLine, color: 'purple' },
        { label: 'Quiz accuracy', value: stats.accuracy === null ? '—' : `${stats.accuracy}%`, icon: Target, color: 'green' },
      ].map(({ label, value, icon: Icon, color }) => <Link key={label} to="/stats"><span className={`lingora-stat-icon ${color}`}><Icon size={17}/></span><span>{label}</span><b>{value}</b></Link>)}</div><Link className="lingora-progress-link" to="/stats">See your learning journey <ArrowRight size={14}/></Link></section>
      <Link className="lingora-reward" to="/quiz"><div className="lingora-reward-content"><img src="/lingora/gift-reward.png" alt="A purple gift with a golden ribbon"/><p>Complete {milestone - stats.quizCount} more {milestone - stats.quizCount === 1 ? 'quiz' : 'quizzes'} to reach<b>Your next milestone!</b></p></div><div className="lingora-reward-progress"><progress max={5} value={milestoneProgress} aria-label="Next five-quiz milestone"/><span>{milestoneProgress} / 5</span><span className="lingora-reward-arrow"><ChevronRight size={19}/></span></div></Link>
    </aside></div>
    <dialog className="lingora-dialog" ref={goalDialog} aria-labelledby="daily-goal-title" onClick={e => { if (e.target === e.currentTarget) e.currentTarget.close(); }}><div className="lingora-card-heading"><h2 id="daily-goal-title">Make time for Chinese</h2><button aria-label="Close daily goal" onClick={() => goalDialog.current?.close()}><X size={20}/></button></div><p>Choose a daily vocabulary practice goal.</p><form onSubmit={e => { e.preventDefault(); const value = Number(new FormData(e.currentTarget).get('goal')); try { localStorage.setItem('hsk-daily-goal', String(value)); setGoal(value); setGoalError(''); goalDialog.current?.close(); } catch { setGoalError('Your goal could not be saved. Device storage is unavailable.'); } }}><label>Daily goal<select name="goal" defaultValue={goal}>{[5, 10, 15, 20, 30].map(n => <option key={n} value={n}>{n} minutes</option>)}</select></label>{goalError && <p role="alert">{goalError}</p>}<button className="lingora-button">Save goal <Check size={16}/></button></form></dialog>
  </div>;
};





