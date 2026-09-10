import React, { useState } from 'react';
import {
  Search,
  PlusCircle,
  Menu,
  X,
  User,
  Shield,
  Download,
  ShoppingBag,
  Newspaper,
  Bus,
  Train,
  Hospital,
  UserCheck,
  Pill,
  Briefcase,
  BookOpen,
  HelpCircle,
  HeartPulse,
  Clock,
  TrendingUp,
  Building2,
  Info,
  Layers,
  ChevronDown,
  Smartphone,
  ArrowRightLeft,
  HardDrive,
  Cloud,
  ShieldAlert,
  Share2,
  RefreshCw,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { TabType, User as UserType, Upazila } from '../types';
import { ThemeToggle } from './ThemeToggle';
import jamalpurLogo from '../assets/images/jamalpur_emblem_logo_1788191831752.jpg';
import { isUserAdmin } from '../services/authService';

interface Props {
  activeTab: TabType;
  onNavigate: (tab: TabType) => void;
  onOpenSearch: () => void;
  onOpenExportZip: () => void;
  onOpenInstallApp?: () => void;
  onOpenStorageCache?: () => void;
  onOpenAppUpdate?: () => void;
  selectedUpazila?: Upazila;
  onOpenUpazilaModal?: () => void;
  currentUser: UserType | null;
  onOpenAuth: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  onNavigate,
  onOpenSearch,
  onOpenExportZip,
  onOpenInstallApp,
  onOpenStorageCache,
  onOpenAppUpdate,
  selectedUpazila = 'সকল উপজেলা',
  onOpenUpazilaModal,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const isAdmin = isUserAdmin(currentUser);

  const mainNavLinks: Array<{ id: TabType; label: string; icon: any }> = [
    { id: 'home', label: 'হোম', icon: null },
    { id: 'mfs-transfer', label: 'MFS আন্তঃ লেনদেন', icon: ArrowRightLeft },
    { id: 'marketplace', label: 'মার্কেটপ্লেস', icon: ShoppingBag },
    { id: 'news', label: 'স্থানীয় খবর', icon: Newspaper },
    { id: 'transport', label: 'বাস ও ট্রেন', icon: Bus },
    { id: 'hospital', label: 'হাসপাতাল ও ডাক্তার', icon: Hospital },
    { id: 'jobs', label: 'চাকরি', icon: Briefcase },
    { id: 'blood-donor', label: 'রক্তদাতা', icon: HeartPulse },
    { id: 'market-price', label: 'বাজারদর', icon: TrendingUp },
  ];

  const serviceLinks: Array<{ id: TabType; label: string; icon: any }> = [
    { id: 'weather', label: 'আবহাওয়া ও নদী পূর্বাভাস', icon: Cloud },
    { id: 'helplines', label: 'জরুরি হেল্পলাইন ও হটলাইন', icon: ShieldAlert },
    { id: 'mfs-transfer', label: 'MFS আন্তঃ লেনদেন ও ফান্ড ট্রান্সফার', icon: ArrowRightLeft },
    { id: 'bus', label: 'বাস সময়সূচী', icon: Bus },
    { id: 'train', label: 'ট্রেন সময়সূচী', icon: Train },
    { id: 'doctors', label: 'ডাক্তার ডিরেক্টরি', icon: UserCheck },
    { id: 'medicine', label: 'ঔষধ নির্দেশিকা', icon: Pill },
    { id: 'education', label: 'শিক্ষা ও বই (Class 1-10)', icon: BookOpen },
    { id: 'quiz', label: 'অনলাইন কুইজ প্রতিযোগিতা', icon: HelpCircle },
    { id: 'prayer', label: 'নামাজের সময়সূচী', icon: Clock },
    { id: 'business', label: 'লোকাল ব্যবসা ডিরেক্টরি', icon: Building2 },
    { id: 'about', label: 'আমাদের সম্পর্কে ও উদ্যোক্তা', icon: Info },
  ];

  const handleNavClick = (tab: TabType) => {
    onNavigate(tab);
    setIsMobileMenuOpen(false);
    setIsServicesDropdownOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* Brand & User Profile Top Row */}
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Brand Logo & District Identity */}
          <div
            id="brand-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0 group"
          >
            <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-md ring-2 ring-emerald-500/40 border border-emerald-400/50 bg-emerald-950 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
              <img
                src={jamalpurLogo}
                alt="Our Jamalpur Emblem Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
                  Our Jamalpur
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60 hidden sm:inline-block">
                  জামালপুর জেলা
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden xs:inline-block">
                ডিজিটাল পোর্টাল ও মার্কেটপ্লেস
              </span>
            </div>
          </div>

          {/* Quick Search Button on Navbar */}
          <button
            id="navbar-search-btn"
            onClick={onOpenSearch}
            className="flex-1 max-w-xs md:max-w-sm hidden sm:flex items-center justify-between px-3.5 py-2 bg-slate-100/90 hover:bg-slate-100 dark:bg-slate-800/90 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full border border-slate-200 dark:border-slate-700 text-xs sm:text-sm cursor-pointer transition shadow-2xs"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>খবর, পণ্য, বাস, ডাক্তার খুঁজুন...</span>
            </span>
            <kbd className="hidden lg:inline-block bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-[10px] px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 font-mono shadow-2xs">
              Search
            </kbd>
          </button>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Mobile Search Icon */}
            <button
              id="mobile-search-trigger"
              onClick={onOpenSearch}
              className="sm:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              title="খুঁজুন"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Post Free Ad Button */}
            <button
              id="post-ad-btn"
              onClick={() => handleNavClick('sell')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-xl shadow-xs hover:shadow-md transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden xs:inline">বিজ্ঞাপন দিন</span>
              <span className="xs:hidden">পোস্ট</span>
            </button>

            {/* Install App Button */}
            {onOpenInstallApp && (
              <button
                id="install-app-navbar-btn"
                onClick={onOpenInstallApp}
                className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:from-emerald-800 hover:to-teal-800 text-white font-extrabold text-xs px-3 py-2 rounded-xl shadow-xs border border-emerald-500/40 transition cursor-pointer"
                title="Our Jamalpur মোবাইল অ্যাপ ইনস্টল করুন"
              >
                <Smartphone className="w-4 h-4 text-amber-300 stroke-[2.5]" />
                <span className="hidden md:inline font-bold">অ্যাপ ইনস্টল</span>
                <span className="md:hidden font-bold">অ্যাপ</span>
              </button>
            )}

            {/* Live Feature Update Button */}
            {onOpenAppUpdate && (
              <button
                id="navbar-update-features-btn"
                onClick={onOpenAppUpdate}
                className="flex items-center gap-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs px-2.5 sm:px-3.5 py-2 rounded-xl shadow-xs border border-emerald-300/80 transition cursor-pointer active:scale-95"
                title="নতুন কোনো ফিচার যোগ করা হলে এখানে ক্লিক করে তাৎক্ষণিক আপডেট আনুন"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                <span className="hidden xs:inline font-black">নতুন ফিচার আনুন</span>
                <span className="xs:hidden font-black">আপডেট</span>
              </button>
            )}

            {/* Spck / ZIP Download Button */}
            <button
              id="export-zip-btn"
              onClick={onOpenExportZip}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs px-2.5 sm:px-3 py-2 rounded-xl shadow-sm border border-amber-400 transition cursor-pointer"
              title="সম্পূর্ণ প্রজেক্টের ZIP ডাউনলোড করুন (Spck Editor Ready)"
            >
              <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span className="hidden sm:inline font-bold">ZIP</span>
            </button>

            {/* Theme Toggle in Navbar */}
            <div className="hidden sm:block">
              <ThemeToggle variant="dropdown" />
            </div>

            {/* Admin Panel Link */}
            <button
              id="admin-nav-btn"
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1.5 text-xs font-bold px-2.5 sm:px-3 py-2 rounded-xl border transition cursor-pointer shadow-2xs ${
                isAdmin
                  ? 'bg-purple-600 text-white border-purple-700 hover:bg-purple-700'
                  : 'bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/80 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700'
              }`}
              title={isAdmin ? "অ্যাডমিন ড্যাশবোর্ড" : "অ্যাডমিন প্যানেল প্রবেশ"}
            >
              <Shield className={`w-3.5 h-3.5 ${isAdmin ? 'text-amber-300 stroke-[2.5]' : 'text-purple-600 dark:text-purple-400'}`} />
              <span className="hidden sm:inline">{isAdmin ? 'অ্যাডমিন ড্যাশবোর্ড' : 'অ্যাডমিন'}</span>
              <span className="sm:hidden">এডমিন</span>
            </button>

            {/* User Profile / Login */}
            {currentUser ? (
              <div className="flex items-center gap-1.5">
                <button
                  id="user-profile-btn"
                  onClick={() => handleNavClick('profile')}
                  className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/70 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
                  title="প্রোফাইল দেখুন"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline max-w-[90px] truncate">{currentUser.name}</span>
                </button>
                {onLogout && (
                  <button
                    id="navbar-logout-btn"
                    onClick={onLogout}
                    className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition cursor-pointer"
                    title="লগআউট করুন"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <button
                id="login-btn"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black dark:from-slate-700 dark:to-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer shadow-xs"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>লগইন / নিবন্ধন</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MENUBAR: Situated directly below the Brand Picture & Profile Header */}
        {/* 1. Desktop & Large Screens Menubar */}
        <div id="desktop-menubar" className="hidden lg:flex items-center justify-between border-t border-slate-100 dark:border-slate-800 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1 flex-wrap">
            {mainNavLinks.map((link) => {
              const IconComp = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {IconComp && <IconComp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                  <span>{link.label}</span>
                </button>
              );
            })}

            {/* All Services Dropdown */}
            <div className="relative">
              <button
                id="services-dropdown-trigger"
                onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                className="px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer font-semibold"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>আরও সকল সেবা</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isServicesDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-fade-in">
                  {serviceLinks.map((item) => {
                    const SvcIcon = item.icon;
                    return (
                      <button
                        key={item.id}
                        id={`dropdown-svc-${item.id}`}
                        onClick={() => handleNavClick(item.id)}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-2.5 transition cursor-pointer"
                      >
                        <SvcIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                  {onOpenStorageCache && (
                    <div className="border-t border-slate-100 dark:border-slate-700 pt-1 mt-1">
                      <button
                        id="dropdown-svc-storage"
                        onClick={() => {
                          setIsServicesDropdownOpen(false);
                          onOpenStorageCache();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 flex items-center gap-2.5 transition cursor-pointer"
                      >
                        <HardDrive className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>লোকাল স্টোরেজ ও অফলাইন ক্যাশ</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {onOpenUpazilaModal ? (
              <button
                id="navbar-upazila-badge-btn"
                onClick={onOpenUpazilaModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold transition cursor-pointer shadow-2xs group"
                title="৭টি উপজেলার বিস্তারিত ডিরেক্টরি ও জরুরি যোগাযোগ দেখুন"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping group-hover:bg-emerald-400"></span>
                <span>{selectedUpazila === 'সকল উপজেলা' ? '৭টি উপজেলায় লাইভ সেবা' : `📍 ${selectedUpazila}`}</span>
                <span className="text-[10px] bg-emerald-200/80 dark:bg-emerald-800 px-1.5 py-0.2 rounded text-emerald-900 dark:text-emerald-100 ml-0.5">
                  খুলুন
                </span>
              </button>
            ) : (
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                ৭টি উপজেলায় লাইভ সেবা
              </span>
            )}
          </div>
        </div>

        {/* 2. Mobile & Tablet Menubar: Horizontally scrollable directly below the Profile/Brand */}
        <div id="mobile-menubar-row" className="lg:hidden flex items-center gap-1.5 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800 scrollbar-none">
          {onOpenUpazilaModal && (
            <button
              id="mobile-quick-upazila-btn"
              onClick={onOpenUpazilaModal}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs flex items-center gap-1 font-black bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs cursor-pointer"
            >
              <span>🏛️ {selectedUpazila === 'সকল উপজেলা' ? '৭ উপজেলা' : selectedUpazila}</span>
            </button>
          )}
          {mainNavLinks.map((link) => {
            const IconComp = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                id={`mobile-quick-nav-${link.id}`}
                onClick={() => handleNavClick(link.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {IconComp && <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />}
                <span>{link.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs flex items-center gap-1 font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>আরও সেবা</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3 shadow-xl max-h-[80vh] overflow-y-auto">
          {/* Mobile Theme Switcher Banner */}
          <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">থিম ও মোড (নাইট মোড)</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">রাতে চোখের সুরক্ষায় ডার্ক মোড ব্যবহার করুন</span>
            </div>
            <ThemeToggle variant="compact" />
          </div>

          {/* Mobile Feature Update Card */}
          {onOpenAppUpdate && (
            <div className="p-3.5 bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 rounded-2xl border border-emerald-500/40 text-white space-y-2.5 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-amber-300 flex items-center justify-center border border-emerald-400/30">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">নতুন ফিচার ও আপডেট সিঙ্ক</h4>
                    <span className="text-[10px] text-emerald-300">সরাসরি লাইভ সার্ভার সংযোগ</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] uppercase">
                  Live Sync
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                কোডে নতুন ফিচার যোগ করা হলে নিচের বাটনে ট্যাপ করলেই আপনার ফোনে সাথে সাথে নতুন ফিচার লোড হয়ে যাবে।
              </p>
              <button
                id="mobile-drawer-update-features-btn"
                onClick={() => {
                  onOpenAppUpdate();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition active:scale-95"
              >
                <RefreshCw className="w-4 h-4 stroke-[2.5]" />
                <span>নতুন ফিচার ও আপডেট আনুন</span>
              </button>
            </div>
          )}

          <div className="font-bold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
            প্রধান মেনু
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[...mainNavLinks, ...serviceLinks].map((item) => {
              const IconComp = item.icon || Layers;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`p-2.5 rounded-xl text-left text-xs flex items-center gap-2 font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            {onOpenUpazilaModal && (
              <button
                id="mobile-drawer-upazila-btn"
                onClick={() => {
                  onOpenUpazilaModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-800 text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>🏛️ জামালপুর ৭ উপজেলা জরুরি ডিরেক্টরি ও হটলাইন</span>
              </button>
            )}
            {onOpenStorageCache && (
              <button
                id="mobile-drawer-storage-btn"
                onClick={() => {
                  onOpenStorageCache();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <HardDrive className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>লোকাল স্টোরেজ ও অফলাইন ক্যাশ ম্যানেজার</span>
              </button>
            )}
            {onOpenInstallApp && (
              <button
                id="mobile-drawer-install-app-btn"
                onClick={() => {
                  onOpenInstallApp();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Smartphone className="w-4 h-4 text-amber-300 stroke-[2.5]" />
                <span>📱 Our Jamalpur অ্যাপ ইনস্টল করুন</span>
              </button>
            )}
            {/* Admin link */}
            <button
              id="mobile-drawer-admin-btn"
              onClick={() => handleNavClick('admin')}
              className="w-full py-2.5 px-3 rounded-xl bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Shield className="w-4 h-4 text-purple-300" />
              <span>{isAdmin ? 'অ্যাডমিন কন্ট্রোল প্যানেল' : 'অ্যাডমিন প্যানেল (লগইন / প্রবেশ)'}</span>
            </button>
            {currentUser && onLogout && (
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>লগআউট ({currentUser.name})</span>
              </button>
            )}
            <button
              onClick={() => {
                onOpenExportZip();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Spck Editor ZIP ডাউনলোড করুন</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

