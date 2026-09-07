import React, { useState, useMemo, useEffect } from 'react';
import {
  Newspaper,
  MapPin,
  Calendar,
  User,
  Eye,
  Search,
  Share2,
  ArrowRight,
  X,
  Sparkles,
  Radio,
  Globe2,
  Flag,
  Flame,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import { NewsItem, LiveHeadline } from '../types';
import { storageService } from '../services/storageService';

interface Props {
  selectedNews?: NewsItem | null;
}

export const NewsView: React.FC<Props> = ({ selectedNews: initialNews }) => {
  const [newsList, setNewsList] = useState<NewsItem[]>(storageService.getNews());
  const [liveHeadlines, setLiveHeadlines] = useState<LiveHeadline[]>(storageService.getLiveHeadlines());
  const dailyNewspapers = storageService.getDailyNewspapers();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(initialNews || null);
  const [activeHeadline, setActiveHeadline] = useState<LiveHeadline | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');

  const categories = [
    { id: 'all', label: 'সব খবর' },
    { id: 'জাতীয়', label: '🇧🇩 জাতীয় সংবাদ' },
    { id: 'আন্তর্জাতিক', label: '🌍 আন্তর্জাতিক' },
    { id: 'পত্রিকা শিরোনাম', label: '📰 দৈনিক পত্রিকা' },
    { id: 'সদর', label: 'জামালপুর সদর' },
    { id: 'ইসলামপুর', label: 'ইসলামপুর' },
    { id: 'মেলান্দহ', label: 'মেলান্দহ' },
    { id: 'দেওয়ানগঞ্জ', label: 'দেওয়ানগঞ্জ' },
    { id: 'মাদারগঞ্জ', label: 'মাদারগঞ্জ' },
    { id: 'সরিষাবাড়ী', label: 'সরিষাবাড়ী' },
    { id: 'বকশীগঞ্জ', label: 'বকশীগঞ্জ' },
    { id: 'শিক্ষা', label: 'শিক্ষা' },
    { id: 'চাকরি', label: 'চাকরি' },
    { id: 'ঘটনা', label: 'ঘটনাবহুল' },
  ];

  const filteredNews = useMemo(() => {
    return newsList.filter((item) => {
      let matchCat = true;
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'জাতীয়' || selectedCategory === 'আন্তর্জাতিক' || selectedCategory === 'পত্রিকা শিরোনাম') {
          matchCat = item.category === selectedCategory;
        } else {
          matchCat = item.category === selectedCategory || item.location.includes(selectedCategory);
        }
      }
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [newsList, selectedCategory, searchQuery]);

  const handleOpenArticle = (item: NewsItem) => {
    const updated = { ...item, views: item.views + 1 };
    storageService.updateNews(updated);
    setNewsList(storageService.getNews());
    setActiveArticle(updated);
    stopSpeaking();
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const handleSpeakText = (title: string, summary?: string, content?: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    const textToRead = `${title}। ${summary ? summary + '।' : ''} ${content ? content : ''}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'bn-BD';
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleShare = (title: string, summary: string) => {
    const liveUrl = storageService.getOfficialLiveUrl();
    if (navigator.share) {
      navigator.share({
        title,
        text: summary,
        url: liveUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${title} - Our Jamalpur: ${liveUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-xs leading-relaxed';
      case 'lg':
        return 'text-base sm:text-lg leading-loose';
      case 'xl':
        return 'text-lg sm:text-xl leading-loose';
      default:
        return 'text-sm sm:text-base leading-relaxed';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-slate-900 dark:text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-blue-800/40">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 text-blue-200 text-xs font-black mb-3 border border-blue-600/40">
            <Radio className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
            <span>দেশ-বিদেশ ও জামালপুর জেলা লাইভ নিউজ পোর্টাল</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            জাতীয়, আন্তর্জাতিক ও ৭ উপজেলার সর্বশেষ সংবাদ
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 mt-2 leading-relaxed">
            দৈনিক প্রথম আলো, বিডি প্রতিদিন, দ্য ডেইলি স্টার, ইত্তেফাক সহ শীর্ষ জাতীয় দৈনিকের সংবাদ এবং জামালপুর জেলার প্রতিটি প্রান্তের তাজা খবর।
          </p>
        </div>
      </div>

      {/* Daily Newspapers Headlines Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 text-white flex items-center justify-center font-bold shadow-xs">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  শীর্ষ দৈনিক পত্রিকার আজকের প্রধান পাতা
                </h2>
                <span className="bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-red-500/20">
                  লাইভ আপডেট
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                এক নজরে সকল শীর্ষ জাতীয় দৈনিকের প্রধান প্রতিবেদন
              </p>
            </div>
          </div>
        </div>

        {/* Newspaper Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {dailyNewspapers.map((paper, idx) => (
            <div
              key={paper.name}
              className="bg-slate-50 dark:bg-slate-950/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-800/80 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-black px-2 py-0.5 rounded-md border ${paper.color}`}>
                    {paper.logoText}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{paper.badge}</span>
                </div>
                <h3 className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug line-clamp-3">
                  {paper.leadHeadline}
                </h3>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <button
                  onClick={() => {
                    setActiveHeadline({
                      id: `paper-${idx}`,
                      title: `${paper.name}: ${paper.leadHeadline}`,
                      source: paper.name,
                      category: 'newspaper',
                      categoryLabel: 'দৈনিক পত্রিকা',
                      time: 'আজকের তাজা খবর',
                      summary: `দৈনিক ${paper.name} পত্রিকার প্রথম পাতার প্রধান প্রতিবেদন ও সম্পাদকীয় বিশ্লেষণ।`,
                      url: paper.url,
                      badgeBg: 'bg-blue-600',
                    });
                  }}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>বিস্তারিত পড়ুন</span>
                </button>
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium flex items-center gap-0.5 hover:underline"
                >
                  <span>অনলাইন</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            id="news-search-input"
            type="text"
            placeholder="খবরের শিরোনাম, দেশ-বিদেশ বা বিষয়বস্তু দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 text-xs font-semibold">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`news-cat-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-bold'
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Breaking Bulletins List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                লাইভ ব্রেকিং ও গুরুত্বপূর্ণ আপডেট
              </h2>
              <p className="text-xs text-slate-400">দেশ ও বিদেশের সর্বশেষ মুহূর্তের সংবাদ</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {liveHeadlines.map((headline) => (
            <div
              key={headline.id}
              onClick={() => setActiveHeadline(headline)}
              className="p-3.5 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 transition cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${
                      headline.badgeBg || 'bg-emerald-600'
                    }`}
                  >
                    {headline.source}
                  </span>
                  <span className="text-[10px] text-slate-400">{headline.time}</span>
                </div>
                <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition leading-snug line-clamp-2">
                  {headline.title}
                </h4>
              </div>
              <div className="pt-2 mt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  {headline.categoryLabel}
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:underline flex items-center gap-0.5">
                  <span>পড়ুন</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Articles Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            {selectedCategory === 'all'
              ? 'জেলার প্রধান ও নির্বাচিত সংবাদ'
              : `${selectedCategory} সম্পর্কিত সংবাদ`}
          </h2>
          <span className="text-xs text-slate-400">{filteredNews.length} টি সংবাদ পাওয়া গেছে</span>
        </div>

        {filteredNews.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
            <Newspaper className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
              কোনো সংবাদ খুঁজে পাওয়া যায়নি
            </h3>
            <p className="text-xs text-slate-400">অন্য কোনো কি-ওয়ার্ড দিয়ে সার্চ করুন বা ক্যাটাগরি পরিবর্তন করুন।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                id={`news-card-${item.id}`}
                onClick={() => handleOpenArticle(item)}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs hover:shadow-md transition duration-200 flex flex-col justify-between cursor-pointer group"
              >
                <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-xs">
                    {item.category}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                    📍 {item.location}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{item.date}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-slate-400" />
                        <span>{item.views} বার</span>
                      </span>
                    </div>
                    <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:underline flex items-center gap-1">
                      <span>পড়ুন</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Headline Modal */}
      {activeHeadline && (
        <div
          id="active-headline-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in"
          onClick={() => {
            stopSpeaking();
            setActiveHeadline(null);
          }}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white space-y-4 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-black px-2.5 py-1 rounded-lg text-white ${
                    activeHeadline.badgeBg || 'bg-emerald-600'
                  }`}
                >
                  {activeHeadline.source}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {activeHeadline.categoryLabel} • {activeHeadline.time}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleSpeakText(activeHeadline.title, activeHeadline.summary)}
                  className={`p-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isSpeaking
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'
                  }`}
                  title={isSpeaking ? 'থামান' : 'পড়ে শুনুন'}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    stopSpeaking();
                    setActiveHeadline(null);
                  }}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md mb-2">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>লাইভ ব্রেকিং বুলেটিন</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                {activeHeadline.title}
              </h2>
            </div>

            {activeHeadline.summary && (
              <div className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeHeadline.summary}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handleShare(activeHeadline.title, activeHeadline.summary || '')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-slate-500" />
                    <span>শেয়ার করুন</span>
                  </>
                )}
              </button>
              {activeHeadline.url && (
                <a
                  href={activeHeadline.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
                >
                  <span>মূল ওয়েবসাইটে পড়ুন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full Article Reader Modal with Voice Narration & Font Sizing */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
            <div className="relative h-64 bg-slate-900">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  onClick={() => handleSpeakText(activeArticle.title, activeArticle.summary, activeArticle.content)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer shadow-md ${
                    isSpeaking
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-600 text-white hover:bg-emerald-500'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeaking ? 'থামান' : 'পড়ে শুনুন'}</span>
                </button>
                <button
                  onClick={() => {
                    stopSpeaking();
                    setActiveArticle(null);
                  }}
                  className="p-2 bg-slate-900/80 text-white rounded-full hover:bg-slate-900 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute bottom-3 left-3 flex gap-2">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-lg">
                  {activeArticle.category}
                </span>
                <span className="bg-slate-900/90 text-white text-xs font-semibold px-3 py-1 rounded-lg">
                  📍 {activeArticle.location}
                </span>
              </div>
            </div>

            {/* Reading toolbar (Font size + Voice + Share) */}
            <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">ফন্ট সাইজ:</span>
                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setFontSize('sm')}
                    className={`px-2 py-0.5 rounded text-xs cursor-pointer ${
                      fontSize === 'sm' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSize('base')}
                    className={`px-2 py-0.5 rounded text-xs cursor-pointer ${
                      fontSize === 'base' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('lg')}
                    className={`px-2 py-0.5 rounded text-xs cursor-pointer ${
                      fontSize === 'lg' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    A+
                  </button>
                  <button
                    onClick={() => setFontSize('xl')}
                    className={`px-2 py-0.5 rounded text-xs cursor-pointer ${
                      fontSize === 'xl' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    A++
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleShare(activeArticle.title, activeArticle.summary)}
                className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>শেয়ার</span>
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-slate-900 dark:text-white">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span>📅 {activeArticle.date}</span>
                  <span>✍️ {activeArticle.author}</span>
                  <span>👁️ {activeArticle.views} বার পঠিত</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
                {activeArticle.title}
              </h2>

              <div className="bg-blue-50 dark:bg-blue-950/60 border-l-4 border-blue-600 p-3.5 rounded-r-xl text-xs sm:text-sm font-semibold text-blue-950 dark:text-blue-200">
                {activeArticle.summary}
              </div>

              <div className={`text-slate-700 dark:text-slate-300 space-y-3 ${getFontSizeClass()}`}>
                <p>{activeArticle.content}</p>
                <p>
                  দেশ ও আন্তর্জাতিক পরিসরের সমসাময়িক গুরুত্বপূর্ণ খবরের পাশাপাশি জামালপুর জেলার উন্নয়ন, কৃষি, শিক্ষা এবং আইন-শৃঙ্খলা সংক্রান্ত সকল আপডেট নিশ্চিত করতে Our Jamalpur নিউজ টিম সর্বদা সচেষ্ট।
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Our Jamalpur Live News Hub</span>
              <button
                onClick={() => {
                  stopSpeaking();
                  setActiveArticle(null);
                }}
                className="px-5 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
