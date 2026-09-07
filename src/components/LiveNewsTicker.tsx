import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Radio,
  Globe2,
  Newspaper,
  Flag,
  MapPin,
  Pause,
  Play,
  Share2,
  ExternalLink,
  X,
  ChevronRight,
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  CheckCircle2,
} from 'lucide-react';
import { LiveHeadline, TabType } from '../types';
import { storageService } from '../services/storageService';

interface Props {
  noticeText?: string;
  onNavigate: (tab: TabType, extra?: any) => void;
}

type TickerCategory = 'all' | 'newspaper' | 'national' | 'international' | 'local';

export const LiveNewsTicker: React.FC<Props> = ({ noticeText, onNavigate }) => {
  const [headlines, setHeadlines] = useState<LiveHeadline[]>([]);
  const [activeCategory, setActiveCategory] = useState<TickerCategory>('all');
  const [isPaused, setIsPaused] = useState(false);
  const [selectedHeadline, setSelectedHeadline] = useState<LiveHeadline | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const loaded = storageService.getLiveHeadlines();
    setHeadlines(loaded);
  }, []);

  // Handle Voice Reader (Text to Speech)
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'bn-BD';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const categories = [
    { id: 'all' as TickerCategory, label: 'সব খবর', icon: Flame, badgeBg: 'bg-red-600' },
    { id: 'newspaper' as TickerCategory, label: 'দৈনিক পত্রিকা', icon: Newspaper, badgeBg: 'bg-rose-600' },
    { id: 'national' as TickerCategory, label: 'জাতীয়', icon: Flag, badgeBg: 'bg-emerald-600' },
    { id: 'international' as TickerCategory, label: 'আন্তর্জাতিক', icon: Globe2, badgeBg: 'bg-blue-600' },
    { id: 'local' as TickerCategory, label: 'জামালপুর', icon: MapPin, badgeBg: 'bg-teal-600' },
  ];

  const filteredHeadlines = useMemo(() => {
    if (activeCategory === 'all') return headlines;
    return headlines.filter((h) => h.category === activeCategory);
  }, [headlines, activeCategory]);

  const handleShare = (item: LiveHeadline) => {
    const shareText = `${item.title} — উৎস: ${item.source} (Our Jamalpur)`;
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: shareText,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      id="live-news-ticker-container"
      className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-emerald-500/30 text-white shadow-md select-none relative z-30 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-1.5 flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3">
        {/* Left Side: Channel Selector & Live Indicator */}
        <div className="flex items-center justify-between md:justify-start gap-1.5 shrink-0">
          {/* Glowing Live Indicator */}
          <div className="flex items-center gap-1.5 bg-red-600/90 text-white px-2.5 py-1 rounded-lg text-xs font-extrabold tracking-wide shadow-xs shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="tracking-wider">লাইভ স্ক্রলিং</span>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 max-w-[210px] sm:max-w-none">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`ticker-cat-tab-${cat.id}`}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? `${cat.badgeBg} text-white shadow-xs scale-105`
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title={`${cat.label} সংক্রান্ত লাইভ স্ক্রলিং দেখুন`}
                >
                  <IconComp className="w-3 h-3" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Pause / Play Control */}
          <button
            id="ticker-pause-toggle-btn"
            onClick={() => setIsPaused((prev) => !prev)}
            className="p-1 px-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 text-xs transition cursor-pointer shrink-0 flex items-center gap-1"
            title={isPaused ? 'স্ক্রলিং পুনরায় চালু করুন' : 'স্ক্রলিং সাময়িক থামান (মাউস রাখলেও থামবে)'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
            <span className="text-[10px] font-medium hidden sm:inline">
              {isPaused ? 'চালু' : 'পজ'}
            </span>
          </button>
        </div>

        {/* Center: Smooth Marquee Track (Always Natural Normal Speed) */}
        <div
          className="flex-1 overflow-hidden relative py-0.5 rounded-lg bg-slate-950/70 border border-slate-800/60 px-2 min-h-[28px] flex items-center group cursor-pointer"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onClick={() => {
            if (filteredHeadlines.length > 0) {
              setSelectedHeadline(filteredHeadlines[0]);
            }
          }}
          title="খবরের বিস্তারিত পড়তে যেকোনো শিরোনামে ক্লিক করুন (মাউস আনলে স্বয়ংক্রিয়ভাবে স্ক্রলিং থামবে)"
        >
          <div
            className={`whitespace-nowrap flex items-center gap-8 ${isPaused ? '' : 'animate-marquee-normal'} text-xs font-semibold`}
          >
            {/* First Set of Items */}
            {filteredHeadlines.map((item, idx) => (
              <button
                key={`${item.id}-1-${idx}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedHeadline(item);
                }}
                className="inline-flex items-center gap-2 hover:text-amber-300 transition text-left cursor-pointer shrink-0 py-0.5"
              >
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-md text-white ${
                    item.badgeBg || 'bg-emerald-600'
                  }`}
                >
                  {item.source}
                </span>
                <span className="text-slate-100 group-hover:text-amber-200 font-medium">
                  {item.title}
                </span>
                <span className="text-[10px] text-amber-400/80 font-normal">
                  ({item.time})
                </span>
                <span className="text-emerald-500 font-bold ml-2">✦</span>
              </button>
            ))}

            {/* Duplicate Set for Infinite Smooth Loop */}
            {filteredHeadlines.map((item, idx) => (
              <button
                key={`${item.id}-2-${idx}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedHeadline(item);
                }}
                className="inline-flex items-center gap-2 hover:text-amber-300 transition text-left cursor-pointer shrink-0 py-0.5"
              >
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-md text-white ${
                    item.badgeBg || 'bg-emerald-600'
                  }`}
                >
                  {item.source}
                </span>
                <span className="text-slate-100 group-hover:text-amber-200 font-medium">
                  {item.title}
                </span>
                <span className="text-[10px] text-amber-400/80 font-normal">
                  ({item.time})
                </span>
                <span className="text-emerald-500 font-bold ml-2">✦</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: News Hub Shortcut */}
        <div className="hidden lg:flex items-center gap-1.5 shrink-0">
          <button
            id="ticker-open-all-news-btn"
            onClick={() => onNavigate('news')}
            className="text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1 bg-emerald-700/80 hover:bg-emerald-600 px-3 py-1 rounded-lg transition cursor-pointer shadow-xs"
          >
            <Newspaper className="w-3.5 h-3.5 text-amber-300" />
            <span>সকল খবর ও পত্রিকা</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Modal to Read Full Headline / Paper Story with Bangla Voice Reader */}
      {selectedHeadline && (
        <div
          id="headline-reader-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in"
          onClick={() => {
            stopSpeaking();
            setSelectedHeadline(null);
          }}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white space-y-4 animate-scale-up relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Source Badge, Voice Reader & Close */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-black px-2.5 py-1 rounded-lg text-white ${
                    selectedHeadline.badgeBg || 'bg-emerald-600'
                  }`}
                >
                  {selectedHeadline.source}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {selectedHeadline.categoryLabel} • {selectedHeadline.time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Voice Reader Button */}
                <button
                  onClick={() => speakText(`${selectedHeadline.title}। ${selectedHeadline.summary || ''}`)}
                  className={`p-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    isSpeaking
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'
                  }`}
                  title="সংবাদটি অডিওতে বাংলায় শুনুন"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>বন্ধ করুন</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>শুনুন</span>
                    </>
                  )}
                </button>
                <button
                  id="headline-modal-close-btn"
                  onClick={() => {
                    stopSpeaking();
                    setSelectedHeadline(null);
                  }}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Headline Title */}
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md mb-2">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>লাইভ ব্রেকিং বুলেটিন</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                {selectedHeadline.title}
              </h2>
            </div>

            {/* Headline Summary Details */}
            {selectedHeadline.summary && (
              <div className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedHeadline.summary}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <div className="flex items-center gap-2">
                <button
                  id="headline-share-btn"
                  onClick={() => handleShare(selectedHeadline)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-slate-500" />
                      <span>শেয়ার / কপি</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="headline-explore-all-btn"
                  onClick={() => {
                    stopSpeaking();
                    setSelectedHeadline(null);
                    onNavigate('news');
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Newspaper className="w-4 h-4" />
                  <span>সংবাদ পাতায় যান</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
