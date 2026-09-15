import React, { useState, useEffect } from 'react';
import {
  User,
  LogIn,
  UserPlus,
  LogOut,
  ShoppingBag,
  ShieldCheck,
  HeartPulse,
  Edit,
  Check,
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
  Eye,
  EyeOff,
  Smartphone,
  Send,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Calendar,
  Stethoscope,
  Clock as ClockIcon,
} from 'lucide-react';
import { User as UserType, TabType, Upazila } from '../types';
import { storageService } from '../services/storageService';
import { authService, isUserAdmin } from '../services/authService';
import masudRanaPhoto from '../assets/images/masud_rana_profile_fixed_1789395910368.jpg';
import { ThemeToggle } from './ThemeToggle';
import { AvatarCropModal } from './AvatarCropModal';

interface Props {
  currentUser: UserType | null;
  onLogin: (u: UserType) => void;
  onLogout: () => void;
  onNavigate: (tab: TabType, extra?: any) => void;
}

export const ProfileView: React.FC<Props> = ({ currentUser: propUser, onLogin, onLogout, onNavigate }) => {
  const currentUser = propUser || storageService.getCurrentUser();
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Phone OTP States
  const [otpStep, setOtpStep] = useState<'input' | 'verify'>('input');
  const [sentOtp, setSentOtp] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [upazila, setUpazila] = useState<Upazila>('জামালপুর সদর');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  // Inline Profile Editing State
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [isSavingInline, setIsSavingInline] = useState(false);
  const [inlineEditError, setInlineEditError] = useState<string | null>(null);

  const startEditing = () => {
    if (!currentUser) return;
    setEditName(currentUser.name || '');
    setEditBio(currentUser.bio || '');
    setInlineEditError(null);
    setIsEditingInline(true);
  };

  const cancelEditing = () => {
    setIsEditingInline(false);
    setInlineEditError(null);
  };

  const handleSaveInlineProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentUser) return;
    const trimmedName = editName.trim();
    if (!trimmedName) {
      setInlineEditError('দয়া করে আপনার নাম লিখুন');
      return;
    }

    setIsSavingInline(true);
    setInlineEditError(null);
    try {
      const updated = await authService.updateProfileData(currentUser.id, {
        name: trimmedName,
        bio: editBio.trim(),
      });
      const userToSet: UserType = updated || {
        ...currentUser,
        name: trimmedName,
        bio: editBio.trim(),
      };
      onLogin(userToSet);
      setIsEditingInline(false);
      showToast('নাম ও বায়ো সফলভাবে ডাটাবেসে সেভ করা হয়েছে!');
    } catch (err: any) {
      setInlineEditError(err?.message || 'ডাটাবেসে সেভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSavingInline(false);
    }
  };

  const handleSaveAvatar = async (croppedDataUrl: string) => {
    if (!currentUser) return;
    try {
      const updated = await authService.updateProfileData(currentUser.id, { avatar: croppedDataUrl });
      const userToSet = updated || { ...currentUser, avatar: croppedDataUrl };
      onLogin(userToSet);
      showToast('প্রোফাইল ছবি সফলভাবে আপডেট ও ডাটাবেসে সেভ করা হয়েছে!');
    } catch (err: any) {
      showToast('ছবি সংরক্ষণ করতে সমস্যা হয়েছে');
      throw err;
    }
  };

  const handleRemoveAvatar = async () => {
    if (!currentUser) return;
    try {
      const updated = await authService.updateProfileData(currentUser.id, { avatar: '' });
      const userToSet = updated || { ...currentUser, avatar: undefined };
      onLogin(userToSet);
      showToast('প্রোফাইল ছবি সফলভাবে মুছে ফেলা হয়েছে!');
    } catch (err: any) {
      showToast('ছবি মুছে ফেলতে সমস্যা হয়েছে');
      throw err;
    }
  };

  // Timer cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const cleanPhone = phone.trim().replace(/\s+/g, '').replace(/^(\+88)/, '');
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      setAuthError('সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)');
      return;
    }

    if (authMode === 'register' && !name.trim()) {
      setAuthError('দয়া করে আপনার পূর্ণ নাম লিখুন।');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.sendOtp(cleanPhone, 'phone');
      setSentOtp(res.otp);
      setOtpStep('verify');
      setResendCooldown(60);
      showToast('মোবাইলে ৬-সংখ্যার ওটিপি পাঠানো হয়েছে!');
    } catch (err: any) {
      setAuthError(err?.message || 'ওটিপি পাঠাতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (otpInput.trim().length !== 6) {
      setAuthError('দয়া করে সঠিক ৬-সংখ্যার ওটিপি লিখুন');
      return;
    }

    setLoading(true);
    try {
      const cleanPhone = phone.trim().replace(/\s+/g, '').replace(/^(\+88)/, '');
      const result = await authService.loginOrRegisterWithPhone({
        phone: cleanPhone,
        otp: otpInput.trim(),
        name: name.trim() || 'নাগরিক ব্যবহারকারী',
        upazila,
        email: email.trim(),
      });

      onLogin(result.user);
      showToast(
        result.isNew
          ? `অভিনন্দন ${result.user.name}! নাগরিক অ্যাকাউন্ট তৈরি সফল হয়েছে।`
          : `স্বাগতম, ${result.user.name}! সফলভাবে প্রবেশ করেছেন।`
      );
    } catch (err: any) {
      setAuthError(err?.message || 'ভুল ওটিপি কোড');
    } finally {
      setLoading(false);
    }
  };

  const handleResendPhoneOtp = async () => {
    if (resendCooldown > 0) return;
    setAuthError(null);
    setLoading(true);
    try {
      const cleanPhone = phone.trim().replace(/\s+/g, '').replace(/^(\+88)/, '');
      const res = await authService.sendOtp(cleanPhone, 'phone');
      setSentOtp(res.otp);
      setResendCooldown(60);
      showToast('নতুন ওটিপি কোড পাঠানো হয়েছে!');
    } catch (err: any) {
      setAuthError(err?.message || 'পুনরায় পাঠাতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
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

  if (currentUser) {
    const userProducts = storageService.getProducts().filter((p) => p.sellerId === currentUser.id);
    const isOwner =
      currentUser.phone === '01315481879' ||
      currentUser.role === 'admin' ||
      currentUser.id === 'OJ-15117' ||
      (currentUser.email || '').includes('15117') ||
      (currentUser.email || '').includes('masud') ||
      (currentUser.email || '').includes('jhuma');
    const profileAvatar = currentUser.avatar || (isOwner ? masudRanaPhoto : null);

    return (
      <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
        {toastMessage && (
          <div className="bg-emerald-600 text-white text-xs font-bold py-2.5 px-4 rounded-2xl shadow-lg text-center flex items-center justify-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors duration-200">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              {/* Profile Photo Display with Circular Crop Action */}
              <div className="flex flex-col items-center">
                <div
                  id="user-avatar-trigger"
                  onClick={() => setIsCropModalOpen(true)}
                  className="relative group cursor-pointer"
                  title="ছবি পরিবর্তন ও ক্রপ করতে ক্লিক করুন"
                >
                  {profileAvatar ? (
                    <img
                      id="current-user-avatar"
                      src={profileAvatar}
                      alt={currentUser.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-lg ring-4 ring-emerald-100 dark:ring-emerald-950/80 border-2 border-emerald-500 transition duration-200 group-hover:scale-102 group-hover:ring-emerald-300 dark:group-hover:ring-emerald-800"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-emerald-700 to-teal-600 text-white font-black text-3xl flex items-center justify-center shadow-lg ring-4 ring-emerald-100 dark:ring-emerald-950/80 transition duration-200 group-hover:scale-102">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}

                  {/* Circular Hover Overlay with Camera Icon */}
                  <div className="absolute inset-0 rounded-full bg-slate-950/50 backdrop-blur-[2px] text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Camera className="w-6 h-6 mb-1 text-emerald-300 drop-shadow" />
                    <span className="text-[10px] font-bold text-white tracking-wide">ছবি পরিবর্তন</span>
                  </div>

                  {isOwner && (
                    <div className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1.5 rounded-full shadow border-2 border-white dark:border-slate-900 flex items-center justify-center z-10" title="ভেরিফাইড প্রোফাইল">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Explicit Touch Button for Mobile/Desktop */}
                <button
                  type="button"
                  id="open-avatar-crop-modal-btn"
                  onClick={() => setIsCropModalOpen(true)}
                  className="mt-2.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 transition cursor-pointer shadow-2xs"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>ছবি পরিবর্তন ও ক্রপ</span>
                </button>
              </div>

              <div className="flex-1 w-full">
                {isEditingInline ? (
                  <form
                    id="inline-profile-edit-form"
                    onSubmit={handleSaveInlineProfile}
                    className="w-full mt-1 p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/80 border-2 border-emerald-500/50 dark:border-emerald-600/50 space-y-3.5 animate-fade-in text-left shadow-xs"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        <Edit className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>প্রোফাইল তথ্য এডিট (সরাসরি ক্লাউড ডাটাবেসে সেভ হবে)</span>
                      </div>
                      <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md font-semibold">
                        Firestore Sync
                      </span>
                    </div>

                    {inlineEditError && (
                      <div className="bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 p-2.5 rounded-xl text-xs flex items-center gap-2 border border-rose-200 dark:border-rose-900">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{inlineEditError}</span>
                      </div>
                    )}

                    {/* Name Input */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          আপনার নাম <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono">{editName.length}/50</span>
                      </div>
                      <input
                        type="text"
                        id="inline-edit-name-input"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value.slice(0, 50))}
                        placeholder="আপনার পূর্ণ নাম লিখুন..."
                        maxLength={50}
                        required
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition"
                      />
                    </div>

                    {/* Bio Textarea */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          সংক্ষিপ্ত বায়ো / পরিচিতি (Bio)
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono">{editBio.length}/300</span>
                      </div>
                      <textarea
                        id="inline-edit-bio-input"
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value.slice(0, 300))}
                        rows={3}
                        placeholder="আপনার পেশা, সামাজিক কাজ বা জামালপুর প্ল্যাটফর্মের সাথে আপনার সম্পৃক্ততা সম্পর্কে লিখুন..."
                        maxLength={300}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-hidden resize-none transition"
                      />
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                        সর্বোচ্চ ৩০০ অক্ষর। এটি আপনার পাবলিক প্রোফাইল কার্ডে প্রদর্শিত হবে।
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        id="cancel-inline-edit-btn"
                        onClick={cancelEditing}
                        disabled={isSavingInline}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                      >
                        বাতিল
                      </button>
                      <button
                        type="submit"
                        id="save-inline-edit-btn"
                        disabled={isSavingInline}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition disabled:opacity-50 cursor-pointer"
                      >
                        {isSavingInline ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>ডাটাবেসে সেভ হচ্ছে...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>ডাটাবেসে সেভ করুন</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span id="profile-display-name">{currentUser.name}</span>
                        {currentUser.role === 'admin' && (
                          <span className="inline-flex items-center text-blue-600 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 px-2 py-0.5 rounded-full text-xs font-bold gap-1 shadow-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 fill-blue-600 text-white" />
                            <span>Verified</span>
                          </span>
                        )}
                      </h2>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          currentUser.role === 'admin'
                            ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                            : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                        }`}
                      >
                        {currentUser.role === 'admin' ? 'অ্যাডমিনিস্ট্রেটর ও পরিচালক' : 'নাগরিক ব্যবহারকারী'}
                      </span>
                      <button
                        type="button"
                        id="quick-edit-name-btn"
                        onClick={startEditing}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="নাম ও বায়ো এডিট করতে ক্লিক করুন"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{currentUser.phone}</span>
                      </span>
                      {currentUser.email && (
                        <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                          <Mail className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                          <span>{currentUser.email}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{currentUser.upazila || 'জামালপুর সদর'}</span>
                      </span>
                    </div>

                    <div className="mt-2 text-[11px] text-slate-400 dark:text-slate-500 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span>যোগদানের তারিখ: {currentUser.joinedDate || '২০২৬'}</span>
                      {currentUser.id && (() => {
                        const displayUid = (currentUser.role === 'admin' || (currentUser.phone || '').replace(/\D/g, '') === '01315481879' || currentUser.id.startsWith('usr-owner') || currentUser.id === 'OJ-15117')
                          ? 'OJ-15117'
                          : (currentUser.id.startsWith('usr-')
                              ? `OJ-${currentUser.id.replace(/\D/g, '').slice(-5) || '1024'}`
                              : currentUser.id);
                        return (
                          <span className="inline-flex items-center gap-1.5 font-mono text-xs bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 px-2.5 py-0.5 rounded-lg border border-emerald-300 dark:border-emerald-800 font-bold shadow-2xs">
                            <span>UID: {displayUid}</span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(displayUid);
                                showToast(`UID (${displayUid}) কপি করা হয়েছে!`);
                              }}
                              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-extrabold ml-1 cursor-pointer underline"
                              title="UID কপি করুন"
                            >
                              কপি
                            </button>
                          </span>
                        );
                      })()}
                    </div>

                    {/* Bio Section */}
                    {currentUser.bio ? (
                      <div className="mt-3.5 p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-2.5 text-left">
                        <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block mb-0.5">
                            পরিচিতি / বায়ো (Bio):
                          </span>
                          <p id="profile-display-bio" className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed break-words">
                            {currentUser.bio}
                          </p>
                        </div>
                        <button
                          type="button"
                          id="edit-bio-btn"
                          onClick={startEditing}
                          className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer shrink-0 pt-0.5"
                          title="বায়ো এডিট করুন"
                        >
                          <Edit className="w-3 h-3" />
                          <span>এডিট</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        id="add-bio-prompt-btn"
                        onClick={startEditing}
                        className="mt-3 w-full sm:w-auto text-left py-2 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs flex items-center gap-2 transition cursor-pointer group"
                      >
                        <Edit className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                        <span>+ আপনার সংক্ষিপ্ত পরিচিতি / বায়ো (Bio) যোগ করুন</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons (Edit Profile + Logout) */}
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              {!isEditingInline && (
                <button
                  type="button"
                  id="header-edit-profile-btn"
                  onClick={startEditing}
                  className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800 cursor-pointer shadow-2xs"
                  title="নাম ও বায়ো এডিট করুন"
                >
                  <Edit className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden sm:inline">নাম ও বায়ো এডিট</span>
                  <span className="sm:hidden">এডিট</span>
                </button>
              )}

              <button
                onClick={onLogout}
                className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-rose-200 dark:border-rose-900 cursor-pointer shrink-0"
              >
                <LogOut className="w-4 h-4" />
                <span>লগআউট</span>
              </button>
            </div>
          </div>

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

        {/* My Doctor Appointment Bookings */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>আমার ডাক্তার অ্যাপয়েন্টমেন্টসমূহ</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                আপনার বুকিং করা ডাক্তার চেম্বার ও সিরিয়াল তালিকা
              </p>
            </div>

            <button
              onClick={() => onNavigate('doctors')}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>+ নতুন অ্যাপয়েন্টমেন্ট</span>
            </button>
          </div>

          {(() => {
            const myBookings = storageService.getAppointments().filter(
              (apt) => apt.userId === currentUser.id || (currentUser.email && apt.userEmail === currentUser.email)
            );

            if (myBookings.length === 0) {
              return (
                <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    আপনি এখনও কোনো ডাক্তারের অ্যাপয়েন্টমেন্ট বুক করেননি।
                  </p>
                  <button
                    onClick={() => onNavigate('doctors')}
                    className="mt-3 text-xs font-bold text-teal-600 hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>ডাক্তার তালিকা দেখুন ও সিরিয়াল নিন</span>
                  </button>
                </div>
              );
            }

            return (
              <div className="space-y-3">
                {myBookings.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                            {apt.doctorName}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              apt.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : apt.status === 'cancelled'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {apt.status === 'confirmed'
                              ? 'নিশ্চিত (Confirmed)'
                              : apt.status === 'cancelled'
                              ? 'বাতিল (Cancelled)'
                              : 'অপেক্ষমান (Pending)'}
                          </span>
                        </div>
                        <p className="text-xs text-teal-700 dark:text-teal-300">{apt.specialty}</p>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" />
                            {apt.preferredDate} ({apt.preferredSlot})
                          </span>
                          <span>•</span>
                          <span>রোগী: {apt.patientName}</span>
                          <span>•</span>
                          <span className="font-bold text-emerald-600">ফি: ৳{apt.consultationFee}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center text-xs">
                      <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">
                        ID: {apt.id.slice(-6)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Circular Avatar Crop & Upload Modal */}
        <AvatarCropModal
          isOpen={isCropModalOpen}
          onClose={() => setIsCropModalOpen(false)}
          currentAvatar={profileAvatar}
          userName={currentUser.name}
          onSave={handleSaveAvatar}
          onRemove={handleRemoveAvatar}
        />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-8 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-5">
        
        {/* Auth Method Selector */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('phone');
              setOtpStep('input');
              setAuthError(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
              authMethod === 'phone'
                ? 'bg-white text-emerald-800 shadow-xs border border-emerald-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>মোবাইল ওটিপি (OTP)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod('email');
              setAuthError(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
              authMethod === 'email'
                ? 'bg-white text-emerald-800 shadow-xs border border-emerald-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>ইমেইল ও পাসওয়ার্ড</span>
          </button>
        </div>

        {/* Toggle Login / Register */}
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setOtpStep('input');
              setAuthError(null);
            }}
            className={`flex-1 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
              authMode === 'login' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            লগইন (Sign In)
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setOtpStep('input');
              setAuthError(null);
            }}
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
            {authMethod === 'phone'
              ? 'মোবাইল নম্বরে ৬-সংখ্যার ওটিপি যাচাই করে সহজে প্রবেশ করুন'
              : 'বিজ্ঞাপন দেওয়া, কুইজ স্কোর সেভ করা ও সেবা গ্রহণ করতে সাইন ইন করুন'}
          </p>
        </div>

        {authError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* PHONE & OTP FLOW                                         */}
        {/* ======================================================== */}
        {authMethod === 'phone' ? (
          <div>
            {otpStep === 'input' ? (
              <form onSubmit={handleSendPhoneOtp} className="space-y-3.5 text-xs sm:text-sm">
                {authMode === 'register' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">আপনার পূর্ণ নাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: তানভীর আহমেদ"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white text-xs sm:text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    মোবাইল নম্বর (১১ ডিজিট) *
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center gap-1 pointer-events-none text-slate-500 text-xs font-semibold">
                      <Phone className="w-3.5 h-3.5" />
                      <span>+৮৮</span>
                    </div>
                    <input
                      type="tel"
                      required
                      maxLength={11}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="01XXXXXXXXX"
                      className="w-full pl-16 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white text-xs sm:text-sm font-mono tracking-wider"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    এই নম্বরে এসএমএসে ৬-সংখ্যার ওটিপি কোড পাঠানো হবে।
                  </p>
                </div>

                {authMode === 'register' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">উপজেলা *</label>
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
                        <label className="block font-bold text-slate-700 mb-1">ইমেইল (ঐচ্ছিক)</label>
                        <input
                          type="email"
                          placeholder="example@mail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white text-xs"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-md transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 text-xs sm:text-sm mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>ওটিপি কোড পাঠানো হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>ওটিপি কোড পাঠান (Send OTP)</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Verify OTP Screen */
              <form onSubmit={handleVerifyPhoneOtp} className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <button
                    type="button"
                    onClick={() => setOtpStep('input')}
                    className="text-xs font-bold text-slate-500 hover:text-emerald-600 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>নম্বর পরিবর্তন ({phone})</span>
                  </button>
                  <span className="text-xs font-bold text-emerald-600">ধাপ ২/২</span>
                </div>

                {sentOtp && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between shadow-xs">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>আপনার ওটিপি কোড:</span>
                      </div>
                      <div className="text-xl font-black font-mono tracking-widest text-emerald-950 mt-0.5">
                        {sentOtp}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpInput(sentOtp)}
                      className="px-2.5 py-1.5 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow-xs cursor-pointer active:scale-95"
                    >
                      স্বয়ংক্রিয় বসান
                    </button>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-center">
                    মোবাইলে প্রাপ্ত ৬-সংখ্যার ওটিপি লিখুন
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full text-center text-xl font-bold font-mono tracking-[0.4em] py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-inner"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>কোড পাননি?</span>
                  {resendCooldown > 0 ? (
                    <span className="font-semibold text-slate-400">
                      পুনরায় পাঠাতে: {resendCooldown} সে.
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendPhoneOtp}
                      disabled={loading}
                      className="text-emerald-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>পুনরায় পাঠান</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || otpInput.trim().length !== 6}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-md transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>যাচাই করা হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>
                        {authMode === 'register'
                          ? 'যাচাই ও অ্যাকাউন্ট তৈরি সম্পন্ন করুন'
                          : 'ওটিপি যাচাই করে প্রবেশ করুন'}
                      </span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        ) : (
          /* ======================================================== */
          /* EMAIL & PASSWORD FLOW                                    */
          /* ======================================================== */
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
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white text-xs sm:text-sm"
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
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">পাসওয়ার্ড *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="পাসওয়ার্ড দিন (কমপক্ষে ৬ অক্ষর)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white text-xs sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition cursor-pointer p-0.5"
                  title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
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
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white text-xs"
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
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-md transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 text-xs sm:text-sm"
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
        )}
      </div>
    </div>
  );
};
