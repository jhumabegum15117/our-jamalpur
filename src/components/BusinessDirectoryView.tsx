import React, { useState, useMemo } from 'react';
import { Building2, Phone, MapPin, Search, Star, ExternalLink, PlusCircle, CheckCircle2 } from 'lucide-react';
import { storageService } from '../services/storageService';
import { BusinessItem, Upazila } from '../types';

export const BusinessDirectoryView: React.FC = () => {
  const [businesses, setBusinesses] = useState<BusinessItem[]>(storageService.getBusinesses());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUpazila, setSelectedUpazila] = useState<Upazila>('সকল উপজেলা');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'সব ব্যবসা প্রতিষ্ঠান' },
    { id: 'হস্তশিল্প ও নকশী কাঁথা', label: '🧵 হস্তশিল্প ও নকশী কাঁথা' },
    { id: 'আইটি ও কম্পিউটার সেবা', label: '💻 আইটি ও সফটওয়্যার' },
    { id: 'হোটেল ও রেস্তোরাঁ', label: '🍽️ হোটেল ও রেস্তোরাঁ' },
    { id: 'স্বাস্থ্য ও ডায়াগনস্টিক', label: '🏥 ডায়াগনস্টিক ও ফার্মেসি' },
    { id: 'ইলেকট্রনিক্স ও হার্ডওয়্যার', label: '⚡ ইলেকট্রনিক্স' },
    { id: 'মিষ্টি ও বেকারি', label: '🧁 মিষ্টি ও মিষ্টান্ন' },
  ];

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

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      const matchCat = selectedCategory === 'all' || b.category === selectedCategory;
      const matchUpazila = selectedUpazila === 'সকল উপজেলা' || b.upazila === selectedUpazila;
      const matchSearch =
        !searchQuery.trim() ||
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.servicesSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchUpazila && matchSearch;
    });
  }, [businesses, selectedCategory, selectedUpazila, searchQuery]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-700/80 text-teal-200 text-xs font-bold mb-3 border border-teal-500/40">
            <Building2 className="w-3.5 h-3.5" />
            <span>জামালপুর জেলা ব্যবসায়ী ও উদ্যোক্তা ডিরেক্টরি</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            স্থানীয় দোকান, শোরুম ও ব্যবসা প্রতিষ্ঠানের তালিকা
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-2">
            জামালপুরের বিশ্বখ্যাত নকশী কাঁথা কারখানা, আইটি সেন্টার, স্বনামধন্য হোটেল ও নির্ভরযোগ্য প্রতিষ্ঠানের ঠিকানা ও ফোন নম্বর।
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              id="business-search-input"
              type="text"
              placeholder="দোকান বা প্রতিষ্ঠানের নাম দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:bg-white"
            />
          </div>

          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <select
              value={selectedUpazila}
              onChange={(e) => setSelectedUpazila(e.target.value as Upazila)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:bg-white cursor-pointer"
            >
              {upazilas.map((up) => (
                <option key={up} value={up}>
                  {up}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs font-semibold">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs font-bold'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Business Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBusinesses.map((b) => (
          <div
            key={b.id}
            id={`business-card-${b.id}`}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200/60">
                    {b.category}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-1.5">{b.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{b.address}</span>
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-3 bg-slate-50 p-3 rounded-xl text-xs text-slate-600 space-y-1">
                <div><strong>প্রদত্ত সেবা:</strong> {b.servicesSummary}</div>
                {b.ownerName && (
                  <div className="text-slate-500">স্বত্বাধিকারী: {b.ownerName}</div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">📱 {b.phone}</span>
              <a
                href={`tel:${b.phone.replace(/[^0-9]/g, '')}`}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>কল করুন</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
