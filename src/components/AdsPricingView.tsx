import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  Briefcase,
  Store,
  CheckCircle2,
  Phone,
  MessageSquare,
  CreditCard,
  Copy,
  Zap,
  Award,
  Users,
  Target,
  ArrowRight,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';
import { MonetizationServiceType } from '../types';
import { MonetizationModal } from './MonetizationModal';
import { OWNER_PAYMENT_INFO } from '../services/storageService';

export const AdsPricingView: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<MonetizationServiceType>('banner_ad');
  const [copied, setCopied] = useState<string | null>(null);

  const handleOpenModal = (service: MonetizationServiceType) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 relative overflow-hidden shadow-xl border border-emerald-800/40">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-3">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>জামালপুর জেলার সর্ববৃহৎ ডিজিটাল মার্কেটপ্লেস ও প্রচার মাধ্যম</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            আপনার ব্যবসা, পণ্য ও সেবার প্রচার করুন হাজার হাজার জামালপুরবাসীর কাছে
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
            স্বল্প খরচে লোকাল টার্গেটেড গ্রাহকদের কাছে পৌঁছাতে <strong>Our Jamalpur</strong>-এর ব্যানার বিজ্ঞাপন, মার্কেটপ্লেস বুস্টিং ও নিয়োগ বিজ্ঞপ্তি প্যাকেজ বেছে নিন।
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => handleOpenModal('banner_ad')}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3 rounded-2xl transition shadow-lg flex items-center gap-2 cursor-pointer text-sm"
            >
              <Zap className="w-4 h-4" />
              <span>বিজ্ঞাপন বুকিং করুন</span>
            </button>
            <a
              href="tel:01315481879"
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-2xl transition flex items-center gap-2 text-sm border border-white/20"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>পরিচালকের সাথে কথা বলুন (০১৩১৫৪৮১৮৭৯)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: Users, label: 'জামালপুরে মাসিক ব্যবহারকারী', value: '২৫,০০০+', color: 'text-emerald-600 bg-emerald-50' },
          { icon: Target, label: '৭টি উপজেলার টার্গেটেড রিচ', value: '১০০%', color: 'text-blue-600 bg-blue-50' },
          { icon: TrendingUp, label: 'বিজ্ঞাপনে বিক্রয় বৃদ্ধি', value: '৩ গুণ পর্যন্ত', color: 'text-purple-600 bg-purple-50' },
          { icon: Award, label: 'ভেরিফাইড ব্যবসায়িক পার্টনার', value: '৫০+ প্রতিষ্ঠান', color: 'text-amber-600 bg-amber-50' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-xl font-black text-slate-900">{stat.value}</div>
              <div className="text-[11px] font-semibold text-slate-500 mt-0.5">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Pricing Packages Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">বিজ্ঞাপন ও প্রমোশন রেটকার্ড</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              আপনার প্রয়োজন অনুযায়ী যেকোনো প্যাকেজ বেছে নিয়ে আজই প্রচার শুরু করুন
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shrink-0">
            স্বচ্ছ মূল্য তালিকা (Fixed Rate)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Banner Ads */}
          <div className="bg-white rounded-3xl border-2 border-emerald-500 shadow-md p-5 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              সবচেয়ে জনপ্রিয়
            </div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">হোম ও পেজ ব্যানার বিজ্ঞাপন</h3>
              <p className="text-xs text-slate-500 mt-1">
                অ্যাপের হোম পেজের শীর্ষে জামালপুরের প্রতিটি নাগরিকের সামনে বড় ব্যানার।
              </p>

              <div className="my-4 p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1.5 text-xs text-emerald-950">
                <div className="flex justify-between font-bold">
                  <span>৭ দিনের ব্যানার:</span>
                  <span className="text-emerald-700 font-extrabold">৳ ৩০০</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>১৫ দিনের ব্যানার:</span>
                  <span className="text-emerald-700 font-extrabold">৳ ৫৫০</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>৩০ দিনের সুপার ব্যানার:</span>
                  <span className="text-emerald-700 font-extrabold">৳ ৯৫০</span>
                </div>
              </div>

              <ul className="text-xs text-slate-600 space-y-2 mb-5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>সরাসরি কল বা হোয়াটসঅ্যাপ লিংক</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>ফেসবুক পেজ / শোরুম লোকেশন লিংক</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>প্রতিদিন হাজারো নিশ্চিত ভিউ</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenModal('banner_ad')}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>ব্যানার বিজ্ঞাপন দিন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Product Boost */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition p-5 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">মার্কেটপ্লেস পণ্য বুস্ট</h3>
              <p className="text-xs text-slate-500 mt-1">
                আপনার ব্যবহৃত বাইক, মোবাইল, জমি বা পণ্য সবার আগে বিক্রয় করার জন্য টপ লিস্টিং।
              </p>

              <div className="my-4 p-3 bg-amber-50/60 rounded-2xl border border-amber-100 space-y-1.5 text-xs text-amber-950">
                <div className="flex justify-between font-bold">
                  <span>৩ দিন টপ বুস্ট:</span>
                  <span className="text-amber-800 font-extrabold">৳ ৫০</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>৭ দিন সুপার বুস্ট:</span>
                  <span className="text-amber-800 font-extrabold">৳ ১০০</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>১৫ দিন ভিআইপি বুস্ট:</span>
                  <span className="text-amber-800 font-extrabold">৳ ২০০</span>
                </div>
              </div>

              <ul className="text-xs text-slate-600 space-y-2 mb-5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>গোল্ডেন ফ্রেম ও স্পেশাল 'Featured' ব্যাজ</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>সার্চ রেজাল্ট ও ক্যাটাগরির শীর্ষে অবস্থান</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>দ্রুত ক্রেতার সরাসরি কল সুবিধা</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenModal('boost_product')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>পণ্য বুস্ট করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Job Listing */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition p-5 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">নিয়োগ বিজ্ঞপ্তি পোস্ট</h3>
              <p className="text-xs text-slate-500 mt-1">
                এনজিও, শোরুম, ডায়াগনস্টিক বা প্রতিষ্ঠানের জন্য দ্রুত যোগ্য কর্মী নিয়োগ দিন।
              </p>

              <div className="my-4 p-3 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-1.5 text-xs text-blue-950">
                <div className="flex justify-between font-bold">
                  <span>১৫ দিন স্ট্যান্ডার্ড সার্কুলার:</span>
                  <span className="text-blue-700 font-extrabold">৳ ২০০</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>৩০ দিন প্রিমিয়াম নিয়োগ পোস্ট:</span>
                  <span className="text-blue-700 font-extrabold">৳ ৩৫০</span>
                </div>
              </div>

              <ul className="text-xs text-slate-600 space-y-2 mb-5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>চাকরি তালিকার সবার ওপরে হাইলাইট</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>সরাসরি সিভি পাঠানো ও কল অপশন</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>অ্যাপের নোটিফিকেশনে চাকরির বার্তা</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenModal('job_listing')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>চাকরি পোস্ট করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: Business & Doctor Listing */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition p-5 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">ভেরিফাইড শপ ও পার্টনার</h3>
              <p className="text-xs text-slate-500 mt-1">
                আপনার দোকান, রেস্টুরেন্ট বা ক্লিনিককে ভেরিফাইড প্রতিষ্ঠান হিসেবে ব্রান্ডিং করুন।
              </p>

              <div className="my-4 p-3 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-1.5 text-xs text-purple-950">
                <div className="flex justify-between font-bold">
                  <span>১ মাস ভেরিফাইড শপ ব্যাজ:</span>
                  <span className="text-purple-700 font-extrabold">৳ ৩০০</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>৩ মাস পার্টনারশিপ প্যাক:</span>
                  <span className="text-purple-700 font-extrabold">৳ ৭৫০</span>
                </div>
              </div>

              <ul className="text-xs text-slate-600 space-y-2 mb-5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>নীল ভেরিফাইড (Verified ☑️) ব্যাজ</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>গুগল ম্যাপ ও ঠিকানা ডিরেকশনে সংযুক্তি</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>গ্রাহকদের কাছে সরাসরি শীর্ষ রেটিং</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenModal('featured_business')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>ব্যবসা লিস্টিং করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Official Payment Accounts Box */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-purple-800/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
              <CreditCard className="w-3.5 h-3.5" />
              <span>অফিসিয়াল পেমেন্ট গেটওয়ে</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              বিকাশ, নগদ ও রকেটে সহজে পেমেন্ট করুন
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              নিচের নম্বরে পার্সোনাল সেন্ড মানি (Send Money) করে ট্রানজেকশন আইডি দিয়ে আবেদন সাবমিট করুন।
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 w-full md:w-auto min-w-[280px]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-purple-200 font-bold block">
                  বিকাশ / নগদ / রকেট (পার্সোনাল)
                </span>
                <span className="text-lg sm:text-xl font-black text-white tracking-wider">
                  {OWNER_PAYMENT_INFO.phone}
                </span>
                <span className="text-[11px] text-emerald-300 block font-medium">
                  হোল্ডার: {OWNER_PAYMENT_INFO.ownerName} (পরিচালক)
                </span>
              </div>
              <button
                onClick={() => handleCopy(OWNER_PAYMENT_INFO.phone, 'official_phone')}
                className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition cursor-pointer shrink-0"
                title="নম্বর কপি করুন"
              >
                {copied === 'official_phone' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <h3 className="text-xl font-black text-slate-900">
          কেন Our Jamalpur অ্যাপে আপনার প্রতিষ্ঠানের বিজ্ঞাপন দেবেন?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">১০০% জামালপুরের স্থানীয় অডিয়েন্স</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                ফেসবুকের মতো অপ্রয়োজনীয় জায়গায় টাকা নষ্ট না করে সরাসরি জামালপুর জেলার ৭টি উপজেলার স্থানীয় বাসিন্দাদের কাছে পৌঁছান।
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">সর্বনিম্ন খরচে সর্বোচ্চ রিটার্ন</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                মাত্র ৫০ টাকা থেকে শুরু করে পূর্ণাঙ্গ মাসিক প্রচারের সুলভ ও স্বচ্ছ বাজেট।
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">সরাসরি কল ও সেলস ট্র্যাকিং</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                বিজ্ঞাপনে এক ক্লিকেই গ্রাহক সরাসরি আপনাকে ফোন বা হোয়াটসঅ্যাপ করতে পারেন, কোনো মাধ্যম ছাড়াই।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Contact Hotline */}
      <div className="p-6 bg-slate-100 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="font-extrabold text-base text-slate-900">
            কাস্টম বিজ্ঞাপন বা কর্পোরেট পার্টনারশিপের জন্য
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            সরাসরি যোগাযোগ করুন পরিচালক <strong>মাসুদ রানা</strong>-র সাথে
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="tel:01315481879"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <Phone className="w-4 h-4" />
            <span>01315481879</span>
          </a>
          <a
            href="https://wa.me/8801315481879"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Modal */}
      <MonetizationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultService={selectedService}
      />
    </div>
  );
};
