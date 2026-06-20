import { describe, expect, test } from "@jest/globals";

describe("available class runtime loader", () => {
  test("can be imported without Supabase environment variables", () => {
    delete process.env.EXPO_PUBLIC_SUPABASE_URL;
    delete process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    const module = require("@/lib/availableClasses");

    expect(module.hasSupabaseMobileConfig()).toBe(false);
  });
});
