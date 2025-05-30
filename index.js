import express from "express";

const app = express();
const PORT = process.env.PORT || 8080;

// Change this if you ever move the router under a
// different sub-domain.
const PREVIEW_SUFFIX = ".preview.paragraph.com";

/**
 * Health-check for Fly’s built-in /health endpoint or any
 * external monitors.
 */
app.get("/healthz", (_, res) => res.send("ok"));

/**
 * Catch-all: parse the Host header, derive <vm-name>,
 * and replay the request.
 */
app.use((req, res) => {
  const host = req.headers.host;

  // Basic guardrails – keeps noisy bots out of your logs
  if (!host || !host.endsWith(PREVIEW_SUFFIX)) {
    return res.status(400).send("Unknown host");
  }

  // "my-branch.preview.paragraph.com" → "my-branch"
  const vmName = host.slice(0, -PREVIEW_SUFFIX.length);

  // Instruct Fly’s edge to replay to <vmName>.fly.dev
  res.set("fly-replay", `app=${vmName}`);
  // Body doesn’t matter; Fly will drop it after seeing the header
  res.status(200).end();
});

app.listen(PORT, () =>
  console.log(`🔀 Preview router listening on :${PORT}`)
);
