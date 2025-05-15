import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import {defineConfig, globalIgnores} from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  globalIgnores(["eslint.config.mjs", "node_modules"]),
  {
    files: ["./src/*.{js,mjs,cjs,ts}"],
    plugins: {
      js,
      "@stylistic": stylistic
    },
    extends: ["js/recommended"]
  },
  {
    files: ["**/*.ts"],
    languageOptions: {sourceType: "commonjs"}
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {globals: globals.browser}
  },
  tseslint.configs.recommended,
  stylistic.configs.all,
  {
    rules: {
      semi: "error",
      curly: "error",
      "@stylistic/array-element-newline": ["warn", { multiline: true, minItems: 5 }],
      "@stylistic/arrow-parens": ["warn", "as-needed", { requireForBlockBody: true }],
      "@stylistic/dot-location": ["warn", "property"],
      "@stylistic/indent": ["warn", 2, { SwitchCase: 1 }],
      "@stylistic/max-len": ["error", {
        code: 160,
        tabWidth: 2
      }],
      "@stylistic/multiline-ternary": ["error", "never"],
      "@stylistic/space-before-function-paren": "off",
      "@stylistic/function-call-argument-newline": ["warn", "consistent"],
      "@stylistic/no-multiple-empty-lines": ["error", { 
        max: 1, 
        maxEOF: 1, 
        maxBOF: 1
      }],
      "@stylistic/object-curly-spacing": ["warn", "always"],
      "@stylistic/padded-blocks": ["warn", "never"],
      "@stylistic/quote-props": ["warn", "as-needed"],
    }
  }
]);
