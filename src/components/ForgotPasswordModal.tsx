import React, { useState } from 'react';
import {
  X,
  KeyRound,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Phone,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';
import { authService } from '../services/authService';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIdentifier?: string;
  onSuccessReturnToLogin?: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialIdentifier = '',
  onSuccessReturnToLogin,
}) => {
  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successEmail, setSuccessEmail] = useState<string | null>(null);

  // Sync initial identifier if changed when opening
  React.useEffect(() => {
    if (isOpen) {
      setIdentifier(initialIdentifier);
      setErrorMessage(null);
      setSuccessEmail(null);
    }
  }, [isOpen, initialIdentifier]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = identifier.trim();
    if (!clean) {
      setErrorMessage('দয়া করে আপনার নিবন্ধিত ইমেইল বা মোবাইল নম্বর দিন।');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const resolvedEmail = await authService.sendPasswordReset(clean);
      setSuccessEmail(resolvedEmail);
    } catch (err: any) {
      setErrorMessage(err?.message || 'পাসওয়ার্ড রিসেট লিংক পাঠাতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    onClose();
    if (onSuccessReturnToLogin) {
      onSuccessReturnToLogin();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                পাসওয়ার্ড ভুলে গেছেন?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ইমেইলে সিকিউর পাসওয়ার্ড রিসেট লিংক গ্রহণ করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {successEmail ? (
            /* Success State */
            <div className="space-y-4 text-center py-2 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                  রিসেট লিংক পাঠানো হয়েছে!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  আমরা আপনার ইমেইল এড্রেস <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">({successEmail})</span>-এ একটি পাসওয়ার্ড রিসেট লিংক পাঠিয়েছি।
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-left text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>জরুরি নির্দেশনা:</span>
                </p>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-800 dark:text-amber-300">
                  <li>আপনার ইমেইল ইনবক্স চেক করুন এবং লিংকে ক্লিক করে নতুন পাসওয়ার্ড দিন।</li>
                  <li>যদি ইনবক্সে না পান, দয়া করে <strong>Spam</strong> বা <strong>Junk</strong> ফোল্ডারটি চেক করুন।</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-md transition cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2 mt-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>লগইনে ফিরে যান</span>
              </button>
            </div>
          ) : (
            /* Reset Request Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                আপনার অ্যাকাউন্টের নিবন্ধিত <strong>ইমেইল এড্রেস</strong> অথবা <strong>মোবাইল নম্বর</strong> লিখুন। আমরা আপনাকে পাসওয়ার্ড রিসেট করার অফিশিয়াল ভেরিফিকেশন লিংক পাঠিয়ে দেব।
              </p>

              {errorMessage && (
                <div className="bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 p-3 rounded-xl text-xs flex items-start gap-2 border border-rose-200 dark:border-rose-900 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 text-xs mb-1.5">
                  ইমেইল বা মোবাইল নম্বর *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="01315481879 অথবা example@mail.com"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Admin Note */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  এডমিন অথবা জরুরি সহায়তার জন্য সরাসরি হেল্পলাইন <strong className="text-slate-700 dark:text-slate-200 font-mono">০১৩১৫৪৮১৮৭৯</strong>-এ যোগাযোগ করতে পারেন।
                </span>
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-md transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>পাঠানো হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>রিসেট লিংক পাঠান</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
