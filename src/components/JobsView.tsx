import React, { useState, useMemo } from 'react';
import { Briefcase, MapPin, Calendar, Building, DollarSign, Clock, Search, Send, CheckCircle2, X, PlusCircle, Sparkles } from 'lucide-react';
import { storageService } from '../services/storageService';
import { JobItem, Upazila } from '../types';
import { MonetizationModal } from './MonetizationModal';

export const JobsView: React.FC = () => {
  const [jobs, setJobs] = useState<JobItem[]>(storageService.getJobs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);

  // Application form state
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantEducation, setApplicantEducation] = useState('');
  const [applicantNote, setApplicantNote] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        (Array.isArray(j.requirements)
          ? j.requirements.join(' ').toLowerCase().includes(q)
          : String(j.requirements || '').toLowerCase().includes(q))
      );
    });
  }, [jobs, searchQuery]);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone) {
      alert('দয়া করে নাম ও মোবাইল নম্বর পূরণ করুন');
      return;
    }
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      setIsApplyModalOpen(false);
      setApplicantName('');
      setApplicantPhone('');
      setApplicantEducation('');
      setApplicantNote('');
      alert('আপনার আবেদনটি সফলভাবে জমা হয়েছে! নিয়োগদাতা শীঘ্রই আপনার সাথে যোগাযোগ করবেন।');
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-700/80 text-violet-200 text-xs font-bold mb-3 border border-violet-500/40">
            <Briefcase className="w-3.5 h-3.5" />
            <span>জামালপুর জেলা কর্মসংস্থান পোর্টাল</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            স্থানীয় চাকরির বিজ্ঞপ্তি ও ক্যারিয়ার সুযোগ
          </h1>
          <p className="text-xs sm:text-sm text-violet-100/90 mt-2">
            জামালপুর জেলার বিভিন্ন প্রতিষ্ঠান, এনজিও, হাসপাতাল, শোরুম ও ব্যবসায়িক প্রতিষ্ঠানে নতুন নিয়োগের তথ্য।
          </p>
        </div>

        <button
          onClick={() => setIsPostJobModalOpen(true)}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg transition shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>নিয়োগ বিজ্ঞপ্তি দিন (৳১৫০)</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            id="jobs-search-input"
            type="text"
            placeholder="চাকরির পদবী, কোম্পানি বা এলাকা দিয়ে খুঁজুন (যেমন: শিক্ষক, সেলস, একাউন্টেন্ট)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-violet-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            id={`job-card-${job.id}`}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-100 text-violet-800">
                    {job.type}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-1.5">{job.title}</h3>
                  <p className="text-xs font-semibold text-slate-600 flex items-center gap-1 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.company}</span>
                  </p>
                </div>
                <span className="text-xs font-extrabold text-violet-800 bg-violet-50 px-2.5 py-1 rounded-xl border border-violet-200/60 shrink-0">
                  {job.salary}
                </span>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-violet-600" />
                  <span>লোকেশন: <strong>{job.location}</strong></span>
                </div>
                <div className="text-slate-700 mt-1">
                  <strong>যোগ্যতা ও অভিজ্ঞতা:</strong> {job.requirements}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>আবেদনের শেষ তারিখ: {job.deadline}</span>
              </div>

              <button
                id={`apply-job-btn-${job.id}`}
                onClick={() => {
                  setSelectedJob(job);
                  setIsApplyModalOpen(true);
                }}
                className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-2xs"
              >
                আবেদন করুন
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Apply Modal */}
      {isApplyModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
            <div className="p-4 sm:p-5 bg-violet-800 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">চাকরিতে সরাসরি আবেদন</h3>
                <p className="text-xs text-violet-200">{selectedJob.title} — {selectedJob.company}</p>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="p-1 text-violet-200 hover:text-white rounded-lg hover:bg-violet-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="p-5 space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">আপনার পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="আপনার নাম"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                <input
                  type="tel"
                  required
                  placeholder="017xxxxxxxx"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">সর্বোচ্চ শিক্ষাগত যোগ্যতা *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: এইচএসসি / ডিগ্রি / বিএসসি"
                  value={applicantEducation}
                  onChange={(e) => setApplicantEducation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">পূর্ব অভিজ্ঞতা ও সংক্ষিপ্ত বিবরণ</label>
                <textarea
                  rows={2}
                  placeholder="আপনার কাজের অভিজ্ঞতা বা দক্ষতা সম্পর্কে লিখুন..."
                  value={applicantNote}
                  onChange={(e) => setApplicantNote(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 focus:bg-white"
                ></textarea>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-500">
                যোগাযোগের তথ্য: <strong>{selectedJob.contactPhone}</strong> ({selectedJob.contactEmail})
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={appliedSuccess}
                  className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold shadow-md cursor-pointer transition flex items-center gap-1.5"
                >
                  {appliedSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>জমা হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>আবেদন জমা দিন</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Monetization Modal for Job Listing */}
      <MonetizationModal
        isOpen={isPostJobModalOpen}
        onClose={() => setIsPostJobModalOpen(false)}
        defaultService="job_listing"
      />
    </div>
  );
};
