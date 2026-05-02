// ===========================================
// Prisma v7 設定ファイル
// ===========================================
// CLI（migration/generate等）用のDB接続設定

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
  },
});
