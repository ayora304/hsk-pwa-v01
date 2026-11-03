import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLearning, updateLearning, newId, saveError } from '../../data/learningStore';
export const ChatsPage: React.FC = () => {
  const data = useLearning(); const navigate = useNavigate(); const [title,setTitle] = useState(''); const [error,setError] = useState('');
  function create(event: React.FormEvent) { event.preventDefault(); if(!title.trim())return;const id=newId();try{updateLearning(s=>({...s,conversations:[{id,title:title.trim(),updatedAt:Date.now()},...s.conversations]}));navigate('/chats/'+id);}catch(e){setError(saveError(e));} }
  return <div className="student-page"><h1>Study conversations</h1><p className="student-muted">Keep your own study messages here. These are local conversations, not Discord messages. Discord chats will be connected after sign-in.</p><form className="student-actions" onSubmit={create}><input className="student-input" aria-label="Conversation name" placeholder="A topic to study" maxLength={100} value={title} onChange={e=>setTitle(e.target.value)} required/><button className="student-button primary">New conversation</button></form>{error&&<p role="alert" className="student-error">{error}</p>}<div className="student-list">{data.conversations.length?data.conversations.map(chat=><Link key={chat.id} className="student-row" to={'/chats/'+chat.id}><strong>{chat.title}</strong><span className="student-muted">{data.messages.filter(m=>m.chatId===chat.id).length} messages</span></Link>):<p className="student-empty">No conversations yet. Create a topic to keep your practice together.</p>}</div><Link to="/whiteboard">Open study whiteboard</Link></div>;
};
export default ChatsPage;
