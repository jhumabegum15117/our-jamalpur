import React, { useState } from 'react';
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  Compass,
  AlertTriangle,
  Waves,
  Sprout,
  Calendar,
  Volume2,
  VolumeX,
  MapPin,
  RefreshCw,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { Upazila } from '../types';

interface UpazilaWeather {
  upazila: string;
  temp: number;
  feelsLike: number;
  condition: string;
  conditionIcon: 'sun' | 'cloud' | 'rain';
  humidity: number;
  windSpeed: number;
  aqi: number;
  aqiStatus: string;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  rainChance: number;
  riverName?: string;
  riverLevel?: string;
  riverStatus?: 'স্বাভাবিক' | 'সতর্কতা' | 'বিপদসীমা ছুঁইছুঁই' | 'বিপদসীমার উপরে';
  riverDangerMark?: string;
  farmAdvice: string;
}

const UPAZILA_WEATHER_DATA: Record<string, UpazilaWeather> = {
  'জামালপুর সদর': {
    upazila: 'জামালপুর সদর',
    temp: 29,
    feelsLike: 32,
    condition: 'আংশিক মেঘলা ও সহনীয় আবহাওয়া',
    conditionIcon: 'cloud',
    humidity: 68,
    windSpeed: 11,
    aqi: 72,
    aqiStatus: 'সন্তোষজনক',
    uvIndex: 6,
    sunrise: 'ভোর ৫:৩৮',
    sunset: 'সন্ধ্যা ৬:২৩',
    rainChance: 25,
    riverName: 'পুরাতন ব্রহ্মপুত্র নদী (জামালপুর পয়েন্ট)',
    riverLevel: '১২.৪৫ মিটার',
    riverDangerMark: '১৪.৫০ মিটার',
    riverStatus: 'স্বাভাবিক',
    farmAdvice: 'জমিতে পরিমিত সেচ দিন। শাকসবজি ও রোপা ধানের জমিতে আগাছা পরিষ্কারের উপযুক্ত সময়।',
  },
  'ইসলামপুর': {
    upazila: 'ইসলামপুর',
    temp: 28,
    feelsLike: 31,
    condition: 'হালকা বাতাস ও মেঘলা আকাশ',
    conditionIcon: 'cloud',
    humidity: 72,
    windSpeed: 14,
    aqi: 65,
    aqiStatus: 'ভালো',
    uvIndex: 5,
    sunrise: 'ভোর ৫:৩৯',
    sunset: 'সন্ধ্যা ৬:২৪',
    rainChance: 35,
    riverName: 'যমুনা নদী (বাহাদুরাবাদ ঘাট পয়েন্ট)',
    riverLevel: '১৮.২০ মিটার',
    riverDangerMark: '১৯.৫০ মিটার',
    riverStatus: 'স্বাভাবিক',
    farmAdvice: 'নদী তীরবর্তী নিম্নাঞ্চলে পাট জাগ দেওয়া ও ধান কাটার পর শুকনো স্থানে সংরক্ষণের প্রস্তুতি রাখুন।',
  },
  'দেওয়ানগঞ্জ': {
    upazila: 'দেওয়ানগঞ্জ',
    temp: 27,
    feelsLike: 30,
    condition: 'হালকা বৃষ্টির সম্ভাবনা',
    conditionIcon: 'rain',
    humidity: 75,
    windSpeed: 16,
    aqi: 58,
    aqiStatus: 'উত্তম',
    uvIndex: 4,
    sunrise: 'ভোর ৫:৩৯',
    sunset: 'সন্ধ্যা ৬:২৪',
    rainChance: 55,
    riverName: 'যমুনা ও পুরাতন ব্রহ্মপুত্র মোহনা',
    riverLevel: '১৭.৮৫ মিটার',
    riverDangerMark: '১৯.২০ মিটার',
    riverStatus: 'স্বাভাবিক',
    farmAdvice: 'চরের ফসলি জমিতে অতিরিক্ত পানি নিষ্কাশন নালা তৈরি রাখুন এবং বীজতলা সুরক্ষিত করুন।',
  },
  'মেলান্দহ': {
    upazila: 'মেলান্দহ',
    temp: 29,
    feelsLike: 32,
    condition: 'উজ্জ্বল রৌদ্রোজ্জ্বল',
    conditionIcon: 'sun',
    humidity: 66,
    windSpeed: 10,
    aqi: 70,
    aqiStatus: 'সন্তোষজনক',
    uvIndex: 7,
    sunrise: 'ভোর ৫:৩৮',
    sunset: 'সন্ধ্যা ৬:২৩',
    rainChance: 20,
    riverName: 'ঝিনাই ও মালঞ্চী নদী',
    riverLevel: '১০.১০ মিটার',
    riverDangerMark: '১২.০০ মিটার',
    riverStatus: 'স্বাভাবিক',
    farmAdvice: 'ধান ও ভুট্টার জমিতে প্রয়োজনীয় জৈব সার প্রয়োগের জন্য আজকের আবহাওয়া অত্যন্ত অনুকূল।',
  },
  'মাদারগঞ্জ': {
    upazila: 'মাদারগঞ্জ',
    temp: 29,
    feelsLike: 33,
    condition: 'উষ্ণ ও রৌদ্রোজ্জ্বল',
    conditionIcon: 'sun',
    humidity: 70,
    windSpeed: 12,
    aqi: 68,
    aqiStatus: 'সন্তোষজনক',
    uvIndex: 7,
    sunrise: 'ভোর ৫:৩৯',
    sunset: 'সন্ধ্যা ৬:২৩',
    rainChance: 20,
    riverName: 'যমুনা নদী (মাদারগঞ্জ চর পয়েন্ট)',
    riverLevel: '১৭.১০ মিটার',
    riverDangerMark: '১৮.৮০ মিটার',
    riverStatus: 'স্বাভাবিক',
    farmAdvice: 'পশু-পাখির সুপেয় পানি নিশ্চিত করুন এবং চরাঞ্চলের পাট ও সবজি ক্ষেতে পোকা দমনে নজর দিন।',
  },
  'সরিষাবাড়ী': {
    upazila: 'সরিষাবাড়ী',
    temp: 30,
    feelsLike: 34,
    condition: 'আংশিক মেঘলা ও রোদ',
    conditionIcon: 'cloud',
    humidity: 67,
    windSpeed: 11,
    aqi: 74,
    aqiStatus: 'সন্তোষজনক',
    uvIndex: 6,
    sunrise: 'ভোর ৫:৩৮',
    sunset: 'সন্ধ্যা ৬:২২',
    rainChance: 20,
    riverName: 'যমুনা ও ঝিনাই নদী মিলনস্থল',
    riverLevel: '১৬.৯০ মিটার',
    riverDangerMark: '১৮.৫০ মিটার',
    riverStatus: 'স্বাভাবিক',
    farmAdvice: 'ফল বাগান ও শাকসবজি ক্ষেতে নিয়মিত জৈব বালাইনাশক ব্যবহার করুন।',
  },
  'বকশীগঞ্জ': {
    upazila: 'বকশীগঞ্জ',
    temp: 27,
    feelsLike: 29,
    condition: 'শীতল হাওয়া ও পাহাড়ি আবহাওয়া',
    conditionIcon: 'cloud',
    humidity: 74,
    windSpeed: 15,
    aqi: 52,
    aqiStatus: 'উত্তম ও বিশুদ্ধ',
    uvIndex: 5,
    sunrise: 'ভোর ৫:৩৯',
    sunset: 'সন্ধ্যা ৬:২৫',
    rainChance: 40,
    riverName: 'গারো পাহাড় সংলগ্ন ধানুয়া নদী ও পাহাড়ি ঢল এলাকা',
    riverLevel: '৮.৪০ মিটার',
    riverDangerMark: '১০.৫০ মিটার',
    riverStatus: 'স্বাভাবিক',
    farmAdvice: 'পাহাড়ি ঢলের বিষয়ে সজাগ থাকুন। আদা, হলুদ ও মসলা জাতীয় ফসলের ড্রেনেজ ব্যবস্থা সচল রাখুন।',
  },
};

const FORECAST_7_DAYS = [
  { day: 'আজ', temp: '২৯° / ২৩°', condition: 'আংশিক মেঘলা', rain: '২৫%' },
  { day: 'আগামীকাল', temp: '৩০° / ২৪°', condition: 'রৌদ্রোজ্জ্বল', rain: '১৫%' },
  { day: 'বুধবার', temp: '২৮° / ২৩°', condition: 'হালকা বৃষ্টি', rain: '৪৫%' },
  { day: 'বৃহস্পতিবার', temp: '২৭° / ২২°', condition: 'বৃষ্টিপাত', rain: '৬০%' },
  { day: 'শুক্রবার', temp: '২৯° / ২৩°', condition: 'মেঘলা আকাশ', rain: '৩০%' },
  { day: 'শনিবার', temp: '৩১° / ২৪°', condition: 'রৌদ্রোজ্জ্বল', rain: '১০%' },
  { day: 'রবিবার', temp: '৩০° / ২৪°', condition: 'আংশিক মেঘলা', rain: '২০%' },
];

export const WeatherView: React.FC = () => {
  const [selectedUpazila, setSelectedUpazila] = useState<string>('জামালপুর সদর');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const data = UPAZILA_WEATHER_DATA[selectedUpazila] || UPAZILA_WEATHER_DATA['জামালপুর সদর'];

  const upazilaList = Object.keys(UPAZILA_WEATHER_DATA);

  const handleSpeakWeather = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const text = `${data.upazila}র আজকের তাপমাত্রা ${data.temp} ডিগ্রি সেলসিয়াস। অনুভূতি ${data.feelsLike} ডিগ্রি। আবহাওয়া: ${data.condition}। বাতাসের আর্দ্রতা ${data.humidity} শতাংশ। নদীর অবস্থা: ${data.riverStatus}। কৃষি পরামর্শ: ${data.farmAdvice}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'bn-BD';
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-slate-900 dark:text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-cyan-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-teal-700/40">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/80 text-teal-200 text-xs font-black mb-3 border border-teal-600/40">
            <Cloud className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
            <span>জামালপুর জেলা আবহাওয়া ও নদী পূর্বাভাস কেন্দ্র</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            জামালপুর ও ৭ উপজেলার লাইভ আবহাওয়া ও কৃষি বার্তা
          </h1>
          <p className="text-xs sm:text-sm text-teal-200 mt-2 leading-relaxed">
            যমুনা ও পুরাতন ব্রহ্মপুত্র নদীর পানির স্তর, ৭ দিনের পূর্বাভাস ও জামালপুরের কৃষকদের জন্য প্রাত্যহিক গুরুত্বপূর্ণ পরামর্শ।
          </p>
        </div>
      </div>

      {/* Upazila Selector Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              উপজেলা নির্বাচন করুন:
            </span>
          </div>
          <button
            onClick={handleSpeakWeather}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              isSpeaking
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isSpeaking ? 'থামান' : 'আবহাওয়া শুনুন'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 text-xs font-semibold">
          {upazilaList.map((name) => (
            <button
              key={name}
              onClick={() => setSelectedUpazila(name)}
              className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition cursor-pointer border ${
                selectedUpazila === name
                  ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Weather Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Temperature & Current Conditions */}
        <div className="lg:col-span-2 bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 bg-emerald-900/40 px-3 py-1 rounded-full border border-emerald-400/30">
                📍 {data.upazila}
              </span>
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-5xl sm:text-6xl font-black">{data.temp}°</span>
                <span className="text-xl sm:text-2xl font-medium text-emerald-100">C</span>
                <span className="text-xs text-emerald-200">অনুভূতি {data.feelsLike}°C</span>
              </div>
              <p className="text-base sm:text-lg font-bold text-emerald-50 mt-1">
                {data.condition}
              </p>
            </div>

            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
              {data.conditionIcon === 'sun' && <Sun className="w-12 h-12 text-amber-300 animate-spin-slow" />}
              {data.conditionIcon === 'rain' && <CloudRain className="w-12 h-12 text-cyan-200 animate-bounce" />}
              {data.conditionIcon === 'cloud' && <Cloud className="w-12 h-12 text-white animate-pulse" />}
            </div>
          </div>

          {/* Quick Stats Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/20">
            <div className="bg-black/15 p-3 rounded-2xl border border-white/10">
              <div className="flex items-center gap-1.5 text-xs text-emerald-200 mb-1">
                <Droplets className="w-3.5 h-3.5" />
                <span>আর্দ্রতা</span>
              </div>
              <span className="text-base font-black">{data.humidity}%</span>
            </div>

            <div className="bg-black/15 p-3 rounded-2xl border border-white/10">
              <div className="flex items-center gap-1.5 text-xs text-emerald-200 mb-1">
                <Wind className="w-3.5 h-3.5" />
                <span>বাতাসের গতি</span>
              </div>
              <span className="text-base font-black">{data.windSpeed} কিমি/ঘণ্টা</span>
            </div>

            <div className="bg-black/15 p-3 rounded-2xl border border-white/10">
              <div className="flex items-center gap-1.5 text-xs text-emerald-200 mb-1">
                <Thermometer className="w-3.5 h-3.5" />
                <span>বায়ুমান (AQI)</span>
              </div>
              <span className="text-base font-black">{data.aqi} ({data.aqiStatus})</span>
            </div>

            <div className="bg-black/15 p-3 rounded-2xl border border-white/10">
              <div className="flex items-center gap-1.5 text-xs text-emerald-200 mb-1">
                <CloudRain className="w-3.5 h-3.5" />
                <span>বৃষ্টির সম্ভাবনা</span>
              </div>
              <span className="text-base font-black">{data.rainChance}%</span>
            </div>
          </div>

          {/* Sun Times */}
          <div className="flex items-center justify-between text-xs text-emerald-100 bg-black/20 p-3 rounded-xl border border-white/10">
            <span>🌅 সূর্যোদয়: <strong>{data.sunrise}</strong></span>
            <span>🌇 সূর্যাস্ত: <strong>{data.sunset}</strong></span>
            <span>☀️ UV ইনডেক্স: <strong>{data.uvIndex} (মধ্যম)</strong></span>
          </div>
        </div>

        {/* Right Col: River Water Level & Flood Risk Alert */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Waves className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    নদীর পানি ও বন্যা সতর্কতা
                  </h3>
                  <p className="text-[11px] text-slate-400">পানি উন্নয়ন বোর্ড বুলেটিন</p>
                </div>
              </div>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                ● {data.riverStatus}
              </span>
            </div>

            <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900/60 space-y-2">
              <span className="text-xs font-bold text-blue-900 dark:text-blue-200">
                {data.riverName}
              </span>
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span>বর্তমান পানির উচ্চতা:</span>
                <strong className="text-blue-600 dark:text-blue-400">{data.riverLevel}</strong>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span>বিপদসীমা লেভেল:</span>
                <strong className="text-rose-600 dark:text-rose-400">{data.riverDangerMark}</strong>
              </div>
            </div>
          </div>

          {/* Farmer Advisory */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/60 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs">
              <Sprout className="w-4 h-4 text-amber-600" />
              <span>আজকের কৃষি আবহাওয়া পরামর্শ</span>
            </div>
            <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
              {data.farmAdvice}
            </p>
          </div>
        </div>
      </div>

      {/* 7-Day Weather Forecast */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              আগামী ৭ দিনের আবহাওয়া পূর্বাভাস
            </h2>
          </div>
          <span className="text-xs text-slate-400">জামালপুর জেলা পয়েন্ট</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {FORECAST_7_DAYS.map((fc, idx) => (
            <div
              key={fc.day}
              className={`p-3.5 rounded-2xl text-center space-y-2 border transition ${
                idx === 0
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 hover:border-emerald-400'
              }`}
            >
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                {fc.day}
              </span>
              <div className="w-8 h-8 mx-auto rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
                {fc.condition.includes('বৃষ্টি') ? (
                  <CloudRain className="w-4 h-4 text-blue-500" />
                ) : fc.condition.includes('রৌদ্র') ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Cloud className="w-4 h-4 text-slate-400" />
                )}
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-white block">
                {fc.temp}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                {fc.condition}
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold block">
                💧 {fc.rain}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
