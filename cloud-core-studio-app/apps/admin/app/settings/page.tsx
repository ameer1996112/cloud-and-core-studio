const settings = [
  "Payment provider abstraction",
  "Webhook signature secret",
  "Hebrew and English legal documents",
  "Cancellation policy",
  "Push, email, SMS, and WhatsApp providers",
  "Staff permissions",
];

export default function SettingsPage() {
  return (
    <section className="page">
      <header className="page-header">
        <div>
          <div className="eyebrow">Studio control</div>
          <h1>Settings</h1>
        </div>
        <button className="action">Save changes</button>
      </header>
      <section className="card">
        <h2>Configuration checklist</h2>
        <div className="list">
          {settings.map((setting) => (
            <div className="list-row" key={setting}>
              <strong>{setting}</strong>
              <span className="status warning">configure</span>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
