"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, query, orderBy, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useToast } from "@/hooks/use-toast";
import { AppHeader } from "@/components/app/AppHeader";
import { LoadingScreen } from "@/components/app/LoadingScreen";
import { MembersSkeleton } from "@/components/app/MembersSkeleton";
import { useDismiss } from "@/components/app/useDismiss";
import { NewMemberModal } from "@/components/NewMemberModal";
import { RenewPlanModal } from "@/components/RenewPlanModal";
import { TermsAcceptanceModal } from "@/components/TermsAcceptanceModal";
import { getEffectiveStatus, getPlanPrice, getRenewalDates } from "@/lib/member-utils";
import { describeDue } from "@/lib/member-due";
import { formatBRL, initialsOf, normalizeText } from "@/lib/format";
import "@/components/landing/landing.css";
import "@/components/app/app.css";

type Filter = "todos" | "ativo" | "vencido";

const WhatsAppIcon = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function MembersPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Filter>("todos");
  const [isNewMemberModalOpen, setIsNewMemberModalOpen] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) router.replace("/login");
  }, [user, isUserLoading, router]);

  const membersQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(collection(db, "users", user.uid, "members"), orderBy("name", "asc"));
  }, [user, db]);

  const userRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, "users", user.uid);
  }, [user, db]);

  const { data: rawMembers, isLoading } = useCollection(membersQuery);
  const { data: userDoc, isLoading: isUserDocLoading } = useDoc(userRef);

  // O status gravado só reflete a última renovação; o status real vem da data de vencimento.
  const members = useMemo(
    () => rawMembers?.map((m: any) => ({ ...m, status: getEffectiveStatus(m) })) ?? [],
    [rawMembers]
  );

  const counts = useMemo(
    () => ({
      todos: members.length,
      ativo: members.filter((m) => m.status === "ativo").length,
      vencido: members.filter((m) => m.status === "vencido").length,
    }),
    [members]
  );

  const filtered = useMemo(() => {
    const q = normalizeText(searchTerm.trim());
    const digits = searchTerm.replace(/\D/g, "");
    return members.filter((m) => {
      const matchesSearch =
        !q ||
        normalizeText(m.name || "").includes(q) ||
        (digits.length > 0 && (m.phone || "").replace(/\D/g, "").includes(digits));
      const matchesStatus = statusFilter === "todos" || m.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [members, searchTerm, statusFilter]);

  if (isUserLoading || !user || isUserDocLoading) {
    return <LoadingScreen message="Abrindo seus alunos" />;
  }

  const monthlyFee: number = userDoc?.monthlyFee || 0;
  const gymName: string = userDoc?.gymName || "FitBase";
  const showTermsModal = !userDoc || !userDoc.acceptedTerms;
  const hasFilters = statusFilter !== "todos" || searchTerm.trim() !== "";
  const clearFilters = () => {
    setStatusFilter("todos");
    setSearchTerm("");
  };

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "todos", label: "Todos" },
    { key: "ativo", label: "Ativos" },
    { key: "vencido", label: "Vencidos" },
  ];

  return (
    <div className="lp">
      <AppHeader active="members" />

      <main className="ap-main">
        <div className="ap-head">
          <div>
            <h1 className="ap-title">Alunos</h1>
            <p className="ap-sub">{gymName}</p>
          </div>
          <button type="button" className="lp-btn lp-btn-primary" onClick={() => setIsNewMemberModalOpen(true)}>
            Novo aluno
          </button>
        </div>

        {monthlyFee <= 0 && (
          <div className="ap-notice" role="status">
            <span>A mensalidade ainda não foi definida, então não dá para registrar renovações.</span>
            <Link href="/dashboard">Definir no painel</Link>
          </div>
        )}

        {!isLoading && counts.todos === 0 ? (
          <div className="ap-empty">
            <div className="ap-empty-art" aria-hidden="true" />
            <h2>Sua lista ainda está vazia</h2>
            <p>Cadastre o primeiro aluno. Nome, telefone e plano bastam para começar.</p>
            <button type="button" className="lp-btn lp-btn-primary" onClick={() => setIsNewMemberModalOpen(true)}>
              Cadastrar aluno
            </button>
          </div>
        ) : (
          <>
            <div className="ap-toolbar">
              <div className="ap-filters" role="group" aria-label="Filtrar por situação">
                {FILTERS.map((f) => (
                  <button key={f.key} type="button" aria-pressed={statusFilter === f.key} onClick={() => setStatusFilter(f.key)}>
                    {f.label} <b>{isLoading ? "" : counts[f.key]}</b>
                  </button>
                ))}
              </div>
              <div className="ap-search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
                <input
                  type="search"
                  placeholder="Buscar por nome ou telefone"
                  aria-label="Buscar aluno por nome ou telefone"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <MembersSkeleton />
            ) : filtered.length > 0 ? (
              <ul className="ap-list">
                {filtered.map((m) => (
                  <MemberRow key={m.id} member={m} userId={user.uid} monthlyFee={monthlyFee} gymName={gymName} />
                ))}
              </ul>
            ) : (
              <div className="ap-empty">
                <h2>Nenhum aluno encontrado</h2>
                <p>Confira a grafia ou mude o filtro para ver mais alunos.</p>
                {hasFilters && (
                  <button type="button" className="ap-renew" onClick={clearFilters}>
                    Limpar filtros
                  </button>
                )}
              </div>
            )}

            {!isLoading && filtered.length > 0 && hasFilters && (
              <p className="ap-count-note" aria-live="polite">
                Mostrando {filtered.length} de {counts.todos} alunos.
              </p>
            )}
          </>
        )}
      </main>

      <NewMemberModal isOpen={isNewMemberModalOpen} onClose={() => setIsNewMemberModalOpen(false)} monthlyFee={monthlyFee} />
      <TermsAcceptanceModal isOpen={showTermsModal} />
    </div>
  );
}

function MemberRow({ member, userId, monthlyFee, gymName }: { member: any; userId: string; monthlyFee: number; gymName: string }) {
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const due = describeDue(member.expiryDate, member.status);
  const price = getPlanPrice(member.plan, monthlyFee);
  const cleanPhone = (member.phone || "").replace(/\D/g, "");

  return (
    <li className="ap-row">
      <div className="ap-who">
        <span className="ap-avatar" aria-hidden="true">
          {initialsOf(member.name)}
        </span>
        <div className="ap-name">
          <strong title={member.name}>{member.name}</strong>
          <div className="ap-name-meta">
            <span className={`ap-chip ap-chip--${member.status === "ativo" ? "ok" : "bad"}`}>{member.status === "ativo" ? "Ativo" : "Vencido"}</span>
            {cleanPhone ? (
              <a className="ap-phone" href={`https://wa.me/55${cleanPhone}`} target="_blank" rel="noopener noreferrer" aria-label={`Abrir WhatsApp de ${member.name}`}>
                <WhatsAppIcon />
                {member.phone}
              </a>
            ) : (
              <span className="ap-phone ap-phone--none">Sem telefone</span>
            )}
          </div>
        </div>
      </div>

      <div className="ap-plan">
        <span className="ap-plan-name">{member.plan}</span>
        <span className="ap-price">{monthlyFee > 0 ? formatBRL(price) : "Sem valor"}</span>
      </div>

      <div className={`ap-due ap-due--${due.tone}`}>
        {due.text}
        {member.joinedAt && <small>Período iniciado em {new Date(member.joinedAt).toLocaleDateString("pt-BR")}</small>}
      </div>

      <div className="ap-actions">
        <button type="button" className="ap-renew" onClick={() => setIsRenewModalOpen(true)} aria-label={`Renovar plano de ${member.name}`}>
          Renovar
        </button>
        <MemberActions member={member} userId={userId} monthlyFee={monthlyFee} gymName={gymName} />
      </div>

      <RenewPlanModal isOpen={isRenewModalOpen} onClose={() => setIsRenewModalOpen(false)} member={member} defaultAmount={monthlyFee} />
    </li>
  );
}

function MemberActions({ member, userId, monthlyFee, gymName }: { member: any; userId: string; monthlyFee: number; gymName: string }) {
  const db = useFirestore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [busy, setBusy] = useState(false);
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

  const price = getPlanPrice(member.plan, monthlyFee);

  const handleDelete = () => {
    const memberRef = doc(db, "users", userId, "members", member.id);
    deleteDocumentNonBlocking(memberRef);
    close();
    toast({
      title: "Aluno removido",
      description: `${member.name} foi removido da lista.`,
    });
  };

  const handleQuickAction = async (type: "renovacao" | "adiantado", method: "pix" | "cedula") => {
    if (monthlyFee <= 0) {
      close();
      toast({
        variant: "destructive",
        title: "Mensalidade não configurada",
        description: "Defina o valor da mensalidade no Painel para usar esta função.",
      });
      return;
    }

    const paymentsRef = collection(db, "users", userId, "payments");
    const memberRef = doc(db, "users", userId, "members", member.id);

    const now = new Date();
    // Plano vencido: novo período começa agora. Plano ativo: começa quando o atual acabar.
    const { joinedAt, expiry } = getRenewalDates(member, now);

    setBusy(true);
    try {
      // Pagamento e renovação na mesma operação: ou gravam os dois, ou nenhum.
      const batch = writeBatch(db);

      batch.set(doc(paymentsRef), {
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

      batch.update(memberRef, {
        status: "ativo",
        joinedAt: joinedAt.toISOString(),
        expiryDate: expiry.toISOString(),
        updatedAt: serverTimestamp(),
      });

      await batch.commit();
      close();

      toast({
        title: "Plano renovado",
        description: `${member.name} está em dia até ${expiry.toLocaleDateString("pt-BR")}.`,
      });
    } catch (error) {
      console.error("Erro ao renovar plano:", error);
      toast({
        variant: "destructive",
        title: "Erro na renovação",
        description: "Não foi possível registrar o pagamento. Nada foi alterado, tente novamente.",
      });
    } finally {
      setBusy(false);
    }
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
              <p className="ap-menu-group">Renovar agora</p>
              <button type="button" role="menuitem" className="ap-menu-item" disabled={busy} onClick={() => handleQuickAction("renovacao", "pix")}>
                Pix <small>{monthlyFee > 0 ? formatBRL(price) : ""}</small>
              </button>
              <button type="button" role="menuitem" className="ap-menu-item" disabled={busy} onClick={() => handleQuickAction("renovacao", "cedula")}>
                Dinheiro <small>{monthlyFee > 0 ? formatBRL(price) : ""}</small>
              </button>

              <p className="ap-menu-group">Pagamento antecipado</p>
              <button type="button" role="menuitem" className="ap-menu-item" disabled={busy} onClick={() => handleQuickAction("adiantado", "pix")}>
                Pix <small>{monthlyFee > 0 ? formatBRL(price) : ""}</small>
              </button>
              <button type="button" role="menuitem" className="ap-menu-item" disabled={busy} onClick={() => handleQuickAction("adiantado", "cedula")}>
                Dinheiro <small>{monthlyFee > 0 ? formatBRL(price) : ""}</small>
              </button>

              <div className="ap-menu-sep" />
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
