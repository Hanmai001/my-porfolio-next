import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";
import unusedImports from "eslint-plugin-unused-imports";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        { type: "app", pattern: ["src/app/**"] },
        { type: "features", pattern: ["src/features/**"] },
        { type: "shared", pattern: ["src/shared/**"] },
        { type: "config", pattern: ["src/shared/config/**"] },
        { type: "lib", pattern: ["src/lib/**"] },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "app", allow: ["features", "shared", "config", "lib"] },
            { from: "features", allow: ["shared", "config", "lib"] },
            { from: "shared", allow: ["config", "lib"] },
            { from: "config", allow: [] },
            { from: "lib", allow: [] },
          ],
        },
      ],
    },
  },
  {
    plugins: { "unused-imports": unusedImports },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    rules: {
      // Stale closures are real bugs, not warnings
      "react-hooks/exhaustive-deps": "error",
      // a11y violations should block, not just warn
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-proptypes": "error",
      "jsx-a11y/aria-unsupported-elements": "error",
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/role-supports-aria-props": "error",
    },
  },
]);

export default eslintConfig;
