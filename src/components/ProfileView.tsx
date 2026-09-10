import React, { useState } from 'react';
import {
  User,
  LogIn,
  UserPlus,
  LogOut,
  ShoppingBag,
  ShieldCheck,
  HeartPulse,
  Edit,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Camera,
  Upload,
  Image as ImageIcon,
  Sparkles,
  HardDrive,
  RefreshCw,
  Download,
  Trash2,
  Database,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { User as UserType, TabType, Upazila } from '../types';
import { storageService } from '../services/storageService';
import { authService, isUserAdmin } from '../services/authService';
import masudRanaPhoto from '../assets/images/masud_rana_profile_1788024419763.jpg';
import { ThemeToggle } from './ThemeToggle';

interface Props {
  currentUser: UserType | null;
  onLogin: (u: UserType) => void;
  onLogout: () => void;
  onNavigate: (tab: TabType, extra?: any) => void;
}

export const ProfileView: React.FC<Props> = ({ currentUser, onLogin, onLogout, onNavigate }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [upazila, setUpazila] = useState<Upazila>('জামালপুর সদর');
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (authMode === 'login') {
      if (!email || !password) {
        setAuthError('দয়া করে ইমেইল ও পাসওয়ার্ড প্রদান করুন');
        return;
      }
      setLoading(true);
      try {
        const user = await authService.loginWithEmail(email, password);
        onLogin(user);
        showToast(`স্বাগতম, ${user.name}! আপনি সফলভাবে প্রবেশ করেছেন।`);
      } catch (err: any) {
        const code = err?.code || '';
        if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
          setAuthError('ভুল ইমেইল বা পাসওয়ার্ড। অনুগ্রহ করে পুনরায় যাচাই করুন।');
        } else if (code === 'auth/user-not-found') {
          setAuthError('এই ইমেইলে কোনো একাউন্ট পাওয়া যায়নি। নতুন নিবন্ধন করুন।');
        } else {
          setAuthError(err?.message || 'লগইন ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।');
        }
      } finally {
        setLoading(false);
      }
    } else {
      if (!name.trim()) {
        setAuthError('দয়া করে আপনার পূর্ণ নাম লিখুন');
        return;
      }
      if (!email.trim()) {
        setAuthError('দয়া করে সঠিক ইমেইল এড্রেস লিখুন');
        return;
      }
      if (password.length < 6) {
        setAuthError('পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে');
        return;
      }
      setLoading(true);
      try {
        const newUser = await authService.registerWithEmail({
          name: name.trim(),
          email: email.trim(),
          password,
          upazila,
          phone: phone.trim(),
        });
        onLogin(newUser);
        showToast(`অভিনন্দন, ${name}! আপনার নাগরিক অ্যাকাউন্ট তৈরি সম্পন্ন হয়েছে।`);
      } catch (err: any) {
        const code = err?.code || '';
        if (code === 'auth/email-already-in-use') {
          setAuthError('এই ইমেইলটি ইতিমধ্যে নিবন্ধিত। অনুগ্রহ করে লগইন করুন।');
        } else {
          setAuthError(err?.message || 'নিবন্ধন ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const updated = storageService.updateCurrentUser({ avatar: base64 });
        if (updated) {
          onLogin(updated);
          showToast('প্রোফাইল ছবি সফলভাবে আপডেট করা হয়েছে!');
          setIsEditingPhoto(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhotoUrl = () => {
    if (!photoUrlInput.trim()) return;
    const updated = storageService.updateCurrentUser({ avatar: photoUrlInput.trim() });
    if (updated) {
      onLogin(updated);
      showToast('প্রোফাইল ছবি লিংক সফলভাবে সংরক্ষিত হয়েছে!');
      setIsEditingPhoto(false);
      setPhotoUrlInput('');
    }
  };

  if (currentUser) {
    const userProducts = storageService.getProducts().filter((p) => p.sellerId === currentUser.id);
    const settings = storageService.getSettings();
    const isOwner = currentUser.phone === '01315481879' || currentUser.role === 'admin';
    const profileAvatar = currentUser.avatar || (isOwner ? (settings.ownerPhotoUrl || masudRanaPhoto) : null);

    return (
      <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
        {toastMessage && (
          <div className="bg-emerald-600 text-white text-xs font-bold py-2.5 px-4 rounded-2xl shadow-lg text-center flex items-center justify-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              {/* Profile Photo Display with Upload Badge */}
              <div className="relative group">
                {profileAvatar ? (
                  <img
                    id="current-user-avatar"
                    src={profileAvatar}
                    alt={currentUser.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover shadow-lg ring-4 ring-emerald-100 border-2 border-emerald-500"
                    onError={(e) => {
                      // Fallback to default owner image or initial letter
                      if (isOwner) {
                        (e.currentTarget as HTMLImageElement).src = masudRanaPhoto;
                      }
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-emerald-700 to-teal-600 text-white font-black text-3xl flex items-center justify-center shadow-lg ring-4 ring-emerald-100">
                    {currentUser.name.charAt(0)}
                  </div>
                )}

                <button
                  onClick={() => setIsEditingPhoto(!isEditingPhoto)}
                  title="ছবি পরিবর্তন করুন"
                  className="absolute -bottom-1.5 -right-1.5 p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md border-2 border-white transition active:scale-95 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-1.5">
                    <span>{currentUser.name}</span>
                    {currentUser.role === 'admin' && (
                      <span className="inline-flex items-center text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full text-xs font-bold gap-1 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 fill-blue-600 text-white" />
                        <span>Verified</span>
                      </span>
                    )}
                  </h2>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      currentUser.role === 'admin'
                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {currentUser.role === 'admin' ? 'অ্যাডমিনিস্ট্রেটর ও পরিচালক' : 'নাগরিক ব্যবহারকারী'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-semibold text-slate-700">{currentUser.phone}</span>
                  </span>
                  {currentUser.email && (
                    <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>{currentUser.email}</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{currentUser.upazila || 'জামালপুর সদর'}</span>
                  </span>
                </div>

                <div className="mt-2 text-[11px] text-slate-400 flex flex-wrap items-center gap-2">
                  <span>যোগদানের তারিখ: {currentUser.joinedDate || '২০২৬'}</span>
                  {currentUser.id && (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                      <span>UID: {currentUser.id.substring(0, 12)}...</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(currentUser.id);
                          showToast('UID কপি করা হয়েছে!');
                        }}
                        className="text-emerald-600 hover:text-emerald-700 font-bold ml-1 cursor-pointer"
                        title="সম্পূর্ণ UID কপি করুন"
                      >
                        কপি
                      </button>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 border border-rose-200 cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span>লগআউট</span>
            </button>
          </div>

          {/* Photo Edit Dropdown Panel */}
          {isEditingPhoto && (
            <div className="mt-5 p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl animate-fade-in space-y-3">
              <h4 className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-700" />
                <span>প্রোফাইল ছবি পরিবর্তন ও আপলোড:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center justify-center gap-2 p-3 bg-white hover:bg-emerald-100/50 border border-emerald-300 rounded-xl cursor-pointer text-xs font-bold text-emerald-800 transition">
                  <Upload className="w-4 h-4" />
                  <span>ফোন বা কম্পিউটার থেকে আপলোড করুন</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="অথবা অনলাইন ছবির লিঙ্ক দিন"
                    value={photoUrlInput}
                    onChange={(e) => setPhotoUrlInput(e.target.value)}
                    className="flex-1 p-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                  />
                  <button
                    onClick={handleSavePhotoUrl}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    সেভ
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentUser.role === 'admin' && (
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-purple-950 font-bold text-xs sm:text-sm">
                <ShieldCheck className="w-5 h-5 text-purple-700 shrink-0" />
                <span>আপনার কাছে প্ল্যাটফর্মের ফুল অ্যাডমিন এক্সেস ও কন্ট্রোল অধিকার রয়েছে</span>
              </div>
              <button
                onClick={() => onNavigate('admin')}
                className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-xs whitespace-nowrap"
              >
                অ্যাডমিন কন্ট্রোল প্যানেলে যান →
              </button>
            </div>
          )}
        </div>

        {/* Theme & Display Mode Preference */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span>🎨 থিম মোড (নাইট মোড ও লাইট মোড)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                দিনের উজ্জ্বল আলোতে লাইট মোড এবং রাতে চোখের সুরক্ষায় ডার্ক মোড ব্যবহার করুন।
              </p>
            </div>
            <ThemeToggle variant="inline" />
          </div>
        </div>

        {/* Local Storage & Offline Cache Management */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>লোকাল স্টোরেজ ও অফলাইন ক্যাশ ব্যবস্থাপনা</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ইন্টারনেট ছাড়াই জামালপুর জেলার পরিবহন, ডাক্তার, রক্তদাতা, জরুরি সেবা ও কুইজ নিরবচ্ছিন্নভাবে ব্যবহার করুন।
              </p>
            </div>

            <button
              onClick={() => {
                storageService.updateAndSyncOfflineCache();
                showToast('লোকাল স্টোরেজ ও অফলাইন ক্যাশ সফলভাবে রিফ্রেশ ও সিঙ্ক হয়েছে!');
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>এক-ক্লিকে ক্যাশ আপডেট</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">মেমোরি ব্যবহার</span>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                {storageService.getStorageStats().totalKilobytes} KB
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">সংরক্ষিত মোট রেকর্ড</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                {storageService.getStorageStats().totalRecords} টি আইটেম
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 col-span-2 sm:col-span-1">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">অফলাইন মোড</span>
              <span className="font-extrabold text-teal-600 dark:text-teal-400 text-sm">
                ১০০% প্রস্তুত
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <button
              onClick={() => {
                storageService.exportAllDataAsJSON();
                showToast('সম্পূর্ণ ডাটাবেজ ব্যাকআপ JSON ফাইল ডাউনলোড সম্পন্ন হয়েছে!');
              }}
              className="px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-800 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ডাটা ব্যাকআপ ডাউনলোড (JSON)</span>
            </button>

            <button
              onClick={() => {
                storageService.clearTemporaryCache();
                showToast('ক্যাশ অপ্টিমাইজ ও টেম্প ফাইল ক্লিয়ার সম্পন্ন!');
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ক্যাশ অপ্টিমাইজ</span>
            </button>
          </div>
        </div>

        {/* My Marketplace Ads */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <span>আমার পোস্ট করা বিজ্ঞাপনসমূহ</span>
              </h3>
              <p className="text-xs text-slate-500">আপনার সক্রিয় ও সংরক্ষিত বিজ্ঞাপন তালিকা</p>
            </div>

            <button
              onClick={() => onNavigate('sell')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
            >
              + নতুন বিজ্ঞাপন দিন
            </button>
          </div>

          {userProducts.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">আপনি এখনও কোনো বিজ্ঞাপন পোস্ট করেননি।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt={p.title} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{p.title}</h4>
                      <span className="text-xs font-bold text-emerald-700">৳ {p.price}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('marketplace', p)}
                    className="text-xs text-emerald-700 font-semibold hover:underline cursor-pointer"
                  >
                    দেখুন
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-8 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-5">
        {/* Toggle Login / Register */}
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
              authMode === 'login' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            লগইন (Sign In)
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
              authMode === 'register' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            নতুন অ্যাকাউন্ট তৈরি
          </button>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-black text-slate-900">
            {authMode === 'login' ? 'Our Jamalpur এ লগইন করুন' : 'নতুন নাগরিক অ্যাকাউন্ট তৈরি'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            বিজ্ঞাপন দেওয়া, কুইজ স্কোর সেভ করা ও সেবা গ্রহণ করতে সাইন ইন করুন
          </p>
        </div>

        {authError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {authError}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-3.5 text-xs sm:text-sm">
          {authMode === 'register' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">আপনার পূর্ণ নাম *</label>
              <input
                type="text"
                required
                placeholder="যেমন: তানভীর আহমেদ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">ইমেইল এড্রেস *</label>
            <input
              type="email"
              required
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">পাসওয়ার্ড *</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="পাসওয়ার্ড দিন (কমপক্ষে ৬ অক্ষর)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          {authMode === 'register' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">উপজেলা</label>
                  <select
                    value={upazila}
                    onChange={(e) => setUpazila(e.target.value as Upazila)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white text-xs"
                  >
                    {[
                      'জামালপুর সদর',
                      'মেলান্দহ',
                      'মাদারগঞ্জ',
                      'ইসলামপুর',
                      'সরিষাবাড়ী',
                      'দেওয়ানগঞ্জ',
                      'বকশীগঞ্জ',
                    ].map((up) => (
                      <option key={up} value={up}>
                        {up}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর (ঐচ্ছিক)</label>
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
                🛡️ <strong>নিরাপত্তা নীতি:</strong> সাইনআপের মাধ্যমে প্রতিটি একাউন্ট ডিফল্টভাবে সাধারণ "user" রোল পাবে। এডমিন রোল সার্ভার-সাইড সিকিউরিটি রুলস দ্বারা সুরক্ষিত।
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-md transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>অপেক্ষা করুন...</span>
            ) : authMode === 'login' ? (
              'লগইন করুন'
            ) : (
              'নিবন্ধন সম্পন্ন করুন'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
