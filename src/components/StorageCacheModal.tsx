import React, { useState, useEffect } from 'react';
import {
  Database,
  HardDrive,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Wifi,
  WifiOff,
  ShieldCheck,
  X,
  Layers,
  Sparkles,
  Zap,
  Check,
  FileJson,
  RotateCcw,
} from 'lucide-react';
import { storageService } from '../services/storageService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export const StorageCacheModal: React.FC<Props> = ({ isOpen, onClose, onRefresh }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [stats, setStats] = useState(storageService.getStorageStats());
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [swStatus, setSwStatus] = useState<'active' | 'installing' | 'unsupported'>('active');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (!('serviceWorker' in navigator)) {
      setSwStatus('unsupported');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setStats(storageService.getStorageStats());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSyncCache = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const updatedStats = storageService.updateAndSyncOfflineCache();
      setStats(updatedStats);
      setIsSyncing(false);
      showNotification('✅ লোকাল স্টোরেজ ও অফলাইন ক্যাশ সফলভাবে আপডেট ও সিঙ্ক হয়েছে!');
      onRefresh?.();
    }, 600);
  };

  const handleClearTempCache = () => {
    storageService.clearTemporaryCache();
    setStats(storageService.getStorageStats());
    showNotification('🧹 ক্যাশ মেমোরি অপ্টিমাইজ ও অপ্রয়োজনীয় টেম্প ফাইল ক্লিয়ার করা হয়েছে!');
    onRefresh?.();
  };

  const handleExportBackup = () => {
    storageService.exportAllDataAsJSON();
    showNotification('💾 সম্পূর্ণ ডাটাবেজ ব্যাকআপ JSON ফাইল ডাউনলোড সম্পন্ন হয়েছে!');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = storageService.importDataFromJSON(content);
      if (res.success) {
        setStats(storageService.getStorageStats());
        showNotification(res.message, 'success');
        onRefresh?.();
      } else {
        showNotification(res.message, 'error');
      }
    };
    reader.readAsText(file);
    // Reset input value so same file can be selected again
    e.target.value = '';
  };

  const handleFactoryReset = () => {
    if (confirm('সতর্কতা: এটি সাইটের সমস্ত লোকাল ডাটা প্রাথমিক অবস্থায় ফিরিয়ে দেবে। আপনি কি নিশ্চিত?')) {
      storageService.resetAllToDefault();
      setStats(storageService.getStorageStats());
      showNotification('🔄 ফ্যাক্টরি রিসেট সম্পন্ন হয়েছে। ডিফল্ট ডাটাবেজ লোড হয়েছে।');
      onRefresh?.();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold shadow-xs ring-1 ring-emerald-300/50">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <span>লোকাল স্টোরেজ ও অফলাইন ক্যাশ ম্যানেজার</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                PWA ক্যাশিং, অফলাইন মোড ও লোকাল ডেটাবেজ সিঙ্ক
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-6 flex-1 text-slate-900 dark:text-slate-100">
          {/* Toast Banner */}
          {toastMessage && (
            <div
              className={`p-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-fade-in shadow-md ${
                toastType === 'success'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-600 text-white'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Network & Service Worker Status Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Online/Offline Status */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    isOnline
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    নেটওয়ার্ক সংযোগ স্ট্যাটাস
                  </div>
                  <div className="font-extrabold text-sm flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                      }`}
                    />
                    <span>{isOnline ? '🟢 অনলাইন (ইন্টারনেট সক্রিয়)' : '🟠 অফলাইন মোড (ক্যাশ মেমোরি)'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Offline PWA Engine */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    সার্ভিস ওয়ার্কার ক্যাশ ইঞ্জিন
                  </div>
                  <div className="font-extrabold text-sm text-teal-700 dark:text-teal-300 mt-0.5">
                    সক্রিয় ও অফলাইনে প্রস্তুত
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Storage Overview Metric */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-50 dark:to-slate-800 border border-emerald-200/80 dark:border-emerald-800/60 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  <span>লোকাল স্টোরেজ মেমোরি ব্যবহার</span>
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {stats.totalKilobytes} KB{' '}
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                    ({stats.totalMegabytes} MB / মোট {stats.totalRecords} টি রেকর্ড)
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs text-slate-500 dark:text-slate-400">
                <div>সর্বশেষ সিঙ্ক ও আপডেট:</div>
                <div className="font-bold text-slate-700 dark:text-slate-200">{stats.lastSync}</div>
              </div>
            </div>

            {/* Storage Item Breakdown Chips */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">খবর ও নোটিশ:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats.counts.news} টি</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">মার্কেট পণ্য:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats.counts.products} টি</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">বাস ও ট্রেন:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats.counts.transport} টি</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">হাসপাতাল/ডাক্তার:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats.counts.health} টি</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">চাকরি ও শিক্ষা:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats.counts.jobs + stats.counts.education} টি</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">কুইজ প্রশ্নব্যাংক:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats.counts.quizzes} টি</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">রক্তদাতা তালিকা:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats.counts.bloodDonors} জন</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">রবিবার সনদ:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats.counts.certificates} টি</span>
              </div>
            </div>
          </div>

          {/* Primary Action: One Click Cache Update */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-600 dark:bg-emerald-700 text-white shadow-lg space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-black text-base sm:text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-300" />
                  <span>এক-ক্লিকে লোকাল স্টোরেজ ও অফলাইন ক্যাশ আপডেট</span>
                </h4>
                <p className="text-xs text-emerald-100 mt-1 max-w-md">
                  সর্বশেষ পরিবহন শিডিউল, ডাক্তার তালিকা, কুইজ প্রশ্নব্যাংক ও জামালপুর জেলা ডিরেক্টরি ক্যাশ মেমোরিতে সিঙ্ক করুন।
                </p>
              </div>

              <button
                id="sync-offline-cache-btn"
                onClick={handleSyncCache}
                disabled={isSyncing}
                className="w-full sm:w-auto px-5 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-75"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'সিঙ্ক হচ্ছে...' : 'এখনই ক্যাশ আপডেট করুন'}</span>
              </button>
            </div>
          </div>

          {/* Offline Readiness Checklist */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>ইন্টারনেট ছাড়া যেসকল সেবা অফলাইনে কাজ করবে:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>জামালপুর জেলার সকল বাস ও ট্রেন শিডিউল</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>হাসপাতাল, অ্যাম্বুলেন্স ও ডাক্তারদের ডিরেক্টরি</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>জরুরি রক্তদাতা ও হটলাইন যোগাযোগ নম্বর</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>অনলাইন কুইজ টেস্ট ও রবিবার ডিজিটাল সনদ</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>দৈনিক ৫ ওয়াক্ত নামাজের সময়সূচী</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>MFS লেনদেন রেকর্ড ও বাজারদর তালিকা</span>
              </div>
            </div>
          </div>

          {/* Backup & Data Management Tools */}
          <div className="space-y-3 pt-1">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>ডাটা ব্যাকআপ, রিস্টোর ও রক্ষণাবেক্ষণ</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Backup Download Button */}
              <button
                id="export-storage-json-btn"
                onClick={handleExportBackup}
                className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800/70 text-purple-900 dark:text-purple-300 text-left transition cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <Download className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition" />
                  <span className="text-[10px] font-bold bg-purple-200 dark:bg-purple-800 px-2 py-0.5 rounded-full">
                    JSON
                  </span>
                </div>
                <div className="font-bold text-xs sm:text-sm">ডাটা ব্যাকআপ সেভ</div>
                <div className="text-[11px] text-purple-700 dark:text-purple-400 mt-0.5">
                  সম্পূর্ণ ডাটাবেজ ডাউনলোড করুন
                </div>
              </button>

              {/* Backup Import Button */}
              <label className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/50 border border-teal-200 dark:border-teal-800/70 text-teal-900 dark:text-teal-300 text-left transition cursor-pointer group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Upload className="w-5 h-5 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition" />
                    <span className="text-[10px] font-bold bg-teal-200 dark:bg-teal-800 px-2 py-0.5 rounded-full">
                      Restore
                    </span>
                  </div>
                  <div className="font-bold text-xs sm:text-sm">ব্যাকআপ রিস্টোর</div>
                  <div className="text-[11px] text-teal-700 dark:text-teal-400 mt-0.5">
                    সংরক্ষিত JSON ফাইল আপলোড
                  </div>
                </div>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportBackup}
                />
              </label>

              {/* Clear Temp Cache */}
              <button
                onClick={handleClearTempCache}
                className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-left transition cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <Trash2 className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:scale-110 transition" />
                  <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                    Clean
                  </span>
                </div>
                <div className="font-bold text-xs sm:text-sm">ক্যাশ অপ্টিমাইজ</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  টেম্পোরারি ফাইল ক্লিয়ার
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <button
            onClick={handleFactoryReset}
            className="text-rose-600 hover:text-rose-700 dark:text-rose-400 font-bold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ফ্যাক্টরি রিসেট (ডিফল্ট ডাটা)</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold transition cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
