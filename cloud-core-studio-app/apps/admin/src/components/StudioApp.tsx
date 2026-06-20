"use client";

import { useMemo, useState } from "react";
import {
  buildStudioSnapshot,
  capacityPercent,
  capacityTone,
  formatIls,
  getClassBookings,
  getDaySchedule,
  getMemberCreditsLabel,
  initials,
  type StudioClass,
  type StudioMember,
  type StudioSnapshot,
} from "@/lib/studioApp.mjs";

type Screen =
  | "admin-home"
  | "admin-schedule"
  | "admin-members"
  | "admin-member"
  | "admin-class"
  | "admin-class-form"
  | "admin-payments"
  | "admin-settings"
  | "member-home"
  | "member-browse";

const adminNav: Array<{ screen: Screen; icon: string; label: string }> = [
  { screen: "admin-home", icon: "⌂", label: "Home" },
  { screen: "admin-schedule", icon: "◷", label: "Schedule" },
  { screen: "admin-members", icon: "◇", label: "Members" },
  { screen: "admin-payments", icon: "₪", label: "Payments" },
  { screen: "admin-settings", icon: "⚙", label: "Settings" },
];

const memberNav: Array<{ screen: Screen; icon: string; label: string }> = [
  { screen: "member-home", icon: "⌂", label: "Home" },
  { screen: "member-browse", icon: "◷", label: "Browse" },
  { screen: "member-home", icon: "↺", label: "History" },
  { screen: "member-home", icon: "○", label: "Profile" },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const filters = ["All", "Active", "Monthly", "10-class pack", "Annual", "Expired"];
const categories = ["All", "Yoga", "Pilates", "Dance", "Meditation", "Cardio"];

export function StudioApp({ initialScreen = "admin-home" }: { initialScreen?: Screen } = {}) {
  const [snapshot] = useState<StudioSnapshot>(() => buildStudioSnapshot());
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [selectedDay, setSelectedDay] = useState("Fri");
  const [selectedClassId, setSelectedClassId] = useState("class-1");
  const [selectedMemberId, setSelectedMemberId] = useState("mem-1");
  const [memberFilter, setMemberFilter] = useState("All");
  const [memberSearch, setMemberSearch] = useState("");
  const [classSearch, setClassSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [modal, setModal] = useState<null | "qr" | "booking" | "cancel">(null);
  const [toast, setToast] = useState("");

  const selectedClass = snapshot.classes.find((item) => item.id === selectedClassId) ?? snapshot.classes[0];
  const selectedMember = snapshot.members.find((item) => item.id === selectedMemberId) ?? snapshot.members[0];
  const isMemberMode = screen.startsWith("member");

  function openClass(session: StudioClass) {
    setSelectedClassId(session.id);
    setScreen("admin-class");
  }

  function openMember(member: StudioMember) {
    setSelectedMemberId(member.id);
    setScreen("admin-member");
  }

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  return (
    <div className="studio-stage">
      <div className="phone-shell">
        <div className="phone-notch" />
        <StatusBar />

        {screen === "admin-home" && (
          <AdminHome snapshot={snapshot} onNavigate={setScreen} onClass={openClass} onModal={setModal} />
        )}
        {screen === "admin-schedule" && (
          <AdminSchedule
            snapshot={snapshot}
            selectedDay={selectedDay}
            onDay={setSelectedDay}
            onClass={openClass}
            onNew={() => setScreen("admin-class-form")}
          />
        )}
        {screen === "admin-members" && (
          <AdminMembers
            snapshot={snapshot}
            filter={memberFilter}
            search={memberSearch}
            onFilter={setMemberFilter}
            onSearch={setMemberSearch}
            onMember={openMember}
            onNew={() => setScreen("admin-member")}
          />
        )}
        {screen === "admin-member" && (
          <AdminMemberProfile
            member={selectedMember}
            snapshot={snapshot}
            onBack={() => setScreen("admin-members")}
            onToast={notify}
          />
        )}
        {screen === "admin-class" && (
          <AdminClassDetail
            session={selectedClass}
            snapshot={snapshot}
            onBack={() => setScreen("admin-schedule")}
            onEdit={() => setScreen("admin-class-form")}
            onToast={notify}
          />
        )}
        {screen === "admin-class-form" && (
          <AdminClassForm snapshot={snapshot} onCancel={() => setScreen("admin-schedule")} onSave={() => {
            notify("Class saved");
            setScreen("admin-schedule");
          }} />
        )}
        {screen === "admin-payments" && <AdminPayments snapshot={snapshot} onToast={notify} />}
        {screen === "admin-settings" && <AdminSettings snapshot={snapshot} onToast={notify} onMember={() => setScreen("member-home")} />}
        {screen === "member-home" && (
          <MemberHome
            snapshot={snapshot}
            onBrowse={() => setScreen("member-browse")}
            onCancel={() => setModal("cancel")}
            onBook={() => setModal("booking")}
          />
        )}
        {screen === "member-browse" && (
          <MemberBrowse
            snapshot={snapshot}
            search={classSearch}
            category={category}
            onSearch={setClassSearch}
            onCategory={setCategory}
            onBook={() => setModal("booking")}
          />
        )}

        <BottomNav mode={isMemberMode ? "member" : "admin"} active={screen} onNavigate={setScreen} />
        {modal && <Modal type={modal} session={selectedClass} onClose={() => setModal(null)} onToast={notify} />}
        {toast && <div className="toast">{toast}</div>}
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="status-bar">
      <strong>09:41</strong>
      <span>●●● 5G ▰</span>
    </div>
  );
}

function TopBar({
  title,
  subtitle,
  back,
  action,
}: {
  title: string;
  subtitle?: string;
  back?: () => void;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <header className="top-bar">
      <div>
        {back ? (
          <button className="back-btn" onClick={back}>
            ‹ Back
          </button>
        ) : (
          <h1>{title}</h1>
        )}
        {back && <h1>{title}</h1>}
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action && (
        <button className="icon-btn" aria-label={action.label} onClick={action.onClick}>
          +
        </button>
      )}
    </header>
  );
}

function AdminHome({
  snapshot,
  onNavigate,
  onClass,
  onModal,
}: {
  snapshot: StudioSnapshot;
  onNavigate: (screen: Screen) => void;
  onClass: (session: StudioClass) => void;
  onModal: (modal: "qr") => void;
}) {
  const todayClasses = getDaySchedule(snapshot, "Fri").slice(0, 5);

  return (
    <main className="screen active">
      <section className="home-greeting">
        <div>
          <h2>Good morning, {snapshot.admin.name}</h2>
          <p>{snapshot.today}</p>
        </div>
        <Avatar label={snapshot.admin.name} size="md" tone="gold" />
      </section>
      <div className="scroll-area">
        <div className="content-pad">
          <div className="stats-row">
            <StatCard label="Members" value={String(snapshot.stats.totalMembers)} />
            <StatCard label="Today" value={String(snapshot.stats.bookingsToday)} />
            <StatCard label="Revenue" value={formatIls(snapshot.stats.revenueMonth)} />
          </div>
          <div className="quick-actions">
            <QuickAction icon="+" label="Add class" onClick={() => onNavigate("admin-class-form")} />
            <QuickAction icon="◇" label="Add member" onClick={() => onNavigate("admin-members")} />
            <QuickAction icon="▦" label="QR Check-in" onClick={() => onModal("qr")} />
            <QuickAction icon="₪" label="Reports" onClick={() => onNavigate("admin-payments")} />
          </div>
          <SectionTitle title="Today's classes" action="View week" onAction={() => onNavigate("admin-schedule")} />
          <div className="stack">
            {todayClasses.map((session) => (
              <ClassCard key={session.id} session={session} onClick={() => onClass(session)} />
            ))}
          </div>
          <SectionTitle title="Recent activity" />
          <div className="card card-pad">
            {snapshot.activity.slice(0, 10).map((item, index) => (
              <ActivityItem key={item} item={item} muted={`${index + 1}m ago`} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function AdminSchedule({
  snapshot,
  selectedDay,
  onDay,
  onClass,
  onNew,
}: {
  snapshot: StudioSnapshot;
  selectedDay: string;
  onDay: (day: string) => void;
  onClass: (session: StudioClass) => void;
  onNew: () => void;
}) {
  const schedule = getDaySchedule(snapshot, selectedDay);

  return (
    <main className="screen active">
      <TopBar title="Schedule" subtitle="Week view" action={{ label: "Add class", onClick: onNew }} />
      <div className="day-strip">
        {days.map((day) => (
          <button key={day} className={`day ${day === "Fri" ? "today" : ""} ${day === selectedDay ? "selected" : ""}`} onClick={() => onDay(day)}>
            <span>{day}</span>
            <strong>{day === "Fri" ? "20" : day === "Sat" ? "21" : day === "Sun" ? "22" : "19"}</strong>
          </button>
        ))}
      </div>
      <div className="scroll-area">
        <div className="content-pad">
          {schedule.length ? schedule.map((session) => <ClassCard key={session.id} session={session} detailed onClick={() => onClass(session)} />) : <EmptyState title="No classes" action="Add a class" />}
        </div>
      </div>
    </main>
  );
}

function AdminMembers({
  snapshot,
  filter,
  search,
  onFilter,
  onSearch,
  onMember,
  onNew,
}: {
  snapshot: StudioSnapshot;
  filter: string;
  search: string;
  onFilter: (value: string) => void;
  onSearch: (value: string) => void;
  onMember: (member: StudioMember) => void;
  onNew: () => void;
}) {
  const visible = useMemo(() => {
    const query = search.toLowerCase();
    return snapshot.members.filter((member) => {
      const matchesQuery = [member.name, member.email, member.phone].some((value) => value.toLowerCase().includes(query));
      const matchesFilter =
        filter === "All" ||
        member.status === filter ||
        member.planType === filter ||
        (filter === "Expired" && member.status === "Expired");
      return matchesQuery && matchesFilter;
    });
  }, [filter, search, snapshot.members]);

  return (
    <main className="screen active">
      <TopBar title="Members" subtitle={`${visible.length} visible`} action={{ label: "Add member", onClick: onNew }} />
      <div className="scroll-area">
        <div className="content-pad">
          <input className="input-field search" value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search name, email, phone" />
          <ChipRow values={filters} active={filter} onChange={onFilter} />
          <div className="card">
            {visible.map((member) => (
              <button className="member-row" key={member.id} onClick={() => onMember(member)}>
                <Avatar label={member.name} tone={member.planType === "Monthly" ? "blue" : member.planType === "Annual" ? "gold" : "sand"} size="sm" />
                <span>
                  <strong>{member.name}</strong>
                  <small>{member.plan} · {member.attended} attended</small>
                </span>
                <span className="member-meta">
                  <Pill tone={member.status === "Expired" ? "red" : member.status === "Paused" ? "sand" : "green"}>{member.status}</Pill>
                  <small>{getMemberCreditsLabel(member)}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function AdminMemberProfile({
  member,
  snapshot,
  onBack,
  onToast,
}: {
  member: StudioMember;
  snapshot: StudioSnapshot;
  onBack: () => void;
  onToast: (message: string) => void;
}) {
  const upcoming = snapshot.classes.slice(0, 3);

  return (
    <main className="screen active">
      <TopBar title="Member profile" back={onBack} />
      <div className="scroll-area">
        <div className="content-pad">
          <section className="profile-head card-pad card">
            <Avatar label={member.name} size="lg" tone="gold" />
            <h2>{member.name}</h2>
            <p>{member.email}</p>
            <p>{member.phone}</p>
            <Pill tone="gold">{member.plan}</Pill>
          </section>
          <div className="stat-pills">
            <MiniStat label="Total" value={String(member.attended)} />
            <MiniStat label="Month" value={String(member.month)} />
            <MiniStat label="Credits" value={getMemberCreditsLabel(member)} />
          </div>
          <section className="card card-pad">
            <SectionTitle title="Current plan" />
            <div className="plan-line">
              <strong>{member.plan}</strong>
              <span>{formatIls(member.price)}</span>
            </div>
            <p className="muted">Renews {member.renewal}</p>
            <div className="progress"><span style={{ width: "68%" }} /></div>
            <div className="split-actions">
              <button className="btn-secondary" onClick={() => onToast("Plan paused")}>Pause plan</button>
              <button className="btn-primary" onClick={() => onToast("Renewal created")}>Renew early</button>
            </div>
          </section>
          <section className="card card-pad">
            <SectionTitle title="Upcoming bookings" />
            {upcoming.map((session) => <CompactClass key={session.id} session={session} />)}
          </section>
          <section className="card card-pad">
            <SectionTitle title="Admin notes" />
            <textarea className="input-field notes" defaultValue={member.notes} onBlur={() => onToast("Notes saved")} />
          </section>
        </div>
      </div>
    </main>
  );
}

function AdminClassDetail({
  session,
  snapshot,
  onBack,
  onEdit,
  onToast,
}: {
  session: StudioClass;
  snapshot: StudioSnapshot;
  onBack: () => void;
  onEdit: () => void;
  onToast: (message: string) => void;
}) {
  const bookings = getClassBookings(snapshot, session.id);

  return (
    <main className="screen active">
      <TopBar title="Class detail" back={onBack} action={{ label: "Edit", onClick: onEdit }} />
      <div className="scroll-area">
        <div className="content-pad">
          <section className={`class-detail card card-pad accent-${session.color}`}>
            <h2>{session.name}</h2>
            <p>{session.date} · {session.time}-{session.endTime} · {session.studio}</p>
            <div className="info-grid">
              <MiniStat label="Instructor" value={session.instructor.name} />
              <MiniStat label="Location" value={session.studio} />
              <MiniStat label="Capacity" value={`${session.registered}/${session.capacity}`} />
              <MiniStat label="Duration" value={session.duration} />
            </div>
            <CapacityBar session={session} />
          </section>
          <section className="card card-pad">
            <SectionTitle title="Registered members" />
            {bookings.map((booking) => (
              <div className="attendance-row" key={booking.id}>
                <Avatar label={booking.member.name} size="sm" tone="blue" />
                <span>
                  <strong>{booking.member.name}</strong>
                  <small>{booking.member.plan}</small>
                </span>
                <select className="input-field compact" defaultValue={booking.attendance ?? ""} onChange={() => onToast("Attendance updated")}>
                  <option value="">Not yet</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
            ))}
          </section>
          <section className="card card-pad">
            <SectionTitle title="Waitlist" />
            {session.waitlist ? <p className="muted">{session.waitlist} members waiting. First member auto-promotes after cancellation.</p> : <EmptyState title="No waitlist" />}
          </section>
          <button className="btn-primary" onClick={() => onToast("All members marked present")}>Mark all present</button>
          <button className="btn-secondary" onClick={() => onToast("Reminder queued")}>Send reminder to class</button>
        </div>
      </div>
    </main>
  );
}

function AdminClassForm({ snapshot, onCancel, onSave }: { snapshot: StudioSnapshot; onCancel: () => void; onSave: () => void }) {
  return (
    <main className="screen active">
      <TopBar title="Add class" back={onCancel} />
      <div className="scroll-area">
        <form className="content-pad" onSubmit={(event) => { event.preventDefault(); onSave(); }}>
          <FormField label="Class name" placeholder="Beginner Aerial Yoga" />
          <FormField label="Class type" as="select" values={["Yoga", "Pilates", "Dance", "Meditation", "Cardio", "Strength", "Other"]} />
          <label className="input-group">
            <span className="input-label">Description</span>
            <textarea className="input-field notes" placeholder="Optional notes for members" />
          </label>
          <div className="two-inputs">
            <FormField label="Date" type="date" />
            <FormField label="Capacity" type="number" placeholder="10" />
          </div>
          <div className="two-inputs">
            <FormField label="Start" type="time" />
            <FormField label="End" type="time" />
          </div>
          <FormField label="Studio/location" as="select" values={["Studio A", "Studio B", "Outdoor", "Online"]} />
          <FormField label="Repeat" as="select" values={["Does not repeat", "Every week", "Every 2 weeks", "Custom"]} />
          <FormField label="Instructor" as="select" values={snapshot.instructors.map((instructor) => instructor.name)} />
          <FormField label="Waitlist" as="select" values={["Enabled", "Disabled"]} />
          <FormField label="Cancel deadline" as="select" values={["2h before", "4h before", "12h before", "24h before"]} />
          <ColorDotPicker />
          <button className="btn-primary" type="submit">Save class</button>
          <button className="btn-secondary" type="button" onClick={onCancel}>Cancel</button>
        </form>
      </div>
    </main>
  );
}

function AdminPayments({ snapshot, onToast }: { snapshot: StudioSnapshot; onToast: (message: string) => void }) {
  const activePackages = [
    ["Monthly Unlimited", "4", "₪280", "₪1,120"],
    ["10-class pack", "3", "₪350", "₪1,050"],
    ["Annual", "2", "₪2,800", "₪5,600"],
  ];

  return (
    <main className="screen active">
      <TopBar title="Payments" subtitle="June 2026" action={{ label: "Export", onClick: () => onToast("CSV export started") }} />
      <div className="scroll-area">
        <div className="content-pad">
          <section className="revenue-card">
            <p>Revenue this month</p>
            <strong>{formatIls(snapshot.stats.revenueMonth)}</strong>
            <span>01/06/2026 - 20/06/2026</span>
            <div className="revenue-chips">
              <small>{snapshot.payments.length} transactions</small>
              <small>₪2,300 avg</small>
              <small>2 pending</small>
            </div>
          </section>
          <section className="card card-pad">
            <SectionTitle title="Active packages" />
            {activePackages.map(([plan, count, price, mrr]) => (
              <div className="package-row" key={plan}>
                <strong>{plan}</strong>
                <span>{count} members</span>
                <span>{price}</span>
                <b>{mrr}</b>
              </div>
            ))}
          </section>
          <section className="card">
            {snapshot.payments.map((payment) => (
              <div className="payment-row" key={payment.id}>
                <span className={`pay-icon ${payment.amount < 0 ? "refund" : ""}`}>{payment.amount < 0 ? "−" : "+"}</span>
                <span>
                  <strong>{payment.member}</strong>
                  <small>{payment.type} · {payment.date}</small>
                </span>
                <b className={payment.amount < 0 ? "negative" : "positive"}>{payment.amount < 0 ? "-" : "+"}{formatIls(payment.amount)}</b>
              </div>
            ))}
          </section>
          <div className="gold-banner">In-app payments coming soon</div>
        </div>
      </div>
    </main>
  );
}

function AdminSettings({
  snapshot,
  onToast,
  onMember,
}: {
  snapshot: StudioSnapshot;
  onToast: (message: string) => void;
  onMember: () => void;
}) {
  return (
    <main className="screen active">
      <TopBar title="Settings" subtitle="Studio control" />
      <div className="scroll-area">
        <div className="content-pad">
          <section className="profile-head card card-pad horizontal">
            <Avatar label={snapshot.admin.name} size="md" tone="gold" />
            <span>
              <h2>{snapshot.admin.name}</h2>
              <Pill tone="blue">{snapshot.admin.role}</Pill>
            </span>
          </section>
          <SettingsGroup title="Studio" rows={["Studio profile", "Instructors", "Class packages"]} />
          <section className="card card-pad">
            <SectionTitle title="Notifications" />
            <SettingsRow label="Push notifications" checked onChange={() => onToast("Push notifications updated")} />
            <SettingsRow label="WhatsApp reminders" checked onChange={() => onToast("WhatsApp reminders updated")} />
          </section>
          <section className="card card-pad">
            <SectionTitle title="Booking rules" />
            <label className="input-group">
              <span className="input-label">Cancel deadline</span>
              <select className="input-field" defaultValue={String(snapshot.settings.cancelDeadline)}>
                <option>2h</option>
                <option>4h</option>
                <option>12h</option>
                <option>24h</option>
              </select>
            </label>
            <SettingsRow label="Waitlist auto-enroll" checked onChange={() => onToast("Waitlist setting updated")} />
          </section>
          <section className="card card-pad">
            <SectionTitle title="App" />
            <label className="input-group">
              <span className="input-label">Language</span>
              <select className="input-field" defaultValue="English">
                <option>English</option>
                <option>עברית</option>
                <option>العربية</option>
              </select>
            </label>
            <button className="btn-secondary" onClick={onMember}>Preview member app</button>
            <button className="logout" onClick={() => onToast("Logged out")}>Log out</button>
          </section>
        </div>
      </div>
    </main>
  );
}

function MemberHome({
  snapshot,
  onBrowse,
  onCancel,
  onBook,
}: {
  snapshot: StudioSnapshot;
  onBrowse: () => void;
  onCancel: () => void;
  onBook: () => void;
}) {
  const member = snapshot.member;

  return (
    <main className="screen active">
      <section className="member-hero">
        <div>
          <h2>Hi, {member.name.split(" ")[0]} ☁</h2>
          <p>{member.plan} · {member.status}</p>
        </div>
        <Avatar label={member.name} size="md" tone="gold" />
      </section>
      <div className="scroll-area">
        <div className="content-pad">
          <section className="credits-card">
            <strong>{getMemberCreditsLabel(member)}</strong>
            <span>{member.plan}</span>
            <p>Renews {member.renewal}</p>
            <div className="split-actions">
              <button className="btn-primary" onClick={onBrowse}>Browse classes</button>
              <button className="btn-secondary">My plan</button>
            </div>
          </section>
          <SectionTitle title="My upcoming classes" />
          {snapshot.classes.slice(0, 3).map((session) => (
            <article className="member-class card card-pad" key={session.id}>
              <span className="time-badge">{session.time}</span>
              <strong>{session.name}</strong>
              <small>{session.instructor.name} · {session.studio} · {session.duration}</small>
              <button className="link-button" onClick={onCancel}>Cancel</button>
            </article>
          ))}
          <SectionTitle title="You might like" />
          {snapshot.classes.slice(3, 6).map((session) => (
            <CompactClass key={session.id} session={session} action="Book" onAction={onBook} />
          ))}
          <SectionTitle title="Recent history" />
          <div className="card card-pad">
            {["Core Pilates attended", "Stretch & Flow attended", "Meditation Reset late cancel"].map((item) => <ActivityItem key={item} item={item} muted="June" />)}
          </div>
        </div>
      </div>
    </main>
  );
}

function MemberBrowse({
  snapshot,
  search,
  category,
  onSearch,
  onCategory,
  onBook,
}: {
  snapshot: StudioSnapshot;
  search: string;
  category: string;
  onSearch: (value: string) => void;
  onCategory: (value: string) => void;
  onBook: () => void;
}) {
  const visible = snapshot.classes.filter((session) => {
    const matchesCategory = category === "All" || session.type === category;
    const query = search.toLowerCase();
    const matchesSearch = session.name.toLowerCase().includes(query) || session.instructor.name.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="screen active">
      <TopBar title="Browse classes" subtitle="Book or join waitlist" />
      <div className="scroll-area">
        <div className="content-pad">
          <input className="input-field search" value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search class or instructor" />
          <ChipRow values={categories} active={category} onChange={onCategory} />
          {visible.map((session) => (
            <article className={`class-card card accent-${session.color}`} key={session.id}>
              <div className="class-main">
                <span className="time-badge">{session.time}</span>
                <span>
                  <strong>{session.name}</strong>
                  <small>{session.studio} · {session.instructor.name}</small>
                </span>
              </div>
              <div className="capacity-line">
                <span>{session.registered}/{session.capacity}</span>
                <Pill tone={capacityTone(session.registered, session.capacity)}>{session.registered >= session.capacity ? "Full" : "Spots open"}</Pill>
              </div>
              <button className={session.registered >= session.capacity ? "btn-secondary" : "btn-primary"} onClick={onBook}>
                {session.registered >= session.capacity ? "Join waitlist" : "Book class"}
              </button>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

function BottomNav({ mode, active, onNavigate }: { mode: "admin" | "member"; active: Screen; onNavigate: (screen: Screen) => void }) {
  const items = mode === "admin" ? adminNav : memberNav;

  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button key={`${item.screen}-${item.label}`} className={`nav-item ${active === item.screen ? "active" : ""}`} onClick={() => onNavigate(item.screen)}>
          <span className="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function ClassCard({ session, detailed, onClick }: { session: StudioClass; detailed?: boolean; onClick: () => void }) {
  const tone = capacityTone(session.registered, session.capacity);

  return (
    <button className={`class-card card accent-${session.color}`} onClick={onClick}>
      <div className="class-main">
        <span className="time-badge">{session.time}</span>
        <span>
          <strong>{session.name}</strong>
          <small>{session.instructor.name} · {session.studio}</small>
        </span>
        <Pill tone={tone}>{session.registered}/{session.capacity}</Pill>
      </div>
      {detailed && (
        <div className="instructor-line">
          <Avatar label={session.instructor.name} size="sm" tone={session.instructor.color} />
          <span>{session.time}-{session.endTime}</span>
          <span>{session.waitlist ? `${session.waitlist} waitlist` : "Open"}</span>
        </div>
      )}
      <CapacityBar session={session} />
    </button>
  );
}

function CompactClass({ session, action, onAction }: { session: StudioClass; action?: string; onAction?: () => void }) {
  return (
    <div className="compact-class">
      <span className="time-badge">{session.time}</span>
      <span>
        <strong>{session.name}</strong>
        <small>{session.instructor.name} · {session.studio}</small>
      </span>
      {action && <button className="mini-action" onClick={onAction}>{action}</button>}
    </div>
  );
}

function CapacityBar({ session }: { session: StudioClass }) {
  const tone = capacityTone(session.registered, session.capacity);
  return (
    <div className={`progress ${tone}`}>
      <span style={{ width: `${capacityPercent(session.registered, session.capacity)}%` }} />
    </div>
  );
}

function Avatar({ label, size, tone }: { label: string; size: "sm" | "md" | "lg"; tone: string }) {
  return <span className={`avatar avatar-${size} avatar-${tone}`}>{initials(label)}</span>;
}

function Pill({ tone, children }: { tone: string; children: React.ReactNode }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="section-title">
      <h3>{title}</h3>
      {action && <button onClick={onAction}>{action}</button>}
    </div>
  );
}

function QuickAction({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button className="quick-action" onClick={onClick}>
      <span>{icon}</span>
      <small>{label}</small>
    </button>
  );
}

function ActivityItem({ item, muted }: { item: string; muted: string }) {
  return (
    <div className="activity-row">
      <span />
      <strong>{item}</strong>
      <small>{muted}</small>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="mini-stat">
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

function ChipRow({ values, active, onChange }: { values: string[]; active: string; onChange: (value: string) => void }) {
  return (
    <div className="chip-row">
      {values.map((value) => (
        <button key={value} className={value === active ? "active" : ""} onClick={() => onChange(value)}>
          {value}
        </button>
      ))}
    </div>
  );
}

function FormField({
  label,
  placeholder,
  as,
  values,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  as?: "select";
  values?: string[];
  type?: string;
}) {
  return (
    <label className="input-group">
      <span className="input-label">{label}</span>
      {as === "select" ? (
        <select className="input-field" required>
          {(values ?? []).map((value) => <option key={value}>{value}</option>)}
        </select>
      ) : (
        <input className="input-field" type={type} placeholder={placeholder} required />
      )}
    </label>
  );
}

function ColorDotPicker() {
  return (
    <div className="dot-picker">
      {["blue", "gold", "sand", "green", "red", "purple"].map((color, index) => (
        <button type="button" className={`color-dot dot-${color} ${index === 0 ? "selected" : ""}`} key={color} aria-label={color} />
      ))}
    </div>
  );
}

function SettingsGroup({ title, rows }: { title: string; rows: string[] }) {
  return (
    <section className="card card-pad">
      <SectionTitle title={title} />
      {rows.map((row) => (
        <div className="settings-link" key={row}>
          <span>{row}</span>
          <b>›</b>
        </div>
      ))}
    </section>
  );
}

function SettingsRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="settings-link">
      <span>{label}</span>
      <input className="toggle" type="checkbox" defaultChecked={checked} onChange={onChange} />
    </label>
  );
}

function EmptyState({ title, action }: { title: string; action?: string }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      {action && <small>{action}</small>}
    </div>
  );
}

function Modal({
  type,
  session,
  onClose,
  onToast,
}: {
  type: "qr" | "booking" | "cancel";
  session: StudioClass;
  onClose: () => void;
  onToast: (message: string) => void;
}) {
  const copy = {
    qr: ["QR Check-in", "Scan a member code at the studio desk.", "Ready"],
    booking: ["Confirm booking", `${session.name} at ${session.time}`, "Book class"],
    cancel: ["Cancel booking?", "Cancel deadline rules will be checked before release.", "Cancel booking"],
  }[type];

  return (
    <div className="modal-backdrop">
      <section className="modal-card">
        <div className="modal-check">{type === "cancel" ? "!" : "✓"}</div>
        <h2>{copy[0]}</h2>
        <p>{copy[1]}</p>
        <button className="btn-primary" onClick={() => { onToast(type === "booking" ? "Booking confirmed" : type === "cancel" ? "Booking cancelled" : "Check-in opened"); onClose(); }}>
          {copy[2]}
        </button>
        <button className="btn-secondary" onClick={onClose}>Done</button>
      </section>
    </div>
  );
}
