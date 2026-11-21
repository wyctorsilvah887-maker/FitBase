import Link from "next/link";

const POINTS = [
  "Veja quem está vencido ou vence logo",
  "Registre Pix ou dinheiro em um toque",
  "Funciona no celular e no computador",
];

const ROWS = [
  { initials: "MS", name: "Marcos Silva", plan: "Mensal", status: "warn", label: "Vence hoje" },
  { initials: "CD", name: "Carla Dias", plan: "Mensal", status: "bad", label: "Vencido" },
  { initials: "BM", name: "Bruna Moura", plan: "Anual", status: "ok", label: "Ativo" },
] as const;

/** Painel lateral do login: um recorte de como a recepção enxerga os vencimentos. */
export function LoginPanel() {
  return (
    <aside className="lp-auth-panel">
      <Link href="/" className="lp-logo-link" aria-label="FitBase, página inicial">
        <span className="lp-logo lp-logo--badge" role="img" aria-label="FitBase" />
      </Link>

      <div className="lp-auth-panel-body">
        <h2 className="lp-auth-panel-title">Sua recepção, de onde você parou.</h2>

        <div className="lp-preview" role="img" aria-label="Exemplo de lista de alunos com situação do plano">
          <p className="lp-preview-title">Vencimentos da semana</p>
          <ul className="lp-prows">
            {ROWS.map((r) => (
              <li key={r.name} className="lp-prow">
                <span className="lp-preview-avatar lp-preview-avatar--sm">{r.initials}</span>
                <span className="lp-prow-who">
                  <strong>{r.name}</strong>
                  <small>{r.plan}</small>
                </span>
                <span className={`lp-pchip lp-pchip--${r.status}`}>{r.label}</span>
              </li>
            ))}
          </ul>
          <p className="lp-preview-note">Exemplo ilustrativo</p>
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
