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

## Regime API

- **Free**: 30 req/min, regime detection, market overview
- **Pro** ($99/mo): Webhooks, signals, intelligence briefs, real-time data
- **Docs**: [getregime.com/quickstart](https://getregime.com/quickstart)

## License

MIT
