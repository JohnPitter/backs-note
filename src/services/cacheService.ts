import type { Note } from '../types';
import { logger } from '../utils/logger';

const CACHE_PREFIX = 'backs-note-cache-';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class CacheService {
  private isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private getCacheKey(noteId: string): string {
    return `${CACHE_PREFIX}${noteId}`;
  }

  private isExpired(timestamp: number): boolean {
    return Date.now() - timestamp > CACHE_EXPIRY;
  }

  saveNote(noteId: string, note: Note): void {
    if (!this.isStorageAvailable()) {
      logger.warn('LocalStorage not available, skipping cache');
      return;
    }

    try {
      const cacheEntry: CacheEntry<Note> = {
        data: note,
        timestamp: Date.now()
      };

      localStorage.setItem(
        this.getCacheKey(noteId),
        JSON.stringify(cacheEntry)
      );

      logger.debug('Note cached successfully', { noteId });
    } catch (error) {
      logger.error('Failed to cache note', { noteId, error });
    }
  }

  getNote(noteId: string): Note | null {
    if (!this.isStorageAvailable()) {
      return null;
    }

    try {
      const cached = localStorage.getItem(this.getCacheKey(noteId));

      if (!cached) {
        return null;
      }

      const cacheEntry: CacheEntry<Note> = JSON.parse(cached);

      if (this.isExpired(cacheEntry.timestamp)) {
        this.clearNote(noteId);
        logger.debug('Cached note expired', { noteId });
        return null;
      }

      logger.debug('Note retrieved from cache', { noteId });
      return cacheEntry.data;
    } catch (error) {
      logger.error('Failed to retrieve cached note', { noteId, error });
      return null;
    }
  }

  clearNote(noteId: string): void {
    if (!this.isStorageAvailable()) {
      return;
    }

    try {
      localStorage.removeItem(this.getCacheKey(noteId));
      logger.debug('Note cache cleared', { noteId });
    } catch (error) {
      logger.error('Failed to clear note cache', { noteId, error });
    }
  }

  clearAll(): void {
    if (!this.isStorageAvailable()) {
      return;
    }

    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));

      cacheKeys.forEach(key => localStorage.removeItem(key));

      logger.info('All note caches cleared', { count: cacheKeys.length });
    } catch (error) {
      logger.error('Failed to clear all caches', { error });
    }
  }

  clearExpired(): void {
    if (!this.isStorageAvailable()) {
      return;
    }

    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      let clearedCount = 0;

      cacheKeys.forEach(key => {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const cacheEntry: CacheEntry<Note> = JSON.parse(cached);
            if (this.isExpired(cacheEntry.timestamp)) {
              localStorage.removeItem(key);
              clearedCount++;
            }
          }
        } catch {
          localStorage.removeItem(key);
          clearedCount++;
        }
      });

      logger.info('Expired caches cleared', { count: clearedCount });
    } catch (error) {
      logger.error('Failed to clear expired caches', { error });
    }
  }
}

export const cacheService = new CacheService();
