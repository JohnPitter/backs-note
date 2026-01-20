import { useState, useCallback } from 'react';
import {
  createAlias as createAliasService,
  verifyAliasPin,
  getAliasesForNote,
  aliasExists
} from '../services/aliasService';
import type { AliasVerifyResult } from '../types';
import { logger } from '../utils/logger';

interface UseAliasReturn {
  loading: boolean;
  error: string | null;
  aliases: string[];
  createAlias: (alias: string, noteId: string, pin: string) => Promise<boolean>;
  verifyAlias: (alias: string, pin: string) => Promise<AliasVerifyResult>;
  checkAliasExists: (alias: string) => Promise<boolean>;
  loadAliasesForNote: (noteId: string) => Promise<void>;
  clearError: () => void;
}

export const useAlias = (): UseAliasReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aliases, setAliases] = useState<string[]>([]);

  const createAlias = useCallback(async (
    alias: string,
    noteId: string,
    pin: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await createAliasService(alias, noteId, pin);
      logger.info('Alias created successfully', { alias, noteId });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar alias.';
      setError(message);
      logger.error('Failed to create alias', { alias, noteId, error: err });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyAlias = useCallback(async (
    alias: string,
    pin: string
  ): Promise<AliasVerifyResult> => {
    setLoading(true);
    setError(null);

    try {
      const result = await verifyAliasPin(alias, pin);

      if (!result.success && result.error) {
        setError(result.error);
      }

      return result;
    } catch (err) {
      const message = 'Erro ao verificar alias.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAliasExists = useCallback(async (alias: string): Promise<boolean> => {
    try {
      return await aliasExists(alias);
    } catch (err) {
      logger.error('Failed to check alias existence', { alias, error: err });
      return false;
    }
  }, []);

  const loadAliasesForNote = useCallback(async (noteId: string): Promise<void> => {
    setLoading(true);

    try {
      const noteAliases = await getAliasesForNote(noteId);
      setAliases(noteAliases);
    } catch (err) {
      logger.error('Failed to load aliases for note', { noteId, error: err });
      setAliases([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    aliases,
    createAlias,
    verifyAlias,
    checkAliasExists,
    loadAliasesForNote,
    clearError
  };
};
