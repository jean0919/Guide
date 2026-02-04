
import React, { useState, useEffect, useMemo } from 'react';
import { TRIP_DATA, FLIGHT_INFO, EMERGENCY_CONTACTS, TRAVEL_NOTES_CATEGORIES, KOREAN_PHRASES } from './constants';
import { Category, ItineraryItem, DailyItinerary, Expense } from './types';
import { GoogleGenAI, Modality, Type } from "@google/genai";

// --- Icons ---
const Icons = {
  Map: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  ),
  Info: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Wallet: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  Note: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Translate: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 11.37 9.19 15.378 6 17.625M3 16.243C5.174 15.056 8.01 13.013 9.634 8" />
    </svg>
  ),
  Plane: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  Bed: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Phone: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  Play: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Close: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Delete: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
};

// --- Helpers ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// --- Components ---

const WeatherHeader: React.FC<{ weather: DailyItinerary['weather'] }> = ({ weather }) => {
  const getIcon = (icon: string) => {
    switch(icon) {
      case 'snow': return '❄️';
      case 'cloud-sun': return '⛅';
      case 'sun': return '☀️';
      case 'cloud': return '☁️';
      default: return '🌡️';
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-md rounded-3xl p-5 mb-6 flex items-center justify-between border border-blue-100/50 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-blue-50">
          {getIcon(weather.icon)}
        </div>
        <div>
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">{weather.condition}</p>
          <p className="text-2xl font-black text-slate-800 tracking-tight">{weather.temp}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60">Forecast</p>
      </div>
    </div>
  );
};

const ItineraryCard: React.FC<{ item: ItineraryItem }> = ({ item }) => {
  const getCategoryColor = (cat: Category) => {
    switch (cat) {
      case Category.SIGHTSEEING: return 'bg-orange-50 text-orange-600 border-orange-100';
      case Category.DINING: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case Category.TRANSPORT: return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getLabel = (cat: Category) => {
    switch (cat) {
      case Category.SIGHTSEEING: return '景點';
      case Category.DINING: return '美食';
      case Category.TRANSPORT: return '交通';
      default: return '其他';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 mb-5 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.08)] border border-slate-50 transition-all active:scale-[0.98]">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-black uppercase tracking-wider ${getCategoryColor(item.category)}`}>
          {getLabel(item.category)}
        </span>
        {item.time && <span className="text-xs font-medium text-slate-400">{item.time}</span>}
      </div>
      <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2">{item.title}</h3>
      {item.description && (
        <p className="text-sm text-slate-500 leading-relaxed font-light">{item.description}</p>
      )}
    </div>
  );
};

const KoreanSection: React.FC = () => {
  const [playingText, setPlayingText] = useState<string | null>(null);
  const [zoomedPhrase, setZoomedPhrase] = useState<any | null>(null);
  const [inputText, setInputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedResult, setTranslatedResult] = useState<any | null>(null);

  // Fix: Improved translation call with responseSchema following best practices
  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Translate the following Chinese text to Korean: "${inputText}". Provide details for travel use.`,
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              kr: { type: Type.STRING, description: 'The Korean translation.' },
              rom: { type: Type.STRING, description: 'The Romanized pronunciation.' },
              ja: { type: Type.STRING, description: 'The Japanese Katakana pronunciation.' },
              zh: { type: Type.STRING, description: 'The original Chinese text.' }
            },
            required: ["kr", "rom", "ja", "zh"]
          }
        }
      });
      const result = JSON.parse(response.text || '{}');
      setTranslatedResult(result);
    } catch (e) {
      console.error("Translation Error:", e);
    } finally {
      setIsTranslating(false);
    }
  };

  // Fix: Standard usage of GoogleGenAI and response parts for TTS
  const playTTS = async (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    if (playingText) return;
    try {
      setPlayingText(text);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say clearly in Korean: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        source.onended = () => setPlayingText(null);
        source.start();
      } else {
        setPlayingText(null);
      }
    } catch (e) {
      console.error("TTS Error:", e);
      setPlayingText(null);
    }
  };

  return (
    <div className="px-6 py-10 pb-32 animate-in fade-in duration-500">
      <h2 className="serif text-3xl font-bold mb-8 text-slate-900">語言助手</h2>
      
      {/* AI Translator */}
      <div className="mb-12 bg-slate-900 rounded-[2.5rem] p-7 shadow-2xl shadow-slate-200">
        <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.25em] mb-5 flex items-center gap-2">
          <Icons.Sparkles />
          AI 即時翻譯 (中翻韓)
        </h3>
        <div className="flex gap-2 mb-5">
          <input 
            type="text" 
            placeholder="你想說什麼？"
            className="flex-1 bg-white/10 text-white rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 placeholder:text-white/20 transition-all"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTranslate()}
          />
          <button 
            onClick={handleTranslate}
            disabled={isTranslating}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all bg-white text-slate-900 shadow-xl ${isTranslating ? 'opacity-50' : 'active:scale-90'}`}
          >
            {isTranslating ? (
              <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Icons.Translate />
            )}
          </button>
        </div>

        {translatedResult && (
          <div 
            onClick={() => setZoomedPhrase(translatedResult)}
            className="bg-white/5 hover:bg-white/10 rounded-3xl p-6 border border-white/10 flex items-center justify-between transition-colors animate-in zoom-in-95 duration-300"
          >
            <div className="flex-1 mr-4">
              <p className="text-xl font-bold text-white mb-1 tracking-tight">{translatedResult.kr}</p>
              <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest mb-2">{translatedResult.rom}</p>
              <p className="text-sm text-white/60 font-medium">{translatedResult.zh}</p>
            </div>
            <button 
              disabled={!!playingText}
              onClick={(e) => playTTS(e, translatedResult.kr)}
              className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all ${playingText === translatedResult.kr ? 'bg-white/10 text-white/20' : 'bg-white text-slate-900 active:scale-90 shadow-lg'}`}
            >
              {playingText === translatedResult.kr ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Icons.Play />
              )}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-12">
        {KOREAN_PHRASES.map((section, idx) => (
          <div key={idx}>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1.5 h-6 bg-slate-900 rounded-full"></span>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{section.category}</h3>
            </div>
            <div className="space-y-4">
              {section.items.map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => setZoomedPhrase(item)}
                  className="bg-white group rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between active:scale-[0.97] transition-all hover:shadow-md"
                >
                  <div className="flex-1 mr-4">
                    <p className="text-xl font-bold text-slate-800 mb-1 tracking-tight">{item.kr}</p>
                    <div className="flex flex-col gap-0.5 mb-2">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.rom}</p>
                    </div>
                    <p className="text-sm font-medium text-slate-500">{item.zh}</p>
                  </div>
                  <button 
                    disabled={!!playingText}
                    onClick={(e) => playTTS(e, item.kr)}
                    className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all ${playingText === item.kr ? 'bg-slate-100 text-slate-300' : 'bg-slate-900 text-white shadow-lg active:scale-90 group-hover:scale-105'}`}
                  >
                    {playingText === item.kr ? (
                      <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
                    ) : (
                      <Icons.Play />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Zoom Overlay */}
      {zoomedPhrase && (
        <div 
          className="fixed inset-0 z-[100] bg-white/98 backdrop-blur-2xl flex flex-col items-center justify-center p-10 animate-in fade-in zoom-in duration-300"
          onClick={() => setZoomedPhrase(null)}
        >
          <button className="absolute top-12 right-12 text-slate-300 p-3 hover:text-slate-900 transition-colors">
            <Icons.Close />
          </button>
          
          <div className="text-center w-full max-w-sm">
            <p className="text-xs font-black text-slate-300 uppercase tracking-[0.5em] mb-16">Show to Local</p>
            <h4 className="serif text-6xl font-black text-slate-900 leading-tight mb-10 break-words">
              {zoomedPhrase.kr}
            </h4>
            <div className="h-0.5 w-16 bg-slate-100 mx-auto mb-10 rounded-full" />
            <p className="text-2xl font-bold text-slate-600 mb-4">{zoomedPhrase.zh}</p>
            <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.3em]">{zoomedPhrase.rom}</p>
          </div>
          
          <div className="absolute bottom-20 text-slate-300 text-[10px] font-black uppercase tracking-[0.4em]">
            Tap anywhere to close
          </div>
        </div>
      )}
    </div>
  );
};

const NotesSection: React.FC = () => {
  const [expanded, setExpanded] = useState<string[]>(['prep']);

  const toggle = (id: string) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="px-6 py-10 pb-32 animate-in fade-in duration-500">
      <h2 className="serif text-3xl font-bold mb-8 text-slate-900">行前與注意事項</h2>
      <div className="space-y-6">
        {TRAVEL_NOTES_CATEGORIES.map((cat) => (
          <div key={cat.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <button 
              onClick={() => toggle(cat.id)}
              className="w-full px-7 py-6 flex items-center justify-between text-left active:bg-slate-50 transition-colors"
            >
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-3">
                <span className="w-1.5 h-5 bg-slate-900 rounded-full"></span>
                {cat.label}
              </h3>
              <div className={expanded.includes(cat.id) ? 'rotate-180 transition-transform duration-500' : 'transition-transform duration-500'}>
                <Icons.ChevronDown />
              </div>
            </button>
            <div className={`transition-all duration-500 ease-in-out ${expanded.includes(cat.id) ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
              <div className="px-7 pb-8 space-y-5">
                {cat.items.map((item, idx) => (
                  <div key={idx} className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100/50">
                    <h4 className="text-xs font-black text-slate-900 mb-2 uppercase tracking-wider">{item.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BudgetSection: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('trip_expenses');
    return saved ? JSON.parse(saved) : [];
  });
  const [members, setMembers] = useState<string[]>(() => {
    const saved = localStorage.getItem('trip_members');
    return saved ? JSON.parse(saved) : ['我'];
  });
  
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [selectedPayer, setSelectedPayer] = useState(members[0]);
  const [participants, setParticipants] = useState<string[]>(members);
  const [newMemberName, setNewMemberName] = useState('');
  const [showMemberManager, setShowMemberManager] = useState(false);

  useEffect(() => {
    localStorage.setItem('trip_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('trip_members', JSON.stringify(members));
  }, [members]);

  const addExpense = () => {
    if (!newTitle || !newAmount || participants.length === 0) return;
    const expense: Expense = {
      id: Date.now().toString(),
      title: newTitle,
      amount: parseFloat(newAmount),
      category: 'General',
      date: new Date().toLocaleDateString(),
      payer: selectedPayer,
      participants: [...participants]
    };
    setExpenses([expense, ...expenses]);
    setNewTitle('');
    setNewAmount('');
  };

  const toggleParticipant = (m: string) => {
    setParticipants(prev => prev.includes(m) ? prev.filter(p => p !== m) : [...prev, m]);
  };

  const addMember = () => {
    if (!newMemberName || members.includes(newMemberName)) return;
    const updatedMembers = [...members, newMemberName];
    setMembers(updatedMembers);
    setParticipants(updatedMembers);
    setNewMemberName('');
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const memberStats = useMemo(() => {
    return members.map(m => {
      const totalPaidByMe = expenses
        .filter(e => e.payer === m)
        .reduce((acc, curr) => acc + curr.amount, 0);
      
      const totalIShouldPay = expenses.reduce((acc, curr) => {
        if (curr.participants.includes(m)) {
          return acc + (curr.amount / curr.participants.length);
        }
        return acc;
      }, 0);
      
      return { name: m, balance: totalPaidByMe - totalIShouldPay, paid: totalPaidByMe };
    });
  }, [expenses, members]);

  const totalBudget = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="px-6 py-10 pb-32 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="serif text-3xl font-bold text-slate-900">預算分帳</h2>
        <button 
          onClick={() => setShowMemberManager(!showMemberManager)}
          className="text-[10px] font-black px-4 py-2 bg-slate-100 rounded-full text-slate-600 uppercase tracking-[0.2em] shadow-sm active:scale-95 transition-all"
        >
          {showMemberManager ? '關閉' : '管理成員'}
        </button>
      </div>
      
      {showMemberManager && (
        <div className="bg-white rounded-[2rem] p-7 mb-10 border border-slate-100 shadow-xl animate-in zoom-in-95 duration-300">
          <h3 className="text-xs font-black mb-5 uppercase tracking-widest text-slate-400">旅行成員</h3>
          <div className="flex flex-wrap gap-2.5 mb-6">
            {members.map(m => (
              <span key={m} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-sm">
                {m}
                {members.length > 1 && (
                  <button onClick={() => setMembers(members.filter(x => x !== m))} className="opacity-50 hover:opacity-100 text-lg">×</button>
                )}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="新增成員姓名"
              className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200 transition-all"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addMember()}
            />
            <button onClick={addMember} className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-slate-200 active:scale-90 transition-all">
              <Icons.Plus />
            </button>
          </div>
        </div>
      )}

      {/* Summary Report */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2.5rem] p-8 mb-10 shadow-2xl shadow-slate-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="mb-8 text-center">
          <p className="text-slate-400 text-[10px] tracking-[0.4em] uppercase font-black mb-2 opacity-60">Total Spending</p>
          <p className="text-4xl font-black tracking-tighter">₩ {totalBudget.toLocaleString()}</p>
        </div>
        
        <div className="space-y-4 pt-6 border-t border-white/10">
          {memberStats.map(stat => (
            <div key={stat.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-xs font-black">
                  {stat.name[0]}
                </div>
                <span className="text-sm font-bold">{stat.name}</span>
              </div>
              <div className="text-right">
                <p className={`text-sm font-black tracking-tight ${stat.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stat.balance >= 0 ? `+ ₩${Math.round(stat.balance).toLocaleString()}` : `- ₩${Math.round(Math.abs(stat.balance)).toLocaleString()}`}
                </p>
                <p className="text-[9px] text-white/30 font-bold tracking-widest uppercase">Spent: ₩{stat.paid.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Form */}
      <div className="bg-white rounded-[2.5rem] p-7 mb-10 shadow-sm border border-slate-50">
        <h3 className="text-xs font-black mb-6 uppercase text-slate-400 tracking-[0.2em]">紀錄支出</h3>
        <div className="flex flex-col gap-5">
          <input 
            type="text" 
            placeholder="項目 (如：炸雞、咖啡)" 
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input 
            type="number" 
            placeholder="金額 (KRW)" 
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
          />
          
          <div className="flex flex-col gap-3">
            <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest pl-1">付款人</label>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {members.map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedPayer(m)}
                  className={`flex-shrink-0 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${selectedPayer === m ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest pl-1">參與分帳</label>
            <div className="grid grid-cols-2 gap-3">
              {members.map(m => (
                <button
                  key={m}
                  onClick={() => toggleParticipant(m)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold border transition-all ${participants.includes(m) ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white border-dashed border-slate-200 text-slate-300'}`}
                >
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${participants.includes(m) ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200'}`}>
                    {participants.includes(m) && <Icons.Check />}
                  </div>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={addExpense}
            className="bg-slate-900 text-white w-full py-5 rounded-[1.5rem] text-sm font-black active:scale-[0.98] transition-all shadow-xl shadow-slate-200 mt-2"
          >
            確定紀錄
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {expenses.length === 0 ? (
          <div className="text-center py-20 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-100">
            <p className="text-slate-300 text-sm italic font-medium">尚無支出紀錄</p>
          </div>
        ) : (
          expenses.map((expense) => (
            <div key={expense.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex items-center justify-between group animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-inner">
                  <Icons.Wallet />
                </div>
                <div>
                  <p className="text-base font-bold text-slate-800">{expense.title}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                    {expense.payer} 付款 • {expense.participants.length} 人平分
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-base font-black text-slate-700">₩{expense.amount.toLocaleString()}</p>
                <button 
                  onClick={() => deleteExpense(expense.id)} 
                  className="text-slate-200 hover:text-rose-500 transition-colors p-2 active:scale-90"
                >
                  <Icons.Delete />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const InfoSection: React.FC = () => {
  return (
    <div className="px-6 py-10 pb-32 animate-in fade-in duration-500">
      <h2 className="serif text-3xl font-bold mb-10 text-slate-900">核心旅遊資訊</h2>
      
      {/* Flight Boarding Pass Style */}
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Icons.Plane /></div>
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">航班細節</h3>
        </div>
        <div className="space-y-6">
          {FLIGHT_INFO.map((flight, idx) => (
            <div key={idx} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-lg shadow-slate-100 overflow-hidden">
              <div className="bg-slate-900 px-7 py-4 flex justify-between items-center">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Jin Air</span>
                <span className="bg-white/10 text-[10px] font-black px-3 py-1 rounded-full text-white tracking-widest">{flight.no}</span>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Depart</p>
                    <p className="text-3xl font-black text-slate-800">{flight.from.split(' ')[0]}</p>
                    <p className="text-xs font-bold text-slate-500 mt-1">{flight.from.match(/\((.*?)\)/)?.[1]}</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center px-6 relative">
                    <div className="w-full h-[1px] border-t border-dashed border-slate-200 mb-1"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[1px] bg-white px-3 text-slate-200">
                      <Icons.Plane />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Arrive</p>
                    <p className="text-3xl font-black text-slate-800">{flight.to.split(' ')[0]}</p>
                    <p className="text-xs font-bold text-slate-500 mt-1">{flight.to.match(/\((.*?)\)/)?.[1]}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{flight.date}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Icons.Bed /></div>
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">下榻飯店</h3>
        </div>
        <div className="space-y-5">
          {Array.from(new Set(TRIP_DATA.map(d => d.hotel.name))).map((hotelName, idx) => {
            const hotel = TRIP_DATA.find(d => d.hotel.name === hotelName)?.hotel;
            if (!hotel || hotel.name === '溫寒的家') return null;
            return (
              <div key={idx} className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-lg font-bold mb-2 text-slate-800">{hotel.name}</h4>
                <div className="flex items-start gap-2 mb-4">
                  <div className="w-4 h-4 text-slate-300 mt-0.5"><Icons.Map /></div>
                  <p className="text-sm text-slate-500 leading-relaxed">{hotel.address}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black text-slate-400 tracking-widest">{hotel.phone}</p>
                  <a href={`tel:${hotel.phone.replace(/-/g, '')}`} className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-slate-200 active:scale-95 transition-all">
                    Call
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><Icons.Phone /></div>
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">緊急聯絡網</h3>
        </div>
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
          {EMERGENCY_CONTACTS.map((contact, idx) => (
            <div key={idx} className="p-7 flex justify-between items-center hover:bg-slate-50 transition-colors">
              <div>
                <p className="text-base font-bold text-slate-800">{contact.name}</p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-0.5">{contact.role}</p>
              </div>
              <a href={`tel:${contact.phone.replace(/-/g, '')}`} className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center active:scale-90 transition-all">
                <Icons.Phone />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

type AppTab = 'itinerary' | 'info' | 'korean' | 'notes' | 'budget';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('itinerary');
  const [selectedDay, setSelectedDay] = useState(1);

  const currentDayData = TRIP_DATA.find(d => d.day === selectedDay)!;

  return (
    <div className="min-h-screen bg-[#f8fafc] max-w-md mx-auto relative overflow-x-hidden pb-10">
      
      {activeTab === 'itinerary' && (
        <div className="px-6 pt-12 mb-8 animate-in fade-in duration-700">
          <div className="flex justify-between items-start mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-300 mb-2">Winter Korea 2026</p>
              <h1 className="serif text-4xl font-black leading-tight text-slate-900">雪戀冰壁<br/>五日遊小助手</h1>
            </div>
            <div className="pt-2">
              <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-xl shadow-sm">❄️</div>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
            {TRIP_DATA.map((day) => (
              <button 
                key={day.day}
                onClick={() => setSelectedDay(day.day)}
                className={`flex-shrink-0 w-[4.5rem] h-[5rem] rounded-[1.75rem] flex flex-col items-center justify-center transition-all duration-300 ${
                  selectedDay === day.day 
                    ? 'bg-slate-900 text-white shadow-xl translate-y-[-4px]' 
                    : 'bg-white text-slate-400 border border-slate-100'
                }`}
              >
                <span className="text-[9px] font-black uppercase opacity-60 tracking-widest mb-1">Day</span>
                <span className="text-2xl font-black">{day.day}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="transition-all duration-300">
        {activeTab === 'itinerary' && (
          <div className="px-6 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-black text-slate-800 tracking-tight">
                  {currentDayData.date} ({currentDayData.weekday})
                </h2>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{currentDayData.location}</span>
                </div>
              </div>
              <WeatherHeader weather={currentDayData.weather} />
            </div>

            <div className="relative pl-7">
              <div className="absolute left-1.5 top-6 bottom-6 w-[2px] bg-slate-100 rounded-full" />
              {currentDayData.items.map((item) => (
                <div key={item.id} className="relative mb-8 last:mb-0">
                  <div className="absolute -left-[27px] top-6 w-3 h-3 rounded-full bg-white border-[3px] border-slate-900 shadow-sm z-10" />
                  <ItineraryCard item={item} />
                </div>
              ))}
            </div>
            
            <div className="mt-12 pt-10 border-t border-slate-100">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6">Tonight Stay</h3>
              <div className="bg-white rounded-[2rem] p-7 border border-slate-100 shadow-sm">
                <p className="text-base font-bold text-slate-800 mb-1">{currentDayData.hotel.name}</p>
                <p className="text-xs text-slate-400 mb-5 leading-relaxed">{currentDayData.hotel.address}</p>
                {currentDayData.hotel.phone !== '-' && (
                  <div className="flex gap-3">
                    <a href={`tel:${currentDayData.hotel.phone.replace(/-/g, '')}`} className="flex-1 bg-slate-900 text-white text-center py-3.5 rounded-2xl text-xs font-bold shadow-lg shadow-slate-200 active:scale-95 transition-all">
                      聯繫櫃檯
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'info' && <InfoSection />}
        {activeTab === 'korean' && <KoreanSection />}
        {activeTab === 'notes' && <NotesSection />}
        {activeTab === 'budget' && <BudgetSection />}
      </div>

      {/* Floating Navigation Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-sm bg-white/80 backdrop-blur-2xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-[2.5rem] px-3 py-3.5 flex items-center justify-around z-[90] animate-in slide-in-from-bottom-10 duration-1000">
        {[
          { id: 'itinerary', icon: <Icons.Map />, label: '行程' },
          { id: 'info', icon: <Icons.Info />, label: '資訊' },
          { id: 'korean', icon: <Icons.Translate />, label: '翻譯' },
          { id: 'notes', icon: <Icons.Note />, label: '錦囊' },
          { id: 'budget', icon: <Icons.Wallet />, label: '預算' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AppTab)}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all duration-300 ${activeTab === tab.id ? 'text-slate-900 scale-110' : 'text-slate-300 hover:text-slate-400'}`}
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl rotate-[-4deg]' : ''}`}>
              {tab.icon}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${activeTab === tab.id ? 'opacity-100' : 'opacity-0 scale-50'}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Background Decor */}
      <div className="fixed -top-40 -right-40 w-96 h-96 bg-blue-100/40 rounded-full blur-[120px] -z-10" />
      <div className="fixed -bottom-40 -left-40 w-96 h-96 bg-indigo-100/40 rounded-full blur-[120px] -z-10" />
    </div>
  );
};

export default App;
