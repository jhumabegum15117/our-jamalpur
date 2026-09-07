import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  Smartphone,
  HardDrive,
  Cloud,
  ShieldCheck,
  Zap,
  Share2,
  Calendar,
  Layers,
  ArrowRight,
  Wifi,
  Globe,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { storageService } from '../services/storageService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenShareApp?: () => void;
}

export const AppUpdateModal: React.FC<Props> = ({ isOpen, onClose, onOpenShareApp }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStep, setUpdateStep] = useState<string>('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [versionInfo, setVersionInfo] = useState<any>(null);
  const [copiedOfficialUrl, setCopiedOfficialUrl] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStats(storageService.getStorageStats());
      setVersionInfo(storageService.getAppVersionInfo());
      setUpdateSuccess(false);
      setIsUpdating(false);
      setUpdateStep('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleForceUpdate = async () => {
    setIsUpdating(true);
    setUpdateSuccess(false);

    try {
      setUpdateStep('১/৪: পুরনো ব্রাউজার ক্যাশ ক্লিয়ার করা হচ্ছে...');
      await new Promise((r) => setTimeout(r, 600));

      setUpdateStep('২/৪: নতুন ফিচার ও সর্বশেষ ডাটা সিঙ্ক হচ্ছে...');
      storageService.updateAndSyncOfflineCache();
      await new Promise((r) => setTimeout(r, 600));

      setUpdateStep('৩/৪: সার্ভিস ওয়ার্কার লাইভ কোড আপডেট করা হচ্ছে...');
      await storageService.forceFullAppUpdate();
      await new Promise((r) => setTimeout(r, 700));

      setUpdateStep('৪/৪: আপডেট সফল! সর্বশেষ ভার্সন লোড হচ্ছে...');
      setUpdateSuccess(true);

      await new Promise((r) => setTimeout(r, 800));

      // Reload window with fresh cache-busting timestamp
      const freshUrl = storageService.generateShareableLatestUrl('self-update');
      window.location.href = freshUrl;
    } catch (e) {
      console.error(e);
      setIsUpdating(false);
      setUpdateStep('আপডেট প্রক্রিয়ায় সমস্যা হয়েছে। পৃষ্ঠা রিলোড করুন।');
    }
  };

  const changelog = [
    {
      icon: Zap,
      title: 'তাৎক্ষণিক লাইভ আপডেট ও অটো সিঙ্ক ব্যবস্থা',
      desc: 'নতুন ফিচার, খবর বা তথ্য যুক্ত হওয়ার সাথে সাথে ব্রাউজারে স্বয়ংক্রিয়ভাবে সর্বশেষ তথ্য আসবে।',
    },
    {
      icon: Share2,
      title: 'স্মার্ট ক্যাশ-বাইপাস শেয়ার ও কপি লিংক',
      desc: 'অ্যাপের লিংক শেয়ার করলে বা কপি করে পাঠালে যেকোনো ফোন বা পিসিতে সরাসরি সর্বশেষ আপডেট ভার্সন খুলবে।',
    },
    {
      icon: Cloud,
      title: 'জামালপুর ৭ উপজেলার লাইভ আবহাওয়া ও কৃষি বুলেটিন',
      desc: 'যমুনা-ব্রহ্মপুত্র নদীর লাইভ পানিস্তর, ৭ উপজেলার তাপমাত্রা ও কৃষকদের বিশেষ পরামর্শ।',
    },
    {
      icon: ShieldCheck,
      title: 'জরুরি হেল্পলাইন ও জেলা কন্ট্রোল রুম হাব',
      desc: 'জেলা প্রশাসক, পুলিশ সুপার, ফায়ার সার্ভিস, অ্যাম্বুলেন্স ও সকল উপজেলার ওয়ান-ট্যাপ কল সেবা।',
    },
    {
      icon: Layers,
      title: 'MFS ফ্রি আন্তঃলেনদেন ও মানি ট্রান্সফার পোর্টাল',
      desc: 'বিকাশ, নগদ ও রকেটের মধ্যে সহজ আন্তঃলেনদেন ও হিসাব সমাধান।',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        id="app-update-modal"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col transition-colors"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-inner">
              <RefreshCw className={`w-6 h-6 ${isUpdating ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white">অ্যাপ আপডেট ও লাইভ সিঙ্ক</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                  v4.2 Live
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                সর্বশেষ ফিচার, তথ্য ও অফলাইন ক্যাশ মেমোরি আপডেট পোর্টাল
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Status & Version Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 rounded-2xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3 mb-3">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400">বর্তমান সংস্করণ:</span>
                <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>{versionInfo?.versionName || 'Our Jamalpur v4.2'}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 dark:text-slate-400">সর্বশেষ ডাটা সিঙ্ক:</span>
                <div className="font-bold text-xs text-emerald-700 dark:text-emerald-400">
                  {stats?.lastSync || 'এইমাত্র সিঙ্ক হয়েছে'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">মোট রেকর্ড</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                  {stats?.totalRecords || '১২০+'} টি
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">স্টোরেজ মেমোরি</span>
                <span className="font-black text-blue-600 dark:text-blue-400 text-sm">
                  {stats?.totalKilobytes || '৩৫'} KB
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">নেটওয়ার্ক স্ট্যাটাস</span>
                <span className="font-black text-amber-600 dark:text-amber-400 text-sm flex items-center justify-center gap-1">
                  <Wifi className="w-3 h-3" />
                  <span>লাইভ ক্লাউড</span>
                </span>
              </div>
            </div>
          </div>

          {/* Official Live Web URL Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-emerald-200 dark:border-emerald-800/70 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                  সর্বশেষ অফিসিয়াল লাইভ ওয়েবসাইট লিংক:
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                  {versionInfo?.officialUrl || 'https://ourjamalpur15117.web.app'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => {
                  const targetUrl = versionInfo?.officialUrl || 'https://ourjamalpur15117.web.app';
                  navigator.clipboard.writeText(targetUrl);
                  setCopiedOfficialUrl(true);
                  setTimeout(() => setCopiedOfficialUrl(false), 2500);
                }}
                className={`px-2.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition ${
                  copiedOfficialUrl
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300'
                }`}
              >
                {copiedOfficialUrl ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>কপি লিংক</span>
                  </>
                )}
              </button>
              <a
                href={versionInfo?.officialUrl || 'https://ourjamalpur15117.web.app'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1 transition"
              >
                <ExternalLink className="w-3 h-3" />
                <span>ভিজিট</span>
              </a>
            </div>
          </div>

          {/* Update Action Button & Progress */}
          <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-4 text-center">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm mb-1">
              🚀 নতুন ফিচার পেয়েছন কি?
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 mb-3.5">
              নিচের বাটনে চাপ দিলে ব্রাউজারের পুরনো ক্যাশ মুছে সাথে সাথে নতুনতম কোড ও ডাটা ইনস্ট্যান্ট লোড হবে।
            </p>

            {isUpdating ? (
              <div className="space-y-2 py-2">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>{updateStep}</span>
                </div>
                <div className="w-full bg-emerald-200 dark:bg-emerald-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full w-full animate-progress" />
                </div>
              </div>
            ) : updateSuccess ? (
              <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>আপডেট সম্পন্ন হয়েছে! নতুন ভার্সন লোড হচ্ছে...</span>
              </div>
            ) : (
              <button
                id="btn-force-update-action"
                onClick={handleForceUpdate}
                disabled={isUpdating}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <RefreshCw className="w-4 h-4" />
                <span>তাৎক্ষণিক অ্যাপ আপডেট ও ডাটা সিঙ্ক করুন</span>
              </button>
            )}
          </div>

          {/* What's New Changelog */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>এই সংস্করণে নতুন যা যুক্ত হয়েছে:</span>
              </h4>
            </div>

            <div className="space-y-2.5">
              {changelog.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">{item.title}</h5>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 rounded-b-3xl">
          {onOpenShareApp && (
            <button
              onClick={() => {
                onClose();
                onOpenShareApp();
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>আপডেট লিংক শেয়ার করুন</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="ml-auto px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
