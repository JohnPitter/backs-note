import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  collection,
  where,
  getDocs
} from 'firebase/firestore';
import { getDb } from './firebase';
import { generateSalt, hashPin, verifyPin, isValidAlias, isValidPin, normalizeAlias } from './pinService';
import type { AliasDocument, AliasVerifyResult } from '../types';
import { logger } from '../utils/logger';

const COLLECTION_NAME = 'aliases';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Checks if an alias already exists
 */
export const aliasExists = async (alias: string): Promise<boolean> => {
  try {
    const normalizedAlias = normalizeAlias(alias);
    const db = getDb();
    const aliasRef = doc(db, COLLECTION_NAME, normalizedAlias);
    const aliasSnap = await getDoc(aliasRef);
    return aliasSnap.exists();
  } catch (error) {
    logger.error('Failed to check alias existence', { alias, error });
    throw error;
  }
};

/**
 * Creates a new alias for a note
 */
export const createAlias = async (
  alias: string,
  noteId: string,
  pin: string
): Promise<void> => {
  try {
    // Validate inputs
    const normalizedAlias = normalizeAlias(alias);

    if (!isValidAlias(normalizedAlias)) {
      throw new Error('Alias inválido. Use 3-30 caracteres: letras minúsculas, números e hífens.');
    }

    if (!isValidPin(pin)) {
      throw new Error('PIN inválido. Use 4 a 6 dígitos.');
    }

    // Check if alias already exists
    const exists = await aliasExists(normalizedAlias);
    if (exists) {
      throw new Error('Este alias já está em uso. Escolha outro nome.');
    }

    // Generate salt and hash PIN
    const pinSalt = generateSalt();
    const pinHash = await hashPin(pin, pinSalt);

    const db = getDb();
    const aliasRef = doc(db, COLLECTION_NAME, normalizedAlias);

    const aliasData = {
      alias: normalizedAlias,
      noteId,
      pinHash,
      pinSalt,
      failedAttempts: 0,
      lastFailedAttempt: null,
      createdAt: serverTimestamp()
    };

    await setDoc(aliasRef, aliasData);
    logger.info('Alias created', { alias: normalizedAlias, noteId });
  } catch (error) {
    logger.error('Failed to create alias', { alias, noteId, error });
    throw error;
  }
};

/**
 * Verifies a PIN for an alias and returns the note ID if successful
 */
export const verifyAliasPin = async (
  alias: string,
  pin: string
): Promise<AliasVerifyResult> => {
  try {
    const normalizedAlias = normalizeAlias(alias);
    const db = getDb();
    const aliasRef = doc(db, COLLECTION_NAME, normalizedAlias);
    const aliasSnap = await getDoc(aliasRef);

    if (!aliasSnap.exists()) {
      return {
        success: false,
        error: 'Alias não encontrado.'
      };
    }

    const aliasData = aliasSnap.data() as AliasDocument;
    const now = Date.now();

    // Check for lockout
    if (aliasData.failedAttempts >= MAX_FAILED_ATTEMPTS && aliasData.lastFailedAttempt) {
      const lockoutEndsAt = aliasData.lastFailedAttempt + LOCKOUT_DURATION_MS;
      if (now < lockoutEndsAt) {
        return {
          success: false,
          error: 'Muitas tentativas incorretas. Tente novamente mais tarde.',
          lockoutUntil: lockoutEndsAt,
          remainingAttempts: 0
        };
      }
      // Lockout period expired, reset failed attempts
      await updateDoc(aliasRef, {
        failedAttempts: 0,
        lastFailedAttempt: null
      });
      aliasData.failedAttempts = 0;
    }

    // Reset failed attempts if outside rate limit window
    if (aliasData.lastFailedAttempt && now - aliasData.lastFailedAttempt > RATE_LIMIT_WINDOW_MS) {
      await updateDoc(aliasRef, {
        failedAttempts: 0,
        lastFailedAttempt: null
      });
      aliasData.failedAttempts = 0;
    }

    // Verify PIN
    const isValid = await verifyPin(pin, aliasData.pinSalt, aliasData.pinHash);

    if (isValid) {
      // Reset failed attempts on successful login
      if (aliasData.failedAttempts > 0) {
        await updateDoc(aliasRef, {
          failedAttempts: 0,
          lastFailedAttempt: null
        });
      }

      logger.info('Alias PIN verified successfully', { alias: normalizedAlias });
      return {
        success: true,
        noteId: aliasData.noteId
      };
    }

    // Increment failed attempts
    const newFailedAttempts = aliasData.failedAttempts + 1;
    await updateDoc(aliasRef, {
      failedAttempts: newFailedAttempts,
      lastFailedAttempt: now
    });

    const remainingAttempts = MAX_FAILED_ATTEMPTS - newFailedAttempts;

    logger.warn('Alias PIN verification failed', {
      alias: normalizedAlias,
      failedAttempts: newFailedAttempts,
      remainingAttempts
    });

    if (remainingAttempts <= 0) {
      return {
        success: false,
        error: 'Muitas tentativas incorretas. Bloqueado por 30 minutos.',
        lockoutUntil: now + LOCKOUT_DURATION_MS,
        remainingAttempts: 0
      };
    }

    return {
      success: false,
      error: `PIN incorreto. ${remainingAttempts} tentativa${remainingAttempts !== 1 ? 's' : ''} restante${remainingAttempts !== 1 ? 's' : ''}.`,
      remainingAttempts
    };
  } catch (error) {
    logger.error('Failed to verify alias PIN', { alias, error });
    return {
      success: false,
      error: 'Erro ao verificar PIN. Tente novamente.'
    };
  }
};

/**
 * Gets aliases for a specific note ID
 */
export const getAliasesForNote = async (noteId: string): Promise<string[]> => {
  try {
    const db = getDb();
    const aliasesRef = collection(db, COLLECTION_NAME);
    const q = query(aliasesRef, where('noteId', '==', noteId));
    const querySnapshot = await getDocs(q);

    const aliases: string[] = [];
    querySnapshot.forEach((doc) => {
      aliases.push(doc.data().alias);
    });

    return aliases;
  } catch (error) {
    logger.error('Failed to get aliases for note', { noteId, error });
    return [];
  }
};
