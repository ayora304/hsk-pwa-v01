import React from 'react';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      <div className="h-[56px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div onClick={() => navigate('/profile')} className="w-11 h-11 rounded-full bg-[#1C1C1C] flex items-center justify-center cursor-pointer active:opacity-80">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div>
            <p className="text-xs text-[#888888] font-normal leading-tight">Welcome Back,</p>
            <p className="text-base font-bold text-[#111111] leading-tight">testt</p>
          </div>
        </div>

        <button className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-sm relative active:opacity-70">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#F07820]" />
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Ask HSK AI anything..."
          className="w-full bg-white rounded-2xl px-4 py-3.5 pl-11 shadow-sm text-sm text-[#111111] placeholder-[#CCCCCC] focus:outline-none"
        />
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#AAAAAA" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl px-4 py-4 shadow-sm bg-white active:opacity-80 cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-[#FEF0E6] flex items-center justify-center mb-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F07820" strokeWidth="2">
              <path d="M5 8l6 6M4 14e1 1-1 0 10-10L4 14zM2 5h12M9 2v3M19 11l-4 9M15 17h6"></path>
            </svg>
          </div>
          <p className="text-sm font-bold text-[#111111]">Translate</p>
          <p className="text-xs text-[#888888]">Hanzi & Pinyin</p>
        </div>

        <div className="rounded-2xl px-4 py-4 shadow-sm bg-white active:opacity-80 cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-[#FEF0E6] flex items-center justify-center mb-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F07820" strokeWidth="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div>
          <p className="text-sm font-bold text-[#111111]">Classroom</p>
          <p className="text-xs text-[#888888]">HSK 3 Module</p>
        </div>

        <div onClick={() => navigate('/notes')} className="rounded-2xl px-4 py-4 shadow-sm bg-white active:opacity-80 cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-[#FEF0E6] flex items-center justify-center mb-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F07820" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <p className="text-sm font-bold text-[#111111]">Notes</p>
          <p className="text-xs text-[#888888]">Grammar & Vocab</p>
        </div>

        <div className="rounded-2xl px-4 py-4 shadow-sm bg-white active:opacity-80 cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-[#FEF0E6] flex items-center justify-center mb-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F07820" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <p className="text-sm font-bold text-[#111111]">Quiz</p>
          <p className="text-xs text-[#888888]">Practice Test</p>
        </div>
      </div>

      <div onClick={() => navigate('/schedule')} className="rounded-2xl px-4 py-4 shadow-sm bg-white flex items-center justify-between active:opacity-80 cursor-pointer">
        <div>
          <span className="text-xs font-semibold uppercase text-[#F07820]">Today's Objective</span>
          <p className="text-sm font-bold text-[#111111]">HSK 3 Lesson 4 Vocab</p>
          <p className="text-xs text-[#888888]">3 of 4 completed</p>
        </div>
        <div className="relative w-12 h-12 flex items-center justify-center">
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none" stroke="#F0E8DC" strokeWidth="4"/>
            <circle cx="24" cy="24" r="20" fill="none" stroke="#F07820" strokeWidth="4"
              strokeDasharray={`${2*Math.PI*20*0.75}${2*Math.PI*20*0.25}`}
              strokeDashoffset={2*Math.PI*20*0.25}
              strokeLinecap="round"
              transform="rotate(-90 24 24)"
            />
          </svg>
          <span className="absolute text-xs font-bold text-[#F07820]">75%</span>
        </div>
      </div>

      <div className="rounded-2xl px-4 py-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #FEF0E6 0%, #FDDFC8 100%)' }}>
        <div className="flex items-center gap-2 mb-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#F07820">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"></path>
          </svg>
          <span className="text-xs font-bold text-[#F07820] uppercase">AI Insight</span>
        </div>
        <p className="text-sm text-[#111111]">
          You've mastered 15 new HSK 3 vocabulary items this week! Review grammar notes before today's chat session.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
