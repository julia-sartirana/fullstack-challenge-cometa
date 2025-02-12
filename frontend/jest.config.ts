import type { Config } from "jest";
import nextJest from "next/jest.js";

// Crea la configuración de Jest para Next.js
const createJestConfig = nextJest({
  dir: "./",
});

// Configuración de Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom", // 🛑 Necesario para pruebas con React y Next.js
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Carga configuración adicional

  transformIgnorePatterns: [
    "/node_modules/",
    "\\.pnp\\.[^\\/]+$", // Ignora archivos de node_modules y pnp
  ],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // Permite importar archivos con alias @/
  },

  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
};

export default createJestConfig(config);
