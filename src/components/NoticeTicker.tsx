import React from 'react';
import { Megaphone, ArrowRight, Award, Radio, Bell } from 'lucide-react';
import { TabType } from '../types';

interface Props {
  noticeText: string;
  onNavigate: (tab: TabType) => void;
}

export const NoticeTicker: React.FC<Props> = ({ noticeText, onNavigate }) => {
  const tickerItems = [
    `📢 ${noticeText || 'জামালপুর জেলা শহরের বকশীগঞ্জ ও ইসলামপুর রুটে নতুন বিআরটিসি এসি বাস সার্ভিস চালু হয়েছে।'}`,
    '🏆 প্রতি রবিবার সাধারণ জ্ঞান কুইজে অংশগ্রহণ করুন এবং অর্জন করুন অনলাইন ভেরিফাইড সম্মাননা সনদপত্র!',
    '🩸 জরুরি রক্তের প্রয়োজনে Our Jamalpur ব্লাড ডোনার ডিরেক্টরি ব্যবহার করে সরাসরি রক্তদাতার সাথে যোগাযোগ করুন।',
    '🕌 প্রতিদিনের পাঁচ ওয়াক্ত নামাজের সঠিক সময়সূচী ও সাহরি-ইফতারের সময় অ্যাপে নিয়মিত আপডেট হচ্ছে।',
    '🌾 জামালপুর সদর ও সকল উপজেলার স্থানীয় বাজারদর এবং কৃষি পণ্যের মূল্য যাচাই করুন।',
  ];

  const fullTrack = tickerItems.join('   ✦   ');

  return (
    <div
      id="breaking-notice-ticker"
      className="bg-amber-500 dark:bg-amber-600 text-slate-950 py-2 px-3 sm:px-6 shadow-xs text-xs sm:text-sm font-semibold flex items-center gap-3 overflow-hidden transition-colors duration-200 border-b border-amber-600/30"
    >
      {/* Live Badge */}
      <div className="flex items-center gap-1.5 shrink-0 bg-slate-950 text-amber-300 px-2.5 py-1 rounded-lg font-black text-[11px] uppercase tracking-wider shadow-xs">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
        <Megaphone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="hidden sm:inline">লাইভ আপডেট</span>
        <span className="sm:hidden">লাইভ</span>
      </div>

      {/* Smooth Marquee Track */}
      <div className="flex-1 overflow-hidden relative select-none">
        <div className="animate-marquee-smooth py-0.5 whitespace-nowrap text-slate-950 text-xs sm:text-[13px] font-bold">
          <span className="px-4">{fullTrack}</span>
          <span className="px-4">{fullTrack}</span>
        </div>
      </div>

      {/* Action Shortcut */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          id="notice-quiz-badge-btn"
          onClick={() => onNavigate('quiz')}
          className="hidden md:flex items-center gap-1 text-[11px] font-bold bg-purple-900 text-purple-100 hover:bg-purple-950 px-2.5 py-1 rounded-lg transition cursor-pointer shadow-xs"
        >
          <Award className="w-3 h-3 text-amber-300" />
          <span>রবিবার কুইজ</span>
        </button>

        <button
          id="notice-view-more-btn"
          onClick={() => onNavigate('news')}
          className="shrink-0 text-xs font-bold text-slate-950 hover:text-white flex items-center gap-1 bg-amber-400/90 dark:bg-amber-500/90 hover:bg-slate-950 dark:hover:bg-slate-950 px-2.5 py-1 rounded-lg transition cursor-pointer"
        >
          <span>সংবাদ</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

