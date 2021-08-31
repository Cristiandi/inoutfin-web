import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth';

import environment from '../environment';

// console.log('environment', environment);

const config = {
  apiKey: environment.FIREBASE_API_KEY,
  authDomain: environment.FIREBASE_AUTH_DOMAIN,
  databaseURL: environment.FIREBASE_DATABASE_URL,
  projectId: environment.FIREBASE_PROJECT_ID,
  storageBucket: environment.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: environment.FIREBASE_MESSAGING_SENDER_ID,
  appId: environment.FIREBASE_APP_ID,
  measurementId: environment.FIREBASE_MEASUREMENT_ID
};

const firebaseApp = initializeApp(config);

const auth = getAuth(firebaseApp);

const googleAuthProvider = new GoogleAuthProvider();

export {
  auth,
  onAuthStateChanged,
  googleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup
};
