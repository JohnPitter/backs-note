import { describe, it, expect } from 'vitest';
import { generateNoteId, isValidNoteId } from './idGenerator';

describe('idGenerator', () => {
  describe('generateNoteId', () => {
    it('should generate an ID of length 10', () => {
      const id = generateNoteId();
      expect(id).toHaveLength(10);
    });

    it('should generate unique IDs', () => {
      const id1 = generateNoteId();
      const id2 = generateNoteId();
      expect(id1).not.toBe(id2);
    });

    it('should generate valid IDs', () => {
      const id = generateNoteId();
      expect(isValidNoteId(id)).toBe(true);
    });
  });

  describe('isValidNoteId', () => {
    it('should validate correct IDs', () => {
      expect(isValidNoteId('abcd123456')).toBe(true);
      expect(isValidNoteId('ABCD123456')).toBe(true);
      expect(isValidNoteId('aB-_123456')).toBe(true);
    });

    it('should reject invalid IDs', () => {
      expect(isValidNoteId('')).toBe(false);
      expect(isValidNoteId('short')).toBe(false);
      expect(isValidNoteId('toolongid123')).toBe(false);
      expect(isValidNoteId('invalid!@#')).toBe(false);
      expect(isValidNoteId('no spaces!')).toBe(false);
    });
  });
});
