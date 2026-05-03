'use client';

import React, { useMemo } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const firebase = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider value={firebase}>
      {children}
    </FirebaseProvider>
  );
}
