import js from "@eslint/js";
import react from "eslint-plugin-react";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals"; // 1. Import the standard globals package

export default [
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser, // 2. Inject browser globals like 'document' and 'window'
      },
    },
    plugins: {
      react,
      "@typescript-eslint": tsPlugin,
    },
    settings: {
      react: {
        version: "detect", // Automatically detects the React version from your package.json
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // Not needed for modern React (17+)
    },
  },
];
