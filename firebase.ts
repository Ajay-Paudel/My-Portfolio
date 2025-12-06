import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { FIREBASE_CONFIG } from './constants';

let app;
let database: any;

try {
  if (getApps().length === 0) {
    app = initializeApp(FIREBASE_CONFIG);
  } else {
    app = getApp();
  }
  database = getDatabase(app);
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { database };
