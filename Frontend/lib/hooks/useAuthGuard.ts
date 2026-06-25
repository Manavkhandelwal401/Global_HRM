// lib/hooks/useAuthGuard.ts
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext';

/**
 * Hook to protect client-side routes.
 * If the user is not authenticated, redirects to /login with a `next` query
 * parameter pointing to the current pathname.
 */
export function useAuthGuard() {
  const router = useRouter();
  const { isAuthenticated, user } = useSession();

  useEffect(() => {
    const disableAuth = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';
    if (disableAuth) return;
    if (!isAuthenticated) {
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, router, user]);
}
