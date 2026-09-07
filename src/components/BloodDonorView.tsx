import React, { useState, useMemo } from 'react';
import { HeartPulse, Phone, MessageCircle, PlusCircle, Search, MapPin, Calendar, CheckCircle2, X } from 'lucide-react';
import { storageService } from '../services/storageService';
import { BloodDonor, BloodGroup, Upazila } from '../types';

export const BloodDonorView: React.FC = () => {
  const [donors, setDonors] = useState<BloodDonor[]>(storageService.getBloodDonors());
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedUpazila, setSelectedUpazila] = useState<Upazila>('সকল উপজেলা');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formGroup, setFormGroup] = useState<BloodGroup>('O+');
  const [formUpazila, setFormUpazila] = useState<Upazila>('জামালপুর সদর');
  const [formArea, setFormArea] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formLastDonation, setFormLastDonation] = useState('');

  const bloodGroups: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'সব গ্রুপ' },
    { id: 'A+', label: 'A+' },
    { id: 'A-', label: 'A-' },
    { id: 'B+', label: 'B+' },
    { id: 'B-', label: 'B-' },
    { id: 'O+', label: 'O+' },
    { id: 'O-', label: 'O-' },
    { id: 'AB+', label: 'AB+' },
    { id: 'AB-', label: 'AB-' },
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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) {
      alert('দয়া করে নাম ও মোবাইল নম্বর প্রদান করুন');
      return;
    }

    storageService.addBloodDonor({
      name: formName,
      bloodGroup: formGroup,
      phone: formPhone,
      upazila: formUpazila,
      address: formArea || formUpazila,
      area: formArea || formUpazila,
      lastDonationDate: formLastDonation || 'নতুন রক্তদাতা',
      isAvailable: true,
    });

    setDonors(storageService.getBloodDonors());
    setIsRegisterModalOpen(false);
    alert('অভিনন্দন! আপনি সফলভাবে রক্তদাতা হিসেবে নিবন্ধিত হয়েছেন।');

    setFormName('');
    setFormPhone('');
    setFormArea('');
    setFormLastDonation('');
  };

  const filteredDonors = useMemo(() => {
    return donors.filter((d) => {
      const matchGroup = selectedGroup === 'all' || d.bloodGroup === selectedGroup;
      const matchUpazila = selectedUpazila === 'সকল উপজেলা' || d.upazila === selectedUpazila;
      const matchSearch =
        !searchQuery.trim() ||
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.upazila.toLowerCase().includes(searchQuery.toLowerCase());
      return matchGroup && matchUpazila && matchSearch;
    });
  }, [donors, selectedGroup, selectedUpazila, searchQuery]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-900 via-rose-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-700/80 text-red-200 text-xs font-bold mb-3 border border-red-500/40">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>জরুরি রক্তদাতা নেটওয়ার্ক</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            জামালপুর জেলার স্বেচ্ছাসেবী রক্তদাতা ডিরেক্টরি
          </h1>
          <p className="text-xs sm:text-sm text-red-100/90 mt-2 max-w-xl">
            এক ব্যাগ রক্ত বাঁচাতে পারে একটি মুমূর্ষু প্রাণ। আপনার প্রয়োজনীয় রক্তের গ্রুপ নির্বাচন করে সরাসরি রক্তদাতার সাথে যোগাযোগ করুন।
          </p>
        </div>

        <button
          id="register-donor-btn"
          onClick={() => setIsRegisterModalOpen(true)}
          className="shrink-0 bg-white hover:bg-red-50 text-red-700 font-bold px-6 py-3 rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          <span>রক্তদাতা হিসেবে যুক্ত হোন</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              id="donor-search-input"
              type="text"
              placeholder="রক্তদাতার নাম বা এলাকা দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:bg-white"
            />
          </div>

          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <select
              value={selectedUpazila}
              onChange={(e) => setSelectedUpazila(e.target.value as Upazila)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:bg-white cursor-pointer"
            >
              {upazilas.map((up) => (
                <option key={up} value={up}>
                  {up}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Blood Group Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs font-semibold">
          {bloodGroups.map((grp) => (
            <button
              key={grp.id}
              onClick={() => setSelectedGroup(grp.id)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition cursor-pointer border ${
                selectedGroup === grp.id
                  ? 'bg-red-600 text-white border-red-600 shadow-xs font-bold'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
            >
              {grp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Donors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDonors.map((donor) => (
          <div
            key={donor.id}
            id={`donor-card-${donor.id}`}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{donor.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{donor.area}, {donor.upazila}</span>
                  </p>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center font-black text-lg shadow-2xs">
                  {donor.bloodGroup}
                </div>
              </div>

              <div className="mt-4 bg-slate-50 p-3 rounded-xl space-y-1 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>সর্বশেষ রক্তদান:</span>
                  <strong>{donor.lastDonationDate}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>স্ট্যাটাস:</span>
                  <span className={`font-semibold ${donor.isAvailable ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {donor.isAvailable ? '● রক্তদানে প্রস্তুত' : '○ সম্প্রতি রক্ত দিয়েছেন'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
              <a
                href={`tel:${donor.phone.replace(/[^0-9]/g, '')}`}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>কল করুন</span>
              </a>
              <a
                href={`https://wa.me/88${donor.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center justify-center gap-1 transition"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Register Donor Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
            <div className="p-4 sm:p-5 bg-red-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5" />
                <h3 className="font-bold text-lg">স্বেচ্ছাসেবী রক্তদাতা নিবন্ধন</h3>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1 text-red-200 hover:text-white rounded-lg hover:bg-red-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="p-5 space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">আপনার পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="নাম লিখুন"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">রক্তের গ্রুপ *</label>
                  <select
                    value={formGroup}
                    onChange={(e) => setFormGroup(e.target.value as BloodGroup)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500 focus:bg-white"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">উপজেলা *</label>
                  <select
                    value={formUpazila}
                    onChange={(e) => setFormUpazila(e.target.value as Upazila)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500 focus:bg-white"
                  >
                    <option value="জামালপুর সদর">জামালপুর সদর</option>
                    <option value="ইসলামপুর">ইসলামপুর</option>
                    <option value="মেলান্দহ">মেলান্দহ</option>
                    <option value="দেওয়ানগঞ্জ">দেওয়ানগঞ্জ</option>
                    <option value="মাদারগঞ্জ">মাদারগঞ্জ</option>
                    <option value="সরিষাবাড়ী">সরিষাবাড়ী</option>
                    <option value="বকশীগঞ্জ">বকশীগঞ্জ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">বর্তমান এলাকা / গ্রাম / ইউনিয়ন</label>
                <input
                  type="text"
                  placeholder="যেমন: নান্দিনা, সিংহজানী"
                  value={formArea}
                  onChange={(e) => setFormArea(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">সচল মোবাইল নম্বর *</label>
                <input
                  type="tel"
                  required
                  placeholder="017xxxxxxxx"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">সর্বশেষ রক্তদানের তারিখ</label>
                <input
                  type="text"
                  placeholder="যেমন: ১৫ আগস্ট ২০২৪ অথবা নতুন"
                  value={formLastDonation}
                  onChange={(e) => setFormLastDonation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-md cursor-pointer transition"
                >
                  নিবন্ধন সম্পন্ন করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
