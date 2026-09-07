import React, { useState } from 'react';
import {
  Layout,
  Monitor,
  Smartphone,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  Phone,
  MessageSquare,
  Maximize2,
  Layers,
  ExternalLink,
  HelpCircle,
  Palette,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';
import { OWNER_PAYMENT_INFO } from '../services/storageService';

export type BannerFormatId =
  | 'home_top'
  | 'in_feed'
  | 'full_strip'
  | 'market_card'
  | 'splash_modal'
  | 'job_flyer';

export interface BannerFormatSpec {
  id: BannerFormatId;
  name: string;
  nameEn: string;
  badge: string;
  badgeColor: string;
  desktopSize: string;
  mobileSize: string;
  aspectRatio: string;
  supportedFormats: string[];
  maxFileSize: string;
  placement: string;
  bestFor: string;
  description: string;
  features: string[];
  demoTitle: string;
  demoSubtitle: string;
  demoSponsor: string;
  demoOffer: string;
  demoActionText: string;
  colorScheme: {
    bgGradient: string;
    border: string;
    accent: string;
    tagBg: string;
  };
}

export const BANNER_FORMATS: BannerFormatSpec[] = [
  {
    id: 'home_top',
    name: 'হোম পেজ শীর্ষ ব্যানার',
    nameEn: 'Home Top Leaderboard Banner',
    badge: 'সর্বোচ্চ ভিউ ও ক্লিক',
    badgeColor: 'bg-emerald-500 text-slate-950 font-black',
    desktopSize: '৭২৮ × ১৮০ পিক্সেল (728x180 px)',
    mobileSize: '৩৬০ × ১২০ পিক্সেল (360x120 px)',
    aspectRatio: '৪:১ বা ৩:১',
    supportedFormats: ['JPG', 'PNG', 'WebP', 'GIF'],
    maxFileSize: '৫০০ KB (দ্রুত লোডিংয়ের জন্য)',
    placement: 'Our Jamalpur অ্যাপের হোম পেজের সবার ওপরে',
    bestFor: 'শোরুম উদ্বোধনী, মেগা ব্র্যান্ডিং, বিশেষ ছাড় ও উৎসবের ক্যাম্পেইন',
    description: 'অ্যাপে প্রবেশ করলেই জামালপুর জেলার প্রতিটি নাগরিকের সামনে প্রথম দৃশ্যমান প্রিমিয়াম স্পেস।',
    features: [
      'সরাসরি ক্লিক-টু-কল (Click-to-Call) বাটন',
      'হোয়াটসঅ্যাপ ও ফেসবুক পেজ বা শোরুম লোকেশন লিংক',
      'দৈনিক ৩,৫০০+ সরাসরি স্থানীয় ভিজিটরদের সামনে ডিসপ্লে',
      'মোবাইল ও পিসিতে শতভাগ রেসপন্সিভ অপ্টিমাইজেশন',
    ],
    demoTitle: 'জামালপুর রয়্যাল শপিং মল — ঈদুল ফিতর মেগা ডিসকাউন্ট!',
    demoSubtitle: 'সকল পোশাক ও জুতোয় ৩০% পর্যন্ত সরাসরি ক্যাশব্যাক। স্টেশন রোড, জামালপুর।',
    demoSponsor: 'রয়্যাল ফ্যাশন ও শপিং মল',
    demoOffer: '৩০% মেগা ছাড়',
    demoActionText: 'অফারটি দেখুন',
    colorScheme: {
      bgGradient: 'from-slate-950 via-emerald-950 to-slate-900',
      border: 'border-emerald-500/40',
      accent: 'text-emerald-300',
      tagBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
  },
  {
    id: 'in_feed',
    name: 'নিউজ ও কনটেন্ট ইন-ফিড ব্যানার',
    nameEn: 'In-Feed Medium Rectangle Banner',
    badge: 'হাই এনগেজমেন্ট',
    badgeColor: 'bg-blue-500 text-white font-black',
    desktopSize: '৩০০ × ২৫০ পিক্সেল (300x250 px)',
    mobileSize: '৩০০ × ২৫০ বা ৩৪০ × ২৫০ পিক্সেল',
    aspectRatio: '৪:৩ বা ১.২:১ (Medium Rectangle)',
    supportedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSize: '৪০০ KB',
    placement: 'সংবাদ পাতা, স্বাস্থ্য বুলেটিন ও উপজেলা ডিরেক্টরি ফিডের মাঝে',
    bestFor: 'ডায়াগনস্টিক সেন্টার, রেস্টুরেন্ট মেনু, ডাক্তার চেম্বার ও কোচিং সেন্টার',
    description: 'পাঠকরা যখন জামালপুরের খবর ও তথ্য স্ক্রল করেন, তখন স্বাভাবিক খবরের মাঝেই চোখে পড়বে আপনার বিজ্ঞাপন।',
    features: [
      'খবরের ভেতর স্বাভাবিক দৃষ্টি আকর্ষণ করায় বিজ্ঞাপনে পড়ার আগ্রহ দ্বিগুণ',
      'ডায়াগনস্টিক টেস্টের প্যাকেজ বা অফার তুলে ধরার আদর্শ মাপ',
      'সরাসরি সিরিয়াল ও বুকিং নম্বরে তাৎক্ষণিক ডায়াল সুবিধা',
      'পরিচ্ছন্ন চারকোনা ডিজাইন যা প্রতিটি স্মার্টফোনে দারুণ দেখায়',
    ],
    demoTitle: 'আলোকিত জামালপুর ডিজিটাল ডায়াগনস্টিক & ট্রমা সেন্টার',
    demoSubtitle: 'অভিজ্ঞ প্রফেসর ডাক্তারদের সিরিয়াল ও সকল প্যাথলজি টেস্টে ২৫% ছাড়।',
    demoSponsor: 'আলোকিত ডায়াগনস্টিক',
    demoOffer: '২৫% প্যাথলজি ছাড়',
    demoActionText: 'সিরিয়াল নিন',
    colorScheme: {
      bgGradient: 'from-slate-950 via-blue-950 to-slate-900',
      border: 'border-blue-500/40',
      accent: 'text-blue-300',
      tagBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
  },
  {
    id: 'full_strip',
    name: 'ফুল-উইডথ প্রমো নোটিশ স্ট্রিপ',
    nameEn: 'Full Width Promo Strip Banner',
    badge: 'জরুরি অফার ও মেলা',
    badgeColor: 'bg-amber-500 text-slate-950 font-black',
    desktopSize: '১২০০ × ১৬০ পিক্সেল (1200x160 px)',
    mobileSize: '৩৬০ × ৮০ পিক্সেল (360x80 px)',
    aspectRatio: '৭:১ বা ৮:১ (স্লিম স্ট্রিপ)',
    supportedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSize: '৩৫০ KB',
    placement: 'টপ নোটিশ বার বা পেজের ফুটারের ঠিক ওপরে স্থায়ীভাবে',
    bestFor: 'ফ্ল্যাশ সেল, বৈশাখী মেলা, রক্তদান ক্যাম্প ও বিশেষ ছাড়ের ঘোষণা',
    description: 'স্ক্রিনের এক প্রান্ত থেকে অন্য প্রান্ত পর্যন্ত অনুভূমিক স্লিম ব্যানার, যা খুব কম জায়গায় তীব্র দৃষ্টি কাড়ে।',
    features: [
      'স্লিম ও আকর্ষণীয় ফ্লো যা পেজের কন্টেন্টে কোনো ব্যাঘাত ঘটায় না',
      'জরুরি ফ্ল্যাশ ডিসকাউন্ট বা নির্দিষ্ট তারিখের ইভেন্ট প্রচারের সেরা উপায়',
      'বোল্ড টেক্সট ও হাই-কনট্রাস্ট ব্যাকগ্রাউন্ডের মাধ্যমে ১০০% রিড্যাবিলিটি',
      'মোবাইল স্ক্রিনে চমৎকার স্টিকি বা পিন করা ডিসপ্লে সাপোর্ট',
    ],
    demoTitle: 'জামালপুর হস্তশিল্প ও নকশী কাঁথা এক্সপো ২০২৬ — আজই অর্ডার করুন!',
    demoSubtitle: 'সরাসরি গ্রাম্য কারিগরদের তৈরি খাঁটি নকশী কাঁথায় ফ্রি হোম ডেলিভারি।',
    demoSponsor: 'জামালপুর ক্রাফট হাব',
    demoOffer: 'ফ্রি ডেলিভারি',
    demoActionText: 'অর্ডার করুন',
    colorScheme: {
      bgGradient: 'from-amber-950 via-slate-950 to-amber-950',
      border: 'border-amber-500/40',
      accent: 'text-amber-300',
      tagBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
  },
  {
    id: 'market_card',
    name: 'মার্কেটপ্লেস স্পন্সরড প্রোডাক্ট কার্ড',
    nameEn: 'Featured Marketplace Product Card',
    badge: 'সরাসরি কেনাবেচা',
    badgeColor: 'bg-purple-500 text-white font-black',
    desktopSize: '৬০০ × ৬০০ পিক্সেল (600x600 px)',
    mobileSize: '৫০০ × ৫০০ পিক্সেল (1:1 Square)',
    aspectRatio: '১:১ (পারফেক্ট স্কয়ার)',
    supportedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSize: '৫০০ KB',
    placement: 'কেনাবেচা মার্কেটপ্লেসের সবার ওপরে গোল্ডেন ফ্রেম সহ',
    bestFor: 'ব্যবহৃত বাইক, স্মার্টফোন, ল্যাপটপ, জমি, ফ্ল্যাট ও ফার্নিচার',
    description: 'মার্কেটপ্লেস লিস্টিংয়ের সাধারণ বিজ্ঞাপনের ওপরে গোল্ডেন ব্যাজ সহ সবার আগে ক্রেতার নজর কাড়বে।',
    features: [
      'স্বর্ণালী "Featured / স্পনসরড" প্রিমিয়াম ব্যাজ সহ হাইলাইট',
      'সরাসরি বিক্রেতার মোবাইল নম্বর ও পণ্যের মূল্য দৃশ্যমান',
      'সার্চ রেজাল্ট ও যেকোনো ক্যাটাগরিতে সর্বদা শীর্ষ অবস্থান',
      '৩ গুণ দ্রুত পণ্য বিক্রয় হওয়ার পরীক্ষিত ফলাফল',
    ],
    demoTitle: 'Yamaha FZS V3 (Abs) — ফ্রেশ কন্ডিশন, জরুরি বিক্রয়',
    demoSubtitle: 'মডেল ২০২১, মাত্র ১২,০০০ কিমি চলা, জামালপুর ডিজিটাল নাম্বার প্লেট।',
    demoSponsor: 'মাসুদ এন্টারপ্রাইজ',
    demoOffer: '৳ ১,৯৫,০০০ (আলোচনা সাপেক্ষে)',
    demoActionText: 'কল দিন',
    colorScheme: {
      bgGradient: 'from-slate-950 via-purple-950 to-slate-900',
      border: 'border-purple-500/40',
      accent: 'text-purple-300',
      tagBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
  },
  {
    id: 'splash_modal',
    name: 'অ্যাপ ওপেন স্প্ল্যাশ / পপ-আপ ব্যানার',
    nameEn: 'App Open Interstitial Splash Modal',
    badge: 'ভিআইপি স্পনসর',
    badgeColor: 'bg-rose-500 text-white font-black',
    desktopSize: '৬০০ × ৬০০ বা ৫৪০ × ৭২০ পিক্সেল',
    mobileSize: '৩২০ × ৪৮০ পিক্সেল (3:4 Ratio)',
    aspectRatio: '১:১ বা ৩:৪ (ফুল সেন্টার মোড)',
    supportedFormats: ['JPG', 'PNG', 'WebP', 'GIF'],
    maxFileSize: '৭০০ KB',
    placement: 'অ্যাপ বা ওয়েবসাইটে প্রবেশের সময় ফুল-স্ক্রিন মোডাল পপ-আপ',
    bestFor: 'মেগা ওপেনিং, কনসার্ট, রাজনৈতিক সমাবেশ বা জাতীয় ও জেলা পর্যায়ের মেগা অফার',
    description: 'ব্যবহারকারী সাইটে প্রবেশের সঙ্গে সঙ্গেই এই ব্যানারটি সেন্টারে ভেসে উঠবে—কোনো ইউজারের চোখ এড়ানো অসম্ভব।',
    features: [
      '১০০% নিশ্চিত ইম্প্রেশন — কোনো স্ক্রল করার প্রয়োজন নেই',
      'প্রতি ব্যবহারকারীকে দিনে নির্দিষ্ট সংখ্যক বার স্মার্টভাবে প্রদর্শন (ক্লান্তিহীন)',
      'বড় বাটন যার মাধ্যমে সরাসরি শোরুম পেজ বা অফার পেজে রিডাইরেক্ট',
      'যেকোনো বড় ব্র্যান্ডের জামালপুরব্যাপী সর্বোচ্চ পরিচিতি তৈরির মোক্ষম হাতিয়ার',
    ],
    demoTitle: 'গ্র্যান্ড ওপেনিং — জামালপুর গ্রিন সিটি থিম পার্ক & রিসোর্ট!',
    demoSubtitle: 'উদ্বোধনী সপ্তাহে ফ্যামিলি টিকিটে ৫০% ছাড় ও ফ্রি সুইমিং সুবিধা।',
    demoSponsor: 'গ্রিন সিটি অ্যামিউজমেন্ট',
    demoOffer: '৫০% উদ্বোধনী ছাড়',
    demoActionText: 'টিকিট বুক করুন',
    colorScheme: {
      bgGradient: 'from-slate-950 via-rose-950 to-slate-900',
      border: 'border-rose-500/40',
      accent: 'text-rose-300',
      tagBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
  },
  {
    id: 'job_flyer',
    name: 'নিয়োগ বিজ্ঞপ্তি ও বিজনেস ফ্লায়ার',
    nameEn: 'Job Circular & Business Vertical Flyer',
    badge: 'দ্রুত কর্মী নিয়োগ',
    badgeColor: 'bg-teal-500 text-slate-950 font-black',
    desktopSize: '৮০০ × ১২০০ পিক্সেল (800x1200 px)',
    mobileSize: '৪০০ × ৬০০ পিক্সেল (Vertical Flyer)',
    aspectRatio: '৩:৪ বা ২:৩ (ভার্টিক্যাল পোস্টার)',
    supportedFormats: ['JPG', 'PNG', 'PDF', 'WebP'],
    maxFileSize: '১ MB',
    placement: 'চাকরি ও ক্যারিয়ার হাবের শীর্ষে এবং বিস্তারিত সার্কুলার মডেলে',
    bestFor: 'কোম্পানির অফিসিয়াল সার্কুলার, শিক্ষক ও বিক্রয় প্রতিনিধি নিয়োগ, শপ পার্টনারশিপ',
    description: 'সংস্থার প্যাডে পূর্ণাঙ্গ নিয়োগ বিজ্ঞপ্তি বা বড় পোস্টার ফ্লায়ার ডিজিটালভাবে প্রকাশের জন্য মানানসই।',
    features: [
      'সম্পূর্ণ পদের বিবরণ, শিক্ষাগত যোগ্যতা ও বেতন স্কেল স্পষ্টভাবে প্রদর্শন',
      'সরাসরি সিভি আপলোড বা ইমেইল ও মোবাইল নম্বরে আবেদনের বোতাম',
      'প্রিন্ট কোয়ালিটি পোস্টার বা ছবি সরাসরি মোবাইল স্ক্রিনে পরিষ্কার পাঠযোগ্য',
      'সোশ্যাল মিডিয়ায় শেয়ার করার জন্য শতভাগ প্রস্তুত লেআউট',
    ],
    demoTitle: 'জরুরি নিয়োগ বিজ্ঞপ্তি — জামালপুর এগ্রো ফুডস লিঃ',
    demoSubtitle: 'এরিয়া ম্যানেজার ও বিক্রয় প্রতিনিধি পদে ১৫ জন যোগ্য পুরুষ ও নারী নিয়োগ দেওয়া হবে।',
    demoSponsor: 'জামালপুর এগ্রো ফুডস',
    demoOffer: 'বেতন: ১৮,০০০ - ২৫,০০০ ৳',
    demoActionText: 'সিভি পাঠান',
    colorScheme: {
      bgGradient: 'from-slate-950 via-teal-950 to-slate-900',
      border: 'border-teal-500/40',
      accent: 'text-teal-300',
      tagBg: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    },
  },
];

interface Props {
  onSelectFormat?: (formatId: BannerFormatId) => void;
}

export const BannerFormatsShowcase: React.FC<Props> = ({ onSelectFormat }) => {
  const [activeFormatId, setActiveFormatId] = useState<BannerFormatId>('home_top');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');

  const selectedFormat = BANNER_FORMATS.find((f) => f.id === activeFormatId) || BANNER_FORMATS[0];

  return (
    <div id="banner-formats-section" className="space-y-8 animate-in fade-in duration-300">
      {/* Section Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Layout className="w-3.5 h-3.5 text-indigo-400" />
            <span>অফিসিয়াল ব্যানার ও বিজ্ঞাপন ফরম্যাট গাইডলাইন</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            বিজ্ঞাপন ও ব্যানার ফরম্যাটসমূহ (Ad Formats & Dimensions)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Our Jamalpur প্ল্যাটফর্মে আপনার ব্যবসা বা ব্র্যান্ড অনুযায়ী সেরা ব্যানার ফরম্যাট বেছে নিন। প্রতিটি ফরম্যাটের সঠিক মাপ (পিক্সেল), রেশিও, ফাইল সাইজ এবং লাইভ ভিজ্যুয়াল ডেমো নিচে দেওয়া হলো।
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>৬টি আন্তর্জাতিক মানসম্পন্ন ফরম্যাট</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <Smartphone className="w-3.5 h-3.5 text-blue-400" />
              <span>১০০% মোবাইল রেসপন্সিভ</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>বিনামূল্যে ডিজাইন সুবিধা</span>
            </span>
          </div>
        </div>
      </div>

      {/* Format Selection Tabs Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>ফরম্যাট বেছে নিয়ে লাইভ প্রিভিউ ও মাপ দেখুন:</span>
          </h3>
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
            ক্লিক করে বিবরণ দেখুন
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {BANNER_FORMATS.map((format) => {
            const isActive = format.id === activeFormatId;
            return (
              <button
                key={format.id}
                onClick={() => setActiveFormatId(format.id)}
                className={`p-3 rounded-2xl text-left transition-all duration-200 border cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-400/40'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-2xs'
                }`}
              >
                <div>
                  <span
                    className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md inline-block mb-1.5 ${
                      isActive ? 'bg-white/20 text-white' : format.badgeColor
                    }`}
                  >
                    {format.badge}
                  </span>
                  <div className="font-extrabold text-xs leading-tight line-clamp-2">
                    {format.name}
                  </div>
                </div>
                <div
                  className={`text-[10px] mt-2 font-mono font-bold ${
                    isActive ? 'text-indigo-200' : 'text-slate-500'
                  }`}
                >
                  {format.aspectRatio}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Format Detail & Interactive Live Preview Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Detail Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/60">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${selectedFormat.badgeColor}`}>
                {selectedFormat.badge}
              </span>
              <span className="text-xs font-mono text-slate-500 font-bold">
                {selectedFormat.nameEn}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {selectedFormat.name}
            </h3>
            <p className="text-xs text-slate-600">
              {selectedFormat.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Device Switcher */}
            <div className="flex items-center bg-slate-200/80 p-1 rounded-xl text-xs font-bold text-slate-700">
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                  previewDevice === 'mobile'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>মোবাইল ভিউ</span>
              </button>
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                  previewDevice === 'desktop'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>ডেস্কটপ ভিউ</span>
              </button>
            </div>

            {onSelectFormat && (
              <button
                onClick={() => onSelectFormat(selectedFormat.id)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>এই ফরম্যাটে বুকিং দিন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Live Simulation Preview Showcase */}
        <div className="p-5 sm:p-8 bg-slate-100/70 border-b border-slate-200/80 flex flex-col items-center">
          <div className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-indigo-600" />
            <span>লাইভ ব্যানার প্রিভিউ ডেমো (Our Jamalpur অ্যাপে ব্যানারটি যেমন দেখাবে):</span>
          </div>

          {/* Container simulating screen frame */}
          <div
            className={`w-full transition-all duration-300 ${
              previewDevice === 'mobile' ? 'max-w-md' : 'max-w-4xl'
            }`}
          >
            {/* Render realistic banner demo tailored to format */}
            {selectedFormat.id === 'home_top' && (
              <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-lg border-2 border-emerald-500/40 relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-500/10 blur-xl pointer-events-none"></div>
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-center sm:text-left">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 border border-emerald-600/40">
                          {selectedFormat.demoSponsor}
                        </span>
                        <span className="text-[11px] text-amber-400 font-extrabold flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          <span>স্পন্সরড অ্যাড</span>
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white mt-1 leading-snug">
                        {selectedFormat.demoTitle}
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                        {selectedFormat.demoSubtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-xs">
                      {selectedFormat.demoOffer}
                    </span>
                    <button className="bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1 shadow-xs">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{selectedFormat.demoActionText}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedFormat.id === 'in_feed' && (
              <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white rounded-3xl p-5 shadow-lg border-2 border-blue-500/40 max-w-sm mx-auto text-center space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {selectedFormat.demoSponsor}
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>ফিড স্পন্সর</span>
                  </span>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center mx-auto border border-blue-500/30">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-white leading-tight">
                  {selectedFormat.demoTitle}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedFormat.demoSubtitle}
                </p>
                <div className="bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20 text-xs font-bold text-blue-200">
                  {selectedFormat.demoOffer}
                </div>
                <button className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{selectedFormat.demoActionText}</span>
                </button>
              </div>
            )}

            {selectedFormat.id === 'full_strip' && (
              <div className="bg-gradient-to-r from-amber-950 via-slate-950 to-amber-950 text-white rounded-2xl p-3 sm:p-4 shadow-md border-2 border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-400 text-slate-950">
                        {selectedFormat.demoOffer}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {selectedFormat.demoTitle}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                      {selectedFormat.demoSubtitle}
                    </p>
                  </div>
                </div>
                <button className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shrink-0 flex items-center gap-1 shadow-xs">
                  <span>{selectedFormat.demoActionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {selectedFormat.id === 'market_card' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-purple-500/60 shadow-lg p-4 max-w-xs mx-auto space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-purple-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  ★ স্পন্সরড টপ অ্যাড
                </div>
                <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950/40 dark:to-indigo-950/40 flex items-center justify-center relative overflow-hidden border border-purple-200 dark:border-purple-800">
                  <ImageIcon className="w-16 h-16 text-purple-400" />
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded-md backdrop-blur-xs font-bold">
                    ১:১ স্কয়ার ছবি
                  </div>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                    {selectedFormat.demoTitle}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {selectedFormat.demoSubtitle}
                  </p>
                  <div className="mt-2 text-sm font-black text-purple-600 dark:text-purple-400">
                    {selectedFormat.demoOffer}
                  </div>
                </div>
                <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{selectedFormat.demoActionText}</span>
                </button>
              </div>
            )}

            {selectedFormat.id === 'splash_modal' && (
              <div className="bg-gradient-to-b from-slate-950 via-rose-950 to-slate-950 text-white rounded-3xl p-6 shadow-2xl border-2 border-rose-500/50 max-w-sm mx-auto text-center space-y-4 relative">
                <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 inline-block">
                  {selectedFormat.demoSponsor}
                </span>
                <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-300 flex items-center justify-center mx-auto border border-rose-500/30">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black leading-tight text-white">
                  {selectedFormat.demoTitle}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedFormat.demoSubtitle}
                </p>
                <div className="p-3 bg-white/10 rounded-2xl border border-white/15 text-rose-300 font-extrabold text-sm">
                  {selectedFormat.demoOffer}
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedFormat.demoActionText}</span>
                  </button>
                  <button className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition">
                    বন্ধ করুন
                  </button>
                </div>
              </div>
            )}

            {selectedFormat.id === 'job_flyer' && (
              <div className="bg-white rounded-3xl border-2 border-teal-500/50 shadow-lg p-5 max-w-sm mx-auto space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    {selectedFormat.demoSponsor}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    ভেরিফাইড সার্কুলার
                  </span>
                </div>
                <div className="aspect-[3/4] w-full rounded-2xl bg-gradient-to-br from-teal-50 to-slate-100 flex flex-col items-center justify-center p-4 text-center border border-teal-100">
                  <FileCheck className="w-12 h-12 text-teal-600 mb-2" />
                  <h5 className="font-extrabold text-xs text-slate-900">
                    {selectedFormat.demoTitle}
                  </h5>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-3">
                    {selectedFormat.demoSubtitle}
                  </p>
                  <div className="mt-3 text-xs font-black text-teal-700 bg-teal-100/80 px-2.5 py-1 rounded-lg">
                    {selectedFormat.demoOffer}
                  </div>
                </div>
                <button className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{selectedFormat.demoActionText}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 block">
              📏 ডাইমেনশন ও মাপ (পিক্সেল)
            </span>
            <div className="font-extrabold text-sm text-slate-900">
              {selectedFormat.desktopSize}
            </div>
            <div className="text-xs text-slate-600 font-mono">
              মোবাইল: {selectedFormat.mobileSize}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 block">
              📐 অ্যাসপেক্ট রেশিও (অনুপাত)
            </span>
            <div className="font-extrabold text-sm text-slate-900">
              {selectedFormat.aspectRatio}
            </div>
            <div className="text-xs text-slate-600">
              সর্বোচ্চ সাইজ: {selectedFormat.maxFileSize}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 block">
              📁 ফাইল এক্সটেনশন ও ফরম্যাট
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedFormat.supportedFormats.map((fmt) => (
                <span
                  key={fmt}
                  className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-mono font-bold text-[11px] rounded-md border border-indigo-200/80"
                >
                  .{fmt.toLowerCase()}
                </span>
              ))}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              কালার প্রোফাইল: sRGB
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 block">
              📍 অ্যাপে প্রদর্শন স্থান
            </span>
            <div className="font-extrabold text-xs text-slate-900 leading-snug">
              {selectedFormat.placement}
            </div>
            <div className="text-[11px] text-emerald-600 font-bold">
              {selectedFormat.bestFor}
            </div>
          </div>
        </div>

        {/* Feature List */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            এই বিজ্ঞাপন ফরম্যাটের বিশেষ সুবিধাসমূহ:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {selectedFormat.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Complete Dimensions Comparison Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900">
            বিজ্ঞাপন ও ব্যানার মাপ তুলনামূলক টেবিল (Quick Specs Table)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            গ্রাফিক্স ডিজাইনার বা ব্যানার প্রস্তুতকারকদের জন্য সম্পূর্ণ টেকনিক্যাল স্পেসিফিকেশন
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-900 font-black uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">বিজ্ঞাপন ফরম্যাট</th>
                <th className="py-3 px-3">ডেস্কটপ মাপ</th>
                <th className="py-3 px-3">মোবাইল মাপ</th>
                <th className="py-3 px-3">অনুপাত</th>
                <th className="py-3 px-3">ফাইল ফরম্যাট</th>
                <th className="py-3 px-3">সাইজ লিমিট</th>
                <th className="py-3 px-3">প্লেসমেন্ট</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {BANNER_FORMATS.map((f) => (
                <tr
                  key={f.id}
                  onClick={() => setActiveFormatId(f.id)}
                  className={`hover:bg-indigo-50/50 cursor-pointer transition ${
                    f.id === activeFormatId ? 'bg-indigo-50/70 font-semibold' : ''
                  }`}
                >
                  <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0"></span>
                    <span>{f.name}</span>
                  </td>
                  <td className="py-3 px-3 font-mono">{f.desktopSize.split('(')[1]?.replace(')', '') || f.desktopSize}</td>
                  <td className="py-3 px-3 font-mono">{f.mobileSize}</td>
                  <td className="py-3 px-3">{f.aspectRatio}</td>
                  <td className="py-3 px-3 font-mono">{f.supportedFormats.join(', ')}</td>
                  <td className="py-3 px-3 text-slate-500">{f.maxFileSize.split('(')[0]}</td>
                  <td className="py-3 px-3 text-slate-600">{f.placement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Free Graphic Design Assistance Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Palette className="w-3.5 h-3.5" />
              <span>ফ্রি ব্যানার ডিজাইন সাপোর্ট</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              আপনার কাছে নিজস্ব কোনো তৈরি করা ব্যানার নেই?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              কোনো চিন্তা নেই! আপনি শুধু আপনার প্রতিষ্ঠানের নাম, পণ্যের বিবরণ বা ডিসকাউন্ট অফার টেক্সট আমাদের জানান। <strong>Our Jamalpur</strong>-এর নিজস্ব অভিজ্ঞ গ্রাফিক্স ডিজাইনার টিম সম্পূর্ণ বিনামূল্যে আপনার ব্যবসা বা পণ্যের জন্য আকর্ষণীয় প্রফেশনাল ব্যানার তৈরি করে দেবে!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <a
              href={`tel:${OWNER_PAYMENT_INFO.phone}`}
              className="w-full sm:w-auto px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-2xl transition flex items-center justify-center gap-2 shadow-md"
            >
              <Phone className="w-4 h-4" />
              <span>কল করুন ({OWNER_PAYMENT_INFO.phone})</span>
            </a>
            <a
              href={`https://wa.me/88${OWNER_PAYMENT_INFO.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2 shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>হোয়াটসঅ্যাপে ছবি পাঠান</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
