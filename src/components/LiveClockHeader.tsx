import React, { useState, useEffect, useRef } from 'react';
import { Clock, Calendar, MapPin, Sun, Moon, CloudSun, Download, Smartphone, HardDrive, Wifi, WifiOff, Share2, RefreshCw, MoreHorizontal, ChevronDown, Check } from 'lucide-react';
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
  isAdmin?: boolean;
}

export const LiveClockHeader: React.FC<Props> = ({
  selectedUpazila,
  onSelectUpazila,
  onOpenUpazilaModal,
  onOpenExportZip,
  onOpenInstallApp,
  onOpenStorageCache,
  onOpenAppUpdate,
  isAdmin = false,
}) => {
  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [banglaDate, setBanglaDate] = useState<string>('১৪ ভাদ্র ১৪৩৩ বঙ্গাব্দ');
  const [hijriDate, setHijriDate] = useState<string>('১৫ সফর ১৪৪৮ হিজরি');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isMoreToolsOpen, setIsMoreToolsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMoreToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

        {/* Right: Jamalpur weather, Upazila Selector, Clean Tools Dropdown */}
        <div className="flex items-center flex-wrap justify-center sm:justify-end gap-1.5 sm:gap-2">
          {/* Quick Install Button (High value for PWA) */}
          {onOpenInstallApp && (
            <button
              id="topbar-install-app-btn"
              onClick={onOpenInstallApp}
              className="hidden sm:flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-2.5 py-1 rounded-lg shadow-xs text-[11px] cursor-pointer transition"
              title="Our Jamalpur মোবাইল অ্যাপ ইনস্টল করুন"
            >
              <Smartphone className="w-3 h-3 text-slate-950 stroke-[2.5]" />
              <span>অ্যাপ ইনস্টল</span>
            </button>
          )}

          {/* Clean 'টুলস ও আপডেট' / 'More' Dropdown menu for secondary utilities */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="topbar-tools-dropdown-btn"
              onClick={() => setIsMoreToolsOpen(!isMoreToolsOpen)}
              className="flex items-center gap-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/80 px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition shadow-2xs"
              title="আরও অপশন ও সেটিংস"
            >
              <RefreshCw className="w-3 h-3 text-amber-300" />
              <span className="hidden xs:inline">টুলস ও সিঙ্ক</span>
              <ChevronDown className="w-3 h-3 text-emerald-400" />
            </button>

            {isMoreToolsOpen && (
              <div className="absolute right-0 mt-1.5 w-56 bg-slate-900 border border-emerald-700/80 rounded-xl shadow-2xl z-50 py-1.5 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  সিস্টেম টুলস
                </div>

                {onOpenAppUpdate && (
                  <button
                    onClick={() => {
                      onOpenAppUpdate();
                      setIsMoreToolsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-200 hover:bg-emerald-950/70 hover:text-emerald-300 flex items-center gap-2 transition cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    <div>
                      <div className="font-bold">নতুন ফিচার আনুন</div>
                      <div className="text-[10px] text-slate-400">লাইভ আপডেট সিঙ্ক করুন</div>
                    </div>
                  </button>
                )}

                {onOpenStorageCache && (
                  <button
                    onClick={() => {
                      onOpenStorageCache();
                      setIsMoreToolsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-200 hover:bg-emerald-950/70 hover:text-emerald-300 flex items-center gap-2 transition cursor-pointer"
                  >
                    <HardDrive className="w-3.5 h-3.5 text-teal-400" />
                    <div>
                      <div className="font-bold">{isOnline ? 'ক্যাশ ও অফলাইন ডাটা' : 'অফলাইন মেমোরি'}</div>
                      <div className="text-[10px] text-slate-400">লোকাল স্টোরেজ পরিচালনা</div>
                    </div>
                  </button>
                )}

                {onOpenInstallApp && (
                  <button
                    onClick={() => {
                      onOpenInstallApp();
                      setIsMoreToolsOpen(false);
                    }}
                    className="sm:hidden w-full text-left px-3 py-2 text-slate-200 hover:bg-emerald-950/70 hover:text-emerald-300 flex items-center gap-2 transition cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <div>
                      <div className="font-bold">মোবাইল অ্যাপ ইনস্টল</div>
                      <div className="text-[10px] text-slate-400">হোম স্ক্রিনে সেভ করুন</div>
                    </div>
                  </button>
                )}

                {/* ZIP Button: Restricted to Admin only */}
                {isAdmin && onOpenExportZip && (
                  <div className="border-t border-slate-800/80 mt-1 pt-1">
                    <button
                      onClick={() => {
                        onOpenExportZip();
                        setIsMoreToolsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-amber-300 hover:bg-amber-950/40 flex items-center gap-2 transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <div>
                        <div className="font-bold flex items-center gap-1">
                          <span>প্রজেক্ট ZIP ব্যাকআপ</span>
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded">অ্যাডমিন</span>
                        </div>
                        <div className="text-[10px] text-slate-400">Spck Editor সোর্স কোড</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Jamalpur Weather */}
          <div className="hidden md:flex items-center gap-1 text-[11px] text-amber-300 bg-emerald-950/50 px-2 py-1 rounded border border-emerald-800">
            <CloudSun className="w-3.5 h-3.5" />
            <span>২৯°C</span>
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
