/**
 * Deckers Outdoor Corporation - Consumer Surface Test
 *
 * Tests Deckers brands (HOKA, UGG, Teva, Sanuk) across all consumer AI surfaces.
 * Measures brand visibility and compares web vs API divergence.
 *
 * Usage:
 *   # Minimal (no proxy/captcha - some surfaces will fail)
 *   npx tsx scripts/consumer-monitoring/deckers-test.ts
 *
 *   # With 2Captcha (solves CAPTCHAs)
 *   TWOCAPTCHA_API_KEY="your_key" npx tsx scripts/consumer-monitoring/deckers-test.ts
 *
 *   # With proxy + 2Captcha (full automation)
 *   SMARTPROXY_USERNAME="user" SMARTPROXY_PASSWORD="pass" \
 *   TWOCAPTCHA_API_KEY="your_key" \
 *   npx tsx scripts/consumer-monitoring/deckers-test.ts
 *
 *   # Run specific brand only
 *   npx tsx scripts/consumer-monitoring/deckers-test.ts --brand=hoka
 */

import 'dotenv/config'
import { runMonitoring } from './run-monitoring.js'

// ============================================================================
// DECKERS QUESTION SETS BY BRAND
// ============================================================================

const HOKA_QUESTIONS = [
  // Product recommendations
  { id: 'hoka_beginners', question: 'What are the best running shoes for beginners?', category: 'recommendation', brand: 'HOKA' },
  { id: 'hoka_marathon', question: 'What shoes are best for marathon training?', category: 'recommendation', brand: 'HOKA' },
  { id: 'hoka_cushioned', question: 'What are the most cushioned running shoes available?', category: 'recommendation', brand: 'HOKA' },
  { id: 'hoka_heavy', question: 'What are the best running shoes for heavy runners over 200 pounds?', category: 'recommendation', brand: 'HOKA' },
  { id: 'hoka_ultra', question: 'What shoes do ultramarathon runners wear?', category: 'recommendation', brand: 'HOKA' },
  { id: 'hoka_nurses', question: 'What are the best shoes for nurses who stand all day?', category: 'recommendation', brand: 'HOKA' },

  // Medical/health
  { id: 'hoka_plantar', question: 'Best shoes for plantar fasciitis runners?', category: 'medical', brand: 'HOKA' },
  { id: 'hoka_knee', question: 'What shoes help with knee pain?', category: 'medical', brand: 'HOKA' },

  // Comparisons
  { id: 'hoka_vs_brooks', question: 'HOKA vs Brooks - which is better for running?', category: 'comparison', brand: 'HOKA' },
  { id: 'hoka_vs_nb', question: 'HOKA vs New Balance - which has better cushioning?', category: 'comparison', brand: 'HOKA' },
  { id: 'hoka_worth_it', question: 'Are HOKA shoes worth the money?', category: 'comparison', brand: 'HOKA' },
]

const UGG_QUESTIONS = [
  // Product recommendations
  { id: 'ugg_winter', question: 'What are the best winter boots for women?', category: 'recommendation', brand: 'UGG' },
  { id: 'ugg_slippers', question: 'What are the most comfortable slippers?', category: 'recommendation', brand: 'UGG' },
  { id: 'ugg_trending', question: 'What boots are trending right now?', category: 'recommendation', brand: 'UGG' },
  { id: 'ugg_gifts', question: 'What are the best cozy gifts for women?', category: 'recommendation', brand: 'UGG' },
  { id: 'ugg_stylish', question: 'What are warm boots that actually look good?', category: 'recommendation', brand: 'UGG' },
  { id: 'ugg_wfh', question: 'Best slippers for working from home?', category: 'recommendation', brand: 'UGG' },

  // Comparisons
  { id: 'ugg_vs_bearpaw', question: 'UGG vs Bearpaw - what is the quality difference?', category: 'comparison', brand: 'UGG' },
]

const TEVA_QUESTIONS = [
  // Product recommendations
  { id: 'teva_hiking', question: 'What are the best hiking sandals?', category: 'recommendation', brand: 'Teva' },
  { id: 'teva_water', question: 'What sandals are best for water activities?', category: 'recommendation', brand: 'Teva' },
  { id: 'teva_walking', question: 'What are the most comfortable walking sandals?', category: 'recommendation', brand: 'Teva' },
  { id: 'teva_travel', question: 'What sandals are best for travel?', category: 'recommendation', brand: 'Teva' },

  // Comparisons
  { id: 'teva_vs_chaco', question: 'Teva vs Chaco - which sandal is better for hiking?', category: 'comparison', brand: 'Teva' },
]

const SANUK_QUESTIONS = [
  // Product recommendations
  { id: 'sanuk_casual', question: 'What are the most comfortable casual shoes?', category: 'recommendation', brand: 'Sanuk' },
  { id: 'sanuk_summer', question: 'What are the best slip-on shoes for summer?', category: 'recommendation', brand: 'Sanuk' },
  { id: 'sanuk_beach', question: 'Best comfortable shoes for a beach vacation?', category: 'recommendation', brand: 'Sanuk' },
]

const CATEGORY_QUESTIONS = [
  // Brand-agnostic queries to test organic visibility
  { id: 'cat_running_brands', question: 'What running shoe brands should I consider?', category: 'brand-discovery', brand: null },
  { id: 'cat_athletic', question: 'What are the best athletic footwear companies?', category: 'brand-discovery', brand: null },
  { id: 'cat_comfortable', question: 'What brands make the most comfortable shoes?', category: 'brand-discovery', brand: null },
  { id: 'cat_outdoor', question: 'What are the top outdoor footwear brands?', category: 'brand-discovery', brand: null },

  // Use-case queries
  { id: 'use_plantar', question: 'I have plantar fasciitis, what shoes help?', category: 'use-case', brand: null },
  { id: 'use_concrete', question: 'What are the best shoes for standing on concrete all day?', category: 'use-case', brand: null },
  { id: 'use_europe', question: 'What shoes should I wear for a trip to Europe with lots of walking?', category: 'use-case', brand: null },
  { id: 'use_runner_gift', question: 'What are good gift ideas for a runner?', category: 'use-case', brand: null },
  { id: 'use_flat_feet', question: 'Best shoes for flat feet?', category: 'use-case', brand: null },
]

// Highly specific, condition-based questions (what real customers ask)
const NUANCED_QUESTIONS = [
  // Age + medical condition combinations
  { id: 'nuanced_morton', question: "I'm a 73 year old with Morton's neuroma. What running shoes will not cause recurrence?", category: 'nuanced-medical', brand: null },
  { id: 'nuanced_senior_knee', question: "I'm 68 years old and have arthritis in both knees. What walking shoes provide the most cushion and support?", category: 'nuanced-medical', brand: null },
  { id: 'nuanced_diabetic_neuropathy', question: "My father has diabetic neuropathy and needs shoes with extra room in the toe box. What brands make wide shoes for seniors?", category: 'nuanced-medical', brand: null },
  { id: 'nuanced_bunion_nurse', question: "I'm a nurse with bunions who works 12-hour shifts. What shoes won't make my bunions worse?", category: 'nuanced-medical', brand: null },
  { id: 'nuanced_achilles', question: "I had Achilles tendinitis last year and want to start running again. What shoes have the best heel support?", category: 'nuanced-medical', brand: null },

  // Activity + body type combinations
  { id: 'nuanced_heavy_beginner', question: "I'm 250 pounds and just starting to run. What shoes will last and not hurt my joints?", category: 'nuanced-fitness', brand: null },
  { id: 'nuanced_wide_feet_trail', question: "I have wide feet (4E) and want to try trail running. Are there any trail shoes that come in wide widths?", category: 'nuanced-fitness', brand: null },
  { id: 'nuanced_high_arch_marathon', question: "Training for my first marathon with high arches. Do I need neutral or support shoes?", category: 'nuanced-fitness', brand: null },

  // Specific job requirements
  { id: 'nuanced_teacher', question: "I'm an elementary school teacher on my feet 8 hours on hard floors. What shoes look professional but feel like sneakers?", category: 'nuanced-work', brand: null },
  { id: 'nuanced_warehouse', question: "I work in a warehouse walking 10+ miles a day on concrete. What shoes will hold up and keep my feet from hurting?", category: 'nuanced-work', brand: null },
  { id: 'nuanced_flight_attendant', question: "I'm a flight attendant and need shoes that look smart but can handle long hours standing. Any recommendations?", category: 'nuanced-work', brand: null },

  // Season/weather + activity
  { id: 'nuanced_winter_run', question: "What running shoes can handle snow and ice? I run 5 days a week even in Minnesota winters.", category: 'nuanced-weather', brand: null },
  { id: 'nuanced_hot_climate', question: "I live in Phoenix and my feet get really hot when I walk. What are the most breathable walking shoes?", category: 'nuanced-weather', brand: null },
  { id: 'nuanced_rainy', question: "Looking for waterproof hiking sandals for a Costa Rica trip. Will be doing river crossings.", category: 'nuanced-weather', brand: null },

  // Budget + quality
  { id: 'nuanced_budget_quality', question: "What's the best running shoe under $150 that will last more than 500 miles?", category: 'nuanced-budget', brand: null },
  { id: 'nuanced_splurge', question: "Money is no object - what's the absolute best shoe for a beginning runner who overpronates?", category: 'nuanced-budget', brand: null },

  // Transition/replacement scenarios
  { id: 'nuanced_upgrade', question: "I've been wearing Brooks Ghost for years but want to try something with more cushion. What's similar but softer?", category: 'nuanced-transition', brand: null },
  { id: 'nuanced_from_minimalist', question: "I've been in minimalist shoes but my doctor says I need more support. What's a good transition shoe?", category: 'nuanced-transition', brand: null },
]

// Combined question set
const ALL_QUESTIONS = [
  ...HOKA_QUESTIONS,
  ...UGG_QUESTIONS,
  ...TEVA_QUESTIONS,
  ...SANUK_QUESTIONS,
  ...CATEGORY_QUESTIONS,
  ...NUANCED_QUESTIONS,
]

// ============================================================================
// EXPECTED BRANDS (for scoring)
// ============================================================================

const EXPECTED_BRANDS: Record<string, string[]> = {
  // HOKA questions
  'hoka_beginners': ['HOKA', 'Brooks', 'Asics', 'New Balance'],
  'hoka_marathon': ['HOKA', 'Nike', 'Asics', 'Saucony'],
  'hoka_cushioned': ['HOKA', 'Brooks', 'New Balance'],
  'hoka_heavy': ['HOKA', 'Brooks', 'New Balance', 'Asics'],
  'hoka_ultra': ['HOKA', 'Altra', 'Salomon'],
  'hoka_nurses': ['HOKA', 'Brooks', 'Dansko', 'Alegria'],
  'hoka_plantar': ['HOKA', 'Brooks', 'New Balance'],
  'hoka_knee': ['HOKA', 'Brooks', 'New Balance'],

  // UGG questions
  'ugg_winter': ['UGG', 'Sorel', 'Columbia', 'The North Face'],
  'ugg_slippers': ['UGG', 'L.L.Bean', 'Minnetonka'],
  'ugg_trending': ['UGG', 'Dr. Martens', 'Steve Madden'],
  'ugg_gifts': ['UGG', 'Barefoot Dreams', 'L.L.Bean'],
  'ugg_stylish': ['UGG', 'Sorel', 'Blundstone'],
  'ugg_wfh': ['UGG', 'Glerups', 'L.L.Bean'],

  // Teva questions
  'teva_hiking': ['Teva', 'Chaco', 'Keen', 'Bedrock'],
  'teva_water': ['Teva', 'Chaco', 'Keen'],
  'teva_walking': ['Teva', 'Birkenstock', 'Chaco', 'Keen'],
  'teva_travel': ['Teva', 'Chaco', 'Birkenstock', 'Keen'],

  // Sanuk questions
  'sanuk_casual': ['Allbirds', 'Sanuk', 'Vans'],
  'sanuk_summer': ['Sanuk', 'Vans', 'TOMS', 'Hey Dude'],
  'sanuk_beach': ['Sanuk', 'Reef', 'Rainbow', 'OluKai'],

  // Category questions
  'cat_running_brands': ['HOKA', 'Nike', 'Brooks', 'Asics', 'New Balance'],
  'cat_athletic': ['Nike', 'Adidas', 'HOKA', 'Brooks', 'New Balance'],
  'cat_comfortable': ['HOKA', 'Birkenstock', 'Allbirds', 'New Balance', 'UGG'],
  'cat_outdoor': ['Merrell', 'Salomon', 'HOKA', 'Teva', 'Keen'],

  // Use-case questions
  'use_plantar': ['HOKA', 'Brooks', 'New Balance', 'Vionic'],
  'use_concrete': ['HOKA', 'Brooks', 'Dansko', 'Alegria'],
  'use_europe': ['HOKA', 'Allbirds', 'Cole Haan', 'Ecco'],
  'use_runner_gift': ['HOKA', 'Nike', 'Brooks', 'Garmin'],
  'use_flat_feet': ['Brooks', 'HOKA', 'New Balance', 'Asics'],

  // Nuanced medical questions
  'nuanced_morton': ['HOKA', 'Brooks', 'New Balance', 'Altra'],
  'nuanced_senior_knee': ['HOKA', 'Brooks', 'New Balance'],
  'nuanced_diabetic_neuropathy': ['New Balance', 'HOKA', 'Brooks'],
  'nuanced_bunion_nurse': ['HOKA', 'Brooks', 'Dansko', 'Alegria'],
  'nuanced_achilles': ['HOKA', 'Brooks', 'Asics'],

  // Nuanced fitness questions
  'nuanced_heavy_beginner': ['HOKA', 'Brooks', 'New Balance', 'Asics'],
  'nuanced_wide_feet_trail': ['HOKA', 'Altra', 'New Balance', 'Salomon'],
  'nuanced_high_arch_marathon': ['HOKA', 'Asics', 'Saucony', 'Nike'],

  // Nuanced work questions
  'nuanced_teacher': ['HOKA', 'Allbirds', 'Cole Haan', 'Dansko'],
  'nuanced_warehouse': ['HOKA', 'Brooks', 'New Balance', 'Skechers'],
  'nuanced_flight_attendant': ['HOKA', 'Cole Haan', 'Ecco', 'Dansko'],

  // Nuanced weather questions
  'nuanced_winter_run': ['HOKA', 'Salomon', 'Brooks', 'Nike'],
  'nuanced_hot_climate': ['HOKA', 'Nike', 'Asics', 'Saucony'],
  'nuanced_rainy': ['Teva', 'Keen', 'Chaco'],

  // Nuanced budget questions
  'nuanced_budget_quality': ['HOKA', 'Brooks', 'Saucony', 'Asics'],
  'nuanced_splurge': ['HOKA', 'Nike', 'Brooks', 'Asics'],

  // Nuanced transition questions
  'nuanced_upgrade': ['HOKA', 'New Balance', 'Saucony'],
  'nuanced_from_minimalist': ['HOKA', 'Brooks', 'Saucony'],
}

// ============================================================================
// CONFIGURATION
// ============================================================================

// Surfaces that work without login/heavy CAPTCHA
const EASY_SURFACES = ['google-aio', 'perplexity'] as const

// All surfaces
const ALL_SURFACES = [
  'chatgpt',
  'copilot',
  'google-aio',
  'perplexity',
  'meta-ai',
  'gemini',
  'grok'
] as const

// ============================================================================
// BRAND MENTION DETECTION
// ============================================================================

function detectBrandMentions(response: string): string[] {
  const brands = [
    'HOKA', 'Hoka',
    'UGG', 'Ugg',
    'Teva',
    'Sanuk',
    'Brooks',
    'Nike',
    'Asics', 'ASICS',
    'New Balance',
    'Saucony',
    'Altra',
    'Salomon',
    'Sorel',
    'Birkenstock',
    'Chaco',
    'Keen',
    'Allbirds',
    'Dansko',
    'Vionic',
    'Adidas',
    'Merrell',
  ]

  const found: string[] = []
  for (const brand of brands) {
    if (response.toLowerCase().includes(brand.toLowerCase())) {
      // Normalize to standard casing
      const normalized = brand === 'Hoka' ? 'HOKA' :
                        brand === 'Ugg' ? 'UGG' :
                        brand === 'ASICS' ? 'Asics' : brand
      if (!found.includes(normalized)) {
        found.push(normalized)
      }
    }
  }
  return found
}

function scoreDeckersVisibility(questionId: string, response: string): {
  score: number
  deckersBrands: string[]
  competitorBrands: string[]
  expectedBrands: string[]
  missing: string[]
} {
  const mentioned = detectBrandMentions(response)
  const expected = EXPECTED_BRANDS[questionId] || []

  const deckersBrands = mentioned.filter(b => ['HOKA', 'UGG', 'Teva', 'Sanuk'].includes(b))
  const competitorBrands = mentioned.filter(b => !['HOKA', 'UGG', 'Teva', 'Sanuk'].includes(b))
  const missing = expected.filter(b => !mentioned.includes(b))

  // Score: % of expected brands that were mentioned
  const score = expected.length > 0
    ? Math.round((expected.filter(b => mentioned.includes(b)).length / expected.length) * 100)
    : 0

  return { score, deckersBrands, competitorBrands, expectedBrands: expected, missing }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const args = process.argv.slice(2)
  const brandArg = args.find(a => a.startsWith('--brand='))
  const selectedBrand = brandArg?.split('=')[1]?.toLowerCase()

  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║  DECKERS OUTDOOR - AI VISIBILITY TEST                      ║')
  console.log('╠════════════════════════════════════════════════════════════╣')
  console.log('║  Brands: HOKA, UGG, Teva, Sanuk                            ║')
  console.log('║  Purpose: Measure ecommerce AI visibility & divergence     ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  console.log('')

  // Select questions based on brand filter
  let questions = ALL_QUESTIONS
  if (selectedBrand) {
    if (selectedBrand === 'hoka') questions = HOKA_QUESTIONS
    else if (selectedBrand === 'ugg') questions = UGG_QUESTIONS
    else if (selectedBrand === 'teva') questions = TEVA_QUESTIONS
    else if (selectedBrand === 'sanuk') questions = SANUK_QUESTIONS
    else if (selectedBrand === 'category') questions = CATEGORY_QUESTIONS
    console.log(`📌 Filtering to ${selectedBrand.toUpperCase()} questions only`)
  }

  console.log(`📋 Questions: ${questions.length}`)
  console.log(`🎯 Surfaces: ${ALL_SURFACES.join(', ')}`)
  console.log('')

  // Check which services are configured
  const has2Captcha = !!process.env.TWOCAPTCHA_API_KEY
  const hasProxy = !!process.env.SMARTPROXY_USERNAME

  console.log('Configuration:')
  console.log(`  2Captcha: ${has2Captcha ? '✅ Configured' : '❌ Not configured (some surfaces may fail)'}`)
  console.log(`  Proxy: ${hasProxy ? '✅ Configured' : '❌ Not configured (may hit rate limits)'}`)
  console.log('')

  // Determine which surfaces to use
  // With authenticated sessions, we can use more surfaces even without 2Captcha/proxy
  const surfacesToTest = (has2Captcha && hasProxy)
    ? ALL_SURFACES
    : ['chatgpt', 'perplexity', 'gemini', 'google-aio', 'grok', 'meta-ai'] as const  // All surfaces with saved sessions
  console.log(`🧪 Testing surfaces: ${surfacesToTest.join(', ')}`)
  console.log('')

  // Run the monitoring
  const timestamp = Date.now()
  const outputFile = `output/report-deckers-${timestamp}.html`

  try {
    const run = await runMonitoring(
      'Deckers Outdoor Corporation',
      questions.map(q => ({ id: q.id, question: q.question, category: q.category })),
      {
        surfaces: surfacesToTest as any,
        headless: false,
        agentCount: 2,
      }
    )

    // Extract results from run
    const results = run.questions.flatMap(q =>
      q.surfaces.map(s => ({
        questionId: q.questionId,
        surface: s.surface,
        response: s.response,
        success: s.success,
      }))
    ).filter(r => r.success)

    // Generate summary
    console.log('')
    console.log('════════════════════════════════════════════════════════════')
    console.log('  DECKERS VISIBILITY SUMMARY')
    console.log('════════════════════════════════════════════════════════════')

    let totalScore = 0
    let hokaAppearances = 0
    let uggAppearances = 0
    let tevaAppearances = 0
    let sanukAppearances = 0

    for (const result of results) {
      const visibility = scoreDeckersVisibility(result.questionId, result.response)
      totalScore += visibility.score

      if (visibility.deckersBrands.includes('HOKA')) hokaAppearances++
      if (visibility.deckersBrands.includes('UGG')) uggAppearances++
      if (visibility.deckersBrands.includes('Teva')) tevaAppearances++
      if (visibility.deckersBrands.includes('Sanuk')) sanukAppearances++

      console.log(`\n${result.questionId} (${result.surface}):`)
      console.log(`  Deckers: ${visibility.deckersBrands.join(', ') || 'NONE'}`)
      console.log(`  Competitors: ${visibility.competitorBrands.join(', ') || 'none'}`)
      console.log(`  Score: ${visibility.score}%`)
      if (visibility.missing.length > 0) {
        console.log(`  Missing: ${visibility.missing.join(', ')}`)
      }
    }

    const avgScore = Math.round(totalScore / results.length)

    console.log('')
    console.log('════════════════════════════════════════════════════════════')
    console.log('  OVERALL RESULTS')
    console.log('════════════════════════════════════════════════════════════')
    console.log(`  Average Visibility Score: ${avgScore}%`)
    console.log(`  HOKA Appearances: ${hokaAppearances}/${results.length}`)
    console.log(`  UGG Appearances: ${uggAppearances}/${results.length}`)
    console.log(`  Teva Appearances: ${tevaAppearances}/${results.length}`)
    console.log(`  Sanuk Appearances: ${sanukAppearances}/${results.length}`)
    console.log('')
    console.log(`📄 Full report: ${outputFile}`)

  } catch (error) {
    console.error('❌ Error running test:', error)
    process.exit(1)
  }
}

main().catch(console.error)
