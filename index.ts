/**
 * Regime Webhook Alert Receiver
 * Built with Regime API -- https://getregime.com
 *
 * Receives regime change webhooks and forwards alerts to Slack or Discord.
 * Requires an Institutional plan for webhook access.
 *
 * Setup:
 *   npm init -y
 *   npm install express
 *   npm install -D typescript @types/express @types/node
 *   npx tsc index.ts && node index.js
 *
 * Configure your webhook URL at https://getregime.com/dashboard
 * Set REGIME_WEBHOOK_SECRET in your environment (found in dashboard settings).
 */

import express, { Request, Response } from "express";
import crypto from "crypto";

const PORT = process.env.PORT || 4000;
const WEBHOOK_SECRET = process.env.REGIME_WEBHOOK_SECRET || "";
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || "";

interface RegimeWebhook {
  event: "regime.changed" | "signal.fired";
  timestamp: string;
  data: {
    previousRegime: string;
    newRegime: string;
    confidence: number;
    signalSummary: { bullish: number; bearish: number; neutral: number };
  };
}

function verifySignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return true; // skip in dev
  const expected = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

function formatAlert(event: RegimeWebhook): string {
  const { previousRegime, newRegime, confidence, signalSummary } = event.data;
  const arrow = `${previousRegime.toUpperCase()} -> ${newRegime.toUpperCase()}`;
  const signals = `${signalSummary.bullish}B / ${signalSummary.bearish}R / ${signalSummary.neutral}N`;
  return `Regime Shift: ${arrow} (${(confidence * 100).toFixed(0)}% confidence, signals: ${signals})`;
}

async function sendToSlack(text: string): Promise<void> {
  if (!SLACK_WEBHOOK_URL) return;
  await fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}

const app = express();
app.use(express.raw({ type: "application/json" }));

app.post("/webhook", async (req: Request, res: Response) => {
  const payload = req.body.toString();
  const signature = req.headers["x-regime-signature"] as string;

  if (!verifySignature(payload, signature)) {
    console.error("Invalid webhook signature -- rejecting");
    return res.status(401).json({ error: "invalid signature" });
  }

  const event: RegimeWebhook = JSON.parse(payload);
  const alert = formatAlert(event);
  console.log(`[${event.timestamp}] ${alert}`);

  await sendToSlack(alert);
  res.json({ received: true });
});

app.listen(PORT, () => {
  console.log(`Regime webhook receiver running on :${PORT}`);
  console.log("POST /webhook to receive regime change alerts");
  console.log("Docs: https://getregime.com/docs/webhooks");
});
