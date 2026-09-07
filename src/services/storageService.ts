import {
  NewsItem,
  ProductItem,
  BusItem,
  TrainItem,
  HospitalItem,
  DoctorItem,
  MedicineItem,
  JobItem,
  EducationResource,
  QuizQuestion,
  QuizScore,
  QuizCertificate,
  BloodDonor,
  PrayerTimeData,
  MarketPriceItem,
  BusinessItem,
  WebsiteSettings,
  User,
  MfsTransferRecord,
  MonetizationRequest,
  AdBannerItem,
  LiveHeadline,
} from '../types';
import {
  initialSettings,
  initialNews,
  initialProducts,
  initialBuses,
  initialTrains,
  initialHospitals,
  initialDoctors,
  initialMedicines,
  initialJobs,
  initialEducationResources,
  initialQuizzes,
  initialBloodDonors,
  initialPrayerTimes,
  initialMarketPrices,
  initialBusinesses,
} from '../data/initialData';
import { INITIAL_LIVE_HEADLINES, DAILY_NEWSPAPERS_LIST } from '../data/liveHeadlinesData';

import masudRanaPhoto from '../assets/images/masud_rana_profile_1788024419763.jpg';

const KEYS = {
  SETTINGS: 'oj_settings_v2',
  NEWS: 'oj_news_v1',
  LIVE_HEADLINES: 'oj_live_headlines_v1',
  PRODUCTS: 'oj_products_v1',
  BUSES: 'oj_buses_v2',
  TRAINS: 'oj_trains_v2',
  HOSPITALS: 'oj_hospitals_v1',
  DOCTORS: 'oj_doctors_v1',
  MEDICINES: 'oj_medicines_v1',
  JOBS: 'oj_jobs_v1',
  EDUCATION: 'oj_education_v1',
  QUIZZES: 'oj_quizzes_v1',
  QUIZ_SCORES: 'oj_quiz_scores_v1',
  BLOOD_DONORS: 'oj_blood_donors_v1',
  PRAYER_TIMES: 'oj_prayer_times_v1',
  MARKET_PRICES: 'oj_market_prices_v1',
  BUSINESSES: 'oj_businesses_v1',
  MFS_TRANSFERS: 'oj_mfs_transfers_v1',
  USER: 'oj_current_user_v2',
  USERS_LIST: 'oj_users_list_v2',
  BOOKMARKS: 'oj_bookmarks_v1',
  AD_BANNERS: 'oj_ad_banners_v1',
  MONETIZATION_REQUESTS: 'oj_monetization_requests_v1',
  CERTIFICATES: 'oj_quiz_certificates_v1',
  CACHE_SYNC_TIMESTAMP: 'oj_cache_last_sync_v3',
  SCHEMA_VERSION: 'oj_storage_schema_version',
};

export const initialSundayCertificates: QuizCertificate[] = [
  {
    id: 'cert-sun-1',
    certificateNo: 'OJ-SUN-2026-0830-101',
    recipientName: 'তানভীর আহমেদ',
    recipientUpazila: 'জামালপুর সদর',
    institution: 'সরকারি আশেক মাহমুদ কলেজ',
    quizTitle: 'সাপ্তাহিক রবিবার বিশেষ কুইজ প্রতিযোগিতা — জামালপুর জ্ঞান জিজ্ঞাসা',
    score: 100,
    totalScore: 100,
    grade: 'গোল্ডেন স্টার (১ম স্থান — সেরা মেধা)',
    issueSundayDate: 'রবিবার, ৩০ আগস্ট ২০২৬',
    issuedAt: '২০২৬-০৮-৩০',
    verificationCode: 'OJ-VERIFIED-98472',
    authorityName: 'Our Jamalpur District Digital Portal & Quiz Authority',
    signerName: 'মাসুদ রানা',
    signerTitle: 'প্রতিষ্ঠাতা ও প্রধান নির্বাহী, Our Jamalpur',
  },
  {
    id: 'cert-sun-2',
    certificateNo: 'OJ-SUN-2026-0830-102',
    recipientName: 'সালমা খাতুন',
    recipientUpazila: 'মেলান্দহ',
    institution: 'মেলান্দহ উমির উদ্দিন পাইলট হাই স্কুল',
    quizTitle: 'সাপ্তাহিক রবিবার বিশেষ কুইজ প্রতিযোগিতা — জামালপুর জ্ঞান জিজ্ঞাসা',
    score: 90,
    totalScore: 100,
    grade: 'সিলভার স্টার (২য় স্থান — অসাধারণ মেধা)',
    issueSundayDate: 'রবিবার, ৩০ আগস্ট ২০২৬',
    issuedAt: '২০২৬-০৮-৩০',
    verificationCode: 'OJ-VERIFIED-71283',
    authorityName: 'Our Jamalpur District Digital Portal & Quiz Authority',
    signerName: 'মাসুদ রানা',
    signerTitle: 'প্রতিষ্ঠাতা ও প্রধান নির্বাহী, Our Jamalpur',
  },
  {
    id: 'cert-sun-3',
    certificateNo: 'OJ-SUN-2026-0823-098',
    recipientName: 'রাকিবুল হাসান',
    recipientUpazila: 'ইসলামপুর',
    institution: 'ইসলামপুর কলেজ',
    quizTitle: 'সাপ্তাহিক রবিবার বিশেষ কুইজ প্রতিযোগিতা — জামালপুর জ্ঞান জিজ্ঞাসা',
    score: 95,
    totalScore: 100,
    grade: 'গোল্ডেন স্টার (মেধাবী স্থান)',
    issueSundayDate: 'রবিবার, ২৩ আগস্ট ২০২৬',
    issuedAt: '২০২৬-০৮-২৩',
    verificationCode: 'OJ-VERIFIED-55419',
    authorityName: 'Our Jamalpur District Digital Portal & Quiz Authority',
    signerName: 'মাসুদ রানা',
    signerTitle: 'প্রতিষ্ঠাতা ও প্রধান নির্বাহী, Our Jamalpur',
  },
];

export const OWNER_PAYMENT_INFO = {
  ownerName: 'মাসুদ রানা',
  phone: '01315481879',
  bkash: '01315481879',
  nagad: '01315481879',
  rocket: '01315481879',
  type: 'Personal (পার্সোনাল)',
};

export const initialAdBanners: AdBannerItem[] = [
  {
    id: 'banner-1',
    title: 'জামালপুর হস্তশিল্প ও নকশী কাঁথা মেলা — ২৫% স্পেশাল ছাড়!',
    subtitle: 'সরাসরি জামালপুর হস্তশিল্প সমবায় ও কারিগরদের থেকে সেরা পণ্য',
    advertiserName: 'জামালপুর হস্তশিল্প কেন্দ্র',
    advertiserPhone: '01315481879',
    placement: 'home_top',
    amountPaid: 950,
    status: 'active',
    expiresAt: '২০২৬-১২-৩১',
  },
  {
    id: 'banner-2',
    title: 'আল-মদিনা ডিজিটাল হাসপাতাল & ল্যাব — জামালপুর',
    subtitle: '২৪ ঘণ্টা ইমার্জেন্সি ও সকল ডায়াগনস্টিক টেস্টে বিশেষ ছাড়',
    advertiserName: 'আল-মদিনা ডায়াগনস্টিক',
    advertiserPhone: '01315481879',
    placement: 'marketplace',
    amountPaid: 550,
    status: 'active',
    expiresAt: '২০২৬-১২-৩১',
  },
];

export const initialMonetizationRequests: MonetizationRequest[] = [
  {
    id: 'req-1',
    serviceType: 'boost_product',
    packageTitle: '৭ দিন গোল্ড প্রোডাক্ট বুস্ট (৳ ১০০)',
    amount: 100,
    durationDays: 7,
    advertiserName: 'মোঃ কামরুল হাসান',
    advertiserPhone: '01712-887766',
    businessOrTitle: 'সুতি নকশী থ্রি-পিস ও চাঁদর',
    paymentMethod: 'bkash',
    senderNumber: '01712887766',
    trxId: '9K8J7H6G5F',
    status: 'approved',
    submittedAt: '২০২৬-০৮-২৯',
    approvedAt: '২০২৬-০৮-২৯',
    adminNote: 'পেমেন্ট ভেরিফাইড ও প্রডাক্ট ফিচার্ড করা হয়েছে',
  },
];

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

export const initialOwnerUser: User = {
  id: 'usr-owner-1',
  name: 'মাসুদ রানা',
  phone: '01315481879',
  email: 'masudrana15117@gmail.com',
  role: 'admin',
  upazila: 'জামালপুর সদর',
  joinedDate: '২০২৬-০১-০১',
  avatar: masudRanaPhoto,
};

export const storageService = {
  getSettings: (): WebsiteSettings => getItem(KEYS.SETTINGS, initialSettings),
  setSettings: (s: WebsiteSettings) => setItem(KEYS.SETTINGS, s),

  getNews: (): NewsItem[] => getItem(KEYS.NEWS, initialNews),
  setNews: (items: NewsItem[]) => setItem(KEYS.NEWS, items),
  addNews: (item: Omit<NewsItem, 'id' | 'views'>) => {
    const list = storageService.getNews();
    const newItem: NewsItem = {
      ...item,
      id: `news-${Date.now()}`,
      views: 0,
    };
    storageService.setNews([newItem, ...list]);
    return newItem;
  },
  updateNews: (updated: NewsItem) => {
    const list = storageService.getNews().map((n) => (n.id === updated.id ? updated : n));
    storageService.setNews(list);
  },
  deleteNews: (id: string) => {
    const list = storageService.getNews().filter((n) => n.id !== id);
    storageService.setNews(list);
  },

  // Live Headlines & Daily Newspapers
  getLiveHeadlines: (): LiveHeadline[] => getItem(KEYS.LIVE_HEADLINES, INITIAL_LIVE_HEADLINES),
  setLiveHeadlines: (items: LiveHeadline[]) => setItem(KEYS.LIVE_HEADLINES, items),
  addLiveHeadline: (item: Omit<LiveHeadline, 'id'>) => {
    const list = storageService.getLiveHeadlines();
    const newItem: LiveHeadline = {
      ...item,
      id: `headline-${Date.now()}`,
    };
    storageService.setLiveHeadlines([newItem, ...list]);
    return newItem;
  },
  getDailyNewspapers: () => DAILY_NEWSPAPERS_LIST,

  getProducts: (): ProductItem[] => getItem(KEYS.PRODUCTS, initialProducts),
  setProducts: (items: ProductItem[]) => setItem(KEYS.PRODUCTS, items),
  addProduct: (item: Omit<ProductItem, 'id' | 'postedDate' | 'status'>) => {
    const list = storageService.getProducts();
    const newItem: ProductItem = {
      ...item,
      id: `prod-${Date.now()}`,
      postedDate: new Date().toLocaleDateString('bn-BD'),
      status: 'active',
    };
    storageService.setProducts([newItem, ...list]);
    return newItem;
  },
  updateProduct: (updated: ProductItem) => {
    const list = storageService.getProducts().map((p) => (p.id === updated.id ? updated : p));
    storageService.setProducts(list);
  },
  deleteProduct: (id: string) => {
    const list = storageService.getProducts().filter((p) => p.id !== id);
    storageService.setProducts(list);
  },

  getBuses: (): BusItem[] => getItem(KEYS.BUSES, initialBuses),
  setBuses: (items: BusItem[]) => setItem(KEYS.BUSES, items),
  addBus: (item: Omit<BusItem, 'id'>) => {
    const list = storageService.getBuses();
    const newItem: BusItem = { ...item, id: `bus-${Date.now()}` };
    storageService.setBuses([...list, newItem]);
    return newItem;
  },
  updateBus: (updated: BusItem) => {
    const list = storageService.getBuses().map((b) => (b.id === updated.id ? updated : b));
    storageService.setBuses(list);
  },
  deleteBus: (id: string) => {
    const list = storageService.getBuses().filter((b) => b.id !== id);
    storageService.setBuses(list);
  },

  getTrains: (): TrainItem[] => getItem(KEYS.TRAINS, initialTrains),
  setTrains: (items: TrainItem[]) => setItem(KEYS.TRAINS, items),
  addTrain: (item: Omit<TrainItem, 'id'>) => {
    const list = storageService.getTrains();
    const newItem: TrainItem = { ...item, id: `train-${Date.now()}` };
    storageService.setTrains([...list, newItem]);
    return newItem;
  },
  updateTrain: (updated: TrainItem) => {
    const list = storageService.getTrains().map((t) => (t.id === updated.id ? updated : t));
    storageService.setTrains(list);
  },
  deleteTrain: (id: string) => {
    const list = storageService.getTrains().filter((t) => t.id !== id);
    storageService.setTrains(list);
  },

  getHospitals: (): HospitalItem[] => getItem(KEYS.HOSPITALS, initialHospitals),
  setHospitals: (items: HospitalItem[]) => setItem(KEYS.HOSPITALS, items),
  addHospital: (item: Omit<HospitalItem, 'id'>) => {
    const list = storageService.getHospitals();
    const newItem: HospitalItem = { ...item, id: `hosp-${Date.now()}` };
    storageService.setHospitals([...list, newItem]);
    return newItem;
  },
  updateHospital: (updated: HospitalItem) => {
    const list = storageService.getHospitals().map((h) => (h.id === updated.id ? updated : h));
    storageService.setHospitals(list);
  },
  deleteHospital: (id: string) => {
    const list = storageService.getHospitals().filter((h) => h.id !== id);
    storageService.setHospitals(list);
  },

  getDoctors: (): DoctorItem[] => getItem(KEYS.DOCTORS, initialDoctors),
  setDoctors: (items: DoctorItem[]) => setItem(KEYS.DOCTORS, items),
  addDoctor: (item: Omit<DoctorItem, 'id'>) => {
    const list = storageService.getDoctors();
    const newItem: DoctorItem = { ...item, id: `doc-${Date.now()}` };
    storageService.setDoctors([...list, newItem]);
    return newItem;
  },
  updateDoctor: (updated: DoctorItem) => {
    const list = storageService.getDoctors().map((d) => (d.id === updated.id ? updated : d));
    storageService.setDoctors(list);
  },
  deleteDoctor: (id: string) => {
    const list = storageService.getDoctors().filter((d) => d.id !== id);
    storageService.setDoctors(list);
  },

  getMedicines: (): MedicineItem[] => getItem(KEYS.MEDICINES, initialMedicines),
  setMedicines: (items: MedicineItem[]) => setItem(KEYS.MEDICINES, items),
  addMedicine: (item: Omit<MedicineItem, 'id'>) => {
    const list = storageService.getMedicines();
    const newItem: MedicineItem = { ...item, id: `med-${Date.now()}` };
    storageService.setMedicines([...list, newItem]);
    return newItem;
  },

  getJobs: (): JobItem[] => getItem(KEYS.JOBS, initialJobs),
  setJobs: (items: JobItem[]) => setItem(KEYS.JOBS, items),
  addJob: (item: Omit<JobItem, 'id' | 'postedDate'>) => {
    const list = storageService.getJobs();
    const newItem: JobItem = {
      ...item,
      id: `job-${Date.now()}`,
      postedDate: new Date().toLocaleDateString('bn-BD'),
    };
    storageService.setJobs([newItem, ...list]);
    return newItem;
  },
  updateJob: (updated: JobItem) => {
    const list = storageService.getJobs().map((j) => (j.id === updated.id ? updated : j));
    storageService.setJobs(list);
  },
  deleteJob: (id: string) => {
    const list = storageService.getJobs().filter((j) => j.id !== id);
    storageService.setJobs(list);
  },

  getEducation: (): EducationResource[] => getItem(KEYS.EDUCATION, initialEducationResources),
  setEducation: (items: EducationResource[]) => setItem(KEYS.EDUCATION, items),

  getQuizzes: (): QuizQuestion[] => {
    const saved = getItem<QuizQuestion[]>(KEYS.QUIZZES, []);
    if (!saved || saved.length < initialQuizzes.length) {
      // Merge unique items from initialQuizzes
      const existingIds = new Set((saved || []).map((q) => q.id));
      const combined = [...(saved || []), ...initialQuizzes.filter((q) => !existingIds.has(q.id))];
      setItem(KEYS.QUIZZES, combined);
      return combined;
    }
    return saved;
  },
  setQuizzes: (items: QuizQuestion[]) => setItem(KEYS.QUIZZES, items),
  addQuiz: (item: Omit<QuizQuestion, 'id'>) => {
    const list = storageService.getQuizzes();
    const newItem: QuizQuestion = { ...item, id: `q-${Date.now()}` };
    storageService.setQuizzes([...list, newItem]);
    return newItem;
  },
  deleteQuiz: (id: string) => {
    const list = storageService.getQuizzes().filter((q) => q.id !== id);
    storageService.setQuizzes(list);
  },

  getQuizScores: (): QuizScore[] => getItem(KEYS.QUIZ_SCORES, [
    { id: 'sc-1', userName: 'রাকিবুল হাসান', score: 6, totalQuestions: 6, timeTakenSeconds: 38, date: '২০২৬-০৮-২৮' },
    { id: 'sc-2', userName: 'তাসলিমা আক্তার', score: 5, totalQuestions: 6, timeTakenSeconds: 42, date: '২০২৬-০৮-২৭' },
    { id: 'sc-3', userName: 'সাকিব আল মামুন', score: 5, totalQuestions: 6, timeTakenSeconds: 50, date: '২০২৬-০৮-২৬' },
  ]),
  addQuizScore: (score: Omit<QuizScore, 'id' | 'date'>) => {
    const list = storageService.getQuizScores();
    const newScore: QuizScore = {
      ...score,
      id: `sc-${Date.now()}`,
      date: new Date().toLocaleDateString('bn-BD'),
    };
    const updated = [newScore, ...list].sort((a, b) => b.score - a.score || a.timeTakenSeconds - b.timeTakenSeconds);
    setItem(KEYS.QUIZ_SCORES, updated);
    return newScore;
  },

  getBloodDonors: (): BloodDonor[] => getItem(KEYS.BLOOD_DONORS, initialBloodDonors),
  setBloodDonors: (items: BloodDonor[]) => setItem(KEYS.BLOOD_DONORS, items),
  addBloodDonor: (item: Omit<BloodDonor, 'id'>) => {
    const list = storageService.getBloodDonors();
    const newItem: BloodDonor = { ...item, id: `donor-${Date.now()}` };
    storageService.setBloodDonors([newItem, ...list]);
    return newItem;
  },

  getPrayerTimes: (): PrayerTimeData => getItem(KEYS.PRAYER_TIMES, initialPrayerTimes),
  setPrayerTimes: (times: PrayerTimeData) => setItem(KEYS.PRAYER_TIMES, times),

  getMarketPrices: (): MarketPriceItem[] => getItem(KEYS.MARKET_PRICES, initialMarketPrices),
  setMarketPrices: (items: MarketPriceItem[]) => setItem(KEYS.MARKET_PRICES, items),
  updateMarketPrice: (updated: MarketPriceItem) => {
    const list = storageService.getMarketPrices().map((m) => (m.id === updated.id ? updated : m));
    storageService.setMarketPrices(list);
  },
  addMarketPrice: (item: Omit<MarketPriceItem, 'id' | 'lastUpdated'>) => {
    const list = storageService.getMarketPrices();
    const newItem: MarketPriceItem = {
      ...item,
      id: `mp-${Date.now()}`,
      lastUpdated: 'আজ সকাল ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
    };
    storageService.setMarketPrices([newItem, ...list]);
    return newItem;
  },
  deleteMarketPrice: (id: string) => {
    const list = storageService.getMarketPrices().filter((m) => m.id !== id);
    storageService.setMarketPrices(list);
  },

  getBusinesses: (): BusinessItem[] => getItem(KEYS.BUSINESSES, initialBusinesses),
  setBusinesses: (items: BusinessItem[]) => setItem(KEYS.BUSINESSES, items),
  addBusiness: (item: Omit<BusinessItem, 'id'>) => {
    const list = storageService.getBusinesses();
    const newItem: BusinessItem = { ...item, id: `biz-${Date.now()}` };
    storageService.setBusinesses([newItem, ...list]);
    return newItem;
  },
  updateBusiness: (updated: BusinessItem) => {
    const list = storageService.getBusinesses().map((b) => (b.id === updated.id ? updated : b));
    storageService.setBusinesses(list);
  },
  deleteBusiness: (id: string) => {
    const list = storageService.getBusinesses().filter((b) => b.id !== id);
    storageService.setBusinesses(list);
  },

  getCurrentUser: (): User | null => getItem(KEYS.USER, initialOwnerUser),
  setCurrentUser: (u: User | null) => setItem(KEYS.USER, u),
  logout: () => {
    storageService.setCurrentUser(null);
  },
  login: (phone: string, _pass: string): User | null => {
    const list = storageService.getUsersList();
    const found = list.find((u) => u.phone === phone);
    if (found) {
      storageService.setCurrentUser(found);
      return found;
    }
    // Owner login shortcut
    if (phone === '01315481879') {
      storageService.setCurrentUser(initialOwnerUser);
      return initialOwnerUser;
    }
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: 'নাগরিক ব্যবহারকারী',
      phone,
      email: `${phone}@ourjamalpur.com`,
      role: 'user',
      upazila: 'জামালপুর সদর',
      joinedDate: '২০২৬-০২-০১',
    };
    storageService.setUsersList([...list, newUser]);
    storageService.setCurrentUser(newUser);
    return newUser;
  },
  register: (user: { name: string; phone: string; email?: string; password?: string; upazila: string; role?: 'admin' | 'user' }): User => {
    const list = storageService.getUsersList();
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role || 'user',
      upazila: (user.upazila as any) || 'জামালপুর সদর',
      joinedDate: new Date().toLocaleDateString('bn-BD'),
    };
    storageService.setUsersList([...list, newUser]);
    storageService.setCurrentUser(newUser);
    return newUser;
  },

  getUsersList: (): User[] => getItem(KEYS.USERS_LIST, [initialOwnerUser]),
  setUsersList: (users: User[]) => setItem(KEYS.USERS_LIST, users),
  getUsers: (): User[] => storageService.getUsersList(),
  updateCurrentUser: (updatedData: Partial<User>): User | null => {
    const current = storageService.getCurrentUser();
    if (!current) return null;
    const updated = { ...current, ...updatedData };
    storageService.setCurrentUser(updated);
    const list = storageService.getUsersList().map((u) => (u.id === updated.id ? updated : u));
    storageService.setUsersList(list);
    return updated;
  },

  // MFS Fund Transfer History
  getMfsTransfers: (): MfsTransferRecord[] => getItem(KEYS.MFS_TRANSFERS, [
    {
      id: 'mfs-sample-1',
      fromProvider: 'bkash',
      toProvider: 'rocket',
      senderNumber: '01712-345678',
      receiverNumber: '01987-654321',
      amount: 1500,
      charge: 7.5,
      totalDebited: 1507.5,
      netCredited: 1500,
      reference: 'ব্যবসায়িক পেমেন্ট',
      protocol: 'Binimoy (IDTP)',
      transactionToken: 'TXN-BK-RK-892147',
      timestamp: '২০২৬-০৮-২৯ ১০:১৫ AM',
      status: 'Completed',
    },
    {
      id: 'mfs-sample-2',
      fromProvider: 'nagad',
      toProvider: 'bkash',
      senderNumber: '01315-481879',
      receiverNumber: '01811-223344',
      amount: 3000,
      charge: 15.0,
      totalDebited: 3015.0,
      netCredited: 3000,
      reference: 'পারিবারিক খরচ',
      protocol: 'Direct MFS Interoperability',
      transactionToken: 'TXN-NG-BK-441092',
      timestamp: '২০২৬-০৮-২৮ ০৪:৩০ PM',
      status: 'Completed',
    },
    {
      id: 'mfs-sample-3',
      fromProvider: 'cellfin',
      toProvider: 'bkash',
      senderNumber: '01315-481879',
      receiverNumber: '01755-998877',
      amount: 5000,
      charge: 25.0,
      totalDebited: 5025.0,
      netCredited: 5000,
      reference: 'হস্তশিল্প কেনাকাটা',
      protocol: 'Cellfin Bridge',
      transactionToken: 'TXN-CF-BK-778210',
      timestamp: '২০২৬-০৮-২৭ ০২:১৫ PM',
      status: 'Completed',
    }
  ]),
  setMfsTransfers: (records: MfsTransferRecord[]) => setItem(KEYS.MFS_TRANSFERS, records),
  addMfsTransfer: (record: Omit<MfsTransferRecord, 'id' | 'timestamp' | 'transactionToken'>) => {
    const list = storageService.getMfsTransfers();
    const token = `TXN-${record.fromProvider.substring(0, 2).toUpperCase()}-${record.toProvider.substring(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRecord: MfsTransferRecord = {
      ...record,
      id: `mfs-${Date.now()}`,
      transactionToken: token,
      timestamp: new Date().toLocaleString('bn-BD'),
    };
    storageService.setMfsTransfers([newRecord, ...list]);
    return newRecord;
  },
  deleteMfsTransfer: (id: string) => {
    const list = storageService.getMfsTransfers().filter((x) => x.id !== id);
    storageService.setMfsTransfers(list);
  },

  updateSettings: (s: Partial<WebsiteSettings>): WebsiteSettings => {
    const curr = storageService.getSettings();
    const updated = { ...curr, ...s };
    storageService.setSettings(updated);
    return updated;
  },

  getBooks: (): EducationResource[] => storageService.getEducation(),
  resetToDefaults: () => storageService.resetAllToDefault(),

  getBookmarks: (): string[] => getItem(KEYS.BOOKMARKS, []),
  toggleBookmark: (id: string): boolean => {
    const list = storageService.getBookmarks();
    const exists = list.includes(id);
    const updated = exists ? list.filter((x) => x !== id) : [...list, id];
    setItem(KEYS.BOOKMARKS, updated);
    return !exists;
  },

  getAdBanners: (): AdBannerItem[] => getItem(KEYS.AD_BANNERS, initialAdBanners),
  setAdBanners: (items: AdBannerItem[]) => setItem(KEYS.AD_BANNERS, items),
  addAdBanner: (item: Omit<AdBannerItem, 'id'>) => {
    const list = storageService.getAdBanners();
    const newItem: AdBannerItem = {
      ...item,
      id: `banner-${Date.now()}`,
    };
    storageService.setAdBanners([newItem, ...list]);
    return newItem;
  },
  updateAdBanner: (item: AdBannerItem) => {
    const list = storageService.getAdBanners().map((b) => (b.id === item.id ? item : b));
    storageService.setAdBanners(list);
  },
  deleteAdBanner: (id: string) => {
    const list = storageService.getAdBanners().filter((b) => b.id !== id);
    storageService.setAdBanners(list);
  },

  getMonetizationRequests: (): MonetizationRequest[] => getItem(KEYS.MONETIZATION_REQUESTS, initialMonetizationRequests),
  setMonetizationRequests: (items: MonetizationRequest[]) => setItem(KEYS.MONETIZATION_REQUESTS, items),
  addMonetizationRequest: (req: Omit<MonetizationRequest, 'id' | 'status' | 'submittedAt'>) => {
    const list = storageService.getMonetizationRequests();
    const newReq: MonetizationRequest = {
      ...req,
      id: `mreq-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toLocaleDateString('bn-BD'),
    };
    storageService.setMonetizationRequests([newReq, ...list]);
    return newReq;
  },
  updateMonetizationRequestStatus: (id: string, status: 'approved' | 'rejected', adminNote?: string) => {
    const list = storageService.getMonetizationRequests().map((r) => {
      if (r.id === id) {
        const updated = {
          ...r,
          status,
          approvedAt: status === 'approved' ? new Date().toLocaleDateString('bn-BD') : undefined,
          adminNote: adminNote || r.adminNote,
        };

        // If approved and it's a product boost, automatically feature that product
        if (status === 'approved' && r.targetId && r.serviceType === 'boost_product') {
          const products = storageService.getProducts().map((p) =>
            p.id === r.targetId ? { ...p, featured: true } : p
          );
          storageService.setProducts(products);
        }

        // If approved and it's a banner ad, automatically create an active banner
        if (status === 'approved' && r.serviceType === 'banner_ad') {
          storageService.addAdBanner({
            title: r.businessOrTitle,
            subtitle: r.details || `${r.advertiserName} — বিশেষ বিজ্ঞাপন`,
            advertiserName: r.advertiserName,
            advertiserPhone: r.advertiserPhone,
            bannerImage: r.bannerImage,
            targetUrl: r.linkOrSocial,
            placement: 'home_top',
            amountPaid: r.amount,
            status: 'active',
            expiresAt: new Date(Date.now() + (r.durationDays || 30) * 86400000).toLocaleDateString('bn-BD'),
          });
        }

        return updated;
      }
      return r;
    });
    storageService.setMonetizationRequests(list);
  },
  deleteMonetizationRequest: (id: string) => {
    const list = storageService.getMonetizationRequests().filter((r) => r.id !== id);
    storageService.setMonetizationRequests(list);
  },

  getCertificates: (): QuizCertificate[] => getItem(KEYS.CERTIFICATES, initialSundayCertificates),
  setCertificates: (items: QuizCertificate[]) => setItem(KEYS.CERTIFICATES, items),
  saveCertificate: (cert: QuizCertificate) => {
    const list = storageService.getCertificates();
    const existingIdx = list.findIndex((c) => c.id === cert.id || c.certificateNo === cert.certificateNo);
    if (existingIdx >= 0) {
      list[existingIdx] = cert;
      storageService.setCertificates([...list]);
    } else {
      storageService.setCertificates([cert, ...list]);
    }
    return cert;
  },
  createSundayCertificate: (params: {
    recipientName: string;
    recipientUpazila?: string;
    institution?: string;
    score: number;
    totalScore?: number;
  }): QuizCertificate => {
    const totalScore = params.totalScore || 100;
    const percentage = Math.round((params.score / totalScore) * 100);

    let grade = 'বিশেষ মেধা স্বীকৃতি ও সনদ';
    if (percentage >= 90) {
      grade = 'গোল্ডেন স্টার (১ম স্থান — সেরা মেধা)';
    } else if (percentage >= 80) {
      grade = 'সিলভার স্টার (২য় স্থান — অসাধারণ মেধা)';
    } else if (percentage >= 70) {
      grade = 'ব্রোঞ্জ স্টার (৩য় স্থান — কৃতিত্বপূর্ণ মেধা)';
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const dateObj = new Date();
    const formattedDate = dateObj.toLocaleDateString('bn-BD', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const newCert: QuizCertificate = {
      id: `cert-${Date.now()}`,
      certificateNo: `OJ-SUN-${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}${String(dateObj.getDate()).padStart(2, '0')}-${randomSuffix}`,
      recipientName: params.recipientName,
      recipientUpazila: params.recipientUpazila || 'জামালপুর জেলা',
      institution: params.institution || 'Our Jamalpur কুইজ একাডেমি',
      quizTitle: 'সাপ্তাহিক রবিবার বিশেষ কুইজ প্রতিযোগিতা — জামালপুর জ্ঞান জিজ্ঞাসা',
      score: params.score,
      totalScore,
      grade,
      issueSundayDate: formattedDate.includes('রবিবার') ? formattedDate : `রবিবার বিশেষ সম্মাননা সনদ (${formattedDate})`,
      issuedAt: dateObj.toLocaleDateString('bn-BD'),
      verificationCode: `OJ-VERIFIED-${randomSuffix}-${Math.floor(100 + Math.random() * 900)}`,
      authorityName: 'Our Jamalpur District Digital Portal & Quiz Authority',
      signerName: 'মাসুদ রানা',
      signerTitle: 'প্রতিষ্ঠাতা ও প্রধান নির্বাহী, Our Jamalpur',
    };

    storageService.saveCertificate(newCert);
    return newCert;
  },

  // ----------------------------------------------------
  // STORAGE & OFFLINE CACHE MANAGEMENT ENGINE
  // ----------------------------------------------------

  getLastCacheSyncTime: (): string => {
    return getItem(KEYS.CACHE_SYNC_TIMESTAMP, 'এখনই আপডেট করা হয়েছে');
  },

  getStorageStats: () => {
    let totalBytes = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const val = localStorage.getItem(key) || '';
          totalBytes += (key.length + val.length) * 2; // UTF-16 characters
        }
      }
    } catch {
      totalBytes = 1024 * 50; // estimate
    }

    const newsCount = storageService.getNews().length;
    const productsCount = storageService.getProducts().length;
    const busesCount = storageService.getBuses().length;
    const trainsCount = storageService.getTrains().length;
    const hospitalsCount = storageService.getHospitals().length;
    const doctorsCount = storageService.getDoctors().length;
    const medicinesCount = storageService.getMedicines().length;
    const jobsCount = storageService.getJobs().length;
    const educationCount = storageService.getEducation().length;
    const quizzesCount = storageService.getQuizzes().length;
    const donorsCount = storageService.getBloodDonors().length;
    const businessesCount = storageService.getBusinesses().length;
    const certificatesCount = storageService.getCertificates().length;
    const mfsCount = storageService.getMfsTransfers().length;

    const totalRecords =
      newsCount +
      productsCount +
      busesCount +
      trainsCount +
      hospitalsCount +
      doctorsCount +
      medicinesCount +
      jobsCount +
      educationCount +
      quizzesCount +
      donorsCount +
      businessesCount +
      certificatesCount +
      mfsCount;

    return {
      totalBytes,
      totalKilobytes: (totalBytes / 1024).toFixed(2),
      totalMegabytes: (totalBytes / (1024 * 1024)).toFixed(3),
      totalRecords,
      lastSync: storageService.getLastCacheSyncTime(),
      counts: {
        news: newsCount,
        products: productsCount,
        transport: busesCount + trainsCount,
        health: hospitalsCount + doctorsCount + medicinesCount,
        jobs: jobsCount,
        education: educationCount,
        quizzes: quizzesCount,
        bloodDonors: donorsCount,
        businesses: businessesCount,
        certificates: certificatesCount,
        mfs: mfsCount,
      },
    };
  },

  getAppVersionInfo: () => {
    return {
      version: '4.2.0',
      versionName: 'v4.2 (Live Cloud & Fast Sync Edition)',
      releaseDate: '২০২৬-০৮-৩১',
      lastSync: storageService.getLastCacheSyncTime(),
      author: 'মাসুদ রানা',
      status: 'সর্বশেষ সক্রিয় সংস্করণ (Up to Date)',
    };
  },

  generateShareableLatestUrl: (customParam?: string) => {
    try {
      const baseUrl = window.location.origin + window.location.pathname;
      const ts = Date.now();
      const params = new URLSearchParams();
      params.set('v', 'latest');
      params.set('t', String(ts));
      if (customParam) {
        params.set('ref', customParam);
      }
      return `${baseUrl}?${params.toString()}`;
    } catch {
      return 'https://ais-pre-baz2tz2hva2o67n245fask-187307553941.asia-east1.run.app/?v=latest';
    }
  },

  updateAndSyncOfflineCache: () => {
    // 1. Merge all default collections to ensure no missing data in local storage
    const mergeCollection = <T extends { id: string }>(
      storageKey: string,
      initialList: T[]
    ) => {
      const saved = getItem<T[]>(storageKey, []);
      const existingIds = new Set((saved || []).map((item) => item.id));
      const missing = initialList.filter((item) => !existingIds.has(item.id));
      if (missing.length > 0) {
        const combined = [...(saved || []), ...missing];
        setItem(storageKey, combined);
      }
    };

    mergeCollection(KEYS.NEWS, initialNews);
    mergeCollection(KEYS.LIVE_HEADLINES, INITIAL_LIVE_HEADLINES);
    mergeCollection(KEYS.BUSES, initialBuses);
    mergeCollection(KEYS.TRAINS, initialTrains);
    mergeCollection(KEYS.HOSPITALS, initialHospitals);
    mergeCollection(KEYS.DOCTORS, initialDoctors);
    mergeCollection(KEYS.MEDICINES, initialMedicines);
    mergeCollection(KEYS.JOBS, initialJobs);
    mergeCollection(KEYS.EDUCATION, initialEducationResources);
    mergeCollection(KEYS.QUIZZES, initialQuizzes);
    mergeCollection(KEYS.BLOOD_DONORS, initialBloodDonors);
    mergeCollection(KEYS.BUSINESSES, initialBusinesses);
    mergeCollection(KEYS.AD_BANNERS, initialAdBanners);
    mergeCollection(KEYS.CERTIFICATES, initialSundayCertificates);

    const nowStr = new Date().toLocaleString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    setItem(KEYS.CACHE_SYNC_TIMESTAMP, nowStr);
    setItem(KEYS.SCHEMA_VERSION, 4);

    // 2. Notify Service Worker to pre-cache offline assets if available
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ action: 'PRECACHE_ALL' });
    }

    return storageService.getStorageStats();
  },

  forceFullAppUpdate: async (): Promise<boolean> => {
    try {
      // 1. Clear caches
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }

      // 2. Clear temporary session caches & update local sync
      storageService.updateAndSyncOfflineCache();

      // 3. Update Service Worker
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.update().catch(() => {});
          if (registration.waiting) {
            registration.waiting.postMessage({ action: 'SKIP_WAITING' });
          }
        }
      }

      return true;
    } catch (e) {
      console.error('Force update error:', e);
      return false;
    }
  },

  clearTemporaryCache: () => {
    try {
      localStorage.removeItem('oj_played_quiz_ids');
      localStorage.removeItem('oj_recent_searches');
    } catch (e) {
      console.error('Error clearing temp cache:', e);
    }
    // Refresh offline sync timestamp
    storageService.updateAndSyncOfflineCache();
  },

  exportAllDataAsJSON: () => {
    const backupPayload = {
      app: 'Our Jamalpur - ডিজিটাল জামালপুর পোর্টাল ও মার্কেটপ্লেস',
      exportedAt: new Date().toISOString(),
      exportedAtBn: new Date().toLocaleString('bn-BD'),
      version: 4,
      data: {
        settings: storageService.getSettings(),
        news: storageService.getNews(),
        products: storageService.getProducts(),
        buses: storageService.getBuses(),
        trains: storageService.getTrains(),
        hospitals: storageService.getHospitals(),
        doctors: storageService.getDoctors(),
        medicines: storageService.getMedicines(),
        jobs: storageService.getJobs(),
        education: storageService.getEducation(),
        quizzes: storageService.getQuizzes(),
        bloodDonors: storageService.getBloodDonors(),
        prayerTimes: storageService.getPrayerTimes(),
        marketPrices: storageService.getMarketPrices(),
        businesses: storageService.getBusinesses(),
        mfsTransfers: storageService.getMfsTransfers(),
        usersList: storageService.getUsersList(),
        currentUser: storageService.getCurrentUser(),
        adBanners: storageService.getAdBanners(),
        monetizationRequests: storageService.getMonetizationRequests(),
        certificates: storageService.getCertificates(),
        bookmarks: storageService.getBookmarks(),
      },
    };

    const jsonString = JSON.stringify(backupPayload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `OurJamalpur-Full-Backup-${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  },

  importDataFromJSON: (jsonString: string): { success: boolean; message: string; count?: number } => {
    try {
      const parsed = JSON.parse(jsonString);
      const data = parsed.data || parsed;

      if (!data || typeof data !== 'object') {
        return { success: false, message: 'অকার্যকর ব্যাকআপ ফাইল ফরম্যাট।' };
      }

      if (data.settings) setItem(KEYS.SETTINGS, data.settings);
      if (data.news) setItem(KEYS.NEWS, data.news);
      if (data.products) setItem(KEYS.PRODUCTS, data.products);
      if (data.buses) setItem(KEYS.BUSES, data.buses);
      if (data.trains) setItem(KEYS.TRAINS, data.trains);
      if (data.hospitals) setItem(KEYS.HOSPITALS, data.hospitals);
      if (data.doctors) setItem(KEYS.DOCTORS, data.doctors);
      if (data.medicines) setItem(KEYS.MEDICINES, data.medicines);
      if (data.jobs) setItem(KEYS.JOBS, data.jobs);
      if (data.education) setItem(KEYS.EDUCATION, data.education);
      if (data.quizzes) setItem(KEYS.QUIZZES, data.quizzes);
      if (data.bloodDonors) setItem(KEYS.BLOOD_DONORS, data.bloodDonors);
      if (data.prayerTimes) setItem(KEYS.PRAYER_TIMES, data.prayerTimes);
      if (data.marketPrices) setItem(KEYS.MARKET_PRICES, data.marketPrices);
      if (data.businesses) setItem(KEYS.BUSINESSES, data.businesses);
      if (data.mfsTransfers) setItem(KEYS.MFS_TRANSFERS, data.mfsTransfers);
      if (data.usersList) setItem(KEYS.USERS_LIST, data.usersList);
      if (data.currentUser) setItem(KEYS.USER, data.currentUser);
      if (data.adBanners) setItem(KEYS.AD_BANNERS, data.adBanners);
      if (data.monetizationRequests) setItem(KEYS.MONETIZATION_REQUESTS, data.monetizationRequests);
      if (data.certificates) setItem(KEYS.CERTIFICATES, data.certificates);
      if (data.bookmarks) setItem(KEYS.BOOKMARKS, data.bookmarks);

      storageService.updateAndSyncOfflineCache();

      return {
        success: true,
        message: 'সম্পূর্ণ লোকাল স্টোরেজ ব্যাকআপ সফলভাবে রিস্টোর ও ক্যাশ আপডেট হয়েছে!',
      };
    } catch (e: any) {
      return { success: false, message: `ফাইল রিডিং ত্রুটি: ${e?.message || 'ভুল ফরম্যাট'}` };
    }
  },

  resetAllToDefault: () => {
    localStorage.clear();
    setItem(KEYS.SETTINGS, initialSettings);
    setItem(KEYS.NEWS, initialNews);
    setItem(KEYS.LIVE_HEADLINES, INITIAL_LIVE_HEADLINES);
    setItem(KEYS.PRODUCTS, initialProducts);
    setItem(KEYS.BUSES, initialBuses);
    setItem(KEYS.TRAINS, initialTrains);
    setItem(KEYS.HOSPITALS, initialHospitals);
    setItem(KEYS.DOCTORS, initialDoctors);
    setItem(KEYS.MEDICINES, initialMedicines);
    setItem(KEYS.JOBS, initialJobs);
    setItem(KEYS.EDUCATION, initialEducationResources);
    setItem(KEYS.QUIZZES, initialQuizzes);
    setItem(KEYS.BLOOD_DONORS, initialBloodDonors);
    setItem(KEYS.PRAYER_TIMES, initialPrayerTimes);
    setItem(KEYS.MARKET_PRICES, initialMarketPrices);
    setItem(KEYS.BUSINESSES, initialBusinesses);
    setItem(KEYS.USER, initialOwnerUser);
    setItem(KEYS.USERS_LIST, [initialOwnerUser]);
    setItem(KEYS.AD_BANNERS, initialAdBanners);
    setItem(KEYS.MONETIZATION_REQUESTS, initialMonetizationRequests);
    setItem(KEYS.CERTIFICATES, initialSundayCertificates);
    setItem(KEYS.CACHE_SYNC_TIMESTAMP, new Date().toLocaleString('bn-BD'));
    setItem(KEYS.SCHEMA_VERSION, 4);
  },
};

// Automatic initial storage & offline cache migration check
try {
  const currentVersion = getItem(KEYS.SCHEMA_VERSION, 0);
  if (currentVersion < 4) {
    storageService.updateAndSyncOfflineCache();
  }
} catch (e) {
  console.warn('Initial storage cache sync check:', e);
}
