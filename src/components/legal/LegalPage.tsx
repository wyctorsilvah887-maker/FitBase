"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LpThemeToggle } from "@/components/landing/LpThemeToggle";
import "@/components/landing/landing.css";
import "@/components/auth/auth.css";

export type LegalSection = { id: string; title: string; body: ReactNode };

type Props = {
  title: string;
  meta: string;
  sections: LegalSection[];
  /** Texto do aviso final, acima do botão de voltar. */
  closing: string;
  /** Link para o outro documento, mostrado no fim. */
  other: { href: string; label: string };
};

/** Estrutura comum dos documentos legais (Termos de Uso e Política de Privacidade). */
export function LegalPage({ title, meta, sections, closing, other }: Props) {
  const router = useRouter();

  // Quem veio do cadastro volta para ele; quem abriu o link direto vai para o cadastro.
  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) router.back();
    else router.push("/register");
  };

  return (
    <div className="lp lp-terms">
      <div className="lp-wrap">
        <div className="lp-terms-top">
          <Link href="/" className="lp-logo-link" aria-label="FitBase, página inicial">
            <span className="lp-logo" role="img" aria-label="FitBase" />
          </Link>
          <div className="lp-auth-top-right">
            <button type="button" className="lp-text-btn" onClick={goBack}>
              Voltar
            </button>
            <LpThemeToggle />
          </div>
        </div>

        <div className="lp-terms-body">
          <aside className="lp-terms-aside">
            <h1>{title}</h1>
            <p className="lp-terms-meta">{meta}</p>
            <ul className="lp-terms-toc">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <article className="lp-terms-article">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id}>
                <h2>
                  <span>{i + 1}.</span>
                  {s.title}
                </h2>
                {s.body}
              </section>
            ))}

            <div className="lp-terms-accept">
              <p>{closing}</p>
              <button type="button" className="lp-btn lp-btn-primary" onClick={goBack}>
                Voltar ao cadastro
              </button>
            </div>
            <p className="lp-terms-other">
              Veja também: <Link href={other.href}>{other.label}</Link>
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
