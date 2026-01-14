# Consumer Surface Monitoring

**Monitor what voters see, not what developers see.**

This prototype monitors **7 consumer AI interfaces**:

| Surface | Status | Success Rate | Notes |
|---------|--------|--------------|-------|
| Google AI Overviews | ✅ | 100% | reCAPTCHA auto-passes, may not show AI Overview |
| Perplexity | ✅ | 100% | Works without login, detailed responses with sources |
| ChatGPT.com | ✅ | 100% | Works without login |
| Microsoft Copilot | ⚠️ | 67% | Slow (~50s), needs selector tuning |
| Meta AI | ❌ | 0% | **Requires Facebook/Meta login** |
| Google Gemini | ✅ | 100% | Works without Google login |
| Grok (X.com) | ❌ | 0% | **Requires X/Twitter login** |

## Why Consumer Monitoring Matters

| Surface | Who Uses It |
|---------|-------------|
| APIs | Developers, enterprise apps |
| ChatGPT.com | **Voters** |
| Copilot | **Voters** |
| Google AI Overviews | **Voters** |
| Perplexity | **Voters** |
| Meta AI | **3+ billion Meta users** |

APIs don't matter for campaigns. Consumer interfaces do.

## Cost Model

| Component | Monthly Cost |
|-----------|--------------|
| Residential proxies | ~$75-150 |
| 2Captcha | ~$10-15 |
| Server (VPS) | ~$50-100 |
| **Total (25 campaigns)** | **~$135-265** |
| **Per campaign** | **~$5-10** |

## Quick Start

### Option 1: Manual CAPTCHA Mode (free, interactive)

Solve CAPTCHAs yourself while watching the browser:

```bash
# Install Playwright browser
npx playwright install chromium

# Run with manual CAPTCHA solving
MANUAL_CAPTCHA=true npx tsx scripts/consumer-monitoring/malinowski-test.ts
```

Browser windows will open. When a CAPTCHA appears, solve it manually.

### Option 2: Automated Mode (requires 2Captcha account)

```bash
# Set up 2Captcha ($3 minimum deposit)
export TWOCAPTCHA_API_KEY="your_key"

# Run automated
npx tsx scripts/consumer-monitoring/malinowski-test.ts
```

### Option 3: Full Automation (2Captcha + Proxy)

```bash
# CAPTCHA solving
export TWOCAPTCHA_API_KEY="your_key"

# Residential proxy
export SMARTPROXY_USERNAME="your_user"
export SMARTPROXY_PASSWORD="your_pass"

# Run all 7 surfaces
npx tsx scripts/consumer-monitoring/malinowski-test.ts
```

## Custom Surface Selection

Test specific surfaces:

```bash
# Just Google and Perplexity
MANUAL_CAPTCHA=true SURFACES=google-aio,perplexity npx tsx scripts/consumer-monitoring/malinowski-test.ts

# Just ChatGPT
MANUAL_CAPTCHA=true SURFACES=chatgpt npx tsx scripts/consumer-monitoring/malinowski-test.ts

# All surfaces
MANUAL_CAPTCHA=true SURFACES=google-aio,perplexity,chatgpt,copilot,meta-ai,gemini,grok npx tsx scripts/consumer-monitoring/malinowski-test.ts
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Agent Pool (multiple browser sessions)                     │
├─────────────────────────────────────────────────────────────┤
│  Agent 1: California IP, Chrome UA                          │
│  Agent 2: Texas IP, Edge UA                                 │
│  Agent 3: Florida IP, Firefox UA                            │
└─────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│  Surface Monitors                                           │
├─────────────────────────────────────────────────────────────┤
│  ChatGPT.com  →  Playwright + CAPTCHA solver                │
│  Copilot      →  Playwright + Turnstile solver              │
│  Google AIO   →  Playwright + CAPTCHA solver                │
└─────────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│  Results                                                    │
├─────────────────────────────────────────────────────────────┤
│  - Response text                                            │
│  - Sources cited                                            │
│  - Response time                                            │
│  - CAPTCHA events                                           │
│  - Screenshots                                              │
└─────────────────────────────────────────────────────────────┘
```

## Files

```
scripts/consumer-monitoring/
├── lib/
│   ├── proxy-config.ts      # Residential proxy providers
│   ├── captcha-solver.ts    # 2Captcha + manual CAPTCHA mode
│   ├── agent-pool.ts        # Multi-agent session manager
│   ├── utils.ts             # Retry, similarity, formatting utils
│   └── report-generator.ts  # HTML report generation
├── surfaces/
│   ├── google-aio.ts        # Google AI Overviews
│   ├── perplexity-web.ts    # Perplexity.ai
│   ├── chatgpt-web.ts       # ChatGPT.com
│   ├── copilot.ts           # Microsoft Copilot
│   ├── meta-ai.ts           # Meta AI
│   ├── gemini-web.ts        # Google Gemini
│   └── grok-web.ts          # Grok (X.com)
├── run-monitoring.ts        # Main orchestrator
├── malinowski-test.ts       # Malinowski campaign test
├── test-setup.ts            # Setup validation
├── NOTES.md                 # Strategic notes (Meta personalization risk)
└── README.md                # This file
```

## ToS Considerations

This automation likely violates Terms of Service for most platforms.

**Actual risks:**
- Account bans (likely)
- IP blocks (possible)
- Legal action (very unlikely)

**Recommendation:**
- Use automation for internal monitoring
- Use volunteer panel for public claims
- Don't cite automated results in press releases

## Multi-Agent Benefits

Running the same question through multiple agents provides:

1. **Drift detection** - See if responses change over time
2. **Personalization detection** - Different user profiles may get different answers
3. **Redundancy** - If one agent gets blocked, others continue
4. **Geographic variation** - Test from different US states

## Proxy Providers

| Provider | Price | Notes |
|----------|-------|-------|
| Smartproxy | $4-7/GB | Recommended |
| IPRoyal | $1.75/GB | Budget option |
| Bright Data | $5-8/GB | Enterprise |
| Oxylabs | $8-15/GB | Premium |

For ~15-20 GB/month (25 campaigns): **$30-150/month**
