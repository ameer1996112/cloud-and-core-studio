import { members } from "@/fixtures/dashboard";

export default function MembersPage() {
  return (
    <section className="page">
      <header className="page-header">
        <div>
          <div className="eyebrow">CRM</div>
          <h1>Members</h1>
        </div>
        <button className="action">Export CSV</button>
      </header>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Plan</th>
              <th>Credits</th>
              <th>Expiry</th>
              <th>Health</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.name}>
                <td>{member.name}</td>
                <td>{member.plan}</td>
                <td>{member.credits ?? "Unlimited"}</td>
                <td>{member.expiry}</td>
                <td>
                  <span className={`status ${member.health === "expiring" ? "danger" : ""}`}>{member.health}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
