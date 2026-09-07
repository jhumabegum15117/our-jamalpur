import React, { useState, useMemo } from 'react';
import { Search, X, ShoppingBag, Newspaper, Bus, Train, Hospital, UserCheck, Pill, Briefcase, Building2, ArrowRight, ArrowRightLeft } from 'lucide-react';
import { TabType } from '../types';
import { storageService } from '../services/storageService';
import { initialMfsProviders } from '../data/initialData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: TabType, extra?: any) => void;
}

export const GlobalSearchModal: React.FC<Props> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const products = storageService.getProducts();
  const news = storageService.getNews();
  const buses = storageService.getBuses();
  const trains = storageService.getTrains();
  const hospitals = storageService.getHospitals();
  const doctors = storageService.getDoctors();
  const medicines = storageService.getMedicines();
  const jobs = storageService.getJobs();
  const businesses = storageService.getBusinesses();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const items: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: string;
      icon: any;
      tab: TabType;
      raw: any;
    }> = [];

    // Search Products
    if (categoryFilter === 'all' || categoryFilter === 'marketplace') {
      products.forEach((p) => {
        if (
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
        ) {
          items.push({
            id: p.id,
            title: p.title,
            subtitle: `৳ ${p.price.toLocaleString('bn-BD')} • ${p.location} (${p.category})`,
            category: 'মার্কেটপ্লেস পণ্য',
            icon: ShoppingBag,
            tab: 'marketplace',
            raw: p,
          });
        }
      });
    }

    // Search News
    if (categoryFilter === 'all' || categoryFilter === 'news') {
      news.forEach((n) => {
        if (
          n.title.toLowerCase().includes(q) ||
          n.summary.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q) ||
          n.location.toLowerCase().includes(q)
        ) {
          items.push({
            id: n.id,
            title: n.title,
            subtitle: `${n.location} • ${n.date} (${n.category})`,
            category: 'স্থানীয় সংবাদ',
            icon: Newspaper,
            tab: 'news',
            raw: n,
          });
        }
      });
    }

    // Search Bus
    if (categoryFilter === 'all' || categoryFilter === 'transport') {
      buses.forEach((b) => {
        if (b.name.toLowerCase().includes(q) || b.route.toLowerCase().includes(q) || b.counterLocation.toLowerCase().includes(q)) {
          items.push({
            id: b.id,
            title: b.name,
            subtitle: `রুট: ${b.route} • ভাড়া: ৳${b.fare} • কাউন্টার: ${b.counterLocation}`,
            category: 'বাস সার্ভিস',
            icon: Bus,
            tab: 'bus',
            raw: b,
          });
        }
      });

      trains.forEach((t) => {
        if (t.trainName.toLowerCase().includes(q) || t.route.toLowerCase().includes(q) || t.trainNo.includes(q)) {
          items.push({
            id: t.id,
            title: `${t.trainName} (${t.trainNo})`,
            subtitle: `রুট: ${t.route} • ছুটি: ${t.weeklyOffDay}`,
            category: 'ট্রেন সময়সূচী',
            icon: Train,
            tab: 'train',
            raw: t,
          });
        }
      });
    }

    // Search Doctors & Hospitals
    if (categoryFilter === 'all' || categoryFilter === 'health') {
      hospitals.forEach((h) => {
        if (h.name.toLowerCase().includes(q) || h.address.toLowerCase().includes(q) || h.services.some(s => s.toLowerCase().includes(q))) {
          items.push({
            id: h.id,
            title: h.name,
            subtitle: `${h.address} • ফোন: ${h.emergencyPhone}`,
            category: 'হাসপাতাল',
            icon: Hospital,
            tab: 'hospital',
            raw: h,
          });
        }
      });

      doctors.forEach((d) => {
        if (d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q) || d.hospitalOrChamber.toLowerCase().includes(q)) {
          items.push({
            id: d.id,
            title: d.name,
            subtitle: `${d.specialty} • চেম্বার: ${d.hospitalOrChamber}`,
            category: 'ডাক্তার',
            icon: UserCheck,
            tab: 'doctors',
            raw: d,
          });
        }
      });
    }

    // Search Medicines
    if (categoryFilter === 'all' || categoryFilter === 'medicine') {
      medicines.forEach((m) => {
        if (m.brandName.toLowerCase().includes(q) || m.genericName.toLowerCase().includes(q) || m.indications.toLowerCase().includes(q)) {
          items.push({
            id: m.id,
            title: `${m.brandName} (${m.strength})`,
            subtitle: `জেনেরিক: ${m.genericName} • ${m.manufacturer}`,
            category: 'ঔষধ নির্দেশিকা',
            icon: Pill,
            tab: 'medicine',
            raw: m,
          });
        }
      });
    }

    // Search Jobs
    if (categoryFilter === 'all' || categoryFilter === 'jobs') {
      jobs.forEach((j) => {
        if (j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.location.toLowerCase().includes(q)) {
          items.push({
            id: j.id,
            title: j.title,
            subtitle: `${j.company} • ${j.location} • বেতন: ${j.salary}`,
            category: 'চাকরির খবর',
            icon: Briefcase,
            tab: 'jobs',
            raw: j,
          });
        }
      });
    }

    // Search Businesses
    if (categoryFilter === 'all' || categoryFilter === 'business') {
      businesses.forEach((bz) => {
        if (bz.name.toLowerCase().includes(q) || bz.servicesSummary.toLowerCase().includes(q) || bz.address.toLowerCase().includes(q)) {
          items.push({
            id: bz.id,
            title: bz.name,
            subtitle: `${bz.category} • ${bz.address} • ফোন: ${bz.phone}`,
            category: 'ব্যবসা প্রতিষ্ঠান',
            icon: Building2,
            tab: 'business',
            raw: bz,
          });
        }
      });
    }

    // Search MFS & Fund Transfer
    if (categoryFilter === 'all') {
      initialMfsProviders.forEach((mfs) => {
        if (
          mfs.name.toLowerCase().includes(q) ||
          mfs.bengaliName.toLowerCase().includes(q) ||
          mfs.description.toLowerCase().includes(q) ||
          'mfs বিকাশ রকেট নগদ সেলফিন মানি ট্রান্সফার ফান্ড ট্রান্সফার বিনিময় আন্তঃ লেনদেন'.includes(q)
        ) {
          items.push({
            id: `mfs-${mfs.id}`,
            title: `${mfs.bengaliName} (${mfs.name}) - MFS আন্তঃ লেনদেন`,
            subtitle: `ডায়াল: ${mfs.ussd} • হেল্পলাইন: ${mfs.helpline} • বিনিময় সমর্থিত`,
            category: 'MFS ফান্ড ট্রান্সফার',
            icon: ArrowRightLeft,
            tab: 'mfs-transfer',
            raw: mfs,
          });
        }
      });
    }

    return items;
  }, [query, categoryFilter, products, news, buses, trains, hospitals, doctors, medicines, jobs, businesses]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-slate-900/60 backdrop-blur-xs pt-12 sm:pt-20 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/70">
          <Search className="w-5 h-5 text-emerald-600 shrink-0" />
          <input
            id="global-search-input"
            type="text"
            autoFocus
            placeholder="জামালপুরের খবর, পণ্য, বাস, ট্রেন, ডাক্তার, ঔষধ, চাকরি খুঁজুন..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base sm:text-lg bg-transparent focus:outline-none placeholder:text-slate-400 font-medium text-slate-800"
          />
          {query && (
            <button
              id="clear-search-btn"
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            id="close-search-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="px-4 py-2 bg-slate-100/60 border-b border-slate-200/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-medium">
          {[
            { id: 'all', label: 'সব ক্যাটেগরি' },
            { id: 'marketplace', label: 'মার্কেটপ্লেস' },
            { id: 'news', label: 'সংবাদ' },
            { id: 'transport', label: 'পরিবহন' },
            { id: 'health', label: 'স্বাস্থ্য ও ডাক্তার' },
            { id: 'medicine', label: 'ঔষধ' },
            { id: 'jobs', label: 'চাকরি' },
            { id: 'business', label: 'ব্যবসা' },
          ].map((cat) => (
            <button
              key={cat.id}
              id={`filter-${cat.id}`}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {!query.trim() ? (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-12 h-12 mx-auto text-slate-300 mb-3 stroke-[1.5]" />
              <p className="text-sm font-medium text-slate-500">কোনো তথ্য খুঁজতে উপরে টাইপ করুন</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-md mx-auto text-xs">
                <span className="text-slate-400">জনপ্রিয় সার্চ:</span>
                {['তিস্তা এক্সপ্রেস', 'নকশী কাঁথা', 'জেনারেল হাসপাতাল', 'রাজীব বাস', 'মিনিকেট চাল', 'নাপা'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2 py-0.5 rounded cursor-pointer border border-emerald-200/60"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm font-semibold text-slate-600">“{query}” এর জন্য কোনো ফলাফল পাওয়া যায়নি</p>
              <p className="text-xs text-slate-400 mt-1">বানান ঠিক আছে কি না পুনরায় যাচাই করুন।</p>
            </div>
          ) : (
            results.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  id={`search-result-${item.id}`}
                  onClick={() => {
                    onNavigate(item.tab, item.raw);
                    onClose();
                  }}
                  className="p-3 bg-white hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 rounded-xl cursor-pointer transition flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {item.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition group-hover:translate-x-1 shrink-0 ml-2" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>মোট {results.length}টি ফলাফল পাওয়া গেছে</span>
          <span>ESC চাপলে বন্ধ হবে</span>
        </div>
      </div>
    </div>
  );
};
