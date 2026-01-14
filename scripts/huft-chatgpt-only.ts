/**
 * HUFT - ChatGPT Only Test (FULL QUESTION SET)
 *
 * Runs ALL 59 HUFT questions through ChatGPT with manual CAPTCHA solving.
 * The browser will be visible and pause when CAPTCHAs appear.
 *
 * Usage:
 *   MANUAL_CAPTCHA=true npx tsx scripts/consumer-monitoring/huft-chatgpt-only.ts
 */

import 'dotenv/config'
import { chromium, Browser, Page } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

// Set manual captcha mode
process.env.MANUAL_CAPTCHA = 'true'

// ============================================================================
// FULL HUFT QUESTION SETS BY CATEGORY (59 questions total)
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

// Combined full question set (59 questions)
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

// Questions already completed in prior run (20 questions)
const COMPLETED_IDS = new Set([
  'huft_food_best', 'huft_food_premium', 'huft_food_treats',
  'huft_cat_food', 'huft_cat_litter',
  'huft_acc_collar', 'huft_acc_bed',
  'huft_groom_products',
  'huft_shop_online', 'huft_shop_gurgaon',
  'huft_vs_petsy', 'huft_vs_supertails',
  'huft_brand_what', 'huft_brand_good', 'huft_brand_stores',
  'huft_use_newpuppy',
  'nuanced_senior_golden', 'nuanced_indie_puppy', 'nuanced_allergy_chicken', 'nuanced_delivery_tier2',
])

// Only run missing questions (39 remaining)
const HUFT_QUESTIONS = ALL_QUESTIONS.filter(q => !COMPLETED_IDS.has(q.id))

interface QueryResult {
  questionId: string
  question: string
  success: boolean
  response: string
  error?: string
  responseTimeMs: number
}

const results: QueryResult[] = []

async function waitForCaptchaSolve(page: Page): Promise<boolean> {
  console.log('\n  🔒 CAPTCHA/Challenge detected!')
  console.log('  👀 Please solve it in the browser window...')
  console.log('  ⏳ Waiting up to 120 seconds...\n')

  const startTime = Date.now()
  const maxWaitMs = 120000

  for (let i = 0; i < 120; i++) {
    await new Promise(r => setTimeout(r, 1000))

    // Check if we're past the challenge
    const isChallengeGone = await page.evaluate(() => {
      const body = document.body.textContent || ''
      const title = document.title || ''
      // Cloudflare/ChatGPT challenge indicators
      if (body.includes('Verify you are human')) return false
      if (body.includes('Just a moment')) return false
      if (body.includes('checking your browser')) return false
      if (title.includes('Just a moment')) return false
      // If we have ChatGPT's main interface
      if (document.querySelector('#prompt-textarea')) return true
      if (document.querySelector('textarea')) return true
      return body.length > 1000
    })

    if (isChallengeGone) {
      console.log(`  ✓ Challenge solved in ${Math.round((Date.now() - startTime) / 1000)}s`)
      return true
    }

    if (i > 0 && i % 15 === 0) {
      console.log(`  ⏳ Still waiting... (${i}s)`)
    }

    if (Date.now() - startTime > maxWaitMs) {
      break
    }
  }

  console.log('  ✗ Timeout waiting for challenge solve')
  return false
}

async function dismissRateLimitModal(page: Page): Promise<void> {
  // Check for rate limit modal that appears for non-logged-in users
  try {
    const modal = await page.$('[data-testid="modal-no-auth-rate-limit"]')
    if (modal) {
      console.log('    📋 Rate limit modal detected - please click "Stay logged out"...')

      // Wait for user to dismiss it manually (up to 30 seconds)
      for (let i = 0; i < 30; i++) {
        await page.waitForTimeout(1000)
        const stillThere = await page.$('[data-testid="modal-no-auth-rate-limit"]')
        if (!stillThere) {
          console.log('    ✓ Modal dismissed')
          return
        }
      }

      // Last resort - try Escape
      await page.keyboard.press('Escape')
      await page.waitForTimeout(1000)
    }
  } catch (e) {
    // Ignore errors - modal may not exist
  }
}

async function queryChatGPT(page: Page, question: string): Promise<{ success: boolean; response: string; error?: string }> {
  try {
    // Navigate to ChatGPT
    await page.goto('https://chatgpt.com/', { waitUntil: 'domcontentloaded', timeout: 30000 })
    await page.waitForTimeout(3000)

    // Dismiss any rate limit modal first
    await dismissRateLimitModal(page)

    // Check for challenge/CAPTCHA
    const hasChallenge = await page.evaluate(() => {
      const body = document.body.textContent || ''
      const title = document.title || ''
      return (
        body.includes('Verify you are human') ||
        body.includes('Just a moment') ||
        body.includes('checking your browser') ||
        title.includes('Just a moment')
      )
    })

    if (hasChallenge) {
      const solved = await waitForCaptchaSolve(page)
      if (!solved) {
        return { success: false, response: '', error: 'CAPTCHA timeout' }
      }
      await page.waitForTimeout(2000)
    }

    // Dismiss modal again in case it appeared after challenge
    await dismissRateLimitModal(page)

    // Find input
    const inputSelectors = [
      '#prompt-textarea',
      'textarea[placeholder*="Message"]',
      'div[contenteditable="true"]',
      'textarea'
    ]

    let input = null
    for (const selector of inputSelectors) {
      input = await page.$(selector)
      if (input) break
    }

    if (!input) {
      // Maybe need to click "Try ChatGPT"
      const tryBtn = await page.$('button:has-text("Try ChatGPT")')
      if (tryBtn) {
        await tryBtn.click()
        await page.waitForTimeout(2000)
        for (const selector of inputSelectors) {
          input = await page.$(selector)
          if (input) break
        }
      }
    }

    if (!input) {
      return { success: false, response: '', error: 'Could not find input field' }
    }

    // Type question
    await input.click()
    await page.keyboard.type(question, { delay: 20 })
    await page.waitForTimeout(500)

    // Submit
    await page.keyboard.press('Enter')
    await page.waitForTimeout(3000)

    // Wait for response to complete
    let lastLength = 0
    let stableCount = 0

    for (let i = 0; i < 60; i++) {
      await page.waitForTimeout(1000)

      // Check for and dismiss rate limit modal periodically
      if (i % 5 === 0) {
        await dismissRateLimitModal(page)
      }

      const responseElements = await page.$$('[data-message-author-role="assistant"]')
      if (responseElements.length > 0) {
        const lastResponse = responseElements[responseElements.length - 1]
        const text = await lastResponse.textContent() || ''

        if (text.length === lastLength && text.length > 50) {
          stableCount++
          if (stableCount >= 2) {
            return { success: true, response: text.trim() }
          }
        } else {
          stableCount = 0
          lastLength = text.length
        }
      }

      if (i % 10 === 9) {
        console.log(`    Waiting for response... (${i + 1}s)`)
      }
    }

    // Fallback
    const anyText = await page.evaluate(() => {
      const msgs = document.querySelectorAll('[data-message-author-role="assistant"]')
      if (msgs.length > 0) return msgs[msgs.length - 1].textContent || ''
      return ''
    })

    if (anyText.length > 50) {
      return { success: true, response: anyText.trim() }
    }

    return { success: false, response: '', error: 'Timeout waiting for response' }

  } catch (error) {
    return { success: false, response: '', error: String(error) }
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║  HUFT - ChatGPT Test (RESUMING - 39 remaining questions)   ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  console.log('')
  console.log(`📋 Questions remaining: ${HUFT_QUESTIONS.length} of 59`)
  console.log(`✓  Already completed: ${COMPLETED_IDS.size}`)
  console.log('')
  console.log('🖐️  When "Stay logged out" modal appears, click it manually.')
  console.log('')

  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  })

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  })

  const page = await context.newPage()

  let successCount = 0
  let huftMentions = 0

  for (let i = 0; i < HUFT_QUESTIONS.length; i++) {
    const q = HUFT_QUESTIONS[i]
    console.log(`\n[${i + 1}/${HUFT_QUESTIONS.length}] ${q.id}`)
    console.log(`  Q: ${q.question.slice(0, 60)}...`)

    const startTime = Date.now()
    const result = await queryChatGPT(page, q.question)
    const responseTimeMs = Date.now() - startTime

    if (result.success) {
      successCount++
      const hasHUFT = result.response.toLowerCase().includes('huft') ||
                      result.response.toLowerCase().includes('heads up for tails')
      if (hasHUFT) huftMentions++

      console.log(`  ✓ Success (${Math.round(responseTimeMs / 1000)}s)`)
      console.log(`  HUFT mentioned: ${hasHUFT ? 'YES ✓' : 'NO'}`)
      console.log(`  Response preview: ${result.response.slice(0, 100)}...`)
    } else {
      console.log(`  ✗ Failed: ${result.error}`)
    }

    results.push({
      questionId: q.id,
      question: q.question,
      success: result.success,
      response: result.response,
      error: result.error,
      responseTimeMs
    })

    // Brief pause between queries
    if (i < HUFT_QUESTIONS.length - 1) {
      await page.waitForTimeout(2000)
    }
  }

  await browser.close()

  // Save results
  const outputDir = path.join(process.cwd(), 'output')
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

  const outputPath = path.join(outputDir, `huft-chatgpt-${Date.now()}.json`)
  fs.writeFileSync(outputPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    surface: 'chatgpt',
    totalQuestions: HUFT_QUESTIONS.length,
    successfulQueries: successCount,
    huftMentions,
    results
  }, null, 2))

  console.log('')
  console.log('════════════════════════════════════════════════════════════')
  console.log('  RESULTS')
  console.log('════════════════════════════════════════════════════════════')
  console.log(`  Success Rate: ${successCount}/${HUFT_QUESTIONS.length} (${Math.round(successCount / HUFT_QUESTIONS.length * 100)}%)`)
  console.log(`  HUFT Mentions: ${huftMentions}/${successCount} successful queries`)
  console.log(`  HUFT Mention Rate: ${successCount > 0 ? Math.round(huftMentions / successCount * 100) : 0}%`)
  console.log(`  Results saved: ${outputPath}`)
  console.log('')
}

main().catch(console.error)
