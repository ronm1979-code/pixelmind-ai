import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env manually
const env = readFileSync(resolve(process.cwd(), ".env"), "utf8");
for (const line of env.split("\n")) {
  const m = line.match(/^([^=\s#]+)="?([^"]*)"?$/);
  if (m) process.env[m[1]] = m[2];
}

console.log("Env loaded. TURSO_DATABASE_URL:", process.env.TURSO_DATABASE_URL?.substring(0, 30) + "...");

// Run seed directly in same process using dynamic import
await import("./seed-js.mjs");
