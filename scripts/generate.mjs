// Regenerates data/results.json, the cached results every visitor sees.
//
//   HOPSCOTCH_API_KEY=... HOPSCOTCH_BASE_URL=https://.../v1 node scripts/generate.mjs
//
// Needs Node 18+ (built-in fetch). About 36 + 18 API calls per run.

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CONFIG } from "../config.js";
import { runAll } from "../pipeline.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const apiKey = process.env.HOPSCOTCH_API_KEY;
const baseURL = process.env.HOPSCOTCH_BASE_URL || CONFIG.baseURL;

if (!apiKey || !baseURL) {
  console.error("Set HOPSCOTCH_API_KEY and HOPSCOTCH_BASE_URL (or CONFIG.baseURL in config.js).");
  process.exit(1);
}

const results = await runAll({ apiKey, baseURL }, CONFIG, (done, total, label, r) => {
  const note = r?.error ? `  ERROR ${r.error}` : r?.refused ? `  declined: ${r.reason}` : "";
  console.log(`[${String(done).padStart(2)}/${total}] ${label}${note}`);
});

await mkdir(join(root, "data"), { recursive: true });
await writeFile(join(root, "data", "results.json"), JSON.stringify(results, null, 2));
console.log("Wrote data/results.json");
