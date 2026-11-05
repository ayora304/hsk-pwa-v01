import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowRight, Coffee, ShoppingBag, MapPin, UserRound } from 'lucide-react';
import { useLearning, updateLearning, newId, saveError } from '../../data/learningStore';
import { SCENARIOS, encodeLine, scenarioForId } from './scenarios';
import './conversations.css';
const icons = [UserRound, Coffee, ShoppingBag, MapPin];
export const ChatsPage = () => {
  const data = useLearning(); const navigate = useNavigate();
  const [mode, setMode] = useState('Scenarios'); const [title, setTitle] = useState(''); const [error, setError] = useState('');
  function create(scenarioId?: string, event?: FormEvent) {
    event?.preventDefault(); const scenario = SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario && !title.trim()) return;
    const id = scenario ? `guided:${scenario.id}:${newId()}` : newId(); const now = Date.now();
    try { updateLearning(s => ({ ...s, conversations: [{ id, title: scenario?.title ?? title.trim(), updatedAt: now }, ...s.conversations], messages: scenario ? [...s.messages, { id: newId(), chatId: id, text: encodeLine('Tutor', scenario.steps[0].prompt), createdAt: now }] : s.messages })); navigate('/chats/' + encodeURIComponent(id)); } catch (e) { setError(saveError(e)); }
  }
  return <div className="study-page conversation-page"><header className="study-header"><div><p className="conversation-eyebrow">CONVERSATIONS</p><h1>Practice real Chinese</h1><p className="study-muted">Build confidence, one conversation at a time.</p></div><MessageCircle size={42} aria-hidden="true" /></header>
    <div className="study-tabs" aria-label="Conversation modes">{['AI Chat', 'Scenarios', 'Role-play', 'Community'].map(tab => <button key={tab} aria-pressed={mode === tab} onClick={() => setMode(tab)}>{tab}</button>)}</div>
    {error && <p role="alert">{error}</p>}
    {(mode === 'Scenarios' || mode === 'Role-play') ? <><div><h2>{mode === 'Role-play' ? 'Choose a role to practice' : 'Everyday moments. Real confidence.'}</h2><p className="study-muted">Guided scripted dialogues · beginner vocabulary · saved on this device. Choose a reply to explore a branch; this is not live AI.</p></div><div className="conversation-scenarios">{SCENARIOS.map((scenario, i) => { const Icon = icons[i]; return <article className={`study-card conversation-scenario tone-${i}`} key={scenario.id}><span className="conversation-icon"><Icon size={25}/></span><small>BEGINNER · GUIDED {mode === 'Role-play' ? 'ROLE-PLAY' : 'SCENARIO'}</small><h3>{scenario.title}</h3><p>{scenario.goal}</p><button className="study-button" onClick={() => create(scenario.id)}>Start conversation <ArrowRight size={16}/></button></article>; })}</div></> : <section className="study-card"><h2>{mode === 'AI Chat' ? 'AI tutor is not connected' : 'Community connection is unavailable'}</h2><p className="study-muted">{mode === 'AI Chat' ? 'There is no conversational AI endpoint configured. Try a guided scenario or keep a local practice transcript below.' : 'Live Discord channels, participants and messages are not available here. Existing Discord integration is unchanged; no messages are sent from this screen.'}</p><button className="study-button primary" onClick={() => setMode('Scenarios')}>Explore guided scenarios</button></section>}
    <section className="study-card"><h2>Your saved conversations</h2><p className="study-muted">Resume a guided session or review your personal study transcripts.</p><form className="conversation-create" onSubmit={e => create(undefined, e)}><input className="study-field" aria-label="New conversation title" placeholder="Name a personal study transcript" value={title} maxLength={100} onChange={e => setTitle(e.target.value)} required/><button className="study-button primary">Create transcript</button></form><div className="conversation-sessions">{data.conversations.length ? data.conversations.map(chat => <Link key={chat.id} to={'/chats/' + encodeURIComponent(chat.id)}><span><strong>{chat.title}</strong><small>{scenarioForId(chat.id) ? 'Guided scenario' : 'Personal transcript'} · {data.messages.filter(m => m.chatId === chat.id).length} messages · {new Date(chat.updatedAt).toLocaleDateString()}</small></span><ArrowRight size={18}/></Link>) : <p className="study-empty">Your first conversation starts here. Pick a scenario above.</p>}</div></section>
  </div>;
};
export default ChatsPage;
