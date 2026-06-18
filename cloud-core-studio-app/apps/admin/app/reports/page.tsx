import { MetricCard } from "@/components/MetricCard";
import { reports } from "@/fixtures/dashboard";

export default function ReportsPage() {
  return (
    <section className="page">
      <header className="page-header">
        <div>
          <div className="eyebrow">Analytics</div>
          <h1>Reports</h1>
        </div>
        <button className="action">Export report</button>
      </header>
      <div className="grid">
        {reports.map((report) => (
          <MetricCard key={report.label} label={report.label} value={report.value} detail="CSV export ready" />
        ))}
      </div>
      <section className="card">
        <h2>No-show prevention</h2>
        <p className="muted">
          Reminder timing, late-cancel windows, and waitlist confirmations are tracked together so the owner can tune policy without
          punishing reliable members.
        </p>
      </section>
    </section>
  );
}
