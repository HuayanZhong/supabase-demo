import { defineConfig } from "oxlint";

const baseConfig = defineConfig({
  plugins: ["typescript", "unicorn", "import"],
  categories: {
    correctness: "error",
    suspicious: "warn",
    perf: "warn",
  },
  rules: {
    "no-console": "off",
    "no-debugger": "error",
    "no-unused-vars": "off",
    "typescript/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-empty-pattern": "warn",
    eqeqeq: ["error", "always"],
    "no-var": "error",
    "prefer-const": "warn",
    "unicorn/no-array-for-each": "warn",
  },
  env: {
    builtin: true,
    es2021: true,
  },
});

export default baseConfig;
