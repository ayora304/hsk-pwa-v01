import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/home/HomePage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { ChatsPage } from './pages/chats/ChatsPage';
import { StatsPage } from './pages/stats/StatsPage';
import { ScheduleDetailPage } from './pages/schedule/ScheduleDetailPage';
import { AiInsightDetailPage } from './pages/ai/AiInsightDetailPage';

export const App: React.FC = () => {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/schedule-detail" element={<ScheduleDetailPage />} />
          <Route path="/ai-insight" element={<AiInsightDetailPage />} />
          <Route path="/chats" element={<ChatsPage />} />
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
