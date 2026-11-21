import Link from "next/link";
import { HeroCompare } from "./HeroCompare";
import { Features } from "./Features";

export function LandingContent() {
  return (
    <main>
      <section className="lp-hero">
        <div className="lp-wrap lp-hero-grid">
          <div className="lp-hero-copy">
            <h1 className="lp-h1">Aposente o caderno. Saiba quem vence hoje.</h1>
            <p className="lp-lead">
              O FitBase reúne alunos, planos e pagamentos da sua academia num só lugar. Sem folha solta e
              sem conta de cabeça.
            </p>
            <div className="lp-hero-actions">
              <Link href="/register" className="lp-btn lp-btn-primary">
                Começar grátis
              </Link>
              <Link href="/login" className="lp-btn lp-btn-ghost">
                Já tenho conta
              </Link>
            </div>
            <p className="lp-fine">Funciona no navegador do celular e do computador.</p>
          </div>

          <HeroCompare />
        </div>
      </section>

      <Features />

      <section className="lp-section lp-section--cta">
        <div className="lp-wrap">
          <div className="lp-cta">
            <h2 className="lp-h2 lp-cta-title">Cadastre o primeiro aluno hoje.</h2>
            <p className="lp-cta-text">
              Crie sua conta grátis e leve a lista do caderno para o FitBase.
            </p>
            <Link href="/register" className="lp-btn lp-btn-primary lp-btn-lg">
              Criar conta grátis
            </Link>
          </div>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="lp-wrap lp-footer-inner">
          <span className="lp-logo lp-logo--footer" role="img" aria-label="FitBase" />
          <nav className="lp-footer-links" aria-label="Rodapé">
            <Link href="/terms">Termos</Link>
            <Link href="/login">Entrar</Link>
            <Link href="/register">Criar conta</Link>
          </nav>
          <p>© 2026 FitBase</p>
        </div>
      </footer>
    </main>
  );
}
