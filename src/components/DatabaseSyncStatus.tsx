import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  RefreshCw,
  WifiOff,
  Database,
  Radio,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { syncStatusService, SyncState } from '../services/syncStatusService';

interface Props {
  variant?: 'header' | 'compact';
}

export const DatabaseSyncStatus: React.FC<Props> = ({ variant = 'header' }) => {
  const [syncState, setSyncState] = useState<SyncState>(syncStatusService.getState());
  const [isOpen, setIsOpen] = useState(false);
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = syncStatusService.subscribe((state) => {
      setSyncState(state);
    });
    return () => unsubscribe();
  }, []);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleManualSync = async () => {
    setIsManualSyncing(true);
    await syncStatusService.triggerManualSync();
    setIsManualSyncing(false);
  };

  const formatLastSyncTime = (date: Date | null) => {
    if (!date) return 'অজানা';
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffSec < 10) return 'এইমাত্র';
    if (diffSec < 60) return `${diffSec} সেকেন্ড আগে`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} মিনিট আগে`;
    return date.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
  };

  const isSyncingActive = syncState.isSyncing || isManualSyncing;

  return (
    <div className="relative inline-flex items-center" ref={popoverRef}>
      {/* Small Header Status Button */}
      <button
        type="button"
        id="header-database-sync-status-btn"
        onClick={() => setIsOpen(!isOpen)}
        title={
          !syncState.isOnline
            ? 'অফলাইন মোড - ইন্টারনেট সংযোগ নেই'
            : isSyncingActive
            ? 'ডাটাবেজ সকেটে তথ্য সিঙ্ক হচ্ছে...'
            : 'ডাটাবেজের সর্বশেষ তথ্যের সাথে সিঙ্ক করা আছে (Synced)'
        }
        className={`group relative flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer select-none text-xs font-semibold ${
          !syncState.isOnline
            ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
            : isSyncingActive
            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300/80 dark:border-amber-700/80 shadow-xs'
            : 'bg-emerald-50/90 hover:bg-emerald-100/80 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border-emerald-300/70 dark:border-emerald-800/70 shadow-2xs'
        }`}
        aria-label={isSyncingActive ? 'Syncing...' : 'Synced with database'}
      >
        {/* Status Icon */}
        {!syncState.isOnline ? (
          <WifiOff className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        ) : isSyncingActive ? (
          <RefreshCw className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 animate-spin shrink-0" />
        ) : (
          <div className="relative flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping opacity-75 hidden group-hover:block" />
          </div>
        )}

        {/* Text Label */}
        <span className="hidden sm:inline font-medium tracking-tight">
          {!syncState.isOnline ? (
            'Offline'
          ) : isSyncingActive ? (
            <span className="text-amber-700 dark:text-amber-300 font-bold">Syncing...</span>
          ) : (
            <span className="text-emerald-700 dark:text-emerald-300">Synced</span>
          )}
        </span>
      </button>

      {/* Detail Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 p-4 text-xs space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">
                  ডাটাবেজ সিঙ্ক অবস্থা
                </h4>
                <p className="text-[10px] text-slate-400">Cloud Firestore লাইভ সকেট</p>
              </div>
            </div>

            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                !syncState.isOnline
                  ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  : isSyncingActive
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
              }`}
            >
              {!syncState.isOnline ? 'অফলাইন' : isSyncingActive ? 'সিঙ্ক হচ্ছে...' : 'সংযুক্ত ও সক্রিয়'}
            </span>
          </div>

          <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800 text-[11px]">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-500" />
                <span>সকেট কানেকশন:</span>
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {syncState.activeSocketChannel && syncState.isOnline ? 'লাইভ সকেট চালু' : 'বিচ্ছিন্ন'}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>সর্বশেষ সিঙ্ক:</span>
              </span>
              <span className="font-mono text-slate-700 dark:text-slate-200">
                {formatLastSyncTime(syncState.lastSyncedAt)}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>ক্লাউড ডাটাবেজ:</span>
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-200">
                Firestore Realtime
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            <button
              type="button"
              id="manual-force-sync-btn"
              onClick={handleManualSync}
              disabled={isSyncingActive || !syncState.isOnline}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingActive ? 'animate-spin' : ''}`} />
              <span>{isSyncingActive ? 'সিঙ্ক হচ্ছে...' : 'এখনই সিঙ্ক যাচাই করুন'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs transition cursor-pointer"
            >
              বন্ধ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
