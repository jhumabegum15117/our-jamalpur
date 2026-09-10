import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  ChevronLeft,
  ChevronRight,
  Phone,
  MapPin,
  ExternalLink,
  Sparkles,
  Tag,
  LayoutGrid,
  Sliders,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { MonetizationModal } from './MonetizationModal';

export interface LocalAd {
  id: string;
  businessName: string;
  headline: string;
  subheadline: string;
  offerTag: string;
  offerColor: string; // Tailwind class
  location: string;
  phone: string;
  imageUrl: string;
  category: string;
  validUntil: string;
}

const DEFAULT_LOCAL_ADS: LocalAd[] = [
  {
    id: 'ad-1',
    businessName: 'জামালপুর খাদি ও হস্তশিল্প ভবন',
    headline: 'ঐতিহ্যবাহী নকশিকাঁথা ও খাদি পোশাকে ২০% মেগা ছাড়!',
    subheadline: 'খাঁটি হাতে তৈরি খাদি চাদর, শাড়ি ও পাঞ্জাবিতে ঈদ ও বৈশাখী বিশেষ অফার চলছে। সারাদেশে হোম ডেলিভারি।',
    offerTag: '২০% মেগা ছাড়',
    offerColor: 'bg-rose-500 text-white',
    location: 'ষ্টেশন রোড, জামালপুর সদর',
    phone: '01711223344',
    imageUrl: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=800&q=80',
    category: 'হস্তশিল্প ও বস্ত্র',
    validUntil: '২০২৬-০৫-৩০',
  },
  {
    id: 'ad-2',
    businessName: 'আশা ডিজিটাল ডায়াগনস্টিক অ্যান্ড স্পেশালাইজড কনসালটেশন',
    headline: 'সকল রক্ত ও ইসিজি টেস্টে ২৫% ছাড় ও ফ্রি প্রেসার চেকআপ',
    subheadline: 'ঢাকা ও ময়মনসিংহের বিশেষজ্ঞ ডাক্তারদের সিরিয়াল গ্রহণ চলছে। সার্বক্ষণিক ডিজিটাল ল্যাব সেবা।',
    offerTag: '২৫% ছাড় + ফ্রি চেকআপ',
    offerColor: 'bg-emerald-600 text-white',
    location: 'হাসপাতাল রোড, জামালপুর সদর',
    phone: '01912345678',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    category: 'স্বাস্থ্যসেবা',
    validUntil: '২০২৬-০৬-১৫',
  },
  {
    id: 'ad-3',
    businessName: 'জামালপুর ডিজিটাল আইটি অ্যান্ড স্কিল একাডেমি',
    headline: 'ফ্রিল্যান্সিং, ওয়েব ডিজাইন ও গ্রাফিক্স কোর্সে নতুন ব্যাচে ভর্তি চলছে',
    subheadline: '১০০% প্র্যাক্টিক্যাল ক্লাস ও জব প্লেসমেন্ট সাপোর্ট। প্রথম ২০ জনের জন্য ৫০% কোর্স ফি স্কলারশিপ!',
    offerTag: '৫০% স্কলারশিপ',
    offerColor: 'bg-blue-600 text-white',
    location: 'বকুলতলা মোড়, জামালপুর সদর',
    phone: '01819876543',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    category: 'শিক্ষা ও আইটি',
    validUntil: '২০২৬-০৪-৩০',
  },
  {
    id: 'ad-4',
    businessName: 'হাজী বিরিয়ানি অ্যান্ড গ্রিল হাউজ',
    headline: 'খাঁটি গাওয়া ঘিয়ের কাচ্চি ও স্পেশাল চিকেন চাপে ফ্রি বোরহানি!',
    subheadline: 'পারিবারিক পরিবেশ ও উন্নত মানের স্বাদের নির্ভরযোগ্য ঠিকানা। জন্মদিন বা পার্টির অর্ডার নেওয়া হয়।',
    offerTag: 'ফ্রি বোরহানি অফার',
    offerColor: 'bg-amber-600 text-white',
    location: 'পাঁচরাস্তা মোড়, জামালপুর সদর',
    phone: '01315481879',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    category: 'খাবার ও রেস্তোরাঁ',
    validUntil: '২০২৬-১২-৩১',
  },
];

interface Props {
  onOpenMonetizeModal?: () => void;
}

export const AdvertisementBanner: React.FC<Props> = ({ onOpenMonetizeModal }) => {
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ads = DEFAULT_LOCAL_ADS;

  // Auto slide carousel every 5 seconds if active
  useEffect(() => {
    if (!isAutoPlaying || viewMode !== 'carousel') return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, viewMode, ads.length]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const handleOpenModal = () => {
    if (onOpenMonetizeModal) {
      onOpenMonetizeModal();
    } else {
      setIsModalOpen(true);
    }
  };

  const currentAd = ads[currentIndex];

  return (
    <div id="advertisement-banner-section" className="my-6 space-y-3">
      {/* Header with Title and Layout Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs">
            <Megaphone className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                জামালপুর জেলা স্পনসর ও লোকাল অফার
              </h3>
              <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                Verified Local Ads
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              জেলার শীর্ষস্থানীয় ব্যবসা প্রতিষ্ঠানসমূহের বিশেষ মূল্যছাড় ও সেবা
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Layout Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setViewMode('carousel')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition ${
                viewMode === 'carousel'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="স্লাইডার ভিউ"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">স্লাইডার</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="গ্রিড ভিউ"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">গ্রিড ভিউ</span>
            </button>
          </div>

          {/* Place Ad Action Button */}
          <button
            onClick={handleOpenModal}
            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>বিজ্ঞাপন দিন</span>
          </button>
        </div>
      </div>

      {/* 1. Carousel Mode */}
      {viewMode === 'carousel' && (
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all">
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Image Column */}
            <div className="md:col-span-5 relative h-48 md:h-64 bg-slate-950 overflow-hidden">
              <img
                src={currentAd.imageUrl}
                alt={currentAd.businessName}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:hidden" />
              
              {/* Badge overlay on mobile */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg shadow-md ${currentAd.offerColor}`}>
                  {currentAd.offerTag}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white border border-white/20">
                  {currentAd.category}
                </span>
              </div>
            </div>

            {/* Content Column */}
            <div className="md:col-span-7 p-4 sm:p-6 flex flex-col justify-between space-y-3">
              <div>
                <div className="hidden md:flex items-center gap-2 mb-2">
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-md shadow-xs ${currentAd.offerColor}`}>
                    {currentAd.offerTag}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    {currentAd.category}
                  </span>
                  <span className="ml-auto text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>মেয়াদ: {currentAd.validUntil}</span>
                  </span>
                </div>

                <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{currentAd.businessName}</span>
                </div>

                <h4 className="text-base sm:text-xl font-black text-slate-900 dark:text-white mt-1 leading-snug">
                  {currentAd.headline}
                </h4>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed line-clamp-2 sm:line-clamp-3">
                  {currentAd.subheadline}
                </p>
              </div>

              {/* Footer info & CTA */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate max-w-[200px]">{currentAd.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${currentAd.phone}`}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>কল করুন ({currentAd.phone})</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Controls */}
          <button
            onClick={handlePrev}
            aria-label="পূর্ববর্তী বিজ্ঞাপন"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer shadow-md"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            aria-label="পরবর্তী বিজ্ঞাপন"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer shadow-md"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full backdrop-blur-xs">
            {ads.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  currentIndex === idx ? 'w-5 bg-emerald-400' : 'w-1.5 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. Grid Mode */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              <div className="relative h-36 bg-slate-950 overflow-hidden">
                <img
                  src={ad.imageUrl}
                  alt={ad.businessName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs ${ad.offerColor}`}>
                    {ad.offerTag}
                  </span>
                </div>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 truncate">
                    {ad.businessName}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5">
                    {ad.headline}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {ad.subheadline}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">{ad.location}</span>
                  </div>

                  <a
                    href={`tel:${ad.phone}`}
                    className="w-full py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition"
                  >
                    <Phone className="w-3 h-3" />
                    <span>যোগাযোগ: {ad.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for placing an ad */}
      {isModalOpen && (
        <MonetizationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
