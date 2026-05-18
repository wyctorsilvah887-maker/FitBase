
'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { toast } from '@/hooks/use-toast';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  signInAnonymously(authInstance).catch((error: any) => {
    if (error.code === 'auth/admin-restricted-operation') {
      toast({
        variant: "destructive",
        title: "Acesso de Teste Desativado",
        description: "Por favor, ative o provedor 'Anônimo' no Console do Firebase (Authentication > Sign-in method).",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erro ao entrar como teste",
        description: error.message || "Não foi possível iniciar a sessão anônima.",
      });
    }
  });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  // CRITICAL: Call createUserWithEmailAndPassword directly. Do NOT use 'await createUserWithEmailAndPassword(...)'.
  createUserWithEmailAndPassword(authInstance, email, password).catch((error: any) => {
    toast({
      variant: "destructive",
      title: "Erro no cadastro",
      description: error.message || "Não foi possível criar sua conta.",
    });
  });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  // CRITICAL: Call signInWithEmailAndPassword directly. Do NOT use 'await signInWithEmailAndPassword(...)'.
  signInWithEmailAndPassword(authInstance, email, password).catch((error: any) => {
    toast({
      variant: "destructive",
      title: "Erro no acesso",
      description: "E-mail ou senha incorretos.",
    });
  });
}
