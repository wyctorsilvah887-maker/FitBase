'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

/**
 * Inicializa os serviços do Firebase de forma idempotente no lado do cliente.
 * Prioriza a configuração explícita para evitar divergências de projeto.
 */
export function initializeFirebase() {
  if (!getApps().length) {
    let firebaseApp;
    try {
      // Prioriza a configuração explícita do studio para garantir o ID do projeto correto
      firebaseApp = initializeApp(firebaseConfig);
    } catch (e) {
      // Fallback para variáveis de ambiente do Firebase Hosting se necessário
      console.warn('Explicit initialization failed, attempting automatic...', e);
      firebaseApp = initializeApp();
    }
    return getSdks(firebaseApp);
  }

  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
