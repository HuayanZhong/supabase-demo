import { defineConfig } from "oxlint";
import base from "@supabase/lint-config/base";
import backend from "@supabase/lint-config/backend";

export default defineConfig({
  extends: [base, backend],
  ignorePatterns: ["dist", "node_modules", "coverage"],
});
