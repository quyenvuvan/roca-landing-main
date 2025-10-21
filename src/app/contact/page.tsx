"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ContactRedirect() {
  const router = useRouter();
  useEffect(() => {
    // Use replace so the user doesn't keep /contact in history
    router.replace('/#contact');
  }, [router]);
  return null;
}
