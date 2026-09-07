import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  HelpCircle,
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  Sparkles,
  ArrowRight,
  Download,
  ShieldCheck,
  Search,
  ExternalLink,
  Calendar,
  FileCheck,
  Medal,
  Shuffle,
  Layers,
  BookOpen,
  Zap,
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { QuizQuestion, User, QuizCertificate } from '../types';
import { SundayCertificateModal } from './SundayCertificateModal';

interface Props {
  currentUser: User | null;
}

interface PreparedQuestion extends QuizQuestion {
  shuffledOptions: string[];
  shuffledCorrectIdx: number;
}

const CATEGORIES = [
  'সব সাধারণ জ্ঞান',
  'জামালপুর জেলা',
  'মুক্তিযুদ্ধ ও বাংলাদেশ',
  'বাংলাদেশ বিষয়াবলি',
  'আন্তর্জাতিক সাধারণ জ্ঞান',
  'বিজ্ঞান ও প্রযুক্তি',
  'সাহিত্য ও সংস্কৃতি',
  'খেলাধুলা',
  'ইসলামিক ও ঐতিহ্যবাহী জ্ঞান',
];

export const QuizView: React.FC<Props> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'certificates' | 'leaderboard'>('quiz');
  const [allQuestions, setAllQuestions] = useState<QuizQuestion[]>(() => storageService.getQuizzes());
  const [selectedCategory, setSelectedCategory] = useState<string>('সব সাধারণ জ্ঞান');
  const [questionCount, setQuestionCount] = useState<number>(10);
  
  // Track played question IDs to prevent immediate repeats
  const [playedIds, setPlayedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('oj_played_quiz_ids');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeQuestions, setActiveQuestions] = useState<PreparedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [answersHistory, setAnswersHistory] = useState<Array<{ isCorrect: boolean; userAns: number; correctAns: number }>>([]);

  const [leaderboard, setLeaderboard] = useState<Array<{ name: string; score: number; date: string }>>([
    { name: 'তানভীর আহমেদ', score: 100, date: 'আজ' },
    { name: 'রাকিবুল হাসান', score: 95, date: 'গতকাল' },
    { name: 'সালমা খাতুন', score: 90, date: '২ দিন আগে' },
    { name: 'মাসুদ রানা', score: 100, date: 'আজ' },
    { name: 'তাহসিনা জাহান', score: 90, date: 'আজ' },
  ]);

  // Certificate Modal State
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<QuizCertificate | null>(null);
  const [certificates, setCertificates] = useState<QuizCertificate[]>(() => storageService.getCertificates());
  const [certSearchQuery, setCertSearchQuery] = useState('');

  // Function to prepare & shuffle a question
  const prepareQuestion = (q: QuizQuestion): PreparedQuestion => {
    const originalCorrectIndex = q.correctAnswerIndex ?? q.correctIndex ?? 0;
    const correctOptionText = q.options[originalCorrectIndex] ?? q.options[0];

    // Shuffle options while tracking correct option
    const shuffled = [...q.options].sort(() => Math.random() - 0.5);
    const newCorrectIdx = shuffled.indexOf(correctOptionText);

    return {
      ...q,
      shuffledOptions: shuffled,
      shuffledCorrectIdx: newCorrectIdx >= 0 ? newCorrectIdx : 0,
    };
  };

  // Helper to load fresh unique non-repeating questions
  const loadFreshQuestions = useCallback(
    (category: string, count: number) => {
      let pool = allQuestions;
      if (category !== 'সব সাধারণ জ্ঞান') {
        pool = allQuestions.filter((q) => q.category === category);
        if (pool.length === 0) pool = allQuestions; // fallback
      }

      // Filter out already played questions for this session
      let unplayed = pool.filter((q) => !playedIds.includes(q.id));

      // If unplayed is too small, reset cycle for this pool
      if (unplayed.length < Math.min(count, pool.length)) {
        unplayed = pool;
        setPlayedIds([]);
        localStorage.removeItem('oj_played_quiz_ids');
      }

      // Shuffle unplayed
      const shuffledPool = [...unplayed].sort(() => Math.random() - 0.5);
      const chosen = shuffledPool.slice(0, Math.min(count, pool.length));

      const prepared = chosen.map(prepareQuestion);
      setActiveQuestions(prepared);

      // Record selected question IDs to avoid repeats
      const newPlayedIds = Array.from(new Set([...playedIds, ...chosen.map((q) => q.id)]));
      setPlayedIds(newPlayedIds);
      try {
        localStorage.setItem('oj_played_quiz_ids', JSON.stringify(newPlayedIds));
      } catch (e) {
        console.error(e);
      }

      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setScore(0);
      setIsFinished(false);
      setTimeLeft(15);
      setAnswersHistory([]);
    },
    [allQuestions, playedIds]
  );

  // Initialize questions on mount or category change
  useEffect(() => {
    loadFreshQuestions(selectedCategory, questionCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, questionCount]);

  const currentQ = activeQuestions[currentIndex];
  const correctIdx = currentQ ? currentQ.shuffledCorrectIdx : 0;

  // Timer effect
  useEffect(() => {
    if (isFinished || isAnswered || activeTab !== 'quiz' || !currentQ) return;

    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished, isAnswered, activeTab, currentQ]);

  const handleTimeUp = () => {
    setIsAnswered(true);
    setSelectedOption(-1); // timeout
    setAnswersHistory((prev) => [...prev, { isCorrect: false, userAns: -1, correctAns: correctIdx }]);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === correctIdx;
    if (isCorrect) {
      setScore((prev) => prev + 10);
    }
    setAnswersHistory((prev) => [...prev, { isCorrect, userAns: idx, correctAns: correctIdx }]);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(15);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    loadFreshQuestions(selectedCategory, questionCount);
  };

  const handleSaveScore = () => {
    const name = currentUser?.name || prompt('আপনার নাম লিখুন:') || 'নামহীন প্রতিযোগী';
    const newEntry = { name, score, date: 'এখন' };
    setLeaderboard([newEntry, ...leaderboard].sort((a, b) => b.score - a.score));
    alert('স্কোরবোর্ডে আপনার নাম সফলভাবে যুক্ত হয়েছে!');
  };

  const handleOpenNewCertificate = () => {
    setSelectedCert(null);
    setIsCertModalOpen(true);
  };

  const handleViewExistingCert = (cert: QuizCertificate) => {
    setSelectedCert(cert);
    setIsCertModalOpen(true);
  };

  const filteredCertificates = certificates.filter(
    (c) =>
      c.recipientName.toLowerCase().includes(certSearchQuery.toLowerCase()) ||
      c.certificateNo.toLowerCase().includes(certSearchQuery.toLowerCase()) ||
      (c.recipientUpazila && c.recipientUpazila.toLowerCase().includes(certSearchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-purple-800/40 relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-700/80 text-purple-200 text-xs font-bold mb-3 border border-purple-500/40">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>জামালপুর জেলা ও সাধারণ জ্ঞান কুইজ ব্যাংক ({allQuestions.length}+ প্রশ্ন)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            সাধারণ জ্ঞান কুইজ ও রবিবার ডিজিটাল সম্মাননা সনদ
          </h1>
          <p className="text-xs sm:text-sm text-purple-100/90 mt-2">
            প্রতিটি সেশনে স্বয়ংক্রিয়ভাবে ভিন্ন ও আনকমন সাধারণ জ্ঞান প্রশ্ন লোড হবে। প্রতি রবিবার সঠিক উত্তরকারীদের জন্য <strong>ভেরিফাইড ডিজিটাল সনদপত্র</strong> ইস্যু ও ডাউনলোড করা যাবে।
          </p>
        </div>

        {/* Certificate Quick Action Button */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 relative z-10">
          <button
            onClick={handleOpenNewCertificate}
            className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
          >
            <Award className="w-4 h-4 fill-slate-950" />
            <span>🏆 রবিবার সার্টিফিকেট পান (Download)</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className="bg-purple-800/80 hover:bg-purple-700 text-white border border-purple-500/40 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>সনদপত্র গ্যালারি ও ভেরিফিকেশন</span>
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200 dark:bg-slate-800 rounded-2xl max-w-xl">
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'quiz'
              ? 'bg-white dark:bg-slate-900 text-purple-900 dark:text-purple-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>কুইজ প্রতিযোগিতা</span>
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'certificates'
              ? 'bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>রবিবার সার্টিফিকেট সমূহ ({certificates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'leaderboard'
              ? 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Trophy className="w-4 h-4 text-emerald-600" />
          <span>লিডারবোর্ড</span>
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === 'quiz' && (
        <div className="space-y-5">
          {/* Category & Controls Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  সাধারণ জ্ঞান ক্যাটাগরি নির্বাচন করুন:
                </span>
              </div>

              {/* Question Count Selector & Shuffle Button */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-semibold">প্রশ্নের সংখ্যা:</span>
                {[5, 10, 15].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => setQuestionCount(cnt)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      questionCount === cnt
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {cnt}টি
                  </button>
                ))}

                <button
                  onClick={() => loadFreshQuestions(selectedCategory, questionCount)}
                  title="নতুন আনকমন প্রশ্ন লোড করুন"
                  className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-lg transition cursor-pointer shadow-xs ml-2"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>নতুন প্রশ্ন লোড</span>
                </button>
              </div>
            </div>

            {/* Category Chips Scroll */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Quiz Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Quiz Box */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[440px]">
              {activeQuestions.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">প্রশ্ন প্রস্তুত করা হচ্ছে...</p>
                  <button
                    onClick={() => loadFreshQuestions(selectedCategory, questionCount)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold"
                  >
                    পুনরায় লোড করুন
                  </button>
                </div>
              ) : !isFinished && currentQ ? (
                <>
                  {/* Question Header */}
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-lg">
                          প্রশ্ন {currentIndex + 1} / {activeQuestions.length}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                          {currentQ.category}
                        </span>
                      </div>

                      {/* Timer */}
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono font-bold text-xs ${
                          timeLeft <= 5
                            ? 'bg-red-100 text-red-700 animate-pulse border border-red-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{timeLeft} সেকেন্ড</span>
                      </div>
                    </div>

                    {/* Question text */}
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-5 leading-snug">
                      {currentQ.question}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5 my-6">
                    {currentQ.shuffledOptions.map((opt, idx) => {
                      let optStyle =
                        'bg-slate-50 dark:bg-slate-800/80 hover:bg-purple-50/60 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';

                      if (isAnswered) {
                        if (idx === correctIdx) {
                          optStyle =
                            'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-bold';
                        } else if (selectedOption === idx) {
                          optStyle =
                            'bg-red-100 dark:bg-red-950/60 border-red-500 text-red-950 dark:text-red-200 font-bold';
                        } else {
                          optStyle =
                            'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          id={`quiz-option-${idx}`}
                          disabled={isAnswered}
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full text-left p-3.5 rounded-2xl border-2 transition flex items-center justify-between text-xs sm:text-sm font-semibold cursor-pointer ${optStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-white/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{opt}</span>
                          </div>

                          {isAnswered && idx === correctIdx && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          )}
                          {isAnswered && selectedOption === idx && idx !== correctIdx && (
                            <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation & Next */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    {isAnswered && (
                      <div className="text-xs text-slate-700 dark:text-slate-300 bg-purple-50 dark:bg-purple-950/40 p-3 rounded-xl border border-purple-100 dark:border-purple-900/50 flex-1">
                        💡 <strong>ব্যাখ্যা:</strong> {currentQ.explanation}
                      </div>
                    )}

                    {isAnswered && (
                      <button
                        id="quiz-next-btn"
                        onClick={handleNextQuestion}
                        className="shrink-0 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md cursor-pointer ml-auto"
                      >
                        <span>
                          {currentIndex + 1 === activeQuestions.length ? 'ফলাফল দেখুন' : 'পরবর্তী প্রশ্ন'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </>
              ) : (
                /* Results Screen */
                <div className="py-6 text-center space-y-5 animate-fade-in">
                  <div className="w-20 h-20 bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                    <Trophy className="w-10 h-10 animate-bounce text-amber-500" />
                  </div>

                  <div>
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-widest bg-purple-50 dark:bg-purple-950 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
                      কুইজ সমাপ্ত হয়েছে!
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-3">
                      আপনার মোট স্কোর: {score} / {activeQuestions.length * 10}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      সঠিক উত্তর: {score / 10}টি | ভুল/মিস: {activeQuestions.length - score / 10}টি
                    </p>
                  </div>

                  {/* Certificate Claim Banner on Results */}
                  <div className="p-4 bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-amber-500/15 rounded-2xl border border-amber-300 dark:border-amber-700 max-w-lg mx-auto text-left flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 dark:text-amber-300">
                        <Award className="w-4 h-4 text-amber-600" />
                        <span>রবিবার ডিজিটাল সার্টিফিকেট অর্জিত হয়েছে!</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                        আপনার নাম ও প্রতিষ্ঠান দিয়ে ডিজিটাল সম্মাননা সনদপত্র এখনই ডাউনলোড করুন।
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCert(null);
                        setIsCertModalOpen(true);
                      }}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-black shrink-0 flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>সার্টিফিকেট ডাউনলোড</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      id="quiz-save-score-btn"
                      onClick={handleSaveScore}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition"
                    >
                      <Award className="w-4 h-4" />
                      <span>লিডারবোর্ডে স্কোর সংরক্ষণ</span>
                    </button>
                    <button
                      id="quiz-restart-btn"
                      onClick={handleRestart}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 transition shadow-sm"
                    >
                      <Shuffle className="w-4 h-4" />
                      <span>নতুন প্রশ্ন নিয়ে খেলুন</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sunday Certificate & Leaderboard Sidebar */}
            <div className="space-y-6">
              {/* Certificate Promo Card */}
              <div className="bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-purple-500/10 border-2 border-amber-300 dark:border-amber-600/50 rounded-3xl p-5 shadow-xs relative overflow-hidden">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-sm">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-300 bg-amber-200/80 dark:bg-amber-950/80 px-2 py-0.5 rounded-md">
                      রবিবার বিশেষ
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 mt-0.5">
                      ডিজিটাল সার্টিফিকেট
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  সাপ্তাহিক রবিবার কুইজে অংশগ্রহণকারীদের Our Jamalpur মেধা পরিষদ থেকে অফিসিয়াল ডিজিটাল সম্মাননা সনদপত্র ও ভেরিফিকেশন কোড প্রদান করা হয়।
                </p>

                <button
                  onClick={handleOpenNewCertificate}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <Download className="w-4 h-4" />
                  <span>সার্টিফিকেট দাবি ও ডাউনলোড করুন</span>
                </button>
              </div>

              {/* Leaderboard Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        জামালপুর কুইজ লিডারবোর্ড
                      </h4>
                      <p className="text-[11px] text-slate-400">সর্বোচ্চ স্কোর অর্জনকারীদের তালিকা</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 mt-4">
                    {leaderboard.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                              idx === 0
                                ? 'bg-amber-400 text-slate-950 font-extrabold shadow-2xs'
                                : idx === 1
                                ? 'bg-slate-300 text-slate-800'
                                : idx === 2
                                ? 'bg-amber-200 text-amber-900'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">{item.name}</span>
                            <span className="text-[10px] text-slate-400">{item.date}</span>
                          </div>
                        </div>

                        <span className="font-extrabold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded">
                          {item.score} পয়েন্ট
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-center text-slate-400">
                  প্রতি রবিবার বিজয়ীদের ডিজিটাল সার্টিফিকেট প্রদান করা হয়।
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificates Gallery Tab */}
      {activeTab === 'certificates' && (
        <div className="space-y-6 animate-fade-in">
          {/* Search & Actions Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={certSearchQuery}
                onChange={(e) => setCertSearchQuery(e.target.value)}
                placeholder="প্রতিযোগীর নাম বা সনদ নম্বর দিয়ে খুঁজুন..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-slate-800 dark:text-slate-200"
              />
            </div>

            <button
              onClick={handleOpenNewCertificate}
              className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md shrink-0 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>নতুন সার্টিফিকেট তৈরি / দাবি করুন</span>
            </button>
          </div>

          {/* Certificate Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-amber-200/80 dark:border-amber-600/40 hover:border-amber-400 transition-all p-5 shadow-xs hover:shadow-md flex flex-col justify-between group"
              >
                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-[10px] font-black text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
                      ★ রবিবার সম্মাননা সনদ
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{cert.certificateNo}</span>
                  </div>

                  {/* Recipient Details */}
                  <div className="mt-4 space-y-1 text-center py-2 bg-gradient-to-b from-amber-50/50 dark:from-amber-950/30 to-transparent rounded-2xl">
                    <Award className="w-8 h-8 text-amber-500 mx-auto mb-1" />
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 font-serif">
                      {cert.recipientName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {cert.recipientUpazila} {cert.institution ? `| ${cert.institution}` : ''}
                    </p>
                  </div>

                  {/* Grade & Score */}
                  <div className="my-3 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">অর্জিত গ্রেড:</span>
                      <span className="font-bold text-amber-800 dark:text-amber-300">{cert.grade}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">মোট স্কোর:</span>
                      <span className="font-black text-purple-700 dark:text-purple-300">
                        {cert.score} / {cert.totalScore}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">ইস্যু তারিখ:</span>
                      <span className="text-slate-600 dark:text-slate-300">{cert.issueSundayDate}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ভেরিফাইড</span>
                  </div>

                  <button
                    onClick={() => handleViewExistingCert(cert)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>সনদ দেখুন & ডাউনলোড</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs max-w-2xl mx-auto space-y-6 animate-fade-in">
          <div className="text-center space-y-1 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/60 rounded-2xl flex items-center justify-center mx-auto text-amber-600">
              <Trophy className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              জামালপুর জেলা কুইজ মেধা তালিকা
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              সাপ্তাহিক রবিবার কুইজে সেরা ফলাফল অর্জনকারী মেধার তালিকা
            </p>
          </div>

          <div className="space-y-3">
            {leaderboard.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/80 hover:bg-purple-50/50 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                      idx === 0
                        ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-800 font-bold'
                        : idx === 2
                        ? 'bg-amber-200 text-amber-900 font-bold'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{item.name}</h4>
                    <span className="text-[11px] text-slate-400">{item.date}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 px-3 py-1 rounded-xl">
                    {item.score} পয়েন্ট
                  </span>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold mt-1">
                    সার্টিফিকেট রেডি ☑️
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sunday Digital Certificate Modal */}
      <SundayCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => {
          setIsCertModalOpen(false);
          setSelectedCert(null);
          setCertificates(storageService.getCertificates());
        }}
        initialCertificate={selectedCert}
        score={score || (activeQuestions.length ? activeQuestions.length * 10 : 100)}
        totalScore={activeQuestions.length ? activeQuestions.length * 10 : 100}
        userName={currentUser?.name || ''}
      />
    </div>
  );
};


