import { readFileSync } from "fs";
import { resolve } from "path";

const env = readFileSync(resolve(process.cwd(), ".env"), "utf8");
for (const line of env.split("\n")) {
  const m = line.match(/^([^=\s#]+)="?([^"]*)"?$/);
  if (m) process.env[m[1]] = m[2];
}

console.log("TURSO_DATABASE_URL:", process.env.TURSO_DATABASE_URL);
console.log("TURSO_AUTH_TOKEN:", process.env.TURSO_AUTH_TOKEN?.substring(0, 20) + "...");
