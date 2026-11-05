import { Link } from 'react-router-dom';
import { Award, Flag, Trophy } from 'lucide-react';
import { useLearning } from '../../data/learningStore';
import { QUIZ_DIAMOND_REWARD } from '../../data/learningState';
import { challengeProgress, weekStart } from '../stats/progressMetrics';
import './challenges.css';

export function ChallengesPage() {
  const data = useLearning();
  const now = Date.now();
  const challenges = challengeProgress(data, now);
  const earned = challenges.filter(challenge => challenge.count >= challenge.goal);
  const featured = challenges[0];
  return <div className="study-page challenges-page">
    <header className="study-header"><div><p className="study-muted">Small missions, meaningful practice</p><h1>Your next challenge</h1><p>Build your Chinese with goals based on the work you save on this device.</p></div><Trophy size={36} aria-hidden="true"/></header>
    <section className="study-card challenges-featured" aria-labelledby="weekly-title"><div><p className="study-muted"><Flag size={16} aria-hidden="true"/> This week · from {new Date(weekStart(now)).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p><h2 id="weekly-title">{featured.title}</h2><p>{featured.description}</p><p className="study-muted">Monday–Sunday, using your device’s local time. A new week starts a fresh mission.</p></div><div><strong>{Math.min(featured.count, featured.goal)} / {featured.goal} days</strong><progress className="study-progress" max={featured.goal} value={Math.min(featured.count, featured.goal)} aria-label="Weekly active study days"/><Link className="study-button primary" to={featured.href}>{featured.count >= featured.goal ? 'Keep practising' : featured.count ? 'Continue mission' : 'Start mission'}</Link></div></section>
    <section aria-labelledby="missions-title"><h2 id="missions-title">Choose your mission</h2><div className="study-grid">{challenges.slice(1).map(challenge => <article className="study-card challenges-mission" key={challenge.id}><div className="challenges-mission-heading"><Award size={23} aria-hidden="true"/><span className="challenges-status">{challenge.count >= challenge.goal ? 'Completed' : challenge.count ? 'In progress' : 'Available'}</span></div><h3>{challenge.title}</h3><p>{challenge.description}</p><small className="study-muted">{challenge.weekly ? 'Weekly mission' : 'Starter mission · all time'}</small><progress className="study-progress" max={challenge.goal} value={Math.min(challenge.count, challenge.goal)} aria-label={`${challenge.title} progress`}/><p>{Math.min(challenge.count, challenge.goal)} / {challenge.goal} completed</p><Link className="study-button" to={challenge.href}>{challenge.count >= challenge.goal ? 'Practise again' : challenge.count ? 'Continue' : 'Start challenge'}</Link></article>)}</div></section>
    <section className="study-card" aria-labelledby="badges-title"><h2 id="badges-title">Earned badges</h2>{earned.length ? <ul className="challenges-badges">{earned.map(challenge => <li key={challenge.id}><Award size={22} aria-hidden="true"/><span>{challenge.title}<small>{challenge.weekly ? 'Current week' : 'Starter badge'}</small></span></li>)}</ul> : <div className="study-empty">Your first badge is one completed mission away. Try First steps to begin.</div>}<p className="study-muted">Badges reflect the qualifying records currently saved on this device. Weekly badges are shown for the current week.</p></section>
    <aside className="study-card"><h2>How rewards work</h2><p>Anyone can join these local missions. Save completed activities to make progress; opening a mission awards nothing. Challenges add badges only, with no extra points or diamonds. Completed quizzes keep the existing {QUIZ_DIAMOND_REWARD}-diamond reward, once per saved quiz result.</p><Link className="study-button" to="/stats">See your progress</Link></aside>
  </div>;
}
export default ChallengesPage;
