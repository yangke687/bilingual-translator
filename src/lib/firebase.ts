import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

let app: FirebaseApp | null;
let auth: Auth | null;
let db: Firestore | null;
let googleProvider: GoogleAuthProvider | null;

export const getFireBaseApp: () => FirebaseApp = () => {
  if (!app) {
    app = initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGEING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    });
  }

  return app;
};

export const getFireBaseAuth: () => Auth = () => {
  if (!auth) {
    auth = getAuth(getFireBaseApp());
  }

  return auth;
};

export const getFireDb: () => Firestore = () => {
  if (!db) {
    db = getFirestore(getFireBaseApp());
  }

  return db;
};

export const getGoogleProvider: () => GoogleAuthProvider = () => {
  if (!googleProvider) {
    googleProvider = new GoogleAuthProvider();
  }

  return googleProvider;
};
