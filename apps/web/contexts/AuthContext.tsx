"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { validateToken, JwtPayload } from '@/lib/jwt';

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export type AuthAction =
  | { type: 'INIT_START' }
  | { type: 'INIT_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'INIT_ERROR'; payload: string }
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  loading: true,
  error: null,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'INIT_START':
      return { ...state, loading: true, error: null };
    
    case 'INIT_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };
    
    case 'INIT_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: action.payload,
      };
    
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };
    
    case 'LOGIN_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: action.payload,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null,
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
}

// Context
const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  refreshUser: () => Promise<void>;
} | null>(null);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        dispatch({ type: 'INIT_START' });
        
        // Check if we're in the browser
        if (typeof window === 'undefined') {
          dispatch({ type: 'INIT_ERROR', payload: 'Server-side rendering' });
          return;
        }
        
        const token = localStorage.getItem('token');
        if (!token) {
          dispatch({ type: 'INIT_ERROR', payload: 'No token found' });
          return;
        }

        const validation = validateToken(token);
        if (!validation.valid || !validation.payload) {
          localStorage.removeItem('token');
          dispatch({ type: 'INIT_ERROR', payload: validation.error || 'Invalid token' });
          return;
        }

        // Fetch fresh user data from API
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        const response = await fetch(`${API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem('token');
          dispatch({ type: 'INIT_ERROR', payload: 'Failed to fetch user profile' });
          return;
        }

        const user = await response.json();
        dispatch({ type: 'INIT_SUCCESS', payload: { user, token } });
      } catch (error) {
        localStorage.removeItem('token');
        dispatch({ 
          type: 'INIT_ERROR', 
          payload: error instanceof Error ? error.message : 'Initialization failed' 
        });
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log('🔐 Starting login process...');
      dispatch({ type: 'LOGIN_START' });
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      console.log('🌐 API URL:', API_URL);
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('📡 Login response:', response.status, response.ok);

      if (!response.ok) {
        console.error('❌ Login failed:', data);
        throw new Error(data.error || 'Login failed');
      }

      console.log('✅ Login successful, validating token...');
      // Validate token
      const validation = validateToken(data.token);
      if (!validation.valid || !validation.payload) {
        console.error('❌ Token validation failed:', validation);
        throw new Error('Received invalid token from server');
      }

      console.log('🔑 Token valid, storing and fetching profile...');
      // Store token
      localStorage.setItem('token', data.token);

      // Fetch user profile
      const profileResponse = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      if (!profileResponse.ok) {
        console.error('❌ Profile fetch failed:', profileResponse.status);
        throw new Error('Failed to fetch user profile after login');
      }

      const user = await profileResponse.json();
      console.log('👤 User profile fetched:', user);
      console.log('🎉 Dispatching LOGIN_SUCCESS...');
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: data.token } });
      console.log('✅ Login process complete!');
    } catch (error) {
      console.error('💥 Login error:', error);
      dispatch({ 
        type: 'LOGIN_ERROR', 
        payload: error instanceof Error ? error.message : 'Login failed' 
      });
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('adminCategory');
    }
    dispatch({ type: 'LOGOUT' });
  };

  // Clear error function (memoized to prevent infinite loops)
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    try {
      if (typeof window === 'undefined') {
        return;
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        logout();
        return;
      }

      const validation = validateToken(token);
      if (!validation.valid) {
        logout();
        return;
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        logout();
        return;
      }

      const user = await response.json();
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    } catch (error) {
      logout();
    }
  };

  const value = {
    state,
    login,
    logout,
    clearError,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
