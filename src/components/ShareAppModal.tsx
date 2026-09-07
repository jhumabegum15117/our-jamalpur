import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  QrCode,
  Smartphone,
  ExternalLink,
  X,
  Sparkles,
  MessageCircle,
  Send,
  Facebook,
  RefreshCw,
  Globe,
} from 'lucide-react';
import { storageService } from '../services/storageService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenAppUpdate?: () => void;
}

export const ShareAppModal: React.FC<Props> = ({ isOpen, onClose, onOpenAppUpdate }) => {
  const [copiedType, setCopiedType] = useState<'official' | 'bypass' | null>(null);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const officialProdUrl = storageService.getOfficialLiveUrl();
  const updateBypassUrl = `${officialProdUrl}?v=latest&update=true`;

  const shareText = `📲 Our Jamalpur (ডিজিটাল জামালপুর পোর্টাল ও মার্কেটপ্লেস)\n\nজামালপুর জেলার সব খবর, ৭ উপজেলার লাইভ আবহাওয়া, বাস ও ট্রেন সময়সূচী, ডাক্তার ও হাসপাতাল, জরুরি হেল্পলাইন, কেনাবেচা এবং সকল সরকারি-বেসরকারি সেবা এক ক্লিকে!\n\nসবসময় সর্বশেষ আপডেট ভার্সন পেতে লিংকে ক্লিক করুন:\n${officialProdUrl}`;

  const handleCopyLink = async (url: string, type: 'official' | 'bypass') => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 3000);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Our Jamalpur - ডিজিটাল জামালপুর পোর্টাল ও মার্কেটপ্লেস',
          text: 'জামালপুর জেলার সব খবর, মার্কেটপ্লেস, পরিবহন, ডাক্তার ও জরুরি সেবার ডিজিটাল প্ল্যাটফর্ম।',
          url: officialProdUrl,
        });
      } catch (e) {
        console.log('Share canceled or not supported');
      }
    } else {
      handleCopyLink(officialProdUrl, 'official');
    }
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleFacebookShare = () => {
    const encodedUrl = encodeURIComponent(officialProdUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
  };

  const handleTelegramShare = () => {
    const encodedUrl = encodeURIComponent(officialProdUrl);
    const encodedText = encodeURIComponent('Our Jamalpur - ডিজিটাল জামালপুর পোর্টাল ও মার্কেটপ্লেস');
    window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, '_blank');
  };

  // QR Code URL pointing directly to official live url
  const qrCodeImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    officialProdUrl
  )}&bgcolor=ffffff&color=047857&margin=1`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        id="share-app-modal"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col transition-colors"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-inner">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white">শেয়ার ও লাইভ লিঙ্ক</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                  Live Version
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                সর্বশেষ আপডেটেড সংস্করণ ও অফিশিয়াল লিংক যেকোনো ডিভাইসের জন্য প্রস্তুত
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Official Production URL Card */}
          <div className="bg-emerald-50/70 dark:bg-slate-800/80 border border-emerald-200 dark:border-slate-700 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>অফিসিয়াল লাইভ ওয়েবসাইট লিংক:</span>
              </span>
              <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-300/60 dark:border-emerald-700/60">
                Official Production
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-slate-700 rounded-xl p-2.5 shadow-inner">
              <input
                type="text"
                readOnly
                value={officialProdUrl}
                className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-100 font-mono font-bold focus:outline-none select-all truncate"
              />
              <button
                id="btn-copy-official-url"
                onClick={() => handleCopyLink(officialProdUrl, 'official')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  copiedType === 'official'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300'
                }`}
              >
                {copiedType === 'official' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>কপি</span>
                  </>
                )}
              </button>
              <a
                href={officialProdUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="ব্রাউজারে ওপেন করুন"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1.5 font-medium">
              🌐 মূল লাইভ ঠিকানা: <strong>https://ourjamalpur15117.web.app</strong>
            </p>
          </div>

          {/* Cache-Bypass Latest Version URL Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>সর্বশেষ আপডেট সংস্করণ লিংক (ক্যাশ বাইপাস):</span>
              </span>
              <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-950 px-2 py-0.5 rounded-md border border-teal-300/50 dark:border-teal-700/50">
                Force Update
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 shadow-inner">
              <input
                type="text"
                readOnly
                value={updateBypassUrl}
                className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-200 font-mono focus:outline-none select-all truncate"
              />
              <button
                id="btn-copy-update-bypass-url"
                onClick={() => handleCopyLink(updateBypassUrl, 'bypass')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  copiedType === 'bypass'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-teal-100 hover:bg-teal-200 dark:bg-teal-950 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-300'
                }`}
              >
                {copiedType === 'bypass' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>কপি</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              💡 কোনো ইউজারের ডিভাইসে পুরনো ক্যাশ জমে থাকলে এই লিংকটি পাঠালে সাথে সাথে নতুন সব আপডেট ও ফিচার লোড হবে।
            </p>
          </div>

          {/* Social Share Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
              সোশ্যাল মিডিয়া ও মেসেঞ্জারে সরাসরি শেয়ার করুন:
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* WhatsApp */}
              <button
                id="share-whatsapp-btn"
                onClick={handleWhatsAppShare}
                className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl flex flex-col items-center justify-center gap-1.5 transition shadow-xs hover:shadow-md cursor-pointer group"
              >
                <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">WhatsApp</span>
              </button>

              {/* Facebook */}
              <button
                id="share-facebook-btn"
                onClick={handleFacebookShare}
                className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex flex-col items-center justify-center gap-1.5 transition shadow-xs hover:shadow-md cursor-pointer group"
              >
                <Facebook className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Facebook</span>
              </button>

              {/* Telegram */}
              <button
                id="share-telegram-btn"
                onClick={handleTelegramShare}
                className="p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl flex flex-col items-center justify-center gap-1.5 transition shadow-xs hover:shadow-md cursor-pointer group"
              >
                <Send className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Telegram</span>
              </button>

              {/* Mobile Native Share / QR Toggle */}
              <button
                id="share-native-qr-btn"
                onClick={() => setShowQr(!showQr)}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl flex flex-col items-center justify-center gap-1.5 transition shadow-xs hover:shadow-md cursor-pointer group"
              >
                <QrCode className="w-6 h-6 group-hover:scale-110 transition-transform text-amber-400" />
                <span className="text-xs font-bold">{showQr ? 'QR বন্ধ' : 'QR কোড'}</span>
              </button>
            </div>
          </div>

          {/* QR Code Section */}
          {showQr && (
            <div className="bg-emerald-50 dark:bg-slate-800/80 border border-emerald-200 dark:border-slate-700 rounded-2xl p-4 text-center animate-fade-in">
              <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-2 flex items-center justify-center gap-1.5">
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>যেকোনো স্মার্টফোনের ক্যামেরা দিয়ে স্ক্যান করুন</span>
              </h5>
              <div className="w-44 h-44 mx-auto bg-white p-2.5 rounded-2xl shadow-md border border-slate-200 flex items-center justify-center">
                <img
                  src={qrCodeImgUrl}
                  alt="Our Jamalpur Portal QR Code"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                ক্যামেরা অন করে ধরলেই সরাসরি লেটেস্ট ভার্সনে Our Jamalpur অ্যাপ চালু হবে
              </p>
            </div>
          )}

          {/* Message Preview Box */}
          <div className="bg-slate-100 dark:bg-slate-800/40 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-700/60 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              💬 শেয়ার মেসেজ টেক্সট প্রিভিউ:
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
              {shareText}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 rounded-b-3xl">
          {onOpenAppUpdate && (
            <button
              onClick={() => {
                onClose();
                onOpenAppUpdate();
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>অ্যাপ আপডেট অপশন দেখুন</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="ml-auto px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
