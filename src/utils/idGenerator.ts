import { nanoid } from 'nanoid';

export const generateNoteId = (): string => {
  return nanoid(10);
};

export const isValidNoteId = (id: string): boolean => {
  return /^[A-Za-z0-9_-]{10}$/.test(id);
};
