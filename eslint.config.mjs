// eslint.config.mjs

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Exportamos un array de configuraciones.
export default [
  // 1. La configuración base de Next.js.
  ...compat.extends("next/core-web-vitals"),

  // 2. Un objeto de configuración para ignorar archivos.
  //    Esto le dice a ESLint que NUNCA analice estos archivos.
  {
    ignores: [
      "src/lib/pdf-processor.js", 
      "src/lib/pdf.worker.js", 
      "src/lib/pdf.worker.min.js"
    ],
  },
];