import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { env } from '$env/dynamic/private';

// Use client Firebase SDK for server operations with admin privileges
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
};

// Initialize a separate Firebase instance for server-side operations
const app = initializeApp(firebaseConfig, 'server');
const db = getFirestore(app);

export { app, db }; 