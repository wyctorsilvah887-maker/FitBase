import Link from "next/link";

const POINTS = [
  "Alunos, planos e vencimentos num só lugar",
  "Pagamentos por Pix ou dinheiro",
  "Funciona no celular e no computador",
];

function initialsOf(name: string) {
  const letters = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return letters || "?";
}

/**
 * Painel lateral do cadastro. A prévia acompanha o que a pessoa digita,
 * para o formulário parecer o começo do sistema e não só uma ficha.
 */
export function RegisterPanel({ gymName, fee }: { gymName: string; fee: string }) {
  const name = gymName.trim();

  return (
    <aside className="lp-auth-panel">
      <Link href="/" className="lp-logo-link" aria-label="FitBase, página inicial">
        <span className="lp-logo lp-logo--badge" role="img" aria-label="FitBase" />
      </Link>

      <div className="lp-auth-panel-body">
        <h2 className="lp-auth-panel-title">Leve a lista do caderno para o FitBase.</h2>

        <div className="lp-preview" role="img" aria-label="Prévia do seu painel, atualizada enquanto você preenche o cadastro">
          <div className="lp-preview-head">
            <span className="lp-preview-avatar">{initialsOf(gymName)}</span>
            <span className={`lp-preview-name${name ? "" : " is-empty"}`}>{name || "Nome da sua academia"}</span>
          </div>

          <div className="lp-preview-stats">
            <div>
              <small>Mensalidade</small>
              <strong>R$ {fee}</strong>
            </div>
            <div>
              <small>Alunos</small>
              <strong>0</strong>
            </div>
          </div>

          <div className="lp-preview-empty">
            <span className="lp-preview-plus" aria-hidden="true">+</span>
            <span>Nenhum aluno ainda. O primeiro cadastro leva poucos toques.</span>
          </div>
        </div>

        <ul className="lp-auth-points">
          {POINTS.map((p) => (
            <li key={p}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
