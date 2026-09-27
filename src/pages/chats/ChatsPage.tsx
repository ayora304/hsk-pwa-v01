import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ChatsPage: React.FC = () => {
  const navigate = useNavigate();

  const chatChannels = [
    { id: 'hsk1-vocabulary', name: '# hsk1-vocabulary', time: '10:30 AM', unread: 2, lastMsg: 'Welcome to HSK 1 study group!', isAi: false },
    { id: 'pinyin-pronunciation', name: 'pinyin-pronunciation-qna', time: '11:15 AM', unread: 0, lastMsg: 'How do I distinguish 3rd and 4th ...', isAi: true },
    { id: 'hsk2-grammar', name: '# hsk2-grammar', time: 'Yesterday', unread: 1, lastMsg: 'Practice measure words for da...', isAi: false },
    { id: 'general-discussion', name: '# general-discussion', time: 'Sep 19', unread: 0, lastMsg: 'Anyone taking the test next month?', isAi: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[34px] font-bold text-[#111111] tracking-tight">Chats</h1>
        <button className="w-[22px] h-[22px] flex items-center justify-center active:opacity-70">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"></path>
          </svg>
        </button>
      </div>

      {/* Chat List W 330 P 16/0/16/0 per row */}
      <div className="w-[330px]">
        {chatChannels.map((channel, idx) => (
          <div
            key={channel.id}
            onClick={() => navigate(`/chats/${channel.id}`)}
            className={`py-4 flex items-center gap-4 cursor-pointer active:opacity-60 ${
              idx !== chatChannels.length - 1 ? 'border-b border-[#E5E5E5]' : ''
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
              {channel.isAi ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"></path>
                </svg>
              ) : (
                <span className="text-xl font-bold text-[#888888]">#</span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-[16px] font-bold text-[#111111] truncate pr-2">{channel.name}</p>
                <span className={`text-[12px] whitespace-nowrap ${channel.unread > 0 ? 'text-[#F07820] font-medium' : 'text-[#AAAAAA]'}`}>
                  {channel.time}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[14px] text-[#888888] truncate">{channel.lastMsg}</p>
                {channel.unread > 0 && (
                  <span className="w-[22px] h-[22px] rounded-full bg-[#F07820] text-white text-[12px] font-bold flex items-center justify-center ml-2 flex-shrink-0">
                    {channel.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatsPage;
