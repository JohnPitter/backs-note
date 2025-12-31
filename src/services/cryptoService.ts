import { logger } from '../utils/logger';

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const TAG_LENGTH = 128;

let cachedKey: CryptoKey | null = null;

const getEncryptionKey = (): string => {
  const key = import.meta.env.VITE_ENCRYPTION_KEY;
  if (!key) {
    throw new Error('VITE_ENCRYPTION_KEY is not configured');
  }
  return key;
};

const hexToUint8Array = (hex: string): Uint8Array => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
};

const arrayBufferToHex = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const base64ToUint8Array = (base64: string): Uint8Array => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const importKey = async (): Promise<CryptoKey> => {
  if (cachedKey) {
    return cachedKey;
  }

  const keyHex = getEncryptionKey();

  if (keyHex.length !== 64) {
    throw new Error('Encryption key must be 64 hex characters (256 bits)');
  }

  const keyBytes = hexToUint8Array(keyHex);

  cachedKey = await crypto.subtle.importKey(
    'raw',
    keyBytes as BufferSource,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );

  return cachedKey;
};

export const encrypt = async (plaintext: string): Promise<string> => {
  if (!plaintext) {
    return '';
  }

  try {
    const key = await importKey();
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv,
        tagLength: TAG_LENGTH
      },
      key,
      data
    );

    const ivBase64 = uint8ArrayToBase64(iv);
    const encryptedBase64 = uint8ArrayToBase64(new Uint8Array(encryptedBuffer));

    const result = `${ivBase64}:${encryptedBase64}`;

    logger.debug('Content encrypted successfully', {
      plaintextLength: plaintext.length,
      encryptedLength: result.length
    });

    return result;
  } catch (error) {
    logger.error('Failed to encrypt content', { error });
    throw new Error('Encryption failed');
  }
};

export const decrypt = async (ciphertext: string): Promise<string> => {
  if (!ciphertext) {
    return '';
  }

  try {
    const [ivBase64, encryptedBase64] = ciphertext.split(':');

    if (!ivBase64 || !encryptedBase64) {
      logger.warn('Invalid ciphertext format, returning as-is (possibly unencrypted legacy data)');
      return ciphertext;
    }

    const key = await importKey();
    const iv = base64ToUint8Array(ivBase64);
    const encryptedBuffer = base64ToUint8Array(encryptedBase64);

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: iv as Uint8Array<ArrayBuffer>,
        tagLength: TAG_LENGTH
      },
      key,
      encryptedBuffer as BufferSource
    );

    const decoder = new TextDecoder();
    const plaintext = decoder.decode(decryptedBuffer);

    logger.debug('Content decrypted successfully', {
      ciphertextLength: ciphertext.length,
      plaintextLength: plaintext.length
    });

    return plaintext;
  } catch (error) {
    logger.error('Failed to decrypt content', { error });
    logger.warn('Returning ciphertext as-is (possibly unencrypted legacy data)');
    return ciphertext;
  }
};

export const generateEncryptionKey = (): string => {
  const keyBytes = crypto.getRandomValues(new Uint8Array(KEY_LENGTH / 8));
  return arrayBufferToHex(keyBytes.buffer);
};

export const isEncrypted = (content: string): boolean => {
  if (!content) return false;
  const parts = content.split(':');
  if (parts.length !== 2) return false;

  try {
    const ivBytes = base64ToUint8Array(parts[0]);
    return ivBytes.length === IV_LENGTH;
  } catch {
    return false;
  }
};
