import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';
import type { FirebaseConfig } from '../types';
import { logger } from '../utils/logger';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;

export const initializeFirebase = async (): Promise<void> => {
  try {
    const config: FirebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    if (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
      config.measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;
    }

    const missingVars: string[] = [];
    if (!config.apiKey) missingVars.push('VITE_FIREBASE_API_KEY');
    if (!config.authDomain) missingVars.push('VITE_FIREBASE_AUTH_DOMAIN');
    if (!config.projectId) missingVars.push('VITE_FIREBASE_PROJECT_ID');
    if (!config.storageBucket) missingVars.push('VITE_FIREBASE_STORAGE_BUCKET');
    if (!config.messagingSenderId) missingVars.push('VITE_FIREBASE_MESSAGING_SENDER_ID');
    if (!config.appId) missingVars.push('VITE_FIREBASE_APP_ID');

    if (missingVars.length > 0) {
      const errorMsg = `Firebase configuration incomplete. Missing: ${missingVars.join(', ')}`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    logger.info('Initializing Firebase with config', {
      projectId: config.projectId,
      authDomain: config.authDomain
    });

    app = initializeApp(config);
    db = getFirestore(app);

    logger.info('Firestore initialized successfully');

    try {
      const analyticsSupported = await isSupported();
      if (analyticsSupported && config.measurementId) {
        analytics = getAnalytics(app);
        logger.info('Firebase Analytics initialized successfully');
      }
    } catch (analyticsError) {
      logger.debug('Firebase Analytics blocked or unavailable (this is normal with ad-blockers)', { analyticsError });
    }

    logger.info('Firebase initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Firebase', { error });
    throw error;
  }
};

export const getDb = (): Firestore => {
  if (!db) {
    throw new Error('Firestore not initialized. Call initializeFirebase first.');
  }
  return db;
};

export const getAnalyticsInstance = (): Analytics | null => {
  return analytics;
};
