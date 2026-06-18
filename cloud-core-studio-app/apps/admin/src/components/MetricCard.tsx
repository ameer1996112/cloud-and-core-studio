export function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small className="muted">{detail}</small>
    </article>
  );
}
