# AI Visibility Study Workflow

## Successful Execution Pattern for HUFT and Deckers Studies

This document describes the exact workflow that produced successful AI visibility reports.

---

## Overview: Two Testing Approaches

AI visibility testing requires **two distinct approaches**:

1. **Browser Testing** - Tests what consumers actually see (ChatGPT.com, Gemini.google.com, Perplexity.ai, etc.)
2. **API Testing** - Tests the underlying models directly (Gemini API, Perplexity API, Llama via Together.ai)

Both are valuable but measure different things.

---

## Phase 1: Question Design

### Step 1.1: Define Question Categories

Create questions across multiple categories that reflect real consumer behavior:

```typescript
// Categories we used for HUFT:
- Dog Food (6 questions): "Best dog food brand in India?", premium options, puppy food, treats, vegan, allergies
- Cat Products (4): food, toys, litter, scratchers
- Accessories (6): collars, beds, clothes, bowls, toys, winter gear
- Grooming (5): products, shampoo, location-specific (Delhi, Mumbai, Bangalore)
- Shopping (4): stores, online, location-specific
- Brand Discovery (4): top companies, startups, trusted brands
- Comparison (5): vs competitors (Petsy, Supertails, Royal Canin, Amazon)
- Use Cases (7): new puppy, dry skin, travel, gifts, training, adoption, seasonal
- Nuanced (18): highly specific condition + location queries
```

### Step 1.2: Question Design Principles

**DO:**
- Include location context (India, specific cities)
- Mix generic queries ("best dog food") with brand-specific ("HUFT vs Petsy")
- Include comparison queries (these often have highest brand visibility)
- Add nuanced, condition-specific queries (senior dog with joint problems)
- Test both broad and narrow queries

**DON'T:**
- Only test generic queries (you'll miss brand visibility patterns)
- Skip comparison queries (these show competitive positioning)
- Forget location modifiers (critical for regional brands)

### Step 1.3: Question Count

**Minimum for statistical significance: 50-60 questions**

We used 59 questions for HUFT across 9 categories. This provides enough data to identify patterns by category.

---

## Phase 2: Browser Testing

### Step 2.1: Surfaces to Test

Priority order based on consumer usage:
1. **ChatGPT** (chatgpt.com) - Highest traffic AI chatbot
2. **Gemini** (gemini.google.com) - Google's consumer interface
3. **Perplexity** (perplexity.ai) - Search-focused, cites sources
4. **Google AI Overviews** - Appears in Google Search results
5. **Meta AI** (meta.ai) - Facebook/Instagram users

### Step 2.2: Browser Testing Script Structure

```typescript
// Key components of browser testing:
import { chromium } from 'playwright'

// 1. Launch browser with proper configuration
const browser = await chromium.launch({ headless: false }) // false for debugging

// 2. Load authenticated session if needed (cookies)
await context.addCookies(savedCookies)

// 3. Navigate to surface
await page.goto('https://chatgpt.com/')

// 4. Enter question
await page.fill('textarea[placeholder*="Message"]', question)
await page.keyboard.press('Enter')

// 5. Wait for response (this is the tricky part)
await page.waitForSelector('[data-message-author-role="assistant"]', { timeout: 60000 })

// 6. Extract response text
const response = await page.textContent('[data-message-author-role="assistant"]')

// 7. Check for brand mention
const huftMentioned = /huft|heads\s*up\s*for\s*tails/i.test(response)
```

### Step 2.3: Handling Browser Testing Challenges

**Challenge: Rate Limit Modals (ChatGPT)**
```typescript
// ChatGPT shows "Stay logged out" modal for unauthenticated users
// Solution: Detect and wait for manual dismissal (most reliable)
async function dismissRateLimitModal(page) {
  const modal = await page.$('[data-testid="modal-no-auth-rate-limit"]')
  if (modal) {
    console.log('📋 Rate limit modal detected - please click "Stay logged out"...')
    // Wait for user to dismiss (up to 30 seconds)
    for (let i = 0; i < 30; i++) {
      await page.waitForTimeout(1000)
      const stillThere = await page.$('[data-testid="modal-no-auth-rate-limit"]')
      if (!stillThere) return
    }
  }
}
```

**Challenge: Session Expiration**
- Save cookies after successful login
- Reload cookies before each test run
- Re-authenticate when cookies expire (weekly)

**Challenge: CAPTCHA**
- Use 2Captcha service for automated solving
- Or run in headed mode (headless: false) and solve manually

**Challenge: Different Response Formats**
Each surface has different DOM structure. Create surface-specific extractors:
```typescript
// ChatGPT
response = await page.textContent('[data-message-author-role="assistant"]')

// Gemini
response = await page.textContent('.model-response-text')

// Perplexity
response = await page.textContent('.prose')
```

### Step 2.4: Browser Testing Execution Strategy

**Critical: Don't run all questions at once initially**

1. **Test Run (5 questions)** - Verify everything works
2. **Partial Run (20 questions)** - Check for rate limiting
3. **Full Run (all 59 questions)** - Complete test
4. **Resume Capability** - If interrupted, resume from where you left off

```typescript
// Track completed questions
const COMPLETED_IDS = new Set(['huft_food_best', 'huft_food_premium', ...])

// Filter to only run remaining
const questionsToRun = ALL_QUESTIONS.filter(q => !COMPLETED_IDS.has(q.id))
```

---

## Phase 3: API Testing

### Step 3.1: Why API Testing?

API testing is:
- **Faster** - No browser overhead
- **More reliable** - No authentication issues
- **Cheaper** - No proxy/CAPTCHA costs
- **Different** - Tests the model, not the consumer experience

### Step 3.2: APIs to Test

```typescript
const APIS = [
  {
    name: 'Gemini (2.0 Flash)',
    url: () => `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`,
    // Standard Google AI format
  },
  {
    name: 'Perplexity (Sonar)',
    url: 'https://api.perplexity.ai/chat/completions',
    // OpenAI-compatible format
  },
  {
    name: 'Llama 3.3 (Together.ai)',
    url: 'https://api.together.xyz/v1/chat/completions',
    // OpenAI-compatible format, tests Meta's Llama
  },
  // OpenAI GPT-4 if you have quota
  // Claude if you have API access
]
```

### Step 3.3: API Testing Script

```typescript
async function queryAPI(api, question) {
  const response = await fetch(api.url, {
    method: 'POST',
    headers: api.headers(),
    body: JSON.stringify(api.buildBody(question))
  })

  const data = await response.json()
  const text = api.extractText(data)
  const brandMentioned = /brand_name/i.test(text)

  return { success: true, response: text, brandMentioned }
}

// Run all questions through all APIs
for (const question of QUESTIONS) {
  for (const api of APIS) {
    const result = await queryAPI(api, question)
    results.push(result)
  }
  await sleep(500) // Rate limit protection
}
```

---

## Phase 4: Results Processing

### Step 4.1: Save Raw Results

```typescript
const output = {
  timestamp: new Date().toISOString(),
  surface: 'chatgpt-browser',
  totalQuestions: 59,
  successfulQueries: 58,
  huftMentions: 21,
  results: [
    {
      questionId: 'huft_food_best',
      question: 'What is the best dog food brand in India?',
      response: '...',
      huftMentioned: false,
      responseTimeMs: 15234
    },
    // ...
  ]
}

await fs.writeFile(`output/huft-chatgpt-${Date.now()}.json`, JSON.stringify(output, null, 2))
```

### Step 4.2: Calculate Metrics

```typescript
const successRate = successfulQueries / totalQueries
const mentionRate = huftMentions / successfulQueries

// By category
const byCategory = {}
for (const result of results) {
  if (!byCategory[result.category]) {
    byCategory[result.category] = { total: 0, mentions: 0 }
  }
  byCategory[result.category].total++
  if (result.huftMentioned) byCategory[result.category].mentions++
}
```

---

## Phase 5: Report Generation

### Step 5.1: Report Structure

Create an HTML report with:
1. **Executive Summary** - Overall visibility score, key findings
2. **Surface Comparison** - Side-by-side metrics by AI surface
3. **Category Analysis** - Which question types get brand mentions
4. **Verbatim Examples** - Actual AI responses (positive and negative)
5. **Methodology** - How testing was conducted

### Step 5.2: Key Metrics to Include

```
Overall Visibility Score: 30%
├── Perplexity: 43%
├── ChatGPT: 34%
├── Gemini: 29%
├── Meta AI: 23%
└── Google AIO: 22%

By Category:
├── Comparison queries: 100% (brand always mentioned when asked directly)
├── Location queries: 67%
├── Brand discovery: 50%
├── Generic product: 15%
└── Nuanced/health: 10%
```

---

## Key Success Factors

### 1. Incremental Execution
Don't try to run everything at once. Build up:
- 5 questions → verify setup works
- 20 questions → test rate limits
- Full 59 questions → complete run
- Save progress → resume if interrupted

### 2. Surface-Specific Handling
Each AI surface has quirks:
- ChatGPT: Rate limit modals, session timeouts
- Gemini: Requires Google login for some queries
- Perplexity: Most reliable, includes sources
- Meta AI: US-only without VPN

### 3. Combine Browser + API
Browser testing shows consumer experience.
API testing provides clean, reproducible baseline.
Report both.

### 4. Category-Level Analysis
Don't just report overall %. Break down by:
- Question category
- Query type (generic vs brand-specific)
- Location context

### 5. Verbatim Examples
Include actual responses. This is what stakeholders want to see.

---

## Common Failure Modes (and Fixes)

| Problem | Cause | Fix |
|---------|-------|-----|
| All queries fail | Browser not loaded correctly | Run headed (headless: false) to debug |
| Rate limited | Too many queries too fast | Add delays between queries |
| Session expired | Cookies old | Re-authenticate, save fresh cookies |
| Modal blocks input | Unauthenticated | Either authenticate or dismiss modal |
| Response extraction fails | DOM changed | Update selector for that surface |
| Partial results | Script crashed | Implement resume from last completed |

---

## File Structure

```
scripts/consumer-monitoring/
├── huft-test.ts           # Main test (all browser surfaces)
├── huft-chatgpt-only.ts   # ChatGPT browser test
├── huft-api-test.ts       # API testing (Gemini, Perplexity, Llama)
├── output/
│   ├── huft-chatgpt-{timestamp}.json
│   ├── huft-api-{timestamp}.json
│   └── huft-report-2026-01-13/
│       ├── index.html
│       ├── methodology.html
│       ├── surface-analysis.html
│       └── style.css
└── lib/
    ├── agent-pool.js      # Browser management
    ├── report-generator.js
    └── utils.js
```

---

## Execution Checklist

- [ ] Question set defined (50-60 questions across categories)
- [ ] API keys configured (GOOGLE_API_KEY, PERPLEXITY_API_KEY, TOGETHER_API_KEY)
- [ ] Browser cookies saved for authenticated surfaces
- [ ] Test run with 5 questions (verify setup)
- [ ] Full browser test executed
- [ ] API test executed
- [ ] Results combined and analyzed
- [ ] Report generated with verbatim examples
- [ ] Category breakdown included
