"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  buildStudioSnapshot,
  capacityPercent,
  capacityTone,
  classAction,
  formatIls,
  getClassBookings,
  getDaySchedule,
  getMemberBookings,
  getMemberCreditsLabel,
  initials,
  type BookingRecord,
  type StudioClass,
  type StudioMember,
  type StudioSnapshot,
} from "@/lib/studioApp.mjs";

type Screen =
  | "dashboard"
  | "schedule"
  | "classes"
  | "bookings"
  | "clients"
  | "instructors"
  | "memberships"
  | "payments"
  | "attendance"
  | "analytics"
  | "messages"
  | "settings";

const nav: Array<{ screen: Screen; icon: string; label: string }> = [
  { screen: "dashboard", icon: "⌂", label: "Dashboard" },
  { screen: "schedule", icon: "◷", label: "Calendar" },
  { screen: "classes", icon: "▤", label: "Classes" },
  { screen: "bookings", icon: "✓", label: "Bookings" },
  { screen: "clients", icon: "◇", label: "Clients" },
  { screen: "instructors", icon: "◉", label: "Instructors" },
  { screen: "memberships", icon: "∞", label: "Memberships" },
  { screen: "payments", icon: "₪", label: "Payments" },
  { screen: "attendance", icon: "☑", label: "Attendance" },
  { screen: "analytics", icon: "↗", label: "Analytics" },
  { screen: "messages", icon: "✉", label: "Messages" },
  { screen: "settings", icon: "⚙", label: "Settings" },
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const statusFilters = ["All", "booked", "waitlisted", "cancelled", "checked_in", "no_show"];

export function StudioApp({ initialScreen = "dashboard" }: { initialScreen?: Screen } = {}) {
  const [snapshot] = useState<StudioSnapshot>(() => buildStudioSnapshot());
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [selectedDay, setSelectedDay] = useState("Sun");
  const [selectedClassId, setSelectedClassId] = useState("class-1");
  const [selectedMemberId, setSelectedMemberId] = useState("mem-1");
  const [query, setQuery] = useState("");
  const [bookingFilter, setBookingFilter] = useState("All");
  const [drawer, setDrawer] = useState<null | "class" | "client" | "form" | "booking">(null);
  const [toast, setToast] = useState("");

  const selectedClass = snapshot.classes.find((item) => item.id === selectedClassId) ?? snapshot.classes[0];
  const selectedMember = snapshot.members.find((item) => item.id === selectedMemberId) ?? snapshot.members[0];

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  function openClass(session: StudioClass) {
    setSelectedClassId(session.id);
    setDrawer("class");
  }

  function openClient(member: StudioMember) {
    setSelectedMemberId(member.id);
    setDrawer("client");
  }

  return (
    <div className="studioflow-app">
      <aside className="app-sidebar" aria-label="StudioFlow admin navigation">
        <div className="brand-lockup">
          <span className="brand-mark">S</span>
          <span>
            <strong>StudioFlow</strong>
            <small>{snapshot.studio.location}</small>
          </span>
        </div>
        <nav className="side-nav">
          {nav.map((item) => (
            <button key={item.screen} className={screen === item.screen ? "active" : ""} onClick={() => setScreen(item.screen)}>
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <strong>Today</strong>
          <span>{snapshot.today}</span>
          <small>{snapshot.stats.waitlistAlerts} waitlist alerts need attention</small>
        </div>
      </aside>

      <main className="app-main">
        <TopBar
          snapshot={snapshot}
          screen={screen}
          onAdd={() => setDrawer(screen === "clients" ? "client" : screen === "bookings" ? "booking" : "form")}
          query={query}
          onQuery={setQuery}
        />

        {screen === "dashboard" && <Dashboard snapshot={snapshot} onNavigate={setScreen} onClass={openClass} onClient={openClient} onToast={notify} />}
        {screen === "schedule" && <Schedule snapshot={snapshot} selectedDay={selectedDay} onDay={setSelectedDay} onClass={openClass} />}
        {screen === "classes" && <Classes snapshot={snapshot} query={query} onClass={openClass} />}
        {screen === "bookings" && (
          <Bookings snapshot={snapshot} query={query} filter={bookingFilter} onFilter={setBookingFilter} onClass={openClass} onClient={openClient} onToast={notify} />
        )}
        {screen === "clients" && <Clients snapshot={snapshot} query={query} onClient={openClient} />}
        {screen === "instructors" && <Instructors snapshot={snapshot} />}
        {screen === "memberships" && <Memberships snapshot={snapshot} onToast={notify} />}
        {screen === "payments" && <Payments snapshot={snapshot} query={query} onToast={notify} />}
        {screen === "attendance" && <Attendance snapshot={snapshot} onToast={notify} />}
        {screen === "analytics" && <Analytics snapshot={snapshot} />}
        {screen === "messages" && <Messages snapshot={snapshot} onToast={notify} />}
        {screen === "settings" && <Settings snapshot={snapshot} onToast={notify} />}
      </main>

      <nav className="mobile-nav" aria-label="Primary">
        {nav.slice(0, 5).map((item) => (
          <button key={item.screen} className={screen === item.screen ? "active" : ""} onClick={() => setScreen(item.screen)}>
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {drawer === "class" && <ClassDrawer session={selectedClass} snapshot={snapshot} onClose={() => setDrawer(null)} onToast={notify} />}
      {drawer === "client" && <ClientDrawer member={selectedMember} snapshot={snapshot} onClose={() => setDrawer(null)} onToast={notify} />}
      {drawer === "form" && <ClassFormDrawer snapshot={snapshot} onClose={() => setDrawer(null)} onToast={notify} />}
      {drawer === "booking" && <BookingDrawer snapshot={snapshot} onClose={() => setDrawer(null)} onToast={notify} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

function TopBar({
  snapshot,
  screen,
  onAdd,
  query,
  onQuery,
}: {
  snapshot: StudioSnapshot;
  screen: Screen;
  onAdd: () => void;
  query: string;
  onQuery: (value: string) => void;
}) {
  return (
    <header className="app-topbar">
      <div>
        <p className="eyebrow">Studio operations</p>
        <h1>{nav.find((item) => item.screen === screen)?.label ?? "Dashboard"}</h1>
      </div>
      <label className="search-field">
        <span>Search</span>
        <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Client, class, instructor" />
      </label>
      <button className="btn-primary" onClick={onAdd}>Add</button>
      <div className="admin-pill">
        <Avatar label={snapshot.admin.name} tone="sage" />
        <span>
          <strong>{snapshot.admin.name}</strong>
          <small>{snapshot.admin.role}</small>
        </span>
      </div>
    </header>
  );
}

function Dashboard({
  snapshot,
  onNavigate,
  onClass,
  onClient,
  onToast,
}: {
  snapshot: StudioSnapshot;
  onNavigate: (screen: Screen) => void;
  onClass: (session: StudioClass) => void;
  onClient: (member: StudioMember) => void;
  onToast: (message: string) => void;
}) {
  const todayClasses = getDaySchedule(snapshot, "Sun");

  return (
    <div className="page-grid">
      <section className="hero-band">
        <div>
          <p className="eyebrow">Good morning, {snapshot.admin.name}</p>
          <h2>Keep today smooth: check attendance, pressure, waitlists, and failed payments before the evening rush.</h2>
          <p>{snapshot.studio.bookingRules}</p>
        </div>
        <button className="btn-secondary" onClick={() => onNavigate("schedule")}>View calendar</button>
      </section>

      <div className="metric-grid">
        <Metric label="Revenue this month" value={formatIls(snapshot.stats.revenueMonth)} note="Answers: are we on target?" />
        <Metric label="Attendance rate" value={`${snapshot.stats.attendanceRate}%`} note="Answers: are bookings turning into visits?" tone="sage" />
        <Metric label="Active members" value={String(snapshot.stats.activeMembers)} note="Answers: is recurring revenue healthy?" tone="teal" />
        <Metric label="Capacity pressure" value={`${snapshot.stats.capacityPressure}%`} note="Answers: where do rooms feel tight?" tone="amber" />
      </div>

      <section className="content-card span-2">
        <SectionHead title="Today's classes" action="Schedule" onAction={() => onNavigate("schedule")} />
        <div className="schedule-list compact">
          {todayClasses.map((session) => <ClassRow key={session.id} session={session} onClick={() => onClass(session)} />)}
        </div>
      </section>

      <section className="content-card">
        <SectionHead title="Attention needed" />
        <div className="task-list">
          {snapshot.tasks.map((task) => (
            <button key={task.id} className={`task-card tone-${task.tone}`} onClick={() => onToast(task.title)}>
              <strong>{task.title}</strong>
              <span>{task.detail}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="content-card">
        <SectionHead title="Recent bookings" action="Manage" onAction={() => onNavigate("bookings")} />
        {snapshot.bookings.slice(0, 5).map((booking) => {
          const member = snapshot.members.find((item) => item.id === booking.memberId);
          const session = snapshot.classes.find((item) => item.id === booking.classId);
          if (!member || !session) return null;
          return <BookingLine key={booking.id} booking={booking} member={member} session={session} onClient={() => onClient(member)} />;
        })}
      </section>

      <section className="content-card">
        <SectionHead title="Capacity pressure" />
        {snapshot.analytics.topClasses.map(([name, value]) => <BarLine key={name} label={name} value={value} />)}
      </section>
    </div>
  );
}

function Schedule({
  snapshot,
  selectedDay,
  onDay,
  onClass,
}: {
  snapshot: StudioSnapshot;
  selectedDay: string;
  onDay: (day: string) => void;
  onClass: (session: StudioClass) => void;
}) {
  const daySchedule = getDaySchedule(snapshot, selectedDay);

  return (
    <div className="page-stack">
      <section className="content-card">
        <SectionHead title="Week schedule" action="Add class" />
        <div className="day-strip">
          {days.map((day, index) => (
            <button key={day} className={selectedDay === day ? "selected" : ""} onClick={() => onDay(day)}>
              <span>{day}</span>
              <strong>{21 + index}</strong>
            </button>
          ))}
        </div>
        <div className="calendar-grid">
          {["07:00", "09:00", "11:00", "13:00", "17:00", "19:00"].map((slot) => (
            <div className="time-slot" key={slot}>
              <span>{slot}</span>
              <div>
                {daySchedule
                  .filter((session) => session.time >= slot && session.time < `${String(Number(slot.slice(0, 2)) + 2).padStart(2, "0")}:00`)
                  .map((session) => <ClassBlock key={session.id} session={session} onClick={() => onClass(session)} />)}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="content-card">
        <SectionHead title="List view" />
        <div className="schedule-list">
          {daySchedule.length ? daySchedule.map((session) => <ClassRow key={session.id} session={session} onClick={() => onClass(session)} />) : <EmptyState title="No classes on this day" body="Add your first class to start building the weekly schedule." />}
        </div>
      </section>
    </div>
  );
}

function Classes({ snapshot, query, onClass }: { snapshot: StudioSnapshot; query: string; onClass: (session: StudioClass) => void }) {
  const visible = useMemo(() => {
    const needle = query.toLowerCase();
    return snapshot.classes.filter((session) => [session.name, session.type, session.instructor.name, session.studio].join(" ").toLowerCase().includes(needle));
  }, [query, snapshot.classes]);

  return (
    <div className="class-grid">
      {visible.map((session) => (
        <article className={`class-card tone-${session.color}`} key={session.id}>
          <div className="class-card-head">
            <Badge tone={capacityTone(session.registered, session.capacity)}>{session.status}</Badge>
            <span>{session.time}-{session.endTime}</span>
          </div>
          <h2>{session.name}</h2>
          <p>{session.description}</p>
          <div className="detail-grid">
            <SmallDetail label="Instructor" value={session.instructor.name} />
            <SmallDetail label="Room" value={session.studio} />
            <SmallDetail label="Level" value={session.level} />
            <SmallDetail label="Price" value={formatIls(session.price)} />
          </div>
          <CapacityBar session={session} />
          <button className="btn-secondary" onClick={() => onClass(session)}>Open details</button>
        </article>
      ))}
    </div>
  );
}

function Bookings({
  snapshot,
  query,
  filter,
  onFilter,
  onClass,
  onClient,
  onToast,
}: {
  snapshot: StudioSnapshot;
  query: string;
  filter: string;
  onFilter: (value: string) => void;
  onClass: (session: StudioClass) => void;
  onClient: (member: StudioMember) => void;
  onToast: (message: string) => void;
}) {
  const rows = snapshot.bookings
    .map((booking) => ({
      booking,
      member: snapshot.members.find((member) => member.id === booking.memberId),
      session: snapshot.classes.find((session) => session.id === booking.classId),
    }))
    .filter((row): row is { booking: BookingRecord; member: StudioMember; session: StudioClass } => Boolean(row.member && row.session))
    .filter(({ booking, member, session }) => {
      const needle = query.toLowerCase();
      const matchesQuery = [member.name, session.name, booking.status, booking.paymentStatus].join(" ").toLowerCase().includes(needle);
      return matchesQuery && (filter === "All" || booking.status === filter);
    });

  return (
    <section className="content-card">
      <SectionHead title="Booking management" action="Export" onAction={() => onToast("CSV export started")} />
      <ChipRow values={statusFilters} active={filter} onChange={onFilter} />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Class</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ booking, member, session }) => (
              <tr key={booking.id}>
                <td><button className="table-link" onClick={() => onClient(member)}>{member.name}</button></td>
                <td><button className="table-link" onClick={() => onClass(session)}>{session.name}<small>{session.date} · {session.time}</small></button></td>
                <td><Badge tone={statusTone(booking.status)}>{booking.status.replace("_", " ")}</Badge></td>
                <td>{booking.paymentStatus} · {booking.membershipUsed}</td>
                <td className="table-actions">
                  <button onClick={() => onToast("Move booking opened")}>Move</button>
                  <button onClick={() => onToast("Message queued")}>Message</button>
                  <button onClick={() => onToast("Refund placeholder opened")}>Refund</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Clients({ snapshot, query, onClient }: { snapshot: StudioSnapshot; query: string; onClient: (member: StudioMember) => void }) {
  const visible = snapshot.members.filter((member) => [member.name, member.email, member.phone, member.tags.join(" ")].join(" ").toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="client-grid">
      {visible.map((member) => (
        <button key={member.id} className="client-card" onClick={() => onClient(member)}>
          <Avatar label={member.name} tone={member.status === "Expired" ? "red" : member.status === "Paused" ? "amber" : "sage"} />
          <span>
            <strong>{member.name}</strong>
            <small>{member.email}</small>
          </span>
          <Badge tone={member.tags.includes("At Risk") ? "red" : member.tags.includes("VIP") ? "gold" : "green"}>{member.tags[0]}</Badge>
          <SmallDetail label="Membership" value={member.plan} />
          <SmallDetail label="Attendance" value={`${member.attended} visits`} />
          <SmallDetail label="No-shows" value={String(member.noShows)} />
        </button>
      ))}
    </div>
  );
}

function Instructors({ snapshot }: { snapshot: StudioSnapshot }) {
  return (
    <div className="class-grid">
      {snapshot.instructors.map((instructor) => (
        <article className={`content-card instructor-card tone-${instructor.color}`} key={instructor.id}>
          <div className="instructor-head">
            <Avatar label={instructor.name} tone={instructor.color} />
            <span>
              <h2>{instructor.name}</h2>
              <small>{instructor.status}</small>
            </span>
          </div>
          <p>{instructor.bio}</p>
          <div className="chip-row static">
            {instructor.specialties.map((specialty) => <span key={specialty}>{specialty}</span>)}
          </div>
          <BarLine label="Utilization" value={instructor.utilization} />
          <SmallDetail label="Availability" value={instructor.availability} />
          <SmallDetail label="Contact" value={instructor.email} />
        </article>
      ))}
    </div>
  );
}

function Memberships({ snapshot, onToast }: { snapshot: StudioSnapshot; onToast: (message: string) => void }) {
  return (
    <div className="class-grid">
      {snapshot.memberships.map((plan) => (
        <article className="membership-card" key={plan.id}>
          <Badge tone={plan.status === "Draft" ? "gold" : "green"}>{plan.status}</Badge>
          <h2>{plan.name}</h2>
          <strong>{formatIls(plan.price)}</strong>
          <p>{plan.billingCycle} · {plan.credits === null ? "unlimited credits" : `${plan.credits} credits`}</p>
          <SmallDetail label="Active members" value={String(plan.activeMembers)} />
          <div className="split-actions">
            <button className="btn-secondary" onClick={() => onToast("Plan editor opened")}>Edit plan</button>
            <button className="btn-primary" onClick={() => onToast("Pause/cancel controls are placeholders")}>Manage</button>
          </div>
        </article>
      ))}
    </div>
  );
}

function Payments({ snapshot, query, onToast }: { snapshot: StudioSnapshot; query: string; onToast: (message: string) => void }) {
  const visible = snapshot.payments.filter((payment) => [payment.member, payment.type, payment.status, payment.method].join(" ").toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="page-stack">
      <div className="metric-grid">
        <Metric label="Gross revenue" value={formatIls(snapshot.payments.filter((p) => p.amount > 0).reduce((sum, p) => sum + p.amount, 0))} note="Paid transactions only" />
        <Metric label="Failed payments" value="3" note="Needs front-desk follow-up" tone="red" />
        <Metric label="Refunded" value={formatIls(150)} note="This month" tone="amber" />
      </div>
      <section className="content-card">
        <SectionHead title="Payment ledger" action="Export" onAction={() => onToast("Payment export started")} />
        {visible.map((payment) => (
          <div className="payment-row" key={payment.id}>
            <span className={payment.amount < 0 ? "amount negative" : "amount positive"}>{payment.amount < 0 ? "-" : "+"}{formatIls(payment.amount)}</span>
            <span>
              <strong>{payment.member}</strong>
              <small>{payment.type} · {payment.method} · {payment.date}</small>
            </span>
            <Badge tone={payment.status === "Failed" ? "red" : payment.status.includes("refund") ? "gold" : "green"}>{payment.status}</Badge>
            <button onClick={() => onToast("Refund placeholder opened")}>Refund</button>
          </div>
        ))}
      </section>
    </div>
  );
}

function Attendance({ snapshot, onToast }: { snapshot: StudioSnapshot; onToast: (message: string) => void }) {
  return (
    <section className="content-card">
      <SectionHead title="Today roster" action="Add walk-in" onAction={() => onToast("Walk-in add opened")} />
      {snapshot.attendance.map((record) => {
        const member = snapshot.members.find((item) => item.id === record.memberId);
        const session = snapshot.classes.find((item) => item.id === record.classId);
        if (!member || !session) return null;
        return (
          <div className="attendance-row" key={record.id}>
            <Avatar label={member.name} tone={record.status === "no_show" ? "red" : record.status === "checked_in" ? "sage" : "amber"} />
            <span>
              <strong>{member.name}</strong>
              <small>{session.name} · {session.time} · {record.note}</small>
            </span>
            <Badge tone={statusTone(record.status)}>{record.status.replace("_", " ")}</Badge>
            <div className="table-actions">
              <button onClick={() => onToast("Marked checked in")}>Check in</button>
              <button onClick={() => onToast("Marked no-show")}>No-show</button>
              <button onClick={() => onToast("Promote next waitlisted client")}>Promote</button>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function Analytics({ snapshot }: { snapshot: StudioSnapshot }) {
  return (
    <div className="page-grid">
      <section className="content-card span-2">
        <SectionHead title="Revenue trend" />
        <div className="chart-bars">
          {snapshot.analytics.revenue.map((value, index) => <span key={value} style={{ height: `${Math.max(24, value / 260)}px` }} data-label={`W${index + 1}`} />)}
        </div>
      </section>
      <Metric label="Attendance trend" value={`${snapshot.analytics.attendanceRate}%`} note="Stable vs last week" tone="sage" />
      <Metric label="Capacity utilization" value={`${snapshot.analytics.capacityUtilization}%`} note="Peak rooms need relief" tone="amber" />
      <Metric label="Membership growth" value={`+${snapshot.analytics.membershipGrowth}%`} note="New packs drive growth" tone="teal" />
      <Metric label="At-risk members" value={String(snapshot.analytics.churnRisk)} note="No visit in 14+ days" tone="red" />
      <section className="content-card">
        <SectionHead title="Top classes" />
        {snapshot.analytics.topClasses.map(([label, value]) => <BarLine key={label} label={label} value={value} />)}
      </section>
      <section className="content-card">
        <SectionHead title="Instructor utilization" />
        {snapshot.analytics.instructorUtilization.map(([label, value]) => <BarLine key={label} label={label} value={value} />)}
      </section>
    </div>
  );
}

function Messages({ snapshot, onToast }: { snapshot: StudioSnapshot; onToast: (message: string) => void }) {
  const templates = [
    ["Waitlist promotion", "Good news, a spot opened in Pilates Sculpt. Please confirm within 45 minutes."],
    ["Failed payment", "Your renewal did not go through. Update your card to keep booking without interruption."],
    ["Class reminder", "Morning Flow starts tomorrow at 07:30. Cancel up to 6 hours before class."],
  ];

  return (
    <section className="content-card">
      <SectionHead title="Messages and notifications" action="Send test" onAction={() => onToast("Test message queued")} />
      {templates.map(([title, body]) => (
        <article className="message-card" key={title}>
          <Badge tone="green">Email · SMS · In-app</Badge>
          <h2>{title}</h2>
          <p>{body}</p>
          <button className="btn-secondary" onClick={() => onToast(`${title} queued`)}>Use template</button>
        </article>
      ))}
      <SmallDetail label="Notification defaults" value={`${snapshot.settings.whatsAppReminders ? "WhatsApp on" : "WhatsApp off"} · ${snapshot.settings.pushNotifications ? "Push on" : "Push off"}`} />
    </section>
  );
}

function Settings({ snapshot, onToast }: { snapshot: StudioSnapshot; onToast: (message: string) => void }) {
  return (
    <div className="settings-grid">
      <SettingsPanel title="Studio profile">
        <FormField label="Studio name" defaultValue={snapshot.studio.name} />
        <FormField label="Location" defaultValue={snapshot.studio.location} />
        <FormField label="Timezone" defaultValue={snapshot.studio.timezone} />
      </SettingsPanel>
      <SettingsPanel title="Rooms">
        {snapshot.studio.rooms.map((room) => <SmallDetail key={room.id} label={room.name} value={`${room.capacity} capacity`} />)}
      </SettingsPanel>
      <SettingsPanel title="Booking rules">
        <FormField label="Cancellation window" defaultValue={String(snapshot.settings.cancelDeadline)} />
        <label className="toggle-line"><input type="checkbox" defaultChecked={Boolean(snapshot.settings.waitlistAutoEnroll)} /> Waitlist auto-promote</label>
        <p>{snapshot.studio.cancellationPolicy}</p>
      </SettingsPanel>
      <SettingsPanel title="Payments and team">
        <FormField label="Payment provider" defaultValue="Stripe placeholder" />
        <FormField label="Team roles" defaultValue="Owner, Admin, Instructor, Front desk" />
        <button className="btn-primary" onClick={() => onToast("Settings saved")}>Save settings</button>
      </SettingsPanel>
    </div>
  );
}

function ClassDrawer({ session, snapshot, onClose, onToast }: { session: StudioClass; snapshot: StudioSnapshot; onClose: () => void; onToast: (message: string) => void }) {
  const bookings = getClassBookings(snapshot, session.id);
  const similar = snapshot.classes.filter((item) => item.type === session.type && item.id !== session.id).slice(0, 3);

  return (
    <Drawer title={session.name} onClose={onClose}>
      <p>{session.description}</p>
      <div className="detail-grid">
        <SmallDetail label="Time" value={`${session.date} · ${session.time}-${session.endTime}`} />
        <SmallDetail label="Instructor" value={session.instructor.name} />
        <SmallDetail label="Room" value={session.studio} />
        <SmallDetail label="Level" value={session.level} />
        <SmallDetail label="Capacity" value={`${session.registered}/${session.capacity} · ${session.waitlist} waitlist`} />
        <SmallDetail label="Price" value={formatIls(session.price)} />
      </div>
      <CapacityBar session={session} />
      <div className="policy-box">
        <strong>Booking policy</strong>
        <p>Cancel up to {session.cancelDeadlineHours} hours before class. Eligible: {session.eligiblePlans.join(", ")}.</p>
      </div>
      <SectionHead title="What to bring" />
      <div className="chip-row static">{session.bring.map((item) => <span key={item}>{item}</span>)}</div>
      <SectionHead title="Roster" />
      {bookings.map((booking) => <BookingLine key={booking.id} booking={booking} member={booking.member} session={session} />)}
      <SectionHead title="Similar upcoming classes" />
      {similar.map((item) => <ClassRow key={item.id} session={item} onClick={() => onToast(`${item.name} opened`)} />)}
      <div className="sticky-actions">
        <button className="btn-secondary" onClick={() => onToast("Class draft saved")}>Save draft</button>
        <button className="btn-primary" onClick={() => onToast("Class published")}>{classAction(session)}</button>
      </div>
    </Drawer>
  );
}

function ClientDrawer({ member, snapshot, onClose, onToast }: { member: StudioMember; snapshot: StudioSnapshot; onClose: () => void; onToast: (message: string) => void }) {
  const bookings = getMemberBookings(snapshot, member.id);

  return (
    <Drawer title={member.name} onClose={onClose}>
      <div className="profile-summary">
        <Avatar label={member.name} tone={member.tags.includes("At Risk") ? "red" : "sage"} />
        <span>
          <strong>{member.email}</strong>
          <small>{member.phone}</small>
        </span>
      </div>
      <div className="chip-row static">{member.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="detail-grid">
        <SmallDetail label="Membership" value={member.plan} />
        <SmallDetail label="Credits" value={getMemberCreditsLabel(member)} />
        <SmallDetail label="Attendance" value={`${member.attended} visits`} />
        <SmallDetail label="No-shows" value={String(member.noShows)} />
        <SmallDetail label="Last visit" value={member.lastVisit} />
        <SmallDetail label="Renewal" value={member.renewal} />
      </div>
      <SectionHead title="Upcoming bookings" />
      {bookings.length ? bookings.map((booking) => booking.session && <ClassRow key={booking.id} session={booking.session} />) : <EmptyState title="No upcoming bookings yet" body="Book a class for this client from the front desk." />}
      <SectionHead title="Notes" />
      <textarea className="input-field notes" defaultValue={member.notes} onBlur={() => onToast("Client notes saved")} />
      <div className="sticky-actions">
        <button className="btn-secondary" onClick={() => onToast("Message composer opened")}>Message</button>
        <button className="btn-primary" onClick={() => onToast("Booking flow opened")}>Book for client</button>
      </div>
    </Drawer>
  );
}

function ClassFormDrawer({ snapshot, onClose, onToast }: { snapshot: StudioSnapshot; onClose: () => void; onToast: (message: string) => void }) {
  return (
    <Drawer title="Create class" onClose={onClose}>
      <form className="form-grid" onSubmit={(event) => { event.preventDefault(); onToast("Class saved"); onClose(); }}>
        <FormField label="Class name" defaultValue="Morning Flow" />
        <SelectField label="Class type" values={["Yoga", "Pilates", "Mobility", "Strength", "Recovery"]} />
        <FormField label="Date" type="date" />
        <FormField label="Start time" type="time" />
        <FormField label="Duration" defaultValue="60" />
        <SelectField label="Instructor" values={snapshot.instructors.map((item) => item.name)} />
        <SelectField label="Room" values={snapshot.studio.rooms.map((item) => item.name)} />
        <FormField label="Capacity" type="number" defaultValue="14" />
        <SelectField label="Recurrence" values={["Does not repeat", "Weekly", "Every 2 weeks", "Custom"]} />
        <SelectField label="Level" values={["Beginner", "All levels", "Intermediate", "Advanced"]} />
        <FormField label="Price" type="number" defaultValue="95" />
        <FormField label="Cancellation window" defaultValue="6 hours" />
        <label className="field span-all">
          <span>Description</span>
          <textarea className="input-field notes" placeholder="Describe the class in plain human language." required />
        </label>
        <div className="sticky-actions span-all">
          <button className="btn-secondary" type="button" onClick={() => onToast("Draft saved")}>Save draft</button>
          <button className="btn-primary" type="submit">Publish</button>
        </div>
      </form>
    </Drawer>
  );
}

function BookingDrawer({ snapshot, onClose, onToast }: { snapshot: StudioSnapshot; onClose: () => void; onToast: (message: string) => void }) {
  return (
    <Drawer title="Book for client" onClose={onClose}>
      <form className="form-grid" onSubmit={(event) => { event.preventDefault(); onToast("You're booked. We saved your mat."); onClose(); }}>
        <SelectField label="Client" values={snapshot.members.map((item) => item.name)} />
        <SelectField label="Class" values={snapshot.classes.map((item) => `${item.name} · ${item.time}`)} />
        <SelectField label="Membership/pass" values={["Use active membership", "10-class pack", "Drop-in payment", "Front-desk comp"]} />
        <div className="policy-box span-all">
          <strong>Capacity changed?</strong>
          <p>If the class fills before confirmation, this booking becomes waitlisted and the client gets a clear notice.</p>
        </div>
        <label className="toggle-line span-all"><input type="checkbox" required /> Client acknowledged the cancellation policy.</label>
        <button className="btn-primary span-all" type="submit">Confirm booking</button>
      </form>
    </Drawer>
  );
}

function Metric({ label, value, note, tone = "gold" }: { label: string; value: string; note: string; tone?: string }) {
  return (
    <article className={`metric-card tone-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

function ClassRow({ session, onClick }: { session: StudioClass; onClick?: () => void }) {
  return (
    <button className="class-row" onClick={onClick}>
      <span className="time-pill">{session.time}</span>
      <span>
        <strong>{session.name}</strong>
        <small>{session.instructor.name} · {session.studio} · {session.level}</small>
      </span>
      <Badge tone={capacityTone(session.registered, session.capacity)}>{session.registered >= session.capacity ? "Full" : `${session.capacity - session.registered} spots`}</Badge>
      <CapacityBar session={session} compact />
    </button>
  );
}

function ClassBlock({ session, onClick }: { session: StudioClass; onClick: () => void }) {
  return (
    <button className={`class-block tone-${session.color}`} onClick={onClick}>
      <strong>{session.name}</strong>
      <small>{session.instructor.name} · {session.registered}/{session.capacity}</small>
    </button>
  );
}

function BookingLine({ booking, member, session, onClient }: { booking: BookingRecord; member: StudioMember; session: StudioClass; onClient?: () => void }) {
  return (
    <div className="booking-line">
      <button className="avatar-button" onClick={onClient} aria-label={`Open ${member.name}`}>
        <Avatar label={member.name} tone={member.tags.includes("At Risk") ? "red" : "sage"} />
      </button>
      <span>
        <strong>{member.name}</strong>
        <small>{session.name} · {session.time} · {booking.membershipUsed}</small>
      </span>
      <Badge tone={statusTone(booking.status)}>{booking.status.replace("_", " ")}</Badge>
    </div>
  );
}

function CapacityBar({ session, compact = false }: { session: StudioClass; compact?: boolean }) {
  return (
    <div className={`capacity-bar ${compact ? "compact" : ""}`}>
      <span className={`fill ${capacityTone(session.registered, session.capacity)}`} style={{ width: `${capacityPercent(session.registered, session.capacity)}%` }} />
    </div>
  );
}

function BarLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="bar-line">
      <span>{label}</span>
      <strong>{value}%</strong>
      <div><i style={{ width: `${value}%` }} /></div>
    </div>
  );
}

function Avatar({ label, tone }: { label: string; tone: string }) {
  return <span className={`avatar tone-${tone}`}>{initials(label)}</span>;
}

function Badge({ tone, children }: { tone: string; children: ReactNode }) {
  return <span className={`badge tone-${tone}`}>{children}</span>;
}

function SectionHead({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="section-head">
      <h2>{title}</h2>
      {action && <button onClick={onAction}>{action}</button>}
    </div>
  );
}

function SmallDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="small-detail">
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

function ChipRow({ values, active, onChange }: { values: string[]; active: string; onChange: (value: string) => void }) {
  return (
    <div className="chip-row">
      {values.map((value) => (
        <button key={value} className={value === active ? "active" : ""} onClick={() => onChange(value)}>{value}</button>
      ))}
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <span>{body}</span>
    </div>
  );
}

function Drawer({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside className="drawer" onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <h2>{title}</h2>
          <button onClick={onClose} aria-label="Close drawer">×</button>
        </header>
        <div className="drawer-body">{children}</div>
      </aside>
    </div>
  );
}

function SettingsPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="content-card">
      <SectionHead title={title} />
      <div className="form-stack">{children}</div>
    </section>
  );
}

function FormField({ label, type = "text", defaultValue = "" }: { label: string; type?: string; defaultValue?: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input className="input-field" type={type} defaultValue={defaultValue} required />
    </label>
  );
}

function SelectField({ label, values }: { label: string; values: string[] }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select className="input-field" required>
        {values.map((value) => <option key={value}>{value}</option>)}
      </select>
    </label>
  );
}

function statusTone(status: string) {
  if (["failed", "no_show", "cancelled", "Cancelled"].includes(status)) return "red";
  if (["waitlisted", "pending", "not_arrived"].includes(status)) return "gold";
  return "green";
}
