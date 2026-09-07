import React, { useState, useMemo } from 'react';
import { Pill, Search, AlertCircle, Info, ShieldAlert, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { storageService } from '../services/storageService';
import { MedicineItem } from '../types';

export const MedicineView: React.FC = () => {
  const [medicines, setMedicines] = useState<MedicineItem[]>(storageService.getMedicines());
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(medicines[0]?.id || null);

  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        m.brandName.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.indications.toLowerCase().includes(q) ||
        m.manufacturer.toLowerCase().includes(q)
      );
    });
  }, [medicines, searchQuery]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-700/80 text-cyan-200 text-xs font-bold mb-3 border border-cyan-500/40">
            <Pill className="w-3.5 h-3.5" />
            <span>ঔষধ তথ্য ও নির্দেশিকা ডিরেক্টরি</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            ঔষধের ব্যবহার, জেনেরিক ও স্বাস্থ্য নির্দেশিকা
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100/90 mt-2">
            বাংলাদেশে প্রচলিত প্রয়োজনীয় ঔষধসমূহের কার্যকারিতা, সেবন সতর্কতা ও আনুমানিক বাজারদর তথ্য।
          </p>
        </div>
      </div>

      {/* Safety Warning Disclaimer Box */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-2xl flex items-start gap-3 text-xs sm:text-sm text-amber-900 shadow-2xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-950">⚠️ জরুরি স্বাস্থ্য সতর্কতা ও অস্বীকৃতি:</h4>
          <p className="mt-0.5 text-amber-800/90 leading-relaxed">
            এই তথ্য কেবল সচেতনতা ও প্রাথমিক জানার জন্য। কোনো অবস্থাতেই নিবন্ধিত এমবিবিএস চিকিৎসকের পরামর্শ ছাড়া কোনো অ্যান্টিবায়োটিক বা প্রেসক্রিপশন ঔষধ সেবন করবেন না।
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            id="medicine-search-input"
            type="text"
            placeholder="ঔষধের নাম (Napa, Seclo, Maxpro), জেনেরিক নাম বা লক্ষণ (জ্বর, গ্যাস্ট্রিক) দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Medicines List */}
      <div className="space-y-3">
        {filteredMedicines.map((med) => {
          const isExpanded = expandedId === med.id;
          return (
            <div
              key={med.id}
              id={`medicine-card-${med.id}`}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : med.id)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold shrink-0">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900">{med.brandName}</h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200/60">
                        {med.strength}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      জেনেরিক: <strong>{med.genericName}</strong> • {med.manufacturer}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-sm text-cyan-800 hidden sm:inline-block">
                    {med.price}
                  </span>
                  <button className="p-1 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 text-xs sm:text-sm space-y-3 animate-fade-in">
                  <div>
                    <h4 className="font-bold text-slate-700">ব্যবহার ও রোগ লক্ষণ (Indications):</h4>
                    <p className="text-slate-600 mt-0.5">{med.indications}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-700">পার্শ্বপ্রতিক্রিয়া (Side Effects):</h4>
                    <p className="text-slate-600 mt-0.5">{med.sideEffects}</p>
                  </div>

                  <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-rose-900 text-xs">
                    <strong>সতর্কতা:</strong> {med.precautions}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60">
                    <span>প্রস্তুতকারক: <strong>{med.manufacturer}</strong></span>
                    <span className="font-bold text-slate-800">মূল্য: {med.price}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
