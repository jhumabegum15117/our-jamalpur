import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  CheckCircle2,
  Share2,
  Sparkles,
  X,
  Apple,
  Chrome,
  Laptop,
  ArrowRight,
  ShieldCheck,
  Zap,
  FolderArchive,
  FileCode,
  ExternalLink,
  Info,
  AlertTriangle,
  Layers,
  Globe,
  MoreVertical,
  PlusSquare,
  HelpCircle,
} from 'lucide-react';
import { generateSingleHtmlFile, generateProjectZip } from '../services/zipGenerator';
import { storageService } from '../services/storageService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstalled: () => void;
}

export const InstallAppModal: React.FC<Props> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstalled,
}) => {
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop' | 'download'>('android');
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [isInIframe, setIsInIframe] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check iframe status
    try {
      setIsInIframe(window.self !== window.top);
    } catch (e) {
      setIsInIframe(true);
    }

    // Check standalone mode
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Auto-detect device
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setActiveTab('ios');
    } else if (/Macintosh|Windows|Linux/.test(userAgent) && !/Android/.test(userAgent)) {
      setActiveTab('desktop');
    } else {
      setActiveTab('android');
    }
  }, []);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setDownloadToast(msg);
    setTimeout(() => setDownloadToast(null), 4000);
  };

  const handleOpenInNewTab = () => {
    window.open(storageService.getOfficialLiveUrl(), '_blank');
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        setIsInstalling(true);
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setInstallSuccess(true);
          onInstalled();
          showToast('অভিনন্দন! অ্যাপটি সফলভাবে আপনার ফোনে ইনস্টল হয়েছে।');
          setTimeout(() => {
            onClose();
          }, 2000);
        } else {
          showToast('ইনস্টলেশন বাতিল করা হয়েছে। আপনি যেকোনো সময় আবার চেষ্টা করতে পারেন।');
        }
      } catch (err) {
        console.error('Install prompt error:', err);
        showToast('ব্রাউজারের তিন ডট (⋮) মেনু থেকে "Install app" এ ক্লিক করুন।');
      } finally {
        setIsInstalling(false);
      }
    } else if (isInIframe) {
      // Prompt blocked by iframe sandbox
      handleOpenInNewTab();
    } else {
      // User is on mobile browser without active prompt
      setActiveTab('android');
      showToast('ক্রোম মেনু (⋮) থেকে "Install app" অথবা "Add to Home screen" চাপুন।');
    }
  };

  // Direct standalone HTML app download
  const handleDownloadStandaloneHtml = () => {
    try {
      setDownloadingFile(true);
      const blob = generateSingleHtmlFile();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'OurJamalpur-Offline-Mobile-App.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('OurJamalpur-Offline-Mobile-App.html সফলভাবে ডাউনলোড হয়েছে!');
    } catch (err) {
      console.error(err);
      alert('ডাউনলোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setDownloadingFile(false);
    }
  };

  // Direct Spck ZIP Project download
  const handleDownloadSpckZip = async () => {
    try {
      setDownloadingZip(true);
      const blob = await generateProjectZip(true);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'OurJamalpur-Spck-Project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('OurJamalpur-Spck-Project.zip সফলভাবে ডাউনলোড হয়েছে!');
    } catch (err) {
      console.error(err);
      alert('জিপ ফাইল তৈরিতে সমস্যা হয়েছে।');
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[94vh] text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-5 sm:p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg ring-2 ring-amber-300">
                OJ
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30">
                  Official Mobile App
                </span>
                <h3 className="font-extrabold text-base sm:text-lg text-white mt-0.5">
                  Our Jamalpur অ্যাপ ইনস্টলেশন
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-emerald-100/90 mt-2 leading-relaxed">
            কোনো প্লে-স্টোর অ্যাকাউন্ট বা অতিরিক্ত মেমোরি খরচ ছাড়াই সরাসরি আপনার ফোনে ফুল অ্যাপ হিসেবে ইনস্টল করুন।
          </p>
        </div>

        {/* Toast Alert */}
        {downloadToast && (
          <div className="bg-emerald-600 text-white text-xs font-bold py-2.5 px-4 text-center animate-fade-in flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{downloadToast}</span>
          </div>
        )}

        {/* Iframe Notice Banner if inside Preview Iframe */}
        {isInIframe && (
          <div className="bg-amber-50 dark:bg-amber-950/60 border-b border-amber-200 dark:border-amber-900/60 p-3 sm:p-4 flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] sm:text-xs text-amber-900 dark:text-amber-200">
                <span className="font-bold block">আপনি প্রিভিউ ফ্রেমে আছেন:</span>
                ১-ক্লিকে ফোনে ইনস্টল পপআপ পেতে নতুন ব্রাউজার উইন্ডোতে খুলুন।
              </div>
            </div>
            <button
              onClick={handleOpenInNewTab}
              className="shrink-0 flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-xs transition cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>নতুন ট্যাবে খুলুন</span>
            </button>
          </div>
        )}

        {/* Device & Option Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-600 dark:text-slate-400">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 transition cursor-pointer border-b-2 ${
              activeTab === 'android'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>অ্যান্ড্রয়েড (Android)</span>
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 transition cursor-pointer border-b-2 ${
              activeTab === 'ios'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Apple className="w-4 h-4 text-slate-800 dark:text-slate-200" />
            <span>iPhone (iOS)</span>
          </button>

          <button
            onClick={() => setActiveTab('desktop')}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 transition cursor-pointer border-b-2 ${
              activeTab === 'desktop'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Laptop className="w-4 h-4 text-indigo-600" />
            <span>কম্পিউটার (PC)</span>
          </button>

          <button
            onClick={() => setActiveTab('download')}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 transition cursor-pointer border-b-2 ${
              activeTab === 'download'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900'
                : 'border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Download className="w-4 h-4 text-amber-600" />
            <span>ফাইল / APK</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
          {/* Main Action Banner */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/60 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-slate-900 border border-emerald-300 dark:border-emerald-700/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <h4 className="font-extrabold text-emerald-950 dark:text-emerald-200 text-sm sm:text-base">
                  {isStandalone ? 'অ্যাপটি ইতিমধ্যে ইনস্টল করা আছে' : 'হোমস্ক্রিনে ১-ক্লিক ইনস্টল'}
                </h4>
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300/90 leading-relaxed">
                {isStandalone
                  ? 'আপনি সরাসরি পূর্ণাঙ্গ মোবাইল অ্যাপ মোডে Our Jamalpur ব্যবহার করছেন।'
                  : 'ফোনে ইনস্টল হলে ফুল স্ক্রিনে চলবে এবং ইন্টারনেট ছাড়াই দ্রুত লোড হবে।'}
              </p>
            </div>

            <button
              id="pwa-install-action-btn"
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="w-full sm:w-auto shrink-0 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {installSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>ইনস্টল সফল হয়েছে!</span>
                </>
              ) : isInIframe ? (
                <>
                  <Globe className="w-4 h-4 text-amber-300" />
                  <span>নতুন উইন্ডোতে খুলুন ও ইনস্টল</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>{deferredPrompt ? '১-ক্লিক ইনস্টল করুন' : 'অ্যাপ ইনস্টল করুন'}</span>
                </>
              )}
            </button>
          </div>

          {/* Tab 1: Android Step-by-Step with Visual Callout */}
          {activeTab === 'android' && (
            <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                  <Chrome className="w-4 h-4 text-emerald-600" />
                  <span>অ্যান্ড্রয়েড ফোনে ৩ সেকেন্ডে যেভাবে ইনস্টল করবেন:</span>
                </h5>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded">
                  সহজতম পদ্ধতি
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-2.5 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ১
                  </span>
                  <div>
                    <p className="leading-relaxed">
                      Chrome ব্রাউজারের উপরে ডানপাশের <strong>তিন ডট মেনু (⋮)</strong>-তে ট্যাপ করুন।
                    </p>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      (উপরে ডান কোনায় ৩টি খাড়া ফোটা থাকে)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ২
                  </span>
                  <div>
                    <p className="leading-relaxed">
                      মেনু লিস্ট থেকে <strong>"Install app"</strong> অথবা <strong>"Add to Home screen (হোম স্ক্রিনে যোগ করুন)"</strong> বাটনে ক্লিক করুন।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ৩
                  </span>
                  <div>
                    <p className="leading-relaxed">
                      <strong>"Install" / "Add"</strong> নিশ্চিত করুন। সাথে সাথে আপনার ফোনের অ্যাপ লিস্টে <strong>Our Jamalpur</strong> চলে আসবে!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: iOS Safari Step-by-Step */}
          {activeTab === 'ios' && (
            <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
              <h5 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                <Apple className="w-4 h-4 text-slate-900 dark:text-slate-100" />
                <span>iPhone / iPad (Safari) এ যেভাবে ইনস্টল করবেন:</span>
              </h5>
              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-2.5 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ১
                  </span>
                  <p className="leading-relaxed">
                    Safari ব্রাউজারের নিচে থাকা <strong className="inline-flex items-center gap-1 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-900 dark:text-slate-100"><Share2 className="w-3 h-3 text-blue-600" /> Share (শেয়ার)</strong> আইকনে চাপ দিন।
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ২
                  </span>
                  <p className="leading-relaxed">
                    মেনুটি একটু নিচে স্ক্রল করে <strong className="inline-flex items-center gap-1 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-900 dark:text-slate-100"><PlusSquare className="w-3 h-3 text-emerald-600" /> "Add to Home Screen (হোম স্ক্রিনে যোগ করুন)"</strong> অপশনটি চাপুন।
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ৩
                  </span>
                  <p className="leading-relaxed">
                    উপরে ডানপাশের <strong>"Add"</strong> বাটনে ক্লিক করলেই হোমস্ক্রিনে অ্যাপ আইকন চলে আসবে!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Desktop PC */}
          {activeTab === 'desktop' && (
            <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
              <h5 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                <Laptop className="w-4 h-4 text-indigo-600" />
                <span>কম্পিউটার বা ল্যাপটপে ইনস্টল করার নিয়ম:</span>
              </h5>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <p className="leading-relaxed">
                  Chrome বা Edge ব্রাউজারের অ্যাড্রেস বারের ডানপাশে থাকা <strong>Install আইকন (⊕)</strong> অথবা মেনুর <strong>"Install Our Jamalpur"</strong>-এ ক্লিক করে এক ক্লিকে ডেস্কটপ অ্যাপ হিসেবে যুক্ত করতে পারবেন।
                </p>
              </div>
            </div>
          )}

          {/* Direct File Download Buttons */}
          <div className="space-y-2">
            <h5 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
              <Download className="w-4 h-4 text-emerald-600" />
              <span>বিকল্প অফলাইন অ্যাপ ও প্যাকেজ ডাউনলোড:</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 1: Standalone HTML File */}
              <button
                onClick={handleDownloadStandaloneHtml}
                disabled={downloadingFile}
                className="p-3 bg-white dark:bg-slate-900 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl flex items-start gap-3 text-left transition cursor-pointer group shadow-2xs"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1">
                    <span>অফলাইন অ্যাপ (.html)</span>
                    <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] px-1.5 py-0.2 rounded font-bold">
                      অফলাইন
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    এক ফাইলে সম্পূর্ণ পোর্টাল, ইন্টারনেট ছাড়াও ফুল স্পিডে চলে
                  </p>
                </div>
              </button>

              {/* Option 2: Spck ZIP Project */}
              <button
                onClick={handleDownloadSpckZip}
                disabled={downloadingZip}
                className="p-3 bg-white dark:bg-slate-900 hover:bg-amber-50/60 dark:hover:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl flex items-start gap-3 text-left transition cursor-pointer group shadow-2xs"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <FolderArchive className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1">
                    <span>Spck প্রজেক্ট জিপ (.zip)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Spck Editor বা PWABuilder দিয়ে সরাসরি APK বানাতে পারবেন
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Tab 4: Download & APK Builder details */}
          {activeTab === 'download' && (
            <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
              <h5 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Android APK তৈরির দুটি নির্ভরযোগ্য মাধ্যম:</span>
              </h5>
              <div className="space-y-2 text-xs">
                <a
                  href="https://www.pwabuilder.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold transition"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <span>PWABuilder (সরাসরি APK ও প্লে-স্টোর প্যাকেজ)</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href="https://play.google.com/store/apps/details?id=io.spck"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-amber-950 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold transition"
                >
                  <div className="flex items-center gap-2">
                    <FolderArchive className="w-4 h-4 text-amber-600" />
                    <span>Spck Code Editor (মোবাইল এডিটর ও APK রানার)</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>
          )}

          {/* Features Badges */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 p-2.5 rounded-xl flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-slate-800 dark:text-slate-200 font-medium">সুপারফাস্ট লোডিং ও অফলাইন মোড</span>
            </div>
            <div className="bg-amber-50/60 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60 p-2.5 rounded-xl flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-slate-800 dark:text-slate-200 font-medium">সম্পূর্ণ ফ্রি ও নিরাপদ</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 inline-flex items-center gap-1">
            উদ্যোক্তা ও পরিচালক: <strong className="text-slate-800 dark:text-slate-200 font-bold">মাসুদ রানা</strong>
            <span className="inline-flex items-center text-blue-600 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 px-1.5 py-0.5 rounded-full text-[10px] font-bold gap-0.5">
              <CheckCircle2 className="w-3 h-3 fill-blue-600 text-white" />
              <span>Verified</span>
            </span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer transition"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
