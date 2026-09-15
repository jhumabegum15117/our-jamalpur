import React from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownCircle,
  TrendingUp,
  DollarSign,
  Shield,
  CreditCard,
  Building2,
  Calendar,
  ChevronLeft,
  PieChart as PieChartIcon,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { storageService } from '../services/storageService';

interface Props {
  onBackToDashboard: () => void;
  onNavigateToWithdrawal: () => void;
  onNavigateToHistory: () => void;
}

export const AdminBalanceView: React.FC<Props> = ({
  onBackToDashboard,
  onNavigateToWithdrawal,
  onNavigateToHistory,
}) => {
  const financial = storageService.getFinancialOverview();
  const withdrawals = storageService.getWithdrawals();
  const logs = storageService.getEarningsLogs();

  const approvedWithdrawals = withdrawals.filter((w) => w.status === 'approved');
  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'pending');
  const pendingWithdrawalSum = pendingWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer"
            title="ড্যাশবোর্ডে ফিরে যান"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md">
                ব্যালেন্স বুক
              </span>
              <span className="text-xs text-slate-400 font-medium">ক্যাশ ফ্লো স্ট্যাটাস</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              অ্যাপের আর্থিক স্থিতি ও অবশিষ্ট ব্যালেন্স
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToWithdrawal}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <ArrowDownCircle className="w-4 h-4" />
            <span>টাকা উত্তোলন (উইথড্রয়াল) করুন</span>
          </button>
        </div>
      </div>

      {/* Main Balance Hero Ledger Card */}
      <div className="bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-8 border border-purple-500/30 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-800/60 border border-purple-400/40 text-xs font-bold text-purple-200 mb-3">
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>প্রাইভেট রিজার্ভ লেজার</span>
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              বর্তমান উত্তোলনযোগ্য নিট ব্যালেন্স
            </h3>
            <div className="text-4xl sm:text-5xl font-black text-amber-300 mt-2 tracking-tight">
              ৳ {financial.currentBalance.toLocaleString('bn-BD')}
            </div>
            <p className="text-xs text-slate-300 mt-2 max-w-md leading-relaxed">
              আপনার প্ল্যাটফর্মের মোট সংগৃহীত আয় থেকে এ যাবৎ সফলভাবে উত্তোলিত টাকার পর এই পরিমাণ টাকা আপনার হিসাবে অবশিষ্ট রয়েছে।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-xs">
              <span className="text-slate-400 block mb-1">মোট অর্জিত আয়:</span>
              <span className="font-extrabold text-emerald-400 text-lg">
                + ৳ {financial.totalEarned.toLocaleString('bn-BD')}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-xs">
              <span className="text-slate-400 block mb-1">মোট উত্তোলন সম্পন্ন:</span>
              <span className="font-extrabold text-indigo-300 text-lg">
                - ৳ {financial.totalWithdrawn.toLocaleString('bn-BD')}
              </span>
            </div>
          </div>
        </div>

        {pendingWithdrawalSum > 0 && (
          <div className="mt-6 pt-4 border-t border-purple-800/60 flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                বর্তমানে <strong>৳ {pendingWithdrawalSum.toLocaleString('bn-BD')}</strong> টাকার উইথড্রয়াল রিকোয়েস্ট প্রক্রিয়াকরণের অপেক্ষায় রয়েছে।
              </span>
            </div>
            <button
              onClick={onNavigateToWithdrawal}
              className="font-bold underline hover:text-white shrink-0 ml-2"
            >
              রিকোয়েস্ট দেখুন
            </button>
          </div>
        )}
      </div>

      {/* Financial Health Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Income Sources Summary */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              আয়ের খাতসমূহ
            </span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="space-y-2 text-xs">
            {Object.entries(financial.sourceBreakdown).map(([key, item]) => (
              <div key={key} className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                <span className="font-bold text-slate-900 dark:text-white">৳ {item.amount.toLocaleString('bn-BD')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Withdrawal Methods Summary */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              উত্তোলনের মাধ্যম
            </span>
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <div className="space-y-2 text-xs">
            {['bkash', 'nagad', 'rocket', 'bank'].map((method) => {
              const count = approvedWithdrawals.filter((w) => w.paymentMethod === method).length;
              const sum = approvedWithdrawals
                .filter((w) => w.paymentMethod === method)
                .reduce((acc, curr) => acc + (curr.amount || 0), 0);
              const label =
                method === 'bkash'
                  ? 'বিকাশ'
                  : method === 'nagad'
                  ? 'নগদ'
                  : method === 'rocket'
                  ? 'রকেট'
                  : 'ব্যাংক ট্রান্সফার';
              return (
                <div key={method} className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <span className="text-slate-600 dark:text-slate-300">
                    {label} ({count})
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">৳ {sum.toLocaleString('bn-BD')}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit & Trust */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                নিরাপত্তা ও নিরীক্ষা
              </span>
              <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <Shield className="w-4 h-4" />
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              সমস্ত ট্রানজেকশন আইডি এবং প্রত্যাহারের প্রমাণ Firestore এবং লোকাল স্টোরেজে এনক্রিপ্টেড ব্যাকআপ হিসেবে সংরক্ষিত থাকে।
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">স্ট্যাটাস:</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              ব্যালেন্স নিরীক্ষিত
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
