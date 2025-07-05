// src/services/firebase.ts
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, setUserId, isSupported } from 'firebase/analytics';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate config
const isConfigValid = Object.values(firebaseConfig).every(value => value && value !== 'your_');

if (!isConfigValid) {
  console.warn('Firebase config is not properly set. Please check your .env.local file.');
}

// Initialize Firebase
let app: FirebaseApp | undefined;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  // You might want to show a user-friendly error here
}

// Initialize Firebase services with error handling
export const db = getFirestore(app!);
export const storage = getStorage(app!);
export const auth = getAuth(app!);

// Initialize Analytics only if supported
export let analytics: any = null;
isSupported().then(supported => {
  if (supported && app) {
    analytics = getAnalytics(app);
  }
}).catch(console.error);

// Connect to emulators in development
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
  console.log('Connected to Firebase emulators');
}

// Enable offline persistence for Firestore (important for PWA!)
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one tab at a time
    console.warn('Firebase persistence failed: Multiple tabs open');
  } else if (err.code === 'unimplemented') {
    // The current browser doesn't support persistence
    console.warn('Firebase persistence is not available');
  }
});

// Helper function to generate anonymous user ID
export const getAnonymousUserId = (): string => {
  let userId = localStorage.getItem('analytics_user_id');
  if (!userId) {
    userId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('analytics_user_id', userId);
    if (analytics) {
      setUserId(analytics, userId);
    }
  }
  return userId;
};

// Firebase error handler
export const handleFirebaseError = (error: any): string => {
  console.error('Firebase error:', error);
  
  const errorMessages: Record<string, string> = {
    'permission-denied': 'You don\'t have permission to perform this action',
    'unavailable': 'Service temporarily unavailable. Please try again',
    'unauthenticated': 'Please sign in to continue',
    'not-found': 'The requested data was not found',
    'already-exists': 'This item already exists',
    'failed-precondition': 'Operation failed. Please try again',
    'resource-exhausted': 'Too many requests. Please slow down',
    'cancelled': 'Operation was cancelled',
    'data-loss': 'Data loss detected. Please refresh',
    'unknown': 'An unknown error occurred',
  };
  
  return errorMessages[error.code] || 'Something went wrong. Please try again';
};

// Initialize anonymous user on app load
if (typeof window !== 'undefined') {
  getAnonymousUserId();
}

// Export types for TypeScript
export type { User } from 'firebase/auth';
export type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';