import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { getDb } from './firebase';
import type { Note } from '../types';
import { logger } from '../utils/logger';
import { encrypt, decrypt } from './cryptoService';

const COLLECTION_NAME = 'notes';

export const createNote = async (id: string, content: string = ''): Promise<void> => {
  try {
    const db = getDb();
    const noteRef = doc(db, COLLECTION_NAME, id);

    const encryptedContent = await encrypt(content);

    const noteData = {
      id,
      content: encryptedContent,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(noteRef, noteData);
    logger.info('Note created', { id });
  } catch (error) {
    logger.error('Failed to create note', { id, error });
    throw error;
  }
};

export const getNote = async (id: string): Promise<Note | null> => {
  try {
    const db = getDb();
    const noteRef = doc(db, COLLECTION_NAME, id);
    const noteSnap = await getDoc(noteRef);

    if (!noteSnap.exists()) {
      logger.info('Note not found', { id });
      return null;
    }

    const data = noteSnap.data();
    const decryptedContent = await decrypt(data.content || '');

    return {
      id: data.id,
      content: decryptedContent,
      createdAt: data.createdAt?.toMillis() || Date.now(),
      updatedAt: data.updatedAt?.toMillis() || Date.now()
    };
  } catch (error) {
    logger.error('Failed to get note', { id, error });
    throw error;
  }
};

export const updateNote = async (id: string, content: string): Promise<void> => {
  try {
    const db = getDb();
    const noteRef = doc(db, COLLECTION_NAME, id);

    const encryptedContent = await encrypt(content);

    await updateDoc(noteRef, {
      content: encryptedContent,
      updatedAt: serverTimestamp()
    });

    logger.debug('Note updated', { id });
  } catch (error) {
    logger.error('Failed to update note', { id, error });
    throw error;
  }
};

export const subscribeToNote = (
  id: string,
  onUpdate: (note: Note) => void,
  onError: (error: Error) => void
): Unsubscribe => {
  try {
    const db = getDb();
    const noteRef = doc(db, COLLECTION_NAME, id);

    return onSnapshot(
      noteRef,
      async (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const decryptedContent = await decrypt(data.content || '');
          const note: Note = {
            id: data.id,
            content: decryptedContent,
            createdAt: data.createdAt?.toMillis() || Date.now(),
            updatedAt: data.updatedAt?.toMillis() || Date.now()
          };
          onUpdate(note);
        }
      },
      (error) => {
        logger.error('Snapshot listener error', { id, error });
        onError(error as Error);
      }
    );
  } catch (error) {
    logger.error('Failed to subscribe to note', { id, error });
    throw error;
  }
};
