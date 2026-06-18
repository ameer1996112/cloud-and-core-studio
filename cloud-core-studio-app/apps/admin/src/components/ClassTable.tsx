import { classes } from "@/fixtures/dashboard";

export function ClassTable() {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Class</th>
            <th>Instructor</th>
            <th>Booked</th>
            <th>Waitlist</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((session) => (
            <tr key={`${session.time}-${session.name}`}>
              <td>{session.time}</td>
              <td>{session.name}</td>
              <td>{session.instructor}</td>
              <td>{session.booked}</td>
              <td>{session.waitlist}</td>
              <td>
                <span className={`status ${session.status === "waitlist" ? "warning" : ""}`}>{session.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
