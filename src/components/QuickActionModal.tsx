import React from 'react';
import {
  X,
  ShoppingBag,
  HeartHandshake,
  Newspaper,
  Briefcase,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { TabType } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (tab: TabType, extra?: any) => void;
}

export const QuickActionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  if (!isOpen) return null;

  const actions = [
    {
      id: 'sell_product',
      tab: 'marketplace' as TabType,
      openPostAd: true,
      icon: ShoppingBag,
      title: 'পণ্য বা বিজ্ঞাপনের পোস্ট দিন',
      desc: 'মোবাইল, ইলেকট্রনিক্স, জমি, ফ্ল্যাট বা যেকোনো জিনিস বিক্রির বিজ্ঞাপন দিন',
      badge: 'জনপ্রিয় ও ফ্রি',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      iconBg: 'bg-emerald-600 text-white',
    },
    {
      id: 'blood_request',
      tab: 'blood-donor' as TabType,
      openPostAd: false,
      icon: HeartHandshake,
      title: 'জরুরি রক্তের আবেদন জানান',
      desc: 'জামালপুরের যেকোনো রোগীর জন্য দ্রুত রক্তদাতা খুঁজতে জরুরি পোস্ট দিন',
      badge: 'জরুরি জীবনরক্ষা',
      badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-800',
      iconBg: 'bg-rose-600 text-white',
    },
    {
      id: 'citizen_news',
      tab: 'news' as TabType,
      openPostAd: false,
      icon: Newspaper,
      title: 'নাগরিক সংবাদ বা তথ্য দিন',
      desc: 'জামালপুর জেলার যেকোনো ঘটনা, দুর্ঘটনা বা জনস্বার্থের খবর সবার কাছে পৌঁছে দিন',
      badge: 'নাগরিক সাংবাদিকতা',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800',
      iconBg: 'bg-blue-600 text-white',
    },
    {
      id: 'job_post',
      tab: 'jobs' as TabType,
      openPostAd: false,
      icon: Briefcase,
      title: 'চাকরি বা কাজের নিয়োগ বিজ্ঞপ্তি দিন',
      desc: 'আপনার দোকান, শোরুম বা প্রতিষ্ঠানে কর্মী নিয়োগের তথ্য প্রকাশ করুন',
      badge: 'কর্মসংস্থান',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      iconBg: 'bg-amber-600 text-white',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between relative">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 mb-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>সহজ প্রকাশনা কেন্দ্র</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              নতুন পোস্ট ও সেবা নির্বাচন করুন
            </h3>
            <p className="text-xs text-emerald-200/80">
              আপনি কী প্রকাশ করতে চান তা নিচে নিচে স্পর্শ করুন
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vertical Options Stack ("নিচে নিচে অপশন") */}
        <div className="p-4 sm:p-5 space-y-3 overflow-y-auto">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                type="button"
                onClick={() => {
                  onClose();
                  onSelectAction(act.tab, { openPostAd: act.openPostAd });
                }}
                className="w-full text-left p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 bg-slate-50/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 transition duration-150 flex items-center gap-3.5 group cursor-pointer shadow-2xs hover:shadow-md"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${act.iconBg}`}>
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition truncate">
                      {act.title}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${act.badgeColor}`}>
                      {act.badge}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {act.desc}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700/80 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/70 transition shrink-0">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-100/70 dark:bg-slate-800/70 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-4">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>সকল পোস্ট ও বিজ্ঞাপন ফ্রি</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            বাতিল করুন
          </button>
        </div>

      </div>
    </div>
  );
};
