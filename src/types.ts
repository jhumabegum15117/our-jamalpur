export type Upazila =
  | 'সকল উপজেলা'
  | 'জামালপুর সদর'
  | 'ইসলামপুর'
  | 'দেওয়ানগঞ্জ'
  | 'মেলান্দহ'
  | 'মাদারগঞ্জ'
  | 'সরিষাবাড়ী'
  | 'বকশীগঞ্জ';

export type TabType =
  | 'home'
  | 'marketplace'
  | 'product-details'
  | 'sell'
  | 'news'
  | 'news-details'
  | 'weather'
  | 'helplines'
  | 'transport'
  | 'bus'
  | 'train'
  | 'hospital'
  | 'doctors'
  | 'medicine'
  | 'jobs'
  | 'education'
  | 'quiz'
  | 'blood-donor'
  | 'prayer'
  | 'market-price'
  | 'business'
  | 'mfs-transfer'
  | 'contact'
  | 'about'
  | 'admin'
  | 'profile'
  | 'ads-pricing'
  | 'export-zip';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'admin' | 'user';
  upazila: Upazila;
  joinedDate: string;
  avatar?: string;
}

export type NewsCategory =
  | 'সদর'
  | 'ইসলামপুর'
  | 'দেওয়ানগঞ্জ'
  | 'মেলান্দহ'
  | 'মাদারগঞ্জ'
  | 'সরিষাবাড়ী'
  | 'বকশীগঞ্জ'
  | 'শিক্ষা'
  | 'চাকরি'
  | 'ঘটনা'
  | 'জাতীয়'
  | 'আন্তর্জাতিক'
  | 'পত্রিকা শিরোনাম'
  | 'খেলাধুলা'
  | 'প্রযুক্তি'
  | string;

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: NewsCategory;
  location: string;
  date: string;
  author: string;
  views: number;
  featured?: boolean;
  source?: string;
  sourceUrl?: string;
}

export interface LiveHeadline {
  id: string;
  title: string;
  source: string;
  category: 'all' | 'national' | 'international' | 'newspaper' | 'local';
  categoryLabel: string;
  time: string;
  summary?: string;
  url?: string;
  badgeBg?: string;
}

export type ProductCategory =
  | 'Mobile'
  | 'Electronics'
  | 'Clothing'
  | 'Agricultural Products'
  | 'জমি/বাড়ি'
  | 'যানবাহন'
  | 'গৃহস্থালি পণ্য'
  | 'চাকরি'
  | 'অন্যান্য';

export interface ProductItem {
  id: string;
  title: string;
  category: ProductCategory;
  price: number;
  isNegotiable: boolean;
  location: Upazila;
  address: string;
  condition: 'New' | 'Used';
  description: string;
  images: string[];
  sellerName: string;
  sellerPhone: string;
  sellerId: string;
  postedDate: string;
  featured?: boolean;
  status: 'active' | 'sold' | 'pending';
}

export interface BusItem {
  id: string;
  name: string;
  busType: 'AC' | 'Non-AC' | 'Deluxe' | 'Chair Coach' | string;
  type?: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
  fare: number;
  counterLocation: string;
  contactNumber: string;
  counterPhone?: string;
  supervisorName?: string;
  supervisorPhone?: string;
  departurePoint: string;
  destinationPoint: string;
}

export interface TrainItem {
  id: string;
  trainName: string;
  trainNo: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
  weeklyOffDay: string;
  fareClasses: {
    shovon: number;
    shovonChair: number;
    snigdha: number;
    acSeat: number;
    acBerth: number;
  };
  stations: string[];
  onlineTicketUrl: string;
}

export interface HospitalItem {
  id: string;
  name: string;
  type: 'সরকারি' | 'বেসরকারি' | 'ক্লিনিক' | 'ডায়াগনস্টিক' | 'Govt' | 'Private' | string;
  address: string;
  upazila: Upazila;
  phone: string;
  emergencyPhone: string;
  ambulancePhone: string;
  services: string[];
  totalBeds?: number;
  bedCount?: number;
  mapUrl?: string;
  isOpen24Hours: boolean;
}

export interface DoctorItem {
  id: string;
  name: string;
  degrees: string;
  qualification?: string;
  specialty: string;
  designation: string;
  hospitalOrChamber: string;
  upazila: Upazila;
  visitingDays: string;
  visitingHours: string;
  consultationFee: number;
  fee?: number;
  serialPhone: string;
  appointmentPhone?: string;
  image?: string;
}

export interface MedicineItem {
  id: string;
  brandName: string;
  genericName: string;
  category: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Drop' | 'Ointment' | 'Suspension';
  strength: string;
  manufacturer: string;
  indications: string;
  precautions: string;
  sideEffects: string;
  pricePerUnit?: number;
  price?: number;
}

export interface JobItem {
  id: string;
  title: string;
  company: string;
  location: Upazila;
  salary: string;
  jobType: 'Full-time' | 'Part-time' | 'Contractual' | 'Internship' | string;
  type?: string;
  deadline: string;
  requirements: string[] | string;
  responsibilities?: string[];
  vacancies: number;
  contactEmailOrPhone: string;
  contactPhone?: string;
  contactEmail?: string;
  applyInstructions: string;
  postedDate: string;
}

export interface EducationResource {
  id: string;
  classLevel: 'Class 1' | 'Class 2' | 'Class 3' | 'Class 4' | 'Class 5' | 'Class 6' | 'Class 7' | 'Class 8' | 'Class 9' | 'Class 10';
  subject: string;
  title: string;
  type: 'Book (NCTB)' | 'PDF Note' | 'Model Question' | 'Suggestion' | 'Information';
  description: string;
  fileSize: string;
  downloadUrl: string;
  officialSource: string;
  className?: string;
  edition?: string;
  pdfLink?: string;
}

export type EducationBook = EducationResource;
export type BusService = BusItem;
export type TrainSchedule = TrainItem;
export type PrayerTime = PrayerTimeData;
export type SiteSettings = WebsiteSettings;

export interface QuizQuestion {
  id: string;
  category: 'জামালপুর জেলা' | 'সাধারণ জ্ঞান' | 'বিজ্ঞান ও প্রযুক্তি' | 'ইতিহাস ও মুক্তিযুদ্ধ' | 'ইসলামিক জ্ঞান' | string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  correctIndex?: number;
  explanation: string;
}

export interface QuizScore {
  id: string;
  userName: string;
  score: number;
  totalQuestions: number;
  timeTakenSeconds: number;
  date: string;
}

export interface QuizCertificate {
  id: string;
  certificateNo: string;
  recipientName: string;
  recipientUpazila?: Upazila | string;
  institution?: string;
  quizTitle: string;
  score: number;
  totalScore: number;
  grade: string;
  issueSundayDate: string;
  issuedAt: string;
  verificationCode: string;
  authorityName: string;
  signerName: string;
  signerTitle: string;
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  upazila: Upazila;
  address: string;
  area?: string;
  phone: string;
  isAvailable: boolean;
  lastDonationDate: string;
  totalDonations?: number;
}

export interface PrayerTimeData {
  date: string;
  banglaDate: string;
  hijriDate: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  sehriEnds: string;
  iftar: string;
}

export interface MarketPriceItem {
  id: string;
  name: string;
  category: 'চাল ও শস্য' | 'সবজি' | 'মাছ ও মাংস' | 'ডিম ও দুগ্ধ' | 'তেল ও মসলা' | 'অন্যান্য';
  unit: string;
  currentPrice: number;
  previousPrice: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
  marketLocation: string;
}

export interface BusinessItem {
  id: string;
  name: string;
  category: 'দোকান' | 'Restaurant' | 'Hotel' | 'Pharmacy' | 'Service Provider' | 'Computer Shop' | 'Mobile Shop' | 'অন্যান্য ব্যবসা';
  ownerName: string;
  address: string;
  upazila: Upazila;
  phone: string;
  whatsapp?: string;
  openingHours: string;
  servicesSummary: string;
  isFeatured?: boolean;
  image?: string;
}

export interface EmergencyContact {
  title: string;
  subtitle: string;
  number: string;
  iconName: string;
  category: 'police' | 'fire' | 'hospital' | 'admin' | 'ambulance';
}

export interface WebsiteSettings {
  siteName: string;
  tagline: string;
  emergencyHotline: string;
  breakingNewsNotice: string;
  noticeTickerText?: string;
  ownerName: string;
  ownerBio: string;
  ownerPhone: string;
  contactPhone?: string;
  ownerEmail: string;
  contactEmail?: string;
  facebookProfile?: string;
  facebookPage?: string;
  ownerPhotoUrl?: string;
  adSenseEnabled: boolean;
  maintenanceMode: boolean;
}

export type MfsProviderId =
  | 'bkash'
  | 'nagad'
  | 'rocket'
  | 'upay'
  | 'cellfin'
  | 'mcash'
  | 'tap'
  | 'bank';

export interface MfsProvider {
  id: MfsProviderId;
  name: string;
  bengaliName: string;
  shortCode: string;
  ussd: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  appUrl: string;
  feePercentMfs: number; // interoperability fee to other MFS
  feeFixedMfs: number;
  feePercentBank: number;
  feeFixedBank: number;
  minTransfer: number;
  maxTransferDaily: number;
  helpline: string;
  supportsBinimoy: boolean;
  description: string;
}

export interface MfsTransferRecord {
  id: string;
  fromProvider: MfsProviderId;
  toProvider: MfsProviderId;
  senderNumber: string;
  receiverNumber: string;
  amount: number;
  charge: number;
  totalDebited: number;
  netCredited: number;
  reference?: string;
  protocol: 'Binimoy (IDTP)' | 'Direct MFS Interoperability' | 'Bank IBFT / NPSB' | 'Cellfin Bridge';
  transactionToken: string;
  timestamp: string;
  status: 'Completed' | 'Pending' | 'Initiated';
}

export type MonetizationServiceType =
  | 'banner_ad'
  | 'boost_product'
  | 'job_listing'
  | 'featured_business'
  | 'doctor_listing'
  | 'sponsor_partner';

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket';

export interface MonetizationRequest {
  id: string;
  serviceType: MonetizationServiceType;
  packageTitle: string;
  amount: number;
  durationDays: number;
  advertiserName: string;
  advertiserPhone: string;
  businessOrTitle: string;
  details?: string;
  linkOrSocial?: string;
  bannerImage?: string;
  targetId?: string; // product ID, job ID, etc.
  paymentMethod: PaymentMethod;
  senderNumber: string;
  trxId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  approvedAt?: string;
  adminNote?: string;
}

export interface AdBannerItem {
  id: string;
  title: string;
  subtitle?: string;
  advertiserName: string;
  advertiserPhone: string;
  bannerImage?: string;
  targetUrl?: string;
  placement: 'home_top' | 'marketplace' | 'news' | 'sidebar';
  amountPaid: number;
  status: 'active' | 'inactive';
  expiresAt: string;
}


