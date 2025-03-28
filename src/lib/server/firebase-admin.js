import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { env } from '$env/dynamic/private';

// Firebase Admin initialization for server-side operations
const FIREBASE_ADMIN_CONFIG = {
  type: env.FIREBASE_TYPE,
  project_id: env.FIREBASE_PROJECT_ID,
  private_key_id: env.FIREBASE_PRIVATE_KEY_ID,
  private_key: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: env.FIREBASE_CLIENT_EMAIL,
  client_id: env.FIREBASE_CLIENT_ID,
  auth_uri: env.FIREBASE_AUTH_URI,
  token_uri: env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: env.FIREBASE_CLIENT_CERT_URL
};

// Initialize Firebase Admin if it hasn't been initialized yet
function getFirebaseAdmin() {
  if (!getApps().length) {
    return initializeApp({
      credential: cert(FIREBASE_ADMIN_CONFIG)
    });
  }
  
  return getApps()[0];
}

export const FB_ADMIN = getFirebaseAdmin(); 