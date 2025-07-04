import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "**/generated/**",
      "**/prisma/generated/**",
      "**/app/generated/prisma/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
   {
    rules: {
      // Escape quotes in JSX
      "react/no-unescaped-entities": "off", // or "off" to disable
      // Any other custom rule
      "no-console": "warn",
    },
  },

];

export default eslintConfig;
