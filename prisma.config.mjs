import { existsSync } from "node:fs";
import { defineConfig } from "prisma/config";

// Prisma 7 no longer reads .env itself; Next.js does for the app, this does it for the CLI.
if (existsSync(".env")) process.loadEnvFile();

export default defineConfig({
  schema: "prisma/schema.prisma",
  // Optional so `prisma generate` (run on install) works without a database configured.
  datasource: { url: process.env.DATABASE_URL },
});
