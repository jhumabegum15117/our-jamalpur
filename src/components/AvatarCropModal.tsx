import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Upload,
  Camera,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Check,
  RefreshCw,
  Link as LinkIcon,
  Trash2,
  Sparkles,
  User,
  Sliders,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import masudRanaPhoto from '../assets/images/masud_rana_profile_fixed_1789395910368.jpg';

interface AvatarCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string | null;
  userName: string;
  onSave: (croppedDataUrl: string) => Promise<void> | void;
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

export const AvatarCropModal: React.FC<AvatarCropModalProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  userName,
  onSave,
  onRemove,
}) => {
  const [activeSourceTab, setActiveSourceTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [imageUrl, setImageUrl] = useState<string | null>(currentAvatar || null);
  const [urlInput, setUrlInput] = useState('');
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Transform states for cropper
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Preview data URL
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Reset or load current avatar when opening
  useEffect(() => {
    if (isOpen) {
      if (currentAvatar) {
        setImageUrl(currentAvatar);
      }
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
      setErrorMessage(null);
      setIsSaving(false);
    }
  }, [isOpen, currentAvatar]);

  // Load image object whenever imageUrl changes
  useEffect(() => {
    if (!imageUrl) {
      imageElementRef.current = null;
      setPreviewDataUrl(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageElementRef.current = img;
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
      generatePreview(img, 1, 0, { x: 0, y: 0 });
    };
    img.onerror = () => {
      setErrorMessage('ছবিটি লোড করা সম্ভব হয়নি। অনুগ্রহ করে অন্য ছবি বা লিংক দিন।');
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Generate cropped preview using HTML5 Canvas
  const generatePreview = useCallback(
    (
      img: HTMLImageElement,
      currentZoom: number,
      currentRotation: number,
      currentPan: { x: number; y: number }
    ) => {
      const outputSize = 400; // 400x400 high resolution circular crop
      const canvas = document.createElement('canvas');
      canvas.width = outputSize;
      canvas.height = outputSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw circular clip path
      ctx.beginPath();
      ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Clear & fill background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, outputSize, outputSize);

      // Translate to center for rotation and scaling
      ctx.translate(outputSize / 2, outputSize / 2);
      ctx.rotate((currentRotation * Math.PI) / 180);

      // Base scaling to fit image nicely into output circle
      const baseScale = Math.max(outputSize / img.width, outputSize / img.height);
      const effectiveScale = baseScale * currentZoom;

      const drawWidth = img.width * effectiveScale;
      const drawHeight = img.height * effectiveScale;

      // Pan translation (adjusting for viewport scale ratio)
      const viewportSize = 260; // dimension of cropper circle on screen
      const scaleFactor = outputSize / viewportSize;
      const panX = currentPan.x * scaleFactor;
      const panY = currentPan.y * scaleFactor;

      ctx.drawImage(img, -drawWidth / 2 + panX, -drawHeight / 2 + panY, drawWidth, drawHeight);

      try {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        setPreviewDataUrl(dataUrl);
      } catch (e) {
        // Fallback if cross-origin tainted
        setPreviewDataUrl(imageUrl);
      }
    },
    [imageUrl]
  );

  // Update preview whenever transform states change
  useEffect(() => {
    if (imageElementRef.current) {
      generatePreview(imageElementRef.current, zoom, rotation, pan);
    }
  }, [zoom, rotation, pan, generatePreview]);

  // Handle local file selection
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('দয়া করে একটি বৈধ ছবি ফাইল (JPG, PNG, WebP) নির্বাচন করুন।');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setErrorMessage('ছবির সাইজ ১২ মেগাবাইট এর বেশি হতে পারবে না।');
      return;
    }

    setErrorMessage(null);
    setIsLoadingImage(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageUrl(result);
      setIsLoadingImage(false);
    };
    reader.onerror = () => {
      setErrorMessage('ফাইলটি পড়তে সমস্যা হয়েছে।');
      setIsLoadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Mouse & Touch Dragging Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageUrl) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!imageUrl || e.touches.length === 0) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return;
    const touch = e.touches[0];
    setPan({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Rotation controls
  const rotateClockwise = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const rotateCounterClockwise = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  // Reset transforms
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
  };

  // Save action
  const handleSave = async () => {
    if (!previewDataUrl) return;
    setIsSaving(true);
    setErrorMessage(null);
    try {
      await onSave(previewDataUrl);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'প্রোফাইল ছবি সেভ করতে সমস্যা হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto flex flex-col max-h-[92vh]"
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
                প্রোফাইল ছবি পরিবর্তন ও ক্রপ
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                বৃত্তাকার ফ্রেমে ছবি অ্যাডজাস্ট ও ডাটাবেসে সেভ করুন
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
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
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
              <span>ইন্টারনেট লিংক</span>
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
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
                <Upload className="w-6 h-6" />
              </div>
              <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                ছবি নির্বাচন করতে ক্লিক করুন অথবা এখানে টেনে আনুন
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                JPG, PNG, WebP বা GIF (সর্বোচ্চ ১২ মেগাবাইট)
              </p>
            </div>
          )}

          {/* Tab 2: URL */}
          {activeSourceTab === 'url' && (
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => {
                  if (urlInput.trim()) {
                    setImageUrl(urlInput.trim());
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0"
              >
                ছবি লোড করুন
              </button>
            </div>
          )}

          {/* Tab 3: Presets */}
          {activeSourceTab === 'presets' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRESET_AVATARS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`p-2 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                    imageUrl === preset.url
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-2 ring-emerald-300 dark:ring-emerald-700'
                      : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-12 h-12 rounded-full object-cover border border-slate-300 dark:border-slate-600 shadow-2xs"
                  />
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate w-full">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 p-3 rounded-xl text-xs flex items-center gap-2 border border-rose-200 dark:border-rose-900">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Cropper Viewport */}
          {imageUrl && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                  <span>বৃত্তাকার ক্রপ ও অ্যাডজাস্টমেন্ট ভিউপোর্ট</span>
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[11px] text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>রিসেট করুন</span>
                </button>
              </div>

              {/* Viewport Area */}
              <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="relative w-full aspect-square max-w-[280px] sm:max-w-[300px] mx-auto rounded-2xl overflow-hidden bg-slate-900 cursor-grab active:cursor-grabbing select-none shadow-inner border border-slate-800"
              >
                {/* Background image transformed */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom})`,
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                  }}
                >
                  <img
                    src={imageUrl}
                    alt="Crop preview"
                    className="max-w-none max-h-none object-cover"
                    style={{
                      width: '260px',
                      height: '260px',
                    }}
                    draggable={false}
                  />
                </div>

                {/* Circular Mask Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  {/* Outer Dimmer via SVG mask */}
                  <svg className="w-full h-full" viewBox="0 0 300 300">
                    <defs>
                      <mask id="circular-hole-mask">
                        <rect width="300" height="300" fill="white" />
                        <circle cx="150" cy="150" r="115" fill="black" />
                      </mask>
                    </defs>
                    <rect
                      width="300"
                      height="300"
                      fill="rgba(15, 23, 42, 0.7)"
                      mask="url(#circular-hole-mask)"
                    />
                    {/* Circle border & guide lines */}
                    <circle
                      cx="150"
                      cy="150"
                      r="115"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                    />
                  </svg>
                </div>

                {/* Guide overlay label */}
                <div className="absolute bottom-2 inset-x-0 text-center pointer-events-none">
                  <span className="text-[10px] text-white/80 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-xs font-medium">
                    মাউস বা স্পর্শ করে টেনে ছবিটি সেন্টার করুন
                  </span>
                </div>
              </div>

              {/* Controls: Zoom slider & Rotations */}
              <div className="space-y-3 pt-1 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                {/* Zoom control */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
                    className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition cursor-pointer shadow-2xs"
                    title="জুম আউট"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="range"
                      min="0.6"
                      max="3"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                    <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 w-10 text-right">
                      {Math.round(zoom * 100)}%
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.min(3, z + 0.15))}
                    className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition cursor-pointer shadow-2xs"
                    title="জুম ইন"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Rotation controls */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-600 dark:text-slate-400 font-medium text-[11px]">
                    ঘূর্ণন (Rotation):
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={rotateCounterClockwise}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] flex items-center gap-1 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition cursor-pointer shadow-2xs"
                    >
                      <RotateCcw className="w-3 h-3 text-emerald-600" />
                      <span>-৯০°</span>
                    </button>
                    <button
                      type="button"
                      onClick={rotateClockwise}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] flex items-center gap-1 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition cursor-pointer shadow-2xs"
                    >
                      <RotateCw className="w-3 h-3 text-emerald-600" />
                      <span>+৯০°</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Preview Circles */}
              {previewDataUrl && (
                <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-3.5 rounded-2xl border border-emerald-200/70 dark:border-emerald-800/40 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 block">
                      লাইভ বৃত্তাকার প্রিভিউ:
                    </span>
                    <span className="text-[11px] text-emerald-700/80 dark:text-emerald-400 block mt-0.5">
                      প্রোফাইল ও নেভবারে এমন দেখাবে
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <img
                        src={previewDataUrl}
                        alt="Profile size preview"
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-500 shadow-md"
                      />
                      <span className="text-[9px] text-slate-500 font-bold mt-1">প্রোফাইল</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <img
                        src={previewDataUrl}
                        alt="Navbar size preview"
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-400 shadow-xs"
                      />
                      <span className="text-[9px] text-slate-500 font-bold mt-1">নেভবার</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-wrap items-center justify-between gap-3">
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
              disabled={isSaving || !imageUrl}
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
                  <span>প্রোফাইল পিকচার সেট করুন</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
