# Pick Your Poison

CS193T project. Pick an AI model, and every other model tells you about its controversies. The model you picked answers the same question about itself.

All models are called through [Hopscotch](https://www.producthunt.com/products/hopscotch-7), an OpenAI-compatible gateway, so one API key covers every company.

## Files

| File | What it does |
| --- | --- |
| `index.html` | The whole website (no build step) |
| `config.js` | Models, Hopscotch base URL, judges, categories, thresholds |
| `pipeline.js` | Prompts, API calls, clustering, severity, harshness scores |
| `scripts/generate.mjs` | Regenerates the cached `data/results.json` from the command line |
| `data/results.json` | Cached results shown to every visitor (ships with **demo data**) |

## Setup

1. In `config.js`, paste your Hopscotch base URL and check each `model` ID against Hopscotch's model catalog.
2. Generate real results (Node 18+):
   ```bash
   HOPSCOTCH_API_KEY=sk-... HOPSCOTCH_BASE_URL=https://.../v1 node scripts/generate.mjs
   ```
   That's about 54 API calls: 36 "what are the controversies" calls plus 18 judge calls.
3. Preview locally: `npx serve .` and open the URL it prints. Opening `index.html` directly from disk won't work, because browsers block module imports from `file://`.
4. Deploy: push to GitHub and turn on **Settings → Pages** for the main branch.

**Never commit your API key.** The **Refresh live** button keeps the key in the visitor's browser. It works only if Hopscotch allows browser (CORS) requests; if it doesn't, use the script.

## How scoring works

- **Same prompt for everyone**, including the model being examined.
- **Clustering:** a judge from a different company merges duplicate items.
- **Severity (1–5):** two judges from other companies rate each cluster, and the scores are averaged.
- **Widely reported:** raised by 3 or more rivals. **Unverified:** raised by one rival.
- **Harshness** of A toward B = the total severity of the controversies A raised about B.
- **Self-softness gap** = the average harshness rivals show toward a model, minus the model's harshness toward itself.
