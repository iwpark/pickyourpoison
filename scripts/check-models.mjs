// Checks that every model ID in config.js exists on Hopscotch, using the free
// GET /v1/models endpoint (no tokens spent). If an ID is gone but the same model
// is live under another host prefix, it reports the substitute generate.mjs will use.
//
//   HOPSCOTCH_API_KEY=... node scripts/check-models.mjs

import { CONFIG } from "../config.js";
import { listModels, resolveModels } from "../pipeline.js";

const apiKey = process.env.HOPSCOTCH_API_KEY;
const baseURL = process.env.HOPSCOTCH_BASE_URL || CONFIG.baseURL;
if (!apiKey) {
  console.error("Set HOPSCOTCH_API_KEY first.");
  process.exit(1);
}

const ids = await listModels({ apiKey, baseURL });
console.log(`Hopscotch lists ${ids.length} models.\n`);

const { report } = resolveModels(CONFIG, ids);
let missing = 0;
for (const r of report) {
  const name = r.m.name.padEnd(9);
  if (r.status === "ok") console.log(`OK       ${name} ${r.id}`);
  else if (r.status === "resolved") console.log(`USING    ${name} ${r.id}   (config says ${r.m.model}; also live: ${r.matches.join(", ")})`);
  else {
    missing++;
    console.log(`MISSING  ${name} ${r.m.model}`);
    console.log(`         same family: ${r.close.join(", ") || "none"}`);
  }
}
console.log(missing ? `\n${missing} ID(s) need fixing in config.js.` : "\nAll models found. Ready for scripts/generate.mjs.");
if (missing) process.exit(1); // stops the GitHub Action before any tokens are spent
