import { logger } from '../utils/logger';

const SALT_LENGTH = 16; // 16 bytes = 32 hex chars

/**
 * Converts ArrayBuffer to hex string
 */
const arrayBufferToHex = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Generates a cryptographically secure random salt
 * @returns 32 character hex string
 */
export const generateSalt = (): string => {
  const saltBytes = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  return arrayBufferToHex(saltBytes.buffer);
};

/**
 * Hashes a PIN with the provided salt using SHA-256
 * @param pin - The PIN to hash (4-6 digits)
 * @param salt - The salt to use (32 hex chars)
 * @returns SHA-256 hash as hex string
 */
export const hashPin = async (pin: string, salt: string): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(salt + pin);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashHex = arrayBufferToHex(hashBuffer);

    logger.debug('PIN hashed successfully');
    return hashHex;
  } catch (error) {
    logger.error('Failed to hash PIN', { error });
    throw new Error('PIN hashing failed');
  }
};

/**
 * Verifies a PIN against a stored hash
 * @param pin - The PIN to verify
 * @param salt - The salt used during hashing
 * @param storedHash - The stored hash to compare against
 * @returns true if PIN matches, false otherwise
 */
export const verifyPin = async (
  pin: string,
  salt: string,
  storedHash: string
): Promise<boolean> => {
  try {
    const computedHash = await hashPin(pin, salt);
    const isValid = computedHash === storedHash;

    logger.debug('PIN verification completed', { isValid });
    return isValid;
  } catch (error) {
    logger.error('Failed to verify PIN', { error });
    return false;
  }
};

/**
 * Validates PIN format (4-6 digits)
 */
export const isValidPin = (pin: string): boolean => {
  return /^\d{4,6}$/.test(pin);
};

/**
 * Validates alias format (3-30 chars, lowercase, alphanumeric with hyphens)
 */
export const isValidAlias = (alias: string): boolean => {
  return /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/.test(alias) || /^[a-z0-9]{3}$/.test(alias);
};

/**
 * Normalizes alias to lowercase
 */
export const normalizeAlias = (alias: string): string => {
  return alias.toLowerCase().trim();
};
