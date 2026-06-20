#!/usr/bin/env node
/**
 * Bootstrap (or promote) a Cloud & Core Studio admin user.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *   node supabase/scripts/create-admin.mjs <email> <password> [full_name]
 *
 * - Creates the auth user if it does not exist (email pre-confirmed).
 * - Ensures a matching public.profiles row.
 * - Grants the 'admin' role in public.roles.
 * Safe to re-run; it is idempotent.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const [email, password, fullNameArg] = process.argv.slice(2);

if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}
if (!email || !password) {
  console.error("Usage: node create-admin.mjs <email> <password> [full_name]");
  process.exit(1);
}

const fullName = fullNameArg ?? "Studio Admin";
const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function findUserByEmail(targetEmail) {
  // Paginate admin.listUsers until we find the email.
  let page = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === targetEmail.toLowerCase());
    if (match) return match;
    if (data.users.length < 200) return null;
    page += 1;
  }
}

async function main() {
  let user = await findUserByEmail(email);

  if (!user) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });
    if (error) throw error;
    user = data.user;
    console.log(`Created auth user ${user.id}`);
  } else {
    console.log(`Found existing auth user ${user.id}`);
  }

  const { error: profileError } = await admin
    .from("profiles")
    .upsert({ id: user.id, full_name: fullName, email }, { onConflict: "id" });
  if (profileError) throw profileError;

  const { error: roleError } = await admin
    .from("roles")
    .upsert({ profile_id: user.id, role: "admin" }, { onConflict: "profile_id,role" });
  if (roleError) throw roleError;

  console.log(`✓ ${email} is now an admin.`);
}

main().catch((err) => {
  console.error("Failed to bootstrap admin:", err.message ?? err);
  process.exit(1);
});
