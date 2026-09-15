import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  Calendar,
  DollarSign,
  Trash2,
  FileSpreadsheet,
  ArrowUpRight,
  Shield,
  Layers,
  ChevronLeft,
  CheckCircle2,
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { EarningsLog } from '../types';

interface Props {
  onBackToDashboard: () => void;
  onRefresh: () => void;
}

export const AdminEarningsHistoryView: React.FC<Props> = ({
  onBackToDashboard,
  onRefresh,
}) => {
  const [logs, setLogs] = useState<EarningsLog[]>(storageService.getEarningsLogs());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      // Search text filter
      const matchesSearch =
        searchTerm === '' ||
        (item.sourceTitle && item.sourceTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.note && item.note.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.trxId && item.trxId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.senderNumber && item.senderNumber.includes(searchTerm));

      // Source filter
      const matchesSource =
        selectedSource === 'all' || item.source === selectedSource;

      // Method filter
      const matchesMethod =
        selectedMethod === 'all' || item.paymentMethod === selectedMethod;

      // Date range filter
      let matchesDate = true;
      if (startDate && item.date) {
        matchesDate = matchesDate && item.date >= startDate;
      }
      if (endDate && item.date) {
        matchesDate = matchesDate && item.date <= endDate;
      }

      return matchesSearch && matchesSource && matchesMethod && matchesDate;
    });
  }, [logs, searchTerm, selectedSource, selectedMethod, startDate, endDate]);

  const totalFilteredAmount = useMemo(() => {
    return filteredLogs.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [filteredLogs]);

  const handleDeleteLog = (id: string) => {
    if (confirm('আপনি কি এই আয়ের এন্ট্রিটি মুছে ফেলতে চান?')) {
      storageService.deleteEarningsLog(id);
      const updated = storageService.getEarningsLogs();
      setLogs(updated);
      onRefresh();
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Source', 'Title', 'Amount', 'Method', 'Sender', 'TrxID', 'Note'];
    const rows = filteredLogs.map((log) => [
      log.id,
      log.date || log.createdAt || '',
      log.source || '',
      `"${(log.sourceTitle || '').replace(/"/g, '""')}"`,
      log.amount,
      log.paymentMethod || '',
      log.senderNumber || '',
      log.trxId || '',
      `"${(log.note || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `OurJamalpur-Earnings-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* Top Header */}
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
                অ্যাডমিন লগ
              </span>
              <span className="text-xs text-slate-400 font-medium">ব্যক্তিগত খতিয়ান</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              আয়ের বিস্তারিত খতিয়ান ও ট্রানজেকশন হিস্ট্রি
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>CSV রিপোর্ট ডাউনলোড</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="শিরোনাম, TrxID বা মোবাইল নম্বর দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Source Filter */}
          <div>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="all">সব আয়ের উৎস</option>
              <option value="banner_ad">ব্যানার বিজ্ঞাপন</option>
              <option value="product_boost">প্রোডাক্ট বুস্ট</option>
              <option value="doctor_featured">ডাক্তার স্পন্সর</option>
              <option value="business_listing">বিজনেস ডিরেক্টরি</option>
              <option value="other">অন্যান্য</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="all">সব পেমেন্ট মাধ্যম</option>
              <option value="bkash">বিকাশ (bKash)</option>
              <option value="nagad">নগদ (Nagad)</option>
              <option value="rocket">রকেট (Rocket)</option>
              <option value="bank">ব্যাংক একাউন্ট</option>
            </select>
          </div>

          {/* Start & End Date Inputs */}
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-1/2 px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-900 dark:text-white"
              title="শুরুর তারিখ"
            />
            <span className="text-slate-400 text-xs">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-1/2 px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-900 dark:text-white"
              title="শেষ তারিখ"
            />
          </div>
        </div>

        {/* Filter Summary Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <span>
            প্রদর্শিত হচ্ছে: <strong>{filteredLogs.length}</strong> টি এন্ট্রি
          </span>
          <span className="text-slate-800 dark:text-slate-200 font-bold">
            ফিল্টারকৃত মোট আয়: <span className="text-emerald-600 dark:text-emerald-400 font-black">৳ {totalFilteredAmount.toLocaleString('bn-BD')}</span>
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-4">তারিখ</th>
                <th className="px-5 py-4">উৎস ও শিরোনাম</th>
                <th className="px-5 py-4">মাধ্যম ও TrxID</th>
                <th className="px-5 py-4">প্রেরক / রেফারেন্স</th>
                <th className="px-5 py-4 text-right">পরিমাণ (টাকা)</th>
                <th className="px-5 py-4 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    কোনো লেনদেনের রেকর্ড পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition"
                  >
                    {/* Date */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {log.dateBn || log.date || 'আজ'}
                      </div>
                      <div className="text-[10px] text-slate-400">{log.date || ''}</div>
                    </td>

                    {/* Source & Title */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {log.sourceTitle || log.note || 'প্ল্যাটফর্ম সার্ভিস'}
                      </div>
                      <div className="text-[11px] text-purple-600 dark:text-purple-400 capitalize">
                        {log.source === 'banner_ad'
                          ? 'ব্যানার বিজ্ঞাপন'
                          : log.source === 'product_boost'
                          ? 'পণ্য বুস্টিং'
                          : log.source === 'doctor_featured'
                          ? 'ডাক্তার স্পন্সর'
                          : log.source === 'business_listing'
                          ? 'বিজনেস লিস্টিং'
                          : 'অন্যান্য'}
                      </div>
                    </td>

                    {/* Method & Trx */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {log.paymentMethod || 'ক্যাশ'}
                      </span>
                      <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {log.trxId || 'N/A'}
                      </div>
                    </td>

                    {/* Sender / Reference */}
                    <td className="px-5 py-4">
                      <div className="text-slate-800 dark:text-slate-200">
                        {log.senderNumber || 'সরাসরি জমা'}
                      </div>
                      {log.note && (
                        <div className="text-[10px] text-slate-400 truncate max-w-xs" title={log.note}>
                          {log.note}
                        </div>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                        + ৳ {log.amount.toLocaleString('bn-BD')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                        title="রেকর্ড মুছুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
