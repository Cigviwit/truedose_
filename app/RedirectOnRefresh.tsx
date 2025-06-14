'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RedirectOnRefresh({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect if not on landing or game page
    if (pathname !== '/landing' && pathname !== '/game' && pathname !== '/how-to-play' && pathname !== '/practice') {
      router.replace('/landing');
    }
  }, [pathname, router]);

  return <>{children}</>;
} 