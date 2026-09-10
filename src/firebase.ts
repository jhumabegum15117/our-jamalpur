import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfigJson from '../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey || import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: firebaseConfigJson.authDomain || 'ourjamalpur15117.firebaseapp.com',
  projectId: firebaseConfigJson.projectId || 'ourjamalpur15117',
  storageBucket: firebaseConfigJson.storageBucket || 'ourjamalpur15117.firebasestorage.app',
  messagingSenderId: firebaseConfigJson.messagingSenderId || '110818445188',
  appId: firebaseConfigJson.appId || '1:110818445188:web:6f21b9a8de468da9aaffd1',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Use named database if specified, fallback to default (default database is standard for web)
export const db = firebaseConfigJson.firestoreDatabaseId && firebaseConfigJson.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfigJson.firestoreDatabaseId)
  : getFirestore(app);

// Connectivity validation per Firebase integration guidelines
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firebase client is currently in offline mode.");
    }
  }
}

// Trigger connection test non-blockingly
testConnection().catch(() => {});

export default app;
