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
];

/**
 * Checks whether a user account has administrative privileges
 */
export function isUserAdmin(user: User | null | undefined): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (user.email && ADMIN_EMAILS.includes(user.email.trim().toLowerCase())) return true;
  return false;
}

export const authService = {
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
   * Login user with Email & Password
   */
  async loginWithEmail(email: string, pass: string): Promise<User> {
    const cleanEmail = email.trim().toLowerCase();
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    const fbUser = cred.user;

    // Fetch user profile from Firestore
    let role: 'admin' | 'user' = ADMIN_EMAILS.includes(cleanEmail) ? 'admin' : 'user';
    let upazila: Upazila = 'জামালপুর সদর';
    let phone = '';
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
      id: fbUser.uid,
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
