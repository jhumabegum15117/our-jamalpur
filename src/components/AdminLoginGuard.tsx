import React, { useState } from 'react';
import { Shield, ShieldAlert, Lock, Mail, Loader2, ArrowLeft, LogIn } from 'lucide-react';
import { authService, isUserAdmin } from '../services/authService';
import { User } from '../types';

interface Props {
  onSuccess: (user: User) => void;
  onNavigateHome: () => void;
}

export const AdminLoginGuard: React.FC<Props> = ({ onSuccess, onNavigateHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError('দয়া করে আপনার অ্যাডমিন আইডি (ইমেইল) এবং পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    setLoading(true);
    try {
      const user = await authService.loginWithEmail(cleanEmail, password);
      if (!isUserAdmin(user)) {
        await authService.logout();
        throw new Error('এই একাউন্টটিতে অ্যাডমিন অনুমতি নেই। শুধুমাত্র অনুমোদিত অ্যাডমিন আইডি দিয়ে লগইন করুন।');
      }
      onSuccess(user);
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('ভুল অ্যাডমিন ইমেইল বা পাসওয়ার্ড। সঠিক তথ্য দিয়ে পুনরায় চেষ্টা করুন।');
      } else if (code === 'auth/user-not-found') {
        setError('এই ইমেইলে কোনো অ্যাডমিন একাউন্ট পাওয়া যায়নি।');
      } else if (code === 'auth/too-many-requests') {
        setError('অতিরিক্ত সংখ্যক ভুল চেষ্টার কারণে সাময়িক লক করা হয়েছে। কিছুক্ষণ পর চেষ্টা করুন।');
      } else {
        setError(err?.message || 'লগইন ব্যর্থ হয়েছে। আপনার আইডি ও পাসওয়ার্ড যাচাই করুন।');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-fade-in">
      {/* Header Badge */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 mx-auto flex items-center justify-center border border-purple-200 dark:border-purple-800 shadow-xs">
          <Shield className="w-8 h-8 stroke-[2.2]" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          অ্যাডমিন প্যানেল এক্সেস
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
          Our Jamalpur প্ল্যাটফর্মের অ্যাডমিন প্যানেল ও কনটেন্ট এডিটিং শুধুমাত্র অনুমোদিত অ্যাডমিনের জন্য সংরক্ষিত। প্রবেশ করতে আপনার অ্যাডমিন আইডি ও পাসওয়ার্ড প্রদান করুন।
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2 animate-shake">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {/* Admin Login Form */}
      <form onSubmit={handleAdminLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            অ্যাডমিন আইডি (ইমেইল) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mail.com"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            অ্যাডমিন পাসওয়ার্ড <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="আপনার গোপন পাসওয়ার্ড"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>যাচাই করা হচ্ছে...</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>এডমিন হিসেবে লগইন করুন</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onNavigateHome}
          className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>হোম পেজে ফিরে যান</span>
        </button>
      </form>

      {/* Security Note */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-center">
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          🛡️ <strong>সুরক্ষা ব্যবস্থা:</strong> সঠিক আইডি ও পাসওয়ার্ড ছাড়া কোনো ফিচার বা ডাটা এডিট করা সম্ভব নয়।
        </p>
      </div>
    </div>
  );
};
