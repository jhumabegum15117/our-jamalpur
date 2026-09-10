import React, { useState, useEffect } from 'react';
import {
  X,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  KeyRound,
  ArrowLeft,
  Send,
  Eye,
  EyeOff,
  Smartphone,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { authService } from '../services/authService';
import { User, Upazila } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: 'login' | 'register' | 'forgot_password';
  adminNotice?: boolean;
}

const UPAZILAS: Upazila[] = [
  'জামালপুর সদর',
  'মেলান্দহ',
  'মাদারগঞ্জ',
  'ইসলামপুর',
  'সরিষাবাড়ী',
  'দেওয়ানগঞ্জ',
  'বকশীগঞ্জ',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
  adminNotice = false,
}) => {
  // Method selection: 'phone' (Mobile + OTP) or 'email' (Email + Password)
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password'>(initialMode);

  // OTP flow state
  const [otpStep, setOtpStep] = useState<'input' | 'verify'>('input');
  const [sentOtp, setSentOtp] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [upazila, setUpazila] = useState<Upazila>('জামালপুর সদর');

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  if (!isOpen) return null;

  const getFriendlyError = (err: any): string => {
    const code = err?.code || '';
    if (code === 'auth/email-already-in-use') {
      return 'এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হয়েছে। দয়া করে লগইন করুন।';
    }
    if (code === 'auth/invalid-email') {
      return 'সঠিক ইমেইল এড্রেস প্রদান করুন।';
    }
    if (code === 'auth/weak-password') {
      return 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।';
    }
    if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
      return 'ভুল ইমেইল বা পাসওয়ার্ড। অনুগ্রহ করে পুনরায় যাচাই করুন।';
    }
    if (code === 'auth/user-not-found') {
      return 'এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি। অনুগ্রহ করে ইমেইলটি পুনরায় যাচাই করুন।';
    }
    if (code === 'auth/too-many-requests') {
      return 'অতিরিক্ত সংখ্যক অনুরোধ পাঠানো হয়েছে। অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করে চেষ্টা করুন।';
    }
    if (code === 'auth/missing-email') {
      return 'দয়া করে আপনার নিবন্ধিত ইমেইল এড্রেস প্রদান করুন।';
    }
    return err?.message || 'একটি ত্রুটি ঘটেছে। পুনরায় চেষ্টা করুন।';
  };

  // Step 1: Send OTP to Phone
  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanPhone = phone.trim().replace(/\s+/g, '').replace(/^(\+88)/, '');
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      setError('সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setError('দয়া করে আপনার পূর্ণ নাম লিখুন।');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.sendOtp(cleanPhone, 'phone');
      setSentOtp(res.otp);
      setOtpStep('verify');
      setResendCooldown(60);
      setSuccessMsg(`আপনার ${cleanPhone} নম্বরে ৬-সংখ্যার ওটিপি কোড পাঠানো হয়েছে!`);
    } catch (err: any) {
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Phone OTP & Login/Register
  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (otpInput.trim().length !== 6) {
      setError('দয়া করে সঠিক ৬-সংখ্যার ওটিপি কোড লিখুন।');
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

      setSuccessMsg(
        result.isNew
          ? `অভিনন্দন ${result.user.name}! আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।`
          : `স্বাগতম, ${result.user.name}! আপনি সফলভাবে প্রবেশ করেছেন।`
      );

      setTimeout(() => {
        onSuccess(result.user);
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  // Resend Phone OTP
  const handleResendPhoneOtp = async () => {
    if (resendCooldown > 0) return;
    setError(null);
    setLoading(true);
    try {
      const cleanPhone = phone.trim().replace(/\s+/g, '').replace(/^(\+88)/, '');
      const res = await authService.sendOtp(cleanPhone, 'phone');
      setSentOtp(res.otp);
      setResendCooldown(60);
      setSuccessMsg('নতুন ওটিপি কোড পাঠানো হয়েছে!');
    } catch (err: any) {
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Submit
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'forgot_password') {
        if (!email.trim()) {
          throw new Error('দয়া করে আপনার নিবন্ধিত ইমেইল এড্রেস প্রদান করুন।');
        }
        await authService.sendPasswordReset(email.trim());
        setSuccessMsg(
          `পাসওয়ার্ড রিসেটের লিঙ্ক আপনার ইমেইলে (${email.trim()}) পাঠানো হয়েছে। ইনবক্স অথবা স্প্যাম (Spam) ফোল্ডার চেক করুন।`
        );
      } else if (mode === 'register') {
        if (!name.trim()) {
          throw new Error('দয়া করে আপনার পূর্ণ নাম লিখুন।');
        }
        if (password.length < 6) {
          throw new Error('পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।');
        }

        const user = await authService.registerWithEmail({
          name: name.trim(),
          email: email.trim(),
          password,
          upazila,
          phone: phone.trim(),
        });

        setSuccessMsg(`স্বাগতম, ${user.name}! আপনার নাগরিক অ্যাকাউন্ট তৈরি হয়েছে।`);
        setTimeout(() => {
          onSuccess(user);
          onClose();
        }, 1200);
      } else {
        const user = await authService.loginWithEmail(email.trim(), password);
        setSuccessMsg(`স্বাগতম, ${user.name}! আপনি সফলভাবে প্রবেশ করেছেন।`);
        setTimeout(() => {
          onSuccess(user);
          onClose();
        }, 1000);
      }
    } catch (err: any) {
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-5 flex items-center justify-between relative">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 mb-1">
              <Sparkles className="w-3 h-3" />
              <span>ডিজিটাল সেবা লগইন</span>
            </div>
            <h3 className="text-lg font-extrabold text-white">
              {mode === 'login'
                ? 'নাগরিক একাউন্টে লগইন'
                : mode === 'register'
                ? 'নতুন একাউন্ট নিবন্ধন'
                : 'পাসওয়ার্ড পুনরুদ্ধার / রিসেট'}
            </h3>
            <p className="text-xs text-emerald-200/80">
              {authMethod === 'phone'
                ? 'মোবাইল নম্বর ও ওটিপি ভেরিফিকেশন'
                : 'ইমেইল ও পাসওয়ার্ড প্রমাণীকরণ'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Required Notice */}
        {adminNotice && mode !== 'forgot_password' && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">এডমিন এক্সেস প্রয়োজন:</span>
              <p className="text-[11px] mt-0.5">
                এডমিন প্যানেলে প্রবেশের জন্য আপনার নির্ধারিত এডমিন ইমেইল অথবা রেজিস্টার্ড নম্বর দিয়ে প্রবেশ করতে হবে।
              </p>
            </div>
          </div>
        )}

        {/* Method Selector: Mobile OTP vs Email (Stacked Vertically) */}
        {mode !== 'forgot_password' && (
          <div className="p-3 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              প্রবেশের মাধ্যম নির্বাচন করুন (নিচে নিচে অপশন):
            </div>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('phone');
                  setOtpStep('input');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`w-full flex items-center justify-between p-2.5 px-3 text-xs font-bold rounded-xl border transition cursor-pointer ${
                  authMethod === 'phone'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-2xs'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${authMethod === 'phone' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div>মোবাইল নম্বর ও ওটিপি (OTP)</div>
                    <div className="text-[10px] font-normal text-slate-400">এসএমএস/ওটিপি কোড দিয়ে তাৎক্ষণিক প্রবেশ</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${authMethod === 'phone' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                  {authMethod === 'phone' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMethod('email');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`w-full flex items-center justify-between p-2.5 px-3 text-xs font-bold rounded-xl border transition cursor-pointer ${
                  authMethod === 'email'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-2xs'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${authMethod === 'email' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div>ইমেইল ও পাসওয়ার্ড</div>
                    <div className="text-[10px] font-normal text-slate-400">আপনার একাউন্টের পাসওয়ার্ড দিয়ে প্রবেশ</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${authMethod === 'email' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                  {authMethod === 'email' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Tab Switcher: Login vs Register (or Back Navigation for Forgot Password) */}
        {mode === 'forgot_password' ? (
          <div className="p-2.5 px-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccessMsg(null);
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>লগইন ফর্মে ফিরে যান</span>
            </button>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              পাসওয়ার্ড রিসেট
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 p-1.5 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setOtpStep('input');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>লগইন (Sign In)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setOtpStep('input');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                mode === 'register'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>নিবন্ধন (Sign Up)</span>
            </button>
          </div>
        )}

        {/* Modal Content */}
        <div className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && mode !== 'forgot_password' && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{successMsg}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* METHOD 1: MOBILE & OTP AUTHENTICATION FLOW                */}
          {/* ========================================================= */}
          {authMethod === 'phone' && mode !== 'forgot_password' && (
            <div>
              {otpStep === 'input' ? (
                /* STEP 1: ENTER PHONE & DETAILS */
                <form onSubmit={handleSendPhoneOtp} className="space-y-3.5">
                  {mode === 'register' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        আপনার পূর্ণ নাম <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="যেমন: মোঃ তানভীর আহমেদ"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      মোবাইল নম্বর (১১ ডিজিট) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 flex items-center gap-1 pointer-events-none text-slate-500 dark:text-slate-400 text-xs font-semibold">
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
                        className="w-full pl-16 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono tracking-wider"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      এই নম্বরে এসএমএস এর মাধ্যমে ৬-সংখ্যার ওটিপি পাঠানো হবে।
                    </p>
                  </div>

                  {mode === 'register' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          উপজেলা নির্বাচন করুন <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <select
                            value={upazila}
                            onChange={(e) => setUpazila(e.target.value as Upazila)}
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                          >
                            {UPAZILAS.map((up) => (
                              <option key={up} value={up}>
                                {up}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          ইমেইল এড্রেস (ঐচ্ছিক)
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@mail.com"
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
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
                /* STEP 2: VERIFY OTP */
                <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setOtpStep('input')}
                      className="text-[11px] font-bold text-slate-500 hover:text-emerald-600 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>নম্বর পরিবর্তন করুন ({phone})</span>
                    </button>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      ধাপ ২/২
                    </span>
                  </div>

                  {/* OTP Notification Preview Box */}
                  {sentOtp && (
                    <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 rounded-2xl flex items-center justify-between shadow-xs">
                      <div>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>আপনার ওটিপি কোড:</span>
                        </div>
                        <div className="text-xl font-black font-mono tracking-widest text-emerald-950 dark:text-emerald-100 mt-0.5">
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
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 text-center">
                      মোবাইলে পাঠানো ৬-সংখ্যার ওটিপি লিখুন
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      autoFocus
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full text-center text-xl font-bold font-mono tracking-[0.4em] py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-inner"
                    />
                  </div>

                  {/* Resend OTP countdown */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>কোড পাননি?</span>
                    {resendCooldown > 0 ? (
                      <span className="font-semibold text-slate-400">
                        পুনরায় পাঠাতে অপেক্ষা: {resendCooldown} সে.
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendPhoneOtp}
                        disabled={loading}
                        className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>পুনরায় ওটিপি পাঠান</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpInput.trim().length !== 6}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
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
                          {mode === 'register'
                            ? 'যাচাই ও অ্যাকাউন্ট তৈরি করুন'
                            : 'ওটিপি যাচাই ও প্রবেশ করুন'}
                        </span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* METHOD 2: EMAIL & PASSWORD AUTHENTICATION FLOW            */}
          {/* ========================================================= */}
          {(authMethod === 'email' || mode === 'forgot_password') && (
            <form onSubmit={handleEmailSubmit} className="space-y-3.5">
              {mode === 'forgot_password' ? (
                /* Forgot Password */
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
                    <KeyRound className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-1 text-[11px] leading-relaxed">
                      <p className="font-bold text-emerald-800 dark:text-emerald-300">
                        পাসওয়ার্ড ভুলে গেছেন? চিন্তা নেই!
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        আপনার নিবন্ধিত ইমেইল ঠিকানাটি লিখুন। আমরা সাথে সাথে পাসওয়ার্ড রিসেট লিঙ্ক পাঠাব।
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      আপনার নিবন্ধিত ইমেইল <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@mail.com"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>লিঙ্ক পাঠানো হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>রিসেট লিঙ্ক পাঠান</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Normal Email Login & Register */
                <>
                  {mode === 'register' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        আপনার পূর্ণ নাম <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="যেমন: মোঃ তানভীর আহমেদ"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      ইমেইল এড্রেস <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@mail.com"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        পাসওয়ার্ড <span className="text-rose-500">*</span>
                      </label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => {
                            setMode('forgot_password');
                            setError(null);
                            setSuccessMsg(null);
                          }}
                          className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          পাসওয়ার্ড ভুলে গেছেন?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                        className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer p-0.5"
                        title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {mode === 'register' && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            উপজেলা
                          </label>
                          <div className="relative">
                            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                            <select
                              value={upazila}
                              onChange={(e) => setUpazila(e.target.value as Upazila)}
                              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                            >
                              {UPAZILAS.map((up) => (
                                <option key={up} value={up}>
                                  {up}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            মোবাইল নম্বর (ঐচ্ছিক)
                          </label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="01XXXXXXXXX"
                              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        🛡️ <strong>নিরাপত্তা নীতি:</strong> সকল নতুন অ্যাকাউন্ট স্বয়ংক্রিয়ভাবে সাধারণ <code>user</code> রোল পাবে।
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>অপেক্ষা করুন...</span>
                      </>
                    ) : mode === 'login' ? (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>লগইন করুন</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>অ্যাকাউন্ট তৈরি করুন</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500">
          {mode === 'login' ? (
            <p>
              অ্যাকাউন্ট নেই?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setOtpStep('input');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                নতুন অ্যাকাউন্ট খুলুন
              </button>
            </p>
          ) : mode === 'register' ? (
            <p>
              ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setOtpStep('input');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                লগইন করুন
              </button>
            </p>
          ) : (
            <p>
              পাসওয়ার্ড মনে পড়েছে?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                লগইন ফর্মে ফিরে যান
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
