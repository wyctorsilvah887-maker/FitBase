"use client";

import { useRef, useState } from "react";
import { collection, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useToast } from "@/hooks/use-toast";
import { RenewPlanModal } from "@/components/RenewPlanModal";
import { useDismiss } from "./useDismiss";
import { getPlanPrice, getRenewalDates } from "@/lib/member-utils";
import { describeDue } from "@/lib/member-due";
import { formatBRL, initialsOf } from "@/lib/format";

type Method = "pix" | "cedula";

const METHOD_LABEL: Record<Method, string> = { pix: "Pix", cedula: "Dinheiro" };
const METHODS: Method[] = ["pix", "cedula"];
const PLAN_LABEL: Record<string, string> = { mensal: "Mensal", trimestral: "Trimestral", anual: "Anual" };

export const WhatsAppIcon = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

type Props = { member: any; userId: string; monthlyFee: number; gymName: string };

/**
 * Cartão do aluno. Segue o exemplo de pagamento da landing: Pix ou Dinheiro registram
 * o pagamento, o carimbo "Pago" aparece e a situação muda para Ativo.
 */
export function MemberCard({ member, userId, monthlyFee, gymName }: Props) {
  const db = useFirestore();
  const { toast } = useToast();
  const [paid, setPaid] = useState<Method | null>(null);
  const [busy, setBusy] = useState<Method | null>(null);
  const [pending, setPending] = useState<Method | null>(null);
  const [renewOpen, setRenewOpen] = useState(false);

  const isPaid = paid !== null;
  const expired = member.status === "vencido";
  const due = describeDue(member.expiryDate, isPaid ? "ativo" : member.status);
  const price = getPlanPrice(member.plan, monthlyFee);
  const hasFee = monthlyFee > 0;
  const cleanPhone = (member.phone || "").replace(/\D/g, "");

  const chip =
    !isPaid && expired
      ? { tone: "bad", label: "Vencido" }
      : !isPaid && due.tone === "warn"
        ? { tone: "warn", label: "A vencer" }
        : { tone: "ok", label: "Ativo" };

  const pay = async (method: Method) => {
    if (!hasFee) {
      toast({
        variant: "destructive",
        title: "Mensalidade não configurada",
        description: "Defina o valor da mensalidade no Painel para registrar pagamentos.",
      });
      return;
    }

    const now = new Date();
    // Plano vencido: novo período começa agora. Plano em dia: começa quando o atual acabar.
    const { joinedAt, expiry } = getRenewalDates(member, now);
    const type = expired ? "renovacao" : "adiantado";

    setBusy(method);
    try {
      // Pagamento e renovação na mesma operação: ou gravam os dois, ou nenhum.
      const batch = writeBatch(db);
      batch.set(doc(collection(db, "users", userId, "payments")), {
        userId,
        memberId: member.id,
        memberName: member.name,
        amount: price,
        status: "pago",
        paymentMethod: method,
        dueDate: now.toISOString(),
        paidAt: now.toISOString(),
        createdAt: serverTimestamp(),
        type,
      });
      batch.update(doc(db, "users", userId, "members", member.id), {
        status: "ativo",
        joinedAt: joinedAt.toISOString(),
        expiryDate: expiry.toISOString(),
        updatedAt: serverTimestamp(),
      });
      await batch.commit();

      setPending(null);
      setPaid(method);
      toast({
        title: "Pagamento registrado",
        description: `${member.name} está em dia até ${expiry.toLocaleDateString("pt-BR")}.`,
      });
    } catch (error) {
      console.error("Erro ao registrar pagamento:", error);
      toast({
        variant: "destructive",
        title: "Pagamento não registrado",
        description: "Nada foi alterado. Confira a conexão e tente de novo.",
      });
    } finally {
      setBusy(null);
    }
  };

  // Aluno vencido: um toque, como no exemplo. Aluno em dia: confirma antes, para não cobrar duas vezes sem querer.
  const choose = (method: Method) => {
    if (busy) return;
    if (!hasFee || expired) pay(method);
    else setPending(method);
  };

  const subtitle = `${PLAN_LABEL[member.plan] || member.plan} · ${isPaid && member.expiryDate ? describeDue(member.expiryDate, "ativo").short : due.short}`;

  return (
    <li className="lp-mini lp-pay ap-card">
      <div className="lp-pay-row ap-card-head">
        <span className="lp-avatar" aria-hidden="true">
          {initialsOf(member.name)}
        </span>
        <span className="lp-app-who">
          <strong title={member.name}>{member.name}</strong>
          <small>{subtitle}</small>
        </span>
        <span key={chip.label} className={`lp-chip lp-chip--${chip.tone} lp-swap`}>
          {chip.label}
        </span>
        <MemberMenu member={member} userId={userId} gymName={gymName} onOtherPlan={() => setRenewOpen(true)} />
      </div>

      <p className="ap-contact">
        {cleanPhone ? (
          <a href={`https://wa.me/55${cleanPhone}`} target="_blank" rel="noopener noreferrer" aria-label={`Abrir WhatsApp de ${member.name}`}>
            <WhatsAppIcon />
            {member.phone}
          </a>
        ) : (
          <span>Sem telefone</span>
        )}
      </p>

      <div className="lp-pay-total">
        <span>Valor</span>
        {isPaid && (
          <span className="lp-stamp" aria-hidden="true">
            Pago
          </span>
        )}
        <strong>{hasFee ? formatBRL(price) : "Sem valor"}</strong>
      </div>

      {pending ? (
        <div className="ap-pay-confirm" role="group" aria-label="Confirmar pagamento adiantado">
          <p>
            {(member.name || "").split(" ")[0]} está em dia. Registrar <strong>{formatBRL(price)}</strong> no {METHOD_LABEL[pending]} como pagamento adiantado?
          </p>
          <div className="ap-pay-confirm-actions">
            <button type="button" onClick={() => setPending(null)} disabled={!!busy}>
              Cancelar
            </button>
            <button type="button" className="is-primary" onClick={() => pay(pending)} disabled={!!busy}>
              {busy ? "Registrando" : "Registrar"}
            </button>
          </div>
        </div>
      ) : (
        <div className="lp-pay-actions">
          {METHODS.map((m) => (
            <button
              key={m}
              type="button"
              className={`lp-pay-btn${paid === m ? " is-picked" : ""}${busy === m ? " is-busy" : ""}`}
              disabled={isPaid || !!busy}
              aria-label={`${hasFee ? "Pagar" : "Registrar"} ${formatBRL(price)} de ${member.name} no ${METHOD_LABEL[m]}`}
              onClick={() => choose(m)}
            >
              {paid === m ? `${METHOD_LABEL[m]} ✓` : METHOD_LABEL[m]}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        className="lp-link-btn lp-redo"
        data-visible={isPaid}
        tabIndex={isPaid ? 0 : -1}
        onClick={() => setPaid(null)}
      >
        Registrar outro pagamento
      </button>

      <span className="ap-sr-only" role="status" aria-live="polite">
        {isPaid ? `Pagamento de ${member.name} registrado no ${METHOD_LABEL[paid!]}.` : ""}
      </span>

      <RenewPlanModal isOpen={renewOpen} onClose={() => setRenewOpen(false)} member={member} defaultAmount={monthlyFee} />
    </li>
  );
}

function MemberMenu({ member, userId, gymName, onOtherPlan }: { member: any; userId: string; gymName: string; onOtherPlan: () => void }) {
  const db = useFirestore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    setConfirmingDelete(false);
  };
  useDismiss(wrap, open, () => {
    close();
    trigger.current?.focus();
  });

  const handleDelete = () => {
    deleteDocumentNonBlocking(doc(db, "users", userId, "members", member.id));
    close();
    toast({ title: "Aluno removido", description: `${member.name} foi removido da lista.` });
  };

  const handleWhatsAppReminder = () => {
    if (!member.phone) {
      close();
      toast({
        variant: "destructive",
        title: "Telefone não cadastrado",
        description: "Adicione um número de telefone para enviar o lembrete.",
      });
      return;
    }
    const cleanPhone = member.phone.replace(/\D/g, "");
    const message = `Olá ${member.name}! 🏋️‍♂️ Passando para lembrar que seu plano na ${gymName} está próximo do vencimento ou já venceu. Vamos renovar para não perder o ritmo dos treinos? 💪🔥`;
    window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    close();
  };

  const firstName = (member.name || "").split(" ")[0];

  return (
    <div className="ap-menu-wrap" ref={wrap}>
      <button
        ref={trigger}
        type="button"
        className="ap-more"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Mais ações para ${member.name}`}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="5" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="12" cy="19" r="1.8" />
        </svg>
      </button>

      {open && (
        <div className="ap-menu" role="menu">
          {confirmingDelete ? (
            <div className="ap-confirm">
              <p>
                Remover <strong>{firstName}</strong>? Os dados do aluno serão excluídos.
              </p>
              <div className="ap-confirm-actions">
                <button type="button" onClick={() => setConfirmingDelete(false)}>
                  Cancelar
                </button>
                <button type="button" className="is-danger" onClick={handleDelete}>
                  Remover
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                type="button"
                role="menuitem"
                className="ap-menu-item"
                onClick={() => {
                  close();
                  onOtherPlan();
                }}
              >
                Outro plano ou valor
              </button>
              <button type="button" role="menuitem" className="ap-menu-item" onClick={handleWhatsAppReminder}>
                <WhatsAppIcon size={16} /> Cobrar no WhatsApp
              </button>
              <div className="ap-menu-sep" />
              <button type="button" role="menuitem" className="ap-menu-item ap-menu-item--bad" onClick={() => setConfirmingDelete(true)}>
                Remover aluno
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
