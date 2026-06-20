import { defineConfig } from "oxlint";
import base from "@supabase/lint-config/base";
import frontend from "@supabase/lint-config/frontend";

export default defineConfig({
  extends: [base, frontend],
  ignorePatterns: [".nuxt", ".output", "node_modules", "dist", ".vercel", "*.min.js"],
});
