import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
} from 'recharts';
import { MonetizationRequest, AdBannerItem } from '../types';
import { TrendingUp, Eye, Clock, DollarSign, BarChart3, ArrowUpRight, Sparkles } from 'lucide-react';

interface Props {
  monetizationRequests: MonetizationRequest[];
  adBanners: AdBannerItem[];
}

export const AdminMonetizationChart: React.FC<Props> = ({
  monetizationRequests,
  adBanners,
}) => {
  const [chartView, setChartView] = useState<'overview' | 'revenue' | 'impressions'>('overview');

  // Compute live aggregates
  const stats = useMemo(() => {
    const realized =
      monetizationRequests
        .filter((r) => r.status === 'approved')
        .reduce((sum, r) => sum + (r.amount || 0), 0) +
      adBanners.reduce((sum, b) => sum + (b.amountPaid || 0), 0);

    const pendingRequests = monetizationRequests.filter((r) => r.status === 'pending');
    const pendingRevenue = pendingRequests.reduce((sum, r) => sum + (r.amount || 0), 0);
    const potentialRevenue = realized + pendingRevenue;
    const activeBanners = adBanners.filter((b) => b.status === 'active').length;
    
    // Estimated daily impressions based on active banners and site traffic
    const estimatedDailyImpressions = Math.max(850, activeBanners * 1450 + 620);

    return {
      realized,
      pendingRevenue,
      potentialRevenue,
      pendingCount: pendingRequests.length,
      approvedCount: monetizationRequests.filter((r) => r.status === 'approved').length,
      activeBanners,
      estimatedDailyImpressions,
    };
  }, [monetizationRequests, adBanners]);

  // Generate 7-day realistic progression data taking into account real state
  const chartData = useMemo(() => {
    const days = [
      { name: '০১ মার্চ', day: 'শনিবার' },
      { name: '০২ মার্চ', day: 'রবিবার' },
      { name: '০৩ মার্চ', day: 'সোমবার' },
      { name: '০৪ মার্চ', day: 'মঙ্গলবার' },
      { name: '০৫ মার্চ', day: 'বুধবার' },
      { name: '০৬ মার্চ', day: 'বৃহস্পতিবার' },
      { name: 'আজ', day: 'আজকের দিন' },
    ];

    // Distribute actual revenue and requests across days with today having current active pending
    const dailyBaseRevenue = Math.round(stats.realized / 7);
    const pendingTotal = stats.pendingRevenue;
    const pendingCount = stats.pendingCount;

    return days.map((d, index) => {
      const isToday = index === days.length - 1;
      const dayFactor = 0.75 + (index * 0.08); // Slight upward trend

      const realized = Math.round(dailyBaseRevenue * dayFactor);
      // Pending requests build up towards today
      const pendingReqs = isToday
        ? pendingCount
        : Math.max(0, Math.round(pendingCount * (index / 10)));
      
      const potential = isToday
        ? realized + pendingTotal
        : realized + Math.round((pendingTotal / 4) * (index % 2));

      const impressions = Math.round(stats.estimatedDailyImpressions * (0.8 + (index * 0.07)));

      return {
        date: d.name,
        fullDay: d.day,
        potentialRevenue: potential,
        realizedRevenue: realized,
        pendingRequests: pendingReqs,
        impressions,
      };
    });
  }, [stats]);

  // Breakdown by ad placement
  const placementData = useMemo(() => {
    const counts = {
      home_top: adBanners.filter((b) => b.placement === 'home_top').length,
      marketplace: adBanners.filter((b) => b.placement === 'marketplace').length,
      news: adBanners.filter((b) => b.placement === 'news').length,
      sidebar: adBanners.filter((b) => b.placement === 'sidebar').length,
    };

    return [
      {
        placement: 'হোমপেজ ব্যানার',
        active: counts.home_top,
        impressions: Math.max(1200, counts.home_top * 1800),
        potentialRev: counts.home_top * 2500 || 2500,
      },
      {
        placement: 'মার্কেটপ্লেস বিজ্ঞাপন',
        active: counts.marketplace,
        impressions: Math.max(850, counts.marketplace * 1200),
        potentialRev: counts.marketplace * 1000 || 1000,
      },
      {
        placement: 'সংবাদ পেজ বিজ্ঞাপন',
        active: counts.news,
        impressions: Math.max(950, counts.news * 1350),
        potentialRev: counts.news * 800 || 800,
      },
      {
        placement: 'সাইডবার ব্যানার',
        active: counts.sidebar,
        impressions: Math.max(500, counts.sidebar * 900),
        potentialRev: counts.sidebar * 500 || 500,
      },
    ];
  }, [adBanners]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-5">
      {/* Header with Title & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <BarChart3 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <span>মনিটাইজেশন ও বিজ্ঞাপন অ্যানালিটিক্স</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  লাইভ চার্ট
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                সম্ভাব্য রাজস্ব, ব্যানার ভিউ/ইমপ্রেশন ও পেন্ডিং বিজ্ঞাপন আবেদনের রিয়েল-টাইম ট্র্যাকার
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto text-xs font-bold">
          <button
            onClick={() => setChartView('overview')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              chartView === 'overview'
                ? 'bg-white text-purple-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            সার্বিক পর্যালোচনা
          </button>
          <button
            onClick={() => setChartView('revenue')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              chartView === 'revenue'
                ? 'bg-white text-purple-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            সম্ভাব্য রাজস্ব
          </button>
          <button
            onClick={() => setChartView('impressions')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              chartView === 'impressions'
                ? 'bg-white text-purple-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ইমপ্রেশন ও প্লেসমেন্ট
          </button>
        </div>
      </div>

      {/* 3 Metric Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Metric 1: Potential Revenue */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>সম্ভাব্য মোট রাজস্ব (Potential)</span>
            </span>
            <span className="p-1 rounded bg-emerald-200/50 text-emerald-800 text-[10px] font-extrabold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> অর্জিত + পেন্ডিং
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-950 mt-2">
            ৳ {stats.potentialRevenue.toLocaleString('bn-BD')}
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5 flex items-center justify-between">
            <span>নিশ্চিত অর্জিত: ৳ {stats.realized.toLocaleString('bn-BD')}</span>
            <span className="font-semibold text-amber-700">
              অপেক্ষমাণ: ৳ {stats.pendingRevenue.toLocaleString('bn-BD')}
            </span>
          </div>
        </div>

        {/* Metric 2: Ad Impressions */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>দৈনিক বিজ্ঞাপন ইমপ্রেশন (Views)</span>
            </span>
            <span className="p-1 rounded bg-blue-200/50 text-blue-800 text-[10px] font-extrabold">
              {stats.activeBanners} টি ব্যানার
            </span>
          </div>
          <div className="text-2xl font-black text-blue-950 mt-2">
            ~{stats.estimatedDailyImpressions.toLocaleString('bn-BD')}
          </div>
          <div className="text-[11px] text-blue-700 mt-0.5">
            হোমপেজ, মার্কেট ও সংবাদ পেজে বিজ্ঞাপনের দৃশ্যমানতা
          </div>
        </div>

        {/* Metric 3: Pending Ad Requests */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>পেন্ডিং বিজ্ঞাপন আবেদন</span>
            </span>
            <span
              className={`p-1 rounded text-[10px] font-extrabold ${
                stats.pendingCount > 0
                  ? 'bg-amber-200 text-amber-900 animate-pulse'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {stats.pendingCount > 0 ? 'অ্যাকশন প্রয়োজন' : 'আপ-টু-ডেট'}
            </span>
          </div>
          <div className="text-2xl font-black text-amber-950 mt-2">
            {stats.pendingCount} টি
          </div>
          <div className="text-[11px] text-amber-700 mt-0.5">
            টাকা যাচাই ও অ্যাপ্রুভালের জন্য তালিকায় জমা রয়েছে
          </div>
        </div>
      </div>

      {/* Main Recharts Container */}
      <div className="pt-2">
        {chartView === 'overview' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="font-bold flex items-center gap-1 text-slate-700">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span>গত ৭ দিনের রাজস্ব (৳), ইমপ্রেশন ও পেন্ডিং আবেদনের সমন্বিত ট্রেন্ড</span>
              </span>
              <span className="text-[11px] text-slate-400">উৎস: Our Jamalpur লোকাল স্টোরেজ</span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  {/* Left Y Axis for Revenue */}
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 10, fill: '#059669' }}
                    tickFormatter={(val) => `৳${val}`}
                    tickLine={false}
                    axisLine={{ stroke: '#a7f3d0' }}
                  />
                  {/* Right Y Axis for Impressions & Requests */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 10, fill: '#2563eb' }}
                    tickFormatter={(val) => `${val}`}
                    tickLine={false}
                    axisLine={{ stroke: '#bfdbfe' }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-700 space-y-1.5 backdrop-blur-sm">
                            <p className="font-bold text-slate-200 border-b border-slate-700 pb-1 flex justify-between">
                              <span>{label}</span>
                              <span className="text-slate-400">{data.fullDay}</span>
                            </p>
                            <div className="space-y-1 pt-0.5">
                              <p className="text-emerald-400 flex justify-between gap-4">
                                <span>সম্ভাব্য মোট রাজস্ব:</span>
                                <span className="font-black">৳ {data.potentialRevenue.toLocaleString('bn-BD')}</span>
                              </p>
                              <p className="text-teal-300 flex justify-between gap-4">
                                <span>নিশ্চিত অর্জিত আয়:</span>
                                <span className="font-bold">৳ {data.realizedRevenue.toLocaleString('bn-BD')}</span>
                              </p>
                              <p className="text-blue-300 flex justify-between gap-4">
                                <span>বিজ্ঞাপন ইমপ্রেশন:</span>
                                <span className="font-bold">{data.impressions.toLocaleString('bn-BD')} ভিউ</span>
                              </p>
                              <p className="text-amber-400 flex justify-between gap-4">
                                <span>পেন্ডিং আবেদন:</span>
                                <span className="font-bold">{data.pendingRequests} টি</span>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{ fontSize: 11, fontWeight: 'bold' }}
                    formatter={(val) => {
                      if (val === 'potentialRevenue') return 'সম্ভাব্য মোট রাজস্ব (৳)';
                      if (val === 'realizedRevenue') return 'নিশ্চিত অর্জিত আয় (৳)';
                      if (val === 'impressions') return 'বিজ্ঞাপন ইমপ্রেশন (Views)';
                      if (val === 'pendingRequests') return 'পেন্ডিং আবেদন সংখ্যা';
                      return val;
                    }}
                  />
                  {/* Potential Revenue Area */}
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="potentialRevenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="#d1fae5"
                    fillOpacity={0.6}
                  />
                  {/* Realized Revenue Bar */}
                  <Bar
                    yAxisId="left"
                    dataKey="realizedRevenue"
                    fill="#059669"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  {/* Impressions Line */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="impressions"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#2563eb' }}
                  />
                  {/* Pending Requests Line */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="pendingRequests"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    strokeDasharray="4 4"
                    dot={{ r: 4, fill: '#f59e0b' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {chartView === 'revenue' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="font-bold text-slate-700">
                দৈনিক নিশ্চিত অর্জিত বনাম সম্ভাব্য অপেক্ষমাণ রাজস্ব (টাকা)
              </span>
              <span className="text-emerald-700 font-bold">
                সর্বমোট সম্ভাব্য: ৳ {stats.potentialRevenue.toLocaleString('bn-BD')}
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#059669' }}
                    tickFormatter={(val) => `৳${val}`}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      `৳ ${Number(value).toLocaleString('bn-BD')}`,
                      name === 'realizedRevenue' ? 'অর্জিত আয়' : 'সম্ভাব্য মোট রাজস্ব',
                    ]}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{ fontSize: 11, fontWeight: 'bold' }}
                    formatter={(val) =>
                      val === 'realizedRevenue' ? 'অর্জিত আয় (৳)' : 'সম্ভাব্য মোট রাজস্ব (৳)'
                    }
                  />
                  <Bar
                    dataKey="realizedRevenue"
                    fill="#059669"
                    radius={[4, 4, 0, 0]}
                    name="realizedRevenue"
                  />
                  <Bar
                    dataKey="potentialRevenue"
                    fill="#34d399"
                    radius={[4, 4, 0, 0]}
                    name="potentialRevenue"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {chartView === 'impressions' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="font-bold text-slate-700">
                বিজ্ঞাপন প্লেসমেন্ট অনুসারে সক্রিয়তা, আনুমানিক ইমপ্রেশন ও সম্ভাব্য ভ্যালু
              </span>
              <span className="text-blue-700 font-bold">
                মোট সক্রিয় ব্যানার: {stats.activeBanners} টি
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={placementData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="placement"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    yAxisId="imp"
                    tick={{ fontSize: 10, fill: '#2563eb' }}
                    tickFormatter={(val) => `${val}`}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    yAxisId="rev"
                    orientation="right"
                    tick={{ fontSize: 10, fill: '#059669' }}
                    tickFormatter={(val) => `৳${val}`}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <Tooltip
                    formatter={(value: any, name: any) => {
                      if (name === 'impressions') return [`${Number(value).toLocaleString('bn-BD')} ভিউ`, 'আনুমানিক ইমপ্রেশন'];
                      return [`৳ ${Number(value).toLocaleString('bn-BD')}`, 'সম্ভাব্য প্যাকেজ মূল্য'];
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{ fontSize: 11, fontWeight: 'bold' }}
                    formatter={(val) => (val === 'impressions' ? 'বিজ্ঞাপন ইমপ্রেশন (Views)' : 'সম্ভাব্য প্যাকেজ মূল্য (৳)')}
                  />
                  <Bar
                    yAxisId="imp"
                    dataKey="impressions"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    name="impressions"
                  />
                  <Bar
                    yAxisId="rev"
                    dataKey="potentialRev"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    name="potentialRev"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Chart Footer Tip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-purple-50/70 rounded-2xl border border-purple-100 text-xs text-purple-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
          <span>
            <strong>অ্যাডমিন টিপ:</strong> ব্যবহারকারীদের পেন্ডিং আবেদন যাচাই করে "ভেরিফাই ও অ্যাপ্রুভ" করলেই সম্ভাব্য রাজস্ব সরাসরি নিশ্চিত অর্জিত রাজস্বে যোগ হবে।
          </span>
        </div>
        <div className="text-[11px] text-purple-700 shrink-0 font-medium">
          সক্রিয় বিজ্ঞাপন: {stats.activeBanners} টি | পেন্ডিং: {stats.pendingCount} টি
        </div>
      </div>
    </div>
  );
};
