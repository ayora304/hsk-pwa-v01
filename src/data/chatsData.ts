export interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe?: boolean;
}

export interface ChatGroup {
  id: string;
  name: string;
  lastMsg: string;
  time: string;
  unread: number;
  category: string;
}

export const INITIAL_CHATS: ChatGroup[] = [
  { id: 'general-chat', name: '#general-chat', lastMsg: 'Chen Teacher: Remember the 把 sentence structure!', time: '10:35 AM', unread: 3, category: 'General' },
  { id: 'hsk3-study-group', name: '#hsk3-study-group', lastMsg: 'Alex: Does anyone have notes on Chapter 5?', time: '09:15 AM', unread: 0, category: 'HSK 3' },
  { id: 'announcements', name: '#announcements', lastMsg: 'Admin: New HSK mock exam uploaded.', time: 'Yesterday', unread: 1, category: 'Official' },
  { id: 'hsk1-beginners', name: '#hsk1-beginners', lastMsg: 'Mei: How do you pronounce 谢谢 correctly?', time: 'Yesterday', unread: 0, category: 'HSK 1' },
  { id: 'hsk2-grammar', name: '#hsk2-grammar', lastMsg: 'David: What is the difference between 再 and 又?', time: '2 days ago', unread: 0, category: 'HSK 2' },
  { id: 'hsk4-reading', name: '#hsk4-reading', lastMsg: 'Elena: Article #12 translation is ready.', time: '2 days ago', unread: 0, category: 'HSK 4' },
  { id: 'hsk5-idioms', name: '#hsk5-idioms', lastMsg: 'Lao Zhang: Today 成语: 一石二鸟', time: '3 days ago', unread: 0, category: 'HSK 5' },
  { id: 'hsk6-mastery', name: '#hsk6-mastery', lastMsg: 'Ken: 5000 vocabulary flashcard set shared.', time: '3 days ago', unread: 0, category: 'HSK 6' },
  { id: 'pinyin-pronunciation', name: '#pinyin-tones', lastMsg: 'Coach Li: Practice 3rd tone + 3rd tone shift.', time: '4 days ago', unread: 0, category: 'Pronunciation' },
  { id: 'hanzi-stroke-order', name: '#hanzi-writing', lastMsg: 'Sophia: Remember stroke rule: Left to Right!', time: '4 days ago', unread: 0, category: 'Writing' },
  { id: 'speaking-practice', name: '#speaking-club', lastMsg: 'Voice Call starting in 10 minutes!', time: '5 days ago', unread: 2, category: 'Speaking' },
  { id: 'vocab-builder-daily', name: '#daily-vocab', lastMsg: 'Word of the day: 苹果 (Píngguǒ)', time: '5 days ago', unread: 0, category: 'Vocab' },
  { id: 'chengyu-spotlight', name: '#chengyu-corner', lastMsg: 'Meaning behind 盲人摸象 explained.', time: '6 days ago', unread: 0, category: 'Culture' },
  { id: 'listening-comprehension', name: '#listening-hacks', lastMsg: 'Listen to podcast episode 14 at 1x speed.', time: '6 days ago', unread: 0, category: 'Listening' },
  { id: 'grammar-qa', name: '#grammar-help', lastMsg: 'Question about 了 at the end of sentences.', time: '1 week ago', unread: 0, category: 'Grammar' },
  { id: 'hsk3-mock-tests', name: '#hsk3-tests', lastMsg: 'Score 240+ strategy guide posted.', time: '1 week ago', unread: 0, category: 'HSK 3' },
  { id: 'business-chinese', name: '#business-mandarin', lastMsg: 'Formal email templates for business.', time: '1 week ago', unread: 0, category: 'Business' },
  { id: 'mandarin-memes', name: '#mandarin-memes', lastMsg: 'Funny tone mispronunciation meme 😆', time: '1 week ago', unread: 0, category: 'Fun' },
  { id: 'reading-club-novels', name: '#graded-readers', lastMsg: 'Finished reading "The Secret Garden" in HSK 3.', time: '1 week ago', unread: 0, category: 'Reading' },
  { id: 'hsk2-flashcards', name: '#hsk2-anki', lastMsg: 'Updated Anki deck v2.1 with audio.', time: '2 weeks ago', unread: 0, category: 'HSK 2' },
  { id: 'hsk4-listening', name: '#hsk4-audio', lastMsg: 'Audio track 08 transcribed.', time: '2 weeks ago', unread: 0, category: 'HSK 4' },
  { id: 'character-etymology', name: '#character-origins', lastMsg: 'Why 明 consists of 日 (sun) + 月 (moon).', time: '2 weeks ago', unread: 0, category: 'Writing' },
  { id: 'hsk3-vocab-squad', name: '#hsk3-squad', lastMsg: 'Daily quiz starts at 8 PM UTC.', time: '2 weeks ago', unread: 0, category: 'HSK 3' },
  { id: 'duolingo-refugees', name: '#duolingo-switch', lastMsg: 'Welcome new members switching to HSK!', time: '2 weeks ago', unread: 0, category: 'Community' },
  { id: 'native-exchange', name: '#language-exchange', lastMsg: 'Looking for a study partner for 30 mins/day.', time: '3 weeks ago', unread: 0, category: 'Exchange' },
  { id: 'daily-journal-chinese', name: '#chinese-diaries', lastMsg: 'Share 2 sentences about your day.', time: '3 weeks ago', unread: 0, category: 'Writing' },
  { id: 'movie-discussions', name: '#chinese-cinema', lastMsg: 'Recommended movie: "To Live" (活着)', time: '3 weeks ago', unread: 0, category: 'Culture' },
  { id: 'audio-lessons', name: '#pimsleur-buddies', lastMsg: 'Completed Unit 2 Lesson 15!', time: '1 month ago', unread: 0, category: 'Listening' },
  { id: 'hsk-exam-centers', name: '#test-center-info', lastMsg: 'List of online home-based HSK centers.', time: '1 month ago', unread: 0, category: 'Official' },
  { id: 'study-accountability', name: '#daily-streak-check', lastMsg: '7-day streak achieved! 🔥', time: '1 month ago', unread: 0, category: 'Community' }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  'general-chat': [
    { id: 'm1', sender: 'HSK Bot 🤖', text: 'Welcome to #general-chat! 👋 Feel free to ask questions, share study tips, or chat in Mandarin.', time: '10:00 AM' },
    { id: 'm2', sender: 'Alex', text: 'Hey everyone! How is everyone feeling about the upcoming HSK exam?', time: '10:15 AM' },
    { id: 'm3', sender: 'Sarah', text: 'I am struggling with listening practice 😅 Native speakers sound so fast!', time: '10:22 AM' },
    { id: 'm4', sender: 'Chen Teacher 👨‍🏫', text: 'Try listening at 0.8x speed first! And remember the 把 (bǎ) sentence structure: Subject + 把 + Object + Verb + Result!', time: '10:30 AM' },
    { id: 'm5', sender: 'Alex', text: 'That makes so much sense! Thanks Chen Laoshi! 🙏', time: '10:35 AM' }
  ]
};

const CHATS_KEY = 'hsk_app_chats_v2';
const MSGS_KEY = 'hsk_app_msgs_v2';

export const getStoredChats = (): ChatGroup[] => {
  const saved = localStorage.getItem(CHATS_KEY);
  if (!saved) {
    localStorage.setItem(CHATS_KEY, JSON.stringify(INITIAL_CHATS));
    return INITIAL_CHATS;
  }
  return JSON.parse(saved);
};

export const getStoredMessages = (chatId: string): Message[] => {
  const saved = localStorage.getItem(MSGS_KEY);
  if (!saved) {
    localStorage.setItem(MSGS_KEY, JSON.stringify(INITIAL_MESSAGES));
    return INITIAL_MESSAGES[chatId] || [];
  }
  const parsed = JSON.parse(saved);
  return parsed[chatId] || INITIAL_MESSAGES[chatId] || [];
};

export const addMessageToStore = (chatId: string, msg: Message) => {
  const savedMsgs = localStorage.getItem(MSGS_KEY);
  const allMsgs = savedMsgs ? JSON.parse(savedMsgs) : { ...INITIAL_MESSAGES };
  if (!allMsgs[chatId]) allMsgs[chatId] = [];
  allMsgs[chatId].push(msg);
  localStorage.setItem(MSGS_KEY, JSON.stringify(allMsgs));

  // Update last message in chat list
  const chats = getStoredChats();
  const updatedChats = chats.map(c => 
    c.id === chatId 
      ? { ...c, lastMsg: `${msg.isMe ? 'You' : msg.sender}: ${msg.text}`, time: msg.time, unread: 0 } 
      : c
  );
  localStorage.setItem(CHATS_KEY, JSON.stringify(updatedChats));
};
