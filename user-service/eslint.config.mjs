import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import {defineConfig} from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  {
    "files": ["src/*.{js,mjs,cjs,ts}"],
    "plugins": {
      js,
      "@stylistic": stylistic
    },
    "extends": ["js/recommended"]
  },
  {
    "files": ["**/*.ts"],
    "languageOptions": {"sourceType": "commonjs"}
  },
  {
    "files": ["**/*.{js,mjs,cjs,ts}"],
    "languageOptions": {"globals": globals.browser}
  },
  tseslint.configs.recommended,
  stylistic.configs.all,
  {
    "rules": {
      "semi": "error",
      "@stylistic/indent": ["warn", 2],
      "@stylistic/array-element-newline": [
        "warn",
        {
          "multiline": true,
          "minItems": 3
        }
      ],
      "@stylistic/quote-props": ["warn", "as-needed"]
    }
  }
]);
