import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpen, CalendarDays, Check, ChevronRight, Headphones, Layers, Mic, NotebookPen, PenLine, Play, Search, Type } from 'lucide-react';
import { useLearning } from '../../data/learningStore';
import { learningStats } from '../../data/learningState';
import { CURRICULUM_DESCRIPTION, LESSONS, lessonSkills } from '../../data/curriculum';
import { STORIES } from '../../data/stories';
import './classroom.css';

const levels = ['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced', 'Proficient'];
const tools = [
  { title: 'Write & Practice', detail: 'Practice Chinese characters', to: '/whiteboard', icon: PenLine, tone: 'purple' },
  { title: 'Vocabulary', detail: 'Learn and review words', to: '/practice?skill=Vocabulary', icon: BookOpen, tone: 'orange' },
  { title: 'Listening', detail: 'Listen and choose an answer', to: '/practice?skill=Listening', icon: Headphones, tone: 'green' },
  { title: 'Speaking', detail: 'Guided Chinese dialogues', to: '/chats', icon: Mic, tone: 'blue' },
  { title: 'Grammar', detail: 'Exercises coming soon', to: '', icon: Type, tone: 'pink' },
  { title: 'Flashcards', detail: 'Reveal and review words', to: '/practice?mode=flashcards', icon: Layers, tone: 'cyan' },
];
export function ClassroomPage() {
  const data = useLearning();
  const stats = learningStats(data);
  const [params] = useSearchParams();
  const requestedLevel = Number(params.get('level'));
  const [level, setLevel] = useState(requestedLevel >= 1 && requestedLevel <= 6 && Number.isInteger(requestedLevel) ? requestedLevel : data.profile.hskLevel || 1);
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('All');
  const [skill, setSkill] = useState('All');
  const [status, setStatus] = useState('All');
  const [allLevels, setAllLevels] = useState(false);
  const completed = new Set((data.lessonCompletions || []).map(c => c.lessonId));
  const levelLessons = LESSONS.filter(l => l.level === level);
  const latestAttempt = [...data.attempts].filter(a => a.lessonId && !completed.has(a.lessonId)).sort((a,b) => b.createdAt-a.createdAt)[0];
  const resume = LESSONS.find(l => l.id === latestAttempt?.lessonId) || levelLessons.find(l => !completed.has(l.id)) || levelLessons[0];
  const topics = [...new Set(LESSONS.map(l => l.topic))];
  const filtered = LESSONS.filter(l => (allLevels || l.level === level) && (topic === 'All' || l.topic === topic) && (skill === 'All' || lessonSkills(l).some(s => s === skill)) && (status === 'All' || (status === 'Completed' ? completed.has(l.id) : !completed.has(l.id))) && `${l.title} ${l.english} ${l.pinyin || ''} ${l.topic}`.toLowerCase().includes(query.trim().toLowerCase()));
  const today = new Date().toDateString();
  const plan = [
    { title: 'Complete a vocabulary or practice quiz', done: data.attempts.some(a => new Date(a.createdAt).toDateString() === today), to:'/practice/exercises' },
    { title: 'Finish one lesson exercise', done:(data.lessonCompletions || []).some(c => new Date(c.completedAt).toDateString() === today), to:resume ? `/lessons/${resume.id}` : '/classroom' },
    { title: 'Save one character review', done:data.reviews.some(r => new Date(r.createdAt).toDateString() === today), to:'/whiteboard' },
  ];
  const planDone = plan.filter(p => p.done).length;
  const upcoming = data.schedules.filter(s => !s.completed && new Date(s.startsAt).getTime() >= Date.now()).length;
  const resetBrowser = () => { setQuery(''); setTopic('All'); setSkill('All'); setStatus('All'); setAllLevels(true); };
  return <div className="learning-dashboard">
    <div className="learning-layout"><main className="learning-main-column">
      <div className="learning-heading"><div><span className="learning-kicker">LEARN</span><h1>Your learning space</h1><p>Study lessons, build vocabulary, and master Chinese step by step.</p></div><label className="learning-level-select"><span aria-hidden="true">汉</span><select aria-label="Choose your HSK level" value={level} onChange={e => {setLevel(Number(e.target.value));setAllLevels(false);}}>{levels.map((_,i) => <option value={i+1} key={i}>HSK {i+1} learner</option>)}</select></label></div>
      <article className="learning-resume learning-panel"><span className="learning-resume-art learning-story-art restaurant" aria-hidden="true"/><div className="learning-resume-copy"><span className="learning-eyebrow">{latestAttempt ? 'CONTINUE LEARNING' : 'YOUR NEXT LESSON'}</span><h2>{resume.title} · {resume.english}</h2>{resume.pinyin && <small lang="zh-Latn">{resume.pinyin}</small>}<p>HSK {resume.level} · {resume.skill}</p><progress max={levelLessons.length} value={levelLessons.filter(l => completed.has(l.id)).length} aria-label={`HSK ${level} lesson completion`}/><small>{levelLessons.filter(l => completed.has(l.id)).length} of {levelLessons.length} available lessons complete</small></div><Link className="learning-primary" to={`/lessons/${resume.id}`}>{latestAttempt ? 'Resume Lesson' : 'Start Lesson'} <ArrowRight size={19}/></Link></article>
      <p className="learning-curriculum-note">{CURRICULUM_DESCRIPTION}.</p>
      <section aria-labelledby="learning-levels-title"><div className="learning-section-heading"><h2 id="learning-levels-title">Explore HSK Levels</h2><button type="button" onClick={resetBrowser}>View all levels <ArrowRight size={17}/></button></div><div className="learning-levels">{levels.map((description,i) => <button key={description} type="button" className={`learning-level learning-level-${i+1}${!allLevels && level === i+1 ? ' selected' : ''}`} aria-pressed={!allLevels && level === i+1} onClick={() => {setLevel(i+1);setAllLevels(false);setTopic('All');setSkill('All');setStatus('All');}}><span className="learning-level-art" aria-hidden="true"/><b>HSK {i+1}</b><span>{description}</span>{!allLevels && level === i+1 && <Check className="learning-level-check" size={19}/>}<span className="learning-level-arrow"><ArrowRight size={19}/></span></button>)}</div></section>
      <section aria-labelledby="learning-browser-title"><div className="learning-section-heading"><h2 id="learning-browser-title">{allLevels ? 'Available Lessons' : `HSK ${level} · ${levels[level-1]}`}</h2><span className="learning-browser-count">{filtered.length} lessons</span></div>
        <div className="learning-filters"><label className="learning-lesson-search"><Search size={18}/><input type="search" aria-label="Search lessons" placeholder="Search lessons..." value={query} onChange={e=>setQuery(e.target.value)}/></label><label><span className="sr-only">Topic</span><select aria-label="Filter lessons by topic" value={topic} onChange={e=>setTopic(e.target.value)}><option value="All">All topics</option>{topics.map(t=><option key={t}>{t}</option>)}</select></label><label><span className="sr-only">Skill</span><select aria-label="Filter lessons by skill" value={skill} onChange={e=>setSkill(e.target.value)}>{['All','Vocabulary','Reading','Listening','Writing'].map(s=><option value={s} key={s}>{s==='All'?'All skills':s}</option>)}</select></label><label><span className="sr-only">Status</span><select aria-label="Filter lessons by status" value={status} onChange={e=>setStatus(e.target.value)}>{['All','Not completed','Completed'].map(s=><option value={s} key={s}>{s==='All'?'All statuses':s}</option>)}</select></label></div>
        <div className="learning-lesson-list">{filtered.map(lesson => <Link className="learning-lesson-row learning-panel" key={lesson.id} to={`/lessons/${lesson.id}`}><span className={`learning-lesson-symbol ${completed.has(lesson.id) ? 'done' : ''}`}>{completed.has(lesson.id)?<Check size={23}/>:<BookOpen size={23}/>}</span><span><b>{lesson.title} · {lesson.english}</b>{lesson.pinyin && <small>{lesson.pinyin}</small>}<small>HSK {lesson.level} · {lesson.topic} · {lessonSkills(lesson).join(' / ')}</small></span><span className="learning-lesson-state">{completed.has(lesson.id)?'Completed':'Open lesson'}<ChevronRight size={17}/></span></Link>)}</div>{!filtered.length && <p className="learning-empty">No lessons match these filters. <button type="button" onClick={resetBrowser}>Show all available lessons</button></p>}
      </section>
      <section aria-labelledby="learning-tools-title"><div className="learning-section-heading"><h2 id="learning-tools-title">Study Tools</h2><Link to="/practice/exercises">All activities <ArrowRight size={17}/></Link></div><div className="learning-tools">{tools.map(({title,detail,to,icon:Icon,tone})=>to?<Link className={`learning-tool learning-panel ${tone}`} key={title} to={to}><span className="learning-tool-icon"><Icon size={25}/></span><span><b>{title}</b><small>{detail}</small></span><ChevronRight size={16}/></Link>:<div className={`learning-tool learning-panel ${tone} learning-tool-unavailable`} key={title} aria-disabled="true"><span className="learning-tool-icon"><Icon size={25}/></span><span><b>{title}</b><small>{detail}</small></span></div>)}</div></section>
      <section aria-labelledby="learning-resources-title"><div className="learning-section-heading"><h2 id="learning-resources-title">Study Resources</h2><Link to="/library">Open library <ArrowRight size={17}/></Link></div><div className="learning-resources">{[{title:'Study notes',detail:`${data.notes.length} saved`,icon:NotebookPen,to:'/notes'},{title:'Reading library',detail:`${STORIES.length} short stories`,icon:BookOpen,to:'/reading'},{title:'Study schedule',detail:`${upcoming} upcoming`,icon:CalendarDays,to:'/schedule-detail'}].map(({title,detail,icon:Icon,to})=><Link className="learning-resource learning-panel blue" to={to} key={title}><span className="learning-tool-icon"><Icon size={26}/></span><span><b>{title}</b><small>{detail}</small></span><ChevronRight size={18}/></Link>)}</div></section>
    </main><aside className="learning-side-column" aria-label="Study plan and shortcuts">
      <section className="learning-plan learning-panel"><h2><CalendarDays size={23}/>Today's Study Plan</h2><ul>{plan.map(p=><li key={p.title}><Link to={p.to}><span className={p.done?'done':''}>{p.done&&<Check size={15}/>}</span><span>{p.title}</span></Link></li>)}</ul><progress max={3} value={planDone} aria-label="Today's study plan completion"/><p>{planDone} of 3 completed <b>{Math.round(planDone/3*100)}%</b></p><small>Updates from completed activity.</small></section>
      <section className="learning-panel learning-quick"><h2>Quick Practice</h2><div>{[{title:'Quiz',to:'/practice/exercises',icon:Play,tone:'blue'},{title:'Listening',to:'/practice?skill=Listening',icon:Headphones,tone:'green'},{title:'Speaking',to:'/chats',icon:Mic,tone:'purple'},{title:'Writing',to:'/whiteboard',icon:PenLine,tone:'orange'}].map(({title,to,icon:Icon,tone})=><Link key={title} to={to} className={tone}><span className="learning-tool-icon"><Icon size={25}/></span><b>{title}</b></Link>)}</div></section>
      <section className="learning-panel learning-journey"><div className="learning-section-heading"><h2>Your Learning Journey</h2><Link to="/stats" aria-label="View your learning progress"><ChevronRight size={20}/></Link></div><b>{completed.size} of {LESSONS.length}</b><p>Available lessons completed</p><progress max={LESSONS.length} value={completed.size} aria-label="Available lesson completion"/><small>{stats.words} words practised · {stats.accuracy===null?'No quiz results yet':`${stats.accuracy}% quiz accuracy`}</small></section>
      <Link className="learning-panel learning-saved" to="/library"><h2>Saved Resources <ChevronRight size={20}/></h2><p>{data.notes.length} notes · {data.notes.filter(n=>n.url).length} saved links</p></Link>
    </aside></div>
  </div>;
}
export default ClassroomPage;
