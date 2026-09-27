import React from 'react';
import { useNavigate } from 'react-router-dom';

const CHANNELS = [
  { id: 'general-chat', name: 'general-chat', preview: 'Bot: Welcome to the HSK group!', time: '12:42 PM', unread: 2 },
  { id: 'hsk3-study', name: 'hsk3-study-group', preview: 'Alex: Does anyone have notes on 把?', time: '09:15 AM', unread: 0 },
  { id: 'announcements', name: 'announcements', preview: 'Admin: New study schedule posted.', time: 'Yesterday', unread: 1 },
];

export const ChatsListPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111111]">Study Groups</h1>
        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm active:opacity-70">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="2">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        {CHANNELS.map((ch) => (
          <div
            key={ch.id}
            onClick={() => navigate(`/chats/${ch.id}`)}
            className="rounded-2xl px-4 py-4 shadow-sm bg-white flex items-center justify-between active:opacity-80 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FEF0E6] text-[#F07820] flex items-center justify-center font-bold">
                #
              </div>
              <div>
                <p className="text-sm font-bold text-[#111111]">#{ch.name}</p>
                <p className="text-sm text-[#888888] line-clamp-1">{ch.preview}</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-[#999999]">{ch.time}</span>
              {ch.unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#F07820] text-white text-xs font-bold flex items-center justify-center">
                  {ch.unread}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatsListPage;
