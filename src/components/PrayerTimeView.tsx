import React, { useState, useEffect } from 'react';
import { Clock, Sun, Moon, Sunrise, Sunset, MapPin, Compass, Sparkles } from 'lucide-react';
import { storageService } from '../services/storageService';
import { PrayerTime } from '../types';

export const PrayerTimeView: React.FC = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime>(storageService.getPrayerTimes());
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const prayers = [
    { name: 'ফজর (Fajr)', time: prayerTimes.fajr, icon: Sunrise, desc: 'সূর্যোদয়ের পূর্ব পর্যন্ত' },
    { name: 'সূর্যোদয় (Sunrise)', time: prayerTimes.sunrise, icon: Sun, desc: 'নিষিদ্ধ নামাজের সময়' },
    { name: 'যোহর (Dhuhr)', time: prayerTimes.dhuhr, icon: Sun, desc: 'দ্বিপ্রহরের পর' },
    { name: 'আসর (Asr)', time: prayerTimes.asr, icon: Sun, desc: 'সূর্যাস্তের পূর্ব পর্যন্ত' },
    { name: 'মাগরিব (Maghrib)', time: prayerTimes.maghrib, icon: Sunset, desc: 'সূর্যাস্তের ঠিক পর' },
    { name: 'এশা (Isha)', time: prayerTimes.isha, icon: Moon, desc: 'রাতের এক-তৃতীয়াংশ পর্যন্ত উত্তম' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/80 text-emerald-200 text-xs font-bold mb-3 border border-emerald-500/40">
            <Clock className="w-3.5 h-3.5" />
            <span>জামালপুর জেলা ইসলামিক সময়সূচী</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            আজকের নামাজের সঠিক সময়সূচী
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 max-w-xl">
            ইসলামিক ফাউন্ডেশন বাংলাদেশ কর্তৃক নির্ধারিত জামালপুর জেলার ৫ ওয়াক্ত নামাজ, সেহরি ও ইফতারের সময়সূচী।
          </p>
        </div>

        <div className="bg-emerald-950/80 border border-emerald-700/60 p-4 rounded-2xl text-center shrink-0">
          <span className="text-[11px] text-emerald-300 block">বর্তমান লাইভ সময়</span>
          <span className="text-xl sm:text-2xl font-mono font-black text-emerald-100">{currentTime}</span>
        </div>
      </div>

      {/* Sehri & Iftar Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">আজকের সেহরি শেষ</span>
            <div className="text-2xl font-black text-emerald-950 mt-1">{prayerTimes.sehriEnds}</div>
          </div>
          <Moon className="w-8 h-8 text-emerald-600" />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">আজকের ইফতারের সময়</span>
            <div className="text-2xl font-black text-amber-950 mt-1">{prayerTimes.iftar}</div>
          </div>
          <Sun className="w-8 h-8 text-amber-600" />
        </div>
      </div>

      {/* 5 Waqt Prayers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {prayers.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">{p.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{p.desc}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base sm:text-lg font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200/60">
                  {p.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Islamic Hadith Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>রাসূলুল্লাহ (সা.) এর হাদিস:</span>
        </h4>
        <p className="italic text-slate-600">
          “যে ব্যক্তি জামাআতের সাথে এশার নামাজ আদায় করল, সে যেন অর্ধরাত পর্যন্ত নামাজ পড়ল। আর যে ফজরের নামাজও জামাআতে পড়ল, সে যেন সারারাত নামাজ পড়ল।” — (সহীহ মুসলিম: ৬৫৬)
        </p>
      </div>
    </div>
  );
};
