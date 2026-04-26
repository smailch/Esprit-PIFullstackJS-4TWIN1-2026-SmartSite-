import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    pool: "threads",
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      reporter: ["text", "text-summary", "lcov"],
      /** Même périmètre que Sonar (lib, composants hors ui, routes API) — pas les pages Next. */
      include: [
        "lib/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
        "app/api/**/*.ts",
      ],
      exclude: [
        "node_modules/**",
        "**/*.config.*",
        ".next/**",
        "app/api/gemini/**",
        "components/ui/**",
        "components/dream-house/**",
        "coverage/**",
        "**/mockData.ts",
        "**/mockStore.ts",
        "**/vitest.setup.ts",
        "**/*.{test,spec}.{ts,tsx}",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(dirname, "."),
    },
  },
});
