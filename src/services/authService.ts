import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { User, Upazila } from '../types';
import { storageService } from './storageService';

// Designated Super Admin Email Accounts
export const ADMIN_EMAILS = [
  'jhumabegum15117@gmail.com',
  'masudrana15117@gmail.com',
  'admin@ourjamalpur.com',
];

// Master Admin Passwords accepted for instant verified admin access
export const MASTER_ADMIN_PASSWORDS = [
  '15117',
  'jamalpur15117',
  'admin15117',
  'masud15117',
  '123456',
];

interface ActiveOtpSession {
  target: string;
  type: 'phone' | 'email';
  code: string;
  expiresAt: number;
}

const activeOtpSessions = new Map<string, ActiveOtpSession>();

/**
 * Checks whether a user account has administrative privileges
 */
export function isUserAdmin(user: User | null | undefined): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (user.id === 'OJ-15117' || user.id === 'usr-owner-1') return true;
  const cleanPhone = (user.phone || '').replace(/\D/g, '');
  if (cleanPhone === '01315481879' || cleanPhone === '8801315481879') return true;
  if (user.email && ADMIN_EMAILS.includes(user.email.trim().toLowerCase())) return true;
  return false;
}

export const authService = {
  /**
   * Generates and dispatches a 6-digit OTP for phone or email
   */
  async sendOtp(target: string, type: 'phone' | 'email'): Promise<{ success: boolean; otp: string; message: string }> {
    const cleanTarget = target.trim().toLowerCase();
    if (type === 'phone') {
      const cleanPhone = cleanTarget.replace(/\s+/g, '').replace(/^(\+88)/, '');
      if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
        throw new Error('সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)');
      }
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanTarget)) {
        throw new Error('সঠিক ইমেইল এড্রেস লিখুন (যেমন: name@example.com)');
      }
    }

    // Generate 6-digit secure numeric code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    activeOtpSessions.set(cleanTarget, {
      target: cleanTarget,
      type,
      code,
      expiresAt,
    });

    return {
      success: true,
      otp: code,
      message: type === 'phone'
        ? 'মোবাইলে ৬-সংখ্যার ওটিপি কোড পাঠানো হয়েছে'
        : 'ইমেইলে ৬-সংখ্যার ওটিপি কোড পাঠানো হয়েছে',
    };
  },

  /**
   * Verifies the 6-digit OTP
   */
  verifyOtp(target: string, code: string): boolean {
    const cleanTarget = target.trim().toLowerCase();
    const session = activeOtpSessions.get(cleanTarget);
    if (!session) {
      throw new Error('কোনো ওটিপি অনুরোধ পাওয়া যায়নি। পুনরায় কোড পাঠান।');
    }
    if (Date.now() > session.expiresAt) {
      activeOtpSessions.delete(cleanTarget);
      throw new Error('ওটিপির মেয়াদ শেষ হয়ে গেছে। দয়া করে পুনরায় নতুন কোড পাঠান।');
    }
    if (session.code !== code.trim()) {
      throw new Error('ভুল ওটিপি কোড! অনুগ্রহ করে সঠিক ৬-সংখ্যার কোড লিখুন।');
    }
    // Successfully verified, remove session
    activeOtpSessions.delete(cleanTarget);
    return true;
  },

  /**
   * Login or Register using Verified Phone
   */
  async loginOrRegisterWithPhone(params: {
    phone: string;
    otp: string;
    name?: string;
    upazila?: string;
    email?: string;
  }): Promise<{ user: User; isNew: boolean }> {
    const cleanPhone = params.phone.trim().replace(/\s+/g, '').replace(/^(\+88)/, '');
    authService.verifyOtp(cleanPhone, params.otp);

    // Check if user already exists
    const users = storageService.getUsersList();
    const existing = users.find((u) => u.phone?.replace(/\s+/g, '').replace(/^(\+88)/, '') === cleanPhone);

    if (existing) {
      storageService.setCurrentUser(existing);
      return { user: existing, isNew: false };
    }

    // If new user and name not supplied, signal that name is required
    if (!params.name || !params.name.trim()) {
      throw new Error('নতুন নিবন্ধনের জন্য আপনার পূর্ণ নাম প্রয়োজন।');
    }

    const newUser: User = {
      id: `usr-ph-${Date.now()}`,
      name: params.name.trim(),
      phone: cleanPhone,
      email: params.email?.trim().toLowerCase() || `${cleanPhone}@ourjamalpur.com`,
      role: 'user',
      upazila: (params.upazila as Upazila) || 'জামালপুর সদর',
      joinedDate: new Date().toLocaleDateString('bn-BD'),
    };

    storageService.setUsersList([...users, newUser]);
    storageService.setCurrentUser(newUser);

    // Attempt to persist to Firestore if possible
    try {
      await setDoc(doc(db, 'users', newUser.id), {
        uid: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
        upazila: newUser.upazila,
        role: newUser.role,
        authProvider: 'phone_otp',
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Could not sync phone user to Firestore:', e);
    }

    return { user: newUser, isNew: true };
  },

  /**
   * Login or Register using Verified Email OTP
   */
  async loginOrRegisterWithEmailOtp(params: {
    email: string;
    otp: string;
    name?: string;
    upazila?: string;
    phone?: string;
  }): Promise<{ user: User; isNew: boolean }> {
    const cleanEmail = params.email.trim().toLowerCase();
    authService.verifyOtp(cleanEmail, params.otp);

    const users = storageService.getUsersList();
    const existing = users.find((u) => u.email?.toLowerCase() === cleanEmail);

    if (existing) {
      storageService.setCurrentUser(existing);
      return { user: existing, isNew: false };
    }

    const assignedRole = ADMIN_EMAILS.includes(cleanEmail) ? 'admin' : 'user';
    const newUser: User = {
      id: `usr-em-${Date.now()}`,
      name: params.name?.trim() || cleanEmail.split('@')[0],
      phone: params.phone?.trim() || '',
      email: cleanEmail,
      role: assignedRole,
      upazila: (params.upazila as Upazila) || 'জামালপুর সদর',
      joinedDate: new Date().toLocaleDateString('bn-BD'),
    };

    storageService.setUsersList([...users, newUser]);
    storageService.setCurrentUser(newUser);

    try {
      await setDoc(doc(db, 'users', newUser.id), {
        uid: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
        upazila: newUser.upazila,
        role: newUser.role,
        authProvider: 'email_otp',
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Could not sync email otp user to Firestore:', e);
    }

    return { user: newUser, isNew: true };
  },
  /**
   * Register a new citizen account with Firebase Authentication
   * Every new registration defaults strictly to 'user' role.
   */
  async registerWithEmail(params: {
    name: string;
    email: string;
    password: string;
    upazila: string;
    phone?: string;
  }): Promise<User> {
    const cleanEmail = params.email.trim().toLowerCase();
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, params.password);
    const fbUser = cred.user;

    // Update Firebase Auth profile display name
    await updateProfile(fbUser, { displayName: params.name.trim() });

    // Determine role: explicitly default to 'user' (only master email gets admin)
    const isAdminEmail = ADMIN_EMAILS.includes(cleanEmail);
    const assignedRole: 'admin' | 'user' = isAdminEmail ? 'admin' : 'user';

    const userProfileData = {
      uid: fbUser.uid,
      name: params.name.trim(),
      email: cleanEmail,
      phone: params.phone?.trim() || '',
      upazila: (params.upazila as Upazila) || 'জামালপুর সদর',
      role: assignedRole,
      createdAt: new Date().toISOString(),
    };

    // Save profile to Firestore /users/{userId}
    try {
      const userRef = doc(db, 'users', fbUser.uid);
      await setDoc(userRef, userProfileData);

      // If designated admin, also add to admins collection registry
      if (isAdminEmail) {
        await setDoc(doc(db, 'admins', fbUser.uid), {
          email: cleanEmail,
          assignedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('Could not sync user profile to Firestore immediately:', err);
    }

    const appUser: User = {
      id: fbUser.uid,
      name: params.name.trim(),
      phone: params.phone?.trim() || '',
      email: cleanEmail,
      role: assignedRole,
      upazila: (params.upazila as Upazila) || 'জামালপুর সদর',
      joinedDate: new Date().toLocaleDateString('bn-BD'),
    };

    storageService.setCurrentUser(appUser);
    return appUser;
  },

  /**
   * Login user with Email & Password or Master Admin Credentials
   */
  async loginWithEmail(identifier: string, pass: string): Promise<User> {
    const rawTarget = identifier.trim();
    const cleanLower = rawTarget.toLowerCase();
    const cleanPhone = rawTarget.replace(/\s+/g, '').replace(/^(\+88)/, '');

    const isMasterAdminId =
      ADMIN_EMAILS.includes(cleanLower) ||
      cleanPhone === '01315481879' ||
      cleanLower === 'admin' ||
      cleanLower === 'oj-15117' ||
      cleanLower === 'usr-owner-1';

    const isMasterPassword = MASTER_ADMIN_PASSWORDS.includes(pass.trim());

    // 1. Instant Master Admin Login Guard
    if (isMasterAdminId && isMasterPassword) {
      const isJhuma = cleanLower.includes('jhuma');
      const adminEmail = isJhuma
        ? 'jhumabegum15117@gmail.com'
        : (cleanLower.includes('@') ? cleanLower : 'masudrana15117@gmail.com');

      const masterUser: User = {
        id: 'OJ-15117',
        name: isJhuma ? 'ঝুমা বেগম' : 'মাসুদ রানা',
        phone: '01315481879',
        email: adminEmail,
        role: 'admin',
        upazila: 'জামালপুর সদর',
        joinedDate: '২০২৬-০১-০১',
      };

      storageService.setCurrentUser(masterUser);

      // Attempt background Firebase Auth sync if network allows
      try {
        await signInWithEmailAndPassword(auth, adminEmail, pass).catch(async (e) => {
          if (e?.code === 'auth/user-not-found') {
            await createUserWithEmailAndPassword(auth, adminEmail, pass);
          }
        });
      } catch {}

      return masterUser;
    }

    // 2. Standard Firebase Authentication
    const cleanEmail = cleanLower.includes('@') ? cleanLower : `${cleanPhone}@ourjamalpur.com`;

    let fbUser: FirebaseUser;
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      fbUser = cred.user;
    } catch (err: any) {
      // If admin email not yet created in Firebase Auth, auto-provision with this password
      if (err?.code === 'auth/user-not-found' && ADMIN_EMAILS.includes(cleanEmail)) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
          fbUser = cred.user;
        } catch (createErr) {
          throw err;
        }
      } else {
        throw err;
      }
    }

    // Fetch user profile from Firestore
    let role: 'admin' | 'user' = ADMIN_EMAILS.includes(cleanEmail) ? 'admin' : 'user';
    let upazila: Upazila = 'জামালপুর সদর';
    let phone = cleanPhone.startsWith('01') ? cleanPhone : '';
    let name = fbUser.displayName || cleanEmail.split('@')[0];

    try {
      const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.role === 'admin' || ADMIN_EMAILS.includes(cleanEmail)) {
          role = 'admin';
        }
        if (data.name) name = data.name;
        if (data.upazila) upazila = data.upazila as Upazila;
        if (data.phone) phone = data.phone;
      } else {
        // Create document if first login without doc
        await setDoc(doc(db, 'users', fbUser.uid), {
          uid: fbUser.uid,
          name,
          email: cleanEmail,
          phone,
          upazila,
          role,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.warn('Firestore fetch failed during login, using Auth metadata:', e);
    }

    const appUser: User = {
      id: ADMIN_EMAILS.includes(cleanEmail) ? 'OJ-15117' : fbUser.uid,
      name,
      phone,
      email: cleanEmail,
      role,
      upazila,
      joinedDate: new Date().toLocaleDateString('bn-BD'),
    };

    storageService.setCurrentUser(appUser);
    return appUser;
  },

  /**
   * Send Password Reset Email via Firebase Auth
   */
  async sendPasswordReset(email: string): Promise<void> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      throw new Error('দয়া করে আপনার ইমেইল এড্রেস প্রদান করুন।');
    }
    await sendPasswordResetEmail(auth, cleanEmail);
  },

  /**
   * Logout user from Firebase Auth and local session
   */
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Firebase signout error:', err);
    }
    storageService.logout();
  },

  /**
   * Listen to Firebase Auth state changes
   */
  subscribeToAuthState(onChange: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (!fbUser) {
        // If not logged into Firebase, check if local storage user is admin or guest
        const local = storageService.getCurrentUser();
        onChange(local);
        return;
      }

      const cleanEmail = (fbUser.email || '').toLowerCase();
      let role: 'admin' | 'user' = ADMIN_EMAILS.includes(cleanEmail) ? 'admin' : 'user';
      let upazila: Upazila = 'জামালপুর সদর';
      let phone = '';
      let name = fbUser.displayName || cleanEmail.split('@')[0] || 'নাগরিক';

      try {
        const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.role === 'admin' || ADMIN_EMAILS.includes(cleanEmail)) {
            role = 'admin';
          }
          if (data.name) name = data.name;
          if (data.upazila) upazila = data.upazila as Upazila;
          if (data.phone) phone = data.phone;
        }
      } catch (e) {
        // Fallback gracefully
      }

      const user: User = {
        id: fbUser.uid,
        name,
        phone,
        email: cleanEmail,
        role,
        upazila,
        joinedDate: new Date().toLocaleDateString('bn-BD'),
      };

      storageService.setCurrentUser(user);
      onChange(user);
    });
  },

  /**
   * Update profile data
   */
  async updateProfileData(userId: string, data: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...(data.name ? { name: data.name } : {}),
        ...(data.phone ? { phone: data.phone } : {}),
        ...(data.upazila ? { upazila: data.upazila } : {}),
        ...(data.avatar ? { avatar: data.avatar } : {}),
      });
    } catch (err) {
      console.warn('Firestore updateProfile failed:', err);
    }
    storageService.updateCurrentUser(data);
  },
};
