import React, { useState, useEffect } from 'react';
import { Clock, Calendar, MapPin, Sun, Moon, CloudSun, Download, Smartphone, HardDrive, Wifi, WifiOff, Share2, RefreshCw } from 'lucide-react';
import { Upazila } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface Props {
  selectedUpazila: Upazila;
  onSelectUpazila: (u: Upazila) => void;
  onOpenUpazilaModal?: () => void;
  onOpenExportZip?: () => void;
  onOpenInstallApp?: () => void;
  onOpenStorageCache?: () => void;
  onOpenAppUpdate?: () => void;
}

export const LiveClockHeader: React.FC<Props> = ({
  selectedUpazila,
  onSelectUpazila,
  onOpenUpazilaModal,
  onOpenExportZip,
  onOpenInstallApp,
  onOpenStorageCache,
  onOpenAppUpdate,
}) => {
  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [banglaDate, setBanglaDate] = useState<string>('১৪ ভাদ্র ১৪৩৩ বঙ্গাব্দ');
  const [hijriDate, setHijriDate] = useState<string>('১৫ সফর ১৪৪৮ হিজরি');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const bnTime = now.toLocaleTimeString('bn-BD', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      const bnDate = now.toLocaleDateString('bn-BD', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      setTime(bnTime);
      setDateStr(bnDate);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const upazilas: Upazila[] = [
    'সকল উপজেলা',
    'জামালপুর সদর',
    'ইসলামপুর',
    'দেওয়ানগঞ্জ',
    'মেলান্দহ',
    'মাদারগঞ্জ',
    'সরিষাবাড়ী',
    'বকশীগঞ্জ',
  ];

  return (
    <div id="live-clock-topbar" className="bg-emerald-900 text-emerald-100 text-xs sm:text-sm py-2 px-3 sm:px-6 border-b border-emerald-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Clock & Dates */}
        <div className="flex items-center flex-wrap justify-center sm:justify-start gap-2.5 sm:gap-4">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-700/50 shadow-inner">
            <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="tracking-wide">{time || 'সময় লোড হচ্ছে...'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-200">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>{dateStr}</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-emerald-300/90 text-xs">
            <span>• {banglaDate}</span>
            <span>• {hijriDate}</span>
          </div>
        </div>

        {/* Right: Jamalpur weather, Upazila Selector, App Install & Quick ZIP Download */}
        <div className="flex items-center flex-wrap justify-center sm:justify-end gap-2">
          {/* Storage & Offline Cache Manager Trigger */}
          {onOpenStorageCache && (
            <button
              id="topbar-storage-cache-btn"
              onClick={onOpenStorageCache}
              className={`flex items-center gap-1 px-2.5 py-1 rounded shadow-xs text-[11px] font-bold cursor-pointer transition ${
                isOnline
                  ? 'bg-emerald-800 hover:bg-emerald-700 text-emerald-100 border border-emerald-600/70'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 border border-amber-300 font-extrabold animate-pulse'
              }`}
              title="লোকাল স্টোরেজ ও অফলাইন ক্যাশ ম্যানেজার"
            >
              <HardDrive className="w-3 h-3 shrink-0" />
              <span>{isOnline ? 'ক্যাশ সিঙ্ক' : 'অফলাইন মোড'}</span>
            </button>
          )}

          {onOpenAppUpdate && (
            <button
              id="topbar-update-app-btn"
              onClick={onOpenAppUpdate}
              className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black px-2.5 py-1 rounded shadow-xs text-[11px] cursor-pointer transition active:scale-95"
              title="নতুন ফিচার যোগ করা হলে এখানে ক্লিক করে তাৎক্ষণিক আপডেট আনুন"
            >
              <RefreshCw className="w-3 h-3 text-slate-950 stroke-[2.5]" />
              <span>নতুন ফিচার আনুন</span>
            </button>
          )}

          {onOpenInstallApp && (
            <button
              id="topbar-install-app-btn"
              onClick={onOpenInstallApp}
              className="flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-2.5 py-1 rounded shadow-xs text-[11px] cursor-pointer transition"
              title="Our Jamalpur মোবাইল অ্যাপ ইনস্টল করুন"
            >
              <Smartphone className="w-3 h-3 text-slate-950 stroke-[2.5]" />
              <span>অ্যাপ ইনস্টল</span>
            </button>
          )}

          {onOpenExportZip && (
            <button
              id="topbar-zip-btn"
              onClick={onOpenExportZip}
              className="flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-2.5 py-1 rounded shadow-xs text-[11px] cursor-pointer transition"
              title="সম্পূর্ণ প্রজেক্টের ZIP ডাউনলোড করুন"
            >
              <Download className="w-3 h-3 text-slate-900" />
              <span>ZIP</span>
            </button>
          )}

          {/* Jamalpur Weather */}
          <div className="hidden md:flex items-center gap-1 text-[11px] text-amber-300 bg-emerald-950/50 px-2 py-1 rounded border border-emerald-800">
            <CloudSun className="w-3.5 h-3.5" />
            <span>২৯°C (আংশিক মেঘলা)</span>
          </div>

          {/* Global Theme Switcher */}
          <ThemeToggle variant="compact" />

          {/* Upazila Selector */}
          <div className="flex items-center gap-1 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">
            {onOpenUpazilaModal ? (
              <button
                type="button"
                onClick={onOpenUpazilaModal}
                title="৭টি উপজেলার বিস্তারিত ডিরেক্টরি খুলুন"
                className="cursor-pointer hover:text-amber-300 transition"
              >
                <MapPin className="w-3 h-3 text-emerald-400" />
              </button>
            ) : (
              <MapPin className="w-3 h-3 text-emerald-400" />
            )}
            <select
              id="upazila-header-selector"
              value={selectedUpazila}
              onChange={(e) => onSelectUpazila(e.target.value as Upazila)}
              className="bg-transparent text-emerald-100 text-xs focus:outline-none cursor-pointer pr-1"
            >
              {upazilas.map((up) => (
                <option key={up} value={up} className="bg-slate-900 text-white">
                  {up}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
