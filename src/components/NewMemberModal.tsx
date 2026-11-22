"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { collection, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { useUser, useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { addPlanPeriod, getPlanPrice } from "@/lib/member-utils";
import { formatBRL } from "@/lib/format";
import "@/components/landing/landing.css";
import "@/components/app/app.css";

interface NewMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthlyFee: number;
}

type Plan = "mensal" | "trimestral" | "anual";
type Pay = "pix" | "cedula" | "depois";

const PLANS: { key: Plan; label: string }[] = [
  { key: "mensal", label: "Mensal" },
  { key: "trimestral", label: "Trimestral" },
  { key: "anual", label: "Anual" },
];

const PAY_LABEL: Record<Exclude<Pay, "depois">, string> = { pix: "Pix", cedula: "Dinheiro" };

function formatPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function shortDate(d: Date, now: Date) {
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    ...(d.getFullYear() !== now.getFullYear() ? { year: "numeric" as const } : {}),
  });
}

/**
 * Matrícula rápida: nome, WhatsApp, plano e como o aluno pagou. O resto
 * (situação, vencimento, valor) é calculado, não digitado.
 */
export function NewMemberModal({ isOpen, onClose, monthlyFee }: NewMemberModalProps) {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const nameRef = useRef<HTMLInputElement>(null);

  const hasFee = monthlyFee > 0;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState<Plan>("mensal");
  const [pay, setPay] = useState<Pay>("pix");
  const [attempted, setAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cada abertura começa do zero. Sem mensalidade definida não há valor a receber.
  useEffect(() => {
    if (!isOpen) return;
    setName("");
    setPhone("");
    setPlan("mensal");
    setPay(hasFee ? "pix" : "depois");
    setAttempted(false);
  }, [isOpen, hasFee]);

  const now = useMemo(() => new Date(), [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps
  const price = getPlanPrice(plan, monthlyFee);
  const expiry = addPlanPeriod(now, plan);
  const paidNow = pay !== "depois";

  const nameError = !name.trim() ? "Digite o nome do aluno." : "";
  const phoneDigits = phone.replace(/\D/g, "");
  const phoneError = phoneDigits.length < 10 ? "Digite o WhatsApp com DDD." : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !user || !db) return;
    setAttempted(true);
    if (nameError) return nameRef.current?.focus();
    if (phoneError) return document.getElementById("nm-phone")?.focus();

    setIsSubmitting(true);
    try {
      const at = new Date();
      const memberRef = doc(collection(db, "users", user.uid, "members"));
      const batch = writeBatch(db);

      // Quem ainda não pagou entra com o plano vencido; o pagamento é registrado depois no cartão dele.
      const expiryDate = paidNow ? addPlanPeriod(at, plan) : at;

      batch.set(memberRef, {
        userId: user.uid,
        name: name.trim(),
        phone,
        plan,
        status: paidNow ? "ativo" : "vencido",
        joinedAt: at.toISOString(),
        expiryDate: expiryDate.toISOString(),
        ...(paidNow && hasFee ? { lastPaymentMethod: pay, lastPaidAt: at.toISOString() } : {}),
        createdAt: serverTimestamp(),
      });

      if (paidNow && hasFee) {
        batch.set(doc(collection(db, "users", user.uid, "payments")), {
          userId: user.uid,
          memberId: memberRef.id,
          memberName: name.trim(),
          amount: price,
          status: "pago",
          paymentMethod: pay,
          dueDate: at.toISOString(),
          paidAt: at.toISOString(),
          createdAt: serverTimestamp(),
          type: "adesao",
        });
      }

      // Aluno e pagamento são gravados juntos; só confirma depois que o servidor aceitar.
      await batch.commit();

      toast({
        title: paidNow ? "Aluno matriculado" : "Aluno cadastrado",
        description: paidNow
          ? `${name.trim()} está em dia até ${expiryDate.toLocaleDateString("pt-BR")}.`
          : `${name.trim()} entrou como vencido. Registre o pagamento no cartão dele.`,
      });
      onClose();
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
      toast({
        variant: "destructive",
        title: "Aluno não cadastrado",
        description: "Nada foi salvo. Confira a conexão e tente de novo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitLabel = isSubmitting
    ? "Salvando"
    : paidNow && hasFee
      ? `Matricular e receber ${formatBRL(price)}`
      : "Matricular aluno";

  return (
    <Dialog.Root open={isOpen} onOpenChange={(o) => !o && !isSubmitting && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="ap-overlay" />
        <Dialog.Content
          className="lp ap-modal"
          aria-describedby="nm-desc"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            nameRef.current?.focus();
          }}
        >
          <form onSubmit={handleSubmit} noValidate>
            <div className="ap-modal-head">
              <div>
                <Dialog.Title className="ap-modal-title">Novo aluno</Dialog.Title>
                <Dialog.Description id="nm-desc" className="ap-modal-sub">
                  Quatro toques e ele já está na lista.
                </Dialog.Description>
              </div>
              <Dialog.Close className="ap-modal-x" aria-label="Fechar" disabled={isSubmitting}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </Dialog.Close>
            </div>

            <div className="ap-fields">
              <div>
                <label className="ap-label" htmlFor="nm-name">
                  Nome do aluno
                </label>
                <input
                  id="nm-name"
                  ref={nameRef}
                  className="ap-input"
                  placeholder="Ex.: Marcos Silva"
                  autoComplete="off"
                  autoCapitalize="words"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  aria-invalid={attempted && !!nameError}
                  aria-describedby={attempted && nameError ? "nm-name-err" : undefined}
                />
                {attempted && nameError && (
                  <p className="ap-field-error" id="nm-name-err" role="alert">
                    {nameError}
                  </p>
                )}
              </div>

              <div>
                <label className="ap-label" htmlFor="nm-phone">
                  WhatsApp
                </label>
                <input
                  id="nm-phone"
                  className="ap-input"
                  type="tel"
                  inputMode="tel"
                  autoComplete="off"
                  placeholder="(85) 99999-0000"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  disabled={isSubmitting}
                  aria-invalid={attempted && !!phoneError}
                  aria-describedby={attempted && phoneError ? "nm-phone-err" : undefined}
                />
                {attempted && phoneError && (
                  <p className="ap-field-error" id="nm-phone-err" role="alert">
                    {phoneError}
                  </p>
                )}
              </div>

              <fieldset className="ap-fieldset" disabled={isSubmitting}>
                <legend className="ap-label">Plano</legend>
                <div className="ap-choices ap-choices--3">
                  {PLANS.map((p) => (
                    <label key={p.key} className="ap-choice">
                      <input type="radio" name="nm-plan" value={p.key} checked={plan === p.key} onChange={() => setPlan(p.key)} />
                      <span className="ap-choice-box">
                        <strong>{p.label}</strong>
                        <small>{hasFee ? formatBRL(getPlanPrice(p.key, monthlyFee)) : "Sem valor"}</small>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="ap-fieldset" disabled={isSubmitting}>
                <legend className="ap-label">Como pagou a matrícula?</legend>
                <div className="ap-choices ap-choices--3">
                  {(["pix", "cedula", "depois"] as Pay[]).map((p) => {
                    const off = p !== "depois" && !hasFee;
                    return (
                      <label key={p} className={`ap-choice${off ? " is-off" : ""}`}>
                        <input type="radio" name="nm-pay" value={p} checked={pay === p} disabled={off} onChange={() => setPay(p)} />
                        <span className="ap-choice-box">
                          <strong>{p === "depois" ? "Ainda não" : PAY_LABEL[p]}</strong>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </div>

            <p className="ap-modal-summary" aria-live="polite">
              {!hasFee ? (
                <>A mensalidade ainda não foi definida, então o aluno entra sem pagamento. Defina o valor no painel.</>
              ) : paidNow ? (
                <>
                  Em dia até <strong>{shortDate(expiry, now)}</strong>. Registra <strong>{formatBRL(price)}</strong> no {PAY_LABEL[pay as "pix" | "cedula"]}.
                </>
              ) : (
                <>O aluno entra como <strong>vencido</strong>. Quando pagar, é só tocar em Pix ou Dinheiro no cartão dele.</>
              )}
            </p>

            <div className="ap-modal-actions">
              <button type="button" className="ap-modal-cancel" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </button>
              <button type="submit" className="lp-btn lp-btn-primary ap-modal-submit" disabled={isSubmitting}>
                {submitLabel}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
