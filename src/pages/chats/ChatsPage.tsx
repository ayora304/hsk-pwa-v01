import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ChatsPage: React.FC = () => {
  const navigate = useNavigate();

  const chatChannels = [
    { id: 'hsk1-vocabulary', name: '# hsk1-vocabulary', time: '10:30 AM', unread: 2, lastMsg: 'Welcome to HSK 1 study group!' },
    { id: 'pinyin-pronunciation-qna', name: 'pinyin-pronunciation-qna', time: '11:15 AM', unread: 0, lastMsg: 'How do I distinguish tone 2 and tone 3?' },
    { id: 'hsk2-grammar-practice', name: '# hsk2-grammar-practice', time: 'Yesterday', unread: 0, lastMsg: 'Does anyone have notes for Lesson 5?' },
  ];

  return (
    <div className="space-y-4">
      <div className="h-[56px] flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111111]">Chats</h1>
        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xs active:opacity-70">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="2">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        {chatChannels.map((channel) => (
          <div
            key={channel.id}
            onClick={() => navigate(`/chats/${channel.id}`)}
            className="rounded-2xl p-4 bg-white shadow-sm flex items-center gap-3 cursor-pointer active:opacity-80"
          >
            <div className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center text-lg font-bold text-[#555555] flex-shrink-0">
              #
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-[#111111] truncate">{channel.name}</p>
                <span className="text-xs text-[#F07820] font-medium">{channel.time}</span>
              </div>
              <p className="text-xs text-[#888888] truncate mt-0.5">{channel.lastMsg}</p>
            </div>
            {channel.unread > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#F07820] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                {channel.unread}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatsPage;
