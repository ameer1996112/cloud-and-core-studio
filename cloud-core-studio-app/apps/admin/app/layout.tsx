import type { Metadata, Route } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cloud&Core Studio Admin",
  description: "Class, member, payment, and reporting dashboard for Cloud&Core Studio.",
};

const nav: Array<{ href: Route; label: string }> = [
  { href: "/", label: "Overview" },
  { href: "/classes", label: "Classes" },
  { href: "/members", label: "Members" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <aside className="sidebar">
          <div className="brand-mark">
            <span>Cloud&Core</span>
            <small>Studio Admin</small>
          </div>
          <nav>
            {nav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
