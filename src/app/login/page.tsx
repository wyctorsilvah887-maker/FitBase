"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useAuth, useUser } from "@/firebase";
import { LpThemeToggle } from "@/components/landing/LpThemeToggle";
import { LoginPanel } from "@/components/auth/LoginPanel";
import {
  RESET_SENT_MESSAGE,
  loginErrorMessage,
  resetErrorMessage,
  validateLogin,
  validateResetEmail,
} from "@/lib/login-validation";
import type { LoginField } from "@/lib/login-validation";
import "@/components/landing/landing.css";
import "@/components/auth/auth.css";

const FIELD_IDS: Record<LoginField, string> = { email: "login-email", password: "login-password" };
const FIELD_ORDER: LoginField[] = ["email", "password"];

function Icon({ children, size = 16 }: { children: ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p className="lp-error" id={id} role="alert">
      <Icon>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5v5.5M12 16.5h.01" />
      </Icon>
      <span>{children}</span>
    </p>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [attempted, setAttempted] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<LoginField, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<Partial<Record<LoginField, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && !isSubmitting) router.replace("/members");
  }, [user, isSubmitting, router]);

  const errors = useMemo(() => validateLogin({ email, password }), [email, password]);
  const errorFor = (field: LoginField) =>
    serverErrors[field] ?? (touched[field] || attempted ? errors[field] : undefined);

  const touch = (field: LoginField) => setTouched((t) => ({ ...t, [field]: true }));
  const focusField = (field: LoginField) => document.getElementById(FIELD_IDS[field])?.focus();
  const clearMessages = (field: LoginField) => {
    setFormError(null);
    setNotice(null);
    setServerErrors((s) => (s[field] ? { ...s, [field]: undefined } : s));
  };

  const busy = isSubmitting || isSendingReset;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setAttempted(true);
    setFormError(null);
    setNotice(null);

    const firstInvalid = FIELD_ORDER.find((f) => errors[f]);
    if (firstInvalid) {
      focusField(firstInvalid);
      return;
    }

    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push("/members");
    } catch (error: any) {
      const { field, message } = loginErrorMessage(error?.code);
      if (field === "email") setServerErrors({ email: message });
      else setFormError(message);
      setIsSubmitting(false);
      // Os campos ficam desabilitados durante o envio; só dá para focar depois de reabilitar.
      requestAnimationFrame(() => focusField(field ?? "password"));
    }
  };

  const handleReset = async () => {
    if (busy) return;
    setFormError(null);
    setNotice(null);

    const problem = validateResetEmail(email);
    if (problem) {
      setServerErrors({ email: problem });
      focusField("email");
      return;
    }

    setIsSendingReset(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setNotice(RESET_SENT_MESSAGE);
    } catch (error: any) {
      setFormError(resetErrorMessage(error?.code));
    } finally {
      setIsSendingReset(false);
    }
  };

  const emailError = errorFor("email");
  const passwordError = errorFor("password");

  return (
    <div className="lp">
      <div className="lp-auth">
        <LoginPanel />

        <div className="lp-auth-main">
          <div className="lp-auth-top">
            <Link href="/" className="lp-logo-link" aria-label="FitBase, página inicial">
              <span className="lp-logo" role="img" aria-label="FitBase" />
            </Link>
            <div className="lp-auth-top-right">
              <span>Novo por aqui?</span>
              <Link href="/register">Criar conta</Link>
              <LpThemeToggle />
            </div>
          </div>

          <main className="lp-auth-wrap">
            <h1 className="lp-auth-title">Entrar no FitBase</h1>
            <p className="lp-auth-sub">Use o e-mail e a senha da sua academia.</p>

            <form className="lp-form" onSubmit={handleSubmit} noValidate>
              {formError && (
                <div className="lp-alert" role="alert">
                  <Icon size={18}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7.5v5.5M12 16.5h.01" />
                  </Icon>
                  <span>{formError}</span>
                </div>
              )}
              {notice && (
                <div className="lp-alert lp-alert--ok" role="status">
                  <Icon size={18}>
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </Icon>
                  <span>{notice}</span>
                </div>
              )}

              <div>
                <label className="lp-label" htmlFor={FIELD_IDS.email}>
                  E-mail
                </label>
                <input
                  id={FIELD_IDS.email}
                  className="lp-input"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="voce@suaacademia.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearMessages("email");
                  }}
                  onBlur={() => touch("email")}
                  disabled={busy}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "err-email" : undefined}
                />
                {emailError && <ErrorText id="err-email">{emailError}</ErrorText>}
              </div>

              <div>
                <div className="lp-label-row">
                  <label className="lp-label" htmlFor={FIELD_IDS.password}>
                    Senha
                  </label>
                  <button type="button" className="lp-text-btn" onClick={handleReset} disabled={busy}>
                    {isSendingReset ? "Enviando link" : "Esqueci a senha"}
                  </button>
                </div>
                <div className="lp-input-wrap">
                  <input
                    id={FIELD_IDS.password}
                    className="lp-input lp-input--pw"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearMessages("password");
                    }}
                    onBlur={() => touch("password")}
                    disabled={busy}
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? "err-pw" : undefined}
                  />
                  <button
                    type="button"
                    className="lp-eye"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={busy}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 3l18 18" />
                        <path d="M10.6 6.2A9.8 9.8 0 0112 6c5 0 8.5 4 9.5 6a12 12 0 01-2.7 3.4M6.5 7.6A12 12 0 002.5 12c1 2 4.5 6 9.5 6 1.5 0 2.8-.3 4-.9" />
                        <path d="M9.9 10a3 3 0 004.1 4.1" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M2.5 12C3.5 10 7 6 12 6s8.5 4 9.5 6c-1 2-4.5 6-9.5 6S3.5 14 2.5 12z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {passwordError && <ErrorText id="err-pw">{passwordError}</ErrorText>}
              </div>

              <button type="submit" className="lp-btn lp-btn-primary lp-submit" disabled={busy}>
                {isSubmitting ? (
                  <>
                    <span className="lp-spinner" aria-hidden="true" />
                    Entrando
                  </>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>

            <p className="lp-auth-foot">
              Ainda não tem conta? <Link href="/register">Criar conta grátis</Link>
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}
