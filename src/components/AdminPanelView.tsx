import React, { useState } from 'react';
import {
  Shield,
  Layers,
  Newspaper,
  ShoppingBag,
  Users,
  Settings,
  PlusCircle,
  Trash2,
  Edit,
  Save,
  RotateCcw,
  Sparkles,
  Megaphone,
  CheckCircle2,
  DollarSign,
  Zap,
  Check,
  X,
  CreditCard,
  Copy,
  ExternalLink,
  Phone,
  HardDrive,
  RefreshCw,
  Download,
  Upload,
  Database,
  Share2,
  Link2,
  Smartphone,
  Globe,
  QrCode,
  Lock,
  Send,
  CheckCircle,
  Calculator,
} from 'lucide-react';
import { storageService, OWNER_PAYMENT_INFO } from '../services/storageService';
import { isUserAdmin } from '../services/authService';
import { NewsItem, ProductItem, SiteSettings, MonetizationRequest, AdBannerItem } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { AdminMonetizationChart } from './AdminMonetizationChart';
import { AdPricingCalculator } from './AdPricingCalculator';

interface Props {
  onRefresh: () => void;
  onOpenAppUpdate?: () => void;
  onOpenShareApp?: () => void;
}

export const AdminPanelView: React.FC<Props> = ({ onRefresh, onOpenAppUpdate, onOpenShareApp }) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'monetization' | 'ad_calculator' | 'app_control' | 'news' | 'products' | 'settings'>('dashboard');
  const [copiedLinkType, setCopiedLinkType] = useState<string | null>(null);
  const [isUpdatingApp, setIsUpdatingApp] = useState(false);
  const [isSyncingCache, setIsSyncingCache] = useState(false);

  const [news, setNews] = useState<NewsItem[]>(storageService.getNews());
  const [products, setProducts] = useState<ProductItem[]>(storageService.getProducts());
  const [users, setUsers] = useState(storageService.getUsers());
  const [donors, setDonors] = useState(storageService.getBloodDonors());
  const [settings, setSettings] = useState<SiteSettings>(storageService.getSettings());
  const [monetizationRequests, setMonetizationRequests] = useState<MonetizationRequest[]>(storageService.getMonetizationRequests());
  const [adBanners, setAdBanners] = useState<AdBannerItem[]>(storageService.getAdBanners());

  // Add News Form State
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('সদর');
  const [newsLocation, setNewsLocation] = useState('জামালপুর সদর');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsImage, setNewsImage] = useState('https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80');

  // Add Ad Banner State
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerAdvertiser, setNewBannerAdvertiser] = useState('');
  const [newBannerPhone, setNewBannerPhone] = useState('01315481879');
  const [newBannerPlacement, setNewBannerPlacement] = useState<'home_top' | 'marketplace' | 'news' | 'sidebar'>('home_top');
  const [newBannerAmount, setNewBannerAmount] = useState('500');
  const [newBannerExpiry, setNewBannerExpiry] = useState('২০২৬-১২-৩১');

  // Settings State
  const [noticeText, setNoticeText] = useState(settings.noticeTickerText);
  const [ownerName, setOwnerName] = useState(settings.ownerName);
  const [ownerPhotoUrl, setOwnerPhotoUrl] = useState(settings.ownerPhotoUrl || '');
  const [facebookProfile, setFacebookProfile] = useState(settings.facebookProfile || '');
  const [contactPhone, setContactPhone] = useState(settings.contactPhone);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [productionUrl, setProductionUrl] = useState(settings.productionUrl || 'https://ourjamalpur15117.web.app');
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [copiedTrx, setCopiedTrx] = useState<string | null>(null);

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsSummary) {
      alert('দয়া করে শিরোনাম ও সারসংক্ষেপ পূরণ করুন');
      return;
    }

    storageService.addNews({
      title: newsTitle,
      category: newsCategory,
      location: newsLocation,
      summary: newsSummary,
      content: newsContent || newsSummary,
      image: newsImage,
      date: 'আজ',
      author: 'অ্যাডমিন ডেস্ক',
    });

    setNews(storageService.getNews());
    alert('সংবাদটি সফলভাবে প্রকাশিত হয়েছে!');
    setNewsTitle('');
    setNewsSummary('');
    setNewsContent('');
    onRefresh();
  };

  const handleDeleteNews = (id: string) => {
    if (confirm('আপনি কি নিশ্চিত এই সংবাদটি মুছে ফেলতে চান?')) {
      storageService.deleteNews(id);
      setNews(storageService.getNews());
      onRefresh();
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('আপনি কি নিশ্চিত এই পণ্যটি মুছে ফেলতে চান?')) {
      storageService.deleteProduct(id);
      setProducts(storageService.getProducts());
      onRefresh();
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storageService.updateSettings({
      noticeTickerText: noticeText,
      ownerName,
      ownerPhotoUrl,
      facebookProfile,
      contactPhone,
      contactEmail,
      productionUrl: productionUrl.trim() || 'https://ourjamalpur15117.web.app',
    });
    setSettings(updated);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
    onRefresh();
  };

  const handleResetAllData = () => {
    if (confirm('সতর্কতা: এটি সাইটের সকল ডেটা প্রাথমিক অবস্থায় ফিরিয়ে দেবে। আপনি কি নিশ্চিত?')) {
      storageService.resetToDefaults();
      setNews(storageService.getNews());
      setProducts(storageService.getProducts());
      setSettings(storageService.getSettings());
      alert('সকল ডেটা সফলভাবে রিসেট হয়েছে।');
      onRefresh();
    }
  };

  const handleApproveRequest = (id: string) => {
    storageService.updateMonetizationRequestStatus(id, 'approved');
    setMonetizationRequests(storageService.getMonetizationRequests());
    setProducts(storageService.getProducts());
    setAdBanners(storageService.getAdBanners());
    alert('পেমেন্ট ভেরিফাইড ও সেবা সক্রিয় করা হয়েছে!');
    onRefresh();
  };

  const handleRejectRequest = (id: string) => {
    const note = prompt('বাতিল করার কারণ লিখুন (ঐচ্ছিক):') || 'পেমেন্ট TrxID মিলেনি';
    storageService.updateMonetizationRequestStatus(id, 'rejected', note);
    setMonetizationRequests(storageService.getMonetizationRequests());
    onRefresh();
  };

  const handleCreateAdBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle || !newBannerAdvertiser) {
      alert('বিজ্ঞাপনের শিরোনাম ও বিজ্ঞাপনদাতার নাম দিন');
      return;
    }

    storageService.addAdBanner({
      title: newBannerTitle,
      subtitle: newBannerSubtitle,
      advertiserName: newBannerAdvertiser,
      advertiserPhone: newBannerPhone,
      placement: newBannerPlacement,
      amountPaid: Number(newBannerAmount) || 0,
      status: 'active',
      expiresAt: newBannerExpiry,
    });

    setAdBanners(storageService.getAdBanners());
    setNewBannerTitle('');
    setNewBannerSubtitle('');
    setNewBannerAdvertiser('');
    alert('নতুন ব্যানার বিজ্ঞাপন সফলভাবে যোগ করা হয়েছে!');
    onRefresh();
  };

  const handleDeleteAdBanner = (id: string) => {
    if (confirm('আপনি কি নিশ্চিত এই ব্যানারটি মুছে ফেলতে চান?')) {
      storageService.deleteAdBanner(id);
      setAdBanners(storageService.getAdBanners());
      onRefresh();
    }
  };

  const handleApplyFromCalculator = (params: {
    placement: 'home_top' | 'marketplace' | 'news' | 'sidebar';
    durationDays: number;
    estimatedPrice: number;
    adType: string;
    advertiserNote?: string;
  }) => {
    setNewBannerPlacement(params.placement);
    setNewBannerAmount(String(params.estimatedPrice));
    const d = new Date();
    d.setDate(d.getDate() + params.durationDays);
    setNewBannerExpiry(d.toISOString().split('T')[0]);
    if (params.advertiserNote && !newBannerSubtitle) {
      setNewBannerSubtitle(params.advertiserNote);
    }
    setActiveAdminTab('monetization');
    setTimeout(() => {
      const el = document.getElementById('add-banner-form-container');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const totalEarned = monetizationRequests
    .filter((r) => r.status === 'approved')
    .reduce((acc, curr) => acc + curr.amount, 0) +
    adBanners.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);

  const pendingCount = monetizationRequests.filter((r) => r.status === 'pending').length;

  const currentStoredUser = storageService.getCurrentUser();
  if (!isUserAdmin(currentStoredUser)) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/60 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center border border-rose-200 dark:border-rose-800">
          <Shield className="w-8 h-8 stroke-[2.2]" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">অননুমোদিত প্রবেশ</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          আপনার এই প্যানেলে প্রবেশের অনুমতি নেই। শুধুমাত্র অনুমোদিত অ্যাডমিন আইডি ও পাসওয়ার্ড দিয়ে প্রবেশ করা যাবে।
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-800/80 text-purple-200 text-xs font-bold mb-3 border border-purple-500/40">
            <Shield className="w-3.5 h-3.5" />
            <span>সেন্ট্রাল অ্যাডমিন কন্ট্রোল রুম — পরিচালক: মাসুদ রানা</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400 text-slate-900" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Our Jamalpur অ্যাডমিনিস্ট্রেশন পোর্টাল
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 mt-1">
            সংবাদ প্রকাশ, পণ্য নিয়ন্ত্রণ, বিজ্ঞাপন সেটিংস ও আয়-ব্যয় ব্যবস্থাপনা।
          </p>
        </div>

        {/* Tab Controls & Theme Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <ThemeToggle variant="compact" />
          {[
            { id: 'dashboard', label: 'পরিসংখ্যান', icon: Layers },
            { id: 'monetization', label: `ইনকাম ও বিজ্ঞাপন (${pendingCount > 0 ? `+${pendingCount}` : 'সক্রিয়'})`, icon: DollarSign, highlight: pendingCount > 0 },
            { id: 'ad_calculator', label: 'বিজ্ঞাপন ক্যালকুলেটর', icon: Calculator },
            { id: 'app_control', label: 'অ্যাপ লিংক ও আপডেট', icon: Share2 },
            { id: 'news', label: 'সংবাদ', icon: Newspaper },
            { id: 'products', label: 'পণ্য নিয়ন্ত্রণ', icon: ShoppingBag },
            { id: 'settings', label: 'সেটিংস', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer relative ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md'
                    : tab.highlight
                    ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40 hover:bg-amber-500/40'
                    : 'bg-white/10 hover:bg-white/20 text-purple-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Admin Subviews */}
      {activeAdminTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-bold block">মোট পণ্য তালিকা</span>
              <span className="text-2xl font-black text-emerald-700 mt-1 block">{products.length} টি</span>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-bold block">প্রকাশিত সংবাদ</span>
              <span className="text-2xl font-black text-blue-700 mt-1 block">{news.length} টি</span>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-bold block">নিবন্ধিত রক্তদাতা</span>
              <span className="text-2xl font-black text-rose-700 mt-1 block">{donors.length} জন</span>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-bold block">মোট সদস্য</span>
              <span className="text-2xl font-black text-purple-700 mt-1 block">{users.length} জন</span>
            </div>
          </div>

          {/* Quick Notice Preview */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-amber-900">
              <Megaphone className="w-4 h-4 text-amber-600" />
              <span><strong>বর্তমান স্ক্রোলিং বিজ্ঞপ্তি:</strong> {settings.noticeTickerText}</span>
            </div>
            <button
              onClick={() => setActiveAdminTab('settings')}
              className="text-xs text-amber-800 font-bold hover:underline shrink-0"
            >
              পরিবর্তন করুন →
            </button>
          </div>

          {/* App Link & Update Control Quick Card (Admin Only) */}
          <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-5 border border-teal-500/40 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center shrink-0 shadow-inner">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-base text-white">
                    অ্যাপ লিংক ও আপডেট কন্ট্রোল
                  </h3>
                  <span className="bg-purple-700/90 border border-purple-400/50 text-purple-200 text-[10px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span>শুধুমাত্র অ্যাডমিন</span>
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                  সাধারণ ব্যবহারকারীদের জন্য এই ফিচারগুলো বন্ধ রয়েছে। এখান থেকেই অফিসিয়াল লিংক কপি/শেয়ার করুন এবং নতুন অ্যাপ আপডেট ম্যানেজ করুন।
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setActiveAdminTab('app_control')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>কন্ট্রোল প্যানেল খুলুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Monetization & Ad Analytics Chart */}
          <AdminMonetizationChart
            monetizationRequests={monetizationRequests}
            adBanners={adBanners}
          />
        </div>
      )}

      {/* Monetization Subview */}
      {activeAdminTab === 'monetization' && (
        <div className="space-y-6">
          {/* Revenue Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl p-5 border border-emerald-700/50 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-300 font-bold">মোট অর্জিত আয়</span>
                <span className="p-2 bg-emerald-500/20 rounded-xl text-emerald-300">
                  <DollarSign className="w-5 h-5" />
                </span>
              </div>
              <div className="text-3xl font-black mt-2">৳ {totalEarned.toLocaleString('bn-BD')}</div>
              <p className="text-[11px] text-emerald-200/80 mt-1">বিজ্ঞাপন ও বুস্টিং থেকে সর্বমোট প্রাপ্তি</p>
            </div>

            <div className="bg-gradient-to-br from-amber-900 to-orange-950 text-white rounded-2xl p-5 border border-amber-700/50 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-300 font-bold">পেন্ডিং আবেদন</span>
                <span className="p-2 bg-amber-500/20 rounded-xl text-amber-300">
                  <Zap className="w-5 h-5" />
                </span>
              </div>
              <div className="text-3xl font-black mt-2">{pendingCount} টি</div>
              <p className="text-[11px] text-amber-200/80 mt-1">টাকা যাচাই ও অ্যাপ্রুভালের অপেক্ষায়</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-2xl p-5 border border-purple-700/50 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-300 font-bold">সক্রিয় ব্যানার বিজ্ঞাপন</span>
                <span className="p-2 bg-purple-500/20 rounded-xl text-purple-300">
                  <Sparkles className="w-5 h-5" />
                </span>
              </div>
              <div className="text-3xl font-black mt-2">{adBanners.filter((b) => b.status === 'active').length} টি</div>
              <p className="text-[11px] text-purple-200/80 mt-1">অ্যাপে লাইভ প্রদর্শিত হচ্ছে</p>
            </div>
          </div>

          {/* Official Payment Accounts Info for Admin */}
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-purple-950">
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-purple-700 shrink-0" />
              <div>
                <strong>আপনার অফিসিয়াল পেমেন্ট গ্রহণ নম্বর:</strong> {OWNER_PAYMENT_INFO.phone} (বিকাশ / নগদ / রকেট পার্সোনাল)
                <span className="block text-[11px] text-purple-700">ব্যবহারকারীরা এই নম্বরে Send Money করে আবেদন জমা দিচ্ছেন।</span>
              </div>
            </div>
            <a
              href="tel:01315481879"
              className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold shrink-0 shadow-xs"
            >
              হেল্পলাইন চেক
            </a>
          </div>

          {/* Interactive Monetization Analytics Chart (Recharts) */}
          <AdminMonetizationChart
            monetizationRequests={monetizationRequests}
            adBanners={adBanners}
          />

          {/* Quick Ad Pricing Calculator Card in Monetization Tab */}
          <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-5 sm:p-6 text-white border border-purple-700/50 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/30 text-amber-300 flex items-center justify-center border border-purple-500/40 shrink-0">
                <Calculator className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-white">
                    ইন্টারেক্টিভ অ্যাড প্রাইসিং ও কোটেশন ক্যালকুলেটর
                  </h4>
                  <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black">
                    নতুন টুল
                  </span>
                </div>
                <p className="text-xs text-purple-200/90 leading-relaxed">
                  বিজ্ঞাপনের মেয়াদ (দিন), প্লেসমেন্ট এবং ধরন (ব্যানার বা ভিডিও) দিয়ে তাৎক্ষণিক বাজারমূল্য হিসাব করুন এবং ক্লায়েন্টের জন্য কোটেশন তৈরি করুন।
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveAdminTab('ad_calculator')}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
            >
              <Calculator className="w-4 h-4" />
              <span>ক্যালকুলেটরে হিসাব করুন</span>
            </button>
          </div>

          {/* Pending Requests Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>বিজ্ঞাপন ও বুস্টিং আবেদন তালিকা</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {monetizationRequests.length}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ব্যবহারকারীদের পাঠানো TrxID যাচাই করে অ্যাপ্রুভ বা রিজেক্ট করুন
                </p>
              </div>
            </div>

            {monetizationRequests.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
                কোনো বিজ্ঞাপন বা বুস্টিং আবেদন নেই।
              </div>
            ) : (
              <div className="space-y-3">
                {monetizationRequests.map((req) => (
                  <div
                    key={req.id}
                    className={`p-4 rounded-2xl border transition ${
                      req.status === 'pending'
                        ? 'bg-amber-50/40 border-amber-300'
                        : req.status === 'approved'
                        ? 'bg-emerald-50/30 border-emerald-200'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                              req.status === 'pending'
                                ? 'bg-amber-500 text-white'
                                : req.status === 'approved'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-rose-500 text-white'
                            }`}
                          >
                            {req.status === 'pending' ? 'পেন্ডিং' : req.status === 'approved' ? 'অ্যাপ্রুভড' : 'বাতিল'}
                          </span>

                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {req.packageTitle}
                          </span>

                          <span className="text-xs text-slate-500">তারিখ: {req.submittedAt}</span>
                        </div>

                        <h4 className="text-sm font-extrabold text-slate-900">
                          {req.businessOrTitle}
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-slate-600 pt-1">
                          <div>
                            <strong>আবেদনকারী:</strong> {req.advertiserName} (
                            <a href={`tel:${req.advertiserPhone}`} className="text-emerald-700 font-bold hover:underline">
                              {req.advertiserPhone}
                            </a>
                            )
                          </div>
                          <div>
                            <strong>পেমেন্ট মেথড:</strong> <span className="uppercase font-bold text-purple-700">{req.paymentMethod}</span> (প্রেরক: {req.senderNumber})
                          </div>
                          <div className="flex items-center gap-1.5">
                            <strong>TrxID:</strong>
                            <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono font-bold text-slate-900">
                              {req.trxId}
                            </code>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(req.trxId);
                                setCopiedTrx(req.id);
                                setTimeout(() => setCopiedTrx(null), 2000);
                              }}
                              className="text-[10px] text-purple-700 font-semibold hover:underline cursor-pointer"
                            >
                              {copiedTrx === req.id ? 'কপি হয়েছে!' : 'কপি'}
                            </button>
                          </div>
                        </div>

                        {req.adminNote && (
                          <p className="text-xs text-slate-500 italic mt-1">
                            নোট: {req.adminNote}
                          </p>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveRequest(req.id)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                            >
                              <Check className="w-4 h-4" />
                              <span>ভেরিফাই ও অ্যাপ্রুভ</span>
                            </button>
                            <button
                              onClick={() => handleRejectRequest(req.id)}
                              className="px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                              <span>বাতিল</span>
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('আবেদন রেকর্ডটি মুছে ফেলতে চান?')) {
                              storageService.deleteMonetizationRequest(req.id);
                              setMonetizationRequests(storageService.getMonetizationRequests());
                              onRefresh();
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-lg"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Local Ad Banner & Active Banners Management */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create Banner Form */}
            <div id="add-banner-form-container" className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-purple-700" />
                  <h3 className="font-extrabold text-base text-slate-900">নতুন ব্যানার বিজ্ঞাপন যোগ করুন</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveAdminTab('ad_calculator')}
                  className="text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 flex items-center gap-1 cursor-pointer transition"
                  title="বিজ্ঞাপনের রেট হিসাব করতে ক্যালকুলেটরে যান"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>রেট ক্যালকুলেটর</span>
                </button>
              </div>

              <form onSubmit={handleCreateAdBanner} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">বিজ্ঞাপনের শিরোনাম *</label>
                  <input
                    type="text"
                    required
                    value={newBannerTitle}
                    onChange={(e) => setNewBannerTitle(e.target.value)}
                    placeholder="উদাঃ জামালপুর বস্ত্র বিতান — ২০% ছাড়"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">বিজ্ঞাপনদাতার নাম / প্রতিষ্ঠান *</label>
                  <input
                    type="text"
                    required
                    value={newBannerAdvertiser}
                    onChange={(e) => setNewBannerAdvertiser(e.target.value)}
                    placeholder="উদাঃ রফিক ফ্যাশন হাউস"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">যোগাযোগ মোবাইল নম্বর</label>
                  <input
                    type="tel"
                    value={newBannerPhone}
                    onChange={(e) => setNewBannerPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">প্লেসমেন্ট</label>
                    <select
                      value={newBannerPlacement}
                      onChange={(e) => setNewBannerPlacement(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    >
                      <option value="home_top">হোম পেজ শীর্ষ</option>
                      <option value="marketplace">মার্কেটপ্লেস</option>
                      <option value="news">সংবাদ পেজ</option>
                      <option value="sidebar">সাইডবার</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">প্রাপ্ত ফি (৳)</label>
                    <input
                      type="number"
                      value={newBannerAmount}
                      onChange={(e) => setNewBannerAmount(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">মেয়াদ উত্তীর্ণের তারিখ</label>
                  <input
                    type="text"
                    value={newBannerExpiry}
                    onChange={(e) => setNewBannerExpiry(e.target.value)}
                    placeholder="২০২৬-১২-৩১"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl transition cursor-pointer shadow-md mt-2"
                >
                  ব্যানার বিজ্ঞাপন প্রকাশ করুন
                </button>
              </form>
            </div>

            {/* Active Banners List */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center justify-between">
                <span>বর্তমান সক্রিয় ব্যানার তালিকা</span>
                <span className="text-xs text-slate-500 font-normal">({adBanners.length} টি)</span>
              </h3>

              <div className="space-y-2.5 max-h-[420px] overflow-y-auto">
                {adBanners.map((b) => (
                  <div key={b.id} className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                          {b.placement}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{b.advertiserName}</span>
                        <span className="text-[11px] text-emerald-700 font-bold">৳ {b.amountPaid}</span>
                      </div>
                      <h5 className="text-xs text-slate-700 font-medium">{b.title}</h5>
                      <div className="text-[10px] text-slate-500">
                        মোবাইল: {b.advertiserPhone} | মেয়াদ: {b.expiresAt}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAdBanner(b.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Ad Pricing Calculator Subview */}
      {activeAdminTab === 'ad_calculator' && (
        <div className="space-y-6 animate-fade-in">
          <AdPricingCalculator onApplyToBanner={handleApplyFromCalculator} />
        </div>
      )}

      {/* News Management Subview */}
      {activeAdminTab === 'news' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Post News Form */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-blue-600" />
              <span>নতুন সংবাদ প্রকাশ করুন</span>
            </h3>

            <form onSubmit={handleCreateNews} className="space-y-3 mt-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">খবরের শিরোনাম *</label>
                <input
                  type="text"
                  required
                  placeholder="শিরোনাম"
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ক্যাটেগরি</label>
                  <select
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    {['সদর', 'ইসলামপুর', 'মেলান্দহ', 'দেওয়ানগঞ্জ', 'মাদারগঞ্জ', 'সরিষাবাড়ী', 'বকশীগঞ্জ', 'শিক্ষা', 'চাকরি', 'ঘটনা'].map(
                      (c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">উপজেলা</label>
                  <input
                    type="text"
                    value={newsLocation}
                    onChange={(e) => setNewsLocation(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ছবির URL</label>
                <input
                  type="url"
                  value={newsImage}
                  onChange={(e) => setNewsImage(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">সারসংক্ষেপ (Summary) *</label>
                <textarea
                  rows={2}
                  required
                  value={newsSummary}
                  onChange={(e) => setNewsSummary(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">বিস্তারিত বিবরণ</label>
                <textarea
                  rows={3}
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl transition cursor-pointer"
              >
                সংবাদ প্রকাশ করুন
              </button>
            </form>
          </div>

          {/* Existing News List */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-base text-slate-900">সকল প্রকাশিত সংবাদ ({news.length})</h3>
            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {news.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1 mt-0.5">{item.title}</h4>
                      <p className="text-[10px] text-slate-400">{item.date} • {item.location}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteNews(item.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                    title="মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product Management Subview */}
      {activeAdminTab === 'products' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-base text-slate-900">মার্কেটপ্লেসের পণ্য নিয়ন্ত্রণ ({products.length})</h3>
          <div className="divide-y divide-slate-100">
            {products.map((prod) => (
              <div key={prod.id} className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={prod.images[0]} alt={prod.title} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {prod.category}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1 mt-0.5">{prod.title}</h4>
                    <p className="text-[11px] text-slate-500">
                      ৳ {prod.price} • বিক্রেতা: {prod.sellerName} ({prod.sellerPhone})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                    title="মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Subview */}
      {activeAdminTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-2xl mx-auto space-y-5">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-600" />
            <span>ওয়েবসাইট গ্লোবাল সেটিংস</span>
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ব্রেকিং নোটিস টিকার টেক্সট (Notice Ticker)
              </label>
              <input
                type="text"
                value={noticeText}
                onChange={(e) => setNoticeText(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">উদ্যোক্তা / স্বত্বাধিকারীর নাম</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">প্রোফাইল পিকচার (ছবি লিংক বা ফটো আপলোড)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://... অথবা নিচের ফাইল সিলেক্ট করুন"
                  value={ownerPhotoUrl}
                  onChange={(e) => setOwnerPhotoUrl(e.target.value)}
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white text-xs"
                />
                <label className="px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition">
                  <span>আপলোড</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setOwnerPhotoUrl(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ফেসবুক প্রোফাইল লিংক</label>
              <input
                type="text"
                value={facebookProfile}
                onChange={(e) => setFacebookProfile(e.target.value)}
                placeholder="https://www.facebook.com/masudrana15117"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">যোগাযোগের ফোন নম্বর</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">অফিসিয়াল ইমেইল</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>অফিসিয়াল লাইভ ওয়েবসাইট ইউআরএল (Firebase Production URL)</span>
                <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                  লাইভ লিঙ্ক
                </span>
              </label>
              <input
                type="url"
                value={productionUrl}
                onChange={(e) => setProductionUrl(e.target.value)}
                placeholder="https://ourjamalpur15117.web.app"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white font-mono text-xs"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                সর্বশেষ আপডেট সংস্করণ লিংক ও সোশ্যালে শেয়ারিংয়ের জন্য এই লিংকটি ব্যবহৃত হয়।
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetAllData}
                className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ফ্যাক্টরি ডাটা রিসেট</span>
              </button>

              <button
                type="submit"
                className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                {settingsSaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>সেটিংস সংরক্ষিত!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>সেটিংস সংরক্ষণ করুন</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Local Storage & Offline Cache Engine Block */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 border border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold ring-1 ring-emerald-500/40">
                  <HardDrive className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg sm:text-xl text-white flex items-center gap-2">
                    <span>লোকাল স্টোরেজ ও অফলাইন ক্যাশ ইঞ্জিন</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    সম্পূর্ণ সাইটের ডাটাবেজ ব্যাকআপ, ক্যাশ অপ্টিমাইজেশন ও অফলাইন PWA সিঙ্ক্রোনাইজেশন
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  storageService.updateAndSyncOfflineCache();
                  alert('লোকাল স্টোরেজ ও অফলাইন ক্যাশ সফলভাবে আপডেট ও সিঙ্ক হয়েছে!');
                  onRefresh();
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>এক-ক্লিকে ক্যাশ আপডেট</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[11px]">মেমোরি দখল</span>
                <span className="font-bold text-white text-sm">{storageService.getStorageStats().totalKilobytes} KB</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[11px]">মোট রেকর্ড</span>
                <span className="font-bold text-emerald-400 text-sm">{storageService.getStorageStats().totalRecords} টি</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[11px]">অফলাইন স্ট্যাটাস</span>
                <span className="font-bold text-teal-400 text-sm">সক্রিয় (Active)</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[11px]">সার্ভিস ওয়ার্কার</span>
                <span className="font-bold text-amber-300 text-sm">v3 কাস্টম ক্যাশ</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  storageService.exportAllDataAsJSON();
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>সম্পূর্ণ ডাটাবেজ ব্যাকআপ (JSON)</span>
              </button>

              <label className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>ব্যাকআপ রিস্টোর (JSON)</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const content = event.target?.result as string;
                      const res = storageService.importDataFromJSON(content);
                      alert(res.message);
                      if (res.success) onRefresh();
                    };
                    reader.readAsText(file);
                    e.target.value = '';
                  }}
                />
              </label>

              <button
                onClick={() => {
                  storageService.clearTemporaryCache();
                  alert('অপ্রয়োজনীয় টেম্পোরারি ক্যাশ ক্লিয়ার করা হয়েছে!');
                  onRefresh();
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>টেম্প ফাইল ক্লিয়ার</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Link & Update Control Subview (Admin Only) */}
      {activeAdminTab === 'app_control' && (
        <div className="space-y-6 animate-fade-in">
          {/* Security & Privacy Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-600/50 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 flex items-center justify-center shrink-0 shadow-inner">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-black text-white">
                      অ্যাপ লিংক ও আপডেট কন্ট্রোল সেন্টার
                    </h2>
                    <span className="bg-emerald-700/80 border border-emerald-400/60 text-emerald-100 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      গোপন ও সংরক্ষিত
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    আপনার নির্দেশনা মোতাবেক সাধারণ ইউজারদের স্ক্রিন (হেডার, হোমভিউ, ফুটার, মেন্যু) থেকে অ্যাপ আপডেট এবং শেয়ার লিংক সম্পূর্ণ বন্ধ ও লুকায়িত করা হয়েছে। শুধুমাত্র অ্যাডমিন হিসেবে আপনি এখান থেকে সরাসরি লিংক শেয়ার ও ভার্সন কন্ট্রোল করতে পারবেন।
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ইউজারদের জন্য সুরক্ষিত</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Box: Official App Link & Share */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
                    <Link2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      অফিসিয়াল অ্যাপ লিংক শেয়ার
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      গ্রাহক ও ব্যবহারকারীদের পাঠাতে নিচের যেকোনো লিংক কপি করুন
                    </p>
                  </div>
                </div>
                {onOpenShareApp && (
                  <button
                    onClick={onOpenShareApp}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>শেয়ার উইন্ডো</span>
                  </button>
                )}
              </div>

              {/* Link 1: Firebase Production Link */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>১. ফায়ারবেস হোস্টিং লিংক (.web.app)</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-md">
                    মূল ডোমেইন
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={settings.productionUrl || 'https://ourjamalpur15117.web.app'}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(settings.productionUrl || 'https://ourjamalpur15117.web.app');
                      setCopiedLinkType('firebase');
                      setTimeout(() => setCopiedLinkType(null), 2500);
                    }}
                    className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    {copiedLinkType === 'firebase' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-amber-300" />
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
              </div>

              {/* Link 2: Force Update Bypass Link */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>২. অটো-আপডেট লিংক (ক্যাশ বাইপাস)</span>
                  </span>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-extrabold bg-teal-50 dark:bg-teal-950/70 px-2 py-0.5 rounded-md">
                    পুরনো ক্যাশ পরিষ্কারক
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${settings.productionUrl || 'https://ourjamalpur15117.web.app'}?v=latest&update=true`}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${settings.productionUrl || 'https://ourjamalpur15117.web.app'}?v=latest&update=true`);
                      setCopiedLinkType('bypass');
                      setTimeout(() => setCopiedLinkType(null), 2500);
                    }}
                    className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    {copiedLinkType === 'bypass' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-amber-300" />
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
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  💡 কোনো ইউজারের ফোনে যদি পুরনো ডিজাইন বা ক্যাশ আটকে থাকে, তবে তাকে এই লিংক পাঠালে সাথে সাথে নতুন ভার্সন লোড হবে।
                </p>
              </div>

              {/* Link 3: Official Live Production Portal Link */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>৩. সর্বশেষ অফিশিয়াল লাইভ ওয়েবসাইট লিংক</span>
                  </span>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-extrabold bg-purple-50 dark:bg-purple-950/70 px-2 py-0.5 rounded-md">
                    সার্বজনীন লিংক
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={settings.productionUrl || 'https://ourjamalpur15117.web.app'}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(settings.productionUrl || 'https://ourjamalpur15117.web.app');
                      setCopiedLinkType('current');
                      setTimeout(() => setCopiedLinkType(null), 2500);
                    }}
                    className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    {copiedLinkType === 'current' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-amber-300" />
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
                    href={settings.productionUrl || 'https://ourjamalpur15117.web.app'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs transition"
                    title="ব্রাউজারে ওপেন করুন"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Quick Social Share Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-2">
                  সরাসরি সোশ্যালে পাঠান:
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Our Jamalpur (আমাদের জামালপুর) ডিজিটাল সেবা পোর্টাল: ${settings.productionUrl || 'https://ourjamalpur15117.web.app'}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 font-extrabold flex items-center justify-center gap-1.5 transition text-center border border-emerald-200 dark:border-emerald-800"
                  >
                    <span>💬 WhatsApp</span>
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(settings.productionUrl || 'https://ourjamalpur15117.web.app')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-800 dark:text-blue-300 font-extrabold flex items-center justify-center gap-1.5 transition text-center border border-blue-200 dark:border-blue-800"
                  >
                    <span>🔵 Facebook</span>
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(settings.productionUrl || 'https://ourjamalpur15117.web.app')}&text=${encodeURIComponent('Our Jamalpur ডিজিটাল প্ল্যাটফর্ম')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 text-sky-800 dark:text-sky-300 font-extrabold flex items-center justify-center gap-1.5 transition text-center border border-sky-200 dark:border-sky-800"
                  >
                    <span>✈️ Telegram</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Box: Central App Update & Version Engine */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      অ্যাপ আপডেট ও ক্যাশ ইঞ্জিন
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      অ্যাডমিন হিসেবে এক ক্লিকে সম্পূর্ণ অ্যাপ রিফ্রেশ ও সিঙ্ক করুন
                    </p>
                  </div>
                </div>
                {onOpenAppUpdate && (
                  <button
                    onClick={onOpenAppUpdate}
                    className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>আপডেট মডাল</span>
                  </button>
                )}
              </div>

              {/* Status Box */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium block">সিস্টেম সংস্করণ</span>
                  <span className="font-black text-slate-900 dark:text-white text-sm block mt-0.5">
                    v4.2 (Production Stable)
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium block">হোস্টিং অবস্থান</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm block mt-0.5 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Firebase (.web.app)</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium block">সার্ভিস ওয়ার্কার PWA</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400 block mt-0.5">
                    সক্রিয় ও অফলাইন সাপোর্টেড
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium block">ডাটাবেজ আইটেম</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400 block mt-0.5">
                    {news.length + products.length + donors.length} টি রেকর্ড সংরক্ষিত
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  disabled={isUpdatingApp}
                  onClick={() => {
                    setIsUpdatingApp(true);
                    storageService.forceFullAppUpdate();
                    setTimeout(() => {
                      setIsUpdatingApp(false);
                      onRefresh();
                      alert('✅ অ্যাপ সংস্করণ সফলভাবে আপডেট ও ক্যাশ মেমোরি রিফ্রেশ করা হয়েছে!');
                    }, 1200);
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-800 hover:from-teal-800 hover:to-emerald-900 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 text-amber-300 ${isUpdatingApp ? 'animate-spin' : ''}`} />
                  <span>
                    {isUpdatingApp ? 'আপডেট প্রসেস হচ্ছে...' : 'তাত্ক্ষণিক সম্পূর্ণ অ্যাপ আপডেট ও ক্যাশ রিফ্রেশ'}
                  </span>
                </button>

                <button
                  disabled={isSyncingCache}
                  onClick={() => {
                    setIsSyncingCache(true);
                    storageService.updateAndSyncOfflineCache();
                    setTimeout(() => {
                      setIsSyncingCache(false);
                      onRefresh();
                      alert('✅ অফলাইন ক্যাশ মেমোরি ও লোকাল ডাটা সফলভাবে সিঙ্ক সম্পন্ন হয়েছে!');
                    }, 800);
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition cursor-pointer disabled:opacity-50"
                >
                  <Database className={`w-4 h-4 text-teal-500 ${isSyncingCache ? 'animate-spin' : ''}`} />
                  <span>
                    {isSyncingCache ? 'সিঙ্ক হচ্ছে...' : 'অফলাইন ডাটাবেজ ও ক্যাশ মেমোরি সিঙ্ক'}
                  </span>
                </button>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-3.5 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <span className="text-sm">ℹ️</span>
                <p className="leading-relaxed">
                  এই বাটনে ক্লিক করলে আপনার ব্রাউজার ও অ্যাপ্লিকেশনের সমস্ত স্ট্যাটিক অ্যাসেট ও লোকাল ডাটা পুনরায় ফ্রেশ কপি দিয়ে সিঙ্ক হবে এবং স্বয়ংক্রিয়ভাবে v4.2 এর সর্বশেষ কোড লোড হবে।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
