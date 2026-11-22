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
import { NewMemberModal } from "@/components/NewMemberModal";
import { TermsAcceptanceModal } from "@/components/TermsAcceptanceModal";
import { getEffectiveStatus } from "@/lib/member-utils";
import { normalizeText } from "@/lib/format";
import "@/components/landing/landing.css";
import "@/components/app/app.css";

type Filter = "todos" | "ativo" | "vencido";

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

      <NewMemberModal isOpen={isNewMemberModalOpen} onClose={() => setIsNewMemberModalOpen(false)} monthlyFee={monthlyFee} />
      <TermsAcceptanceModal isOpen={showTermsModal} />
    </div>
  );
}

