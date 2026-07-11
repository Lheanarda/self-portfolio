import { defineConfig, globalIgnores } from "eslint/config";
import { rules as stylexRules } from "@stylexjs/eslint-plugin";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      "@stylexjs": { rules: stylexRules },
    },
    rules: {
      "@stylexjs/enforce-extension": "error",
      "@stylexjs/no-conflicting-props": "error",
      "@stylexjs/no-legacy-contextual-styles": "error",
      "@stylexjs/no-lookahead-selectors": "warn",
      "@stylexjs/no-unused": "error",
      "@stylexjs/sort-keys": "warn",
      "@stylexjs/valid-shorthands": "error",
      "@stylexjs/valid-styles": "error",
    },
  },
  {
    files: ["babel.config.js", "postcss.config.js"],
    rules: {
      // These two upstream tool APIs intentionally use CommonJS configuration.
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
