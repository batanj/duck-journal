#!/usr/bin/env node
/**
 * Tauri needs a real index.html in frontendDist. Start's SPA prerender
 * sometimes writes `.html` (outputPath `/`) or `index.html` (`/index`).
 */
import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "dist/client");
const index = join(dir, "index.html");

if (!existsSync(index)) {
  for (const name of [".html", "_shell.html"]) {
    const src = join(dir, name);
    if (existsSync(src)) {
      copyFileSync(src, index);
      break;
    }
  }
}

if (!existsSync(index)) {
  console.error("[desktop] missing dist/client/index.html after Vite build.");
  process.exit(1);
}

console.log("[desktop] web assets ready at dist/client");
