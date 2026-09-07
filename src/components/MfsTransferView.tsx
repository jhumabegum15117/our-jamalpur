import React, { useState } from 'react';
import {
  ArrowRightLeft,
  Smartphone,
  CreditCard,
  Building2,
  ShieldCheck,
  Zap,
  HelpCircle,
  Clock,
  CheckCircle2,
  Copy,
  ExternalLink,
  PhoneCall,
  FileText,
  AlertCircle,
  Sparkles,
  Search,
  RotateCcw,
  Download,
  Share2,
  Info,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { MfsProviderId, MfsProvider, MfsTransferRecord } from '../types';
import { initialMfsProviders } from '../data/initialData';
import { storageService } from '../services/storageService';

export const MfsTransferView: React.FC = () => {
  const providers = initialMfsProviders;

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'transfer' | 'guides' | 'binimoy' | 'history' | 'helpline'>('transfer');

  // Transfer Form State
  const [fromProvider, setFromProvider] = useState<MfsProviderId>('bkash');
  const [toProvider, setToProvider] = useState<MfsProviderId>('rocket');
  const [senderNumber, setSenderNumber] = useState('');
  const [receiverNumber, setReceiverNumber] = useState('');
  const [amount, setAmount] = useState<number | ''>(1000);
  const [reference, setReference] = useState('');
  const [protocol, setProtocol] = useState<'Binimoy (IDTP)' | 'Direct MFS Interoperability' | 'Bank IBFT / NPSB' | 'Cellfin Bridge'>('Binimoy (IDTP)');

  // Receipt Modal State
  const [latestReceipt, setLatestReceipt] = useState<MfsTransferRecord | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  // History State
  const [historyList, setHistoryList] = useState<MfsTransferRecord[]>(storageService.getMfsTransfers());

  // Selected guide expansion
  const [selectedGuideId, setSelectedGuideId] = useState<string>('bkash-to-rocket');

  // Quick Amount chips
  const quickAmounts = [500, 1000, 2000, 5000, 10000, 20000];

  const sourceObj = providers.find((p) => p.id === fromProvider) || providers[0];
  const targetObj = providers.find((p) => p.id === toProvider) || providers[1];

  // Calculate Fee
  const numAmount = typeof amount === 'number' ? amount : 0;
  const isTargetBank = toProvider === 'bank';
  const feeRate = isTargetBank ? sourceObj.feePercentBank : sourceObj.feePercentMfs;
  const fixedFee = isTargetBank ? sourceObj.feeFixedBank : sourceObj.feeFixedMfs;
  const calculatedCharge = numAmount > 0 ? (numAmount * feeRate) / 100 + fixedFee : 0;
  const totalDebited = numAmount + calculatedCharge;
  const netCredited = numAmount;

  const handleSwap = () => {
    const temp = fromProvider;
    setFromProvider(toProvider);
    setToProvider(temp);
  };

  const handleInitiateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderNumber || !receiverNumber) {
      alert('দয়া করে প্রেরক ও প্রাপকের সঠিক মোবাইল বা একাউন্ট নম্বর লিখুন।');
      return;
    }
    if (!numAmount || numAmount < sourceObj.minTransfer) {
      alert(`ন্যূনতম লেনদেনের পরিমাণ ৳ ${sourceObj.minTransfer}`);
      return;
    }
    if (fromProvider === toProvider) {
      alert('অনুগ্রহ করে দুটি ভিন্ন MFS বা ব্যাংক নির্বাচন করুন।');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const record = storageService.addMfsTransfer({
        fromProvider,
        toProvider,
        senderNumber,
        receiverNumber,
        amount: numAmount,
        charge: Number(calculatedCharge.toFixed(2)),
        totalDebited: Number(totalDebited.toFixed(2)),
        netCredited: Number(netCredited.toFixed(2)),
        reference: reference || 'আন্তঃ MFS লেনদেন',
        protocol,
        status: 'Completed',
      });

      setHistoryList(storageService.getMfsTransfers());
      setLatestReceipt(record);
      setIsProcessing(false);
    }, 900);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-bold mb-3 border border-emerald-500/40">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>বাংলাদেশ ব্যাংক ও বিনিময় (Binimoy IDTP) সমর্থিত হাব</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black leading-tight">
            MFS আন্তঃ লেনদেন ও ফান্ড ট্রান্সফার
          </h1>
          <p className="text-xs sm:text-base text-emerald-100/90 mt-2 font-light leading-relaxed">
            বিকাশ, রকেট, নগদ, সেলফিন, উপায়, এমক্যাশ ও যেকোনো ব্যাংক অ্যাকাউন্টে তাৎক্ষণিক আন্তঃ লেনদেন, ফি হিসাব ও পূর্ণাঙ্গ গাইডলাইন।
          </p>

          <div className="flex flex-wrap gap-2.5 mt-5">
            <button
              onClick={() => setActiveTab('transfer')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'transfer'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>আন্তঃ লেনদেন পোর্টাল</span>
            </button>

            <button
              onClick={() => setActiveTab('guides')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'guides'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>ধাপে ধাপে ট্রান্সফার নিয়ম</span>
            </button>

            <button
              onClick={() => setActiveTab('binimoy')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'binimoy'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>বিনিময় (Binimoy) গাইড</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>ট্রান্সফার হিস্ট্রি ({historyList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('helpline')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'helpline'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              <span>MFS হেল্পলাইন</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Transfer Form & Route Calculator */}
      {activeTab === 'transfer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Transfer Simulator & Form */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-emerald-600" />
                  <span>MFS আন্তঃ ফান্ড ট্রান্সফার ক্যালকুলেটর ও রিকোয়েস্ট</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  একটি MFS ওয়ালেট থেকে অন্য MFS বা ব্যাংক একাউন্টে তাৎক্ষণিক লেনদেন করুন
                </p>
              </div>
            </div>

            <form onSubmit={handleInitiateTransfer} className="space-y-6">
              {/* Source & Destination Matrix Selector */}
              <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                {/* From MFS */}
                <div className="md:col-span-5 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    ১. যে MFS থেকে পাঠাবেন (From)
                  </label>
                  <select
                    value={fromProvider}
                    onChange={(e) => setFromProvider(e.target.value as MfsProviderId)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    {providers.map((p) => (
                      <option key={`from-${p.id}`} value={p.id}>
                        {p.bengaliName} ({p.name})
                      </option>
                    ))}
                  </select>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      প্রেরকের মোবাইল / ওয়ালেট নম্বর *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="যেমন: 017xxxxxxxx"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                    <span>ডায়াল কোড: <strong className="text-emerald-700">{sourceObj.ussd}</strong></span>
                    <span>হেল্পলাইন: <strong>{sourceObj.helpline}</strong></span>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="md:col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="w-10 h-10 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center justify-center transition shadow-xs cursor-pointer border border-emerald-300 transform active:scale-95"
                    title="প্রেরক ও প্রাপক অদলবদল করুন"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* To MFS */}
                <div className="md:col-span-5 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    ২. যেখানে টাকা পৌঁছাবে (To)
                  </label>
                  <select
                    value={toProvider}
                    onChange={(e) => setToProvider(e.target.value as MfsProviderId)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-sm text-slate-900 focus:outline-none focus:border-teal-500"
                  >
                    {providers.map((p) => (
                      <option key={`to-${p.id}`} value={p.id}>
                        {p.bengaliName} ({p.name})
                      </option>
                    ))}
                  </select>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      {toProvider === 'bank' ? 'প্রাপকের ব্যাংক একাউন্ট নম্বর *' : 'প্রাপকের MFS মোবাইল নম্বর *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={toProvider === 'bank' ? 'যেমন: ২০৫০১২৩৪৫৬৭৮৯০' : 'যেমন: 019xxxxxxxx'}
                      value={receiverNumber}
                      onChange={(e) => setReceiverNumber(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                    <span>ডায়াল কোড: <strong className="text-teal-700">{targetObj.ussd}</strong></span>
                    <span>হেল্পলাইন: <strong>{targetObj.helpline}</strong></span>
                  </div>
                </div>
              </div>

              {/* Amount & Quick Chips */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    ৩. টাকার পরিমাণ (Amount in ৳) *
                  </label>
                  <span className="text-[11px] text-slate-500">
                    দৈনিক সর্বোচ্চ লিমিট: ৳ {sourceObj.maxTransferDaily.toLocaleString('bn-BD')}
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg">৳</span>
                  <input
                    type="number"
                    min={sourceObj.minTransfer}
                    max={sourceObj.maxTransferDaily}
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-black text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                    placeholder="টাকার পরিমাণ লিখুন"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {quickAmounts.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setAmount(q)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        amount === q
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ৳ {q.toLocaleString('bn-BD')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transfer Protocol & Reference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ট্রান্সফার প্রোটোকল / মাধ্যম
                  </label>
                  <select
                    value={protocol}
                    onChange={(e) => setProtocol(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Binimoy (IDTP)">⚡ বিনিময় (Binimoy IDTP - অফিশিয়াল)</option>
                    <option value="Direct MFS Interoperability">📱 সরাসরি MFS অ্যাপ ইন্টারঅপারেবিলিটি</option>
                    <option value="Cellfin Bridge">🌿 সেলফিন ব্রিজ (Cellfin Bridge)</option>
                    <option value="Bank IBFT / NPSB">🏦 ব্যাংক IBFT / NPSB ট্রান্সফার</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    রেফারেন্স / লেনদেনের কারণ (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: ব্যবসা / পারিবারিক খরচ"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>লেনদেন প্রসেস ও রিসিট জেনারেট হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>
                        {sourceObj.bengaliName} থেকে {targetObj.bengaliName}-এ ফান্ড ট্রান্সফার করুন
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right: Live Fee & Breakdown Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>লাইভ ফি ও খরচ ক্যালকুলেশন</span>
                </span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                  বাংলাদেশ ব্যাংক রেট
                </span>
              </div>

              {/* Route Display */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 flex items-center justify-between gap-3">
                <div className="text-center flex-1">
                  <div className="text-xs text-slate-400">প্রেরক (Sender)</div>
                  <div className="text-sm font-extrabold text-emerald-300 mt-0.5">{sourceObj.bengaliName}</div>
                  <div className="text-[10px] text-slate-400">{sourceObj.ussd}</div>
                </div>

                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>

                <div className="text-center flex-1">
                  <div className="text-xs text-slate-400">প্রাপক (Receiver)</div>
                  <div className="text-sm font-extrabold text-teal-300 mt-0.5">{targetObj.bengaliName}</div>
                  <div className="text-[10px] text-slate-400">{targetObj.ussd}</div>
                </div>
              </div>

              {/* Financial Calculation breakdown */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>মূল ট্রান্সফার পরিমাণ:</span>
                  <span className="font-bold text-white text-sm">৳ {numAmount.toLocaleString('bn-BD')}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1">
                    <span>ইন্টারঅপারেবিলিটি সার্ভিস ফি ({feeRate}%):</span>
                  </span>
                  <span className="font-bold text-amber-400">৳ {calculatedCharge.toFixed(2)}</span>
                </div>

                <div className="border-t border-slate-800 pt-2.5 flex items-center justify-between text-slate-200">
                  <span className="font-bold">প্রেরকের মোট কর্তন (Total Debit):</span>
                  <span className="font-black text-rose-400 text-base">৳ {totalDebited.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-slate-200">
                  <span className="font-bold">প্রাপক নগদ পাবে (Net Credited):</span>
                  <span className="font-black text-emerald-400 text-base">৳ {netCredited.toLocaleString('bn-BD')}</span>
                </div>
              </div>

              <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/40 text-[11px] text-emerald-200/90 leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>বিনিময় (Binimoy IDTP) প্রোটোকলে সকল এমএফএস এবং ব্যাংকে ২৪ ঘণ্টা যেকোনো দিন তাৎক্ষণিক সেটেলমেন্ট হয়।</span>
              </div>

              {/* Deep Link Buttons to official apps */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  সরাসরি অফিসিয়াল অ্যাপে ওপেন করুন:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={sourceObj.appUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition text-center border border-slate-700"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{sourceObj.name} অ্যাপ</span>
                  </a>
                  <a
                    href={targetObj.appUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition text-center border border-slate-700"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                    <span>{targetObj.name} অ্যাপ</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Step-by-Step Inter-MFS Routing Guides */}
      {activeTab === 'guides' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>সকল MFS এ আন্তঃ লেনদেনের সহজ ধাপ ও নিয়মাবলী</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              বিকাশ টু রকেট, নগদ টু বিকাশ, সেলফিন টু MFS সহ সকল অপারেটরের অফিশিয়াল ট্রান্সফার নির্দেশিকা
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Guide Menu */}
            <div className="space-y-2">
              {[
                { id: 'bkash-to-rocket', title: 'বিকাশ থেকে রকেট (bKash to Rocket)', tag: 'জনপ্রিয়' },
                { id: 'bkash-to-nagad', title: 'বিকাশ থেকে নগদ (bKash to Nagad)', tag: 'Binimoy' },
                { id: 'nagad-to-bkash', title: 'নগদ থেকে বিকাশ বা রকেট (Nagad to bKash)', tag: '*167#' },
                { id: 'rocket-to-bkash', title: 'রকেট থেকে বিকাশ/নগদ (Rocket to bKash)', tag: '*322#' },
                { id: 'cellfin-to-mfs', title: 'সেলফিন থেকে যেকোনো MFS (Cellfin to All)', tag: 'IBBL' },
                { id: 'bank-to-mfs', title: 'ব্যাংক একাউন্ট থেকে MFS এ টাকা পাঠানো', tag: 'NPSB' },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGuideId(g.id)}
                  className={`w-full p-3.5 rounded-2xl text-left font-bold text-xs sm:text-sm transition flex items-center justify-between cursor-pointer border ${
                    selectedGuideId === g.id
                      ? 'bg-emerald-50 text-emerald-950 border-emerald-300 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="line-clamp-1">{g.title}</span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-slate-200 text-emerald-700 shrink-0 ml-2">
                    {g.tag}
                  </span>
                </button>
              ))}
            </div>

            {/* Guide Detail Box */}
            <div className="md:col-span-2 bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 space-y-4">
              {selectedGuideId === 'bkash-to-rocket' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-pink-100 text-pink-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      bKash ➔ Rocket
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900">
                      বিকাশ থেকে রকেটে টাকা পাঠানোর নিয়ম (২টি পদ্ধতি)
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="font-bold text-emerald-800 text-sm">পদ্ধতি ১: বিনিময় (Binimoy) এর মাধ্যমে (সবচেয়ে দ্রুত)</h4>
                      <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pl-1 leading-relaxed">
                        <li>বিকাশ অ্যাপ ওপেন করে <strong>"বিনিময়" (Binimoy)</strong> আইকনে ক্লিক করুন।</li>
                        <li><strong>"Direct Pay"</strong> অপশন সিলেক্ট করুন।</li>
                        <li>প্রাপকের রকেট বিনিময় VID লিখুন (যেমন: <code>019xxxxxxxx@rocket</code>)।</li>
                        <li>টাকার পরিমাণ এবং লেনদেনের উদ্দেশ্য লিখুন।</li>
                        <li>আপনার বিনিময় পিন (Binimoy PIN) দিয়ে কনফার্ম করুন। টাকা সাথে সাথে রকেটে চলে যাবে।</li>
                      </ol>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="font-bold text-purple-800 text-sm">পদ্ধতি ২: ডায়াল কোড (*247#) দিয়ে</h4>
                      <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pl-1 leading-relaxed">
                        <li>মোবাইলে ডায়াল করুন <code>*247#</code></li>
                        <li>মেনু থেকে <strong>"Binimoy"</strong> অপশন সিলেক্ট করুন।</li>
                        <li><strong>"Direct Pay"</strong> সিলেক্ট করে প্রাপকের রকেট VID দিন।</li>
                        <li>টাকার পরিমাণ ও রেফারেন্স দিয়ে পিন সাবমিট করুন।</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {selectedGuideId === 'bkash-to-nagad' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      bKash ➔ Nagad
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900">
                      বিকাশ থেকে নগদে টাকা পাঠানোর সহজ নিয়ম
                    </h3>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs sm:text-sm text-slate-700">
                    <ol className="list-decimal list-inside space-y-2 text-slate-600 pl-1 leading-relaxed">
                      <li>বিকাশ অ্যাপে লগইন করে <strong>"বিনিময়"</strong> মেনুতে যান।</li>
                      <li><strong>"Direct Pay"</strong> নির্বাচন করুন।</li>
                      <li>প্রাপকের নগদ বিনিময় ভার্চুয়াল আইডি (VID) লিখুন (যেমন: <code>017xxxxxxxx@nagad</code>)।</li>
                      <li>টাকার পরিমাণ দিন (সর্বনিম্ন ৳১০ থেকে সর্বোচ্চ ৳২৫,০০০ পর্যন্ত)।</li>
                      <li>আপনার বিকাশ পিন অথবা বিনিময় সিকিউরিটি পিন দিয়ে ট্যাপ করে ধরে রাখুন।</li>
                      <li>তাৎক্ষণিক নোটিফিকেশন ও এসএমএস পেয়ে যাবেন।</li>
                    </ol>
                  </div>
                </div>
              )}

              {selectedGuideId === 'nagad-to-bkash' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      Nagad ➔ bKash / Rocket
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900">
                      নগদ থেকে বিকাশ বা রকেটে টাকা পাঠানোর নিয়ম
                    </h3>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs sm:text-sm text-slate-700">
                    <ol className="list-decimal list-inside space-y-2 text-slate-600 pl-1 leading-relaxed">
                      <li>নগদ অ্যাপ ওপেন করুন অথবা ডায়াল করুন <code>*167#</code></li>
                      <li>মেনু থেকে <strong>"বিনিময়" (Binimoy / Interoperability)</strong> সিলেক্ট করুন।</li>
                      <li><strong>"Send Money to other MFS"</strong> বা <strong>"Direct Pay"</strong> সিলেক্ট করুন।</li>
                      <li>প্রাপকের বিকাশ আইডি (যেমন: <code>018xxxxxxxx@bkash</code>) লিখুন।</li>
                      <li>টাকার পরিমাণ ও রেফারেন্স দিন।</li>
                      <li>আপনার নগদ পিন প্রদান করে ট্রানজেকশন সফল করুন।</li>
                    </ol>
                  </div>
                </div>
              )}

              {selectedGuideId === 'rocket-to-bkash' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      Rocket ➔ bKash / Nagad
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900">
                      রকেট থেকে বিকাশ বা নগদে ফান্ড ট্রান্সফার
                    </h3>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs sm:text-sm text-slate-700">
                    <ol className="list-decimal list-inside space-y-2 text-slate-600 pl-1 leading-relaxed">
                      <li>রকেট নেক্সাস পে বা রকেট অ্যাপ ওপেন করুন অথবা <code>*322#</code> ডায়াল করুন।</li>
                      <li><strong>"বিনিময়"</strong> অপশন সিলেক্ট করুন।</li>
                      <li><strong>"Fund Transfer"</strong> নির্বাচন করে প্রাপকের bKash বা Nagad VID প্রদান করুন।</li>
                      <li>টাকার পরিমাণ লিখুন এবং রকেট গোপন পিন প্রদান করুন।</li>
                    </ol>
                  </div>
                </div>
              )}

              {selectedGuideId === 'cellfin-to-mfs' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      Cellfin ➔ Any MFS
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900">
                      সেলফিন (Cellfin) থেকে যেকোনো বিকাশ, নগদ বা রকেটে ট্রান্সফার
                    </h3>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs sm:text-sm text-slate-700">
                    <ol className="list-decimal list-inside space-y-2 text-slate-600 pl-1 leading-relaxed">
                      <li>সেলফিন অ্যাপে লগইন করুন।</li>
                      <li>হোম স্ক্রিন থেকে <strong>"Fund Transfer"</strong> অথবা <strong>"MFS Transfer"</strong> এ ক্লিক করুন।</li>
                      <li>বিকাশ, নগদ বা রকেট নির্বাচন করুন।</li>
                      <li>প্রাপকের মোবাইল নম্বর ও টাকার পরিমাণ দিন।</li>
                      <li>আপনার সেলফিন পিন প্রদান করে কনফার্ম করুন। টাকা সাথে সাথে এমএফএস ওয়ালেটে চলে যাবে।</li>
                    </ol>
                  </div>
                </div>
              )}

              {selectedGuideId === 'bank-to-mfs' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      Bank A/C ➔ MFS
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900">
                      ব্যাংক অ্যাকাউন্ট থেকে MFS এ টাকা ট্রান্সফার ও অ্যাড মানি
                    </h3>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs sm:text-sm text-slate-700">
                    <ol className="list-decimal list-inside space-y-2 text-slate-600 pl-1 leading-relaxed">
                      <li>আপনার ইন্টারনেট ব্যাংকিং অ্যাপ (যেমন: Citytouch, EBL SKYBANKING, BRAC Astha, Islami Bank iBanking) এ লগইন করুন।</li>
                      <li><strong>"Transfer to MFS"</strong> বা <strong>"bKash/Nagad/Rocket Transfer"</strong> অপশন সিলেক্ট করুন।</li>
                      <li>MFS মোবাইল নম্বর প্রদান করুন এবং ওটিপি (OTP) দিয়ে কনফার্ম করুন।</li>
                      <li>বিকাশ বা নগদ অ্যাপ থেকেও <strong>"Add Money" ➔ "Bank to bKash"</strong> দিয়ে যেকোনো ব্যাংক থেকে সরাসরি টাকা আনা যায়।</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Binimoy Official Protocol & VID Info */}
      {activeTab === 'binimoy' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Interoperable Digital Transaction Platform (IDTP)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              বিনিময় (Binimoy) কী এবং কীভাবে রেজিস্ট্রেশন করবেন?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              বাংলাদেশ ব্যাংক এবং আইসিটি ডিভিশনের উদ্যোগে তৈরি জাতীয় ইন্টারঅপারেবল লেনদেন প্ল্যাটফর্ম।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200/60 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                ১
              </div>
              <h4 className="font-bold text-sm text-emerald-950">ভার্চুয়াল আইডি (VID) তৈরি</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                আপনার পছন্দের MFS অ্যাপে (বিকাশ, রকেট, নগদ বা সেলফিন) গিয়ে ‘বিনিময়’ অপশনে আপনার মোবাইল বা পছন্দের নাম দিয়ে VID খুলুন (যেমন: <code>name@bkash</code>)।
              </p>
            </div>

            <div className="bg-teal-50/60 p-5 rounded-2xl border border-teal-200/60 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xs">
                ২
              </div>
              <h4 className="font-bold text-sm text-teal-950">সিকিউরিটি পিন সেট করুন</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                রেজিস্ট্রেশনের সময় একটি ৬-সংখ্যার নিরাপদ বিনিময় পিন (Binimoy PIN) সেট করুন যা প্রতিটি আন্তঃ লেনদেনের জন্য প্রয়োজন হবে।
              </p>
            </div>

            <div className="bg-sky-50/60 p-5 rounded-2xl border border-sky-200/60 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black text-xs">
                ৩
              </div>
              <h4 className="font-bold text-sm text-sky-950">স্বল্প খরচে লেনদেন</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                MFS থেকে MFS লেনদেনে মাত্র ০.৫% (প্রতি হাজারে ৳৫) এবং MFS থেকে ব্যাংকে ১% চার্জে সেকেন্ডে টাকা পৌঁছে যায়।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. Transfer History */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span>সাম্প্রতিক MFS আন্তঃ লেনদেনের রেকর্ড</span>
              </h2>
              <p className="text-xs text-slate-500">আপনার সংরক্ষিত সকল আন্তঃ এমএফএস লেনদেনের তালিকা</p>
            </div>

            {historyList.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('আপনি কি সকল লেনদেনের হিস্ট্রি মুছে ফেলতে চান?')) {
                    storageService.setMfsTransfers([]);
                    setHistoryList([]);
                  }
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 transition cursor-pointer"
              >
                হিস্ট্রি ক্লিয়ার করুন
              </button>
            )}
          </div>

          {historyList.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">কোনো পূর্ববর্তী লেনদেনের রেকর্ড পাওয়া যায়নি।</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {historyList.map((item) => {
                const sObj = providers.find((p) => p.id === item.fromProvider);
                const tObj = providers.find((p) => p.id === item.toProvider);
                return (
                  <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                        <ArrowRightLeft className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-slate-900">
                            {sObj?.bengaliName} ➔ {tObj?.bengaliName}
                          </span>
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                            {item.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                          টোকেন: {item.transactionToken} • {item.timestamp}
                        </p>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          প্রেরক: {item.senderNumber} ➔ প্রাপক: {item.receiverNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                      <span className="text-sm font-black text-slate-900">৳ {item.amount.toLocaleString('bn-BD')}</span>
                      <button
                        onClick={() => setLatestReceipt(item)}
                        className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
                      >
                        রিসিট দেখুন →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 6. MFS Helplines */}
      {activeTab === 'helpline' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-emerald-600" />
              <span>অফিশিয়াল MFS ও ফিনটেক হেল্পলাইন ডিরেক্টরি (২৪/৭)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              যেকোনো লেনদেন বা ভুল নম্বরে টাকা পাঠানোর সমস্যায় তাৎক্ষণিক সহায়তা নিন
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {providers.map((p) => (
              <div key={`help-${p.id}`} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">{p.bengaliName}</span>
                    <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-mono">
                      {p.ussd}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{p.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">কল: {p.helpline}</span>
                  <a
                    href={`tel:${p.helpline}`}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-xl transition flex items-center gap-1 shadow-2xs"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>কল করুন</span>
                  </a>
                </div>
              </div>
            ))}

            {/* Bangladesh Bank & Binimoy helpline */}
            <div className="bg-emerald-900 text-white p-4 rounded-2xl shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <span className="font-extrabold text-sm text-emerald-200">বিনিময় ও বাংলাদেশ ব্যাংক</span>
                <p className="text-[11px] text-emerald-100/80 mt-1">জাতীয় ফিনটেক অভিযোগ ও সহায়তা কেন্দ্র</p>
              </div>

              <div className="pt-2 border-t border-emerald-800 flex items-center justify-between">
                <span className="text-xs font-bold text-white">কল: 16236</span>
                <a
                  href="tel:16236"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-3 py-1 rounded-xl transition flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>কল করুন</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Official Receipt Modal */}
      {latestReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-up space-y-5">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900">MFS লেনদেন সফল হয়েছে!</h3>
              <p className="text-xs text-slate-500">অফিশিয়াল আন্তঃ MFS ট্রান্সফার রিসিট</p>
            </div>

            {/* Receipt Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-slate-200 font-mono">
                <span>টোকেন নং:</span>
                <span className="font-bold text-slate-900">{latestReceipt.transactionToken}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">প্রেরক ওয়ালেট:</span>
                <span className="font-bold text-slate-900">
                  {providers.find((p) => p.id === latestReceipt.fromProvider)?.bengaliName} ({latestReceipt.senderNumber})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">প্রাপক ওয়ালেট:</span>
                <span className="font-bold text-slate-900">
                  {providers.find((p) => p.id === latestReceipt.toProvider)?.bengaliName} ({latestReceipt.receiverNumber})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">প্রোটোকল:</span>
                <span className="font-bold text-emerald-700">{latestReceipt.protocol}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">মূল পরিমাণ:</span>
                <span className="font-bold text-slate-900">৳ {latestReceipt.amount.toLocaleString('bn-BD')}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">সার্ভিস চার্জ:</span>
                <span className="font-bold text-amber-600">৳ {latestReceipt.charge.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-sm font-black">
                <span className="text-slate-900">মোট কর্তন:</span>
                <span className="text-emerald-700">৳ {latestReceipt.totalDebited.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => handleCopy(latestReceipt.transactionToken)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedToken ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>টোকেন কপি করা হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>টোকেন নম্বর কপি করুন</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setLatestReceipt(null)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
              >
                ঠিক আছে, বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
