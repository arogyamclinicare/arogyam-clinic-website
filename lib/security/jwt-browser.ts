// Browser-compatible JWT implementation
// This replaces the Node.js jsonwebtoken library for browser use

// Base64 URL encoding/decoding
const base64UrlEncode = (str: string): string => {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

const base64UrlDecode = (str: string): string => {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return atob(str);
};

// Browser-compatible JWT utilities
export class JWTUtils {
  private static readonly JWT_SECRET = import.meta.env.VITE_JWT_SECRET;
  private static readonly REFRESH_SECRET = import.meta.env.VITE_JWT_REFRESH_SECRET;

  /**
   * Generate JWT token (simplified for browser)
   */
  static generateToken(payload: any, secret: string, options: { expiresIn?: string } = {
    // Empty block
  }): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const exp = options.expiresIn ? 
      (options.expiresIn === '30m' ? now + 1800 : 
       options.expiresIn === '7d' ? now + 604800 : now + 3600) : 
      now + 3600;

    const data = {
      ...payload,
      iat: now,
      exp: exp,
      issuer: 'arogyam-clinic',
      audience: 'arogyam-users'
    };

    const headerB64 = base64UrlEncode(JSON.stringify(header));
    const payloadB64 = base64UrlEncode(JSON.stringify(data));
    
    // For browser compatibility, we'll create a simple token without signature
    // In production, you should use a proper backend for JWT signing
    return `${headerB64}.${payloadB64}.${this.generateSimpleSignature(secret, `${headerB64}.${payloadB64}`)}`;
  }

  /**
   * Generate access token
   */
  static generateAccessToken(payload: any): string {
    return this.generateToken(payload, this.JWT_SECRET, { expiresIn: '30m' });
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(payload: any): string {
    return this.generateToken(payload, this.REFRESH_SECRET, { expiresIn: '7d' });
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string, secret: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const [headerB64, payloadB64, signature] = parts;
      
      // Verify signature (simplified for browser)
      const expectedSignature = this.generateSimpleSignature(secret, `${headerB64}.${payloadB64}`);
      if (signature !== expectedSignature) {
        throw new Error('Invalid signature');
      }

      // Decode payload
      const payload = JSON.parse(base64UrlDecode(payloadB64));
      
      // Check expiration
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token expired');
      }

      return payload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): any {
    return this.verifyToken(token, this.JWT_SECRET);
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): any {
    return this.verifyToken(token, this.REFRESH_SECRET);
  }

  /**
   * Decode token without verification
   */
  static decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const payloadB64 = parts[1];
      return JSON.parse(base64UrlDecode(payloadB64));
    } catch (error) {
      throw new Error('Invalid token format');
    }
  }

  /**
   * Generate simple signature for browser compatibility
   */
  private static generateSimpleSignature(secret: string, data: string): string {
    // Simple hash function for browser compatibility
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Combine with secret
    let secretHash = 0;
    for (let i = 0; i < secret.length; i++) {
      const char = secret.charCodeAt(i);
      secretHash = ((secretHash << 5) - secretHash) + char;
      secretHash = secretHash & secretHash;
    }
    
    const combined = (hash + secretHash).toString(16);
    return base64UrlEncode(combined);
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      if (!payload.exp) return false;
      
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch {
      return true;
    }
  }

  /**
   * Get token expiration time
   */
  static getTokenExpiration(token: string): number | null {
    try {
      const payload = this.decodeToken(token);
      return payload.exp || null;
    } catch {
      return null;
    }
  }

  /**
   * Get time until token expires (in seconds)
   */
  static getTimeUntilExpiration(token: string): number {
    try {
      const payload = this.decodeToken(token);
      if (!payload.exp) return 0;
      
      const now = Math.floor(Date.now() / 1000);
      return Math.max(0, payload.exp - now);
    } catch {
      return 0;
    }
  }
}
