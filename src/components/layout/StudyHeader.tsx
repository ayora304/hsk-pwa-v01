import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronRight, Flame, Gem, Search, X } from 'lucide-react';
import { useLearning } from '../../data/learningStore';
import { learningStats } from '../../data/learningState';
import { STORIES } from '../../data/stories';
import './studyHeader.css';

const tools = [
  { title:'Lessons and HSK levels',detail:'Browse your learning space',to:'/classroom' },
  { title:'Practice workspace',detail:'Whiteboard and printable notebook',to:'/practice' },
  { title:'Practice exercises',detail:'Vocabulary, listening and reading exercises',to:'/practice/exercises' },
  { title:'Handwriting',detail:'Chinese character whiteboard',to:'/whiteboard' },
  { title:'Challenges',detail:'Missions based on your practice',to:'/challenges' },
  { title:'Progress',detail:'Your recorded learning activity',to:'/stats' },
  { title:'Conversations',detail:'Guided Chinese dialogues',to:'/chats' },
  { title:'Library',detail:'Notes, stories and saved resources',to:'/library' },
  { title:'Study notes',detail:'Your personal notebook',to:'/notes' },
];
export function StudyHeader() {
  const data=useLearning();
  const stats=learningStats(data);
  const [query,setQuery]=useState('');
  const items=[...tools,...STORIES.map(s=>({title:s.english,detail:`${s.title} · HSK ${s.level}`,to:`/reading?story=${s.id}`})),...data.notes.map(n=>({title:n.title,detail:`Note · ${n.tag}`,to:'/notes'}))];
  const results=items.filter(x=>`${x.title} ${x.detail}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0,8);
  return <header className="study-global-header"><div className="study-global-search-wrap"><label className="study-global-search"><Search size={20}/><input type="search" aria-label="Search study pages, stories and notes" placeholder="Search lessons, words, grammar, notes..." value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==='Escape')setQuery('');}}/></label>{query.trim()&&<div className="study-global-results"><div><b>YOUR STUDY SPACE</b><button type="button" aria-label="Close search results" onClick={()=>setQuery('')}><X size={18}/></button></div>{results.length?results.map((item,i)=><Link key={`${item.to}-${i}`} to={item.to} onClick={()=>setQuery('')}><span><b>{item.title}</b><small>{item.detail}</small></span><ChevronRight size={16}/></Link>):<p role="status">No matches. Try a topic or study tool.</p>}</div>}</div><div className="study-global-stats"><Link to="/stats" aria-label={`${stats.streak} day streak`}><Flame size={23} className="study-global-flame"/><b>{stats.streak}</b></Link><Link to="/stats" aria-label={`${data.wallet.diamonds} diamonds`}><Gem size={24} className="study-global-gem"/><b>{data.wallet.diamonds}</b></Link><Link to="/notifications" aria-label="Notifications"><Bell size={23}/></Link></div></header>;
}
