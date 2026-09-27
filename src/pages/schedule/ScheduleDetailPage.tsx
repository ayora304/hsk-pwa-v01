import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onBack?: () => void;
}

const objectives = [
  { text: 'Master 150 basic HSK 1 vocabulary words', done: true },
  { text: 'Learn basic sentence structures (SVO)', done: true },
  { text: 'Practice pinyin pronunciation', done: false },
  { text: 'Understand measure words usage', done: false },
];

const resources = [
  { title: 'Video Lesson: Basic Greetings', meta: '12 min' },
  { title: 'Vocabulary List: Daily Life', meta: '50 words' },
  { title: 'Pinyin Chart PDF', meta: '2 pages' },
];

export const ScheduleDetailPage: React.FC<Props> = ({ onBack }) => {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate('/home'));

  return (
    <div className="space-y-5">
      <div className="h-[56px] flex items-center gap-3">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full flex items-center justify-center active:opacity-70"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="font-bold text-base text-[#111111]">Schedule Detail</h1>
      </div>

      <div className="rounded-2xl px-5 py-5 shadow-sm bg-white">
        <h2 className="text-2xl font-bold text-[#111111] leading-tight mb-1">
          HSK 1 – Basic Vocabulary
        </h2>
        <p className="text-sm text-[#999999] mb-4">
          HSK Level 1 • Vocabulary &amp; Grammar
        </p>

        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 flex-shrink-0">
            <svg width="56" height="56" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="22" fill="none" stroke="#F0E8DC" strokeWidth="5" />
              <circle
                cx="28"
                cy="28"
                r="22"
                fill="none"
                stroke="#F07820"
                strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 22 * 0.75}${2 * Math.PI * 22 * 0.25}`}
                strokeDashoffset={2 * Math.PI * 22 * 0.25}
                strokeLinecap="round"
                transform="rotate(-90 28 28)"
              />
              <text
                x="28"
                y="28"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#F07820"
                fontSize="12"
                fontWeight="bold"
              >
                75%
              </text>
            </svg>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-[#F07820]">
              75% Complete
            </span>
            <span className="text-sm text-[#999999]">45 Min Left</span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-bold text-base text-[#111111] mb-3">Learning Objectives</h2>
        <div className="rounded-2xl px-5 py-4 shadow-sm bg-white">
          <div className="flex flex-col gap-4">
            {objectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-3">
                {obj.done ? (
                  <div className="w-6 h-6 rounded-full bg-[#2CB44A] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#D0D0D0] flex-shrink-0 mt-0.5" />
                )}
                <p className={`text-sm leading-relaxed ${obj.done ? 'text-[#2CB44A]' : 'text-[#555555]'}`}>
                  {obj.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-bold text-base text-[#111111] mb-3">Resources</h2>
        <div className="rounded-2xl overflow-hidden shadow-sm bg-white">
          {resources.map((r, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 px-5 py-4 ${
                i < resources.length - 1 ? 'border-b border-[#F5F5F5]' : ''
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-[#FEF0E6] flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#F07820">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[#111111]">{r.title}</p>
                <p className="text-xs text-[#AAAAAA] mt-0.5">{r.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetailPage;
