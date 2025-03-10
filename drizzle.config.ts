import type { Config } from "drizzle-kit";

export default {
  schema: "./utils/models.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "expo", // <--- very important
} satisfies Config;
