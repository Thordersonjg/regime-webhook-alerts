# Regime Webhook Alerts

Receive real-time regime change alerts via webhook and forward them to Slack, Discord, or any service.

## Quick Start

```bash
npm install express
npx tsx index.ts
```

The server starts on port 3000 and listens for POST requests at `/webhook`.

## How It Works

1. Register a webhook with the Regime API (Pro tier):
```bash
curl -X POST https://getregime.com/api/v1/webhooks \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-server.com/webhook", "events": ["regime.change"]}'
```

2. When the market regime changes (bull → bear, bear → chop, etc.), Regime sends a POST to your webhook URL with:
```json
{
  "event": "regime.change",
  "data": {
    "regime": "bear",
    "previousRegime": "chop",
    "confidence": 0.87,
    "timestamp": "2026-03-25T14:30:00Z"
  }
}
```

3. This server verifies the HMAC-SHA256 signature, logs the event, and forwards a formatted message to Slack.

## Security

All webhooks are signed with HMAC-SHA256. The server verifies signatures using timing-safe comparison to prevent replay attacks.

## Regime API tiers

Webhooks require **Pro** or above.

| Tier | Rate limit | What you get | Price |
|------|-----------|--------------|-------|
| **Free** | 10 req/min | Regime + market overview + BTC/ETH snapshots (15-min delayed). No card. | $0 |
| **Pro** | 120 req/min | Real-time, all 20+ assets, strategy signals, intelligence briefs, **regime-shift webhooks** | $49/mo |
| **Institutional** | 1000 req/min | Everything in Pro + historical data + priority support | $149/mo |

**Get a free API key** (no card): [getregime.com](https://getregime.com) · Docs: [getregime.com/quickstart](https://getregime.com/quickstart) · npm: `npm install getregime`

## Regime open-source toolkit

- [freqtrade-regime-filter](https://github.com/Thordersonjg/freqtrade-regime-filter) — drop-in Freqtrade entry gate (free key auto-provisioned)
- [regime-trading-bot](https://github.com/Thordersonjg/regime-trading-bot) — Python position-sizing bot
- [regime-dashboard](https://github.com/Thordersonjg/regime-dashboard) — single-file live HTML dashboard
- [regime-webhook-alerts](https://github.com/Thordersonjg/regime-webhook-alerts) — forward regime-change alerts to Slack/Discord

⭐ Star whichever helps — it points more traders here.

## License

MIT
