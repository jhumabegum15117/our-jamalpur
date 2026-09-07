import React, { useState } from 'react';
import { RefreshCw, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { storageService } from '../services/storageService';

interface Props {
  onOpenUpdateModal: () => void;
}

export const FloatingUpdateButton: React.FC<Props> = ({ onOpenUpdateModal }) => {
  const [isInstantUpdating, setIsInstantUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleInstantSync = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsInstantUpdating(true);
    setToastMessage('পুরনো ক্যাশ মুছে নতুন ফিচার লোড করা হচ্ছে...');

    try {
      // 1. Force full update and wipe stale service worker caches
      await storageService.forceFullAppUpdate();
      storageService.updateAndSyncOfflineCache();

      setToastMessage('সর্বশেষ নতুন ফিচার প্রস্তুত! পৃষ্ঠা রিলোড হচ্ছে...');
      await new Promise((r) => setTimeout(r, 600));

      // Reload with cache-busting timestamp
      const freshUrl = storageService.generateShareableLatestUrl('floating-btn');
      window.location.href = freshUrl;
    } catch (err) {
      console.error(err);
      setIsInstantUpdating(false);
      setToastMessage('আপডেটে সমস্যা হয়েছে। পৃষ্ঠা রিলোড করুন।');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <>
      {/* Toast Notification overlay during instant sync */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-bounce backdrop-blur-md">
          <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Action Button (placed above bottom nav on mobile) */}
      <div
        id="floating-update-container"
        className="fixed bottom-16 right-3 sm:bottom-6 sm:right-6 z-40 select-none"
      >
        <div className="group relative flex items-center">
          {/* Tooltip / Label preview on hover */}
          <div className="absolute right-full mr-2 hidden sm:flex items-center gap-1.5 bg-slate-900/90 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>নতুন কোনো ফিচার যুক্ত হলে এখানে ক্লিক করুন</span>
          </div>

          {/* Main Button Pill */}
          <button
            id="btn-floating-update-features"
            onClick={onOpenUpdateModal}
            disabled={isInstantUpdating}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-lg hover:shadow-emerald-600/40 border border-emerald-300/40 transition-all duration-200 cursor-pointer active:scale-95 group-hover:scale-105"
            title="নতুন ফিচার ও আপডেট সিঙ্ক করুন"
          >
            <div className="relative flex items-center justify-center">
              <RefreshCw
                className={`w-4 h-4 text-amber-300 stroke-[2.5] ${
                  isInstantUpdating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'
                }`}
              />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            </div>

            <span className="tracking-tight">নতুন ফিচার আনুন</span>

            {/* Quick 1-click Instant Action button inside or separate */}
            <span
              onClick={handleInstantSync}
              className="hidden xs:inline-flex items-center gap-1 text-[10px] bg-emerald-950/70 hover:bg-amber-400 hover:text-slate-950 text-amber-300 px-2 py-0.5 rounded-full border border-emerald-400/50 font-bold transition ml-1"
              title="সরাসরি ১-ক্লিকে রিলোড ও আপডেট করুন"
            >
              ১-ক্লিক সিঙ্ক
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
