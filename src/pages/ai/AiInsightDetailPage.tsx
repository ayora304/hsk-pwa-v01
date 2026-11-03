import React from 'react';
import {Link} from 'react-router-dom';
import {useLearning} from '../../data/learningStore';
import {learningStats} from '../../data/learningState';
export const AiInsightDetailPage:React.FC=()=>{const data=useLearning();const stats=learningStats(data);return <div className="student-page"><h1>Practice summary</h1><section className="student-card"><h2>From your saved practice</h2>{stats.quizCount?<p>You completed {stats.quizCount} quizzes with {stats.accuracy}% accuracy. {stats.accuracy!==null&&stats.accuracy<70?'Review your notes and retry the vocabulary set.':'Keep practicing new words and characters.'}</p>:<p>Complete a quiz to build your practice summary.</p>}<Link to="/quiz">Practice vocabulary</Link></section></div>;};
export default AiInsightDetailPage;
