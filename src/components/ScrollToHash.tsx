"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ScrollToHash() {
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
