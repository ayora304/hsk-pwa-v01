import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'user' | 'other';
  text: string;
  time: string;
  pinyin?: string;
  chinese?: string;
}

export const ChatDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const chatInfo = location.state?.chat || {
    name: 'Chen Teacher',
    initials: 'CT',
    isOnline: true,
    status: 'Online • HSK 3 Tutor'
  };

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'other',
      chinese: '你好！今天的把字句练习准备得怎么样了？',
      pinyin: 'Nǐ hǎo! Jīntiān de bǎ zì jù liànxí zhǔnbèi de zěnmeyàng le?',
      text: 'Hello! How is your preparation for today’s "把" sentence exercises going?',
      time: '10:30 AM'
    },
    {
      id: '2',
      sender: 'user',
      text: 'I reviewed the structure! Subject + 把 + Object + Verb + Result, right?',
      time: '10:32 AM'
    },
    {
      id: '3',
      sender: 'other',
      chinese: '太棒 mountain了！非常正确。',
      text: 'Awesome! That is completely correct. Let’s try making three sentences using vocabulary from HSK 3.',
      time: '10:35 AM'
    }
  ]);

  useEffect(() => {
    document.body.style.backgroundColor = '#ffffff';
    document.documentElement.style.backgroundColor = '#ffffff';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#FFF0E5');
  }, []);

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
  };

  return (
    <div className="w-full relative min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      
      {/* IMMOVABLE FIXED GLASS SHIELD HEADER */}
      <div className="fixed top-0 inset-x-0 w-full max-w-[1200px] mx-auto z-50 bg-[#FFF0E5] pt-[env(safe-area-inset-top)] border-b border-[#FCD8BE]/50 transition-all">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/chats')} 
              className="w-[42px] h-[42px] rounded-full bg-[#FFF0E5] flex items-center justify-center shadow-sm border border-[#FCD8BE]/50 cursor-pointer active:scale-95 transition-transform"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F07820" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-0.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            
            <div className="flex items-center gap-2.5 cursor-pointer">
              <div className="relative">
                <div className="w-[40px] h-[40px] rounded-full bg-[#FFF0E5] flex items-center justify-center border border-[#FCD8BE]/60 shadow-sm">
                  <span className="font-bold text-[15px] text-[#F07820]">{chatInfo.initials}</span>
                </div>
                {chatInfo.isOnline && (
                  <div className="absolute bottom-0 right-0 w-[11px] h-[11px] bg-[#10B981] rounded-full border-2 border-white" />
                )}
              </div>

              <div className="flex flex-col">
                <h1 className="text-[17px] font-extrabold text-[#111111] leading-tight tracking-tight">{chatInfo.name}</h1>
                <p className="text-[11px] font-medium text-[#F07820] leading-tight mt-0.5">
                  {chatInfo.isOnline ? 'Online • Active Now' : 'Offline'}
                </p>
              </div>
            </div>
          </div>

          <button className="w-[42px] h-[42px] rounded-full bg-[#FFF0E5] flex items-center justify-center shadow-sm border border-[#FCD8BE]/50 cursor-pointer active:scale-95 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F07820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </button>
        </div>
      </div>

      {/* HEADER SPACER */}
      <div className="w-full h-[calc(70px+env(safe-area-inset-top))]" />

      {/* CONVERSATION STREAM */}
      <div className="flex-1 px-4 py-4 space-y-4 pb-28">
        <div className="flex justify-center my-2">
          <span className="text-[11px] font-bold text-[#888888] bg-[#FFF0E5] px-3 py-1 rounded-full border border-[#FCD8BE]/40 uppercase tracking-wider">
            Today
          </span>
        </div>

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div 
              className={`max-w-[82%] p-3.5 rounded-[22px] shadow-sm text-[14px] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#F07820] text-white rounded-br-xs font-medium'
                  : 'bg-white text-[#111111] border border-[#EEEEEE] rounded-bl-xs'
              }`}
            >
              {msg.chinese && (
                <p className="font-bold text-[15px] mb-1 text-[#111111]">{msg.chinese}</p>
              )}
              {msg.pinyin && (
                <p className="text-[12px] text-[#888888] mb-1 italic">{msg.pinyin}</p>
              )}
              <p>{msg.text}</p>
            </div>
            <span className="text-[10px] font-semibold text-[#AAAAAA] mt-1 px-1">
              {msg.time}
            </span>
          </div>
        ))}
      </div>

      {/* FIXED BOTTOM MESSAGE INPUT */}
      <div className="fixed bottom-0 inset-x-0 w-full max-w-[1200px] mx-auto bg-white border-t border-[#EEEEEE] px-4 py-3 z-40" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>
        <div className="flex items-center gap-2.5">
          <button className="w-10 h-10 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#71717A] shrink-0 active:scale-95 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
            </svg>
          </button>

          <input 
            type="text" 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message or Pinyin..."
            className="flex-1 bg-[#F5F5F7] border border-[#EEEEEE] rounded-full py-2.5 px-4 text-[14px] text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#F07820]"
          />

          <button 
            onClick={handleSend}
            className="w-10 h-10 rounded-full bg-[#F07820] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#F07820]/30 active:scale-95 transition-transform"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
};

export default ChatDetailPage;
