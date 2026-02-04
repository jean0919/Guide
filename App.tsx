
import React, { useState, useEffect } from 'react';
import { TRIP_DATA, FLIGHT_INFO, EMERGENCY_CONTACTS, TRAVEL_NOTES_CATEGORIES, KOREAN_PHRASES } from './constants';
import { Category, ItineraryItem, DailyItinerary, Expense } from './types';
import { GoogleGenAI, Modality } from "@google/genai";

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
  )
};

// --- Helpers for Audio ---
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

// --- Sub-Components ---

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
    <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 mb-4 flex items-center justify-between border border-white/60 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{getIcon(weather.icon)}</span>
        <div>
          <p className="text-sm font-medium opacity-80">{weather.condition}</p>
          <p className="text-lg font-bold tracking-tight">{weather.temp}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] uppercase tracking-widest opacity-40">Weather Forecast</p>
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
      case Category.DINING: return '飲食';
      case Category.TRANSPORT: return '交通';
      default: return '其他';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 mb-4 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-gray-100 transition-active active:scale-98">
      <div className="flex items-start justify-between mb-2">
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${getCategoryColor(item.category)}`}>
          {getLabel(item.category)}
        </span>
        {item.time && <span className="text-xs text-gray-400">{item.time}</span>}
      </div>
      <h3 className="text-base font-bold text-gray-800 leading-snug mb-2">{item.title}</h3>
      {item.description && (
        <p className="text-sm text-gray-500 leading-relaxed font-light">{item.description}</p>
      )}
    </div>
  );
};

const KoreanSection: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [zoomedPhrase, setZoomedPhrase] = useState<any | null>(null);
  const [inputText, setInputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedResult, setTranslatedResult] = useState<any | null>(null);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Translate the following Chinese text to Korean: "${inputText}". Provide the Korean translation, its Romanized pronunciation, and its Japanese Katakana pronunciation in a JSON format: {"kr": "...", "rom": "...", "ja": "...", "zh": "${inputText}"}`,
        config: {
          responseMimeType: "application/json",
        }
      });
      const result = JSON.parse(response.text || '{}');
      setTranslatedResult(result);
    } catch (e) {
      console.error("Translation Error:", e);
    } finally {
      setIsTranslating(null); // use null or false to reset loading state
      setIsTranslating(false);
    }
  };

  const playTTS = async (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    try {
      setLoading(text);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say clearly in Korean: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        source.start();
      }
    } catch (e) {
      console.error("TTS Error:", e);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-6 pb-32">
      <h2 className="serif text-2xl font-bold mb-6 text-neutral-800">旅遊常用韓文</h2>
      
      {/* Real-time Translator */}
      <div className="mb-10 bg-neutral-900 rounded-[2.5rem] p-6 shadow-2xl">
        <h3 className="text-[10px] text-neutral-400 font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Icons.Sparkles />
          即時 AI 翻譯 (中翻韓)
        </h3>
        <div className="flex gap-2 mb-4">
          <input 
            type="text" 
            placeholder="輸入想翻譯的中文..."
            className="flex-1 bg-white/10 text-white rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/30 placeholder:text-white/20"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTranslate()}
          />
          <button 
            onClick={handleTranslate}
            disabled={isTranslating}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all bg-white text-neutral-900 ${isTranslating ? 'opacity-50' : 'active:scale-95'}`}
          >
            {isTranslating ? (
              <div className="w-4 h-4 border-2 border-neutral-800 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Icons.Translate />
            )}
          </button>
        </div>

        {translatedResult && (
          <div 
            onClick={() => setZoomedPhrase(translatedResult)}
            className="bg-white/10 rounded-3xl p-5 border border-white/10 flex items-center justify-between animate-in fade-in zoom-in duration-300"
          >
            <div className="flex-1 mr-4">
              <p className="text-lg font-bold text-white mb-0.5">{translatedResult.kr}</p>
              <div className="flex flex-col gap-0.5 mb-1">
                <p className="text-[10px] text-white/40 font-medium uppercase">{translatedResult.rom}</p>
                <p className="text-[10px] text-white/40">{translatedResult.ja}</p>
              </div>
            </div>
            <button 
              disabled={loading === translatedResult.kr}
              onClick={(e) => playTTS(e, translatedResult.kr)}
              className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center transition-all ${loading === translatedResult.kr ? 'bg-white/5 text-white/20' : 'bg-white text-neutral-900 active:scale-95'}`}
            >
              {loading === translatedResult.kr ? (
                <div className="w-4 h-4 border-2 border-neutral-300 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Icons.Play />
              )}
            </button>
          </div>
        )}
      </div>

      <p className="text-[10px] text-neutral-400 mb-6 uppercase tracking-wider bg-neutral-50 p-2 rounded-lg text-center">💡 點擊卡片可放大顯示，方便向當地人出示</p>
      
      <div className="space-y-10">
        {KOREAN_PHRASES.map((section, idx) => (
          <div key={idx}>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1 h-3 bg-neutral-900 rounded-full"></span>
              {section.category}
            </h3>
            <div className="space-y-4">
              {section.items.map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => setZoomedPhrase(item)}
                  className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm flex items-center justify-between active:scale-95 transition-transform"
                >
                  <div className="flex-1 mr-4">
                    <p className="text-lg font-bold text-neutral-800 mb-0.5">{item.kr}</p>
                    <div className="flex flex-col gap-0.5 mb-1">
                      <p className="text-[10px] text-neutral-400 font-medium uppercase">{item.rom}</p>
                      <p className="text-[10px] text-neutral-400">{item.ja}</p>
                    </div>
                    <p className="text-sm text-neutral-500">{item.zh}</p>
                  </div>
                  <button 
                    disabled={loading === item.kr}
                    onClick={(e) => playTTS(e, item.kr)}
                    className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all ${loading === item.kr ? 'bg-neutral-100 text-neutral-300' : 'bg-neutral-900 text-white shadow-lg active:scale-95'}`}
                  >
                    {loading === item.kr ? (
                      <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-800 rounded-full animate-spin"></div>
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
          className="fixed inset-0 z-[100] bg-white/98 backdrop-blur-xl flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-300"
          onClick={() => setZoomedPhrase(null)}
        >
          <button className="absolute top-10 right-10 text-neutral-400 p-2">
            <Icons.Close />
          </button>
          
          <div className="text-center w-full">
            <p className="text-xs font-bold text-neutral-300 uppercase tracking-[0.4em] mb-12">Show to Local</p>
            <h4 className="serif text-5xl font-black text-neutral-900 leading-tight mb-8 break-words px-4">
              {zoomedPhrase.kr}
            </h4>
            <div className="h-[1px] w-24 bg-neutral-100 mx-auto mb-8" />
            <p className="text-xl font-medium text-neutral-500 mb-2">{zoomedPhrase.zh}</p>
            <p className="text-xs text-neutral-400 uppercase tracking-widest">{zoomedPhrase.rom}</p>
          </div>
          
          <div className="absolute bottom-20 text-neutral-300 text-[10px] uppercase tracking-widest">
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
    <div className="p-6 pb-32">
      <h2 className="serif text-2xl font-bold mb-6 text-neutral-800">注意事項</h2>
      <div className="space-y-4">
        {TRAVEL_NOTES_CATEGORIES.map((cat) => (
          <div key={cat.id} className="bg-white rounded-3xl border border-neutral-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
            <button 
              onClick={() => toggle(cat.id)}
              className="w-full px-6 py-5 flex items-center justify-between text-left active:bg-neutral-50"
            >
              <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                <span className="w-1 h-4 bg-neutral-900 rounded-full"></span>
                {cat.label}
              </h3>
              <div className={expanded.includes(cat.id) ? 'rotate-180 transition-transform duration-300' : 'transition-transform duration-300'}>
                <Icons.ChevronDown />
              </div>
            </button>
            {expanded.includes(cat.id) && (
              <div className="px-6 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                {cat.items.map((item, idx) => (
                  <div key={idx} className="bg-neutral-50/50 rounded-2xl p-4">
                    <h4 className="text-xs font-bold text-neutral-700 mb-1">{item.title}</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>
            )}
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

  const memberStats = members.map(m => {
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

  const totalBudget = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="p-6 pb-32">
      <div className="flex justify-between items-center mb-6">
        <h2 className="serif text-2xl font-bold text-neutral-800">記帳與分帳</h2>
        <button 
          onClick={() => setShowMemberManager(!showMemberManager)}
          className="text-[10px] font-bold px-3 py-1 bg-neutral-100 rounded-full text-neutral-500 uppercase tracking-widest"
        >
          {showMemberManager ? '關閉成員' : '管理成員'}
        </button>
      </div>
      
      {showMemberManager && (
        <div className="bg-white rounded-3xl p-6 mb-8 border border-neutral-100 shadow-sm animate-in fade-in zoom-in duration-200">
          <h3 className="text-xs font-bold mb-4 uppercase tracking-widest text-neutral-400">成員列表</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {members.map(m => (
              <span key={m} className="px-3 py-1 bg-neutral-900 text-white text-xs rounded-full flex items-center gap-2">
                {m}
                {members.length > 1 && (
                  <button onClick={() => setMembers(members.filter(x => x !== m))} className="opacity-50 hover:opacity-100">×</button>
                )}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="新增成員姓名"
              className="flex-1 bg-neutral-50 rounded-xl px-4 py-2 text-xs outline-none"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
            />
            <button onClick={addMember} className="bg-neutral-200 text-neutral-800 px-4 py-2 rounded-xl text-xs font-bold">增加</button>
          </div>
        </div>
      )}

      {/* Settlement Report */}
      <div className="bg-neutral-900 text-white rounded-3xl p-6 mb-8 shadow-xl">
        <div className="mb-6 text-center">
          <p className="text-neutral-400 text-[10px] tracking-widest uppercase mb-1">Total Trip Budget</p>
          <p className="text-3xl font-bold tracking-tight">₩ {totalBudget.toLocaleString()}</p>
        </div>
        
        <div className="space-y-3 pt-4 border-t border-white/10">
          {memberStats.map(stat => (
            <div key={stat.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                  {stat.name[0]}
                </div>
                <span className="text-xs">{stat.name}</span>
              </div>
              <div className="text-right">
                <p className={`text-xs font-bold ${stat.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stat.balance >= 0 ? `+ ₩${Math.round(stat.balance).toLocaleString()}` : `- ₩${Math.round(Math.abs(stat.balance)).toLocaleString()}`}
                </p>
                <p className="text-[9px] opacity-30 tracking-tight">支出: ₩{stat.paid.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Form */}
      <div className="bg-white rounded-3xl p-5 mb-8 shadow-sm border border-neutral-100">
        <h3 className="text-xs font-bold mb-4 uppercase text-neutral-400 tracking-widest">新增支出</h3>
        <div className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="項目名稱 (例如：午餐、咖啡)" 
            className="w-full bg-neutral-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-200"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input 
            type="number" 
            placeholder="金額 (KRW)" 
            className="w-full bg-neutral-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-200"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
          />
          
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-neutral-400 font-bold uppercase pl-1">由誰支付？</label>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {members.map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedPayer(m)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedPayer === m ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-neutral-400 border border-neutral-100'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-neutral-400 font-bold uppercase pl-1">分帳對象 (參與的人)</label>
            <div className="grid grid-cols-2 gap-2">
              {members.map(m => (
                <button
                  key={m}
                  onClick={() => toggleParticipant(m)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${participants.includes(m) ? 'bg-neutral-50 border-neutral-200 text-neutral-800' : 'bg-white border-dashed border-neutral-100 text-neutral-300'}`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${participants.includes(m) ? 'bg-neutral-800 border-neutral-800 text-white' : 'border-neutral-200'}`}>
                    {participants.includes(m) && <Icons.Check />}
                  </div>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={addExpense}
            className="bg-neutral-800 text-white w-full py-3 rounded-xl text-sm font-bold active:scale-98 transition-transform shadow-lg shadow-neutral-200"
          >
            紀錄支出
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {expenses.length === 0 ? (
          <div className="text-center py-10 opacity-30 italic text-sm">尚無支出紀錄</div>
        ) : (
          expenses.map((expense) => (
            <div key={expense.id} className="bg-white rounded-3xl border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center">
                    <Icons.Wallet />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-800">{expense.title}</p>
                    <p className="text-[9px] text-neutral-400 uppercase tracking-tighter">
                      {expense.payer} 支付了此項 ₩{expense.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-bold text-neutral-700">₩{expense.amount.toLocaleString()}</p>
                  <button onClick={() => deleteExpense(expense.id)} className="text-red-100 hover:text-red-500 transition-colors p-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </div>
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
    <div className="p-6 pb-32">
      <h2 className="serif text-2xl font-bold mb-6 text-neutral-800">旅遊資訊</h2>
      
      {/* Flight Info */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Icons.Plane />
          <h3 className="font-bold text-neutral-800">航班資訊</h3>
        </div>
        <div className="space-y-4">
          {FLIGHT_INFO.map((flight, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="bg-neutral-100 text-[10px] font-black px-2 py-0.5 rounded text-neutral-600 tracking-tighter uppercase">{flight.no}</span>
                <span className="text-xs font-medium text-neutral-400">{flight.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-xs text-neutral-400 mb-1">DEPART</p>
                  <p className="text-lg font-bold">{flight.from.split(' ')[0]}</p>
                  <p className="text-xs font-medium text-neutral-500">{flight.from.match(/\((.*?)\)/)?.[1]}</p>
                </div>
                <div className="flex-1 flex flex-col items-center px-4">
                  <div className="w-full h-[1px] bg-neutral-100 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                      <Icons.Plane />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-neutral-400 mb-1">ARRIVE</p>
                  <p className="text-lg font-bold">{flight.to.split(' ')[0]}</p>
                  <p className="text-xs font-medium text-neutral-500">{flight.to.match(/\((.*?)\)/)?.[1]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Icons.Bed />
          <h3 className="font-bold text-neutral-800">住宿明細</h3>
        </div>
        <div className="space-y-4">
          {Array.from(new Set(TRIP_DATA.map(d => d.hotel.name))).map((hotelName, idx) => {
            const hotel = TRIP_DATA.find(d => d.hotel.name === hotelName)?.hotel;
            if (!hotel || hotel.name === '溫暖的家') return null;
            return (
              <div key={idx} className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm">
                <h4 className="text-sm font-bold mb-2 text-neutral-800">{hotel.name}</h4>
                <p className="text-xs text-neutral-500 mb-1 leading-relaxed">{hotel.address}</p>
                <p className="text-xs font-bold text-neutral-700">{hotel.phone}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Icons.Phone />
          <h3 className="font-bold text-neutral-800">緊急聯絡</h3>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm overflow-hidden">
          {EMERGENCY_CONTACTS.map((contact, idx) => (
            <div key={idx} className={`py-4 flex justify-between items-center ${idx !== EMERGENCY_CONTACTS.length - 1 ? 'border-b border-neutral-50' : ''}`}>
              <div>
                <p className="text-sm font-bold text-neutral-800">{contact.name}</p>
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest">{contact.role}</p>
              </div>
              <a href={`tel:${contact.phone.replace(/-/g, '')}`} className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-transform">
                撥打
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
    <div className="min-h-screen max-w-md mx-auto relative overflow-x-hidden pb-10">
      
      {activeTab === 'itinerary' && (
        <div className="px-6 pt-10 mb-6 animate-in fade-in duration-500">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-neutral-400 mb-1">Travel Handbook</p>
              <h1 className="serif text-3xl font-bold leading-tight text-neutral-800">韓國雪戀<br/>冰壁咖啡 5日</h1>
            </div>
            <div className="text-right">
              <span className="text-xs font-black bg-neutral-100 px-3 py-1 rounded-full text-neutral-500">FEB-MAR 2026</span>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-2 scroll-smooth no-scrollbar">
            {TRIP_DATA.map((day) => (
              <button 
                key={day.day}
                onClick={() => setSelectedDay(day.day)}
                className={`flex-shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all ${
                  selectedDay === day.day 
                    ? 'bg-neutral-900 text-white shadow-lg' 
                    : 'bg-white text-neutral-400 border border-neutral-100'
                }`}
              >
                <span className="text-[10px] font-bold uppercase opacity-60">Day</span>
                <span className="text-xl font-black">{day.day}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="transition-all duration-300">
        {activeTab === 'itinerary' && (
          <div className="px-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-neutral-800">
                  {currentDayData.date} ({currentDayData.weekday})
                </h2>
                <span className="text-xs text-neutral-400 font-medium">{currentDayData.location}</span>
              </div>
              <WeatherHeader weather={currentDayData.weather} />
            </div>

            <div className="relative pl-6">
              <div className="absolute left-1 top-4 bottom-4 w-[1px] bg-neutral-200" />
              {currentDayData.items.map((item) => (
                <div key={item.id} className="relative mb-6 last:mb-0">
                  <div className="absolute -left-[24px] top-4 w-3 h-3 rounded-full bg-neutral-200 border-2 border-white shadow-sm" />
                  <ItineraryCard item={item} />
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-neutral-100">
              <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-4">Tonight Accommodation</h3>
              <div className="bg-white rounded-3xl p-5 border border-neutral-100">
                <p className="text-sm font-bold text-neutral-800 mb-1">{currentDayData.hotel.name}</p>
                <p className="text-xs text-neutral-400 mb-3">{currentDayData.hotel.address}</p>
                {currentDayData.hotel.phone !== '-' && (
                  <div className="flex gap-2">
                    <a href={`tel:${currentDayData.hotel.phone.replace(/-/g, '')}`} className="text-[10px] font-bold px-3 py-1.5 bg-neutral-50 text-neutral-600 rounded-lg">Call Front Desk</a>
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

      {/* Persistent Navigation Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-sm bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_12px_32px_rgba(0,0,0,0.08)] rounded-[2.5rem] px-2 py-3 flex items-center justify-around z-50">
        <button 
          onClick={() => setActiveTab('itinerary')}
          className={`p-3 rounded-full transition-all ${activeTab === 'itinerary' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-300'}`}
          aria-label="Itinerary"
        >
          <Icons.Map />
        </button>
        <button 
          onClick={() => setActiveTab('info')}
          className={`p-3 rounded-full transition-all ${activeTab === 'info' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-300'}`}
          aria-label="Travel Info"
        >
          <Icons.Info />
        </button>
        <button 
          onClick={() => setActiveTab('korean')}
          className={`p-3 rounded-full transition-all ${activeTab === 'korean' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-300'}`}
          aria-label="Korean Phrases"
        >
          <Icons.Translate />
        </button>
        <button 
          onClick={() => setActiveTab('notes')}
          className={`p-3 rounded-full transition-all ${activeTab === 'notes' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-300'}`}
          aria-label="Notes"
        >
          <Icons.Note />
        </button>
        <button 
          onClick={() => setActiveTab('budget')}
          className={`p-3 rounded-full transition-all ${activeTab === 'budget' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-300'}`}
          aria-label="Budget"
        >
          <Icons.Wallet />
        </button>
      </div>

      <div className="fixed -top-24 -right-24 w-64 h-64 bg-orange-100 rounded-full blur-[100px] opacity-30 -z-10" />
      <div className="fixed -bottom-24 -left-24 w-64 h-64 bg-blue-100 rounded-full blur-[100px] opacity-30 -z-10" />
    </div>
  );
};

export default App;
