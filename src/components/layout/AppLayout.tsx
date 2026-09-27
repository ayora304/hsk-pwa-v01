import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  const navItems = [
    { label: 'Home', path: '/home', icon: (a: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? '#FFFFFF' : '#AAAAAA'} strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
    { label: 'Chats', path: '/chats', icon: (a: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? '#FFFFFF' : '#AAAAAA'} strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> },
    { label: 'AI Hub', path: '/home', icon: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"></path></svg>, isAi: true },
    { label: 'Stats', path: '/stats', icon: (a: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? '#FFFFFF' : '#AAAAAA'} strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg> },
    { label: 'Profile', path: '/profile', icon: (a: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? '#FFFFFF' : '#AAAAAA'} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center py-6">
      <div className="relative w-[390px] h-[844px] rounded-[44px] border-[10px] border-[#222222] shadow-2xl overflow-hidden flex flex-col"
           style={{ background: 'linear-gradient(180deg, #FAF0E8 0%, #F5E4D0 100%)' }}>
        
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[126px] h-[34px] bg-[#222222] rounded-b-[20px] z-50 flex items-center justify-center">
          <div className="w-12 h-1 bg-[#111111] rounded-full"></div>
        </div>

        {/* Scrollable Container */}
        <main className="flex-1 overflow-y-auto pt-10 px-5 pb-20">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 left-0 right-0 h-[64px] bg-white border-t border-[#F0EAE0] px-4 flex items-center justify-between z-40">
          {navItems.map((item, idx) => {
            const active = !item.isAi && isActive(item.path);
            return (
              <button key={idx} onClick={() => navigate(item.path)} className="flex-1 flex justify-center items-center py-2 active:opacity-70">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                  item.isAi ? 'bg-[#F07820]' : active ? 'bg-[#1C1C1C]' : 'bg-transparent'
                }`}>
                  {item.icon(active)}
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AppLayout;
