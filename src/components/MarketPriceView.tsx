import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, Search, Calendar, MapPin, Sparkles } from 'lucide-react';
import { storageService } from '../services/storageService';
import { MarketPriceItem } from '../types';

export const MarketPriceView: React.FC = () => {
  const [prices, setPrices] = useState<MarketPriceItem[]>(storageService.getMarketPrices());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'সকল পণ্য' },
    { id: 'চাল ও ডাল', label: 'চাল ও খাদ্যশস্য' },
    { id: 'তেল ও মসলা', label: 'তেল ও মসলা' },
    { id: 'শাকসবজি', label: 'শাকসবজি' },
    { id: 'মাছ ও মাংস', label: 'মাছ ও মাংস' },
    { id: 'ডিম ও দুধ', label: 'ডিম ও দুগ্ধজাত' },
  ];

  const filteredPrices = useMemo(() => {
    return prices.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [prices, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-900 via-slate-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-700/80 text-orange-200 text-xs font-bold mb-3 border border-orange-500/40">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>জামালপুর জেলা কাঁচাবাজার মনিটরিং</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            আজকের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর
          </h1>
          <p className="text-xs sm:text-sm text-orange-100/90 mt-2">
            জামালপুর বড় বাজার, নান্দিনা ও ইসলামপুর বাজারের খুচরা ও পাইকারি পণ্যের নির্ভরযোগ্য তালিকা।
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            id="market-search-input"
            type="text"
            placeholder="পণ্যের নাম দিয়ে খুঁজুন (যেমন: মিনিকেট চাল, ডিম, পেঁয়াজ, আলু, মুরগি)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
          />
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs font-semibold">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-xs">
              <tr>
                <th className="p-4">পণ্যের নাম</th>
                <th className="p-4">ক্যাটেগরি</th>
                <th className="p-4">একক</th>
                <th className="p-4">পূর্বের মূল্য</th>
                <th className="p-4">আজকের বর্তমান মূল্য</th>
                <th className="p-4">মূল্য পরিবর্তন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredPrices.map((item) => (
                <tr key={item.id} className="hover:bg-orange-50/40 transition">
                  <td className="p-4 font-bold text-slate-900">{item.name}</td>
                  <td className="p-4 text-slate-500">{item.category}</td>
                  <td className="p-4 text-slate-600 font-semibold">{item.unit}</td>
                  <td className="p-4 text-slate-400 font-mono">৳ {item.previousPrice}</td>
                  <td className="p-4 font-extrabold text-orange-700 text-base font-mono">
                    ৳ {item.currentPrice}
                  </td>
                  <td className="p-4">
                    {item.trend === 'up' && (
                      <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded font-bold text-xs">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>বৃদ্ধি</span>
                      </span>
                    )}
                    {item.trend === 'down' && (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-xs">
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span>হ্রাস</span>
                      </span>
                    )}
                    {item.trend === 'stable' && (
                      <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-bold text-xs">
                        <Minus className="w-3.5 h-3.5" />
                        <span>অপরিবর্তিত</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>📍 উৎস: জামালপুর ভোক্তা অধিকার ও স্থানীয় বাজার কমিটি</span>
          <span>সর্বশেষ আপডেট: আজ সকাল ০৮:০০ ঘটিকা</span>
        </div>
      </div>
    </div>
  );
};
