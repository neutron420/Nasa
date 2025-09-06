import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

export interface ValidationResult {
  valid: boolean;
  payload?: JwtPayload;
  error?: string;
}

export function validateToken(token: string): ValidationResult {
  try {
    if (!token) {
      return { valid: false, error: 'No token provided' };
    }

    const decoded = jwtDecode<JwtPayload>(token);
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return { valid: false, error: 'Token expired' };
    }

    return { valid: true, payload: decoded };
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : 'Invalid token' 
    };
  }
}

export function isTokenExpiring(token: string, bufferMinutes: number = 5): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const now = Math.floor(Date.now() / 1000);
    const expirationBuffer = bufferMinutes * 60;
    
    return decoded.exp ? (decoded.exp - now) < expirationBuffer : false;
  } catch {
    return true; // Treat invalid tokens as expiring
  }
}

export function getTokenPayload(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}
