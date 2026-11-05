import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, ChartNoAxesColumnIncreasing } from 'lucide-react';
import { useLearning } from '../../data/learningStore';
import { LESSONS, HSK_LEVELS, CURRICULUM_DESCRIPTION } from '../../data/curriculum';
import { learningStats } from '../../data/learningState';
import { activityDays, challengeProgress } from './progressMetrics';
import './stats.css';

export const StatsPage = () => {
  const data = useLearning();
  const [period, setPeriod] = useState(7);
  const now = Date.now();
  const stats = learningStats(data, now);
  const completions = new Set((data.lessonCompletions ?? []).map(item => item.lessonId));
  const days = activityDays(data, period, now);
  const start = new Date(now); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - period + 1);
  const attempts = data.attempts.filter(a => a.createdAt >= start.getTime() && a.createdAt <= now);
  const reviews = data.reviews.filter(r => r.createdAt >= start.getTime() && r.createdAt <= now);
  const skills = [...new Set(attempts.map(a => a.skill || 'Vocabulary'))].map(skill => {
    const records = attempts.filter(a => (a.skill || 'Vocabulary') === skill);
    const correct = records.reduce((sum, a) => sum + a.correct, 0);
    const total = records.reduce((sum, a) => sum + a.total, 0);
    return { skill, count: records.length, accuracy: total ? Math.round(correct / total * 100) : null, correct, total };
  });
  const weak = skills.filter(skill => skill.accuracy !== null && skill.accuracy < 80).sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0));
  const reviewNeeds = reviews.filter(r => r.score !== null && r.score < 70).slice(-5).reverse();
  const badges = challengeProgress(data, now).filter(challenge => challenge.count >= challenge.goal);
  const maxActivity = Math.max(1, ...days.map(day => day.total));
  const activeDays = days.filter(day => day.total > 0).length;
  const totalActivity = days.reduce((sum, day) => sum + day.total, 0);
  return <div className="study-page progress-page">
    <header className="study-header"><div><p className="study-muted">Your effort, made visible</p><h1>Your progress</h1><p>Real activity saved on this device, one session at a time.</p></div><ChartNoAxesColumnIncreasing size={36} aria-hidden="true"/></header>
    <section aria-label="All-time learning totals" className="study-grid progress-metrics">{[
      ['Lessons completed', LESSONS.filter(lesson => completions.has(lesson.id)).length],
      ['Words answered correctly', stats.words], ['Quiz accuracy', stats.accuracy === null ? '—' : `${stats.accuracy}%`],
      ['Handwriting reviews', stats.reviews], ['Quiz time recorded', `${stats.minutes} min`], ['Practice streak', `${stats.streak} days`],
    ].map(([label, value]) => <article className="study-card" key={label}><p className="study-muted">{label}</p><strong className="progress-metric-value">{value}</strong><small className="study-muted">All time</small></article>)}</section>
    <p className="study-muted progress-definitions">Words are unique expressions answered correctly, not a mastery score. Accuracy is correct answers ÷ all quiz answers. Time includes saved quiz duration only; reading and handwriting time are not tracked. The streak counts saved quizzes and handwriting reviews.</p>
    {!data.attempts.length && !data.reviews.length && !completions.size && <section className="study-card study-empty"><h2>A fresh start</h2><p>Your first saved activity will appear here. There is no history to estimate yet.</p><Link className="study-button primary" to="/practice">Start practising</Link></section>}
    <section className="study-card" aria-labelledby="activity-title"><div className="progress-section-heading"><div><h2 id="activity-title">Study activity</h2><p className="study-muted">{totalActivity} saved activities across {activeDays} active days in the last {period} days.</p></div><label className="study-field">Period<select value={period} onChange={event => setPeriod(Number(event.target.value))}><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option></select></label></div>
      <div className="progress-chart" role="img" aria-label={`Saved activities over the last ${period} days: ${totalActivity} activities on ${activeDays} days. Exact daily counts are in the table below.`}>{days.map(day => <div className="progress-chart-column" key={day.key} title={`${day.label}: ${day.total} saved activities`}><span style={{ height: `${day.total / maxActivity * 100}%` }}/></div>)}</div><div className="progress-chart-labels" aria-hidden="true"><span>{days[0].label}</span><span>{days[days.length - 1].label}</span></div>
      <details className="progress-data"><summary>Daily activity data and chart definitions</summary><p className="study-muted">Each saved quiz result, handwriting review, or lesson completion counts as one activity. A quiz that completes a lesson records both events. Dates use your local time; zero means no saved activity.</p><div className="progress-table-wrap"><table><caption>Saved activity by day</caption><thead><tr><th scope="col">Date</th><th scope="col">Quizzes</th><th scope="col">Handwriting</th><th scope="col">Lessons</th><th scope="col">Total</th></tr></thead><tbody>{days.map(day => <tr key={day.key}><th scope="row">{day.key}</th><td>{day.practice}</td><td>{day.handwriting}</td><td>{day.lessons}</td><td>{day.total}</td></tr>)}</tbody></table></div></details>
    </section>
    <div className="study-grid"><section className="study-card" aria-labelledby="skills-title"><h2 id="skills-title">Skill breakdown</h2><p className="study-muted">Saved results in the selected {period}-day period. Earlier untagged quizzes count as Vocabulary.</p>{skills.length ? <ul className="progress-skill-list">{skills.map(skill => <li key={skill.skill}><div><strong>{skill.skill}</strong><span>{skill.count} {skill.count === 1 ? 'quiz' : 'quizzes'} · {skill.accuracy === null ? '—' : `${skill.accuracy}% accuracy`}</span></div><progress className="study-progress" max={100} value={skill.accuracy ?? 0} aria-label={`${skill.skill}: ${skill.correct} correct out of ${skill.total} answers`}/></li>)}</ul> : <p className="study-empty">No saved quiz results in this period.</p>}<p className="study-muted">Handwriting reviews: {reviews.length}. Reviews use a separate score and are not included in quiz accuracy.</p></section>
    <section className="study-card" aria-labelledby="next-title"><h2 id="next-title">What to practise next</h2>{weak.length || reviewNeeds.length ? <><p className="study-muted">Areas below 80% quiz accuracy or handwriting reviews below 70/100 in the selected period. Small samples may change quickly.</p><ul className="progress-next-list">{weak.map(skill => <li key={skill.skill}><strong>{skill.skill}: {skill.accuracy}%</strong><p>{skill.correct} of {skill.total} answers correct. Revisit an exercise and check each explanation.</p><Link className="study-button" to={`/practice?skill=${encodeURIComponent(skill.skill)}`}>Practise {skill.skill.toLowerCase()}</Link></li>)}{reviewNeeds.map(review => <li key={review.id}><strong lang="zh">{review.character}</strong> · {review.score}/100<p>{review.summary}</p><Link className="study-button" to="/whiteboard">Review handwriting</Link></li>)}</ul></> : <div className="study-empty"><p>{attempts.length || reviews.length ? 'No recorded area falls below these review thresholds in this period.' : 'Complete a practice session to get a recommendation from your results.'}</p><Link className="study-button" to="/practice">Explore practice</Link></div>}<p className="study-muted">Individual wrong answers are not stored, so we cannot identify missed vocabulary words or claim mastery.</p></section></div>
    <section className="study-card" aria-labelledby="levels-title"><h2 id="levels-title">Your local lesson collection</h2><p className="study-muted">{CURRICULUM_DESCRIPTION}. Completion below refers only to available local lessons, not official HSK course coverage.</p><div className="study-grid progress-levels">{HSK_LEVELS.map(level => { const lessons = LESSONS.filter(lesson => lesson.level === level); const completed = lessons.filter(lesson => completions.has(lesson.id)).length; return <article key={level}><h3>HSK {level}</h3><p>{completed} / {lessons.length} available lessons completed</p><progress className="study-progress" max={lessons.length || 1} value={completed} aria-label={`HSK ${level} local lessons completed`}/><Link className="study-button" to={`/classroom?level=${level}`}>View lessons</Link></article>; })}</div></section>
    <section className="study-card" aria-labelledby="achievements-title"><h2 id="achievements-title">Your achievements</h2>{badges.length ? <ul className="progress-achievements">{badges.map(badge => <li key={badge.id}><Award size={22} aria-hidden="true"/><span>{badge.title}<small>{badge.weekly ? 'Current weekly mission completed' : 'Starter mission completed'}</small></span></li>)}</ul> : <p className="study-empty">No badges earned yet. Complete your first mission to begin.</p>}<Link className="study-button" to="/challenges">View challenges</Link><p className="study-muted">Diamond balance: {data.wallet.diamonds}. Rewards come from saved completed quizzes.</p></section>
    <section className="study-card"><h2>Recent handwriting</h2>{data.reviews.length ? <ul className="progress-review-list">{data.reviews.slice(-5).reverse().map(review => <li key={review.id}><strong lang="zh">{review.character}</strong> · {review.score === null ? 'Not scored' : `${review.score}/100`} · <time dateTime={new Date(review.createdAt).toISOString()}>{new Date(review.createdAt).toLocaleDateString()}</time><p>{review.summary}</p></li>)}</ul> : <p className="study-muted">Save a handwriting review to see it here.</p>}</section>
  </div>;
};
export default StatsPage;

