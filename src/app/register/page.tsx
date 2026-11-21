"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp } from "firebase/firestore";
import { useAuth, useUser, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { ThemeToggle } from "@/components/ThemeToggle";
import { RegisterPanel } from "@/components/auth/RegisterPanel";
import {
  authErrorMessage,
  formatCurrencyInput,
  getPasswordLevel,
  parseFee,
  validateRegister,
} from "@/lib/register-validation";
import type { RegisterField } from "@/lib/register-validation";
import "@/components/landing/landing.css";
import "@/components/auth/auth.css";

const FIELD_IDS: Record<RegisterField, string> = {
  gymName: "reg-gym",
  email: "reg-email",
  password: "reg-password",
  fee: "reg-fee",
  terms: "reg-terms",
};
const FIELD_ORDER: RegisterField[] = ["gymName", "email", "password", "fee", "terms"];

const STRENGTH_LABEL = [
  "Use pelo menos 6 caracteres.",
  "Senha simples. Misturar letras e números ajuda.",
  "Boa senha.",
  "Senha forte.",
];

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p className="lp-error" id={id} role="alert">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5v5.5M12 16.5h.01" />
      </svg>
      <span>{children}</span>
    </p>
  );
}

export default function RegisterPage() {
  const [gymName, setGymName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fee, setFee] = useState("0,00");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [touched, setTouched] = useState<Partial<Record<RegisterField, boolean>>>({});
  const [attempted, setAttempted] = useState(false);
  const [serverErrors, setServerErrors] = useState<Partial<Record<RegisterField, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const auth = useAuth();
  const db = useFirestore();
  const { user } = useUser();
  const router = useRouter();

  // Quem já está logado não precisa de cadastro.
  useEffect(() => {
    if (user && !isSubmitting) router.replace("/members");
  }, [user, isSubmitting, router]);

  const errors = useMemo(
    () => validateRegister({ gymName, email, password, fee: parseFee(fee), acceptedTerms }),
    [gymName, email, password, fee, acceptedTerms]
  );

  const errorFor = (field: RegisterField) =>
    serverErrors[field] ?? (touched[field] || attempted ? errors[field] : undefined);

  const touch = (field: RegisterField) => setTouched((t) => ({ ...t, [field]: true }));
  const clearServer = (field: RegisterField) => {
    setFormError(null);
    setServerErrors((s) => (s[field] ? { ...s, [field]: undefined } : s));
  };
  const focusField = (field: RegisterField) => document.getElementById(FIELD_IDS[field])?.focus();

  const passwordLevel = getPasswordLevel(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setAttempted(true);
    setFormError(null);

    const firstInvalid = FIELD_ORDER.find((f) => errors[f]);
    if (firstInvalid) {
      focusField(firstInvalid);
      return;
    }

    setIsSubmitting(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);

      // Salva os dados da academia sem travar a tela; o Firestore envia em segundo plano.
      setDocumentNonBlocking(
        doc(db, "users", credential.user.uid),
        {
          gymName: gymName.trim(),
          email: credential.user.email,
          monthlyFee: parseFee(fee),
          acceptedTerms: true,
          acceptedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      router.push("/members");
    } catch (error: any) {
      const { field, message } = authErrorMessage(error?.code);
      if (field) {
        setServerErrors({ [field]: message });
      } else {
        setFormError(message);
      }
      setIsSubmitting(false);
      // Os campos estavam desabilitados durante o envio; só dá para focar depois de reabilitar.
      if (field) requestAnimationFrame(() => focusField(field));
    }
  };

  const emailError = errorFor("email");
  const passwordError = errorFor("password");

  return (
    <div className="lp">
      <div className="lp-auth">
        <RegisterPanel gymName={gymName} fee={fee} />

        <div className="lp-auth-main">
          <div className="lp-auth-top">
            <Link href="/" className="lp-logo-link" aria-label="FitBase, página inicial">
              <span className="lp-logo" role="img" aria-label="FitBase" />
            </Link>
            <div className="lp-auth-top-right">
              <span>Já tem conta?</span>
              <Link href="/login">Entrar</Link>
              <ThemeToggle />
            </div>
          </div>

          <main className="lp-auth-wrap">
            <h1 className="lp-auth-title">Crie sua conta</h1>
            <p className="lp-auth-sub">Quatro campos e você já pode cadastrar seus alunos.</p>

            <form className="lp-form" onSubmit={handleSubmit} noValidate>
              {formError && (
                <div className="lp-alert" role="alert">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7.5v5.5M12 16.5h.01" />
                  </svg>
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="lp-label" htmlFor={FIELD_IDS.gymName}>
                  Nome da academia
                </label>
                <input
                  id={FIELD_IDS.gymName}
                  className="lp-input"
                  type="text"
                  autoComplete="organization"
                  placeholder="Ex.: Studio Forma"
                  value={gymName}
                  onChange={(e) => setGymName(e.target.value)}
                  onBlur={() => touch("gymName")}
                  disabled={isSubmitting}
                  aria-invalid={!!errorFor("gymName")}
                  aria-describedby={errorFor("gymName") ? "err-gym" : undefined}
                />
                {errorFor("gymName") && <ErrorText id="err-gym">{errorFor("gymName")}</ErrorText>}
              </div>

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
                    clearServer("email");
                  }}
                  onBlur={() => touch("email")}
                  disabled={isSubmitting}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "err-email" : undefined}
                />
                {emailError && (
                  <ErrorText id="err-email">
                    {emailError}
                    {serverErrors.email && (
                      <>
                        {" "}
                        <Link href="/login">Ir para o login</Link>
                      </>
                    )}
                  </ErrorText>
                )}
              </div>

              <div>
                <label className="lp-label" htmlFor={FIELD_IDS.password}>
                  Senha
                </label>
                <div className="lp-input-wrap">
                  <input
                    id={FIELD_IDS.password}
                    className="lp-input lp-input--pw"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Mínimo de 6 caracteres"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearServer("password");
                    }}
                    onBlur={() => touch("password")}
                    disabled={isSubmitting}
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? "err-pw" : "hint-pw"}
                  />
                  <button
                    type="button"
                    className="lp-eye"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={isSubmitting}
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
                <div className={`lp-strength is-l${passwordLevel}`} aria-hidden="true">
                  <span className="lp-seg" />
                  <span className="lp-seg" />
                  <span className="lp-seg" />
                </div>
                {passwordError ? (
                  <ErrorText id="err-pw">{passwordError}</ErrorText>
                ) : (
                  <p className="lp-hint" id="hint-pw" aria-live="polite">
                    {password ? STRENGTH_LABEL[passwordLevel] : "Use pelo menos 6 caracteres."}
                  </p>
                )}
              </div>

              <div>
                <label className="lp-label" htmlFor={FIELD_IDS.fee}>
                  Valor da mensalidade
                </label>
                <div className="lp-input-wrap">
                  <span className="lp-prefix" aria-hidden="true">
                    R$
                  </span>
                  <input
                    id={FIELD_IDS.fee}
                    className="lp-input lp-input--money"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="0,00"
                    value={fee}
                    onChange={(e) => setFee(formatCurrencyInput(e.target.value))}
                    onBlur={() => touch("fee")}
                    disabled={isSubmitting}
                    aria-invalid={!!errorFor("fee")}
                    aria-describedby={errorFor("fee") ? "err-fee" : "hint-fee"}
                  />
                </div>
                {errorFor("fee") ? (
                  <ErrorText id="err-fee">{errorFor("fee")}</ErrorText>
                ) : (
                  <p className="lp-hint" id="hint-fee">
                    Quanto seus alunos pagam por mês. Você pode alterar depois no painel.
                  </p>
                )}
              </div>

              <div>
                <label className="lp-check" htmlFor={FIELD_IDS.terms}>
                  <input
                    id={FIELD_IDS.terms}
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => {
                      setAcceptedTerms(e.target.checked);
                      touch("terms");
                    }}
                    disabled={isSubmitting}
                    aria-invalid={!!errorFor("terms")}
                    aria-describedby={errorFor("terms") ? "err-terms" : undefined}
                  />
                  <span>
                    Li e concordo com os{" "}
                    <Link href="/terms" target="_blank" rel="noopener noreferrer">
                      Termos de Uso
                    </Link>{" "}
                    do FitBase.
                  </span>
                </label>
                {errorFor("terms") && <ErrorText id="err-terms">{errorFor("terms")}</ErrorText>}
              </div>

              <button type="submit" className="lp-btn lp-btn-primary lp-submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="lp-spinner" aria-hidden="true" />
                    Criando sua conta
                  </>
                ) : (
                  "Criar conta grátis"
                )}
              </button>
            </form>

            <p className="lp-auth-foot">
              Já tem conta? <Link href="/login">Entrar</Link>
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}
