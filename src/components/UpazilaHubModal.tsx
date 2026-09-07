import React, { useState } from 'react';
import {
  MapPin,
  X,
  Phone,
  Building2,
  Shield,
  Flame,
  HeartPulse,
  Newspaper,
  ShoppingBag,
  ExternalLink,
  CheckCircle,
  Navigation,
  Compass,
  Sparkles,
} from 'lucide-react';
import { Upazila, TabType } from '../types';

interface UpazilaDetail {
  id: Upazila;
  nameBn: string;
  tagline: string;
  landmarks: string[];
  famousFor: string;
  contacts: {
    uno: string;
    police: string;
    hospital: string;
    fireService: string;
  };
  stats: {
    unions: number;
    policeStation: string;
    distanceFromHQ: string;
  };
}

export const UPAZILA_DATA: UpazilaDetail[] = [
  {
    id: 'জামালপুর সদর',
    nameBn: 'জামালপুর সদর',
    tagline: 'জেলা সদর ও প্রশাসনিক কেন্দ্র',
    landmarks: [
      'জেলা প্রশাসক ও পুলিশ সুপারের কার্যালয়',
      'শেখ হাসিনা মেডিকেল কলেজ ও জেনারেল হাসপাতাল',
      'সরকারি আশেক মাহমুদ কলেজ',
      'জামালপুর রেলওয়ে জংশন',
      'পুরাতন ব্রহ্মপুত্র নদ ও রিভারভিউ পার্ক',
    ],
    famousFor: 'নকশী কাঁথা, হস্তশিল্প, মিল্লি ভাত ও পোড়া পিঠা',
    contacts: {
      uno: '01715-123456',
      police: '01320-107777',
      hospital: '01730-324455',
      fireService: '01711-223344',
    },
    stats: {
      unions: 15,
      policeStation: 'জামালপুর সদর থানা',
      distanceFromHQ: '০ কিমি (জেলা শহর)',
    },
  },
  {
    id: 'ইসলামপুর',
    nameBn: 'ইসলামপুর',
    tagline: 'ঐতিহ্যবাহী কাঁসা-পিতল শিল্পের জনপদ',
    landmarks: [
      'ইসলামপুর কাঁসা শিল্প কারখানা ও বিপণি বিতান',
      'গুঠাইল ঘাট ও নদী বন্দর',
      'ইসলামপুর রেলওয়ে স্টেশন',
      'যমুনা নদীর চর ও পাইলিং বেড়িবাঁধ',
    ],
    famousFor: 'ঐতিহ্যবাহী কাঁসার তৈজসপত্র ও গুঠাইলের জিলাপী',
    contacts: {
      uno: '01715-234567',
      police: '01320-107800',
      hospital: '01730-324466',
      fireService: '01711-334455',
    },
    stats: {
      unions: 12,
      policeStation: 'ইসলামপুর থানা',
      distanceFromHQ: '২৫ কিমি',
    },
  },
  {
    id: 'দেওয়ানগঞ্জ',
    nameBn: 'দেওয়ানগঞ্জ',
    tagline: 'চিনিকল, নদী বন্দর ও উত্তরবঙ্গের প্রবেশদ্বার',
    landmarks: [
      'জিল বাংলা সুগার মিলস লিমিটেড',
      'ঐতিহাসিক বাহাদুরাবাদ ঘাট',
      'দেওয়ানগঞ্জ রেলওয়ে স্টেশন ও বাজার',
      'ব্রহ্মপুত্র-যমুনা মোহনা ও নদী রক্ষা বাঁধ',
    ],
    famousFor: 'আখের চিনি, খাঁটি গুড় ও নদীর তাজা মাছ',
    contacts: {
      uno: '01715-345678',
      police: '01320-107820',
      hospital: '01730-324477',
      fireService: '01711-445566',
    },
    stats: {
      unions: 8,
      policeStation: 'দেওয়ানগঞ্জ মডেল থানা',
      distanceFromHQ: '৪০ কিমি',
    },
  },
  {
    id: 'মেলান্দহ',
    nameBn: 'মেলান্দহ',
    tagline: 'উচ্চশিক্ষা, টেক্সটাইল ও কৃষি হাব',
    landmarks: [
      'মির্জা আজম চত্বর ও পৌর পার্ক',
      'শেখ কামাল টেক্সটাইল ইঞ্জিনিয়ারিং কলেজ',
      'জাহানারা লতিফ মহিলা কলেজ',
      'মেলান্দহ রেলওয়ে স্টেশন',
    ],
    famousFor: 'পাট, ধান, সবজি ও মিষ্টান্ন',
    contacts: {
      uno: '01715-456789',
      police: '01320-107840',
      hospital: '01730-324488',
      fireService: '01711-556677',
    },
    stats: {
      unions: 11,
      policeStation: 'মেলান্দহ থানা',
      distanceFromHQ: '১৮ কিমি',
    },
  },
  {
    id: 'মাদারগঞ্জ',
    nameBn: 'মাদারগঞ্জ',
    tagline: 'বালিজুড়ী বাণিজ্য কেন্দ্র ও নদীবিধৌত জনপদ',
    landmarks: [
      'বালিজুড়ী ঐতিহ্যবাহী হাট ও বাণিজ্য কেন্দ্র',
      'ঝাড়কাটা নদী ও বালিজুড়ী ব্রীজ',
      'মাদারগঞ্জ পৌরসভা ভবন ও পার্ক',
      'চরপাকেরদহ ও যমুনা উপকূল',
    ],
    famousFor: 'ঘোল, দই, খাঁটি মিষ্টি ও কৃষি পণ্য',
    contacts: {
      uno: '01715-567890',
      police: '01320-107860',
      hospital: '01730-324499',
      fireService: '01711-667788',
    },
    stats: {
      unions: 7,
      policeStation: 'মাদারগঞ্জ মডেল থানা',
      distanceFromHQ: '৩০ কিমি',
    },
  },
  {
    id: 'সরিষাবাড়ী',
    nameBn: 'সরিষাবাড়ী',
    tagline: 'শিল্প শহর ও বৃহত্তম ইউরিয়া সার কারখানা',
    landmarks: [
      'যমুনা ফার্টিলাইজার কোম্পানি লিমিটেড (JFCL)',
      'তারাকান্দি রেলওয়ে জংশন',
      'অ্যাডভোকেট মতিউর রহমান তালুকদার রেলস্টেশন',
      'সরিষাবাড়ী পৌর এলাকা ও ভাটারা',
    ],
    famousFor: 'শিল্পোৎপাদন, পাটকল ও সার কারখানা',
    contacts: {
      uno: '01715-678901',
      police: '01320-107880',
      hospital: '01730-324500',
      fireService: '01711-778899',
    },
    stats: {
      unions: 8,
      policeStation: 'সরিষাবাড়ী থানা',
      distanceFromHQ: '২৫ কিমি',
    },
  },
  {
    id: 'বকশীগঞ্জ',
    nameBn: 'বকশীগঞ্জ',
    tagline: 'ঐতিহাসিক ধানুয়া কামালপুর ও পর্যটন সীমান্ত',
    landmarks: [
      'ঐতিহাসিক ধানুয়া কামালপুর মুক্তিযুদ্ধ স্মৃতিসৌধ ও স্থলবন্দর',
      'লাউচাপড়া অবসর বিনোদন ও পিকনিক স্পট',
      'গারো পাহাড়ের নয়নাভিরাম পাদদেশ ও সীমান্ত চেকপোস্ট',
      'বকশীগঞ্জ নূর মোহাম্মদ উচ্চ বিদ্যালয় মাঠ',
    ],
    famousFor: 'মুক্তিযুদ্ধের ইতিহাস, পাহাড়ি ফলমূল ও পর্যটন',
    contacts: {
      uno: '01715-789012',
      police: '01320-107900',
      hospital: '01730-324511',
      fireService: '01711-889900',
    },
    stats: {
      unions: 7,
      policeStation: 'বকশীগঞ্জ থানা',
      distanceFromHQ: '৩৫ কিমি',
    },
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedUpazila: Upazila;
  onSelectUpazila: (u: Upazila) => void;
  onNavigate: (tab: TabType, extra?: any) => void;
}

export const UpazilaHubModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedUpazila,
  onSelectUpazila,
  onNavigate,
}) => {
  const [activeTabUpazila, setActiveTabUpazila] = useState<Upazila>(
    selectedUpazila === 'সকল উপজেলা' ? 'জামালপুর সদর' : selectedUpazila
  );
  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen) return null;

  const currentDetail =
    UPAZILA_DATA.find((u) => u.id === activeTabUpazila) || UPAZILA_DATA[0];

  const handleApplySelection = (upazila: Upazila) => {
    onSelectUpazila(upazila);
    setActiveTabUpazila(upazila);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        id="upazila-hub-modal-card"
        className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black">
                  জামালপুর জেলার ৭টি উপজেলা পোর্টাল ও জরুরি ডিরেক্টরি
                </h2>
                <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 hidden sm:inline">
                  লাইভ তথ্য
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                উপজেলা নির্বাচন করুন এবং প্রশাসন, থানা, হাসপাতাল, অ্যাম্বুলেন্স ও স্থানীয় সেবা এক ক্লিকে পান
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 7 Upazila Horizontal Selector Bar */}
        <div className="bg-slate-100 dark:bg-slate-800/80 p-2.5 sm:p-3 border-b border-slate-200 dark:border-slate-700 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          <button
            id="upazila-modal-all-btn"
            onClick={() => {
              handleApplySelection('সকল উপজেলা');
              onClose();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
              selectedUpazila === 'সকল উপজেলা'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>সকল উপজেলা (সমগ্র জেলা)</span>
          </button>

          {UPAZILA_DATA.map((up) => {
            const isCurrentSelected = selectedUpazila === up.id;
            const isTabActive = activeTabUpazila === up.id;
            return (
              <button
                key={up.id}
                id={`upazila-modal-tab-${up.id}`}
                onClick={() => {
                  setActiveTabUpazila(up.id);
                  handleApplySelection(up.id);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  isTabActive
                    ? 'bg-emerald-700 text-white shadow-md ring-2 ring-emerald-400/50'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isTabActive ? 'text-amber-300' : 'text-emerald-600'}`} />
                <span>{up.nameBn}</span>
                {isCurrentSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300 ml-0.5"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Body: Active Upazila Deep Information */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Active Upazila Banner */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-slate-800/60 rounded-2xl p-4 sm:p-5 border border-emerald-200 dark:border-emerald-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full">
                  সক্রিয় উপজেলা
                </span>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  {currentDetail.stats.distanceFromHQ}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {currentDetail.nameBn} উপজেলা
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                {currentDetail.tagline} • {currentDetail.stats.unions}টি ইউনিয়ন • {currentDetail.stats.policeStation}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                id="apply-upazila-filter-btn"
                onClick={() => {
                  handleApplySelection(currentDetail.id);
                  onClose();
                }}
                className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <CheckCircle className="w-4 h-4 text-amber-300" />
                <span>{currentDetail.nameBn} সিলেক্ট করুন</span>
              </button>
            </div>
          </div>

          {/* Emergency Hotlines Row for this Upazila */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-rose-500" />
              <span>{currentDetail.nameBn} উপজেলার জরুরি ফোন ও হটলাইন (১ ক্লিকে কল দিন)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* Police */}
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                    <Shield className="w-4 h-4" />
                    <span>থানা পুলিশ (ডিউটি অফিসার)</span>
                  </div>
                  <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-1">
                    {currentDetail.stats.policeStation}
                  </div>
                </div>
                <a
                  href={`tel:${currentDetail.contacts.police.replace(/[^0-9]/g, '')}`}
                  className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{currentDetail.contacts.police}</span>
                </a>
              </div>

              {/* UNO / Admin */}
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                    <Building2 className="w-4 h-4" />
                    <span>উপজেলা প্রশাসন (ইউএনও)</span>
                  </div>
                  <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-1">
                    নির্বাহী অফিসার কন্ট্রোল
                  </div>
                </div>
                <a
                  href={`tel:${currentDetail.contacts.uno.replace(/[^0-9]/g, '')}`}
                  className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{currentDetail.contacts.uno}</span>
                </a>
              </div>

              {/* Hospital / Health */}
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
                    <HeartPulse className="w-4 h-4" />
                    <span>উপজেলা স্বাস্থ্য কমপ্লেক্স / জরুরি</span>
                  </div>
                  <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-1">
                    ২৪ ঘণ্টা জরুরি বিভাগ
                  </div>
                </div>
                <a
                  href={`tel:${currentDetail.contacts.hospital.replace(/[^0-9]/g, '')}`}
                  className="mt-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{currentDetail.contacts.hospital}</span>
                </a>
              </div>

              {/* Fire Service */}
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
                    <Flame className="w-4 h-4" />
                    <span>ফায়ার সার্ভিস স্টেশন</span>
                  </div>
                  <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-1">
                    অগ্নিনির্বাপণ ও উদ্ধার
                  </div>
                </div>
                <a
                  href={`tel:${currentDetail.contacts.fireService.replace(/[^0-9]/g, '')}`}
                  className="mt-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{currentDetail.contacts.fireService}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Key Landmarks & Famous Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                <span>প্রধান প্রধান দর্শনীয় স্থান ও প্রতিষ্ঠান</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {currentDetail.landmarks.map((l, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
              <h4 className="font-extrabold text-xs text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>যেসব পণ্যের জন্য বিখ্যাত</span>
              </h4>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentDetail.famousFor}
              </p>

              <div className="mt-4 pt-3 border-t border-amber-200/80 dark:border-amber-800/40 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    handleApplySelection(currentDetail.id);
                    onNavigate('news');
                    onClose();
                  }}
                  className="bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 hover:bg-blue-50 border border-blue-200 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition"
                >
                  <Newspaper className="w-3.5 h-3.5" />
                  <span>সংবাদ পড়ুন</span>
                </button>
                <button
                  onClick={() => {
                    handleApplySelection(currentDetail.id);
                    onNavigate('blood-donor');
                    onClose();
                  }}
                  className="bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-300 hover:bg-rose-50 border border-rose-200 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition"
                >
                  <HeartPulse className="w-3.5 h-3.5" />
                  <span>রক্তদাতা খুঁজুন</span>
                </button>
                <button
                  onClick={() => {
                    handleApplySelection(currentDetail.id);
                    onNavigate('marketplace');
                    onClose();
                  }}
                  className="bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>মার্কেটপ্লেস</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-3 sm:p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            বর্তমানে নির্বাচিত: <strong className="text-emerald-600 dark:text-emerald-400">{selectedUpazila}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                handleApplySelection('সকল উপজেলা');
                onClose();
              }}
              className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 px-3 py-2 cursor-pointer"
            >
              রিসেট (সকল উপজেলা)
            </button>
            <button
              onClick={() => {
                handleApplySelection(activeTabUpazila);
                onClose();
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
            >
              নিশ্চিত করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
