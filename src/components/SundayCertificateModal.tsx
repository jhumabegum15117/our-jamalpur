import React, { useState, useRef, useEffect } from 'react';
import {
  Award,
  Download,
  Printer,
  Share2,
  X,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Calendar,
  Building,
  User,
  QrCode,
  FileCheck,
} from 'lucide-react';
import { QuizCertificate } from '../types';
import { storageService } from '../services/storageService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialCertificate?: QuizCertificate | null;
  score?: number;
  totalScore?: number;
  userName?: string;
}

export const SundayCertificateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialCertificate,
  score = 100,
  totalScore = 100,
  userName = '',
}) => {
  const [recipientName, setRecipientName] = useState(
    initialCertificate?.recipientName || userName || 'মাসুদ রানা'
  );
  const [recipientUpazila, setRecipientUpazila] = useState(
    initialCertificate?.recipientUpazila || 'জামালপুর সদর'
  );
  const [institution, setInstitution] = useState(
    initialCertificate?.institution || 'সরকারি আশেক মাহমুদ কলেজ'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeCert, setActiveCert] = useState<QuizCertificate | null>(
    initialCertificate || null
  );
  const [isCopied, setIsCopied] = useState(false);

  const certContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (initialCertificate) {
      setActiveCert(initialCertificate);
      setRecipientName(initialCertificate.recipientName);
      setRecipientUpazila(initialCertificate.recipientUpazila || 'জামালপুর সদর');
      setInstitution(initialCertificate.institution || '');
    } else if (isOpen && !activeCert) {
      // Auto generate a new certificate for this session
      const generated = storageService.createSundayCertificate({
        recipientName: recipientName || 'মেধাবী প্রতিযোগী',
        recipientUpazila,
        institution,
        score,
        totalScore,
      });
      setActiveCert(generated);
    }
  }, [isOpen, initialCertificate]);

  if (!isOpen) return null;

  const handleUpdateDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim()) {
      alert('অনুগ্রহ করে প্রতিযোগীর নাম লিখুন');
      return;
    }
    const updated = storageService.createSundayCertificate({
      recipientName,
      recipientUpazila,
      institution,
      score,
      totalScore,
    });
    setActiveCert(updated);
  };

  // High-Resolution PNG Canvas Export
  const handleDownloadPng = () => {
    setIsGenerating(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 1200;
      const height = 850;
      canvas.width = width;
      canvas.height = height;

      // 1. Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Subtle textured border background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(20, 20, width - 40, height - 40);

      // 2. Outer Ornamental Border (Emerald & Gold)
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#065f46'; // Emerald 800
      ctx.strokeRect(30, 30, width - 60, height - 60);

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#d97706'; // Amber 600
      ctx.strokeRect(42, 42, width - 84, height - 84);

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(48, 48, width - 96, height - 96);

      // Corner Corner Accents
      const drawCorner = (x: number, y: number) => {
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
      };
      drawCorner(42, 42);
      drawCorner(width - 42, 42);
      drawCorner(42, height - 42);
      drawCorner(width - 42, height - 42);

      // 3. Top Banner & Brand
      ctx.textAlign = 'center';
      ctx.fillStyle = '#047857';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('গণপ্রজাতন্ত্রী বাংলাদেশ — জামালপুর জেলা ডিজিটাল প্ল্যাটফর্ম', width / 2, 90);

      ctx.fillStyle = '#0f172a';
      ctx.font = '900 36px sans-serif';
      ctx.fillText('Our Jamalpur অনলাইন মেধা মূল্যায়ন ও কুইজ পরিষদ', width / 2, 135);

      // Divider line
      const grad = ctx.createLinearGradient(width / 2 - 250, 0, width / 2 + 250, 0);
      grad.addColorStop(0, 'rgba(217, 119, 6, 0)');
      grad.addColorStop(0.5, '#d97706');
      grad.addColorStop(1, 'rgba(217, 119, 6, 0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 250, 155);
      ctx.lineTo(width / 2 + 250, 155);
      ctx.stroke();

      // Certificate Title
      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('★ সাপ্তাহিক রবিবার বিশেষ কুইজ প্রতিযোগিতা ★', width / 2, 190);

      ctx.fillStyle = '#064e3b';
      ctx.font = '900 48px serif';
      ctx.fillText('ডিজিটাল সম্মাননা সনদপত্র', width / 2, 250);

      ctx.fillStyle = '#64748b';
      ctx.font = 'italic 16px sans-serif';
      ctx.fillText('CERTIFICATE OF EXCELLENCE & MERIT', width / 2, 280);

      // Body text
      ctx.fillStyle = '#334155';
      ctx.font = '18px sans-serif';
      ctx.fillText('এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, জামালপুর জেলার কৃতি প্রতিযোগী', width / 2, 330);

      // Recipient Name Highlight
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 38px serif';
      ctx.fillText(activeCert?.recipientName || recipientName, width / 2, 385);

      // Underline for name
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 200, 400);
      ctx.lineTo(width / 2 + 200, 400);
      ctx.stroke();

      // Institution and Upazila
      const orgInfo = `${recipientUpazila ? `উপজেলা: ${recipientUpazila}` : ''} ${institution ? `| প্রতিষ্ঠান: ${institution}` : ''}`;
      ctx.fillStyle = '#475569';
      ctx.font = '16px sans-serif';
      ctx.fillText(orgInfo, width / 2, 430);

      // Citation Details
      ctx.fillStyle = '#1e293b';
      ctx.font = '18px sans-serif';
      ctx.fillText('আমাদের জামালপুর প্ল্যাটফর্মের রবিবার বিশেষ মেধা অন্বেষণ কুইজ প্রতিযোগিতায় অংশগ্রহণ করে', width / 2, 480);
      ctx.fillText(
        `সর্বমোট ১০০ নম্বরের মধ্যে অর্জিত স্কোর: ${activeCert?.score || score} নম্বর (${activeCert?.grade || 'গোল্ডেন স্টার — ১ম স্থান'}) লাভ করেছেন।`,
        width / 2,
        515
      );
      ctx.fillText('তাঁর এই অনন্য মেধা ও কৃতিত্বের স্বীকৃতিস্বরূপ এই ডিজিটাল সম্মাননা সনদপত্র প্রদান করা হলো।', width / 2, 550);

      // Golden Seal Stamp (Left Bottom)
      ctx.save();
      ctx.translate(160, 680);
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.arc(0, 0, 55, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('OFFICIAL SEAL', 0, -20);
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('★ 100% ★', 0, 5);
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('VERIFIED', 0, 25);
      ctx.restore();

      // Signatures
      // Left: Coordinator
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(340, 710);
      ctx.lineTo(490, 710);
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('কুইজ মূল্যায়ন পর্ষদ', 415, 735);
      ctx.fillStyle = '#64748b';
      ctx.font = '13px sans-serif';
      ctx.fillText('মেধা ও পরীক্ষা নিয়ন্ত্রক', 415, 755);

      // Right: Founder & CEO (Masud Rana)
      ctx.beginPath();
      ctx.moveTo(width - 460, 710);
      ctx.lineTo(width - 310, 710);
      ctx.stroke();

      ctx.fillStyle = '#065f46';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(activeCert?.signerName || 'মাসুদ রানা', width - 385, 735);
      ctx.fillStyle = '#475569';
      ctx.font = '13px sans-serif';
      ctx.fillText(activeCert?.signerTitle || 'প্রতিষ্ঠাতা ও প্রধান নির্বাহী, Our Jamalpur', width - 385, 755);

      // Footer Meta
      ctx.textAlign = 'left';
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText(`সনদ নং: ${activeCert?.certificateNo || 'OJ-SUN-2026-0830-101'}`, 60, 800);
      ctx.fillText(`ইস্যু তারিখ: ${activeCert?.issueSundayDate || 'রবিবার, ৩০ আগস্ট ২০২৬'}`, 60, 818);

      ctx.textAlign = 'right';
      ctx.fillText(`ভেরিফিকেশন কোড: ${activeCert?.verificationCode || 'OJ-VERIFIED-98472'}`, width - 60, 800);
      ctx.fillText('অনলাইন ভেরিফিকেশন: https://ourjamalpur.com/verify-cert', width - 60, 818);

      // Convert canvas to image and trigger download
      const imageUri = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Our_Jamalpur_Sunday_Quiz_Certificate_${(activeCert?.recipientName || 'winner').replace(/\s+/g, '_')}.png`;
      link.href = imageUri;
      link.click();
    } catch (err) {
      console.error('Download error:', err);
      alert('সার্টিফিকেট ডাউনলোড করতে কোনো সমস্যা হয়েছে। দয়া করে প্রিন্ট অপশনটি ব্যবহার করুন।');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const liveUrl = storageService.getOfficialLiveUrl();
    const text = `🏆 আমি Our Jamalpur রবিবার কুইজ প্রতিযোগিতায় সনদপত্র অর্জন করেছি! সনদ নং: ${activeCert?.certificateNo} (যাচাই করুন: ${liveUrl})`;
    if (navigator.share) {
      navigator.share({
        title: 'Our Jamalpur Sunday Quiz Certificate',
        text,
        url: liveUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} - ${liveUrl}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const cert = activeCert || {
    certificateNo: 'OJ-SUN-2026-0830-101',
    recipientName: recipientName || 'মাসুদ রানা',
    recipientUpazila: recipientUpazila || 'জামালপুর সদর',
    institution: institution || 'সরকারি আশেক মাহমুদ কলেজ',
    quizTitle: 'সাপ্তাহিক রবিবার বিশেষ কুইজ প্রতিযোগিতা — জামালপুর জ্ঞান জিজ্ঞাসা',
    score,
    totalScore,
    grade: 'গোল্ডেন স্টার (১ম স্থান — সেরা মেধা)',
    issueSundayDate: 'রবিবার, ৩০ আগস্ট ২০২৬',
    issuedAt: '২০২৬-০৮-৩০',
    verificationCode: 'OJ-VERIFIED-98472',
    authorityName: 'Our Jamalpur District Digital Portal & Quiz Authority',
    signerName: 'মাসুদ রানা',
    signerTitle: 'প্রতিষ্ঠাতা ও প্রধান নির্বাহী, Our Jamalpur',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in print:p-0 print:bg-white">
      {/* Hidden Canvas for High-Resolution PNG export */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden my-auto print:shadow-none print:border-none print:w-full print:max-w-none">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-700/80 text-emerald-200 border border-emerald-500/40">
                  সাপ্তাহিক রবিবার বিশেষ
                </span>
                <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ডিজিটাল সম্মাননা সনদপত্র</span>
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                Our Jamalpur রবিবার কুইজ সার্টিফিকেট
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Customization Form */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 print:hidden">
          <form onSubmit={handleUpdateDetails} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">প্রতিযোগীর নাম</label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="আপনার নাম"
                className="w-full p-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">উপজেলা</label>
              <select
                value={recipientUpazila}
                onChange={(e) => setRecipientUpazila(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="জামালপুর সদর">জামালপুর সদর</option>
                <option value="ইসলামপুর">ইসলামপুর</option>
                <option value="মেলান্দহ">মেলান্দহ</option>
                <option value="মাদারগঞ্জ">মাদারগঞ্জ</option>
                <option value="সরিষাবাড়ী">সরিষাবাড়ী</option>
                <option value="দেওয়ানগঞ্জ">দেওয়ানগঞ্জ</option>
                <option value="বকশীগঞ্জ">বকশীগঞ্জ</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">স্কুল / কলেজ / প্রতিষ্ঠান</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="উদাঃ আশেক মাহমুদ কলেজ"
                className="w-full p-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition cursor-pointer shadow-xs"
              >
                সনদে নাম আপডেট করুন
              </button>
            </div>
          </form>
        </div>

        {/* Certificate Visual Body */}
        <div className="p-4 sm:p-8 bg-slate-100 flex justify-center print:p-0 print:bg-white">
          <div
            ref={certContainerRef}
            id="official-certificate-container"
            className="w-full max-w-3xl bg-white border-8 border-emerald-900 shadow-xl rounded-2xl p-6 sm:p-10 relative overflow-hidden text-center select-none"
            style={{
              backgroundImage: 'radial-gradient(circle at center, #ffffff 60%, #f0fdf4 100%)',
            }}
          >
            {/* Gold Inner Inset Border */}
            <div className="absolute inset-2 border-2 border-amber-500 rounded-xl pointer-events-none"></div>
            <div className="absolute inset-3 border border-dashed border-emerald-300 rounded-lg pointer-events-none"></div>

            {/* Corner Badges */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-600"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-600"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-600"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-600"></div>

            {/* Certificate Header */}
            <div className="relative z-10 space-y-1">
              <div className="flex items-center justify-center gap-2 text-emerald-800 text-xs font-black uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>গণপ্রজাতন্ত্রী বাংলাদেশ — জামালপুর জেলা ডিজিটাল প্ল্যাটফর্ম</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Our Jamalpur অনলাইন মেধা মূল্যায়ন পরিষদ
              </h2>

              <div className="flex items-center justify-center gap-2 my-2">
                <span className="h-0.5 w-12 bg-amber-500"></span>
                <span className="text-xs font-black text-amber-700 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300 uppercase tracking-widest">
                  ★ সাপ্তাহিক রবিবার বিশেষ সম্মাননা সনদ ★
                </span>
                <span className="h-0.5 w-12 bg-amber-500"></span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-emerald-950 font-serif pt-2">
                ডিজিটাল সম্মাননা সনদপত্র
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 tracking-widest uppercase font-semibold">
                CERTIFICATE OF MERIT & EXCELLENCE
              </p>
            </div>

            {/* Certificate Main Body */}
            <div className="relative z-10 my-6 space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                এই মর্মে অত্যন্ত আনন্দের সাথে প্রত্যয়ন করা যাচ্ছে যে, জামালপুর জেলার কৃতি প্রতিযোগী
              </p>

              {/* Recipient Name Display */}
              <div className="py-2 inline-block border-b-2 border-emerald-700 min-w-[260px]">
                <span className="text-2xl sm:text-3xl font-black text-slate-950 font-serif tracking-wide text-emerald-900">
                  {cert.recipientName}
                </span>
              </div>

              <p className="text-xs text-slate-600 font-semibold">
                {cert.recipientUpazila && <span>উপজেলা: <strong>{cert.recipientUpazila}</strong></span>}
                {cert.institution && <span> | প্রতিষ্ঠান: <strong>{cert.institution}</strong></span>}
              </p>

              <div className="max-w-xl mx-auto text-xs sm:text-sm text-slate-700 leading-relaxed pt-2">
                <p>
                  আমাদের জামালপুর আয়োজিত সাপ্তাহিক রবিবার মেধা অন্বেষণ কুইজ প্রতিযোগিতায় অংশগ্রহণ করে
                  {' '}
                  <span className="font-extrabold text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                    ১০০ নম্বরের মধ্যে {cert.score} পয়েন্ট
                  </span>
                  {' '}
                  অর্জনের মাধ্যমে <strong>"{cert.grade}"</strong> অর্জন করেছেন।
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  তাঁর এই প্রখর সাধারণ জ্ঞান, মুক্তিযুদ্ধ ও জেলা ইতিহাস জানার গভীর আগ্রহ ও অসাধারণ কৃতিত্বের জন্য এই ডিজিটাল সনদ প্রদান করা হলো।
                </p>
              </div>
            </div>

            {/* Bottom Seal & Signatures */}
            <div className="relative z-10 pt-6 mt-4 border-t border-slate-200 grid grid-cols-3 items-end gap-2 text-center text-xs">
              {/* Official Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-amber-500 bg-gradient-to-br from-amber-200 via-amber-100 to-amber-300 text-amber-950 flex flex-col items-center justify-center font-black shadow-md">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-800" />
                  <span className="text-[8px] sm:text-[9px] uppercase tracking-tighter mt-0.5">OFFICIAL SEAL</span>
                  <span className="text-[10px] sm:text-xs font-extrabold text-amber-900">★ ১০০% ★</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 mt-1">ভেরিফাইড ডিজিটাল সিল</span>
              </div>

              {/* Coordinator Sign */}
              <div className="flex flex-col items-center">
                <div className="w-28 sm:w-36 h-8 border-b-2 border-slate-400 flex items-center justify-center italic text-slate-600 font-serif text-sm">
                  Exams Coordinator
                </div>
                <span className="font-bold text-slate-900 text-xs mt-1">কুইজ মূল্যায়ন পর্ষদ</span>
                <span className="text-[10px] text-slate-500">Our Jamalpur একাডেমি</span>
              </div>

              {/* Founder Sign */}
              <div className="flex flex-col items-center">
                <div className="w-28 sm:w-36 h-8 border-b-2 border-emerald-700 flex items-center justify-center italic text-emerald-800 font-serif font-black text-sm">
                  {cert.signerName}
                </div>
                <span className="font-extrabold text-emerald-950 text-xs mt-1">{cert.signerName}</span>
                <span className="text-[10px] text-slate-600">{cert.signerTitle}</span>
              </div>
            </div>

            {/* Certificate Footer Metadata */}
            <div className="relative z-10 mt-6 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 font-mono gap-1">
              <div>
                <span>সনদ নং: {cert.certificateNo}</span> | <span>ইস্যু: {cert.issueSundayDate}</span>
              </div>
              <div className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>কোড: {cert.verificationCode}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>সনদপত্রটি আজীবন যাচাইযোগ্য ও প্রিন্ট রেডি।</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadPng}
              disabled={isGenerating}
              className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs sm:text-sm font-black px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'জেনারেট হচ্ছে...' : '📥 PNG সার্টিফিকেট ডাউনলোড'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>🖨️ প্রিন্ট / PDF</span>
            </button>

            <button
              onClick={handleShare}
              className="bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{isCopied ? 'কপি হয়েছে!' : 'শেয়ার'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
