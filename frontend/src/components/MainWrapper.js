'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function MainWrapper({ children }) {
  const pathname = usePathname();
  const isDashboardRole = pathname?.startsWith('/seller') || pathname?.startsWith('/driver') || pathname?.startsWith('/admin');

  if (isDashboardRole) {
    return <main className="flex-1 flex flex-col w-full">{children}</main>;
  }

  return (
    <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
      {children}
    </main>
  );
}
