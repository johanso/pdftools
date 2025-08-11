// eslint.config.mjs

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals"; // Importa 'globals'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Mantenemos tu configuración base
  ...compat.extends("next/core-web-vitals"),

  // --- ¡AQUÍ ESTÁ LA SOLUCIÓN! ---
  // Añadimos un nuevo objeto de configuración específico para tu archivo problemático.
  {
    files: ["src/lib/pdf-processor.js"], // Aplica estas reglas solo a este archivo
    languageOptions: {
      globals: {
        ...globals.node, // Le decimos que este archivo se ejecuta en un entorno Node.js
      },
    },
    rules: {
      // Desactivamos la regla que prohíbe 'require'
      "@typescript-eslint/no-var-requires": "off",
    },
  },
  // ------------------------------------
];

export default eslintConfig;