// Regenerates data/results.json, the cached results every visitor sees.
//
//   HOPSCOTCH_API_KEY=... HOPSCOTCH_BASE_URL=https://.../v1 node scripts/generate.mjs
//
// Needs Node 18+ (built-in fetch). About 36 + 18 API calls per run.

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CONFIG } from "../config.js";
import { runAll, listModels, resolveModels } from "../pipeline.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const apiKey = process.env.HOPSCOTCH_API_KEY;
const baseURL = process.env.HOPSCOTCH_BASE_URL || CONFIG.baseURL;

if (!apiKey || !baseURL) {
  console.error("Set HOPSCOTCH_API_KEY and HOPSCOTCH_BASE_URL (or CONFIG.baseURL in config.js).");
  process.exit(1);
}

// Swap in live IDs if Hopscotch moved a model to another host prefix.
const { cfg, report } = resolveModels(CONFIG, await listModels({ apiKey, baseURL }));
for (const r of report) if (r.status === "resolved") console.log(`Using ${r.id} for ${r.m.name} (config: ${r.m.model})`);
const missing = report.filter((r) => r.status === "missing");
if (missing.length) {
  console.error(`Not on Hopscotch: ${missing.map((r) => r.m.model).join(", ")}. Run scripts/check-models.mjs.`);
  process.exit(1);
}

const results = await runAll({ apiKey, baseURL }, cfg, (done, total, label, r) => {
  const note = r?.error ? `  ERROR ${r.error}` : r?.refused ? `  declined: ${r.reason}` : "";
  console.log(`[${String(done).padStart(2)}/${total}] ${label}${note}`);
});

await mkdir(join(root, "data"), { recursive: true });
await writeFile(join(root, "data", "results.json"), JSON.stringify(results, null, 2));
console.log("Wrote data/results.json");
