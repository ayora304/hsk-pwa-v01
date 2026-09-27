import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: number;
  chinese: string;
  pinyin: string;
  options: string[];
  correctIndex: number;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    chinese: '谢谢',
    pinyin: 'xièxie',
    options: ['Sorry', 'Thank you', 'Goodbye', 'Please'],
    correctIndex: 1
  },
  {
    id: 2,
    chinese: '苹果',
    pinyin: 'píngguǒ',
    options: ['Apple', 'Watermelon', 'Banana', 'Milk'],
    correctIndex: 0
  },
  {
    id: 3,
    chinese: '多少钱',
    pinyin: 'duōshao qián',
    options: ['Where is it?', 'What time is it?', 'How much is it?', 'Who are you?'],
    correctIndex: 2
  },
  {
    id: 4,
    chinese: '再见',
    pinyin: 'zàijiàn',
    options: ['Hello', 'See you tomorrow', 'Thank you', 'Goodbye'],
    correctIndex: 3
  }
];

export const QuizPage: React.FC = () => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [changeCount, setChangeCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(10);
  const [timerActive, setTimerActive] = useState(true);

  const currentQ = QUIZ_QUESTIONS[currentIndex];

  useEffect(() => {
    document.body.style.backgroundColor = '#FFF0E5';
    document.documentElement.style.backgroundColor = '#FFF0E5';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#FFF0E5');
  }, []);

  useEffect(() => {
    if (!timerActive || isLocked) return;

    if (timeLeft === 0) {
      setIsLocked(true);
      setTimerActive(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, timerActive, isLocked]);

  const handleSelectOption = (idx: number) => {
    if (isLocked) return;

    if (selectedOption === null) {
      setSelectedOption(idx);
    } else if (selectedOption !== idx && changeCount === 0) {
      setSelectedOption(idx);
      setChangeCount(1);
    }
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null || isLocked) return;

    setIsLocked(true);
    setTimerActive(false);

    if (selectedOption === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setChangeCount(0);
      setIsLocked(false);
      setTimeLeft(10);
      setTimerActive(true);
    } else {
      alert(`Quiz Finished! Final Score: ${score + (selectedOption === currentQ.correctIndex ? 1 : 0)} / ${QUIZ_QUESTIONS.length}`);
      setCurrentIndex(0);
      setScore(0);
      setSelectedOption(null);
      setChangeCount(0);
      setIsLocked(false);
      setTimeLeft(10);
      setTimerActive(true);
    }
  };

  const isCorrect = selectedOption === currentQ.correctIndex;

  return (
    <div className="w-full relative pb-32 min-h-screen">
      <div className="fixed top-0 inset-x-0 w-full max-w-[1200px] mx-auto z-50 bg-[#FFF0E5] pt-[env(safe-area-inset-top)]">
        <div className="px-[24px] md:px-[30px] py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm active:scale-95 transition-transform cursor-pointer"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" className="mr-0.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h1 className="font-bold text-[22px] text-[#111111]">Daily Quiz</h1>
          </div>

          <span className="text-xs font-extrabold text-[#F07820] bg-white border border-[#FCD8BE] px-3 py-1.5 rounded-full shadow-xs">
            Score: {score}
          </span>
        </div>
      </div>
      <div className="w-full h-[calc(72px+env(safe-area-inset-top))]" />

      <div className="space-y-4">
        <div className="w-full bg-white p-4 rounded-[22px] shadow-sm border border-[#EEEEEE] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#888888]">
              Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <span className={`text-xs font-extrabold flex items-center gap-1 ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-[#F07820]'}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 16 14"/></svg>
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}s
            </span>
          </div>

          <div className="w-full h-2.5 bg-[#F5F5F5] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 rounded-full ${
                timeLeft <= 3 ? 'bg-red-500' : 'bg-[#F07820]'
              }`}
              style={{ width: `${(timeLeft / 10) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-[#EEEEEE] text-center space-y-2 relative overflow-hidden">
          <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">Select the correct English translation</span>
          <h2 className="text-[42px] font-extrabold text-[#111111] leading-tight">{currentQ.chinese}</h2>
          <p className="text-sm text-[#F07820] font-bold">Pinyin: {currentQ.pinyin}</p>

          <div className="pt-2">
            {!isLocked ? (
              <span className="text-[10px] font-bold text-[#666666] bg-[#F5F5F5] px-3 py-1 rounded-full">
                {selectedOption === null 
                  ? 'Tap an option to select' 
                  : changeCount === 0 
                  ? '1 Choice change remaining' 
                  : 'Choice limit reached'}
              </span>
            ) : (
              <span className={`text-[11px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider ${
                isCorrect ? 'text-[#059669] bg-[#ECFDF5]' : 'text-[#DC2626] bg-[#FEF2F2]'
              }`}>
                {isCorrect ? 'PASSED 🎉' : 'FAILED ❌'}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2.5">
          {currentQ.options.map((option, idx) => {
            let optionStyles = 'bg-white text-[#111111] border-[#EEEEEE] shadow-sm';

            if (isLocked) {
              if (idx === currentQ.correctIndex) {
                optionStyles = 'bg-[#10B981] text-white border-[#10B981] shadow-md font-extrabold';
              } else if (idx === selectedOption) {
                optionStyles = 'bg-[#EF4444] text-white border-[#EF4444] shadow-md font-extrabold';
              } else {
                optionStyles = 'bg-white text-[#AAAAAA] border-[#EEEEEE] opacity-50';
              }
            } else if (selectedOption === idx) {
              optionStyles = 'bg-[#F07820] text-white border-[#F07820] shadow-md font-extrabold';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isLocked}
                className={`w-full py-3.5 px-5 rounded-[20px] font-bold text-[15px] text-left border transition-all cursor-pointer flex items-center justify-between ${optionStyles}`}
              >
                <span>{option}</span>
                {isLocked && idx === currentQ.correctIndex && <span className="text-white text-sm">✓</span>}
                {isLocked && idx === selectedOption && idx !== currentQ.correctIndex && <span className="text-white text-sm">✕</span>}
              </button>
            );
          })}
        </div>

        <div className="pt-2">
          {!isLocked ? (
            <button
              onClick={handleConfirmAnswer}
              disabled={selectedOption === null}
              className="w-full bg-[#F07820] text-white py-4 rounded-[22px] font-bold text-[16px] shadow-lg shadow-[#F07820]/30 disabled:opacity-40 active:scale-98 transition-all cursor-pointer"
            >
              Lock Choice &amp; Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full bg-[#111111] text-white py-4 rounded-[22px] font-bold text-[16px] shadow-lg active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question →' : 'See Final Results'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
