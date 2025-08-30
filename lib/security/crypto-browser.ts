// Browser-compatible crypto utilities
// This replaces Node.js crypto module for browser use

// Generate random bytes using Web Crypto API
export const randomBytes = (size: number): Uint8Array => {
  const array = new Uint8Array(size);
  crypto.getRandomValues(array);
  return array;
};

// Convert Uint8Array to hex string
export const toHex = (bytes: Uint8Array): string => {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Generate random hex string
export const randomHex = (size: number): string => {
  return toHex(randomBytes(size));
};

// Simple hash function for browser compatibility
export const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(16);
};
