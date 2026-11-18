// Pick Your Poison: settings shared by the website and scripts/generate.mjs.
//
// Hopscotch is OpenAI-compatible: one base URL + one API key for every model.
// 1. Paste the base URL from your Hopscotch dashboard (it usually ends in /v1).
// 2. Check each `model` string against Hopscotch's model catalog and swap in
//    the newest flagship IDs. The ones below are placeholders.

export const CONFIG = {
  baseURL: "", // e.g. "https://<hopscotch-host>/v1"

  models: [
    { id: "gpt",      name: "GPT",      company: "OpenAI",    model: "openai/gpt-5",                 glass: "#2f7a5a" },
    { id: "claude",   name: "Claude",   company: "Anthropic", model: "anthropic/claude-sonnet-4.5",  glass: "#b5793a" },
    { id: "gemini",   name: "Gemini",   company: "Google",    model: "google/gemini-2.5-pro",        glass: "#33549e" },
    { id: "llama",    name: "Llama",    company: "Meta",      model: "meta-llama/llama-4-maverick",  glass: "#6a4a8e" },
    { id: "grok",     name: "Grok",     company: "xAI",       model: "x-ai/grok-4",                  glass: "#5d656e" },
    { id: "deepseek", name: "DeepSeek", company: "DeepSeek",  model: "deepseek/deepseek-chat",       glass: "#8a2f35" },
  ],

  // Judges cluster duplicate controversies and score severity 1–5.
  // For each target, the first `judgeCount` judges from a DIFFERENT company
  // are used and their severity scores averaged, so no company grades itself.
  judges: ["claude", "gpt", "gemini"],
  judgeCount: 2,

  categories: ["Privacy", "Safety", "Accuracy", "Copyright", "Bias", "Labor", "Legal"],

  // A controversy raised by at least this many rivals is "Widely reported".
  // Raised by exactly one rival: "Unverified".
  widelyReported: 3,

  maxItems: 6,
  temperature: 0.3,
  concurrency: 4,
};
