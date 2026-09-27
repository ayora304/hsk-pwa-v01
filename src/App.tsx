import { ChatDetailPage } from './pages/chats/ChatDetailPage';
﻿import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

export const App: React.FC = () => {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/schedule-detail" element={<ScheduleDetailPage />} />
          <Route path="/ai-insight" element={<AiInsightDetailPage />} />
          <Route path="/translate" element={<TranslatePage />} />
          <Route path="/classroom" element={<ClassroomPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/quiz" element={<QuizPage />} />
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
