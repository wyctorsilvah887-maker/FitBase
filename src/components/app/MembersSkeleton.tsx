export function MembersSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <ul className="ap-list" aria-busy="true" aria-label="Carregando alunos">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="ap-skel" />
      ))}
    </ul>
  );
}
