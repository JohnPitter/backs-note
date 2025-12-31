import { useState, useEffect, useCallback, useRef } from 'react';
import type { Note } from '../types';
import { createNote, getNote, updateNote, subscribeToNote } from '../services/noteService';
import { cacheService } from '../services/cacheService';
import { logger } from '../utils/logger';

interface UseNoteReturn {
  note: Note | null;
  loading: boolean;
  error: string | null;
  updateContent: (content: string) => Promise<void>;
  createNewNote: (id: string) => Promise<void>;
}

const DEBOUNCE_DELAY = 500;

export const useNote = (noteId: string | null): UseNoteReturn => {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const createNewNote = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await createNote(id);
      logger.info('New note created successfully', { id });
    } catch (err) {
      const message = 'Erro ao criar nota';
      setError(message);
      logger.error(message, { error: err });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateContent = useCallback(async (content: string) => {
    if (!noteId) return;

    setNote(prev => prev ? { ...prev, content } : null);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        await updateNote(noteId, content);
      } catch (err) {
        const message = 'Erro ao salvar nota';
        setError(message);
        logger.error(message, { error: err });
      }
    }, DEBOUNCE_DELAY);
  }, [noteId]);

  useEffect(() => {
    if (!noteId) {
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | null = null;

    const initializeNote = async () => {
      try {
        setLoading(true);
        setError(null);

        const cachedNote = cacheService.getNote(noteId);
        if (cachedNote) {
          setNote(cachedNote);
          setLoading(false);
        }

        const existingNote = await getNote(noteId);

        if (!existingNote) {
          await createNote(noteId);
        }

        unsubscribe = subscribeToNote(
          noteId,
          (updatedNote) => {
            setNote(updatedNote);
            cacheService.saveNote(noteId, updatedNote);
            setLoading(false);
          },
          (err) => {
            setError('Erro ao sincronizar nota');
            setLoading(false);
            logger.error('Subscription error', { error: err });
          }
        );
      } catch (err) {
        setError('Erro ao carregar nota');
        setLoading(false);
        logger.error('Failed to initialize note', { error: err });
      }
    };

    initializeNote();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [noteId]);

  return {
    note,
    loading,
    error,
    updateContent,
    createNewNote
  };
};
