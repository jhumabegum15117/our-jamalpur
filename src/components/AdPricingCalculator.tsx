import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Sparkles,
  Clock,
  Video,
  Image,
  Layout,
  Zap,
  CheckCircle2,
  TrendingUp,
  Copy,
  FileText,
  DollarSign,
  Sliders,
  Eye,
  MousePointer,
  Share2,
  Percent,
  Calendar,
  Flame,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  Check,
  Award,
  Layers,
  Send,
} from 'lucide-react';
import { OWNER_PAYMENT_INFO, storageService } from '../services/storageService';

export type AdPlacementKey =
  | 'home_top'
  | 'news'
  | 'marketplace'
  | 'splash_modal'
  | 'floating_bottom'
  | 'sidebar';

export type AdTypeKey = 'banner' | 'video';

interface PlacementOption {
  key: AdPlacementKey;
  label: string;
  sublabel: string;
  multiplier: number;
  dailyViews: string;
  badge?: string;
  iconColor: string;
}

const PLACEMENT_OPTIONS: PlacementOption[] = [
  {
    key: 'home_top',
    label: 'হোম পেজ শীর্ষ ব্যানার',
    sublabel: 'অ্যাপের হোম পেজের শীর্ষে জামালপুরের প্রতিটি নাগরিকের সামনে দৃশ্যমান',
    multiplier: 1.25,
    dailyViews: '২,৮০০ - ৪,২০০ ভিউ/দিন',
    badge: 'সর্বোচ্চ ভিউ ও ক্লিক',
    iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
  },
  {
    key: 'news',
    label: 'সংবাদ ও ফিড ব্যানার',
    sublabel: 'লাইভ নিউজ পেজ এবং খবরের ভেতর সরাসরি সংবাদ পাঠকদের টার্গেটেড প্রচার',
    multiplier: 1.0,
    dailyViews: '১,৮০০ - ২,৬০০ ভিউ/দিন',
    badge: 'স্ট্যান্ডার্ড',
    iconColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40',
  },
  {
    key: 'marketplace',
    label: 'মার্কেটপ্লেস টপ স্পন্সর',
    sublabel: 'ক্রয়-বিক্রয় ও পণ্য তালিকার শীর্ষে পণ্য বা শোরুমের বিশেষ বিজ্ঞাপন',
    multiplier: 1.15,
    dailyViews: '২,২০০ - ৩,৪০০ ভিউ/দিন',
    badge: 'সরাসরি ক্রেতা রিচ',
    iconColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
  },
  {
    key: 'splash_modal',
    label: 'অ্যাপ ওপেন স্প্ল্যাশ / পপ-আপ',
    sublabel: 'অ্যাপ ওপেন করলে ফুল-স্ক্রিন হাই-ইমপ্যাক্ট প্রমোশন (দিনে ১ বার প্রতি ব্যবহারকারী)',
    multiplier: 1.4,
    dailyViews: '৩,৫০০ - ৫,০০০ ভিউ/দিন',
    badge: 'ভিআইপি ইমপ্যাক্ট',
    iconColor: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40',
  },
  {
    key: 'floating_bottom',
    label: 'নিচের ফ্লোটিং স্টিকি বার',
    sublabel: 'ব্যবহারকারী পেজ স্ক্রল করলেও স্ক্রিনের নিচে স্থায়ীভাবে দেখা যাবে',
    multiplier: 1.1,
    dailyViews: '২,২০০ - ৩,১০০ ভিউ/দিন',
    badge: 'স্থায়ী ভিজিবিলিটি',
    iconColor: 'text-teal-500 bg-teal-50 dark:bg-teal-950/40',
  },
  {
    key: 'sidebar',
    label: 'উপজেলা ও ডিরেক্টরি পেজ',
    sublabel: 'নির্দিষ্ট উপজেলা, হেল্পলাইন বা হাসপাতালের পেজে স্থানীয় বিজ্ঞাপন',
    multiplier: 0.85,
    dailyViews: '১,১০০ - ১,৭০০ ভিউ/দিন',
    badge: 'বাজেট ফ্রেন্ডলি',
    iconColor: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40',
  },
];

interface AddonService {
  id: string;
  name: string;
  description: string;
  price: number;
}

const ADDON_SERVICES: AddonService[] = [
  {
    id: 'graphic_design',
    name: 'গ্রাফিক ব্যানার ডিজাইন',
    description: 'আমাদের ডিজাইনার কর্তৃক প্রফেশনাল ব্যানার তৈরি',
    price: 300,
  },
  {
    id: 'video_editing',
    name: 'ভিডিও প্রমোশন এডিটিং',
    description: 'ভিডিও রিলস কাটিং, লোগো ও ব্যাকগ্রাউন্ড মিউজিক/ভয়েসওভার',
    price: 800,
  },
  {
    id: 'facebook_share',
    name: 'ফেসবুক পেজে পোস্ট',
    description: 'Our Jamalpur অফিসিয়াল ফেসবুক পেজে বিজ্ঞাপন শেয়ার',
    price: 250,
  },
  {
    id: 'push_notify',
    name: 'পুশ নোটিফিকেশন ব্রডকাস্ট',
    description: 'জামালপুরের সকল অ্যাপ ব্যবহারকারীর মোবাইলে ১টি সরাসরি নোটিফিকেশন',
    price: 500,
  },
];

interface Props {
  onApplyToBanner?: (params: {
    placement: 'home_top' | 'marketplace' | 'news' | 'sidebar';
    durationDays: number;
    estimatedPrice: number;
    adType: AdTypeKey;
    advertiserNote?: string;
  }) => void;
}

export const AdPricingCalculator: React.FC<Props> = ({ onApplyToBanner }) => {
  // Inputs
  const [durationDays, setDurationDays] = useState<number>(15);
  const [placement, setPlacement] = useState<AdPlacementKey>('home_top');
  const [adType, setAdType] = useState<AdTypeKey>('banner');
  const [baseDailyRate, setBaseDailyRate] = useState<number>(45);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [campaignType, setCampaignType] = useState<'regular' | 'festival' | 'discount'>('regular');
  const [customDiscountPercent, setCustomDiscountPercent] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });

  // Client Details for Quotation Generation
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  const [copiedQuotation, setCopiedQuotation] = useState(false);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);

  // Active Placement Info
  const activePlacementInfo = useMemo(() => {
    return PLACEMENT_OPTIONS.find((p) => p.key === placement) || PLACEMENT_OPTIONS[0];
  }, [placement]);

  // Volume discount based on duration (aligned with published market rates: 7d=300, 15d=550, 30d=950)
  const volumeDiscountPercent = useMemo(() => {
    if (durationDays < 7) return 0;
    if (durationDays < 15) return 5; // e.g. 7 days: 7 * 45 = 315 - 5% = ~300
    if (durationDays < 30) return 18; // e.g. 15 days: 15 * 45 = 675 - 18% = ~550
    if (durationDays < 60) return 30; // e.g. 30 days: 30 * 45 = 1350 - 30% = ~945
    if (durationDays < 90) return 38;
    return 45; // 90+ days
  }, [durationDays]);

  // Calculate Expiry Date in Bangla
  const expiryDateInfo = useMemo(() => {
    try {
      const d = new Date(startDate);
      d.setDate(d.getDate() + Math.max(1, durationDays));
      const banglaDateStr = d.toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return {
        iso: d.toISOString().split('T')[0],
        bangla: banglaDateStr,
      };
    } catch {
      return { iso: '', bangla: 'মেয়াদ শেষ হওয়ার তারিখ' };
    }
  }, [startDate, durationDays]);

  // Core Price Calculation
  const calculation = useMemo(() => {
    // 1. Base Gross
    const rawBaseCost = baseDailyRate * durationDays;

    // 2. Volume Discount
    const volumeDiscountAmt = Math.round(rawBaseCost * (volumeDiscountPercent / 100));
    const postVolumeCost = rawBaseCost - volumeDiscountAmt;

    // 3. Placement Factor
    const placementMultiplier = activePlacementInfo.multiplier;
    const placementAdjustedCost = postVolumeCost * placementMultiplier;

    // 4. Ad Type Multiplier (Video is 1.65x banner due to bandwidth, higher conversion & engagement)
    const typeMultiplier = adType === 'video' ? 1.65 : 1.0;
    const typeAdjustedCost = placementAdjustedCost * typeMultiplier;

    // 5. Campaign / Season Surcharge or Discount
    let campaignAdjustMultiplier = 1.0;
    if (campaignType === 'festival') {
      campaignAdjustMultiplier = 1.15; // +15% peak season
    } else if (campaignType === 'discount') {
      campaignAdjustMultiplier = Math.max(0.5, 1 - customDiscountPercent / 100);
    }
    const campaignAdjustedCost = typeAdjustedCost * campaignAdjustMultiplier;

    // 6. Addons
    const addonsTotal = selectedAddons.reduce((sum, id) => {
      const item = ADDON_SERVICES.find((a) => a.id === id);
      return sum + (item ? item.price : 0);
    }, 0);

    // Final Rounded Total Price in BDT
    const finalEstimatedPrice = Math.round(campaignAdjustedCost + addonsTotal);

    // Average per day
    const averagePerDay = Math.round(finalEstimatedPrice / Math.max(1, durationDays));

    // Estimated Impressions and Clicks
    const baseDailyImp = adType === 'video' ? 3200 : 2500;
    const totalEstImpressions = Math.round(baseDailyImp * placementMultiplier * durationDays);
    const estImpressionsLow = Math.round(totalEstImpressions * 0.85);
    const estImpressionsHigh = Math.round(totalEstImpressions * 1.25);

    const estCtr = adType === 'video' ? 0.038 : 0.024; // 3.8% for video, 2.4% for banner
    const estClicksLow = Math.round(estImpressionsLow * estCtr);
    const estClicksHigh = Math.round(estImpressionsHigh * estCtr);

    return {
      rawBaseCost,
      volumeDiscountAmt,
      volumeDiscountPercent,
      placementMultiplier,
      typeMultiplier,
      campaignAdjustedCost,
      addonsTotal,
      finalEstimatedPrice,
      averagePerDay,
      estImpressionsLow,
      estImpressionsHigh,
      estClicksLow,
      estClicksHigh,
    };
  }, [
    baseDailyRate,
    durationDays,
    volumeDiscountPercent,
    activePlacementInfo,
    adType,
    campaignType,
    customDiscountPercent,
    selectedAddons,
  ]);

  // Alternate calculation for comparison (Banner vs Video)
  const alternateTypePrice = useMemo(() => {
    const otherType: AdTypeKey = adType === 'banner' ? 'video' : 'banner';
    const rawBaseCost = baseDailyRate * durationDays;
    const volumeDiscountAmt = Math.round(rawBaseCost * (volumeDiscountPercent / 100));
    const postVolumeCost = rawBaseCost - volumeDiscountAmt;
    const placementAdjustedCost = postVolumeCost * activePlacementInfo.multiplier;
    const typeMultiplier = otherType === 'video' ? 1.65 : 1.0;
    const typeAdjustedCost = placementAdjustedCost * typeMultiplier;

    let campaignAdjustMultiplier = 1.0;
    if (campaignType === 'festival') campaignAdjustMultiplier = 1.15;
    else if (campaignType === 'discount')
      campaignAdjustMultiplier = Math.max(0.5, 1 - customDiscountPercent / 100);

    const total = Math.round(typeAdjustedCost * campaignAdjustMultiplier + calculation.addonsTotal);
    return {
      otherType,
      total,
    };
  }, [
    adType,
    baseDailyRate,
    durationDays,
    volumeDiscountPercent,
    activePlacementInfo,
    campaignType,
    customDiscountPercent,
    calculation.addonsTotal,
  ]);

  // Addon toggle handler
  const handleToggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Generate Quotation Text
  const quotationText = useMemo(() => {
    const bName = businessName ? `প্রতিষ্ঠানের নাম: ${businessName}\n` : '';
    const cName = clientName ? `শ্রদ্ধেয়: ${clientName}\n` : '';
    const phone = clientPhone ? `যোগাযোগ: ${clientPhone}\n` : '';
    const typeTitle = adType === 'video' ? 'ভিডিও বিজ্ঞাপন (Video Ad)' : 'গ্রাফিক ব্যানার বিজ্ঞাপন (Banner Ad)';
    const addonsList =
      selectedAddons.length > 0
        ? selectedAddons
            .map((id) => {
              const item = ADDON_SERVICES.find((a) => a.id === id);
              return `  • ${item?.name} (+৳ ${item?.price})`;
            })
            .join('\n')
        : '  • কোনো অতিরিক্ত সার্ভিস নেই';

    return `📢 【 Our Jamalpur - বিজ্ঞাপন কোটেশন ও রেট প্রস্তাবনা 】
━━━━━━━━━━━━━━━━━━━━━━━━━━━
${bName}${cName}${phone}
📅 বিজ্ঞাপনের মেয়াদ: ${durationDays} দিন
🗓 শুরু: ${startDate} থেকে ${expiryDateInfo.bangla} পর্যন্ত
📍 প্লেসমেন্ট: ${activePlacementInfo.label} (${activePlacementInfo.dailyViews})
🎞 বিজ্ঞাপনের ধরন: ${typeTitle}
⚡ প্রাক্কলিত উপস্থিতি: ${calculation.estImpressionsLow.toLocaleString('bn-BD')} - ${calculation.estImpressionsHigh.toLocaleString('bn-BD')}+ ভিউ
🎯 প্রাক্কলিত কল ও ক্লিক: ${calculation.estClicksLow.toLocaleString('bn-BD')} - ${calculation.estClicksHigh.toLocaleString('bn-BD')}+ সম্ভাব্য গ্রাহক

💰 আর্থিক হিসাব বিবরণী:
• দৈনিক প্রাক্কলিত গড় খরচ: ৳ ${calculation.averagePerDay.toLocaleString('bn-BD')} / দিন
• মেয়াদের বিশেষ ভলিউম ছাড়: ${calculation.volumeDiscountPercent}% (৳ ${calculation.volumeDiscountAmt.toLocaleString('bn-BD')})
• অন্তর্ভুক্ত অতিরিক্ত সেবা:
${addonsList}

★ সর্বমোট প্রদেয় প্রাক্কলিত বিল: ৳ ${calculation.finalEstimatedPrice.toLocaleString('bn-BD')} টাকা
━━━━━━━━━━━━━━━━━━━━━━━━━━━
💳 পেমেন্ট মাধ্যম: বিকাশ / নগদ / রকেট (পার্সোনাল)
📞 পেমেন্ট ও বুকিং নম্বর: ${OWNER_PAYMENT_INFO.phone}
🌐 ওয়েবসাইট: ${storageService.getOfficialLiveUrl()}
(জামালপুর জেলার সর্ববৃহৎ ডিজিটাল সিটি পোর্টাল ও মার্কেটপ্লেস)`;
  }, [
    businessName,
    clientName,
    clientPhone,
    adType,
    selectedAddons,
    durationDays,
    startDate,
    expiryDateInfo.bangla,
    activePlacementInfo,
    calculation,
  ]);

  const handleCopyQuotation = () => {
    navigator.clipboard.writeText(quotationText);
    setCopiedQuotation(true);
    setTimeout(() => setCopiedQuotation(false), 2500);
  };

  const handleApplyToBannerForm = () => {
    if (onApplyToBanner) {
      // Map to supported AdBannerItem placement
      let targetPlacement: 'home_top' | 'marketplace' | 'news' | 'sidebar' = 'home_top';
      if (placement === 'marketplace') targetPlacement = 'marketplace';
      else if (placement === 'news') targetPlacement = 'news';
      else if (placement === 'sidebar') targetPlacement = 'sidebar';
      else targetPlacement = 'home_top';

      onApplyToBanner({
        placement: targetPlacement,
        durationDays,
        estimatedPrice: calculation.finalEstimatedPrice,
        adType,
        advertiserNote: `${clientName || businessName ? `${clientName} (${businessName}) - ` : ''}${
          adType === 'video' ? 'ভিডিও বিজ্ঞাপন' : 'ব্যানার'
        }, মেয়াদ ${durationDays} দিন। প্রাক্কলিত রেট ৳ ${calculation.finalEstimatedPrice}`,
      });
    }
  };

  return (
    <div className="space-y-6" id="ad-pricing-calculator-root">
      {/* Top Banner Header */}
      <div className="rounded-3xl bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 p-6 sm:p-7 text-white shadow-xl border border-purple-800/40 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
              <Calculator className="w-3.5 h-3.5 text-purple-400" />
              <span>এডমিন টুল • ইন্টারেক্টিভ বিজ্ঞাপন মূল্য ক্যালকুলেটর</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
              স্মার্ট অ্যাড প্রাইসিং ও কোটেশন ক্যালকুলেটর
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
              বিজ্ঞাপনের মেয়াদ, প্লেসমেন্ট এবং ধরন (ব্যানার বা ভিডিও) নির্ধারণ করে তাৎক্ষণিক বাজার মূল্যের সঠিক হিসাব তৈরি করুন এবং ক্লায়েন্টের জন্য প্রফেশনাল কোটেশন জেনারেট করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
            <button
              onClick={() => setIsQuotationModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 border border-white/20 cursor-pointer"
              title="কোটেশন প্রিভিউ দেখুন"
            >
              <FileText className="w-4 h-4 text-purple-300" />
              <span>কোটেশন প্রিভিউ</span>
            </button>
            <button
              onClick={handleCopyQuotation}
              className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              {copiedQuotation ? (
                <>
                  <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                  <span>কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-950" />
                  <span>কোটেশন কপি</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs on Left, Realtime Calculation on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side (8 Cols): Input Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Ad Type Selector: Banner vs Video */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>১. বিজ্ঞাপনের ধরন নির্বাচন করুন (Ad Type)</span>
              </label>
              <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                {adType === 'video' ? 'ভিডিও অ্যাড (১.৬৫ গুণ রূপান্তর)' : 'গ্রাফিক ব্যানার (স্ট্যান্ডার্ড)'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: Banner */}
              <button
                type="button"
                onClick={() => setAdType('banner')}
                className={`p-4 rounded-2xl border-2 text-left transition relative cursor-pointer ${
                  adType === 'banner'
                    ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/30 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50'
                }`}
              >
                {adType === 'banner' && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center mb-2.5">
                  <Image className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  ব্যানার বিজ্ঞাপন (Banner)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  স্ট্যাটিক ইমেজ বা অ্যানিমেটেড জিআইএফ ডিজাইন। হালকা সাইজ ও দ্রুত লোডিং।
                </p>
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">১.০ গুণ</span>
                  <span>(স্ট্যান্ডার্ড রেট)</span>
                </div>
              </button>

              {/* Option B: Video */}
              <button
                type="button"
                onClick={() => setAdType('video')}
                className={`p-4 rounded-2xl border-2 text-left transition relative cursor-pointer ${
                  adType === 'video'
                    ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/30 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50'
                }`}
              >
                {adType === 'video' && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                    <Video className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 uppercase tracking-wider">
                    প্রিমিয়াম
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  ভিডিও বিজ্ঞাপন (Video Ad)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  ১০-৩০ সেকেন্ড প্রমোশনাল ক্লিপ, ফেসবুক রিল বা অটোপ্লে ভিডিও। ৩ গুণ বেশি এঙ্গেজমেন্ট।
                </p>
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <span className="text-amber-600 dark:text-amber-400 font-extrabold">১.৬৫ গুণ</span>
                  <span>(উচ্চ রূপান্তর ও রিচ ফ্যাক্টর)</span>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Ad Placement Selector */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Layout className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>২. বিজ্ঞাপনের অবস্থান / প্লেসমেন্ট নির্বাচন (Placement)</span>
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                গুণক: <strong className="text-purple-600 dark:text-purple-400">{activePlacementInfo.multiplier}x</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PLACEMENT_OPTIONS.map((opt) => {
                const isSelected = placement === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setPlacement(opt.key)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition cursor-pointer relative ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${opt.iconColor}`}>
                          {opt.multiplier}x
                        </span>
                        <div>
                          <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                            {opt.label}
                          </h5>
                          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 block">
                            {opt.dailyViews}
                          </span>
                        </div>
                      </div>
                      {opt.badge && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-tight">
                      {opt.sublabel}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Duration Selector & Presets */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>৩. বিজ্ঞাপনের সময়কাল / মেয়াদ (Duration)</span>
              </label>

              {/* Volume Discount Badge */}
              {volumeDiscountPercent > 0 ? (
                <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 self-start sm:self-auto">
                  <Percent className="w-3 h-3" />
                  <span>মেয়াদের বিশেষ ছাড়: {volumeDiscountPercent}% সেভ হচ্ছে</span>
                </span>
              ) : (
                <span className="text-xs text-slate-400">৭+ দিন নিলে ছাড় কার্যকর হয়</span>
              )}
            </div>

            {/* Quick Duration Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { days: 3, label: '৩ দিন' },
                { days: 7, label: '৭ দিন (১ সপ্তাহ)' },
                { days: 15, label: '১৫ দিন (২ সপ্তাহ)' },
                { days: 30, label: '৩০ দিন (১ মাস)' },
                { days: 60, label: '৬০ দিন (২ মাস)' },
                { days: 90, label: '৯০ দিন (৩ মাস)' },
              ].map((p) => {
                const isSelected = durationDays === p.days;
                return (
                  <button
                    key={p.days}
                    type="button"
                    onClick={() => setDurationDays(p.days)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            {/* Interactive Slider & Manual Input */}
            <div className="pt-2 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>কাস্টম মেয়াদের দিন নির্ধারণ করুন:</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 px-2 py-1 text-center font-black text-sm bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-purple-600 dark:text-purple-400"
                  />
                  <span className="font-bold text-slate-700 dark:text-slate-300">দিন</span>
                </div>
              </div>

              <input
                type="range"
                min="1"
                max="120"
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />

              <div className="flex justify-between text-[11px] text-slate-400">
                <span>১ দিন</span>
                <span>১৫ দিন</span>
                <span>৩০ দিন</span>
                <span>৬০ দিন</span>
                <span>১২০ দিন</span>
              </div>
            </div>

            {/* Start Date & Calculated End Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  বিজ্ঞাপন শুরু হওয়ার তারিখ:
                </label>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 font-bold text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  বিজ্ঞাপনের মেয়াদ শেষ হবে:
                </span>
                <div className="flex items-center gap-1.5 font-bold text-purple-700 dark:text-purple-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{expiryDateInfo.bangla}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Add-on Services & Campaign Specials */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>৪. অতিরিক্ত সুবিধা ও ক্যাম্পেইন সমন্বয় (Add-ons & Offer)</span>
              </label>
              <span className="text-xs font-bold text-slate-500">ঐচ্ছিক</span>
            </div>

            {/* Campaign Selector */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'regular', label: 'সাধারণ দিন', desc: 'স্বাভাবিক রেট' },
                { id: 'festival', label: 'উৎসব / ঈদ', desc: '+১৫% পিক ডিমান্ড' },
                { id: 'discount', label: 'বিশেষ ছাড়', desc: 'অফার ডিসকাউন্ট' },
              ].map((c) => {
                const isSelected = campaignType === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCampaignType(c.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-200 font-extrabold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">{c.label}</div>
                    <div className="text-[10px] text-slate-500">{c.desc}</div>
                  </button>
                );
              })}
            </div>

            {campaignType === 'discount' && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-2 text-xs">
                <span className="font-bold text-amber-900 dark:text-amber-200">
                  ক্লায়েন্টের জন্য বিশেষ ছাড়ের পরিমাণ (%):
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={customDiscountPercent}
                    onChange={(e) =>
                      setCustomDiscountPercent(Math.min(50, Math.max(0, parseInt(e.target.value) || 0)))
                    }
                    className="w-14 p-1 text-center bg-white dark:bg-slate-900 border border-amber-300 rounded-lg font-black text-amber-900 dark:text-amber-200"
                  />
                  <span className="font-bold">%</span>
                </div>
              </div>
            )}

            {/* Addon checkboxes */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                ভ্যালু-অ্যাডেড সার্ভিসসমূহ নির্বাচন করুন:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ADDON_SERVICES.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => handleToggleAddon(addon.id)}
                      className={`p-3 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-2 ${
                        isChecked
                          ? 'border-purple-600 bg-purple-50/40 dark:bg-purple-950/30'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {addon.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 pl-5 leading-tight">
                          {addon.description}
                        </p>
                      </div>
                      <span className="text-xs font-black text-purple-700 dark:text-purple-400 shrink-0">
                        +৳ {addon.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (5 Cols): Real-time Calculation Summary, Comparison & Action */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Price Card */}
          <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 rounded-3xl p-6 text-white shadow-xl border border-purple-800/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between border-b border-purple-800/50 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                    ৳
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black text-purple-300 tracking-wider block">
                      প্রাক্কলিত হিসাব
                    </span>
                    <h4 className="text-sm font-bold text-white">মোট বিজ্ঞাপন মূল্য</h4>
                  </div>
                </div>

                <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {durationDays} দিনের প্যাকেজ
                </span>
              </div>

              {/* Big Price Display */}
              <div className="text-center py-2">
                <div className="text-4xl sm:text-5xl font-black text-amber-300 tracking-tight flex items-center justify-center gap-1">
                  <span>৳</span>
                  <span>{calculation.finalEstimatedPrice.toLocaleString('bn-BD')}</span>
                </div>
                <div className="text-xs text-purple-200 mt-1 font-medium">
                  গড় খরচ: <strong>৳ {calculation.averagePerDay.toLocaleString('bn-BD')}</strong> / দিন (ভ্যাট প্রযোজ্য হলে আলাদা)
                </div>
              </div>

              {/* Performance Estimations (Impressions & Clicks) */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <div className="bg-white/10 rounded-2xl p-3 border border-white/10 text-center">
                  <div className="flex items-center justify-center gap-1 text-[11px] text-purple-300 font-semibold mb-1">
                    <Eye className="w-3.5 h-3.5 text-purple-300" />
                    <span>প্রাক্কলিত ভিউ</span>
                  </div>
                  <div className="text-sm sm:text-base font-black text-white">
                    {calculation.estImpressionsLow.toLocaleString('bn-BD')} - {calculation.estImpressionsHigh.toLocaleString('bn-BD')}+
                  </div>
                  <span className="text-[10px] text-purple-300/80">জামালপুর জেলায়</span>
                </div>

                <div className="bg-white/10 rounded-2xl p-3 border border-white/10 text-center">
                  <div className="flex items-center justify-center gap-1 text-[11px] text-amber-300 font-semibold mb-1">
                    <MousePointer className="w-3.5 h-3.5 text-amber-300" />
                    <span>সম্ভাব্য কল/ক্লিক</span>
                  </div>
                  <div className="text-sm sm:text-base font-black text-amber-300">
                    {calculation.estClicksLow.toLocaleString('bn-BD')} - {calculation.estClicksHigh.toLocaleString('bn-BD')}+
                  </div>
                  <span className="text-[10px] text-amber-200/80">সরাসরি ক্রেতা যোগাযোগ</span>
                </div>
              </div>

              {/* Itemized Calculation Breakdown */}
              <div className="bg-slate-950/60 rounded-2xl p-4 border border-purple-900/60 text-xs space-y-2">
                <div className="font-extrabold text-purple-300 border-b border-purple-900/60 pb-1.5 flex justify-between">
                  <span>হিসাব বিশ্লেষণ (Breakdown)</span>
                  <span>হার</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>ভিত্তি মূল্য ({durationDays} দিন × ৳{baseDailyRate}):</span>
                  <span className="font-bold">৳ {calculation.rawBaseCost.toLocaleString('bn-BD')}</span>
                </div>

                {calculation.volumeDiscountAmt > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>মেয়াদের ভলিউম ছাড় ({calculation.volumeDiscountPercent}%):</span>
                    <span className="font-bold">- ৳ {calculation.volumeDiscountAmt.toLocaleString('bn-BD')}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-300">
                  <span>প্লেসমেন্ট গুণক ({activePlacementInfo.label}):</span>
                  <span className="font-bold text-amber-300">{activePlacementInfo.multiplier}x</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>বিজ্ঞাপনের ধরন ({adType === 'video' ? 'ভিডিও' : 'ব্যানার'}):</span>
                  <span className="font-bold text-amber-300">
                    {adType === 'video' ? '১.৬৫x (ভিডিও)' : '১.০০x (ব্যানার)'}
                  </span>
                </div>

                {calculation.addonsTotal > 0 && (
                  <div className="flex justify-between text-purple-300">
                    <span>অতিরিক্ত সার্ভিস ({selectedAddons.length} টি):</span>
                    <span className="font-bold">+ ৳ {calculation.addonsTotal.toLocaleString('bn-BD')}</span>
                  </div>
                )}

                <div className="border-t border-purple-900/80 pt-2 flex justify-between font-black text-white text-sm">
                  <span>সর্বমোট প্রাক্কলিত মূল্য:</span>
                  <span className="text-amber-400">৳ {calculation.finalEstimatedPrice.toLocaleString('bn-BD')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                {onApplyToBanner && (
                  <button
                    onClick={handleApplyToBannerForm}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Zap className="w-4 h-4 text-slate-950" />
                    <span>এই রেট নিয়ে ব্যানার প্রকাশ করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={handleCopyQuotation}
                  className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 border border-white/20 cursor-pointer"
                >
                  {copiedQuotation ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>কোটেশন ক্লিপবোর্ডে কপি করা হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-purple-300" />
                      <span>হোয়াটসঅ্যাপ / এসএমএস কোটেশন কপি করুন</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Banner vs Video Comparison Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>ব্যানার বনাম ভিডিও তুলনা ({durationDays} দিন)</span>
              </span>
              <span className="text-[10px] text-purple-600 font-bold">মার্কেট রেট</span>
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div
                className={`p-3 rounded-2xl border text-center ${
                  adType === 'banner'
                    ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="font-bold text-slate-600 dark:text-slate-400 text-[11px]">গ্রাফিক ব্যানার</div>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  ৳{' '}
                  {adType === 'banner'
                    ? calculation.finalEstimatedPrice.toLocaleString('bn-BD')
                    : alternateTypePrice.total.toLocaleString('bn-BD')}
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">স্ট্যান্ডার্ড ভিউ ও CTR</span>
              </div>

              <div
                className={`p-3 rounded-2xl border text-center ${
                  adType === 'video'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="font-bold text-amber-800 dark:text-amber-300 text-[11px] flex items-center justify-center gap-1">
                  <span>ভিডিও বিজ্ঞাপন</span>
                  <span className="text-[8px] bg-amber-400 text-slate-950 px-1 rounded font-black">HOT</span>
                </div>
                <div className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">
                  ৳{' '}
                  {adType === 'video'
                    ? calculation.finalEstimatedPrice.toLocaleString('bn-BD')
                    : alternateTypePrice.total.toLocaleString('bn-BD')}
                </div>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 block mt-1">
                  ৩ গুণ বেশি বিক্রয় কল
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              *ভিডিও বিজ্ঞাপন দর্শককে বেশি সময় ধরে ধরে রাখে এবং পণ্যের বিবরণ সহজে বোঝায়, তাই লোকাল ব্যবসায়ীদের কাছে ভিডিও রিল প্রমোশন বর্তমানে সর্বাধিক জনপ্রিয়।
            </p>
          </div>

          {/* Client Details Drawer / Input */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>ক্লায়েন্ট তথ্য (কোটেশনে যুক্ত হবে)</span>
            </h4>

            <div className="space-y-2 text-xs">
              <input
                type="text"
                placeholder="প্রতিষ্ঠানের নাম (যেমন: রয়েল সুইটস জামালপুর)"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="বিজ্ঞাপনদাতার নাম"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
                <input
                  type="text"
                  placeholder="মোবাইল নম্বর"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>
            </div>

            <button
              onClick={() => setIsQuotationModalOpen(true)}
              className="w-full py-2 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold text-xs rounded-xl border border-purple-200 dark:border-purple-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>কোটেশন মেমো দেখুন ও প্রিভিউ করুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Full Quotation Memo Preview */}
      {isQuotationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                  Our Jamalpur Official Memo
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  বিজ্ঞাপন মূল্য কোটেশন ও রেট বিবরণী
                </h3>
              </div>
              <button
                onClick={() => setIsQuotationModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Formatted Text Preview */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[380px] overflow-y-auto">
              {quotationText}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsQuotationModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
              >
                বন্ধ করুন
              </button>
              <button
                onClick={handleCopyQuotation}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                {copiedQuotation ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>কপি সম্পন্ন হয়েছে</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>ক্লিপবোর্ডে কপি করুন</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
