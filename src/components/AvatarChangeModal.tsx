import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Camera,
  Check,
  Link as LinkIcon,
  Trash2,
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import masudRanaPhoto from '../assets/images/masud_rana_profile_fixed_1789395910368.jpg';

interface AvatarChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string | null;
  userName: string;
  onSave: (avatarUrl: string) => Promise<void> | void;
  onRemove?: () => Promise<void> | void;
}

const PRESET_AVATARS = [
  {
    id: 'founder-official',
    label: 'প্রতিষ্ঠাতা (মাসুদ রানা)',
    url: masudRanaPhoto,
  },
  {
    id: 'avatar-male-1',
    label: 'স্মার্ট প্রফেশনাল ১',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-female-1',
    label: 'স্মার্ট প্রফেশনাল ২',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-creative-1',
    label: 'ক্রিয়েটিভ প্রোফাইল',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  },
];

export const AvatarChangeModal: React.FC<AvatarChangeModalProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  userName,
  onSave,
  onRemove,
}) => {
  const [activeSourceTab, setActiveSourceTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(currentAvatar || null);
  const [urlInput, setUrlInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Compress image to a sensible lightweight data URL so Firestore & LocalStorage stay ultra fast
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 500;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.88));
        };
        img.onerror = () => reject(new Error('ছবি লোড করা সম্ভব হয়নি'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('ফাইল পড়তে সমস্যা হয়েছে'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('দয়া করে একটি বৈধ ছবি ফাইল (JPG, PNG, WebP) নির্বাচন করুন।');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('ছবির সাইজ ১৫ মেগাবাইট এর বেশি হতে পারবে না।');
      return;
    }

    setErrorMessage(null);
    try {
      const compressed = await compressImage(file);
      setSelectedImage(compressed);
    } catch (err: any) {
      setErrorMessage(err?.message || 'ছবি প্রসেস করতে সমস্যা হয়েছে।');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSave = async () => {
    if (!selectedImage) {
      setErrorMessage('দয়া করে একটি ছবি নির্বাচন করুন।');
      return;
    }
    setIsSaving(true);
    setErrorMessage(null);
    try {
      await onSave(selectedImage);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'প্রোফাইল ছবি সেভ করতে সমস্যা হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                প্রোফাইল ছবি পরিবর্তন
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                নতুন ছবি নির্বাচন করে সরাসরি ডাটাবেসে সেভ করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Current / Selected Image Preview */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative group">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={userName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-lg ring-4 ring-emerald-100 dark:ring-emerald-950/80 border-2 border-emerald-500"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-emerald-700 to-teal-600 text-white font-black text-3xl flex items-center justify-center shadow-lg ring-4 ring-emerald-100 dark:ring-emerald-950/80">
                  {userName.charAt(0)}
                </div>
              )}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
              {selectedImage ? 'নির্বাচিত ছবির প্রিভিউ' : 'কোনো ছবি নির্বাচিত নেই'}
            </span>
          </div>

          {/* Source Tabs */}
          <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveSourceTab('upload')}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeSourceTab === 'upload'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>ডিভাইস আপলোড</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSourceTab('url')}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeSourceTab === 'url'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>ছবি লিংক</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSourceTab('presets')}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeSourceTab === 'presets'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>রেডি অবতার</span>
            </button>
          </div>

          {/* Tab 1: Upload */}
          {activeSourceTab === 'upload' && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-300 dark:border-emerald-700/60 hover:border-emerald-500 rounded-2xl p-5 text-center bg-emerald-50/40 dark:bg-emerald-950/20 cursor-pointer transition group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />
              <div className="w-11 h-11 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
                <Upload className="w-5 h-5" />
              </div>
              <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                ছবি নির্বাচন করতে এখানে ক্লিক করুন অথবা টেনে আনুন
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                JPG, PNG, WebP বা GIF (সরাসরি প্রোফাইল ছবি হিসেবে সেভ হবে)
              </p>
            </div>
          )}

          {/* Tab 2: URL */}
          {activeSourceTab === 'url' && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/my-photo.jpg"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (urlInput.trim()) {
                      setSelectedImage(urlInput.trim());
                    }
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition cursor-pointer shrink-0"
                >
                  প্রিভিউ
                </button>
              </div>
              <p className="text-[11px] text-slate-400">অনলাইন ছবির সরাসরি লিংক পেস্ট করে প্রিভিউ দেখুন।</p>
            </div>
          )}

          {/* Tab 3: Presets */}
          {activeSourceTab === 'presets' && (
            <div className="grid grid-cols-2 gap-2.5">
              {PRESET_AVATARS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedImage(preset.url)}
                  className={`p-2.5 rounded-2xl border text-center transition cursor-pointer flex items-center gap-2.5 ${
                    selectedImage === preset.url
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-emerald-300 dark:ring-emerald-700'
                      : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-600 shrink-0"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 text-left truncate">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 p-2.5 rounded-xl text-xs flex items-center gap-2 border border-rose-200 dark:border-rose-900">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between gap-3">
          <div>
            {currentAvatar && onRemove && (
              <button
                type="button"
                onClick={async () => {
                  if (confirm('আপনি কি বর্তমান প্রোফাইল ছবিটি মুছে ফেলতে চান?')) {
                    setIsSaving(true);
                    try {
                      await onRemove();
                      onClose();
                    } finally {
                      setIsSaving(false);
                    }
                  }
                }}
                disabled={isSaving}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1.5 transition cursor-pointer py-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ছবি মুছে ফেলুন</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !selectedImage}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>সংরক্ষণ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>ছবি পরিবর্তন সেভ করুন</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
