// Pick Your Poison: settings shared by the website and scripts/generate.mjs.
//
// Hopscotch (hopscotchlabs.ai) is OpenAI-compatible: one base URL + one API key
// for every model. Model IDs come from https://hopscotchlabs.ai/models (Nov 2026).
// Live IDs are prefixed by the HOST provider (atlas-cloud/, eachlabs/), not the company.
// If an ID disappears, the scripts look for the same model under another host prefix.
//
// `name` is what the models are asked about; `model` is the model that answers.

export const CONFIG = {
  baseURL: "https://api.hopscotchlabs.ai/v1",

  models: [
    { id: "gpt",      name: "GPT",      company: "OpenAI",    model: "atlas-cloud/gpt-6.1-sol",   glass: "#2f7a5a" },
    { id: "claude",   name: "Claude",   company: "Anthropic", model: "anthropic/claude-sonnet-5-5", glass: "#b5793a" },
    { id: "gemini",   name: "Gemini",   company: "Google",    model: "atlas-cloud/gemini-3.8-flash", glass: "#33549e" },
    { id: "llama",    name: "Meta AI",  company: "Meta",      model: "eachlabs/muse-spark-1.3",   glass: "#6a4a8e" },
    { id: "grok",     name: "Grok",     company: "xAI",       model: "atlas-cloud/grok-4.7",      glass: "#5d656e" },
    { id: "deepseek", name: "DeepSeek", company: "DeepSeek",  model: "atlas-cloud/deepseek-v4-pro", glass: "#8a2f35" },
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
