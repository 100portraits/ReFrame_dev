// Import the functions you need from the SDKs
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only in browser context
const app = typeof window !== 'undefined' ? initializeApp(firebaseConfig) : null;
const db = typeof window !== 'undefined' ? getFirestore(app) : null;
let analytics = null;

// Initialize analytics in browser environment only
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Firebase project ID for REST API calls
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

// Firestore REST API base URL with API key for authentication
const firestoreBaseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

// Function to add API key to URLs
const addApiKey = (url) => {
  return `${url}?key=${apiKey}`;
};

export { 
  app, 
  db, 
  analytics, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp,
  projectId,
  firestoreBaseUrl,
  addApiKey
}; 