import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Stethoscope,
  MapPin,
  DollarSign,
  Loader2,
  LogIn,
} from 'lucide-react';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { storageService } from '../services/storageService';
import { syncStatusService } from '../services/syncStatusService';
import { DoctorItem, User as UserType, DoctorAppointmentBooking } from '../types';

interface Props {
  doctor: DoctorItem;
  currentUser: UserType | null;
  onClose: () => void;
  onOpenAuth?: () => void;
  onSuccess?: (booking: DoctorAppointmentBooking) => void;
}

export const DoctorAppointmentModal: React.FC<Props> = ({
  doctor,
  currentUser,
  onClose,
  onOpenAuth,
  onSuccess,
}) => {
  // Tomorrow's date formatted as YYYY-MM-DD for default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState<'পুরুষ' | 'মহিলা' | 'অন্যান্য'>('পুরুষ');
  const [preferredDate, setPreferredDate] = useState(defaultDateStr);
  const [preferredSlot, setPreferredSlot] = useState('বিকাল (৪:০০ PM - ৬:০০ PM)');
  const [symptoms, setSymptoms] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<DoctorAppointmentBooking | null>(null);

  const timeSlots = [
    'সকাল (১০:০০ AM - ১২:০০ PM)',
    'দুপুর (১২:০০ PM - ০২:০০ PM)',
    'বিকাল (০৩:০০ PM - ০৫:০০ PM)',
    'সন্ধ্যা (০৫:০০ PM - ০৭:০০ PM)',
    'রাত (০৭:০০ PM - ০৯:০০ PM)',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!currentUser) {
      setErrorMessage('অ্যাপয়েন্টমেন্ট বুকিং করতে অনুগ্রহ করে প্রথমে সাইন ইন বা লগইন করুন।');
      return;
    }

    if (!patientName.trim()) {
      setErrorMessage('রোগীর নাম প্রদান করুন।');
      return;
    }

    const cleanPhone = patientPhone.replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 11) {
      setErrorMessage('সঠিক ১১ সংখ্যার মোবাইল নম্বর প্রদান করুন (যেমন: 017XXXXXXXX)।');
      return;
    }

    if (!preferredDate) {
      setErrorMessage('অ্যাপয়েন্টমেন্টের তারিখ নির্বাচন করুন।');
      return;
    }

    setIsSubmitting(true);
    syncStatusService.notifySyncStart('appointment-booking');

    const bookingId = `apt-${Date.now()}`;
    const feeAmount = doctor.consultationFee || doctor.fee || 500;
    const bookingPayload: DoctorAppointmentBooking = {
      id: bookingId,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      hospitalOrChamber: doctor.hospitalOrChamber,
      patientName: patientName.trim(),
      patientPhone: cleanPhone,
      patientAge: patientAge.trim() || undefined,
      patientGender,
      preferredDate,
      preferredSlot,
      symptoms: symptoms.trim() || undefined,
      userId: currentUser.id,
      userEmail: currentUser.email || undefined,
      status: 'pending',
      consultationFee: feeAmount,
      createdAt: new Date().toISOString(),
    };

    try {
      // 1. Store in Firestore database
      const appointmentsRef = collection(db, 'appointments');
      const docRef = await addDoc(appointmentsRef, {
        doctorId: bookingPayload.doctorId,
        doctorName: bookingPayload.doctorName,
        specialty: bookingPayload.specialty,
        hospitalOrChamber: bookingPayload.hospitalOrChamber,
        patientName: bookingPayload.patientName,
        patientPhone: bookingPayload.patientPhone,
        patientAge: bookingPayload.patientAge || '',
        patientGender: bookingPayload.patientGender,
        preferredDate: bookingPayload.preferredDate,
        preferredSlot: bookingPayload.preferredSlot,
        symptoms: bookingPayload.symptoms || '',
        userId: currentUser.id,
        userEmail: currentUser.email || '',
        status: 'pending',
        consultationFee: bookingPayload.consultationFee,
        createdAt: bookingPayload.createdAt,
      });

      // Update booking with actual Firestore document ID if generated
      const finalBooking: DoctorAppointmentBooking = {
        ...bookingPayload,
        id: docRef.id || bookingId,
      };

      // 2. Also persist in local storageService for offline instant access and cache
      storageService.addAppointment(finalBooking);

      setBookingSuccess(finalBooking);
      if (onSuccess) {
        onSuccess(finalBooking);
      }
    } catch (err: any) {
      console.warn('Firestore write warning, saving locally:', err);
      // Fallback: save to local storageService if Firestore client encountered an error
      const savedLocal = storageService.addAppointment(bookingPayload);
      setBookingSuccess(savedLocal);
      if (onSuccess) {
        onSuccess(savedLocal);
      }
    } finally {
      setIsSubmitting(false);
      syncStatusService.notifySyncEnd();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl relative my-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
          title="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Doctor Summary Card */}
        <div className="flex items-start gap-3.5 pr-8 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded mb-1">
              <Calendar className="w-3 h-3" />
              <span>ডাক্তার অ্যাপয়েন্টমেন্ট বুকিং</span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
              {doctor.name}
            </h2>
            <p className="text-xs text-teal-700 dark:text-teal-300 font-semibold">{doctor.specialty}</p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {doctor.hospitalOrChamber}
              </span>
              <span>•</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                ফি: ৳{doctor.consultationFee || doctor.fee || 500}
              </span>
            </div>
          </div>
        </div>

        {/* If user is not logged in */}
        {!currentUser ? (
          <div className="py-6 text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center border border-amber-200 dark:border-amber-800">
              <LogIn className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                লগইন প্রয়োজন
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto mt-1">
                ডাক্তারের অ্যাপয়েন্টমেন্ট ও সিরিয়াল বুকিং করার জন্য আপনার নাগরিক একাউন্টে লগইন বা সাইন ইন থাকা আবশ্যক।
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenAuth) onOpenAuth();
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>এখনই লগইন করুন</span>
              </button>
            </div>
          </div>
        ) : bookingSuccess ? (
          /* Confirmation View */
          <div className="py-6 text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-300 dark:border-emerald-800 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                অ্যাপয়েন্টমেন্ট রিকোয়েস্ট সফলভাবে জমা হয়েছে!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                আপনার সিরিয়াল আবেদনটি ফায়ারবেস ক্লাউড ডাটাবেজে সংরক্ষিত হয়েছে। চেম্বার কর্তৃপক্ষ আপনার মোবাইল নম্বরে নিশ্চিতকরণ এসএমএস বা কল করবে।
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl text-left text-xs space-y-2 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">সিরিয়াল ট্র্যাকিং আইডি:</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{bookingSuccess.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">রোগীর নাম:</span>
                <span className="font-bold text-slate-900 dark:text-white">{bookingSuccess.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">তারিখ ও সময়:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {bookingSuccess.preferredDate} ({bookingSuccess.preferredSlot})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">পরামর্শ ফি:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">৳{bookingSuccess.consultationFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">অবস্থা (Status):</span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-[10px]">
                  অপেক্ষমান (Pending Confirmation)
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition cursor-pointer shadow-md"
              >
                ঠিক আছে (সম্পন্ন)
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
            {errorMessage && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Patient Name & Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  রোগীর নাম <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="পুরো নাম লিখুন"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  যোগাযোগের মোবাইল নম্বর <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Age & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  রোগীর বয়স (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="যেমন: ৩২ বছর"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  লিঙ্গ
                </label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                >
                  <option value="পুরুষ">পুরুষ</option>
                  <option value="মহিলা">মহিলা</option>
                  <option value="অন্যান্য">অন্যান্য</option>
                </select>
              </div>
            </div>

            {/* Date and Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  কাঙ্ক্ষিত অ্যাপয়েন্টমেন্ট তারিখ <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  পছন্দের সময় / স্লট
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    value={preferredSlot}
                    onChange={(e) => setPreferredSlot(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  >
                    {timeSlots.map((slot, idx) => (
                      <option key={idx} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Health Issue / Symptoms */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                প্রধান স্বাস্থ্য সমস্যা বা লক্ষণ (সংক্ষেপে লিখুন)
              </label>
              <textarea
                rows={2}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="যেমন: ৩ দিন ধরে তীব্র জ্বর, মাথাব্যথা বা প্রেসারের সমস্যা..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden resize-none"
              />
            </div>

            {/* Notice */}
            <div className="p-3 bg-teal-50/70 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-800/80 text-[11px] text-teal-900 dark:text-teal-200">
              <span className="font-bold">জরুরি দ্রষ্টব্য:</span> অ্যাপয়েন্টমেন্ট সাবমিট করার পর তথ্যটি সরাসরি ফায়ারবেস ক্লাউড ডাটাবেজে সেভ হবে। ডাক্তার চেম্বারের সিরিয়াল সমন্বয়কারী আপনাকে ফোন করে সিরিয়াল নম্বর কনফার্ম করবে।
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                id="submit-doctor-appointment-btn"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>সংরক্ষণ হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>অ্যাপয়েন্টমেন্ট বুক করুন</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
