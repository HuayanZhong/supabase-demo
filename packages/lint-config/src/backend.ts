import { defineConfig } from "oxlint";

const backendConfig = defineConfig({
  rules: {
    "typescript/no-extraneous-class": ["warn", { allowWithDecorator: true }],
  },
  env: {
    node: true,
  },
});

export default backendConfig;
