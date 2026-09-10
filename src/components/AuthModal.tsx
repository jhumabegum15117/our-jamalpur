import React, { useState } from 'react';
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
  ShieldCheck,
  Loader2,
  KeyRound,
  ArrowLeft,
  Send,
} from 'lucide-react';
import { authService, ADMIN_EMAILS } from '../services/authService';
import { storageService } from '../services/storageService';
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
  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [upazila, setUpazila] = useState<Upazila>('জামালপুর সদর');

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

  const handleSubmit = async (e: React.FormEvent) => {
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
              <span>Firebase Authentication</span>
            </div>
            <h3 className="text-lg font-extrabold text-white">
              {mode === 'login'
                ? 'নাগরিক একাউন্টে লগইন'
                : mode === 'register'
                ? 'নতুন একাউন্ট নিবন্ধন'
                : 'পাসওয়ার্ড পুনরুদ্ধার / রিসেট'}
            </h3>
            <p className="text-xs text-emerald-200/80">
              {mode === 'forgot_password'
                ? 'নিরাপদ লিঙ্কের মাধ্যমে নতুন পাসওয়ার্ড তৈরি করুন'
                : 'আমাদের জামালপুর ডিজিটাল সেবা প্ল্যাটফর্ম'}
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
                এডমিন প্যানেলে প্রবেশের জন্য আপনার নির্ধারিত এডমিন ইমেইল দিয়ে লগইন করতে হবে।
              </p>
            </div>
          </div>
        )}

        {/* Tab Switcher or Back Navigation */}
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
          <div className="grid grid-cols-2 p-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                setMode('login');
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
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

          {mode === 'forgot_password' ? (
            /* Forgot Password Flow */
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
                <KeyRound className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-[11px] leading-relaxed">
                  <p className="font-bold text-emerald-800 dark:text-emerald-300">
                    পাসওয়ার্ড ভুলে গেছেন? চিন্তা নেই!
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    আপনার নিবন্ধিত ইমেইল ঠিকানাটি লিখুন। আমরা সাথে সাথে একটি পাসওয়ার্ড রিসেট লিঙ্ক পাঠাব যার মাধ্যমে আপনি নতুন পাসওয়ার্ড সেট করে নিতে পারবেন।
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

              {successMsg ? (
                <div className="space-y-3 pt-1">
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed space-y-1">
                      <span className="font-bold block text-emerald-900 dark:text-emerald-100">
                        ইমেইল সফলভাবে পাঠানো হয়েছে!
                      </span>
                      <p>{successMsg}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>লগইন পেজে যান</span>
                  </button>
                </div>
              ) : (
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
                      <span>রিসেট লিঙ্ক পাঠান (Send Reset Link)</span>
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            /* Login & Register Fields */
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
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
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

                  {/* RBAC Security Note */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    🛡️ <strong>নিরাপত্তা নীতি:</strong> সকল নতুন অ্যাকাউন্ট স্বয়ংক্রিয়ভাবে সাধারণ <code>user</code> রোল পাবে। সাইনআপ ফর্ম থেকে কোনো এডমিন অনুমতি দেওয়া হয় না।
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

        {/* Footer info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500">
          {mode === 'login' ? (
            <p>
              অ্যাকাউন্ট নেই?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
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
