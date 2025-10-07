import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './firebaseConfig';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

if (typeof window !== 'undefined') {
  if (process.env.NEXT_PUBLIC_FIREBASE_SITE_KEY) {
    try {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_FIREBASE_SITE_KEY),
        isTokenAutoRefreshEnabled: true
      });
    } catch (error) {
      console.error('Failed to initialize Firebase App Check:', error);
    }
  } else {
    console.warn('NEXT_PUBLIC_FIREBASE_SITE_KEY is not set. Firebase App Check is disabled.');
  }
}

export const auth = getAuth(app);
