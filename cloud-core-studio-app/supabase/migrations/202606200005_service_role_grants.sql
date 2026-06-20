-- Grant the service_role full DML on all current and future public tables.
-- service_role bypasses RLS, but under the locked-down API default it still
-- needs explicit table privileges. Used only server-side (admin dashboard
-- privileged routes, webhooks, scripts) — never exposed to the browser.

grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant all on all routines in schema public to service_role;

-- Ensure objects created by later migrations are also reachable.
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;
alter default privileges in schema public grant all on routines to service_role;
