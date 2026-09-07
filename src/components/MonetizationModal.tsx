import React, { useState } from 'react';
import {
  X,
  Sparkles,
  TrendingUp,
  Briefcase,
  Store,
  CheckCircle2,
  Copy,
  CreditCard,
  Send,
  Phone,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { MonetizationServiceType, PaymentMethod } from '../types';
import { storageService, OWNER_PAYMENT_INFO } from '../services/storageService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: MonetizationServiceType;
  targetId?: string;
  targetTitle?: string;
  onSuccess?: () => void;
}

interface PackageOption {
  id: string;
  title: string;
  days: number;
  price: number;
  badge?: string;
  desc: string;
}

const PACKAGES: Record<MonetizationServiceType, PackageOption[]> = {
  boost_product: [
    {
      id: 'p_boost_3',
      title: '৩ দিন টপ বুস্ট',
      days: 3,
      price: 50,
      badge: 'জনপ্রিয়',
      desc: 'মার্কেটপ্লেসের সবার ওপরে গোল্ডেন হাইলাইট সহ প্রদর্শিত হবে।',
    },
    {
      id: 'p_boost_7',
      title: '৭ দিন সুপার বুস্ট',
      days: 7,
      price: 100,
      badge: 'সেরা অফার',
      desc: '৭ দিন টপ পজিশন + হোম পেজের দ্রুত কেনাবেচায় অগ্রাধিকার।',
    },
    {
      id: 'p_boost_15',
      title: '১৫ দিন ভিআইপি বুস্ট',
      days: 15,
      price: 200,
      desc: '১৫ দিন একটানা মার্কেটপ্লেসের সবার শীর্ষে প্রদর্শিত থাকবে।',
    },
  ],
  banner_ad: [
    {
      id: 'p_banner_7',
      title: '৭ দিনের হোম পেজ ব্যানার',
      days: 7,
      price: 300,
      desc: 'হোম পেজের শীর্ষে জামালপুরবাসীর সামনে আপনার ব্র্যান্ড বা শপ।',
    },
    {
      id: 'p_banner_15',
      title: '১৫ দিনের প্রাইম ব্যানার',
      days: 15,
      price: 550,
      badge: 'জনপ্রিয়',
      desc: 'হোম ও মার্কেটপ্লেস উভয় পেজে সর্বোচ্চ ভিউ ও ভিজিটর।',
    },
    {
      id: 'p_banner_30',
      title: '৩০ দিনের সুপার স্পন্সর ব্যানার',
      days: 30,
      price: 950,
      badge: 'সর্বোচ্চ লাভজনক',
      desc: '১ মাস ব্যাপী অ্যাপের মূল পেজসমূহে ব্যানার + ফেসবুক পেজে প্রমোশন।',
    },
  ],
  job_listing: [
    {
      id: 'p_job_15',
      title: '১৫ দিন জব লিস্টিং',
      days: 15,
      price: 200,
      desc: 'চাকরির বিজ্ঞপ্তি তালিকার শীর্ষে এবং সোশ্যাল গ্রুপে প্রচার।',
    },
    {
      id: 'p_job_30',
      title: '৩০ দিন প্রিমিয়াম নিয়োগ পোস্ট',
      days: 30,
      price: 350,
      badge: 'দ্রুত কর্মী নিয়োগ',
      desc: '১ মাস ব্যাপী ফিচার্ড চাকরি হিসেবে হাইলাইট ও নোটিশে প্রকাশ।',
    },
  ],
  featured_business: [
    {
      id: 'p_biz_30',
      title: '১ মাস ভেরিফাইড শপ ব্যাজ',
      days: 30,
      price: 300,
      desc: 'ব্যবসা ডিরেক্টরিতে ভেরিফাইড ব্লু-টিক এবং কল বাটন হাইলাইট।',
    },
    {
      id: 'p_biz_90',
      title: '৩ মাস বিজনেস পার্টনারশিপ',
      days: 90,
      price: 750,
      badge: 'সাশ্রয়ী',
      desc: '৩ মাস স্থায়ী শীর্ষ অবস্থান এবং গ্রাহকদের কাছে সরাসরি রিকমেন্ডেশন।',
    },
  ],
  doctor_listing: [
    {
      id: 'p_doc_30',
      title: '১ মাস প্রিমিয়াম চেম্বার লিস্টিং',
      days: 30,
      price: 300,
      desc: 'ডাক্তার তালিকায় সবার উপরে সরাসরি সিরিয়াল ডায়াল অপশন সহ।',
    },
  ],
  sponsor_partner: [
    {
      id: 'p_sp_month',
      title: 'মাসিক গোল্ড পার্টনারশিপ',
      days: 30,
      price: 1500,
      badge: 'স্পন্সরশিপ',
      desc: 'অ্যাপের সকল মডিউলে লোগো ব্র্যান্ডিং + স্পেশাল প্রেস রিলিজ।',
    },
  ],
};

export const MonetizationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultService = 'boost_product',
  targetId,
  targetTitle,
  onSuccess,
}) => {
  const [serviceType, setServiceType] = useState<MonetizationServiceType>(defaultService);
  const [selectedPkgIndex, setSelectedPkgIndex] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [copied, setCopied] = useState<string | null>(null);

  // Form State
  const [advertiserName, setAdvertiserName] = useState('');
  const [advertiserPhone, setAdvertiserPhone] = useState('');
  const [businessOrTitle, setBusinessOrTitle] = useState(targetTitle || '');
  const [selectedFormat, setSelectedFormat] = useState('হোম পেজ হেডার ব্যানার (728 × 180 px)');
  const [details, setDetails] = useState('');
  const [linkOrSocial, setLinkOrSocial] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isOpen) return null;

  const currentPackages = PACKAGES[serviceType] || PACKAGES.boost_product;
  const currentPkg = currentPackages[selectedPkgIndex] || currentPackages[0];

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advertiserName.trim() || !advertiserPhone.trim() || !senderNumber.trim() || !trxId.trim()) {
      alert('অনুগ্রহ করে নাম, মোবাইল নম্বর, প্রেরকের নম্বর এবং TrxID পূরণ করুন।');
      return;
    }

    setIsSubmitting(true);

    try {
      storageService.addMonetizationRequest({
        serviceType,
        packageTitle: `${currentPkg.title} (৳ ${currentPkg.price})`,
        amount: currentPkg.price,
        durationDays: currentPkg.days,
        advertiserName: advertiserName.trim(),
        advertiserPhone: advertiserPhone.trim(),
        businessOrTitle: businessOrTitle.trim() || targetTitle || 'বিজ্ঞাপন আবেদন',
        details: serviceType === 'banner_ad'
          ? `[নির্বাচিত ফরম্যাট: ${selectedFormat}] ${details.trim()}`
          : details.trim(),
        linkOrSocial: linkOrSocial.trim(),
        targetId: targetId,
        paymentMethod,
        senderNumber: senderNumber.trim(),
        trxId: trxId.trim().toUpperCase(),
      });

      setIsSubmitting(false);
      setSuccessMessage(true);
      if (onSuccess) onSuccess();
    } catch {
      setIsSubmitting(false);
      alert('আবেদন জমা দিতে সমস্যা হয়েছে, আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-5 flex items-center justify-between relative overflow-hidden shrink-0">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>লোকাল বিজ্ঞাপন ও প্রমোশন হাব</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">Our Jamalpur স্পনসর ও বুস্টিং</h2>
            <p className="text-xs text-emerald-200/90 mt-0.5">
              জামালপুর জেলার হাজার হাজার সক্রিয় ব্যবহারকারীর কাছে আপনার সেবা পৌঁছে দিন
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer relative z-10 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {successMessage ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-800">আপনার আবেদনটি সফলভাবে জমা হয়েছে!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                ধন্যবাদ! পরিচালক <strong className="text-slate-900">মাসুদ রানা</strong> আপনার পেমেন্ট ট্রানজেকশন যাচাই করে কিছুক্ষণের মধ্যে বিজ্ঞাপন/বুস্ট সক্রিয় করে দেবেন।
              </p>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 max-w-md mx-auto text-left text-xs text-emerald-900 space-y-1.5">
                <p><strong>সার্ভিস:</strong> {currentPkg.title}</p>
                <p><strong>পরিশোধিত অর্থ:</strong> ৳ {currentPkg.price} ({paymentMethod.toUpperCase()})</p>
                <p><strong>TrxID:</strong> <code className="bg-white px-2 py-0.5 rounded border border-emerald-300 font-mono font-bold">{trxId}</code></p>
                <p><strong>জরুরি যোগাযোগ:</strong> 01315481879 (মাসুদ রানা)</p>
              </div>
              <button
                onClick={onClose}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl transition cursor-pointer shadow-md"
              >
                ঠিক আছে, ধন্যবাদ
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Selection Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  ১. সার্ভিসের ধরন নির্বাচন করুন
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'boost_product', label: 'পণ্য বুস্ট', icon: TrendingUp },
                    { id: 'banner_ad', label: 'ব্যানার বিজ্ঞাপন', icon: Zap },
                    { id: 'job_listing', label: 'চাকরি লিস্টিং', icon: Briefcase },
                    { id: 'featured_business', label: 'দোকান/ব্যবসা', icon: Store },
                  ].map((s) => {
                    const Icon = s.icon;
                    const isSelected = serviceType === s.id;
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => {
                          setServiceType(s.id as MonetizationServiceType);
                          setSelectedPkgIndex(0);
                        }}
                        className={`p-2.5 sm:p-3 rounded-2xl border text-left transition flex flex-col items-center sm:items-start gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span className="text-xs">{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Package Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  ২. প্যাকেজ নির্বাচন করুন
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentPackages.map((pkg, idx) => {
                    const isSelected = selectedPkgIndex === idx;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPkgIndex(idx)}
                        className={`p-3.5 rounded-2xl border-2 transition cursor-pointer relative flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-50/70 border-emerald-600 text-emerald-950 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {pkg.badge && (
                          <span className="absolute -top-2.5 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                            {pkg.badge}
                          </span>
                        )}
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{pkg.title}</h4>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{pkg.desc}</p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-baseline justify-between">
                          <span className="text-xs text-slate-500">{pkg.days} দিন</span>
                          <span className="text-lg font-black text-emerald-700">৳ {pkg.price}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Advertiser & Info */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  ৩. আপনার ও বিজ্ঞাপনের তথ্য
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      আপনার নাম / প্রতিষ্ঠানের নাম <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={advertiserName}
                      onChange={(e) => setAdvertiserName(e.target.value)}
                      placeholder="উদাঃ মোঃ রফিকুল ইসলাম / রফিক ক্লথ স্টোর"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      মোবাইল নম্বর <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={advertiserPhone}
                      onChange={(e) => setAdvertiserPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    বিজ্ঞাপন / পণ্যের শিরোনাম <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={businessOrTitle}
                    onChange={(e) => setBusinessOrTitle(e.target.value)}
                    placeholder="উদাঃ খাঁটি সরিষার তেল ও নকশী কাঁথা বিক্রয়"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                {serviceType === 'banner_ad' && (
                  <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-extrabold text-emerald-950">
                        📐 বিজ্ঞাপনের নির্দিষ্ট ব্যানার ফরম্যাট ও মাপ
                      </label>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                        পছন্দ অনুযায়ী
                      </span>
                    </div>
                    <select
                      value={selectedFormat}
                      onChange={(e) => setSelectedFormat(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white font-medium text-slate-800"
                    >
                      <option value="হোম পেজ হেডার ব্যানার (728 × 180 px)">
                        হোম পেজ হেডার ব্যানার (728 × 180 px / মোবাইল 360 × 120 px)
                      </option>
                      <option value="ইন-ফিড / কন্টেন্ট ব্যানার (300 × 250 px)">
                        ইন-ফিড / কন্টেন্ট ব্যানার (300 × 250 px - খবরের মাঝে)
                      </option>
                      <option value="মার্কেটপ্লেস স্পন্সরড কার্ড (600 × 600 px)">
                        মার্কেটপ্লেস স্পন্সরড কার্ড (600 × 600 px স্কয়ার)
                      </option>
                      <option value="ফুল-উইডথ প্রমো নোটিশ স্ট্রিপ (1200 × 160 px)">
                        ফুল-উইডথ প্রমো নোটিশ স্ট্রিপ (1200 × 160 px)
                      </option>
                      <option value="অ্যাপ ওপেন স্প্ল্যাশ / পপ-আপ ব্যানার (600 × 600 px)">
                        অ্যাপ ওপেন স্প্ল্যাশ / পপ-আপ ব্যানার (600 × 600 px)
                      </option>
                      <option value="নিয়োগ বিজ্ঞপ্তি ও বিজনেস ফ্লায়ার (800 × 1200 px)">
                        নিয়োগ বিজ্ঞপ্তি ও বিজনেস ফ্লায়ার (800 × 1200 px পোস্টার)
                      </option>
                    </select>
                    <p className="text-[10px] text-emerald-800 leading-tight">
                      💡 রেডি ব্যানার নেই? কোনো সমস্যা নেই! বুকিংয়ের পর আমাদের ডিজাইনার টিম বিনামূল্যে আপনার জন্য ব্যানার তৈরি করে দেবে।
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      বিস্তারিত বিবরণ (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="বিজ্ঞাপনের সংক্ষিপ্ত বিবরণ"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      ফেসবুক পেজ বা ওয়েবসাইট লিংক (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      value={linkOrSocial}
                      onChange={(e) => setLinkOrSocial(e.target.value)}
                      placeholder="https://facebook.com/..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-purple-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-purple-700" />
                    <h4 className="text-sm font-black text-slate-900">
                      ৪. পেমেন্ট করুন: <span className="text-purple-700">৳ {currentPkg.price}</span>
                    </h4>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full border border-purple-300">
                    Send Money
                  </span>
                </div>

                {/* Payment Gateway Options */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'bkash', name: 'bKash (বিকাশ)', color: 'bg-pink-600 text-white', border: 'border-pink-500' },
                    { id: 'nagad', name: 'Nagad (নগদ)', color: 'bg-orange-600 text-white', border: 'border-orange-500' },
                    { id: 'rocket', name: 'Rocket (রকেট)', color: 'bg-purple-600 text-white', border: 'border-purple-500' },
                  ].map((m) => {
                    const isSelected = paymentMethod === m.id;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                        className={`py-2 px-2 text-xs rounded-xl font-bold transition flex items-center justify-center gap-1 cursor-pointer border ${
                          isSelected ? `${m.color} ${m.border} shadow-sm` : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        <span>{m.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Account Details Box */}
                <div className="bg-white p-3.5 rounded-xl border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">
                        {paymentMethod.toUpperCase()} পার্সোনাল নম্বর:
                      </span>
                      <span className="text-xs font-bold text-emerald-700">
                        পরিচালক: {OWNER_PAYMENT_INFO.ownerName}
                      </span>
                    </div>
                    <div className="text-lg sm:text-xl font-black text-slate-900 tracking-wider mt-0.5">
                      {OWNER_PAYMENT_INFO.phone}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(OWNER_PAYMENT_INFO.phone, 'phone')}
                    className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
                  >
                    {copied === 'phone' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        <span>কপি হয়েছে!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>নম্বর কপি করুন</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Transaction Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      যে নম্বর থেকে টাকা পাঠিয়েছেন <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="আপনার বিকাশ/নগদ নম্বর"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-purple-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      ট্রানজেকশন আইডি (TrxID) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="উদাঃ 9K8J7H6G5F"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-purple-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-white font-mono font-bold uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black text-sm rounded-2xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>বিজ্ঞাপন ও বুস্টিং আবেদন সাবমিট করুন (৳ {currentPkg.price})</span>
                </button>
                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 mt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>যেকোনো প্রয়োজনে সরাসরি কল করুন: <strong className="text-slate-800">01315481879 (মাসুদ রানা)</strong></span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
