import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/home/HomePage';
import ChatsListPage from './pages/chats/ChatsListPage';
import ChatDetailPage from './pages/chats/ChatDetailPage';
import NotesPage from './pages/notes/NotesPage';
import SchedulePage from './pages/schedule/SchedulePage';
import StatsPage from './pages/stats/StatsPage';
import ProfilePage from './pages/profile/ProfilePage';
import LoginPage from './pages/auth/LoginPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/chats" element={<ChatsListPage />} />
          <Route path="/chats/:channelId" element={<ChatDetailPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;
