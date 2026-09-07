import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Our Jamalpur:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const reg of registrations) {
            reg.unregister();
          }
        });
      }
      if ('caches' in window) {
        caches.keys().then((keys) => {
          for (const key of keys) {
            caches.delete(key);
          }
        });
      }
    } catch (e) {}
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-6 text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-500/20 border border-red-500/40 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-white mb-2">
              পেজ লোড করতে সাময়িক সমস্যা হয়েছে
            </h2>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              ব্রাউজারে পুরনো ক্যাশ বা নেটওয়ার্ক সংযোগের কারণে এমন হতে পারে। নিচের বাটনে চাপ দিয়ে ফ্রেশ রিলোড করুন।
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={this.handleReset}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>ক্যাশ ক্লিয়ার ও রিলোড করুন</span>
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
                className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition"
              >
                <Home className="w-4 h-4" />
                <span>হোমপেজে ফিরে যান</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
