import "./loading.css";

/** Tela cheia de carregamento, igual em todas as páginas (landing, alunos, troca de rota). */
export function LoadingScreen({ message = "Carregando" }: { message?: string }) {
  return (
    <div className="fb-loading" role="status" aria-live="polite">
      <div className="fb-loading-card">
        <span className="fb-loading-logo" role="img" aria-label="FitBase" />
        <span className="fb-loading-track" aria-hidden="true" />
        <p className="fb-loading-text">{message}</p>
      </div>
    </div>
  );
}
