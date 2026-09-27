import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useChatSync } from '../../hooks/useChatSync';

export const ChatDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { channelId = 'general-chat' } = useParams();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage } = useChatSync(channelId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full -mx-5 -mt-10 -mb-20 pt-10 pb-20 bg-[#FAF0E8]">
      <div className="h-[56px] px-5 bg-white border-b border-[#F0E8DC] flex items-center justify-between z-10 shadow-xs flex-shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/chats')} className="w-9 h-9 rounded-full bg-white flex items-center justify-center active:opacity-70">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="2.2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div className="w-9 h-9 rounded-full bg-[#E8E8E8] flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666666" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>

          <div>
            <h2 className="text-sm font-bold text-[#111111] leading-tight truncate max-w-[170px]">{channelId}</h2>
            <span className="text-[11px] font-medium text-[#2CB44A] leading-none block">online</span>
          </div>
        </div>

        <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#333333] active:opacity-70">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
            <circle cx="5" cy="12" r="1"></circle>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.isAi ? 'items-start' : 'items-end'}`}>
            <div className={`rounded-2xl px-4 py-3 shadow-sm max-w-[82%] ${
              msg.isAi ? 'rounded-tl-sm bg-white' : 'rounded-tr-sm bg-[#FFFFFF]'
            }`}>
              <p className="text-sm text-[#111111] leading-relaxed">{msg.content}</p>
            </div>
            <div className="flex items-center gap-1.5 mt-1 px-1">
              <span className="text-[10px] text-[#AAAAAA]">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              {!msg.isAi && (
                <span className={`text-[10px] font-bold ${
                  msg.syncStatus === 'PENDING' ? 'text-[#F07820]' : 'text-[#2CB44A]'
                }`}>
                  {msg.syncStatus === 'PENDING' ? '⏳ Queued' : '✓ Synced'}
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="px-5 py-3 bg-white border-t border-[#F0E8DC] flex items-center gap-2 flex-shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-[#FAF0E8] rounded-2xl px-4 py-3 text-sm focus:outline-none placeholder-[#CCCCCC] text-[#111111]"
        />
        <button type="submit" className="w-11 h-11 rounded-2xl bg-[#F07820] text-white flex items-center justify-center active:opacity-80 flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatDetailPage;
