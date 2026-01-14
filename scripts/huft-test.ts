/**
 * HUFT (Heads Up For Tails) - Consumer Surface Test
 *
 * Tests India's largest pet care brand across all consumer AI surfaces.
 * Measures brand visibility for HUFT and sub-brands (Sara's Treats, Indian Collective, TLC, Nature's Hug).
 *
 * Usage:
 *   # Minimal (no proxy/captcha - some surfaces will fail)
 *   npx tsx scripts/consumer-monitoring/huft-test.ts
 *
 *   # With 2Captcha (solves CAPTCHAs)
 *   TWOCAPTCHA_API_KEY="your_key" npx tsx scripts/consumer-monitoring/huft-test.ts
 *
 *   # With proxy + 2Captcha (full automation)
 *   SMARTPROXY_USERNAME="user" SMARTPROXY_PASSWORD="pass" \
 *   TWOCAPTCHA_API_KEY="your_key" \
 *   npx tsx scripts/consumer-monitoring/huft-test.ts
 *
 *   # Run specific category only
 *   npx tsx scripts/consumer-monitoring/huft-test.ts --category=dog-food
 */

import 'dotenv/config'
import { runMonitoring } from './run-monitoring.js'

// ============================================================================
// HUFT QUESTION SETS BY CATEGORY
// ============================================================================

const DOG_FOOD_QUESTIONS = [
  { id: 'huft_food_best', question: 'What is the best dog food brand in India?', category: 'dog-food' },
  { id: 'huft_food_premium', question: 'What are good premium dog food options in India?', category: 'dog-food' },
  { id: 'huft_food_puppy', question: 'Best dog food for puppies in India?', category: 'dog-food' },
  { id: 'huft_food_treats', question: 'What are healthy dog treats without preservatives in India?', category: 'dog-food' },
  { id: 'huft_food_vegan', question: 'Is there vegan dog food available in India?', category: 'dog-food' },
  { id: 'huft_food_allergy', question: 'Best food for dogs with allergies in India?', category: 'dog-food' },
]

const CAT_QUESTIONS = [
  { id: 'huft_cat_food', question: 'Best cat food brands in India?', category: 'cat-products' },
  { id: 'huft_cat_toys', question: 'Best cat toys available in India?', category: 'cat-products' },
  { id: 'huft_cat_litter', question: 'Where to buy cat litter in India?', category: 'cat-products' },
  { id: 'huft_cat_scratcher', question: 'Best cat scratching posts in India?', category: 'cat-products' },
]

const ACCESSORY_QUESTIONS = [
  { id: 'huft_acc_collar', question: 'Best dog collars and leashes in India?', category: 'accessories' },
  { id: 'huft_acc_bed', question: 'Where to buy dog beds in India?', category: 'accessories' },
  { id: 'huft_acc_indian', question: 'Traditional Indian style clothes for dogs?', category: 'accessories' },
  { id: 'huft_acc_bowl', question: 'Best dog bowls and feeders in India?', category: 'accessories' },
  { id: 'huft_acc_toy', question: 'Where to buy dog toys in India?', category: 'accessories' },
  { id: 'huft_acc_winter', question: 'Best winter jackets for dogs in India?', category: 'accessories' },
]

const GROOMING_QUESTIONS = [
  { id: 'huft_groom_products', question: 'Best dog grooming products in India?', category: 'grooming' },
  { id: 'huft_groom_shampoo', question: 'Best dog shampoo brands in India?', category: 'grooming' },
  { id: 'huft_groom_delhi', question: 'Where are the best pet spas in Delhi NCR?', category: 'grooming' },
  { id: 'huft_groom_mumbai', question: 'Best dog grooming services in Mumbai?', category: 'grooming' },
  { id: 'huft_groom_bangalore', question: 'Where can I get my dog groomed in Bangalore?', category: 'grooming' },
]

const SHOPPING_QUESTIONS = [
  { id: 'huft_shop_stores', question: 'Best pet stores in India?', category: 'shopping' },
  { id: 'huft_shop_online', question: 'Where to buy pet supplies online in India?', category: 'shopping' },
  { id: 'huft_shop_gurgaon', question: 'Best pet shops in Gurgaon?', category: 'shopping' },
  { id: 'huft_shop_delhi', question: 'Pet stores near me in Delhi?', category: 'shopping' },
]

const BRAND_DISCOVERY_QUESTIONS = [
  { id: 'huft_brand_top', question: 'What are the top pet product companies in India?', category: 'brand-discovery' },
  { id: 'huft_brand_startup', question: 'Which Indian startups are in the pet industry?', category: 'brand-discovery' },
  { id: 'huft_brand_trusted', question: 'What are the most trusted pet brands in India?', category: 'brand-discovery' },
  { id: 'huft_brand_shop', question: 'Best places to shop for pets in India?', category: 'brand-discovery' },
]

const COMPARISON_QUESTIONS = [
  { id: 'huft_vs_petsy', question: 'HUFT vs Petsy - which is better for pet products in India?', category: 'comparison' },
  { id: 'huft_vs_supertails', question: 'Heads Up For Tails vs Supertails - which has better products?', category: 'comparison' },
  { id: 'huft_vs_royalcanin', question: 'Is HUFT dog food better than Royal Canin?', category: 'comparison' },
  { id: 'huft_worth_it', question: 'Are HUFT products worth the price?', category: 'comparison' },
  { id: 'huft_vs_amazon', question: 'HUFT vs Amazon for pet products - pros and cons?', category: 'comparison' },
]

const USE_CASE_QUESTIONS = [
  { id: 'huft_use_newpuppy', question: 'I just got a puppy in India, what supplies do I need?', category: 'use-case' },
  { id: 'huft_use_dryskin', question: 'My dog has dry skin, what products can help?', category: 'use-case' },
  { id: 'huft_use_travel', question: 'Best products for traveling with a dog in India?', category: 'use-case' },
  { id: 'huft_use_gift', question: 'Good gift ideas for someone who just got a pet in India?', category: 'use-case' },
  { id: 'huft_use_training', question: 'What products help with puppy training in India?', category: 'use-case' },
  { id: 'huft_use_adoption', question: 'Where to adopt a dog in India and what to buy first?', category: 'use-case' },
  { id: 'huft_use_diwali', question: 'Diwali outfits and treats for dogs in India?', category: 'use-case' },
]

// Highly specific, condition-based questions (what real pet parents ask)
const NUANCED_QUESTIONS = [
  // Senior pet nutrition
  { id: 'nuanced_senior_golden', question: 'I have a 15 year old Golden Retriever who weighs about 75 pounds. What dog food will provide the best nutrition and be easily digestible? Where can I buy it in India?', category: 'nuanced-senior' },
  { id: 'nuanced_senior_joint', question: 'My 12 year old Labrador has joint problems. What food has glucosamine and is available in Bangalore?', category: 'nuanced-senior' },
  { id: 'nuanced_senior_kidney', question: 'Vet says my 14 year old dog has early kidney issues. What low-phosphorus food is available in India?', category: 'nuanced-senior' },

  // Puppy-specific with breed
  { id: 'nuanced_gsd_puppy', question: 'Just got a 2 month old German Shepherd puppy. What food will help with proper bone development without growing too fast?', category: 'nuanced-puppy' },
  { id: 'nuanced_indie_puppy', question: 'Adopted an Indian street puppy (indie), about 3 months old. She seems malnourished. What food should I start her on?', category: 'nuanced-puppy' },
  { id: 'nuanced_small_breed_puppy', question: 'My Shih Tzu puppy (4 months) is a picky eater and underweight. What high-calorie food will she actually eat?', category: 'nuanced-puppy' },

  // Health condition + diet
  { id: 'nuanced_allergy_chicken', question: 'My Beagle is allergic to chicken. What protein alternatives are available in Indian dog food brands?', category: 'nuanced-allergy' },
  { id: 'nuanced_ibd', question: 'My dog has IBD and needs easily digestible food with limited ingredients. What brands in India cater to sensitive stomachs?', category: 'nuanced-allergy' },
  { id: 'nuanced_pancreatitis', question: 'Dog was just diagnosed with pancreatitis. Vet said low-fat diet. What options are there in India?', category: 'nuanced-allergy' },

  // Lifestyle + product needs
  { id: 'nuanced_apartment_cat', question: 'I have a Persian cat in a small Mumbai apartment. What litter brand controls odor best in hot weather?', category: 'nuanced-lifestyle' },
  { id: 'nuanced_working_pet_parent', question: "I work from home but my Lab gets bored. What interactive toys will keep him busy for hours that won't break in a day?", category: 'nuanced-lifestyle' },
  { id: 'nuanced_monsoon_walks', question: 'Need a raincoat for my medium-sized dog for Mumbai monsoons. What brands fit Indian dogs well?', category: 'nuanced-lifestyle' },

  // Budget concerns
  { id: 'nuanced_budget_quality_food', question: 'Best dog food under Rs 2000 for a 10kg indie? Want good quality but limited budget.', category: 'nuanced-budget' },
  { id: 'nuanced_premium_worth', question: 'Is Farmina or Acana worth 3x the price of Pedigree for a healthy adult Lab?', category: 'nuanced-budget' },

  // Specific product comparisons
  { id: 'nuanced_collar_indie', question: 'My indie has thick neck fur. What collar type works best - flat, rolled, or martingale?', category: 'nuanced-product' },
  { id: 'nuanced_bed_hot_weather', question: 'Looking for a cooling bed for my Husky who overheats in Delhi summers. Any Indian brands make these?', category: 'nuanced-product' },

  // Location-specific
  { id: 'nuanced_delivery_tier2', question: 'I live in Jaipur. Which pet store delivers here fastest - HUFT, Supertails, or Petsy?', category: 'nuanced-location' },
  { id: 'nuanced_store_delhi', question: 'Want to visit a physical pet store in South Delhi to try harnesses before buying. Which stores have the best selection?', category: 'nuanced-location' },
]

// Combined question set
const ALL_QUESTIONS = [
  ...DOG_FOOD_QUESTIONS,
  ...CAT_QUESTIONS,
  ...ACCESSORY_QUESTIONS,
  ...GROOMING_QUESTIONS,
  ...SHOPPING_QUESTIONS,
  ...BRAND_DISCOVERY_QUESTIONS,
  ...COMPARISON_QUESTIONS,
  ...USE_CASE_QUESTIONS,
  ...NUANCED_QUESTIONS,
]

// ============================================================================
// EXPECTED BRANDS (for scoring)
// ============================================================================

const EXPECTED_BRANDS: Record<string, string[]> = {
  // Dog food
  'huft_food_best': ['HUFT', 'Royal Canin', 'Pedigree', 'Drools', 'Farmina'],
  'huft_food_premium': ['HUFT', 'Royal Canin', 'Farmina', 'Orijen'],
  'huft_food_puppy': ['Royal Canin', 'HUFT', 'Pedigree', 'Drools'],
  'huft_food_treats': ["Sara's Treats", 'HUFT', 'Dogsee Chew'],
  'huft_food_vegan': ["Nature's Hug", 'HUFT'],
  'huft_food_allergy': ['Royal Canin', 'HUFT', 'Farmina'],

  // Cat products
  'huft_cat_food': ['Whiskas', 'Royal Canin', 'HUFT', 'Me-O'],
  'huft_cat_toys': ['HUFT', 'TLC', 'Petsy', 'Supertails'],
  'huft_cat_litter': ['HUFT', 'Petsy', 'Amazon'],
  'huft_cat_scratcher': ['HUFT', 'Petsy', 'Amazon'],

  // Accessories
  'huft_acc_collar': ['HUFT', 'Petsy', 'Amazon'],
  'huft_acc_bed': ['HUFT', 'Petsy', 'Supertails'],
  'huft_acc_indian': ['HUFT', 'Indian Collective'],
  'huft_acc_bowl': ['HUFT', 'Petsy', 'Amazon'],
  'huft_acc_toy': ['HUFT', 'Petsy', 'Supertails'],
  'huft_acc_winter': ['HUFT', 'Petsy'],

  // Grooming
  'huft_groom_products': ['HUFT', 'Wahl', 'Beaphar'],
  'huft_groom_shampoo': ['HUFT', 'Wahl', 'Beaphar'],
  'huft_groom_delhi': ['HUFT', 'Petset Go'],
  'huft_groom_mumbai': ['HUFT', 'Petset Go'],
  'huft_groom_bangalore': ['HUFT', 'Petsy'],

  // Shopping
  'huft_shop_stores': ['HUFT', 'Petsy', 'Supertails'],
  'huft_shop_online': ['HUFT', 'Petsy', 'Supertails', 'Amazon'],
  'huft_shop_gurgaon': ['HUFT'],
  'huft_shop_delhi': ['HUFT', 'Petsy'],

  // Brand discovery
  'huft_brand_top': ['HUFT', 'Mars Petcare', 'Royal Canin', 'Drools'],
  'huft_brand_startup': ['HUFT', 'Petsy', 'Supertails', 'Zigly'],
  'huft_brand_trusted': ['HUFT', 'Royal Canin', 'Pedigree'],
  'huft_brand_shop': ['HUFT', 'Petsy', 'Supertails'],

  // Comparisons
  'huft_vs_petsy': ['HUFT', 'Petsy'],
  'huft_vs_supertails': ['HUFT', 'Supertails'],
  'huft_vs_royalcanin': ['HUFT', 'Royal Canin'],
  'huft_worth_it': ['HUFT'],
  'huft_vs_amazon': ['HUFT', 'Amazon'],

  // Use cases
  'huft_use_newpuppy': ['HUFT', 'Petsy', 'Royal Canin'],
  'huft_use_dryskin': ['HUFT', 'Beaphar', 'Himalaya'],
  'huft_use_travel': ['HUFT', 'Petsy'],
  'huft_use_gift': ['HUFT', 'Petsy'],
  'huft_use_training': ['HUFT', 'Petsy'],
  'huft_use_adoption': ['HUFT', 'Petsy'],
  'huft_use_diwali': ['HUFT', 'Indian Collective'],

  // Nuanced senior questions
  'nuanced_senior_golden': ['HUFT', 'Royal Canin', 'Farmina'],
  'nuanced_senior_joint': ['Royal Canin', 'HUFT', 'Farmina', 'Drools'],
  'nuanced_senior_kidney': ['Royal Canin', 'Hills', 'Farmina'],

  // Nuanced puppy questions
  'nuanced_gsd_puppy': ['Royal Canin', 'HUFT', 'Farmina', 'Drools'],
  'nuanced_indie_puppy': ['HUFT', 'Drools', 'Pedigree', 'Royal Canin'],
  'nuanced_small_breed_puppy': ['Royal Canin', 'HUFT', 'Farmina'],

  // Nuanced allergy questions
  'nuanced_allergy_chicken': ['HUFT', 'Farmina', 'Royal Canin'],
  'nuanced_ibd': ['HUFT', 'Royal Canin', 'Hills', 'Farmina'],
  'nuanced_pancreatitis': ['Royal Canin', 'Hills', 'Farmina'],

  // Nuanced lifestyle questions
  'nuanced_apartment_cat': ['HUFT', 'Petsy', 'Amazon'],
  'nuanced_working_pet_parent': ['HUFT', 'Petsy', 'Kong'],
  'nuanced_monsoon_walks': ['HUFT', 'Petsy'],

  // Nuanced budget questions
  'nuanced_budget_quality_food': ['Drools', 'HUFT', 'Pedigree'],
  'nuanced_premium_worth': ['Farmina', 'Acana', 'Royal Canin', 'HUFT'],

  // Nuanced product questions
  'nuanced_collar_indie': ['HUFT', 'Petsy'],
  'nuanced_bed_hot_weather': ['HUFT', 'Petsy', 'Amazon'],

  // Nuanced location questions
  'nuanced_delivery_tier2': ['HUFT', 'Supertails', 'Petsy'],
  'nuanced_store_delhi': ['HUFT', 'Petsy'],
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

const HUFT_BRANDS = [
  'HUFT',
  'Heads Up For Tails',
  'HeadsUpForTails',
  "Sara's Treats",
  'Saras Treats',
  'Indian Collective',
  'Tail Lovers Company',
  'TLC',
  "Nature's Hug",
  'Natures Hug',
]

const COMPETITORS = [
  'Petsy',
  'Supertails',
  'Royal Canin',
  'Pedigree',
  'Drools',
  'Farmina',
  'Whiskas',
  'Me-O',
  'Zigly',
  'Wiggles',
  'Amazon',
  'Beaphar',
  'Wahl',
  'Orijen',
  'Himalaya',
]

function detectBrandMentions(response: string): { huftBrands: string[], competitors: string[] } {
  const huftFound: string[] = []
  const compFound: string[] = []

  for (const brand of HUFT_BRANDS) {
    if (response.toLowerCase().includes(brand.toLowerCase())) {
      huftFound.push(brand)
    }
  }

  for (const brand of COMPETITORS) {
    if (response.toLowerCase().includes(brand.toLowerCase())) {
      compFound.push(brand)
    }
  }

  return { huftBrands: [...new Set(huftFound)], competitors: [...new Set(compFound)] }
}

function scoreHuftVisibility(questionId: string, response: string): {
  score: number
  huftBrands: string[]
  competitors: string[]
  expectedBrands: string[]
  missing: string[]
} {
  const { huftBrands, competitors } = detectBrandMentions(response)
  const expected = EXPECTED_BRANDS[questionId] || []

  // Check for any HUFT brand in expected
  const allBrands = [...huftBrands, ...competitors]
  const missing = expected.filter(b => !allBrands.some(found =>
    found.toLowerCase().includes(b.toLowerCase()) ||
    b.toLowerCase().includes(found.toLowerCase())
  ))

  // Score: % of expected brands that were mentioned
  const score = expected.length > 0
    ? Math.round((expected.filter(b => allBrands.some(found =>
        found.toLowerCase().includes(b.toLowerCase()) ||
        b.toLowerCase().includes(found.toLowerCase())
      )).length / expected.length) * 100)
    : 0

  return { score, huftBrands, competitors, expectedBrands: expected, missing }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const args = process.argv.slice(2)
  const categoryArg = args.find(a => a.startsWith('--category='))
  const selectedCategory = categoryArg?.split('=')[1]?.toLowerCase()

  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║  HUFT (Heads Up For Tails) - AI VISIBILITY TEST            ║')
  console.log('╠════════════════════════════════════════════════════════════╣')
  console.log("║  India's largest pet care brand                            ║")
  console.log("║  Sub-brands: Sara's Treats, Indian Collective, TLC         ║")
  console.log('╚════════════════════════════════════════════════════════════╝')
  console.log('')

  // Select questions based on category filter
  let questions = ALL_QUESTIONS
  if (selectedCategory) {
    questions = ALL_QUESTIONS.filter(q => q.category === selectedCategory)
    console.log(`📌 Filtering to ${selectedCategory} questions only`)
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

  try {
    const run = await runMonitoring(
      'Heads Up For Tails',
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
    console.log('  HUFT VISIBILITY SUMMARY')
    console.log('════════════════════════════════════════════════════════════')

    let totalScore = 0
    let huftAppearances = 0

    for (const result of results) {
      const visibility = scoreHuftVisibility(result.questionId, result.response)
      totalScore += visibility.score

      if (visibility.huftBrands.length > 0) huftAppearances++

      console.log(`\n${result.questionId} (${result.surface}):`)
      console.log(`  HUFT brands: ${visibility.huftBrands.join(', ') || 'NONE'}`)
      console.log(`  Competitors: ${visibility.competitors.join(', ') || 'none'}`)
      console.log(`  Score: ${visibility.score}%`)
      if (visibility.missing.length > 0) {
        console.log(`  Missing: ${visibility.missing.join(', ')}`)
      }
    }

    const avgScore = results.length > 0 ? Math.round(totalScore / results.length) : 0

    console.log('')
    console.log('════════════════════════════════════════════════════════════')
    console.log('  OVERALL RESULTS')
    console.log('════════════════════════════════════════════════════════════')
    console.log(`  Average Visibility Score: ${avgScore}%`)
    console.log(`  HUFT Appearances: ${huftAppearances}/${results.length}`)
    console.log(`  Total Queries: ${run.stats.totalQueries}`)
    console.log(`  Successful: ${run.stats.successfulQueries}`)
    console.log('')

  } catch (error) {
    console.error('❌ Error running test:', error)
    process.exit(1)
  }
}

main().catch(console.error)
