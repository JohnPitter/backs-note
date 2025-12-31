import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const TEST_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

describe('CryptoService', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_ENCRYPTION_KEY', TEST_KEY);
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  describe('encrypt', () => {
    it('should return empty string for empty input', async () => {
      const { encrypt } = await import('./cryptoService');
      const result = await encrypt('');
      expect(result).toBe('');
    });

    it('should encrypt content and return iv:ciphertext format', async () => {
      const { encrypt } = await import('./cryptoService');
      const plaintext = 'Hello, World!';
      const encrypted = await encrypt(plaintext);

      expect(encrypted).toContain(':');
      const [iv, ciphertext] = encrypted.split(':');
      expect(iv).toBeTruthy();
      expect(ciphertext).toBeTruthy();
    });

    it('should produce different ciphertexts for same plaintext (random IV)', async () => {
      const { encrypt } = await import('./cryptoService');
      const plaintext = 'Hello, World!';

      const encrypted1 = await encrypt(plaintext);
      const encrypted2 = await encrypt(plaintext);

      expect(encrypted1).not.toBe(encrypted2);
    });
  });

  describe('decrypt', () => {
    it('should return empty string for empty input', async () => {
      const { decrypt } = await import('./cryptoService');
      const result = await decrypt('');
      expect(result).toBe('');
    });

    it('should decrypt encrypted content correctly', async () => {
      const { encrypt, decrypt } = await import('./cryptoService');
      const plaintext = 'Hello, World! 123 áéíóú';

      const encrypted = await encrypt(plaintext);
      const decrypted = await decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    it('should handle large content', async () => {
      const { encrypt, decrypt } = await import('./cryptoService');
      const plaintext = 'A'.repeat(100000);

      const encrypted = await encrypt(plaintext);
      const decrypted = await decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    it('should return ciphertext as-is for invalid format (legacy data)', async () => {
      const { decrypt } = await import('./cryptoService');
      const legacyData = 'This is unencrypted legacy data';

      const result = await decrypt(legacyData);

      expect(result).toBe(legacyData);
    });
  });

  describe('generateEncryptionKey', () => {
    it('should generate a 64-character hex string', async () => {
      const { generateEncryptionKey } = await import('./cryptoService');
      const key = generateEncryptionKey();

      expect(key).toHaveLength(64);
      expect(/^[0-9a-f]+$/.test(key)).toBe(true);
    });

    it('should generate unique keys', async () => {
      const { generateEncryptionKey } = await import('./cryptoService');
      const key1 = generateEncryptionKey();
      const key2 = generateEncryptionKey();

      expect(key1).not.toBe(key2);
    });
  });

  describe('isEncrypted', () => {
    it('should return false for empty string', async () => {
      const { isEncrypted } = await import('./cryptoService');
      expect(isEncrypted('')).toBe(false);
    });

    it('should return false for plain text', async () => {
      const { isEncrypted } = await import('./cryptoService');
      expect(isEncrypted('Hello, World!')).toBe(false);
    });

    it('should return true for encrypted content', async () => {
      const { encrypt, isEncrypted } = await import('./cryptoService');
      const encrypted = await encrypt('Hello, World!');

      expect(isEncrypted(encrypted)).toBe(true);
    });

    it('should return false for invalid format with colon', async () => {
      const { isEncrypted } = await import('./cryptoService');
      expect(isEncrypted('not:valid')).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should throw error when encryption key is not configured', async () => {
      vi.unstubAllEnvs();
      vi.stubEnv('VITE_ENCRYPTION_KEY', '');
      vi.resetModules();

      const { encrypt } = await import('./cryptoService');

      await expect(encrypt('test')).rejects.toThrow();
    });

    it('should throw error when encryption key has wrong length', async () => {
      vi.unstubAllEnvs();
      vi.stubEnv('VITE_ENCRYPTION_KEY', 'shortkey');
      vi.resetModules();

      const { encrypt } = await import('./cryptoService');

      await expect(encrypt('test')).rejects.toThrow();
    });
  });
});
