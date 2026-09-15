import React, { useState } from 'react';
import {
  ArrowDownCircle,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  CreditCard,
  Building2,
  Trash2,
  AlertCircle,
  Shield,
  Send,
  HelpCircle,
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { OwnerWithdrawal, WithdrawalStatus } from '../types';

interface Props {
  onRefresh: () => void;
}

export const AdminWithdrawalView: React.FC<Props> = ({ onRefresh }) => {
  const [withdrawals, setWithdrawals] = useState<OwnerWithdrawal[]>(storageService.getWithdrawals());
  const financial = storageService.getFinancialOverview();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Form states for creating a withdrawal request
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'bank'>('bkash');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState<'personal' | 'agent' | 'bank_account'>('personal');
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [note, setNote] = useState('');

  // Form states for approving with TrxID
  const [selectedWithdrawalId, setSelectedWithdrawalId] = useState<string | null>(null);
  const [actionTrxId, setActionTrxId] = useState('');
  const [adminNote, setAdminNote] = useState('');

  const handleCreateWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(amount);
    if (!val || val <= 0) {
      alert('সঠিক উত্তোলনের টাকার পরিমাণ দিন!');
      return;
    }

    if (val > financial.currentBalance) {
      if (
        !confirm(
          `আপনার বর্তমান অবশিষ্ট ব্যালেন্স ৳ ${financial.currentBalance.toLocaleString('bn-BD')}। আপনি কি অতিরিক্ত উইথড্রয়াল রিকোয়েস্ট করতে চান?`
        )
      ) {
        return;
      }
    }

    if (!accountNumber.trim()) {
      alert('একাউন্ট নম্বর প্রদান করুন!');
      return;
    }

    storageService.createWithdrawalRequest({
      amount: val,
      paymentMethod,
      accountNumber: accountNumber.trim(),
      accountType,
      bankName: paymentMethod === 'bank' ? bankName.trim() : undefined,
      branchName: paymentMethod === 'bank' ? branchName.trim() : undefined,
      note: note.trim() || undefined,
    });

    setIsRequestModalOpen(false);
    setAmount('');
    setAccountNumber('');
    setBankName('');
    setBranchName('');
    setNote('');
    setWithdrawals(storageService.getWithdrawals());
    alert('উইথড্রয়াল আবেদন সফলভাবে তৈরি হয়েছে!');
    onRefresh();
  };

  const handleUpdateStatus = (id: string, status: WithdrawalStatus) => {
    storageService.updateWithdrawalStatus(
      id,
      status,
      actionTrxId.trim() || undefined,
      adminNote.trim() || undefined
    );

    setSelectedWithdrawalId(null);
    setActionTrxId('');
    setAdminNote('');
    setWithdrawals(storageService.getWithdrawals());
    alert(`উইথড্রয়াল রিকোয়েস্ট ${status === 'approved' ? 'অনুমোদিত (Approved)' : 'প্রত্যাখ্যাত (Rejected)'} হয়েছে!`);
    onRefresh();
  };

  const handleDelete = (id: string) => {
    if (confirm('আপনি কি এই উইথড্রয়াল রেকর্ডটি মুছে ফেলতে চান?')) {
      storageService.deleteWithdrawal(id);
      setWithdrawals(storageService.getWithdrawals());
      onRefresh();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* Overview & Quick Balance */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 border border-indigo-500/40 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/60 border border-indigo-400/40 text-xs font-bold text-indigo-200 mb-2">
            <ArrowDownCircle className="w-3.5 h-3.5" />
            <span>উইথড্রয়াল ম্যানেজমেন্ট</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            মালিকের ব্যাংক ও মোবাইল ব্যাংকিং উত্তোলন
          </h2>
          <p className="text-xs text-indigo-200/80 mt-1">
            আয়ের টাকা ব্যক্তিগত বিকাশ, নগদ, রকেট অথবা ব্যাংক একাউন্টে ট্রান্সফার রিকোয়েস্ট ও স্ট্যাটাস আপডেট।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-right">
            <span className="text-[10px] text-indigo-200 block">বর্তমান ব্যালেন্স</span>
            <span className="text-lg font-black text-amber-300">
              ৳ {financial.currentBalance.toLocaleString('bn-BD')}
            </span>
          </div>

          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>নতুন উইথড্রয়াল রিকোয়েস্ট</span>
          </button>
        </div>
      </div>

      {/* Withdrawals List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              সকল উইথড্রয়াল রিকোয়েস্ট তালিকা ({withdrawals.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              পেন্ডিং, অ্যাপ্রুভড এবং সম্পন্ন লেনদেনের হিসাব
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-4">আবেদনের সময়</th>
                <th className="px-5 py-4">মাধ্যম ও একাউন্ট</th>
                <th className="px-5 py-4">পরিমাণ (টাকা)</th>
                <th className="px-5 py-4">স্ট্যাটাস</th>
                <th className="px-5 py-4">TrxID ও নোট</th>
                <th className="px-5 py-4 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    কোনো উইথড্রয়াল রিকোয়েস্ট নেই।
                  </td>
                </tr>
              ) : (
                withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                    {/* Time */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {w.requestedAtBn || w.createdAt || 'আজ'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {w.processedAtBn ? `সম্পন্ন: ${w.processedAtBn}` : 'অপেক্ষমান'}
                      </div>
                    </td>

                    {/* Method & Account */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white capitalize">
                        <span>
                          {w.paymentMethod === 'bkash'
                            ? 'বিকাশ'
                            : w.paymentMethod === 'nagad'
                            ? 'নগদ'
                            : w.paymentMethod === 'rocket'
                            ? 'রকেট'
                            : 'ব্যাংক'}
                        </span>
                        {w.accountType && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                            {w.accountType}
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-slate-600 dark:text-slate-300 font-semibold mt-0.5">
                        {w.accountNumber}
                      </div>
                      {w.bankName && (
                        <div className="text-[10px] text-slate-400">
                          {w.bankName} {w.branchName ? `(${w.branchName})` : ''}
                        </div>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-black text-slate-900 dark:text-white text-sm">
                        ৳ {w.amount.toLocaleString('bn-BD')}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {w.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>অনুমোদিত / সম্পন্ন</span>
                        </span>
                      ) : w.status === 'rejected' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          <span>প্রত্যাখ্যাত</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>পেন্ডিং</span>
                        </span>
                      )}
                    </td>

                    {/* TrxID / Note */}
                    <td className="px-5 py-4">
                      {w.trxId ? (
                        <div className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                          Trx: {w.trxId}
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400 italic">এখনো ট্রানজেকশন হয়নি</div>
                      )}
                      {w.adminNote && (
                        <div className="text-[10px] text-slate-500 mt-0.5">নোট: {w.adminNote}</div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {w.status === 'pending' && (
                          <button
                            onClick={() => {
                              setSelectedWithdrawalId(w.id);
                              setActionTrxId('');
                              setAdminNote('');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
                          >
                            অনুমোদন দিন
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(w.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                          title="রেকর্ড মুছুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Withdrawal Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
              উইথড্রয়াল (টাকা উত্তোলন) আবেদন
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              উপলব্ধ ব্যালেন্স: <strong>৳ {financial.currentBalance.toLocaleString('bn-BD')}</strong>
            </p>

            <form onSubmit={handleCreateWithdrawal} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  উত্তোলনের পরিমাণ (৳)
                </label>
                <input
                  type="number"
                  required
                  placeholder="যেমন: 1000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    পেমেন্ট মাধ্যম
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="bkash">বিকাশ (bKash)</option>
                    <option value="nagad">নগদ (Nagad)</option>
                    <option value="rocket">রকেট (Rocket)</option>
                    <option value="bank">ব্যাংক একাউন্ট</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    একাউন্ট ধরন
                  </label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="personal">ব্যক্তিগত (Personal)</option>
                    <option value="agent">এজেন্ট (Agent)</option>
                    <option value="bank_account">ব্যাংক একাউন্ট</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  একাউন্ট / মোবাইল নম্বর
                </label>
                <input
                  type="text"
                  required
                  placeholder="01712345678 বা ব্যাংক হিসাব নম্বর"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {paymentMethod === 'bank' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      ব্যাংকের নাম
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: ইসলামী ব্যাংক"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      শাখা (Branch)
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: জামালপুর শাখা"
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  নোট বা কারণ (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: মার্চ মাসের প্ল্যাটফর্ম আয় উত্তোলন"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-md"
                >
                  রিকোয়েস্ট পাঠান
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {selectedWithdrawalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
              উইথড্রয়াল অনুমোদন ও ট্রানজেকশন এন্ট্রি
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              টাকা পাঠানোর পর বিকাশ/নগদ/ব্যাংকের ট্রানজেকশন আইডি লিখে সম্পন্ন করুন
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  ট্রানজেকশন আইডি (TrxID)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: BL78945612"
                  value={actionTrxId}
                  onChange={(e) => setActionTrxId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  অ্যাডমিন মন্তব্য / নোট
                </label>
                <input
                  type="text"
                  placeholder="সরাসরি পেইড"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedWithdrawalId, 'rejected')}
                  className="px-3.5 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold cursor-pointer"
                >
                  প্রত্যাখ্যান করুন
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedWithdrawalId(null)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedWithdrawalId, 'approved')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-md"
                  >
                    অনুমোদন সম্পন্ন করুন
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
