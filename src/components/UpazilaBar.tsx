import React from 'react';
import { MapPin, Compass, Phone, Shield, Building2, HeartPulse, ChevronRight, Info } from 'lucide-react';
import { Upazila, TabType } from '../types';
import { UPAZILA_DATA } from './UpazilaHubModal';

interface Props {
  selectedUpazila: Upazila;
  onSelectUpazila: (u: Upazila) => void;
  onOpenUpazilaModal: () => void;
  onNavigate: (tab: TabType, extra?: any) => void;
}

export const UpazilaBar: React.FC<Props> = ({
  selectedUpazila,
  onSelectUpazila,
  onOpenUpazilaModal,
  onNavigate,
}) => {
  const upazilaList: Upazila[] = [
    'সকল উপজেলা',
    'জামালপুর সদর',
    'ইসলামপুর',
    'দেওয়ানগঞ্জ',
    'মেলান্দহ',
    'মাদারগঞ্জ',
    'সরিষাবাড়ী',
    'বকশীগঞ্জ',
  ];

  const currentDetail = UPAZILA_DATA.find((u) => u.id === selectedUpazila);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                জামালপুর জেলার ৭টি উপজেলা
              </h2>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                ৭টি উপজেলা লাইভ
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              যেকোনো উপজেলায় ক্লিক করে সেখানকার সংবাদ, হাসপাতাল, ডাক্তার ও স্থানীয় সেবা আলাদাভাবে দেখুন
            </p>
          </div>
        </div>

        <button
          id="open-upazila-hub-btn"
          onClick={onOpenUpazilaModal}
          className="self-start sm:self-auto bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
          <span>উপজেলা জরুরি হটলাইন ও ডিরেক্টরি</span>
        </button>
      </div>

      {/* 7 Upazilas Interactive Tap Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {upazilaList.map((up) => {
          const isSelected = selectedUpazila === up;
          const isAll = up === 'সকল উপজেলা';
          return (
            <button
              key={up}
              id={`upazila-chip-${up.replace(/\s+/g, '-')}`}
              onClick={() => onSelectUpazila(up)}
              className={`p-2.5 rounded-2xl text-left flex flex-col justify-between transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md ring-2 ring-emerald-400/40 scale-[1.02]'
                  : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {isAll ? 'জেলা' : 'উপজেলা'}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-amber-300"></span>
                )}
              </div>
              <div className="mt-1.5">
                <span className="font-extrabold text-xs sm:text-sm block leading-tight">
                  {up}
                </span>
                <span
                  className={`text-[10px] block mt-0.5 ${
                    isSelected ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isAll ? 'সমগ্র জামালপুর' : 'ক্লিক করে দেখুন'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* When a specific Upazila is selected, show an instant Emergency Quick Contact Strip */}
      {currentDetail && (
        <div className="bg-emerald-50/80 dark:bg-emerald-950/40 p-3 sm:p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <div>
              <span className="font-bold text-slate-900 dark:text-white">
                বর্তমানে <strong className="text-emerald-700 dark:text-emerald-300">{currentDetail.nameBn}</strong> উপজেলার তথ্য প্রদর্শিত হচ্ছে:
              </span>{' '}
              <span className="text-slate-600 dark:text-slate-400">
                {currentDetail.tagline} • বিখ্যাত: {currentDetail.famousFor}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <a
              href={`tel:${currentDetail.contacts.police.replace(/[^0-9]/g, '')}`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 text-[11px] transition"
              title="থানা পুলিশ ডিউটি অফিসার"
            >
              <Shield className="w-3 h-3" />
              <span>থানা: {currentDetail.contacts.police}</span>
            </a>
            <a
              href={`tel:${currentDetail.contacts.hospital.replace(/[^0-9]/g, '')}`}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 text-[11px] transition"
              title="স্বাস্থ্য কমপ্লেক্স / জরুরি বিভাগ"
            >
              <HeartPulse className="w-3 h-3" />
              <span>হাসপাতাল: {currentDetail.contacts.hospital}</span>
            </a>
            <button
              onClick={onOpenUpazilaModal}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 text-[11px] cursor-pointer transition"
            >
              <span>বিস্তারিত →</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
