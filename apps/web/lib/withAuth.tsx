"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export interface WithAuthOptions {
  requireAdmin?: boolean;
  redirectTo?: string;
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const {
    requireAdmin = true,
    redirectTo = '/auth/signin'
  } = options;

  return function AuthenticatedComponent(props: P) {
    const { state } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!state.loading) {
        // If no user or token, redirect to login
        if (!state.user || !state.token) {
          router.push(redirectTo);
          return;
        }

        // If admin required but user is not admin, redirect to login
        if (requireAdmin && state.user.role !== 'ADMIN') {
          router.push(redirectTo);
          return;
        }
      }
    }, [state.loading, state.user, state.token, router]);

    // Show loading while checking authentication
    if (state.loading) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-6"></div>
            <div className="text-white text-xl">Authenticating...</div>
          </div>
        </div>
      );
    }

    // Don't render component if user is not authenticated
    if (!state.user || !state.token) {
      return null;
    }

    // Don't render component if admin required but user is not admin
    if (requireAdmin && state.user.role !== 'ADMIN') {
      return null;
    }

    // Render the protected component
    return <Component {...props} />;
  };
}
