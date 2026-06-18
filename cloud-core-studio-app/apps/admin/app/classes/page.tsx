import { ClassTable } from "@/components/ClassTable";

export default function ClassesPage() {
  return (
    <section className="page">
      <header className="page-header">
        <div>
          <div className="eyebrow">Calendar</div>
          <h1>Classes</h1>
        </div>
        <button className="action">Create recurring template</button>
      </header>
      <section className="card">
        <h2>Session control</h2>
        <ClassTable />
      </section>
    </section>
  );
}
