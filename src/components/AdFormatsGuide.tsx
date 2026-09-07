import React, { useState } from 'react';
import {
  Layout,
  Maximize2,
  Smartphone,
  Monitor,
  CheckCircle2,
  FileImage,
  Zap,
  ArrowRight,
  Phone,
  MessageSquare,
  Sparkles,
  Info,
  Layers,
  Palette,
  Eye,
  Sliders,
} from 'lucide-react';
import { MonetizationServiceType } from '../types';

export interface AdFormatSpec {
  id: string;
  name: string;
  nameEn: string;
  tag: string;
  tagColor: string;
  desktopSize: string;
  mobileSize: string;
  aspectRatio: string;
  maxFileSize: string;
  placementLocation: string;
  bestFor: string;
  reachEstimate: string;
  features: string[];
  mockupType: 'leaderboard' | 'infeed' | 'marketplace' | 'strip' | 'splash' | 'flyer';
  serviceType: MonetizationServiceType;
}

export const AD_FORMATS: AdFormatSpec[] = [
  {
    id: 'header_leaderboard',
    name: 'হোম পেজ হেডার ব্যানার (Leaderboard)',
    nameEn: 'Top Header Leaderboard Banner',
    tag: 'সর্বোচ্চ ভিউ ও ক্লিক',
    tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    desktopSize: '728 × 180 পিক্সেল',
    mobileSize: '360 × 120 পিক্সেল',
    aspectRatio: '৪:১ বা ৩:১ (ওয়াইড)',
    maxFileSize: 'অনূর্ধ্ব ৫০০ KB',
    placementLocation: 'Our Jamalpur হোম পেজের একদম শীর্ষে প্রথম স্থানে',
    bestFor: 'বড় ব্র্যান্ড, মোবাইল/ইলেকট্রনিক্স শোরুম, ডায়াগনস্টিক সেন্টার, সুপারশপ ও মেগা সেল অফার',
    reachEstimate: 'প্রতিদিন ৩,৫০০+ সরাসরি স্থানীয় ব্যবহারকারী',
    features: [
      'সরাসরি ক্লিক-টু-কল (Call) ও হোয়াটসঅ্যাপ (WhatsApp) অপশন',
      'ফেসবুক পেজ বা গুগল ম্যাপ শোরুম লোকেশন লিংক সংযুক্তি',
      '২৪ ঘণ্টা হোম পেজের সবচেয়ে আকর্ষণীয় প্রথম জায়গায় অবস্থান',
      'মোবাইল ও কম্পিউটার সব ডিভাইসে অটো-রেসপন্সিভ পারফেক্ট ভিউ',
    ],
    mockupType: 'leaderboard',
    serviceType: 'banner_ad',
  },
  {
    id: 'in_feed_banner',
    name: 'ইন-ফিড / কন্টেন্ট ব্যানার (Medium Rectangle)',
    nameEn: 'In-Feed Content Banner',
    tag: 'সবচেয়ে পাঠকপ্রিয়',
    tagColor: 'bg-blue-100 text-blue-800 border-blue-300',
    desktopSize: '300 × 250 পিক্সেল',
    mobileSize: '330 × 260 পিক্সেল',
    aspectRatio: '১.২:১ বা ৪:৩ (রেক্টেঙ্গেল)',
    maxFileSize: 'অনূর্ধ্ব ৪০০ KB',
    placementLocation: 'সংবাদ ও উপজেলার খবরের মাঝামাঝি এবং স্বাস্থ্য পেজের ভেতরে',
    bestFor: 'রেস্টুরেন্ট মেনু, কোচিং সেন্টার, ডাক্তার চেম্বার, ফার্নিচার শপ ও সার্ভিস প্রতিষ্ঠান',
    reachEstimate: 'প্রতিদিন ২,২০০+ মনোযোগী পাঠক ও ক্লায়েন্ট',
    features: [
      'খবরের মাঝে ন্যাচারাল প্লেসমেন্ট হওয়ায় গ্রাহকের দৃষ্টি আকর্ষণ সর্বোচ্চ',
      'প্রোডাক্ট ছবি ও ডিসকাউন্ট ভাউচার প্রদর্শনের জন্য আদর্শ মাপ',
      'বিজ্ঞাপনে সরাসরি অর্ডারের জন্য যোগাযোগের বাটন',
      'ব্যানারে ক্লিক করলে বিস্তারিত অফার বা মেনু কার্ড ওপেন',
    ],
    mockupType: 'infeed',
    serviceType: 'banner_ad',
  },
  {
    id: 'marketplace_featured',
    name: 'মার্কেটপ্লেস স্পন্সরড প্রোডাক্ট কার্ড',
    nameEn: 'Sponsored Marketplace Card',
    tag: 'সরাসরি ক্রেতার নজর',
    tagColor: 'bg-amber-100 text-amber-800 border-amber-300',
    desktopSize: '600 × 600 পিক্সেল',
    mobileSize: '500 × 500 পিক্সেল',
    aspectRatio: '১:১ (স্কয়ার / চতুর্ভুজ)',
    maxFileSize: 'অনূর্ধ্ব ৫০০ KB',
    placementLocation: 'কেনাবেচা মার্কেটপ্লেসের সবার ওপরে গোল্ডেন হাইলাইট ফ্রেম সহ',
    bestFor: 'ব্যবহৃত মোটরসাইকেল, মোবাইল, জমি/ফ্ল্যাট, গৃহস্থালী পণ্য ও জামালপুরের নকশী কাঁথা',
    reachEstimate: 'প্রতিদিন ২,৫০০+ আগ্রহী আসল ক্রেতা',
    features: [
      'গোল্ডেন প্রিমিয়াম বর্ডার ও স্পেশাল "Featured" ব্যাজ',
      'সার্চ ও ফিল্টারিংয়ে সবার আগে প্রদর্শিত হবে',
      'সরাসরি বিক্রেতাকে এক ক্লিকে কল দেওয়ার সুবিধা',
      'সাধারণ বিজ্ঞাপনের তুলনায় ৩ গুণ দ্রুত পণ্য বিক্রির রেকর্ড',
    ],
    mockupType: 'marketplace',
    serviceType: 'boost_product',
  },
  {
    id: 'full_width_strip',
    name: 'ফুল-উইডথ প্রমো নোটিশ স্ট্রিপ',
    nameEn: 'Full-Width Promotional Banner Strip',
    tag: 'ফ্ল্যাশ সেল ও অফার',
    tagColor: 'bg-purple-100 text-purple-800 border-purple-300',
    desktopSize: '1200 × 160 পিক্সেল',
    mobileSize: '100% রেসপন্সিভ স্ট্রিপ',
    aspectRatio: '৭:১ বা ৮:১ (স্লিম স্ট্রিপ)',
    maxFileSize: 'অনূর্ধ্ব ৩০০ KB',
    placementLocation: 'নোটিশ বারের নিচে এবং পেজের ফুটারের ঠিক ওপরে',
    bestFor: 'সীমিত সময়ের মেগা ডিসকাউন্ট, বৈশাখী/ঈদ মেলা ঘোষণা ও নতুন ব্রাঞ্চ উদ্বোধন',
    reachEstimate: 'প্রতিদিন ৪,০০০+ সকল পেজ ভিজিটর',
    features: [
      'উজ্জ্বল রঙ ও আকর্ষণীয় হেডলাইন দিয়ে নজর কাড়ে',
      'স্ক্রিনের পূর্ণ প্রস্থ জুড়ে ছড়িয়ে থাকা স্লিম ডিজাইন',
      'জরুরি অফার কাউন্টডাউন বা ঘোষণা প্রদর্শনের সেরা মাধ্যম',
      'অন্যান্য কন্টেন্টের সাথে কোনো বাধা ছাড়াই মসৃণ লোডিং',
    ],
    mockupType: 'strip',
    serviceType: 'banner_ad',
  },
  {
    id: 'splash_modal_ad',
    name: 'অ্যাপ ওপেন স্প্ল্যাশ / পপ-আপ ব্যানার',
    nameEn: 'App Open Splash / Interstitial Modal',
    tag: 'ভিআইপি ব্র্যান্ডিং',
    tagColor: 'bg-rose-100 text-rose-800 border-rose-300',
    desktopSize: '600 × 600 পিক্সেল',
    mobileSize: '540 × 720 পিক্সেল',
    aspectRatio: '১:১ বা ৩:৪ (ভার্টিক্যাল পপ-আপ)',
    maxFileSize: 'অনূর্ধ্ব ৭০০ KB',
    placementLocation: 'ব্যবহারকারী প্রথমবার অ্যাপ ওপেন করার সময় সেন্ট্রাল স্ক্রিনে পপ-আপ',
    bestFor: 'জেলা পর্যায়ের সম্মেলন, শপিং মলের প্রতিষ্ঠাবার্ষিকী ও বড় কর্পোরেট ক্যাম্পেইন',
    reachEstimate: 'প্রতিদিন ৪,৫০০+ শতভাগ নিশ্চিত মনোযোগ',
    features: [
      'অ্যাপে ঢোকার সাথে সাথেই শতভাগ ব্যবহারকারীর পূর্ণ দৃষ্টি আকর্ষণ',
      'হাই-রেজোলিউশন গ্রাফিক্স ও চমৎকার অ্যানিমেটেড এন্ট্রি',
      'এক ক্লিকেই শোরুমের ফেসবুক পেইজ, ওয়েবসাইট বা ডিরেক্ট কল',
      'উপরে ক্লোজ বাটন সহ ইউজার-ফ্রেন্ডলি চমৎকার অভিজ্ঞতা',
    ],
    mockupType: 'splash',
    serviceType: 'banner_ad',
  },
  {
    id: 'job_circular_flyer',
    name: 'নিয়োগ বিজ্ঞপ্তি ও বিজনেস ফ্লায়ার',
    nameEn: 'Job Circular & Event Vertical Flyer',
    tag: 'কর্মী নিয়োগ ও সার্কুলার',
    tagColor: 'bg-teal-100 text-teal-800 border-teal-300',
    desktopSize: '800 × 1200 পিক্সেল',
    mobileSize: '600 × 900 পিক্সেল',
    aspectRatio: '২:৩ বা ৩:৪ (ভার্টিক্যাল পোস্টার)',
    maxFileSize: 'অনূর্ধ্ব ১ MB (JPG, PNG বা PDF)',
    placementLocation: 'চাকরি ও ক্যারিয়ার হাবের শীর্ষে এবং নোটিফিকেশনে পুশ',
    bestFor: 'এনজিও চাকরি, ক্লিনিক/হাসপাতাল স্টাফ, শোরুম সেলসম্যান ও শিক্ষক নিয়োগ',
    reachEstimate: 'প্রতিদিন ১,৫০০+ চাকরিপ্রার্থী যুবক-যুবতী',
    features: [
      'পূর্ণাঙ্গ চাকরির শর্তাবলী, শিক্ষাগত যোগ্যতা ও বেতন স্পষ্টভাবে পড়ার সুবিধা',
      'ছবি ফুলস্ক্রিনে জুম করা ও ছবি হিসেবে ডাউনলোডের অপশন',
      'সরাসরি অনলাইনে আবেদন বা সিভি পাঠানোর ইমেইল ও হোয়াটসঅ্যাপ লিংক',
      'অ্যাপের পুশ নোটিফিকেশনের মাধ্যমে চাকরিপ্রার্থীদের কাছে সরাসরি অ্যালার্ট',
    ],
    mockupType: 'flyer',
    serviceType: 'job_listing',
  },
];

interface Props {
  onSelectFormat?: (serviceType: MonetizationServiceType, formatName: string) => void;
}

export const AdFormatsGuide: React.FC<Props> = ({ onSelectFormat }) => {
  const [activeFormatId, setActiveFormatId] = useState<string>('header_leaderboard');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');

  const activeFormat = AD_FORMATS.find((f) => f.id === activeFormatId) || AD_FORMATS[0];

  return (
    <div className="space-y-6">
      {/* Format Header Intro */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-emerald-800/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
              <Layout className="w-3.5 h-3.5" />
              <span>বিজ্ঞাপন ফরম্যাট ও মাপ নির্দেশিকা</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Our Jamalpur বিজ্ঞাপন ফরম্যাট ও ব্যানার স্পেসিফিকেশন
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              সঠিক সাইজ ও ফরম্যাটে বিজ্ঞাপন দিলে আপনার প্রতিষ্ঠান পায় সর্বোচ্চ দৃষ্টি আকর্ষণ ও গ্রাহক রিচ। নিচে প্রতিটি বিজ্ঞাপন ফরম্যাটের নির্দিষ্ট পিক্সেল মাপ, অনুপাত ও লাইভ প্রিভিউ দেখে আপনার পছন্দের ফরম্যাটটি বেছে নিন।
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/20 shrink-0 text-center sm:text-left">
            <span className="text-[11px] text-emerald-300 font-bold block mb-1">
              🎨 রেডি ব্যানার নেই? কোনো চিন্তা নেই!
            </span>
            <p className="text-xs text-white font-semibold">
              বিজ্ঞাপন দিলে আমাদের নিজস্ব ডিজাইনার টিম সম্পূর্ণ ফ্রিতে আপনার ব্যানার বানিয়ে দেবে।
            </p>
          </div>
        </div>
      </div>

      {/* Format Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {AD_FORMATS.map((format) => {
          const isSelected = format.id === activeFormatId;
          return (
            <button
              key={format.id}
              onClick={() => setActiveFormatId(format.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-[1.02]'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Layout className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
              <span>{format.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Showcase Grid: Left Specs Details, Right Interactive Visual Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Format Specifications (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-md border ${activeFormat.tagColor}`}>
                {activeFormat.tag}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1.5">
                {activeFormat.name}
              </h3>
              <span className="text-xs text-slate-500 font-medium">{activeFormat.nameEn}</span>
            </div>

            {onSelectFormat && (
              <button
                onClick={() => onSelectFormat(activeFormat.serviceType, activeFormat.name)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition"
              >
                <span>এই ফরম্যাটে দিন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Stats Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] text-slate-500 font-bold block mb-1">
                💻 কম্পিউটার সাইজ
              </span>
              <span className="font-mono font-black text-slate-900 text-xs">
                {activeFormat.desktopSize}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] text-slate-500 font-bold block mb-1">
                📱 মোবাইল সাইজ
              </span>
              <span className="font-mono font-black text-slate-900 text-xs">
                {activeFormat.mobileSize}
              </span>
            </div>

            <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200/70">
              <span className="text-[10px] text-emerald-700 font-bold block mb-1">
                📐 অনুপাত (Aspect Ratio)
              </span>
              <span className="font-bold text-emerald-900 text-xs">
                {activeFormat.aspectRatio}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] text-slate-500 font-bold block mb-1">
                📦 ফাইল সাইজ লিমিট
              </span>
              <span className="font-bold text-slate-900 text-xs">
                {activeFormat.maxFileSize}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] text-slate-500 font-bold block mb-1">
                👥 আনুমানিক রিচ
              </span>
              <span className="font-bold text-slate-900 text-xs">
                {activeFormat.reachEstimate}
              </span>
            </div>

            <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200/70">
              <span className="text-[10px] text-blue-700 font-bold block mb-1">
                🖼️ ফাইল ফরম্যাট সাপোর্ট
              </span>
              <span className="font-bold text-blue-900 text-xs">
                JPG, PNG, WebP, GIF
              </span>
            </div>
          </div>

          {/* Placement & Best For */}
          <div className="space-y-3 pt-1">
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1">
                📍 অ্যাপে প্রদর্শনের স্থান:
              </span>
              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                {activeFormat.placementLocation}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1">
                🎯 যে ধরণের ব্যবসার জন্য সবচেয়ে উপযুক্ত:
              </span>
              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                {activeFormat.bestFor}
              </p>
            </div>
          </div>

          {/* Features List */}
          <div>
            <span className="text-xs font-extrabold text-slate-800 block mb-2">
              ✨ এই ফরম্যাটের বিশেষ সুবিধাসমূহ:
            </span>
            <ul className="space-y-2 text-xs text-slate-600">
              {activeFormat.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Live Interactive Format Mockup (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-black">লাইভ ফরম্যাট প্রিভিউ সিমুলেশন</span>
            </div>

            {/* Device Switcher */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
                  previewDevice === 'mobile'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>মোবাইল</span>
              </button>
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
                  previewDevice === 'desktop'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3 h-3" />
                <span>ডেস্কটপ</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            নিচে দেখুন জামালপুর পোর্টালে এই বিজ্ঞাপনী ব্যানারটি ব্যবহারকারীদের সামনে ঠিক কীভাবে দেখা যাবে:
          </p>

          {/* Interactive Screen Container */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 min-h-[300px] flex flex-col justify-center items-center relative overflow-hidden">
            {/* Header Leaderboard Simulation */}
            {activeFormat.mockupType === 'leaderboard' && (
              <div className="w-full bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-2 border-dashed border-emerald-500 rounded-2xl p-4 text-center shadow-lg relative">
                <span className="absolute top-2 right-2 text-[9px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase">
                  {previewDevice === 'desktop' ? '728 × 180' : '360 × 120'}
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto mb-2">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-[10px] text-emerald-300 font-extrabold uppercase tracking-wider">
                  [বিজ্ঞাপনদাতার প্রতিষ্ঠান বা শোরুমের নাম]
                </div>
                <h4 className="text-sm sm:text-base font-black text-white mt-0.5">
                  জামালপুরে আপনার স্পেশাল অফার ও পণ্য প্রচার
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-1">
                  “আমাদের শোরুমে এসে পাচ্ছেন সর্বোচ্চ ৪০% পর্যন্ত ডিসকাউন্ট!”
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1">
                    <Phone className="w-3 h-3" /> <span>কল করুন</span>
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white/10 text-white font-bold text-xs flex items-center gap-1 border border-white/20">
                    <MessageSquare className="w-3 h-3 text-green-400" /> <span>WhatsApp</span>
                  </span>
                </div>
              </div>
            )}

            {/* In-Feed Rectangle Simulation */}
            {activeFormat.mockupType === 'infeed' && (
              <div className="w-[280px] sm:w-[320px] bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-dashed border-blue-400 rounded-2xl p-4 text-center shadow-lg relative">
                <span className="absolute top-2 right-2 text-[9px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-black uppercase">
                  300 × 250 px
                </span>
                <div className="w-full h-24 bg-blue-950/60 rounded-xl border border-blue-800/60 flex items-center justify-center mb-2 text-blue-300">
                  <FileImage className="w-8 h-8" />
                </div>
                <div className="text-[10px] text-blue-400 font-bold">রেস্টুরেন্ট / ডায়াগনস্টিক স্পন্সর</div>
                <h4 className="text-xs font-black text-white mt-1">স্পেশাল প্যাকেজ ও ফ্রি ডেলিভারি অফার</h4>
                <div className="mt-3 flex justify-center">
                  <span className="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5">
                    <Phone className="w-3 h-3" /> <span>সরাসরি অর্ডার করুন</span>
                  </span>
                </div>
              </div>
            )}

            {/* Marketplace Card Simulation */}
            {activeFormat.mockupType === 'marketplace' && (
              <div className="w-[240px] sm:w-[260px] bg-slate-900 border-2 border-amber-400 rounded-2xl p-3 shadow-xl relative text-left">
                <div className="absolute top-2 left-2 bg-amber-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-md uppercase">
                  FEATURED
                </div>
                <span className="absolute top-2 right-2 text-[9px] bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                  1:1 Square
                </span>
                <div className="w-full aspect-square bg-amber-950/40 rounded-xl border border-amber-700/50 flex flex-col items-center justify-center mb-2 text-amber-300">
                  <FileImage className="w-10 h-10 mb-1" />
                  <span className="text-[10px] font-bold">পণ্যের আসল ছবি (600x600)</span>
                </div>
                <div className="text-xs font-black text-white line-clamp-1">
                  ইয়ামাহা আর১৫ ভি৩ বাইক (জরুরি বিক্রয়)
                </div>
                <div className="text-amber-400 font-black text-sm mt-0.5">৳ ২,৫০,০০০</div>
                <div className="text-[10px] text-slate-400 mt-0.5">📍 জামালপুর সদর</div>
                <button className="w-full mt-2 py-1.5 bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1">
                  <Phone className="w-3 h-3" /> <span>কল করুন</span>
                </button>
              </div>
            )}

            {/* Full Width Strip Simulation */}
            {activeFormat.mockupType === 'strip' && (
              <div className="w-full bg-gradient-to-r from-purple-900 via-pink-900 to-indigo-950 border-2 border-dashed border-purple-400 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left relative">
                <span className="absolute -top-2 right-2 text-[9px] bg-purple-500 text-white px-2 py-0.5 rounded-full font-black">
                  1200 × 160 Full Width
                </span>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">
                      🎉 বৈশাখী মেগা অফার — সব পণ্যে ৩০% ছাড়!
                    </div>
                    <div className="text-[10px] text-purple-200">
                      জামালপুর স্টেশন রোড শোরুমে আজই আসুন
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-white text-purple-900 font-black text-xs rounded-lg whitespace-nowrap">
                  বিস্তারিত অফার
                </span>
              </div>
            )}

            {/* Splash / Pop-up Simulation */}
            {activeFormat.mockupType === 'splash' && (
              <div className="w-[260px] bg-gradient-to-br from-rose-950 via-slate-900 to-slate-950 border-2 border-rose-500 rounded-2xl p-4 text-center shadow-2xl relative">
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-bold">
                  ✕
                </div>
                <span className="text-[9px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold uppercase block w-fit mx-auto mb-2">
                  স্প্ল্যাশ পপ-আপ (600 × 600)
                </span>
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-2">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black text-white">গ্র্যান্ড ওপেনিং উৎসব!</h4>
                <p className="text-[11px] text-slate-300 mt-1">
                  জামালপুরে আমাদের নতুন ব্রাঞ্চ উদ্বোধন উপলক্ষে প্রথম ১০০ জনের জন্য ফ্রি গিফট।
                </p>
                <div className="mt-3 flex flex-col gap-1.5">
                  <button className="w-full py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-lg text-xs">
                    লোকেশন দেখুন ও কল করুন
                  </button>
                  <span className="text-[10px] text-slate-400">অ্যাপে প্রবেশ করুন</span>
                </div>
              </div>
            )}

            {/* Job Flyer Simulation */}
            {activeFormat.mockupType === 'flyer' && (
              <div className="w-[240px] bg-slate-900 border-2 border-teal-400 rounded-2xl p-3 shadow-lg relative text-left">
                <span className="absolute top-2 right-2 text-[9px] bg-teal-500 text-slate-950 font-bold px-1.5 py-0.5 rounded font-mono">
                  800 × 1200 px
                </span>
                <div className="w-full h-32 bg-teal-950/60 rounded-xl border border-teal-800 flex flex-col items-center justify-center text-teal-300 p-2 text-center mb-2">
                  <FileImage className="w-8 h-8 mb-1" />
                  <span className="text-[10px] font-bold leading-tight">জরুরি নিয়োগ বিজ্ঞপ্তি (ফ্লায়ার)</span>
                </div>
                <div className="text-xs font-black text-white">সেলস এক্সিকিউটিভ পদে ৫ জন নিয়োগ</div>
                <div className="text-[10px] text-teal-400 font-bold mt-0.5">বেতন: ৳ ১৫,০০০ - ২০,০০০</div>
                <div className="text-[10px] text-slate-300 mt-1">শিক্ষাগত যোগ্যতা: এইচএসসি / ডিগ্রি</div>
                <button className="w-full mt-2.5 py-1.5 bg-teal-500 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1">
                  <span>সিভি পাঠান (WhatsApp)</span>
                </button>
              </div>
            )}
          </div>

          {/* Guidelines info */}
          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Info className="w-3.5 h-3.5" />
              <span>ব্যানার জমা দেওয়ার নিয়মাবলী:</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              ব্যানারে আপনার প্রতিষ্ঠানের নাম, স্পষ্ট ছবি ও মোবাইল নম্বর থাকতে হবে। বিজ্ঞাপন বুকিংয়ের পর আমাদের হোয়াটসঅ্যাপ (০১৩১৫৪৮১৮৭৯)-এ সরাসরি ছবি পাঠাতে পারবেন।
            </p>
          </div>
        </div>
      </div>

      {/* Technical Formats & Asset Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileImage className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              সকল বিজ্ঞাপন ফরম্যাট ও কারিগরি বিবরণী এক নজরে (Summary Table)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
            সর্বশেষ আপডেট
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                <th className="p-3 rounded-l-xl">বিজ্ঞাপন ফরম্যাট</th>
                <th className="p-3">ডেস্কটপ মাপ</th>
                <th className="p-3">মোবাইল মাপ</th>
                <th className="p-3">অনুপাত</th>
                <th className="p-3">সর্বোচ্চ সাইজ</th>
                <th className="p-3">সমর্থিত ফাইল</th>
                <th className="p-3 rounded-r-xl text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {AD_FORMATS.map((fmt) => (
                <tr key={fmt.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-bold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span>{fmt.name}</span>
                    </div>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-700">{fmt.desktopSize}</td>
                  <td className="p-3 font-mono font-bold text-slate-700">{fmt.mobileSize}</td>
                  <td className="p-3 text-slate-600 font-semibold">{fmt.aspectRatio}</td>
                  <td className="p-3 text-slate-600">{fmt.maxFileSize}</td>
                  <td className="p-3 text-slate-600 font-medium">JPG, PNG, WebP</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => {
                        setActiveFormatId(fmt.id);
                        if (onSelectFormat) {
                          onSelectFormat(fmt.serviceType, fmt.name);
                        }
                      }}
                      className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-200 transition cursor-pointer text-[11px]"
                    >
                      বাছাই করুন
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
