import React, { useState } from 'react';
import {
  PhoneCall,
  ShieldAlert,
  Flame,
  Ambulance,
  HeartHandshake,
  UserCheck,
  Scale,
  Zap,
  Building2,
  PhoneForwarded,
  Copy,
  CheckCircle2,
  ExternalLink,
  Search,
  AlertOctagon,
  Radio,
} from 'lucide-react';

interface HelplineItem {
  id: string;
  name: string;
  number: string;
  category: 'জাতীয় জরুরি' | 'স্বাস্থ্য ও নারী-শিশু' | 'নাগরিক সেবা ও ভূমি' | 'জামালপুর স্থানীয় কন্ট্রোল';
  description: string;
  available: string;
  iconBg: string;
  charge: 'সম্পূর্ণ ফ্রি' | 'টোল ফ্রি' | 'নিয়মিত চার্জ';
}

const HELPLINES: HelplineItem[] = [
  {
    id: '999',
    name: 'জাতীয় জরুরি সেবা (৯৯৯)',
    number: '999',
    category: 'জাতীয় জরুরি',
    description: 'পুলিশ, অ্যাম্বুলেন্স ও ফায়ার সার্ভিস যেকোনো তাৎক্ষণিক জরুরি প্রয়োজনে।',
    available: '২৪ ঘণ্টা সার্বক্ষণিক',
    iconBg: 'bg-red-600',
    charge: 'টোল ফ্রি',
  },
  {
    id: '333',
    name: 'জাতীয় কল সেন্টার (৩৩৩)',
    number: '333',
    category: 'নাগরিক সেবা ও ভূমি',
    description: 'সরকারি সেবা, সামাজিক সমস্যা প্রতিকার ও জেলা প্রশাসনের তথ্য পেতে।',
    available: '২৪ ঘণ্টা সার্বক্ষণিক',
    iconBg: 'bg-emerald-600',
    charge: 'নিয়মিত চার্জ',
  },
  {
    id: '109',
    name: 'নারী ও শিশু নির্যাতন প্রতিরোধ (১০৯)',
    number: '109',
    category: 'স্বাস্থ্য ও নারী-শিশু',
    description: 'নারী ও শিশুদের যেকোনো সহিংসতা ও নির্যাতনের বিরুদ্ধে তাৎক্ষণিক আইনি সহায়তা।',
    available: '২৪ ঘণ্টা সার্বক্ষণিক',
    iconBg: 'bg-rose-600',
    charge: 'টোল ফ্রি',
  },
  {
    id: '1098',
    name: 'চাইল্ড হেল্পলাইন (১০৯৮)',
    number: '1098',
    category: 'স্বাস্থ্য ও নারী-শিশু',
    description: 'বিপদাপন্ন ও ঝুঁকিপূর্ণ শিশুদের তাৎক্ষণিক সুরক্ষা ও কাউন্সিলিং সহায়তা।',
    available: '২৪ ঘণ্টা সার্বক্ষণিক',
    iconBg: 'bg-pink-600',
    charge: 'টোল ফ্রি',
  },
  {
    id: '16263',
    name: 'স্বাস্থ্য বাতায়ন (১৬২৬৩)',
    number: '16263',
    category: 'স্বাস্থ্য ও নারী-শিশু',
    description: 'ঘরে বসেই যেকোনো রোগের জন্য সরাসরি অভিজ্ঞ চিকিৎসকের পরামর্শ ও প্রেসক্রিপশন।',
    available: '২৪ ঘণ্টা সার্বক্ষণিক',
    iconBg: 'bg-blue-600',
    charge: 'টোল ফ্রি',
  },
  {
    id: '16122',
    name: 'ডিজিটাল ভূমি সেবা হটলাইন (১৬১২২)',
    number: '16122',
    category: 'নাগরিক সেবা ও ভূমি',
    description: 'খতিয়ান, নামজারি, মিসকেস ও ভূমি উন্নয়ন কর সংক্রান্ত যেকোনো সেবা ও অভিযোগ।',
    available: 'সকাল ৯টা - রাত ৮টা',
    iconBg: 'bg-amber-600',
    charge: 'নিয়মিত চার্জ',
  },
  {
    id: '106',
    name: 'দুর্নীতি দমন কমিশন হটলাইন (১০৬)',
    number: '106',
    category: 'নাগরিক সেবা ও ভূমি',
    description: 'ঘুষ, দুর্নীতি ও অনিয়মের ঘটনা সরাসরি দুদক প্রধান কার্যালয়ে জানাতে।',
    available: 'সকাল ৯টা - বিকাল ৫টা',
    iconBg: 'bg-indigo-600',
    charge: 'টোল ফ্রি',
  },
  {
    id: '1090',
    name: 'দুর্যোগের আগাম বার্তা (১০৯০)',
    number: '1090',
    category: 'জাতীয় জরুরি',
    description: 'বন্যা, নদী ভাঙন, ঝড় ও ঘূর্ণিঝড়ের আগাম সতর্কতা বুলেটিন শুনতে।',
    available: '২৪ ঘণ্টা সার্বক্ষণিক',
    iconBg: 'bg-cyan-600',
    charge: 'টোল ফ্রি',
  },
  {
    id: '16430',
    name: 'জাতীয় আইনগত সহায়তা (১৬৪৩০)',
    number: '16430',
    category: 'নাগরিক সেবা ও ভূমি',
    description: 'অসহায় ও দরিদ্র নাগরিকদের জন্য বিনামূল্যে সরকারি আইনি পরামর্শ ও আইনজীবী সহায়তা।',
    available: 'অফিস চলাকালীন',
    iconBg: 'bg-violet-600',
    charge: 'টোল ফ্রি',
  },
  {
    id: 'dc-control',
    name: 'জামালপুর জেলা প্রশাসন কন্ট্রোল রুম',
    number: '01713-333000',
    category: 'জামালপুর স্থানীয় কন্ট্রোল',
    description: 'জেলা প্রশাসক কার্যালয় জামালপুর ও উপজেলা প্রশাসন সম্পর্কিত জরুরি বার্তা।',
    available: '২৪ ঘণ্টা কন্ট্রোল ডেস্ক',
    iconBg: 'bg-slate-700',
    charge: 'নিয়মিত চার্জ',
  },
  {
    id: 'cs-office',
    name: 'জামালপুর সিভিল সার্জন অফিস',
    number: '01712-444555',
    category: 'জামালপুর স্থানীয় কন্ট্রোল',
    description: 'জামালপুর জেলার স্বাস্থ্য কমপ্লেক্স, ডেঙ্গু ও সংক্রামক রোগ নিয়ন্ত্রণ সমন্বয়।',
    available: '২৪ ঘণ্টা জরুরি হেল্প',
    iconBg: 'bg-teal-600',
    charge: 'নিয়মিত চার্জ',
  },
  {
    id: 'fire-station',
    name: 'জামালপুর ফায়ার সার্ভিস স্টেশন',
    number: '01730-002233',
    category: 'জামালপুর স্থানীয় কন্ট্রোল',
    description: 'জামালপুর সদর ও আশপাশের অগ্নিদুর্ঘটনা ও উদ্ধার তৎপরতায় তাৎক্ষণিক কল করুন।',
    available: '২৪ ঘণ্টা প্রস্তুত',
    iconBg: 'bg-red-700',
    charge: 'নিয়মিত চার্জ',
  },
  {
    id: 'sadar-thana',
    name: 'জামালপুর সদর থানা ডিউটি অফিসার',
    number: '01713-373650',
    category: 'জামালপুর স্থানীয় কন্ট্রোল',
    description: 'জামালপুর সদর এলাকার আইন-শৃঙ্খলা ও পুলিশি সহায়তায় ডিউটি অফিসার।',
    available: '২৪ ঘণ্টা সচল',
    iconBg: 'bg-blue-800',
    charge: 'নিয়মিত চার্জ',
  },
  {
    id: 'palli-bidyut',
    name: 'জামালপুর পল্লী বিদ্যুৎ জরুরি অভিযোগ',
    number: '01769-400000',
    category: 'জামালপুর স্থানীয় কন্ট্রোল',
    description: 'বিদ্যুৎ বিভ্রাট, ট্রান্সফরমার সমস্যা ও তার ছিঁড়ে যাওয়ার জরুরি অভিযোগ গ্রহণ।',
    available: '২৪ ঘণ্টা অভিযোগ কেন্দ্র',
    iconBg: 'bg-amber-700',
    charge: 'নিয়মিত চার্জ',
  },
];

export const HelplinesView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'সকল হেল্পলাইন' },
    { id: 'জাতীয় জরুরি', label: '🚨 জাতীয় জরুরি' },
    { id: 'স্বাস্থ্য ও নারী-শিশু', label: '👩‍⚕️ স্বাস্থ্য ও নারী-শিশু' },
    { id: 'নাগরিক সেবা ও ভূমি', label: '🏛️ নাগরিক ও ভূমি সেবা' },
    { id: 'জামালপুর স্থানীয় কন্ট্রোল', label: '📍 জামালপুর জেলা কন্ট্রোল' },
  ];

  const filtered = HELPLINES.filter((item) => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchSearch =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.number.includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCopy = (id: string, number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-slate-900 dark:text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-red-700/40">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-800/80 text-red-200 text-xs font-black mb-3 border border-red-600/40">
            <ShieldAlert className="w-3.5 h-3.5 text-red-300 animate-pulse" />
            <span>জরুরি নাগরিক কল সেন্টার ও হেল্পলাইন ডিরেক্টরি</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            জাতীয় ও জামালপুর জেলার জরুরি হেল্পলাইন ও হটলাইন
          </h1>
          <p className="text-xs sm:text-sm text-red-200 mt-2 leading-relaxed">
            যেকোনো বিপদে পুলিশ, ফায়ার সার্ভিস, অ্যাম্বুলেন্স, স্বাস্থ্য বাতায়ন বা জেলা প্রশাসনের সহায়তা পেতে এক ট্যাপে সরাসরি কল করুন।
          </p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="নম্বর বা সেবার নাম দিয়ে খুঁজুন (যেমন: ৯৯৯, ফায়ার সার্ভিস, স্বাস্থ্য)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 text-xs font-semibold">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white border-red-600 shadow-xs font-bold'
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Helplines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-red-500 dark:hover:border-red-500 transition duration-200 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl ${item.iconBg} text-white flex items-center justify-center font-black text-sm shadow-xs`}>
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                      {item.name}
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  {item.charge}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <div className="text-xs">
                <span className="text-[10px] text-slate-400 block">সময়কাল:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{item.available}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopy(item.id, item.number)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                  title="নম্বর কপি করুন"
                >
                  {copiedId === item.id ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <a
                  href={`tel:${item.number}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition cursor-pointer group-hover:scale-105"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>কল করুন</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
