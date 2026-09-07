import React, { useState } from 'react';
import { Download, FolderTree, CheckCircle2, Copy, Smartphone, Sparkles, X, FileCode, Check, AlertCircle } from 'lucide-react';
import { generateProjectZip, generateSingleHtmlFile } from '../services/zipGenerator';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectExportModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [htmlSuccess, setHtmlSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    try {
      setIsGenerating(true);
      const blob = await generateProjectZip(true);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Our-Jamalpur.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err) {
      console.error('ZIP export error:', err);
      alert('ZIP তৈরিতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadSingleHtml = () => {
    try {
      const blob = generateSingleHtmlFile();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'index.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setHtmlSuccess(true);
      setTimeout(() => setHtmlSuccess(false), 5000);
    } catch (err) {
      console.error('HTML export error:', err);
    }
  };

  const projectTree = `Our-Jamalpur/ (Root Level Archive)
├── package.json         # Spck Editor Web Project Config
├── manifest.json        # PWA Mobile Manifest
├── spck.json            # Spck App Descriptor
├── index.html           # হোমপেজ ও ড্যাশবোর্ড
├── login.html           # ইউজার লগইন
├── register.html        # নতুন একাউন্ট রেজিস্ট্রেশন
├── marketplace.html     # লোকাল মার্কেটপ্লেস
├── product-details.html # পণ্যের বিবরণ ও বিক্রেতা যোগাযোগ
├── sell.html            # বিনামূল্যে বিজ্ঞাপন দেওয়ার ফর্ম
├── news.html            # জামালপুর জেলার ৭টি উপজেলার খবর
├── transport.html       # পরিবহন পোর্টাল
├── bus.html             # বাসের সময়সূচী ও কাউন্টার নম্বর
├── train.html           # ট্রেনের সময়সূচী ও ট্রেনের ভাড়া
├── hospital.html        # হাসপাতাল ও জরুরি হেল্পলাইন
├── doctors.html         # বিশেষজ্ঞ চিকিৎসকদের তালিকা ও চেম্বার
├── medicine.html        # ঔষধ তথ্য নির্দেশিকা ও সতর্কতা
├── jobs.html            # স্থানীয় চাকরির বিজ্ঞপ্তি
├── education.html       # ১ম-১০ম শ্রেণির বই ও হ্যান্ডনোট
├── quiz.html            # অনলাইন কুইজ প্রতিযোগিতা
├── blood-donor.html     # ব্লাড ডোনার ডিরেক্টরি
├── prayer.html          # নামাজের সময়সূচী
├── market-price.html    # প্রতিদিনের বাজারদর
├── business.html        # স্থানীয় ব্যবসা প্রতিষ্ঠান ডিরেক্টরি
├── contact.html         # যোগাযোগ ফর্ম
├── about.html           # উদ্যোক্তা (মাসুদ রানা) ও প্ল্যাটফর্ম পরিচিতি
│
├── admin/               # অ্যাডমিন প্যানেল
│   ├── index.html       # অ্যাডমিন ড্যাশবোর্ড ও পরিসংখ্যান
│   ├── products.html    # পণ্য নিয়ন্ত্রণ
│   ├── news.html        # সংবাদ প্রকাশ ও এডিট
│   ├── users.html       # ইউজার তালিকা
│   └── settings.html    # সাইট সেটিংস ও নোটিশ
│
├── css/
│   ├── style.css        # মূল স্টাইলশিট
│   └── responsive.css   # মোবাইল ও ট্যাবলেট রেসপন্সিভনেস
│
├── js/
│   ├── app.js           # ডিজিটাল ঘড়ি ও মূল ইঞ্জিন
│   ├── auth.js          # অথেনটিকেশন স্ক্রিপ্ট
│   ├── marketplace.js   # মার্কেটপ্লেস ফিল্টারিং
│   ├── news.js          # সংবাদ স্ক্রিপ্ট
│   ├── transport.js     # পরিবহন শিডিউল
│   ├── search.js        # গ্লোবাল সার্চ লজিক
│   └── admin.js         # অ্যাডমিন কন্ট্রোল স্ক্রিপ্ট
│
└── README.md            # সম্পূর্ণ প্রজেক্ট ব্যবহার নির্দেশিকা`;

  const copyTree = () => {
    navigator.clipboard.writeText(projectTree);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/50 flex items-center justify-center border border-emerald-500/30">
              <Download className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">ZIP Project & Spck Editor Export</h3>
              <p className="text-xs text-emerald-200">
                Spck Code Editor ও যেকোনো অ্যান্ড্রয়েড ডিভাইসে ব্যবহারের উপযোগী ফাইল ডাউনলোড
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-700/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-700 text-sm">
          
          {/* Option 1: Complete ZIP */}
          <div className="bg-emerald-50 border border-emerald-300/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-700 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  অপশন ১ (মূল ZIP)
                </span>
                <h4 className="font-bold text-emerald-950 text-base">
                  Our-Jamalpur.zip (Spck Ready)
                </h4>
              </div>
              <p className="text-xs text-emerald-800 mt-1 max-w-md">
                রুট লেভেলে <code className="bg-emerald-200/70 px-1 rounded font-bold">package.json</code> ও <code className="bg-emerald-200/70 px-1 rounded font-bold">index.html</code> সহ Spck Editor এর জন্য ১০০% সামঞ্জস্যপূর্ণ ফরম্যাট।
              </p>
            </div>
            <button
              id="download-zip-action-btn"
              onClick={handleDownloadZip}
              disabled={isGenerating}
              className="w-full sm:w-auto shrink-0 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold px-6 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50 active:scale-95"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>ZIP প্রস্তুত হচ্ছে...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                  <span>ZIP ডাউনলোড হয়েছে!</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Our-Jamalpur.zip ডাউনলোড</span>
                </>
              )}
            </button>
          </div>

          {/* Option 2: Direct Single index.html Download */}
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  অপশন ২ (নো আনজিপ)
                </span>
                <h4 className="font-bold text-amber-950 text-base">
                  সরাসরি index.html ফাইল ডাউনলোড
                </h4>
              </div>
              <p className="text-xs text-amber-900 mt-1 max-w-md">
                কোনো আনজিপ করার প্রয়োজন নেই! সরাসরি ফাইলটি ডাউনলোড করে ফোনে ট্যাপ করলেই যেকোনো ব্রাউজারে অফলাইনে চলবে।
              </p>
            </div>
            <button
              id="download-single-html-btn"
              onClick={handleDownloadSingleHtml}
              className="w-full sm:w-auto shrink-0 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
            >
              {htmlSuccess ? (
                <>
                  <Check className="w-4 h-4 text-slate-900" />
                  <span>index.html ডাউনলোড হয়েছে!</span>
                </>
              ) : (
                <>
                  <FileCode className="w-4 h-4" />
                  <span>index.html ডাউনলোড</span>
                </>
              )}
            </button>
          </div>

          {/* Spck Editor Fix & Guide */}
          <div className="bg-slate-900 text-slate-200 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>📱 Spck Editor-এ ওপেন করার সঠিক ২টি সহজ পদ্ধতি:</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <h5 className="font-bold text-emerald-400 mb-1.5 flex items-center gap-1">
                  <span>পদ্ধতি ১: Spck-এ Import from ZIP</span>
                </h5>
                <ol className="list-decimal list-inside space-y-1 text-slate-300">
                  <li>উপরে <strong>"Our-Jamalpur.zip ডাউনলোড"</strong> বাটনে ক্লিক করে ফাইলটি ডাউনলোড করুন।</li>
                  <li>Spck Editor ওপেন করে <strong>Import from ZIP</strong> সিলেক্ট করুন।</li>
                  <li>ডাউনলোড হওয়া <strong>Our-Jamalpur.zip</strong> বেছে নিন। এখন রুট লেভেলে কনফিগারেশন যুক্ত থাকায় সাথে সাথে প্রজেক্ট তৈরি হবে।</li>
                </ol>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <h5 className="font-bold text-sky-400 mb-1.5 flex items-center gap-1">
                  <span>পদ্ধতি ২: আনজিপ (Extract) করে ওপেন</span>
                </h5>
                <ol className="list-decimal list-inside space-y-1 text-slate-300">
                  <li>আপনার ফোনের ফাইল ম্যানেজার (Files / ZArchiver) দিয়ে ZIP টি Extract (আনজিপ) করুন।</li>
                  <li>Spck Editor এ <strong>Open Folder</strong> দিয়ে ফোল্ডারটি ওপেন করুন অথবা <strong>index.html</strong> ফাইলটিতে ক্লিক করুন।</li>
                  <li>উপরে <strong>Play (▶️)</strong> বাটনে ক্লিক করলেই লাইভ চলবে!</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Project Structure Explorer */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FolderTree className="w-4 h-4 text-emerald-600" />
                <span>প্রজেক্টের পূর্ণাঙ্গ ফাইল স্ট্রাকচার</span>
              </span>
              <button
                onClick={copyTree}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'কপি হয়েছে' : 'স্ট্রাকচার কপি করুন'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 text-emerald-300 font-mono text-xs p-4 rounded-xl overflow-x-auto max-h-48 leading-relaxed border border-slate-800">
              {projectTree}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[11px] text-slate-500 inline-flex items-center gap-1">
            উদ্যোক্তা ও পরিচালক: <strong className="text-slate-800 font-bold">মাসুদ রানা</strong>
            <span className="inline-flex items-center text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full text-[10px] font-bold gap-0.5">
              <CheckCircle2 className="w-3 h-3 fill-blue-600 text-white" />
              <span>Verified</span>
            </span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold cursor-pointer transition"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
