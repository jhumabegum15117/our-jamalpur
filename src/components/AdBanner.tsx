import React, { useState } from 'react';
import { Sparkles, ExternalLink, Phone, Zap } from 'lucide-react';
import { storageService } from '../services/storageService';
import { MonetizationModal } from './MonetizationModal';

interface Props {
  type?: 'leaderboard' | 'in-feed' | 'sidebar';
  title?: string;
  sponsorName?: string;
  linkText?: string;
  onAction?: () => void;
  placement?: 'home_top' | 'marketplace' | 'news' | 'sidebar';
}

export const AdBanner: React.FC<Props> = ({
  type = 'leaderboard',
  title,
  sponsorName,
  linkText = 'বিজ্ঞাপন দিন (৳৫০ থেকে)',
  onAction,
  placement = 'home_top',
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const activeBanners = storageService.getAdBanners().filter((b) => b.status === 'active');
  const matchedBanner = activeBanners.find((b) => b.placement === placement) || activeBanners[0];

  const handleActionClick = () => {
    if (onAction) {
      onAction();
    } else {
      setModalOpen(true);
    }
  };

  const displayTitle = title || (matchedBanner ? matchedBanner.title : 'জামালপুরে আপনার ব্যবসা বা পণ্যের প্রচার করুন');
  const displaySubtitle = matchedBanner?.subtitle || 'জামালপুর জেলার প্রতিটি উপজেলার হাজারো গ্রাহকের কাছে পৌঁছাতে স্বল্পমূল্যে বিজ্ঞাপন দিন।';
  const displaySponsor = sponsorName || (matchedBanner ? matchedBanner.advertiserName : 'Our Jamalpur স্পনসর স্পেস');
  const displayPhone = matchedBanner?.advertiserPhone || '01315481879';

  if (type === 'leaderboard') {
    return (
      <>
        <div className="w-full my-4 bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-lg border border-emerald-800/40 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-500/10 blur-2xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30 shadow-inner">
                <Sparkles className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 border border-emerald-600/40">
                    {displaySponsor}
                  </span>
                  <span className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>স্পন্সরড অ্যাড / Verified Sponsor</span>
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mt-1 leading-snug">
                  {displayTitle}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 hidden sm:block line-clamp-1">
                  {displaySubtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-center">
              {matchedBanner?.targetUrl ? (
                <a
                  href={matchedBanner.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>ভিজিট করুন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <a
                  href={`tel:${displayPhone}`}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-2.5 rounded-xl transition flex items-center gap-1.5 border border-white/20"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>কল করুন</span>
                </a>
              )}

              <button
                onClick={handleActionClick}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs sm:text-sm font-black px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>{linkText}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <MonetizationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          defaultService="banner_ad"
        />
      </>
    );
  }

  if (type === 'sidebar') {
    return (
      <>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-4 my-3 text-center shadow-xs">
          <span className="text-[10px] uppercase font-black tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
            {displaySponsor}
          </span>
          <h4 className="text-sm font-bold text-amber-950 mt-2">{displayTitle}</h4>
          <p className="text-xs text-amber-800/80 mt-1 leading-relaxed">{displaySubtitle}</p>
          <button
            onClick={handleActionClick}
            className="mt-3 w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold py-2 rounded-xl transition shadow-xs flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>{linkText}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <MonetizationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          defaultService="banner_ad"
        />
      </>
    );
  }

  return (
    <>
      <div className="bg-emerald-50/80 border border-dashed border-emerald-300 rounded-2xl p-3 my-3 text-center text-xs text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-2xs">
        <span className="font-bold flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>📢 {displayTitle}</span>
        </span>
        <button
          onClick={handleActionClick}
          className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer bg-white px-3 py-1 rounded-full border border-emerald-200 text-xs shrink-0"
        >
          <span>{linkText}</span>
          <span>→</span>
        </button>
      </div>

      <MonetizationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultService="banner_ad"
      />
    </>
  );
};

