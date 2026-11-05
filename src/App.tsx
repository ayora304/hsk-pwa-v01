import { ChatDetailPage } from './pages/chats/ChatDetailPage';
﻿import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/home/HomePage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { ChatsPage } from './pages/chats/ChatsPage';
import { StatsPage } from './pages/stats/StatsPage';
import { ScheduleDetailPage } from './pages/schedule/ScheduleDetailPage';
import { AiInsightDetailPage } from './pages/ai/AiInsightDetailPage';
import { TranslatePage } from './pages/translate/TranslatePage';
import { ClassroomPage } from './pages/classroom/ClassroomPage';
import { NotesPage } from './pages/notes/NotesPage';
import { QuizPage } from './pages/quiz/QuizPage';
import { ReadingPage } from './pages/reading/ReadingPage';
import { LandingPage } from './pages/landing/LandingPage';
import { PracticePage } from './pages/practice/PracticePage';
import { LessonPage } from './pages/lessons/LessonPage';
import { ChallengesPage } from './pages/challenges/ChallengesPage';
import { LibraryPage } from './pages/library/LibraryPage';
import { lazy, Suspense } from 'react';
const WhiteboardPage = lazy(() => import('./pages/whiteboard/WhiteboardPage'));

function PracticeEntry() {
  const [params] = useSearchParams();
  if (params.has('mode') || params.has('skill') || params.has('lesson') || params.has('topic') || params.has('level')) return <PracticePage />;
  return <Suspense fallback={<p role="status">Loading whiteboard…</p>}><WhiteboardPage /></Suspense>;
}

export const App: React.FC = () => {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/reading" element={<ReadingPage />} />
          <Route path="/schedule-detail" element={<ScheduleDetailPage />} />
          <Route path="/ai-insight" element={<AiInsightDetailPage />} />
          <Route path="/translate" element={<TranslatePage />} />
          <Route path="/classroom" element={<ClassroomPage />} />
          <Route path="/learn" element={<Navigate to="/classroom" replace />} />
          <Route path="/lessons/:id" element={<LessonPage />} />
          <Route path="/practice" element={<PracticeEntry />} />
          <Route path="/practice/exercises" element={<PracticePage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/progress" element={<Navigate to="/stats" replace />} />
          <Route path="/conversations" element={<Navigate to="/chats" replace />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/whiteboard" element={<Suspense fallback={<p role="status">Loading whiteboard…</p>}><WhiteboardPage /></Suspense>} />
          <Route path="/chats" element={<ChatsPage />} />
          <Route path="/chats/:id" element={<ChatDetailPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;
