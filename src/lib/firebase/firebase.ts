import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const app = initializeApp(firebaseConfig);
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_FIREBASE_SITE_KEY),
  isTokenAutoRefreshEnabled: true
});
export const auth = getAuth(app);
