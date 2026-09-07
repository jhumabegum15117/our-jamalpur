import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, Heart, Sparkles, Globe } from 'lucide-react';
import { storageService } from '../services/storageService';
import masudRanaPhoto from '../assets/images/masud_rana_profile_1788024419763.jpg';

export const AboutOwnerView: React.FC = () => {
  const settings = storageService.getSettings();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      alert('দয়া করে প্রয়োজনীয় সকল তথ্য পূরণ করুন');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setPhone('');
      setSubject('');
      setMessage('');
      alert('আপনার মূল্যবান বার্তাটি সফলভাবে পাঠানো হয়েছে। ধন্যবাদ!');
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-bold mb-3 border border-emerald-500/40">
            <Globe className="w-3.5 h-3.5" />
            <span>আমাদের পরিচিতি ও লক্ষ্য</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold leading-snug">
            Our Jamalpur (আমাদের জামালপুর)
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 mt-2 font-light leading-relaxed">
            জামালপুর জেলার ৭টি উপজেলার প্রতিটি নাগরিককে এক ডিজিটাল ছাতার নিচে এনে স্থানীয় তথ্য, সেবা ও ব্যবসা প্রসারের এক অনন্য উদ্যোগ।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Founder & Mission Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Founder Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative shrink-0 group">
                <img
                  id="owner-profile-photo"
                  src={settings.ownerPhotoUrl || masudRanaPhoto}
                  alt={`${settings.ownerName} - উদ্যোক্তা ও প্রতিষ্ঠাতা`}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover shadow-xl ring-4 ring-emerald-100 border-2 border-emerald-500/80"
                  onError={(e) => {
                    // Fallback to default asset if custom URL fails
                    (e.currentTarget as HTMLImageElement).src = masudRanaPhoto;
                  }}
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow border-2 border-white flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              </div>

              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                    উদ্যোক্তা ও প্রতিষ্ঠাতা
                  </span>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                    জামালপুর জেলা
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {settings.ownerName || 'মাসুদ রানা'}
                  </h3>
                  <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ভেরিফাইড পরিচালক</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  প্রতিষ্ঠাতা ও প্রধান পরিচালক — Our Jamalpur ডিজিটাল নেটওয়ার্ক
                </p>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-4">
                  “জামালপুর জেলার প্রতিটি নাগরিকের জীবনকে সহজ, নিরাপদ ও তথ্যনির্ভর করে তোলাই আমাদের মূল লক্ষ্য। লোকাল কেনাবেচা থেকে শুরু করে জরুরি রক্তদাতা, ডাক্তার, পরিবহন শিডিউল ও স্থানীয় সংবাদ—সবকিছুই জেলাবাসীর জন্য সম্পূর্ণ বিনামূল্যে উন্মুক্ত।”
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
                  <a
                    href="tel:01315481879"
                    className="flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80 transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>০১৩১৫৪৮১৮৭৯ (01315481879)</span>
                  </a>

                  <a
                    href="mailto:masudrana15117@gmail.com"
                    className="flex items-center gap-1.5 font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 transition"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>masudrana15117@gmail.com</span>
                  </a>

                  <a
                    href={storageService.getOfficialLiveUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 transition"
                  >
                    <Globe className="w-3.5 h-3.5 text-teal-600" />
                    <span>ourjamalpur15117.web.app</span>
                  </a>
                </div>

                {/* Social Channels (Facebook Profile & Page) */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-3 pt-3 border-t border-slate-100">
                  <a
                    href="https://www.facebook.com/masudrana15117"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition transform active:scale-95"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>ফেসবুক প্রোফাইল</span>
                  </a>

                  <a
                    href="https://www.facebook.com/profile.php?id=61583998314277"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition transform active:scale-95"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>অফিশিয়াল ফেসবুক পেজ</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Key Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900">বিশ্বস্ত স্থানীয় তথ্য</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                জামালপুর জেলা শহরের বাইরে প্রতিটি গ্রাম ও ইউনিয়নের খবর এবং সেবা যাচাই-বাছাই করে পরিবেশন করা হয়।
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold mb-3">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900">মানবিক ও সামাজিক সেবা</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                জরুরি রক্তের সন্ধান, অ্যাম্বুলেন্স সাপোর্ট ও হাসপাতালে তাৎক্ষণিক যোগাযোগের জন্য ২৪ ঘণ্টা ফ্রি সহায়তা।
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-slate-900">যোগাযোগ ও মতামত</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              কোনো তথ্য সংযোজন, বিজ্ঞাপন বা পরামর্শের জন্য লিখুন
            </p>

            <form onSubmit={handleSubmit} className="space-y-3 mt-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">আপনার নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="নাম"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                <input
                  type="tel"
                  required
                  placeholder="017xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">বিষয়</label>
                <input
                  type="text"
                  placeholder="যেমন: বিজ্ঞাপন বা সংশোধনী"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">বার্তা বা মন্তব্য *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="আপনার বার্তা বিস্তারিত লিখুন..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitted}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>পাঠানো হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>বার্তা পাঠান</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
            কার্যালয়: স্টেশন রোড, জামালপুর সদর, জামালপুর।
          </div>
        </div>
      </div>
    </div>
  );
};
