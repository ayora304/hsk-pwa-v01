import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Chat {
  id: string;
  name: string;
  initials: string;
  message: string;
  time: string;
  unread?: number;
  isOnline?: boolean;
}

const CHATS: Chat[] = [
  { id: '1', name: 'Chen Teacher', initials: 'CT', message: 'Remember the 把 sentence structure for tomorrow.', time: '5 min', unread: 1, isOnline: true },
  { id: '2', name: 'Katie Keller', initials: 'KK', message: 'I’m watching a Chinese drama. What are you doing?', time: '15 min' },
  { id: '3', name: 'Stephen Mann', initials: 'SM', message: 'I’m working now. I’m making a deposit for our company.', time: '1 hour', isOnline: true },
  { id: '4', name: 'Alex Martinez', initials: 'AM', message: 'I really find the subject very interesting. I’m enjoying it.', time: '5 hour' },
  { id: '5', name: 'Melvin Pratt', initials: 'MP', message: 'Great seeing you. I have to go now. I’ll talk to you later.', time: '5 hour' },
  { id: '6', name: 'Elena Zhang', initials: 'EZ', message: 'Article #12 translation is ready for review.', time: 'Yesterday', unread: 3 },
  { id: '7', name: 'Admin', initials: 'AD', message: 'New HSK mock exam uploaded to the portal.', time: 'Yesterday' }
];

export const ChatsPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = '#ffffff';
    document.documentElement.style.backgroundColor = '#ffffff';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#FFF0E5');
  }, []);

  return (
    <div className="w-full relative pb-32 min-h-screen bg-white">
      
      {/* IMMOVABLE FIXED GLASS SHIELD HEADER */}
      <div className="fixed top-0 inset-x-0 w-full max-w-[1200px] mx-auto z-50 bg-[#FFF0E5] pt-[env(safe-area-inset-top)] border-b border-[#FCD8BE]/50 transition-all">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/home')} 
              className="w-[42px] h-[42px] rounded-full bg-[#FFF0E5] flex items-center justify-center shadow-sm border border-[#FCD8BE]/50 cursor-pointer active:scale-95 transition-transform"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F07820" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-0.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div>
              <h1 className="text-[20px] font-extrabold text-[#111111] leading-tight tracking-tight">Messages</h1>
            </div>
          </div>

          <button className="w-[42px] h-[42px] rounded-full bg-[#FFF0E5] flex items-center justify-center shadow-sm border border-[#FCD8BE]/50 cursor-pointer active:scale-95 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F07820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* INVISIBLE SPACER */}
      <div className="w-full h-[calc(70px+env(safe-area-inset-top))]" />

      {/* CHAT LIST */}
      <div className="px-4 flex flex-col pt-2">
        {CHATS.map((chat, index) => (
          <div 
            key={chat.id}
            onClick={() => navigate(`/chats/${chat.id}`, { state: { chat } })}
            className={`w-full py-3.5 flex items-center gap-4 cursor-pointer active:opacity-70 transition-opacity ${
              index !== CHATS.length - 1 ? 'border-b border-[#F5F5F7]' : ''
            }`}
          >
            {/* AVATAR & ONLINE STATUS */}
            <div className="relative shrink-0">
              <div className="w-[52px] h-[52px] rounded-full bg-[#FFF0E5] flex items-center justify-center border border-[#FCD8BE]/50 shadow-sm">
                <span className="font-bold text-[18px] text-[#F07820]">{chat.initials}</span>
              </div>
              {chat.isOnline && (
                <div className="absolute bottom-0 right-0 w-[13px] h-[13px] bg-[#10B981] rounded-full border-2 border-white z-10 shadow-sm" />
              )}
            </div>

            {/* CONTENT */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between mb-0.5">
                <h3 className="font-bold text-[16px] text-[#111111] truncate pr-2">
                  {chat.name}
                </h3>
                <span className="text-[12px] font-medium text-[#999999] shrink-0">
                  {chat.time}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-[14px] text-[#71717A] truncate pr-4 leading-snug">
                  {chat.message}
                </p>
                {chat.unread && (
                  <div className="w-5 h-5 rounded-full bg-[#F07820] flex items-center justify-center shrink-0 shadow-sm">
                    <span className="text-[10px] font-bold text-white leading-none">
                      {chat.unread}
                    </span>
                  </div>
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
