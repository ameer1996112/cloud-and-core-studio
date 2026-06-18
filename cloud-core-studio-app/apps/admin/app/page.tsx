import { ClassTable } from "@/components/ClassTable";
import { MetricCard } from "@/components/MetricCard";
import { members, metrics, reports } from "@/fixtures/dashboard";

export default function OverviewPage() {
  return (
    <section className="page">
      <header className="page-header">
        <div>
          <div className="eyebrow">Today</div>
          <h1>Studio overview</h1>
        </div>
        <button className="action">Open class</button>
      </header>

      <div className="grid">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="two-col">
        <section className="card">
          <h2>Live schedule</h2>
          <ClassTable />
        </section>
        <section className="card">
          <h2>Member health</h2>
          <div className="list">
            {members.map((member) => (
              <div className="list-row" key={member.name}>
                <div>
                  <strong>{member.name}</strong>
                  <div className="muted">{member.plan}</div>
                </div>
                <span className={`status ${member.health === "expiring" ? "danger" : ""}`}>{member.expiry}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="card">
        <h2>Owner signals</h2>
        <div className="grid">
          {reports.map((report) => (
            <MetricCard key={report.label} label={report.label} value={report.value} detail="Updated from bookings and attendance" />
          ))}
        </div>
      </section>
    </section>
  );
}
