import React, { useState, useEffect } from 'react';
import { Download, Smartphone, CheckCircle2, Share2, RefreshCw, Sparkles, X, WifiOff } from 'lucide-react';
import { TabType, Upazila, User as UserType } from './types';
import { storageService } from './services/storageService';
import { authService, isUserAdmin } from './services/authService';

// Subcomponents
import { LiveClockHeader } from './components/LiveClockHeader';
import { EmergencyBar } from './components/EmergencyBar';
import { LiveNewsTicker } from './components/LiveNewsTicker';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { ProjectExportModal } from './components/ProjectExportModal';
import { InstallAppModal } from './components/InstallAppModal';
import { StorageCacheModal } from './components/StorageCacheModal';
import { AppUpdateModal } from './components/AppUpdateModal';
import { ShareAppModal } from './components/ShareAppModal';
import { AuthModal } from './components/AuthModal';
import { FloatingUpdateButton } from './components/FloatingUpdateButton';
import { ThemeToggle } from './components/ThemeToggle';

// Views
import { HomeView } from './components/HomeView';
import { MarketplaceView } from './components/MarketplaceView';
import { NewsView } from './components/NewsView';
import { TransportView } from './components/TransportView';
import { HealthView } from './components/HealthView';
import { MedicineView } from './components/MedicineView';
import { JobsView } from './components/JobsView';
import { EducationView } from './components/EducationView';
import { QuizView } from './components/QuizView';
import { BloodDonorView } from './components/BloodDonorView';
import { PrayerTimeView } from './components/PrayerTimeView';
import { MarketPriceView } from './components/MarketPriceView';
import { BusinessDirectoryView } from './components/BusinessDirectoryView';
import { AboutOwnerView } from './components/AboutOwnerView';
import { ProfileView } from './components/ProfileView';
import { AdminPanelView } from './components/AdminPanelView';
import { AdminLoginGuard } from './components/AdminLoginGuard';
import { MfsTransferView } from './components/MfsTransferView';
import { WeatherView } from './components/WeatherView';
import { HelplinesView } from './components/HelplinesView';
import { UpazilaHubModal } from './components/UpazilaHubModal';
import jamalpurLogo from './assets/images/jamalpur_emblem_logo_1788191831752.jpg';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedUpazila, setSelectedUpazila] = useState<Upazila>('সকল উপজেলা');
  const [currentUser, setCurrentUser] = useState<UserType | null>(storageService.getCurrentUser());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isExportZipOpen, setIsExportZipOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isStorageModalOpen, setIsStorageModalOpen] = useState(false);
  const [isUpazilaModalOpen, setIsUpazilaModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authModalAdminNotice, setAuthModalAdminNotice] = useState(false);
  const [hasUpdateWaiting, setHasUpdateWaiting] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [selectedExtraItem, setSelectedExtraItem] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const settings = storageService.getSettings();

  // Listen for Firebase Auth user session changes
  useEffect(() => {
    let initialAuthChecked = false;
    const unsubscribe = authService.subscribeToAuthState((user) => {
      setCurrentUser(user);
      if (!initialAuthChecked) {
        initialAuthChecked = true;
        // On any device/mobile where no user is logged in, show user login option first!
        if (!user) {
          setIsAuthOpen(true);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Listen for PWA service worker update notification
    const handleUpdateFound = () => {
      setHasUpdateWaiting(true);
    };
    window.addEventListener('oj-app-update-available', handleUpdateFound);

    // Check URL parameters for update / sync triggers
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('update') === 'true' || urlParams.get('v') === 'latest') {
        storageService.updateAndSyncOfflineCache();
      }
    } catch (e) {}

    return () => {
      window.removeEventListener('oj-app-update-available', handleUpdateFound);
    };
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleNavigate = (tab: TabType, extra?: any) => {
    setActiveTab(tab);
    if (extra !== undefined) {
      setSelectedExtraItem(extra);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (user: UserType) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  // Keyboard shortcut for search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white pb-14 lg:pb-0 transition-colors duration-200">
      {/* Top Update Notification Alert Banner if new features are ready */}
      {hasUpdateWaiting && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md animate-fade-in z-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>🎉 Our Jamalpur-এর নতুন ফিচার ও আপডেট এসেছে!</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUpdateModalOpen(true)}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer shadow-xs"
            >
              এখনই আপডেট করুন ➔
            </button>
            <button
              onClick={() => setHasUpdateWaiting(false)}
              className="p-1 hover:bg-white/20 rounded cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 1. Live Clock, Weather & Upazila Top Bar */}
      <LiveClockHeader
        selectedUpazila={selectedUpazila}
        onSelectUpazila={(u) => setSelectedUpazila(u)}
        onOpenUpazilaModal={() => setIsUpazilaModalOpen(true)}
        onOpenExportZip={() => setIsExportZipOpen(true)}
        onOpenInstallApp={() => setIsInstallModalOpen(true)}
        onOpenStorageCache={() => setIsStorageModalOpen(true)}
        onOpenAppUpdate={() => setIsUpdateModalOpen(true)}
      />

      {/* 2. Emergency Hotlines Bar */}
      <EmergencyBar onNavigate={handleNavigate} />

      {/* Offline Alert Banner if network goes offline */}
      {isOffline && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-bold flex items-center justify-center gap-2 text-center animate-fade-in shadow-xs">
          <WifiOff className="w-3.5 h-3.5" />
          <span>আপনি অফলাইনে আছেন। লোকাল স্টোরেজ ও ক্যাশ মেমোরি থেকে সেবা প্রদান করা হচ্ছে।</span>
          <button
            onClick={() => setIsStorageModalOpen(true)}
            className="underline ml-1 font-extrabold cursor-pointer hover:text-slate-900"
          >
            ক্যাশ তথ্য দেখুন
          </button>
        </div>
      )}

      {/* 3. Live News, Daily Newspapers & Notice Marquee Ticker */}
      <LiveNewsTicker
        noticeText={settings.noticeTickerText}
        onNavigate={handleNavigate}
      />

      {/* 4. Main Navbar */}
      <Navbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenExportZip={() => setIsExportZipOpen(true)}
        onOpenInstallApp={() => setIsInstallModalOpen(true)}
        onOpenStorageCache={() => setIsStorageModalOpen(true)}
        onOpenAppUpdate={() => setIsUpdateModalOpen(true)}
        selectedUpazila={selectedUpazila}
        onOpenUpazilaModal={() => setIsUpazilaModalOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => {
          setAuthModalAdminNotice(false);
          setIsAuthOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* 5. Main Content Route Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-5">
        {activeTab === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            selectedUpazila={selectedUpazila}
            onSelectUpazila={(u) => setSelectedUpazila(u)}
            onOpenUpazilaModal={() => setIsUpazilaModalOpen(true)}
            onOpenExportZip={() => setIsExportZipOpen(true)}
            onOpenInstallApp={() => setIsInstallModalOpen(true)}
          />
        )}

        {(activeTab === 'marketplace' || activeTab === 'sell') && (
          <MarketplaceView
            currentUser={currentUser}
            selectedProduct={selectedExtraItem}
            onSelectProduct={(p) => setSelectedExtraItem(p)}
            onOpenAuth={() => {
              setAuthModalAdminNotice(false);
              setIsAuthOpen(true);
            }}
          />
        )}

        {activeTab === 'mfs-transfer' && <MfsTransferView />}

        {activeTab === 'news' && (
          <NewsView selectedNews={selectedExtraItem} />
        )}

        {activeTab === 'weather' && <WeatherView />}

        {activeTab === 'helplines' && <HelplinesView />}

        {activeTab === 'transport' && <TransportView />}
        {activeTab === 'bus' && <TransportView />}
        {activeTab === 'train' && <TransportView />}

        {activeTab === 'hospital' && <HealthView defaultSubTab="hospital" />}
        {activeTab === 'doctors' && <HealthView defaultSubTab="doctors" />}

        {activeTab === 'medicine' && <MedicineView />}

        {activeTab === 'jobs' && <JobsView />}

        {activeTab === 'education' && <EducationView />}

        {activeTab === 'quiz' && <QuizView currentUser={currentUser} />}

        {activeTab === 'blood-donor' && <BloodDonorView />}

        {activeTab === 'prayer' && <PrayerTimeView />}

        {activeTab === 'market-price' && <MarketPriceView />}

        {activeTab === 'business' && <BusinessDirectoryView />}

        {(activeTab === 'about' || activeTab === 'contact') && <AboutOwnerView />}

        {activeTab === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        )}

        {/* Admin Panel strictly restricted to Admin users with ID & Password */}
        {activeTab === 'admin' && (
          isUserAdmin(currentUser) ? (
            <AdminPanelView
              onRefresh={() => setRefreshKey((k) => k + 1)}
              onOpenAppUpdate={() => setIsUpdateModalOpen(true)}
              onOpenShareApp={() => setIsShareModalOpen(true)}
            />
          ) : (
            <AdminLoginGuard
              onSuccess={(adminUser) => handleLogin(adminUser)}
              onNavigateHome={() => handleNavigate('home')}
            />
          )
        )}
      </main>

      {/* 6. Footer */}
      <footer className="bg-slate-950 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-12 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
            {/* Column 1: Brand & Founder */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md border border-emerald-600/40 bg-emerald-950 flex items-center justify-center shrink-0">
                  <img
                    src={jamalpurLogo}
                    alt="Our Jamalpur Emblem"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white">Our Jamalpur</h3>
                  <p className="text-xs text-emerald-400 font-medium">আমাদের জামালপুর — লোকাল ডিজিটাল পোর্টাল</p>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                জামালপুর জেলার প্রতিটি নাগরিকের জন্য তথ্য, শিক্ষা, স্বাস্থ্য, চাকরি, যাতায়াত ও বিশ্বস্ত লোকাল কেনাবেচার সর্বাধুনিক ডিজিটাল প্ল্যাটফর্ম।
              </p>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <span>উদ্যোক্তা ও পরিচালক:</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400">
                  <span>{settings.ownerName || 'মাসুদ রানা'}</span>
                  <span className="inline-flex items-center gap-0.5 text-blue-400 bg-blue-950/80 border border-blue-800 px-1.5 py-0.5 rounded-full text-[10px]">
                    <CheckCircle2 className="w-3 h-3 fill-blue-400 text-slate-950" />
                    <span>Verified</span>
                  </span>
                </span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">প্রধান সেবাসমূহ</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={() => handleNavigate('marketplace')} className="hover:text-emerald-400 transition cursor-pointer">
                    মার্কেটপ্লেস কেনাবেচা
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('news')} className="hover:text-emerald-400 transition cursor-pointer">
                    জামালপুর জেলা সংবাদ
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('transport')} className="hover:text-emerald-400 transition cursor-pointer">
                    বাস ও ট্রেন সময়সূচী
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('hospital')} className="hover:text-emerald-400 transition cursor-pointer">
                    হাসপাতাল ও অ্যাম্বুলেন্স
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('doctors')} className="hover:text-emerald-400 transition cursor-pointer">
                    ডাক্তার চেম্বার ও সিরিয়াল
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Citizen Corner */}
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">নাগরিক সেবা</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={() => handleNavigate('blood-donor')} className="hover:text-emerald-400 transition cursor-pointer">
                    স্বেচ্ছাসেবী রক্তদাতা
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('market-price')} className="hover:text-emerald-400 transition cursor-pointer">
                    আজকের বাজারদর
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('prayer')} className="hover:text-emerald-400 transition cursor-pointer">
                    নামাজের সময়সূচী
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('education')} className="hover:text-emerald-400 transition cursor-pointer">
                    ১ম-১০ম শ্রেণি ই-বুক
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('quiz')} className="hover:text-emerald-400 transition cursor-pointer">
                    অনলাইন কুইজ প্রতিযোগিতা
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Upazilas & Contact */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">জামালপুর ৭ উপজেলা</h4>
                <button
                  onClick={() => setIsUpazilaModalOpen(true)}
                  className="text-[11px] text-emerald-400 font-bold hover:underline cursor-pointer"
                >
                  সব দেখুন →
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {[
                  { id: 'জামালপুর সদর', label: 'সদর' },
                  { id: 'ইসলামপুর', label: 'ইসলামপুর' },
                  { id: 'মেলান্দহ', label: 'মেলান্দহ' },
                  { id: 'দেওয়ানগঞ্জ', label: 'দেওয়ানগঞ্জ' },
                  { id: 'মাদারগঞ্জ', label: 'মাদারগঞ্জ' },
                  { id: 'সরিষাবাড়ী', label: 'সরিষাবাড়ী' },
                  { id: 'বকশীগঞ্জ', label: 'বকশীগঞ্জ' },
                ].map((u) => {
                  const isSelected = selectedUpazila === u.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        setSelectedUpazila(u.id as Upazila);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`px-2 py-1 rounded transition cursor-pointer text-xs font-semibold ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-900 text-slate-300 hover:bg-emerald-950 hover:text-emerald-300 border border-slate-800'
                      }`}
                    >
                      {u.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs flex flex-col gap-2">
                <button
                  onClick={() => setIsUpazilaModalOpen(true)}
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <span>🏛️ ৭ উপজেলার জরুরি ফোন ও হটলাইন</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 border-t border-slate-800/60">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <span>© {new Date().getFullYear()} Our Jamalpur. সর্বস্বত্ব সংরক্ষিত। স্বত্বাধিকারী: <strong>{settings.ownerName}</strong></span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px]">থিম মোড:</span>
                <ThemeToggle variant="pill" />
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <button onClick={() => handleNavigate('about')} className="hover:text-white transition">
                আমাদের সম্পর্কে
              </button>
              <button onClick={() => handleNavigate('contact')} className="hover:text-white transition">
                যোগাযোগ
              </button>
              <button onClick={() => handleNavigate('admin')} className="text-purple-400 hover:text-purple-300 font-bold">
                অ্যাডমিন পোর্টাল
              </button>
              <button
                onClick={() => setIsUpdateModalOpen(true)}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer transition"
              >
                <RefreshCw className="w-3 h-3" />
                <span>নতুন ফিচার আনুন</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating 1-Click Update & Feature Sync Button (Accessible Anywhere) */}
      <FloatingUpdateButton onOpenUpdateModal={() => setIsUpdateModalOpen(true)} />

      {/* 7. Mobile Bottom Sticky Navigation */}
      <BottomNav activeTab={activeTab} onNavigate={handleNavigate} />

      {/* 8. Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* 9. Standalone ZIP Project Export Modal (Spck Editor Ready) */}
      <ProjectExportModal
        isOpen={isExportZipOpen}
        onClose={() => setIsExportZipOpen(false)}
      />

      {/* 10. PWA Install App Modal */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onInstalled={() => setIsAppInstalled(true)}
      />

      {/* 11. Local Storage & Offline Cache Management Modal */}
      <StorageCacheModal
        isOpen={isStorageModalOpen}
        onClose={() => setIsStorageModalOpen(false)}
        onRefresh={() => {
          // Trigger light refresh of user or settings if needed
          setCurrentUser(storageService.getCurrentUser());
        }}
      />

      {/* 12. Upazila Hub & Directory Modal */}
      <UpazilaHubModal
        isOpen={isUpazilaModalOpen}
        onClose={() => setIsUpazilaModalOpen(false)}
        selectedUpazila={selectedUpazila}
        onSelectUpazila={(u) => setSelectedUpazila(u)}
        onNavigate={handleNavigate}
      />

      {/* 13. App Update & Force Refresh Modal */}
      <AppUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onOpenShareApp={() => setIsShareModalOpen(true)}
      />

      {/* 14. Share App & Latest Version Link Modal */}
      <ShareAppModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onOpenAppUpdate={() => setIsUpdateModalOpen(true)}
      />

      {/* 15. Firebase Auth Modal (Login / Sign Up) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setAuthModalAdminNotice(false);
        }}
        onSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthOpen(false);
          setAuthModalAdminNotice(false);
        }}
        adminNotice={authModalAdminNotice}
      />
    </div>
  );
}

export default App;
