import { MembersSkeleton } from "@/components/app/MembersSkeleton";
import "@/components/landing/landing.css";
import "@/components/app/app.css";

/** Enquanto a página de alunos carrega: a estrutura da lista já aparece, sem tela em branco. */
export default function MembersLoading() {
  return (
    <div className="lp">
      <header className="ap-header">
        <div className="ap-header-in">
          <span className="lp-logo ap-logo" role="img" aria-label="FitBase" />
        </div>
      </header>
      <main className="ap-main">
        <div className="ap-head">
          <div>
            <h1 className="ap-title">Alunos</h1>
          </div>
        </div>
        <div style={{ height: 24 }} />
        <MembersSkeleton />
      </main>
    </div>
  );
}
