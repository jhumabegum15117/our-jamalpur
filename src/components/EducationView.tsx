import React, { useState, useMemo } from 'react';
import { BookOpen, Download, Search, FileText, Sparkles, ExternalLink, BookmarkCheck, Book } from 'lucide-react';
import { storageService } from '../services/storageService';
import { EducationBook } from '../types';

export const EducationView: React.FC = () => {
  const [books, setBooks] = useState<EducationBook[]>(storageService.getBooks());
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const classes = [
    { id: 'all', label: 'সকল শ্রেণি' },
    { id: 'Class 1', label: '১ম শ্রেণি' },
    { id: 'Class 2', label: '২য় শ্রেণি' },
    { id: 'Class 3', label: '৩য় শ্রেণি' },
    { id: 'Class 4', label: '৪র্থ শ্রেণি' },
    { id: 'Class 5', label: '৫ম শ্রেণি (PSC)' },
    { id: 'Class 6', label: '৬ষ্ঠ শ্রেণি' },
    { id: 'Class 7', label: '৭ম শ্রেণি' },
    { id: 'Class 8', label: '৮ম শ্রেণি (JSC)' },
    { id: 'Class 9', label: '৯ম শ্রেণি' },
    { id: 'Class 10', label: '১০ম শ্রেণি (SSC)' },
  ];

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const cls = b.classLevel || b.className || '';
      const matchClass = selectedClass === 'all' || cls === selectedClass;
      const matchSearch =
        !searchQuery.trim() ||
        b.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchClass && matchSearch;
    });
  }, [books, selectedClass, searchQuery]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-700/80 text-sky-200 text-xs font-bold mb-3 border border-sky-500/40">
            <BookOpen className="w-3.5 h-3.5" />
            <span>১ম থেকে ১০ম শ্রেণি ই-বুক ও স্টাডি কর্নার</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            জাতীয় শিক্ষাক্রমের পাঠ্যবই ও পরীক্ষার সাজেশন
          </h1>
          <p className="text-xs sm:text-sm text-sky-100/90 mt-2">
            NCTB অনুমোদিত সকল শ্রেণির মূল বই, মডেল টেস্ট, সৃজনশীল প্রশ্ন ও জামালপুর জেলার সেরা শিক্ষকদের সাজেশন।
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            id="education-search-input"
            type="text"
            placeholder="বিষয় বা বইয়ের নাম দিয়ে খুঁজুন (যেমন: গণিত, ইংরেজি, বাংলা, বিজ্ঞান)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
          />
        </div>

        {/* Class Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs font-semibold">
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClass(cls.id)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer border ${
                selectedClass === cls.id
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
            >
              {cls.label}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            id={`book-card-${book.id}`}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center font-bold shrink-0">
                    <Book className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                      {book.classLevel || book.className || 'পাঠ্যবই'}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-1">{book.title}</h3>
                    <p className="text-xs text-slate-500">{book.subject}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-slate-50 p-3 rounded-xl space-y-1 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>ধরণ: <strong>{book.type || 'NCTB Book'}</strong></span>
                  <span className="text-emerald-700 font-semibold">{book.fileSize || 'NCTB অনুমোদিত'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">ই-বুক পিডিএফ</span>
              <a
                href={book.downloadUrl || book.pdfLink || '#'}
                target="_blank"
                rel="noreferrer"
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>বই পড়ুন / ডাউনলোড</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
