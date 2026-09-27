import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Language {
  code: string;
  name: string;
  sub: string;
  speechCode: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', sub: 'US', speechCode: 'en-US' },
  { code: 'zh', name: 'Chinese', sub: 'CN (Mandarin)', speechCode: 'zh-CN' },
  { code: 'es', name: 'Spanish', sub: 'ES', speechCode: 'es-ES' },
  { code: 'ja', name: 'Japanese', sub: 'JP', speechCode: 'ja-JP' },
  { code: 'fr', name: 'French', sub: 'FR', speechCode: 'fr-FR' },
  { code: 'ko', name: 'Korean', sub: 'KR', speechCode: 'ko-KR' },
];

interface BreakdownItem {
  word: string;
  pronunciation?: string;
  meaning: string;
  tag?: string;
  speechLang: string;
}

export const TranslatePage: React.FC = () => {
  const navigate = useNavigate();

  const [sourceLang, setSourceLang] = useState<Language>(LANGUAGES[0]);
  const [targetLang, setTargetLang] = useState<Language>(LANGUAGES[1]);

  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);

  const [inputText, setInputText] = useState('Hello,\nhow are you?');
  const [activeTab, setActiveTab] = useState<'translate' | 'camera' | 'write' | 'more'>('translate');
  const [isFavorited, setIsFavorited] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(true);
  const [copied, setCopied] = useState(false);

  const getTranslation = (text: string, src: string, tgt: string) => {
    if (!text.trim()) return { main: '', sub: '', breakdown: [] as BreakdownItem[] };

    if (src === 'en' && tgt === 'zh') {
      return {
        main: '你好，你好吗？',
        sub: 'Nǐ hǎo, nǐ hǎo ma?',
        breakdown: [
          { word: '你好', pronunciation: 'nǐ hǎo', meaning: 'Hello / Hi', tag: 'HSK 1', speechLang: 'zh-CN' },
          { word: '你', pronunciation: 'nǐ', meaning: 'You (singular)', tag: 'HSK 1', speechLang: 'zh-CN' },
          { word: '好', pronunciation: 'hǎo', meaning: 'Good / Well', tag: 'HSK 1', speechLang: 'zh-CN' },
          { word: '吗', pronunciation: 'ma', meaning: 'Question particle', tag: 'HSK 1', speechLang: 'zh-CN' }
        ]
      };
    }

    if (src === 'zh' && tgt === 'en') {
      return {
        main: 'Hello, how are you?',
        sub: 'Standard Greeting',
        breakdown: [
          { word: 'Hello', pronunciation: '/həˈloʊ/', meaning: 'An expression of greeting', tag: 'Greeting', speechLang: 'en-US' },
          { word: 'How', pronunciation: '/haʊ/', meaning: 'In what way or manner', tag: 'Adverb', speechLang: 'en-US' },
          { word: 'Are', pronunciation: '/ɑːr/', meaning: 'Present tense of be (you)', tag: 'Verb', speechLang: 'en-US' },
          { word: 'You', pronunciation: '/juː/', meaning: 'The person addressed', tag: 'Pronoun', speechLang: 'en-US' }
        ]
      };
    }

    return {
      main: src === 'en' ? '你好，很高兴认识你' : 'Hello, nice to meet you!',
      sub: src === 'en' ? 'Nǐ hǎo, hěn gāoxìng rènshí nǐ' : 'Common conversational phrase',
      breakdown: [
        { word: tgt === 'zh' ? '你好' : 'Hello', pronunciation: tgt === 'zh' ? 'nǐ hǎo' : '/həˈloʊ/', meaning: 'Greeting', tag: 'Essential', speechLang: tgt === 'zh' ? 'zh-CN' : 'en-US' },
        { word: tgt === 'zh' ? '认识' : 'Meet', pronunciation: tgt === 'zh' ? 'rènshí' : '/miːt/', meaning: 'To know / meet someone', tag: 'Verb', speechLang: tgt === 'zh' ? 'zh-CN' : 'en-US' }
      ]
    };
  };

  const translationResult = getTranslation(inputText, sourceLang.code, targetLang.code);

  useEffect(() => {
    document.body.style.backgroundColor = '#FFF0E5';
    document.documentElement.style.backgroundColor = '#FFF0E5';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#FFF0E5');
  }, []);

  const handleSwap = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);

    if (translationResult.main) {
      setInputText(translationResult.main);
    }
  };

  const handleSpeak = (textToSpeak: string, langCode: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = langCode;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = () => {
    if (translationResult.main) {
      navigator.clipboard.writeText(translationResult.main);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setInputText(sourceLang.code === 'zh' ? '你好，很高兴认识你！' : 'Nice to meet you, my friend!');
        setIsRecording(false);
      }, 3000);
    }
  };

  return (
    <div className="w-full relative pb-32 min-h-screen">
      <div className="fixed top-0 inset-x-0 w-full max-w-[1200px] mx-auto z-50 bg-[#FFF0E5] pt-[env(safe-area-inset-top)]">
        <div className="px-[24px] md:px-[30px] py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/home')} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm active:scale-95 transition-transform cursor-pointer mr-1">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.5" className="mr-0.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h1 className="font-bold text-[22px] text-[#111111] flex items-center gap-1.5">
              Translate
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#F07820"><path d="M12 2L14.5 8.5L21 11L14.5 13.5L12 20L9.5 13.5L3 11L9.5 8.5L12 2Z"/></svg>
            </h1>
          </div>
          <button onClick={() => setShowHistory(!showHistory)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm active:scale-95 transition-transform cursor-pointer text-[#111111]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </button>
        </div>
      </div>
      <div className="w-full h-[calc(72px+env(safe-area-inset-top))]" />

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2 relative z-40">
          <div className="flex-1 relative">
            <div 
              onClick={() => { setShowSourceDropdown(!showSourceDropdown); setShowTargetDropdown(false); }}
              className="bg-white rounded-[20px] px-4 py-3 shadow-sm border border-[#EEEEEE] flex items-center justify-between cursor-pointer active:scale-98 transition-transform"
            >
              <div>
                <p className="font-bold text-[15px] text-[#111111]">{sourceLang.name}</p>
                <p className="text-[11px] text-[#888888] font-medium">{sourceLang.sub}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
            </div>

            {showSourceDropdown && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-[#EEEEEE] rounded-[20px] shadow-lg overflow-hidden py-1 z-50">
                {LANGUAGES.map((l) => (
                  <div 
                    key={l.code} 
                    onClick={() => { setSourceLang(l); setShowSourceDropdown(false); }}
                    className={`px-4 py-2.5 text-xs font-bold cursor-pointer hover:bg-[#FFF0E5] ${sourceLang.code === l.code ? 'text-[#F07820] bg-[#FFF9F5]' : 'text-[#111111]'}`}
                  >
                    {l.name} <span className="text-[#999999] font-normal">({l.sub})</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={handleSwap} className="w-11 h-11 rounded-full bg-white shadow-sm border border-[#EEEEEE] flex items-center justify-center cursor-pointer active:scale-90 transition-transform text-[#F07820] shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 16V4M7 4L3 8M7 4L11 8M17 8v12M17 20l4-4M17 20l-4-4"/></svg>
          </button>

          <div className="flex-1 relative">
            <div 
              onClick={() => { setShowTargetDropdown(!showTargetDropdown); setShowSourceDropdown(false); }}
              className="bg-white rounded-[20px] px-4 py-3 shadow-sm border border-[#EEEEEE] flex items-center justify-between cursor-pointer active:scale-98 transition-transform"
            >
              <div>
                <p className="font-bold text-[15px] text-[#111111]">{targetLang.name}</p>
                <p className="text-[11px] text-[#888888] font-medium">{targetLang.sub}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
            </div>

            {showTargetDropdown && (
              <div className="absolute top-full right-0 mt-2 w-full bg-white border border-[#EEEEEE] rounded-[20px] shadow-lg overflow-hidden py-1 z-50">
                {LANGUAGES.map((l) => (
                  <div 
                    key={l.code} 
                    onClick={() => { setTargetLang(l); setShowTargetDropdown(false); }}
                    className={`px-4 py-2.5 text-xs font-bold cursor-pointer hover:bg-[#FFF0E5] ${targetLang.code === l.code ? 'text-[#F07820] bg-[#FFF9F5]' : 'text-[#111111]'}`}
                  >
                    {l.name} <span className="text-[#999999] font-normal">({l.sub})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[28px] border border-[#EEEEEE] shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#888888]">{sourceLang.name}</span>
            {inputText && (
              <button onClick={() => setInputText('')} className="p-1 rounded-full text-[#AAAAAA] hover:text-[#111111] active:scale-90 cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full text-[22px] font-bold text-[#111111] leading-snug resize-none focus:outline-none placeholder-[#CCCCCC] min-h-[85px]"
            placeholder="Type to translate..."
          />
          <div className="flex items-center justify-end border-t border-[#F5F5F5] pt-2.5">
            <button onClick={() => handleSpeak(inputText, sourceLang.speechCode)} className="p-1.5 text-[#888888] hover:text-[#F07820] active:scale-90 transition-transform cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            </button>
          </div>
        </div>

        <div className="bg-[#FFF9F5] rounded-[28px] border border-[#FCD8BE]/60 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F07820]">{targetLang.name}</span>
          </div>
          <div>
            <p className="text-[24px] font-bold text-[#F07820] leading-tight min-h-[36px]">
              {translationResult.main || <span className="text-[#D0D0D0]">Translation...</span>}
            </p>
            {translationResult.sub && (
              <p className="text-xs font-semibold text-[#888888] mt-1">{translationResult.sub}</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#FCD8BE]/30">
            <span className="text-[11px] font-medium text-[#A0A0A0]">{copied ? 'Copied to clipboard!' : ''}</span>
            <div className="flex items-center gap-2.5">
              <button onClick={() => handleSpeak(translationResult.main, targetLang.speechCode)} title="Listen" className="p-2 text-[#F07820] active:scale-90 transition-transform cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
              </button>

              {translationResult.breakdown.length > 0 && (
                <button 
                  onClick={() => setShowBreakdown(!showBreakdown)} 
                  title="Word Breakdown" 
                  className={`p-2 transition-transform cursor-pointer active:scale-90 ${showBreakdown ? 'text-[#F07820] bg-[#FFF0E5] rounded-full' : 'text-[#F07820]'}`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                </button>
              )}

              <button onClick={handleCopy} title="Copy" className="p-2 text-[#F07820] active:scale-90 transition-transform cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </button>

              <button onClick={() => setIsFavorited(!isFavorited)} title="Favorite" className="p-2 text-[#F07820] active:scale-90 transition-transform cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorited ? "#F07820" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>

              <button onClick={() => alert('Translation link copied!')} title="Share" className="p-2 text-[#F07820] active:scale-90 transition-transform cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              </button>
            </div>
          </div>
        </div>

        {showBreakdown && translationResult.breakdown.length > 0 && (
          <div className="bg-white rounded-[28px] border border-[#EEEEEE] shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F07820" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                {targetLang.name} Word Breakdown
              </span>
              <span className="text-[11px] text-[#888888]">Tap word to listen</span>
            </div>
            <div className="divide-y divide-[#F5F5F5]">
              {translationResult.breakdown.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleSpeak(item.word, item.speechLang)}
                  className="py-3 flex items-center justify-between cursor-pointer active:bg-gray-50 rounded-xl px-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[20px] font-extrabold text-[#111111]">{item.word}</span>
                    <div>
                      {item.pronunciation && (
                        <p className="text-xs font-bold text-[#F07820]">{item.pronunciation}</p>
                      )}
                      <p className="text-xs text-[#666666] font-medium">{item.meaning}</p>
                    </div>
                  </div>
                  {item.tag && (
                    <span className="text-[10px] font-bold text-[#F07820] bg-[#FFF0E5] px-2.5 py-1 rounded-full">{item.tag}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center pt-2 pb-2">
          <button 
            onClick={toggleRecording} 
            className={`w-20 h-20 rounded-full text-white flex items-center justify-center shadow-lg transition-all cursor-pointer border-4 border-white ${
              isRecording ? 'bg-red-500 animate-pulse shadow-red-500/40' : 'bg-[#F07820] shadow-[#F07820]/30 active:scale-95'
            }`}
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          </button>
          <span className="text-[11px] font-semibold text-[#888888] mt-2">
            {isRecording ? 'Listening...' : 'Tap to speak'}
          </span>
        </div>

        <div className="bg-white rounded-full p-2 border border-[#EEEEEE] shadow-sm flex items-center justify-around max-w-[380px] mx-auto">
          <button onClick={() => setActiveTab('translate')} className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded-full transition-colors cursor-pointer ${activeTab === 'translate' ? 'text-[#F07820] font-bold' : 'text-[#888888]'}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>
            <span className="text-[11px]">Translate</span>
          </button>

          <button onClick={() => setActiveTab('camera')} className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded-full transition-colors cursor-pointer ${activeTab === 'camera' ? 'text-[#F07820] font-bold' : 'text-[#888888]'}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            <span className="text-[11px]">Camera</span>
          </button>

          <button onClick={() => setActiveTab('write')} className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded-full transition-colors cursor-pointer ${activeTab === 'write' ? 'text-[#F07820] font-bold' : 'text-[#888888]'}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            <span className="text-[11px]">Write</span>
          </button>

          <button onClick={() => setActiveTab('more')} className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded-full transition-colors cursor-pointer ${activeTab === 'more' ? 'text-[#F07820] font-bold' : 'text-[#888888]'}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            <span className="text-[11px]">More</span>
          </button>
        </div>
      </div>

      {showHistory && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-[400px] rounded-[28px] p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[18px] text-[#111111]">Translation History</h3>
              <button onClick={() => setShowHistory(false)} className="text-[#888888] font-bold cursor-pointer">✕</button>
            </div>
            <div className="divide-y divide-[#F5F5F5] max-h-[250px] overflow-y-auto">
              {[
                { from: 'Hello, how are you?', to: '你好，你好吗？' },
                { from: '你好，你好吗？', to: 'Hello, how are you?' },
                { from: 'Thank you very much', to: '非常感谢' }
              ].map((item, idx) => (
                <div key={idx} onClick={() => { setInputText(item.from); setShowHistory(false); }} className="py-2.5 cursor-pointer active:bg-gray-50">
                  <p className="text-xs font-semibold text-[#111111]">{item.from}</p>
                  <p className="text-xs text-[#F07820] font-bold mt-0.5">{item.to}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TranslatePage;
