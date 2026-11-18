// Checks that every model ID in config.js exists on Hopscotch, using the free
// GET /v1/models endpoint (no tokens spent). Suggests close matches for any miss.
//
//   HOPSCOTCH_API_KEY=... node scripts/check-models.mjs

import { CONFIG } from "../config.js";

const apiKey = process.env.HOPSCOTCH_API_KEY;
const baseURL = (process.env.HOPSCOTCH_BASE_URL || CONFIG.baseURL).replace(/\/+$/, "");
if (!apiKey) {
  console.error("Set HOPSCOTCH_API_KEY first.");
  process.exit(1);
}

const res = await fetch(`${baseURL}/models`, { headers: { Authorization: `Bearer ${apiKey}` } });
if (!res.ok) {
  console.error(`GET ${baseURL}/models failed: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
  process.exit(1);
}
const body = await res.json();
const ids = (body.data || body.models || body).map((m) => (typeof m === "string" ? m : m.id)).filter(Boolean);
console.log(`Hopscotch lists ${ids.length} models.\n`);

let missing = 0;
for (const m of CONFIG.models) {
  if (ids.includes(m.model)) {
    console.log(`OK       ${m.name.padEnd(9)} ${m.model}`);
    continue;
  }
  missing++;
  const vendor = m.model.split("/")[0];
  const family = m.model.split("/")[1]?.split(/[-.]/)[0] ?? "";
  const close = ids.filter((id) => id.startsWith(vendor + "/") || (family && id.toLowerCase().includes(family.toLowerCase())));
  console.log(`MISSING  ${m.name.padEnd(9)} ${m.model}`);
  console.log(`         close matches: ${close.slice(0, 12).join(", ") || "none"}`);
}
console.log(missing ? `\n${missing} ID(s) need fixing in config.js.` : "\nAll model IDs found. Ready for scripts/generate.mjs.");
if (missing) process.exit(1); // stops the GitHub Action before any tokens are spent
