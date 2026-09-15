import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  PieChart as PieChartIcon,
  Calendar,
  Wallet,
  ArrowDownCircle,
  PlusCircle,
  Sparkles,
  Shield,
  Layers,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { storageService } from '../services/storageService';
import { EarningsLog } from '../types';

interface Props {
  onNavigateToHistory: () => void;
  onNavigateToBalance: () => void;
  onNavigateToWithdrawal: () => void;
  onRefresh: () => void;
}

const COLORS = ['#10B981', '#06B6D4', '#8B5CF6', '#F59E0B', '#EC4899', '#64748B'];

export const AdminEarningsDashboardView: React.FC<Props> = ({
  onNavigateToHistory,
  onNavigateToBalance,
  onNavigateToWithdrawal,
  onRefresh,
}) => {
  const financial = storageService.getFinancialOverview();
  const logs = storageService.getEarningsLogs();
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week'>('all');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Form for manual entry
  const [source, setSource] = useState<'product_boost' | 'banner_ad' | 'doctor_featured' | 'business_listing' | 'other'>('banner_ad');
  const [sourceTitle, setSourceTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'bank'>('bkash');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [note, setNote] = useState('');

  // Daily stats progression
  const dailyData = [
    { day: 'শনিবার', date: '০৭ মার্চ', earnings: 450, count: 2 },
    { day: 'রবিবার', date: '০৮ মার্চ', earnings: 950, count: 3 },
    { day: 'সোমবার', date: '০৯ মার্চ', earnings: 300, count: 1 },
    { day: 'মঙ্গলবার', date: '১০ মার্চ', earnings: 600, count: 2 },
    { day: 'বুধবার', date: '১১ মার্চ', earnings: 550, count: 2 },
    { day: 'বৃহস্পতিবার', date: '১২ মার্চ', earnings: 800, count: 3 },
    { day: 'আজ', date: '১৩ মার্চ', earnings: financial.totalEarned > 1600 ? 650 : 350, count: 2 },
  ];

  // Pie chart data by sources
  const pieData = Object.entries(financial.sourceBreakdown)
    .filter(([_, item]) => item.amount > 0)
    .map(([key, item]) => ({
      name: item.label,
      value: item.amount,
      count: item.count,
    }));

  const fallbackPieData = [
    { name: 'ব্যানার বিজ্ঞাপন', value: 1500 },
    { name: 'প্রোডাক্ট বুস্ট', value: 500 },
    { name: 'ডাক্তার প্রোফাইল স্পন্সর', value: 300 },
    { name: 'বিজনেস লিস্টিং', value: 200 },
  ];

  const chartSourceData = pieData.length > 0 ? pieData : fallbackPieData;

  const handleCreateManualEarnings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      alert('সঠিক টাকার অংক লিখুন!');
      return;
    }

    storageService.addEarningsLog({
      source,
      sourceTitle: sourceTitle.trim() || (source === 'banner_ad' ? 'ব্যানার বিজ্ঞাপন আয়' : 'প্ল্যাটফর্ম সার্ভিস চার্জ'),
      amount: Number(amount),
      paymentMethod,
      senderNumber: senderNumber.trim() || 'ক্যাশ / অফলাইন',
      trxId: trxId.trim() || `TRX-MANUAL-${Math.floor(10000 + Math.random() * 90000)}`,
      note: note.trim() || 'মালিকের ম্যানুয়াল আয় লগ',
      status: 'received',
    });

    setIsManualModalOpen(false);
    setAmount('');
    setSourceTitle('');
    setSenderNumber('');
    setTrxId('');
    setNote('');
    alert('আয়ের তথ্য সফলভাবে যোগ করা হয়েছে!');
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* Privacy Notice Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/40 rounded-3xl p-5 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0 shadow-inner">
            <Shield className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-purple-300 bg-purple-900/80 px-2 py-0.5 rounded-full border border-purple-700">
                গোপনীয় ড্যাশবোর্ড
              </span>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                শুধুমাত্র অ্যাপ মালিক ও অ্যাডমিনদের জন্য
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1">প্ল্যাটফর্ম আয় ট্র্যাকিং ও ফান্ড ব্যবস্থাপনা</h2>
            <p className="text-xs text-purple-200/80 mt-0.5">
              ব্যানার বিজ্ঞাপন, প্রোডাক্ট বুস্ট, স্পনসর ও অন্যান্য সকল আয়ের বিস্তারিত হিসাব।
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>নতুন আয় যোগ করুন</span>
          </button>

          <button
            onClick={onNavigateToWithdrawal}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <ArrowDownCircle className="w-4 h-4" />
            <span>উইথড্রয়াল তুলুন</span>
          </button>
        </div>
      </div>

      {/* Top 3 Summary Cards: Total Income, Total Withdrawn, Current Balance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Earned Card */}
        <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 rounded-3xl p-6 border border-emerald-500/40 text-white shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
              সর্বমোট প্ল্যাটফর্ম আয়
            </span>
            <div className="p-2.5 bg-emerald-500/20 rounded-2xl text-emerald-300 border border-emerald-500/30">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black mt-3">
            ৳ {financial.totalEarned.toLocaleString('bn-BD')}
          </div>
          <p className="text-xs text-emerald-200/80 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>বিজ্ঞাপন, বুস্ট ও কমিশন থেকে মোট আয়</span>
          </p>
          <div className="mt-4 pt-3 border-t border-emerald-800/50 flex items-center justify-between text-xs">
            <span className="text-emerald-300 font-medium">মোট ট্রানজেকশন: {financial.totalTransactions} টি</span>
            <button
              onClick={onNavigateToHistory}
              className="text-white hover:text-emerald-300 font-bold flex items-center gap-0.5 cursor-pointer"
            >
              <span>হিস্ট্রি দেখুন</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Total Withdrawn Card */}
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 rounded-3xl p-6 border border-indigo-500/40 text-white shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300">
              মোট উইথড্রয়াল (উত্তোলন)
            </span>
            <div className="p-2.5 bg-indigo-500/20 rounded-2xl text-indigo-300 border border-indigo-500/30">
              <ArrowDownCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black mt-3">
            ৳ {financial.totalWithdrawn.toLocaleString('bn-BD')}
          </div>
          <p className="text-xs text-indigo-200/80 mt-1 flex items-center gap-1">
            <span>বিকাশ, নগদ ও ব্যাংকে স্থানান্তরিত</span>
          </p>
          <div className="mt-4 pt-3 border-t border-indigo-800/50 flex items-center justify-between text-xs">
            <span className="text-indigo-300 font-medium">উইথড্রয়াল রেকর্ড: {financial.withdrawalsCount} টি</span>
            <button
              onClick={onNavigateToWithdrawal}
              className="text-white hover:text-indigo-300 font-bold flex items-center gap-0.5 cursor-pointer"
            >
              <span>উইথড্রয়াল প্যানেল</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Current Available Balance Card */}
        <div className="bg-gradient-to-br from-purple-900 via-slate-900 to-slate-950 rounded-3xl p-6 border border-purple-500/40 text-white shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-300">
              বর্তমান ব্যালেন্স (হাতে আছে)
            </span>
            <div className="p-2.5 bg-purple-500/20 rounded-2xl text-purple-300 border border-purple-500/30">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black mt-3 text-amber-300">
            ৳ {financial.currentBalance.toLocaleString('bn-BD')}
          </div>
          <p className="text-xs text-purple-200/80 mt-1">
            মোট আয় থেকে মোট উত্তোলনের অবশিষ্ট তহবিল
          </p>
          <div className="mt-4 pt-3 border-t border-purple-800/50 flex items-center justify-between text-xs">
            <span className="text-purple-300 font-medium">উত্তোলনযোগ্য ব্যালেন্স</span>
            <button
              onClick={onNavigateToBalance}
              className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-0.5 cursor-pointer"
            >
              <span>ব্যালেন্স হিসাব</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Progression Bar Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>দৈনিক ও সাপ্তাহিক আয়ের ট্রেন্ড</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                বিগত ৭ দিনের আয়ের গ্রাফ ও দৈনিক লেনদেন বিশ্লেষণ
              </p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setTimeFilter('all')}
                className={`px-3 py-1 rounded-lg transition ${
                  timeFilter === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                বিগত ৭ দিন
              </button>
              <button
                onClick={() => setTimeFilter('month')}
                className={`px-3 py-1 rounded-lg transition ${
                  timeFilter === 'month'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                চলতি মাস
              </button>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '16px',
                    border: '1px solid #334155',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`৳ ${Number(value).toLocaleString('bn-BD')}`, 'আয়']}
                  labelFormatter={(label, payload) => {
                    const item = payload?.[0]?.payload;
                    return item ? `${item.date} (${item.day})` : label;
                  }}
                />
                <Bar dataKey="earnings" fill="#10B981" radius={[8, 8, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Breakdown Pie Chart (1 Col) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>কোথা থেকে আয় হচ্ছে</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              উৎস অনুযায়ী আয়ের শতাংশ ও পরিমাণ
            </p>

            <div className="h-48 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartSourceData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => [`৳ ${Number(val).toLocaleString('bn-BD')}`, 'আয়']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 mt-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            {chartSourceData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  ৳ {item.value.toLocaleString('bn-BD')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Earnings Mini-Table & Quick Navigation */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              সাম্প্রতিক আয়ের রেকর্ড
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              সর্বশেষ প্রাপ্ত পেমেন্ট ও ট্রানজেকশন তালিকা
            </p>
          </div>
          <button
            onClick={onNavigateToHistory}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1 cursor-pointer"
          >
            <span>সম্পূর্ণ হিস্ট্রি ও ফিল্টার ({logs.length}) →</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {logs.slice(0, 5).map((log) => (
            <div key={log.id} className="py-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                  ৳
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    {log.sourceTitle || log.note || 'প্ল্যাটফর্ম আয়'}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {log.dateBn || log.date} • {log.paymentMethod?.toUpperCase()} (Trx: {log.trxId || 'N/A'})
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm block">
                  + ৳ {log.amount.toLocaleString('bn-BD')}
                </span>
                <span className="text-[10px] text-slate-400">জমা হয়েছে</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Manual Income Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
              নতুন আয় রেকর্ড যোগ করুন
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              অফলাইন ক্যাশ বা সরাসরি প্রাপ্ত বিজ্ঞাপন পেমেন্ট হিসাব বইতে অন্তর্ভুক্ত করুন
            </p>

            <form onSubmit={handleCreateManualEarnings} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  আয়ের খাত / উৎস
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="banner_ad">ব্যানার বিজ্ঞাপন (Banner Ad)</option>
                  <option value="product_boost">প্রোডাক্ট বুস্টিং ফি (Product Boost)</option>
                  <option value="doctor_featured">ডাক্তার প্রোফাইল ফিচার্ড ফি</option>
                  <option value="business_listing">বিজনেস ডিরেক্টরি স্পনসর</option>
                  <option value="other">অন্যান্য সেবা / কমিশন</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  বিবরণ / স্পন্সর শিরোনাম
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: আল-মদিনা ফার্নিচার ব্যানার বিজ্ঞাপন"
                  value={sourceTitle}
                  onChange={(e) => setSourceTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    টাকার পরিমাণ (৳)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="যেমন: 500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    পেমেন্ট মেথড
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="bkash">বিকাশ (bKash)</option>
                    <option value="nagad">নগদ (Nagad)</option>
                    <option value="rocket">রকেট (Rocket)</option>
                    <option value="bank">ব্যাংক একাউন্ট</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    প্রেরকের নম্বর / নাম (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    placeholder="01712..."
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    ট্রানজেকশন আইডি (TrxID)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: 9K8J7H6G5F"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  নোট বা মন্তব্য
                </label>
                <input
                  type="text"
                  placeholder="বিজ্ঞাপন অনুমোদনের পর সরাসরি ক্যাশ বা ট্রান্সফার গৃহীত"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-md"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
