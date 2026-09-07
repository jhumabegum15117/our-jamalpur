import React, { useState, useMemo } from 'react';
import { Hospital, UserCheck, Phone, MapPin, Clock, Search, ShieldAlert, HeartPulse, Stethoscope, Award, Calendar } from 'lucide-react';
import { storageService } from '../services/storageService';
import { HospitalItem, DoctorItem } from '../types';

interface Props {
  defaultSubTab?: 'hospital' | 'doctors';
}

export const HealthView: React.FC<Props> = ({ defaultSubTab = 'hospital' }) => {
  const [activeTab, setActiveTab] = useState<'hospital' | 'doctors'>(defaultSubTab);
  const [hospitals, setHospitals] = useState<HospitalItem[]>(storageService.getHospitals());
  const [doctors, setDoctors] = useState<DoctorItem[]>(storageService.getDoctors());
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');

  const specialties = [
    { id: 'all', label: 'সকল বিশেষজ্ঞ' },
    { id: 'মেডিসিন', label: 'মেডিসিন' },
    { id: 'হৃদরোগ', label: 'হৃদরোগ ও কার্ডিওলজি' },
    { id: 'গাইনী', label: 'গাইনী ও প্রসূতি' },
    { id: 'অর্থোপেডিক', label: 'অর্থোপেডিক ও ট্রমা' },
    { id: 'শিশু', label: 'শিশু বিশেষজ্ঞ' },
    { id: 'সার্জারি', label: 'জেনারেল সার্জারি' },
  ];

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      return (
        !searchQuery.trim() ||
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.services.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [hospitals, searchQuery]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((d) => {
      const matchSearch =
        !searchQuery.trim() ||
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.hospitalOrChamber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSpec = specialtyFilter === 'all' || d.specialty.includes(specialtyFilter);
      return matchSearch && matchSpec;
    });
  }, [doctors, searchQuery, specialtyFilter]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-700/80 text-rose-200 text-xs font-bold mb-3 border border-rose-500/40">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>জামালপুর স্বাস্থ্য ও চিকিৎসা সেবা</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            হাসপাতাল, অ্যাম্বুলেন্স ও ডাক্তার ডিরেক্টরি
          </h1>
          <p className="text-xs sm:text-sm text-rose-100/90 mt-2">
            জরুরি চিকিৎসা সেবা, অ্যাম্বুলেন্স সাপোর্ট ও জামালপুরের খ্যাতনামা বিশেষজ্ঞ ডাক্তারদের চেম্বারের সিরিয়াল নম্বর।
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 mt-6">
          <button
            id="health-hospital-tab"
            onClick={() => setActiveTab('hospital')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'hospital'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Hospital className="w-4 h-4" />
            <span>হাসপাতাল ও ক্লিনিক ({hospitals.length})</span>
          </button>
          <button
            id="health-doctors-tab"
            onClick={() => setActiveTab('doctors')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'doctors'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>ডাক্তার তালিকা ({doctors.length})</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            id="health-search-input"
            type="text"
            placeholder={
              activeTab === 'hospital'
                ? 'হাসপাতাল বা ক্লিনিকের নাম দিয়ে খুঁজুন...'
                : 'ডাক্তারের নাম বা রোগ বিশেষজ্ঞের ধরন খুঁজুন...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-rose-500 focus:bg-white"
          />
        </div>

        {activeTab === 'doctors' && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs font-semibold">
            {specialties.map((spec) => (
              <button
                key={spec.id}
                onClick={() => setSpecialtyFilter(spec.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer border ${
                  specialtyFilter === spec.id
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                {spec.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hospitals Tab */}
      {activeTab === 'hospital' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHospitals.map((hosp) => (
            <div
              key={hosp.id}
              id={`hospital-card-${hosp.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                      {hosp.type === 'Govt' ? 'সরকারি জেনারেল হাসপাতাল' : 'বেসরকারি হাসপাতাল ও ডায়াগনস্টিক'}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-1">{hosp.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{hosp.address}</span>
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <Hospital className="w-5 h-5" />
                  </div>
                </div>

                {/* Badges / Services */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                    🛏️ মোট বেড: {hosp.bedCount}
                  </span>
                  {hosp.services.map((svc, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                    >
                      {svc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Hotlines */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <a
                  href={`tel:${hosp.emergencyPhone.replace(/[^0-9]/g, '')}`}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>জরুরি: {hosp.emergencyPhone}</span>
                </a>

                {hosp.ambulancePhone && (
                  <a
                    href={`tel:${hosp.ambulancePhone.replace(/[^0-9]/g, '')}`}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition"
                  >
                    <span>🚑 অ্যাম্বুলেন্স</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Doctor Directory Tab */}
      {activeTab === 'doctors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              id={`doctor-card-${doc.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold text-base shrink-0">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{doc.name}</h3>
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded inline-block mt-0.5">
                      {doc.specialty}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">{doc.qualification}</p>
                  </div>
                </div>

                <div className="mt-4 bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs text-slate-700">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>চেম্বার: {doc.hospitalOrChamber}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>রোগী দেখার সময়: {doc.visitingHours}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    ফি: <strong>৳{doc.fee}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">সিরিয়ালের জন্য:</span>
                <a
                  id={`call-doc-${doc.id}`}
                  href={`tel:${doc.appointmentPhone.replace(/[^0-9]/g, '')}`}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{doc.appointmentPhone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
