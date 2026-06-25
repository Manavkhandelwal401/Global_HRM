'use client';

import { useSession } from '../context/SessionContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Root page — immediately redirects to /dashboard (authenticated)
 * or /login (unauthenticated). No content is rendered here.
 */
export default function RootPage() {
  const { user } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [user, router]);

  return null;
}
