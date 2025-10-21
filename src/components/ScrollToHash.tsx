"use client";

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function ScrollToHashInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // After navigation, if there's a hash (fragment) in the URL, scroll to it.
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        // Use scrollIntoView with smooth behavior.
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [pathname, searchParams]);

  return null;
}

export default function ScrollToHash() {
  return (
    <Suspense fallback={null}>
      <ScrollToHashInner />
    </Suspense>
  );
}
