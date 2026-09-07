import React from 'react';
import {
  ShoppingBag,
  Newspaper,
  Bus,
  Train,
  Hospital,
  UserCheck,
  Pill,
  Briefcase,
  BookOpen,
  HelpCircle,
  HeartPulse,
  Clock,
  TrendingUp,
  Building2,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Download,
  Smartphone,
  FolderArchive,
  ArrowRightLeft,
  Award,
  Radio,
  Globe2,
  Flag,
  Flame,
  Cloud,
  ShieldAlert,
  Share2,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { TabType, Upazila } from '../types';
import { storageService } from '../services/storageService';
import { AdBanner } from './AdBanner';
import { UpazilaBar } from './UpazilaBar';
import jamalpurLogo from '../assets/images/jamalpur_emblem_logo_1788191831752.jpg';

interface Props {
  onNavigate: (tab: TabType, extra?: any) => void;
  selectedUpazila: Upazila;
  onSelectUpazila?: (u: Upazila) => void;
  onOpenUpazilaModal?: () => void;
  onOpenExportZip?: () => void;
  onOpenInstallApp?: () => void;
}

export const HomeView: React.FC<Props> = ({
  onNavigate,
  selectedUpazila,
  onSelectUpazila,
  onOpenUpazilaModal,
  onOpenExportZip,
  onOpenInstallApp,
}) => {
  const allNews = storageService.getNews();
  const allProducts = storageService.getProducts();
  const prayerTimes = storageService.getPrayerTimes();
  const marketPrices = storageService.getMarketPrices().slice(0, 5);
  const allDonors = storageService.getBloodDonors().filter((d) => d.isAvailable);
  const liveHeadlines = storageService.getLiveHeadlines();
  const dailyNewspapers = storageService.getDailyNewspapers();
  const settings = storageService.getSettings();

  // Filter content reactively if a specific upazila is selected
  const news = (
    selectedUpazila === 'সকল উপজেলা'
      ? allNews
      : allNews.filter((n) => n.location.includes(selectedUpazila) || n.category === selectedUpazila)
  ).slice(0, 3);

  const products = (
    selectedUpazila === 'সকল উপজেলা'
      ? allProducts
      : allProducts.filter((p) => p.location.includes(selectedUpazila))
  ).slice(0, 4);

  const bloodDonors = (
    selectedUpazila === 'সকল উপজেলা'
      ? allDonors
      : allDonors.filter((d) => d.upazila === selectedUpazila)
  ).slice(0, 3);

  const servicesGrid: Array<{
    id: TabType;
    title: string;
    subtitle: string;
    icon: any;
    color: string;
    bg: string;
    badge?: string;
  }> = [
    {
      id: 'mfs-transfer',
      title: 'MFS আন্তঃ লেনদেন',
      subtitle: 'বিকাশ-রকেট-নগদ ট্রান্সফার',
      icon: ArrowRightLeft,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-300',
      badge: 'নতুন সেবা',
    },
    {
      id: 'weather',
      title: 'আবহাওয়া ও নদীবার্তা',
      subtitle: '৭ উপজেলা ও নদীস্তর পূর্বাভাস',
      icon: Cloud,
      color: 'text-teal-700',
      bg: 'bg-teal-50 hover:bg-teal-100/80 border-teal-200/80',
      badge: 'লাইভ',
    },
    {
      id: 'helplines',
      title: 'জরুরি হেল্পলাইন',
      subtitle: '৯৯৯, ৩৩৩ ও জেলা কন্ট্রোল',
      icon: ShieldAlert,
      color: 'text-red-700',
      bg: 'bg-red-50 hover:bg-red-100/80 border-red-200/80',
      badge: '২৪/৭',
    },
    {
      id: 'marketplace',
      title: 'মার্কেটপ্লেস',
      subtitle: 'কেনাবেচা ও বিজ্ঞাপন',
      icon: ShoppingBag,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200/80',
      badge: 'জনপ্রিয়',
    },
    {
      id: 'news',
      title: 'স্থানীয় সংবাদ',
      subtitle: '৭ উপজেলার তাজা খবর',
      icon: Newspaper,
      color: 'text-blue-700',
      bg: 'bg-blue-50 hover:bg-blue-100/80 border-blue-200/80',
      badge: 'লাইভ',
    },
    {
      id: 'bus',
      title: 'বাস সার্ভিস',
      subtitle: 'কাউন্টার ও শিডিউল',
      icon: Bus,
      color: 'text-amber-700',
      bg: 'bg-amber-50 hover:bg-amber-100/80 border-amber-200/80',
    },
    {
      id: 'train',
      title: 'ট্রেন সময়সূচী',
      subtitle: 'তিস্তা, ব্রহ্মপুত্র, যমুনা',
      icon: Train,
      color: 'text-indigo-700',
      bg: 'bg-indigo-50 hover:bg-indigo-100/80 border-indigo-200/80',
    },
    {
      id: 'hospital',
      title: 'হাসপাতাল',
      subtitle: 'জরুরি সেবা ও বেড',
      icon: Hospital,
      color: 'text-rose-700',
      bg: 'bg-rose-50 hover:bg-rose-100/80 border-rose-200/80',
      badge: '২৪/৭',
    },
    {
      id: 'doctors',
      title: 'ডাক্তার তালিকা',
      subtitle: 'বিশেষজ্ঞ চেম্বার ও সিরিয়াল',
      icon: UserCheck,
      color: 'text-teal-700',
      bg: 'bg-teal-50 hover:bg-teal-100/80 border-teal-200/80',
    },
    {
      id: 'medicine',
      title: 'ঔষধ তথ্য',
      subtitle: 'ব্যবহার ও পার্শ্বপ্রতিক্রিয়া',
      icon: Pill,
      color: 'text-cyan-700',
      bg: 'bg-cyan-50 hover:bg-cyan-100/80 border-cyan-200/80',
    },
    {
      id: 'jobs',
      title: 'চাকরির খবর',
      subtitle: 'জামালপুরের নিয়োগ বিজ্ঞপ্তি',
      icon: Briefcase,
      color: 'text-violet-700',
      bg: 'bg-violet-50 hover:bg-violet-100/80 border-violet-200/80',
      badge: 'নতুন',
    },
    {
      id: 'blood-donor',
      title: 'রক্তদাতা',
      subtitle: 'জরুরি রক্তের সন্ধান',
      icon: HeartPulse,
      color: 'text-red-700',
      bg: 'bg-red-50 hover:bg-red-100/80 border-red-200/80',
      badge: 'জরুরি',
    },
    {
      id: 'prayer',
      title: 'নামাজের সময়',
      subtitle: 'জামালপুর জেলা সময়সূচী',
      icon: Clock,
      color: 'text-emerald-800',
      bg: 'bg-emerald-50/90 hover:bg-emerald-100 border-emerald-200',
    },
    {
      id: 'market-price',
      title: 'দৈনিক বাজারদর',
      subtitle: 'কাঁচাবাজার ও নিত্যপণ্য',
      icon: TrendingUp,
      color: 'text-orange-700',
      bg: 'bg-orange-50 hover:bg-orange-100/80 border-orange-200/80',
      badge: 'দৈনিক',
    },
    {
      id: 'education',
      title: 'শিক্ষা ও বই',
      subtitle: 'Class 1-10 ই-বুক ও নোট',
      icon: BookOpen,
      color: 'text-sky-700',
      bg: 'bg-sky-50 hover:bg-sky-100/80 border-sky-200/80',
    },
    {
      id: 'quiz',
      title: 'অনলাইন কুইজ',
      subtitle: 'জ্ঞান পরীক্ষা ও স্কোরবোর্ড',
      icon: HelpCircle,
      color: 'text-purple-700',
      bg: 'bg-purple-50 hover:bg-purple-100/80 border-purple-200/80',
      badge: 'খেলুন',
    },
    {
      id: 'business',
      title: 'ব্যবসা ডিরেক্টরি',
      subtitle: 'স্থানীয় দোকান ও সেবা',
      icon: Building2,
      color: 'text-slate-700',
      bg: 'bg-slate-50 hover:bg-slate-100 border-slate-200',
    },
  ];

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-700/40">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 -top-10 w-60 h-60 bg-teal-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold mb-3">
            <MapPin className="w-3.5 h-3.5 text-emerald-300" />
            <span>জামালপুর জেলা ডিজিটাল সিটিজেন পোর্টাল</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-snug">
            আমাদের জামালপুর — এক ক্লিকে জেলার সকল সেবা
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 mt-2 font-normal leading-relaxed">
            খবর, কেনাবেচা, বাস-ট্রেন সময়সূচী, হাসপাতাল, ডাক্তার, রক্তদাতা, চাকরি ও জরুরি সেবা এখন আপনার হাতের মুঠোয়।
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              id="hero-marketplace-btn"
              onClick={() => onNavigate('marketplace')}
              className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>মার্কেটপ্লেস দেখুন</span>
            </button>
            <button
              id="hero-sell-btn"
              onClick={() => onNavigate('sell')}
              className="bg-emerald-950/80 hover:bg-emerald-950 text-emerald-200 border border-emerald-600/60 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>ফ্রি বিজ্ঞাপন দিন</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              id="hero-emergency-btn"
              onClick={() => onNavigate('hospital')}
              className="bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm ml-auto"
            >
              <PhoneCall className="w-4 h-4" />
              <span>জরুরি সেবা</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7 Upazilas of Jamalpur District Interactive Bar */}
      {onSelectUpazila && onOpenUpazilaModal && (
        <UpazilaBar
          selectedUpazila={selectedUpazila}
          onSelectUpazila={onSelectUpazila}
          onOpenUpazilaModal={onOpenUpazilaModal}
          onNavigate={onNavigate}
        />
      )}



      {/* Services Grid (All Shortcuts requested in prompt) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>সকল প্রয়োজনীয় সেবা ও শর্টকাট</span>
            </h2>
            <p className="text-xs text-slate-500">যে সেবাটি প্রয়োজন তাতে ট্যাপ করুন</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
          {servicesGrid.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                id={`home-svc-${svc.id}`}
                onClick={() => onNavigate(svc.id)}
                className={`group relative p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between ${svc.bg}`}
              >
                {svc.badge && (
                  <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200/80 shadow-2xs">
                    {svc.badge}
                  </span>
                )}
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white flex items-center justify-center shadow-xs mb-2 ${svc.color}`}>
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition">
                    {svc.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {svc.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prayer Times Quick Widget + Daily Market Price Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Prayer Time Box */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">আজকের নামাজের সময়সূচী</h3>
                <p className="text-[11px] text-slate-500">জামালপুর জেলা ও পার্শ্ববর্তী এলাকা</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('prayer')}
              className="text-xs text-emerald-700 font-semibold hover:underline"
            >
              পূর্ণাঙ্গ সময় →
            </button>
          </div>

          <div className="grid grid-cols-5 gap-1.5 text-center my-3">
            {[
              { label: 'ফজর', time: prayerTimes.fajr },
              { label: 'যোহর', time: prayerTimes.dhuhr },
              { label: 'আসর', time: prayerTimes.asr },
              { label: 'মাগরিব', time: prayerTimes.maghrib },
              { label: 'এশা', time: prayerTimes.isha },
            ].map((p, idx) => (
              <div key={idx} className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 block font-medium">{p.label}</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-800 mt-0.5 block">{p.time}</span>
              </div>
            ))}
          </div>

          <div className="text-[11px] bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg flex items-center justify-between">
            <span>সেহরি শেষ: <strong>{prayerTimes.sehriEnds}</strong></span>
            <span>ইফতার: <strong>{prayerTimes.iftar}</strong></span>
          </div>
        </div>

        {/* Daily Market Price Ticker */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">জামালপুর আজকের কাঁচাবাজার দর</h3>
                <p className="text-[11px] text-slate-500">নিত্যপ্রয়োজনীয় পণ্যের নির্ভরযোগ্য বাজারদর</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('market-price')}
              className="text-xs text-orange-700 font-semibold hover:underline"
            >
              সকল বাজারদর →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 my-3">
            {marketPrices.map((item) => (
              <div key={item.id} className="bg-orange-50/50 p-2.5 rounded-xl border border-orange-100 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-sm font-extrabold text-orange-700">৳{item.currentPrice}</span>
                  <span className="text-[10px] text-slate-500">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
            <span>📍 তথ্যসূত্র: জামালপুর বড় বাজার ও নান্দিনা বাজার</span>
            <span className="text-emerald-700 font-semibold">প্রতিদিন আপডেট করা হয়</span>
          </div>
        </div>
      </div>

      {/* Featured Marketplace Section (Bikroy-like showcase) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <span>লোকাল মার্কেটপ্লেস — সাম্প্রতিক বিজ্ঞাপন</span>
            </h2>
            <p className="text-xs text-slate-500">জামালপুর জেলার বিশ্বস্ত কেনাবেচা</p>
          </div>
          <button
            onClick={() => onNavigate('marketplace')}
            className="text-xs sm:text-sm text-emerald-700 font-bold hover:underline flex items-center gap-1"
          >
            <span>সব পণ্য</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              id={`home-product-${p.id}`}
              onClick={() => onNavigate('marketplace', p)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition hover:-translate-y-1 cursor-pointer group flex flex-col"
            >
              <div className="relative h-40 bg-slate-100 overflow-hidden">
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                {p.featured && (
                  <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                    ফিচার্ড
                  </span>
                )}
                <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                  {p.location}
                </span>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {p.category}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-1.5 line-clamp-1 group-hover:text-emerald-700 transition">
                    {p.title}
                  </h3>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-extrabold text-base text-emerald-700">
                    ৳ {p.price.toLocaleString('bn-BD')}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {p.isNegotiable ? 'আলোচনা সাপেক্ষ' : 'ফিক্সড'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Ad Banner (Monetization structure) */}
      <AdBanner
        type="leaderboard"
        title="জামালপুরের শীর্ষ নকশী কাঁথা ও হস্তশিল্প অনলাইন মেলা — আজই আপনার বিজ্ঞাপন দিন"
        sponsorName="জামালপুর বিজনেস হাব"
        linkText="স্পনসর জানুন"
        onAction={() => onNavigate('contact')}
      />

      {/* Daily Newspapers Headlines & National/International Live Bulletin */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 text-white flex items-center justify-center font-bold shadow-xs">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  শীর্ষ দৈনিক পত্রিকার আজকের প্রধান শিরোনাম
                </h2>
                <span className="bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-red-500/20">
                  লাইভ
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                প্রথম আলো, বিডি প্রতিদিন, দ্য ডেইলি স্টার, ইত্তেফাক ও শীর্ষ দৈনিকের তাজা শিরোনাম
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('news')}
            className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>সব পত্রিকা ও সংবাদ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Newspaper Headlines Mini Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {dailyNewspapers.slice(0, 4).map((paper) => (
            <div
              key={paper.name}
              onClick={() => onNavigate('news')}
              className="bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-black px-2 py-0.5 rounded-md border ${paper.color}`}>
                    {paper.logoText}
                  </span>
                  <span className="text-[10px] text-slate-400">{paper.badge}</span>
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug line-clamp-2">
                  {paper.leadHeadline}
                </p>
              </div>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold pt-2 mt-1 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center gap-1 group-hover:underline">
                <span>পড়ুন →</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Local News Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-blue-600" />
              <span>জামালপুর জেলার তাজা খবর</span>
            </h2>
            <p className="text-xs text-slate-500">শুধুমাত্র জামালপুর জেলার সংবাদ</p>
          </div>
          <button
            onClick={() => onNavigate('news')}
            className="text-xs sm:text-sm text-blue-700 font-bold hover:underline flex items-center gap-1"
          >
            <span>সকল খবর</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {news.map((item) => (
            <div
              key={item.id}
              id={`home-news-${item.id}`}
              onClick={() => onNavigate('news', item)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition hover:-translate-y-1 cursor-pointer flex flex-col group"
            >
              <div className="h-44 bg-slate-100 overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                  {item.category}
                </span>
                <span className="absolute bottom-2 left-2 bg-slate-900/80 text-slate-200 text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                  📍 {item.location}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>📅 {item.date}</span>
                  <span className="text-blue-600 font-semibold group-hover:underline">বিস্তারিত পড়ুন →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sunday Quiz & Official Digital Certificate Section */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-purple-500/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shrink-0">
              <Award className="w-8 h-8 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-400/40 uppercase">
                  সাপ্তাহিক রবিবার কুইজ
                </span>
                <span className="text-xs text-purple-200 font-semibold">ভেরিফাইড ডিজিটাল সনদপত্র</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-white mt-1">
                রবিবার বিশেষ মেধা কুইজ ও ডিজিটাল সম্মাননা সনদ
              </h3>
              <p className="text-xs sm:text-sm text-purple-100/90 mt-1 max-w-xl">
                জামালপুর জেলা বিষয়ক সাধারণ জ্ঞানের কুইজে অংশ নিন। প্রতি রবিবার সনদপত্র ইস্যু হয় এবং সঙ্গে সঙ্গে হাই-রেজ্যুলেশন PNG ও PDF হিসেবে ডাউনলোড করা যায়!
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => onNavigate('quiz')}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Award className="w-4 h-4 fill-slate-950" />
              <span>সার্টিফিকেট ও কুইজ খেলুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Blood Donor Hotline & Transport Quick Access Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Blood Donors Quick Contact */}
        <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-rose-950">জরুরি রক্তদাতা সন্ধান</h3>
                <p className="text-[11px] text-rose-800/80">জামালপুরের প্রস্তুত স্বেচ্ছাসেবী রক্তদাতারা</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('blood-donor')}
              className="text-xs text-rose-700 font-bold hover:underline"
            >
              সকল রক্তদাতা →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 my-3">
            {bloodDonors.map((donor) => (
              <div key={donor.id} className="bg-white p-2.5 rounded-xl border border-rose-100 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 truncate">{donor.name}</span>
                  <span className="font-extrabold text-xs text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                    {donor.bloodGroup}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1">{donor.upazila}</span>
                <a
                  href={`tel:${donor.phone.replace(/[^0-9]/g, '')}`}
                  className="mt-2 text-center text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white py-1 rounded-lg transition"
                >
                  📞 কল করুন
                </a>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => onNavigate('blood-donor')}
              className="text-xs font-bold text-rose-700 hover:text-rose-800"
            >
              ➕ আপনিও রক্তদাতা হিসেবে নিবন্ধন করুন
            </button>
          </div>
        </div>

        {/* Bus & Train Quick Tracker */}
        <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Train className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-indigo-950">বাস ও ট্রেন শিডিউল</h3>
                <p className="text-[11px] text-indigo-800/80">ঢাকা, ময়মনসিংহ ও উত্তরবঙ্গ যাতায়াত</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('transport')}
              className="text-xs text-indigo-700 font-bold hover:underline"
            >
              সম্পূর্ণ শিডিউল →
            </button>
          </div>

          <div className="space-y-2 my-3">
            <div className="bg-white p-2.5 rounded-xl border border-indigo-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800">🚆 তিস্তা এক্সপ্রেস (৭০৭/৭০৮)</span>
                <p className="text-[10px] text-slate-500">দেওয়ানগঞ্জ ➔ জামালপুর (৪:০৫ PM) ➔ ঢাকা (৯:০০ PM)</p>
              </div>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                ভাড়া ৳১৬৫+
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-indigo-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800">🚌 রাজীব এন্টারপ্রাইজ (চেয়ার কোচ)</span>
                <p className="text-[10px] text-slate-500">জামালপুর ➔ ময়মনসিংহ ➔ মহাখালী (ঢাকা) | ভাড়া ৳৩৮০</p>
              </div>
              <a
                href="tel:01712349988"
                className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded"
              >
                📞 কাউন্টার
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-indigo-900 font-medium">
            <span>অনলাইন টিকিট ও কাউন্টার বুকিং সহায়তা</span>
            <button
              onClick={() => onNavigate('train')}
              className="font-bold text-indigo-700 hover:underline"
            >
              ট্রেন সময়সূচী দেখুন →
            </button>
          </div>
        </div>
      </div>

      {/* Jamalpur Heritage & District Highlight */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="font-extrabold text-base text-slate-900">জামালপুর জেলার পরিচিতি ও ঐতিহ্য</h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          ময়মনসিংহ বিভাগের অন্তর্ভুক্ত ইতিহাস ও ঐতিহ্যে সমৃদ্ধ জামালপুর জেলা। বিশ্ববিখ্যাত <strong>হস্তশিল্প ও নকশী কাঁথা</strong>, দেওয়ানগঞ্জের আখ ও চিনিকল, সরিষাবাড়ীর যমুনা ফার্টিলাইজার সার কারখানা, বকশীগঞ্জের বীরত্বপূর্ণ কামালপুর মুক্তিযুদ্ধ স্মৃতিসৌধ এবং পুরাতন ব্রহ্মপুত্র ও যমুনার অপার সৌন্দর্যে ঘেরা এই জনপদ। “Our Jamalpur” জেলাবাসীকে সংযুক্ত করার এক ডিজিটাল প্রয়াস।
        </p>
      </div>
    </div>
  );
};
