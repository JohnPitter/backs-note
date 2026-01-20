export interface Note {
  id: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export interface AliasDocument {
  alias: string;
  noteId: string;
  pinHash: string;
  pinSalt: string;
  failedAttempts: number;
  lastFailedAttempt: number | null;
  createdAt: number;
}

export interface AliasVerifyResult {
  success: boolean;
  noteId?: string;
  error?: string;
  remainingAttempts?: number;
  lockoutUntil?: number;
}
