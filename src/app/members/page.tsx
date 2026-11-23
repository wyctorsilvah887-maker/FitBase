"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase";
import { AppHeader } from "@/components/app/AppHeader";
import { LoadingScreen } from "@/components/app/LoadingScreen";
import { MembersSkeleton } from "@/components/app/MembersSkeleton";
import { MemberCard } from "@/components/app/MemberCard";
import { Tour, type TourStep } from "@/components/tour/Tour";
import { NewMemberModal } from "@/components/NewMemberModal";
import { TermsAcceptanceModal } from "@/components/TermsAcceptanceModal";
import { getEffectiveStatus } from "@/lib/member-utils";
import { normalizeText } from "@/lib/format";
import "@/components/landing/landing.css";
import "@/components/app/app.css";

type Filter = "todos" | "ativo" | "vencido";

const TOUR: TourStep[] = [
  {
    title: "Bem-vindo ao FitBase",
    body: "Em poucos passos você vê onde fica cada coisa nesta tela. Dá para sair quando quiser.",
  },
  {
    target: '[data-tour="nav"]',
    title: "Alunos e Painel",
    body: "Alunos é a lista do dia a dia. O Painel mostra o mês: quanto entrou no caixa e quem está em dia.",
  },
  {
    target: '[data-tour="new-member"]',
    title: "Cadastre um aluno",
    body: "Nome, telefone e plano bastam. Se o aluno já pagou, registre o pagamento na hora.",
  },
  {
    target: '[data-tour="filters"]',
    title: "Filtre por situação",
    body: "Veja só quem está em dia ou só quem venceu. O número ao lado mostra quantos alunos há em cada grupo.",
  },
  {
    target: '[data-tour="search"]',
    title: "Ache um aluno rápido",
    body: "Digite parte do nome ou do telefone. A lista filtra a cada letra.",
  },
  {
    target: ".ap-card",
    title: "O cartão do aluno",
    body: "Mostra o plano, o vencimento e a situação. Quando o pagamento entra, o selo Pago aparece.",
  },
  {
    target: ".ap-card .lp-pay-actions",
    title: "Registre o pagamento em um toque",
    body: "Escolha Pix ou dinheiro. O plano renova e o novo vencimento é calculado para você.",
  },
  {
    target: ".ap-nudge",
    title: "Cobre pelo WhatsApp",
    body: "Em quem venceu, o botão Cobrar abre a conversa com a mensagem pronta. Em quem vence em breve, ele vira Lembrar.",
  },
  {
    target: '[data-tour="account"]',
    title: "Tema e conta",
    body: "Troque entre claro e escuro, abra o painel de gestão ou saia da conta. O botão Como funciona repete este tour quando quiser.",
  },
];

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
          <button type="button" className="lp-btn lp-btn-primary" data-tour="new-member" onClick={() => setIsNewMemberModalOpen(true)}>
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
              <div className="ap-filters" data-tour="filters" role="group" aria-label="Filtrar por situação">
                {FILTERS.map((f) => (
                  <button key={f.key} type="button" aria-pressed={statusFilter === f.key} onClick={() => setStatusFilter(f.key)}>
                    {f.label} <b>{isLoading ? "" : counts[f.key]}</b>
                  </button>
                ))}
              </div>
              <div className="ap-search" data-tour="search">
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
                  <MemberCard key={m.id} member={m} userId={user.uid} monthlyFee={monthlyFee} gymName={gymName} />
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

      <Tour steps={TOUR} />
      <NewMemberModal isOpen={isNewMemberModalOpen} onClose={() => setIsNewMemberModalOpen(false)} monthlyFee={monthlyFee} />
      <TermsAcceptanceModal isOpen={showTermsModal} />
    </div>
  );
}

