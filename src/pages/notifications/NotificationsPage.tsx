import React from 'react';
import {Link} from 'react-router-dom';
import {useLearning} from '../../data/learningStore';
export const NotificationsPage:React.FC=()=>{const data=useLearning();const due=data.schedules.filter(x=>!x.completed&&new Date(x.startsAt).getTime()<=Date.now()+86400000);return <div className="student-page"><h1>Study reminders</h1><p className="student-muted">From your saved schedule. Browser push notifications are not enabled.</p>{due.length?due.map(x=><article className="student-card" key={x.id}><h2>{x.title}</h2><p>{new Date(x.startsAt).toLocaleString()}</p><Link to="/schedule-detail">View schedule</Link></article>):<p className="student-empty">No study sessions due in the next 24 hours.</p>}</div>;};
export default NotificationsPage;
