import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredChats, getStoredMessages, addMessageToStore, ChatGroup, Message } from '../../data/chatsData';

export const ChatsPage: React.FC = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<ChatGroup[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.backgroundColor = '#ffffff';
    document.documentElement.style.backgroundColor = '#ffffff';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#ffffff');
    setChats(getStoredChats());
  }, [activeChatId]);

  useEffect(() => {
    if (activeChatId) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeChatId]);

  const openChat = (id: string) => {
    setActiveChatId(id);
    setMessages(getStoredMessages(id));
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !activeChatId) return;
    const newMsg: Message = { id: Date.now().toString(), sender: 'You', text: inputVal.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isMe: true };
    addMessageToStore(activeChatId, newMsg);
    setMessages(prev => [...prev, newMsg]);
    setInputVal('');
  };

  return (
    <div className="w-full relative pb-24">
      {activeChatId ? (
        <div className="flex flex-col h-screen w-full">
          <div className="fixed top-0 inset-x-0 w-full max-w-[600px] mx-auto transition-all z-50 bg-[#FFF0E5] pt-[env(safe-area-inset-top)] border-b border-[#FCD8BE]/50">
      
      
            <div className="px-4 py-3 flex items-center gap-3">
              <button onClick={() => setActiveChatId(null)} className="w-[40px] h-[40px] flex items-center justify-center bg-white border border-[#EEEEEE] rounded-full shadow-sm cursor-pointer"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
              <div><h1 className="text-[18px] font-bold text-[#111111] leading-tight">{chats.find(c => c.id === activeChatId)?.name}</h1><p className="text-[11px] text-[#F07820] font-medium">128 active members</p></div>
            </div>
          </div>
          <div className="w-full flex-none h-[98px]" />
          <div className="flex-1 overflow-y-auto space-y-3 py-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                {!msg.isMe && <span className="text-[11px] font-bold text-[#888888] ml-2 mb-1">{msg.sender}</span>}
                <div className={`max-w-[80%] p-3.5 rounded-[18px] text-[14px] leading-relaxed ${msg.isMe ? 'bg-[#F07820] text-white rounded-br-xs shadow-sm' : 'bg-[#F5F5F7] text-[#111111] border border-[#EEEEEE] rounded-bl-xs'}`}>{msg.text}</div>
                <span className="text-[10px] text-[#AAAAAA] mt-1 px-1">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} className="flex items-center gap-2 py-4 flex-none bg-white border-t border-[#EEEEEE]">
            <input type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)} placeholder="Message..." className="flex-1 bg-[#F5F5F7] border border-[#EEEEEE] rounded-full py-3.5 px-4 text-sm focus:outline-none focus:border-[#F07820]" />
            <button type="submit" className="w-[44px] h-[44px] rounded-full bg-[#F07820] text-white flex items-center justify-center shadow-md flex-shrink-0 cursor-pointer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button>
          </form>
        </div>
      ) : (
        <div>
          <div className="fixed top-0 inset-x-0 w-full max-w-[600px] mx-auto transition-all z-50 bg-[#FFF0E5] pt-[env(safe-area-inset-top)] border-b border-[#FCD8BE]/50">
      
      
            <div className="px-4 py-3 flex items-center gap-4">
              <button onClick={() => navigate('/home')} className="w-[40px] h-[40px] flex items-center justify-center bg-white border border-[#EEEEEE] rounded-full shadow-sm cursor-pointer"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
              <div><h1 className="text-[24px] font-bold text-[#111111] tracking-tight leading-tight">Study Groups</h1><p className="text-xs text-[#888888]">30 active channels</p></div>
            </div>
          </div>
          <div className="w-full h-[calc(70px+env(safe-area-inset-top))]" />
          <div className="space-y-2.5 pt-2">
            {chats.map((group) => (
              <div key={group.id} onClick={() => openChat(group.id)} className="w-full p-3.5 rounded-[20px] bg-white border border-[#F0F0F0] shadow-sm flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-[#FFF0E5] flex items-center justify-center font-bold text-[#F07820] text-base flex-shrink-0 border border-[#FCD8BE]/40">#</div>
                  <div className="min-w-0"><div className="flex items-center gap-2"><h3 className="font-bold text-[#111111] text-[15px] truncate">{group.name}</h3><span className="text-[10px] font-semibold text-[#888888] bg-[#F5F5F7] px-2 py-0.5 rounded-full flex-shrink-0">{group.category}</span></div><p className="text-[13px] text-[#777777] truncate mt-0.5">{group.lastMsg}</p></div>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-2">
                  <span className="text-[11px] font-medium text-[#AAAAAA]">{group.time}</span>
                  {group.unread > 0 && <span className="px-1.5 py-0.5 rounded-full bg-[#F07820] text-white text-[10px] font-bold">{group.unread} new</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatsPage;
