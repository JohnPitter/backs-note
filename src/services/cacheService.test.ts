import { describe, it, expect, beforeEach } from 'vitest';
import { cacheService } from './cacheService';
import type { Note } from '../types';

describe('CacheService', () => {
  const mockNote: Note = {
    id: 'test123',
    content: 'Test content',
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveNote', () => {
    it('should save note to localStorage', () => {
      cacheService.saveNote(mockNote.id, mockNote);
      const cached = cacheService.getNote(mockNote.id);
      expect(cached).toEqual(mockNote);
    });
  });

  describe('getNote', () => {
    it('should return null for non-existent note', () => {
      const cached = cacheService.getNote('nonexistent');
      expect(cached).toBeNull();
    });

    it('should return cached note', () => {
      cacheService.saveNote(mockNote.id, mockNote);
      const cached = cacheService.getNote(mockNote.id);
      expect(cached).toEqual(mockNote);
    });
  });

  describe('clearNote', () => {
    it('should clear specific note from cache', () => {
      cacheService.saveNote(mockNote.id, mockNote);
      cacheService.clearNote(mockNote.id);
      const cached = cacheService.getNote(mockNote.id);
      expect(cached).toBeNull();
    });
  });

  describe('clearAll', () => {
    it('should clear all cached notes', () => {
      const note1 = { ...mockNote, id: 'note1' };
      const note2 = { ...mockNote, id: 'note2' };

      cacheService.saveNote(note1.id, note1);
      cacheService.saveNote(note2.id, note2);

      cacheService.clearAll();

      expect(cacheService.getNote(note1.id)).toBeNull();
      expect(cacheService.getNote(note2.id)).toBeNull();
    });
  });
});
