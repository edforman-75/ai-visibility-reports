/**
 * HUFT - API Surface Test
 *
 * Tests HUFT questions through API endpoints (not browser interfaces)
 * APIs: Claude, Gemini, Perplexity (OpenAI disabled due to quota)
 */

import 'dotenv/config'
import * as fs from 'fs/promises'

interface Question {
  id: string
  question: string
  category: string
}

// Full 59 HUFT questions
const QUESTIONS: Question[] = [
  // Dog Food (6)
  { id: 'huft_food_best', question: 'What is the best dog food brand in India?', category: 'dog-food' },
  { id: 'huft_food_premium', question: 'What are good premium dog food options in India?', category: 'dog-food' },
  { id: 'huft_food_puppy', question: 'Best dog food for puppies in India?', category: 'dog-food' },
  { id: 'huft_food_treats', question: 'What are healthy dog treats without preservatives in India?', category: 'dog-food' },
  { id: 'huft_food_vegan', question: 'Is there vegan dog food available in India?', category: 'dog-food' },
  { id: 'huft_food_allergy', question: 'Best food for dogs with allergies in India?', category: 'dog-food' },

  // Cat Products (4)
  { id: 'huft_cat_food', question: 'Best cat food brands in India?', category: 'cat-products' },
  { id: 'huft_cat_toys', question: 'Best cat toys available in India?', category: 'cat-products' },
  { id: 'huft_cat_litter', question: 'Where to buy cat litter in India?', category: 'cat-products' },
  { id: 'huft_cat_scratcher', question: 'Best cat scratching posts in India?', category: 'cat-products' },

  // Accessories (6)
  { id: 'huft_acc_collar', question: 'Best dog collars and leashes in India?', category: 'accessories' },
  { id: 'huft_acc_bed', question: 'Where to buy dog beds in India?', category: 'accessories' },
  { id: 'huft_acc_indian', question: 'Traditional Indian style clothes for dogs?', category: 'accessories' },
  { id: 'huft_acc_bowl', question: 'Best dog bowls and feeders in India?', category: 'accessories' },
  { id: 'huft_acc_toy', question: 'Where to buy dog toys in India?', category: 'accessories' },
  { id: 'huft_acc_winter', question: 'Best winter jackets for dogs in India?', category: 'accessories' },

  // Grooming (5)
  { id: 'huft_groom_products', question: 'Best dog grooming products in India?', category: 'grooming' },
  { id: 'huft_groom_shampoo', question: 'Best dog shampoo brands in India?', category: 'grooming' },
  { id: 'huft_groom_delhi', question: 'Where are the best pet spas in Delhi NCR?', category: 'grooming' },
  { id: 'huft_groom_mumbai', question: 'Best dog grooming services in Mumbai?', category: 'grooming' },
  { id: 'huft_groom_bangalore', question: 'Where can I get my dog groomed in Bangalore?', category: 'grooming' },

  // Shopping (4)
  { id: 'huft_shop_stores', question: 'Best pet stores in India?', category: 'shopping' },
  { id: 'huft_shop_online', question: 'Where to buy pet supplies online in India?', category: 'shopping' },
  { id: 'huft_shop_gurgaon', question: 'Best pet shops in Gurgaon?', category: 'shopping' },
  { id: 'huft_shop_delhi', question: 'Pet stores near me in Delhi?', category: 'shopping' },

  // Brand Discovery (4)
  { id: 'huft_brand_top', question: 'What are the top pet product companies in India?', category: 'brand-discovery' },
  { id: 'huft_brand_startup', question: 'Which Indian startups are in the pet industry?', category: 'brand-discovery' },
  { id: 'huft_brand_trusted', question: 'What are the most trusted pet brands in India?', category: 'brand-discovery' },
  { id: 'huft_brand_shop', question: 'Best places to shop for pets in India?', category: 'brand-discovery' },

  // Comparison (5)
  { id: 'huft_vs_petsy', question: 'HUFT vs Petsy - which is better for pet products in India?', category: 'comparison' },
  { id: 'huft_vs_supertails', question: 'Heads Up For Tails vs Supertails - which has better products?', category: 'comparison' },
  { id: 'huft_vs_royalcanin', question: 'Is HUFT dog food better than Royal Canin?', category: 'comparison' },
  { id: 'huft_worth_it', question: 'Are HUFT products worth the price?', category: 'comparison' },
  { id: 'huft_vs_amazon', question: 'HUFT vs Amazon for pet products - pros and cons?', category: 'comparison' },

  // Use Cases (7)
  { id: 'huft_use_newpuppy', question: 'I just got a puppy in India, what supplies do I need?', category: 'use-case' },
  { id: 'huft_use_dryskin', question: 'My dog has dry skin, what products can help?', category: 'use-case' },
  { id: 'huft_use_travel', question: 'Best products for traveling with a dog in India?', category: 'use-case' },
  { id: 'huft_use_gift', question: 'Good gift ideas for someone who just got a pet in India?', category: 'use-case' },
  { id: 'huft_use_training', question: 'What products help with puppy training in India?', category: 'use-case' },
  { id: 'huft_use_adoption', question: 'Where to adopt a dog in India and what to buy first?', category: 'use-case' },
  { id: 'huft_use_diwali', question: 'Diwali outfits and treats for dogs in India?', category: 'use-case' },

  // Nuanced (18)
  { id: 'nuanced_senior_golden', question: 'I have a 15 year old Golden Retriever who weighs about 75 pounds. What dog food will provide the best nutrition and be easily digestible? Where can I buy it in India?', category: 'nuanced-senior' },
  { id: 'nuanced_senior_joint', question: 'My 12 year old Labrador has joint problems. What food has glucosamine and is available in Bangalore?', category: 'nuanced-senior' },
  { id: 'nuanced_senior_kidney', question: 'Vet says my 14 year old dog has early kidney issues. What low-phosphorus food is available in India?', category: 'nuanced-senior' },
  { id: 'nuanced_gsd_puppy', question: 'Just got a 2 month old German Shepherd puppy. What food will help with proper bone development without growing too fast?', category: 'nuanced-puppy' },
  { id: 'nuanced_indie_puppy', question: 'Adopted an Indian street puppy (indie), about 3 months old. She seems malnourished. What food should I start her on?', category: 'nuanced-puppy' },
  { id: 'nuanced_small_breed_puppy', question: 'My Shih Tzu puppy (4 months) is a picky eater and underweight. What high-calorie food will she actually eat?', category: 'nuanced-puppy' },
  { id: 'nuanced_allergy_chicken', question: 'My Beagle is allergic to chicken. What protein alternatives are available in Indian dog food brands?', category: 'nuanced-allergy' },
  { id: 'nuanced_ibd', question: 'My dog has IBD and needs easily digestible food with limited ingredients. What brands in India cater to sensitive stomachs?', category: 'nuanced-allergy' },
  { id: 'nuanced_pancreatitis', question: 'Dog was just diagnosed with pancreatitis. Vet said low-fat diet. What options are there in India?', category: 'nuanced-allergy' },
  { id: 'nuanced_apartment_cat', question: 'I have a Persian cat in a small Mumbai apartment. What litter brand controls odor best in hot weather?', category: 'nuanced-lifestyle' },
  { id: 'nuanced_working_pet_parent', question: "I work from home but my Lab gets bored. What interactive toys will keep him busy for hours that won't break in a day?", category: 'nuanced-lifestyle' },
  { id: 'nuanced_monsoon_walks', question: 'Need a raincoat for my medium-sized dog for Mumbai monsoons. What brands fit Indian dogs well?', category: 'nuanced-lifestyle' },
  { id: 'nuanced_budget_quality_food', question: 'Best dog food under Rs 2000 for a 10kg indie? Want good quality but limited budget.', category: 'nuanced-budget' },
  { id: 'nuanced_premium_worth', question: 'Is Farmina or Acana worth 3x the price of Pedigree for a healthy adult Lab?', category: 'nuanced-budget' },
  { id: 'nuanced_collar_indie', question: 'My indie has thick neck fur. What collar type works best - flat, rolled, or martingale?', category: 'nuanced-product' },
  { id: 'nuanced_bed_hot_weather', question: 'Looking for a cooling bed for my Husky who overheats in Delhi summers. Any Indian brands make these?', category: 'nuanced-product' },
  { id: 'nuanced_delivery_tier2', question: 'I live in Jaipur. Which pet store delivers here fastest - HUFT, Supertails, or Petsy?', category: 'nuanced-location' },
  { id: 'nuanced_store_delhi', question: 'Want to visit a physical pet store in South Delhi to try harnesses before buying. Which stores have the best selection?', category: 'nuanced-location' },
]

interface APIConfig {
  name: string
  url: string | (() => string)
  headers: () => Record<string, string>
  buildBody: (question: string) => any
  extractText: (data: any) => string
  envKey: string
}

const APIS: APIConfig[] = [
  {
    name: 'Gemini (2.0 Flash)',
    url: () => `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
    headers: () => ({
      'Content-Type': 'application/json'
    }),
    buildBody: (question) => ({
      contents: [{ parts: [{ text: question }] }]
    }),
    extractText: (data) => data.candidates?.[0]?.content?.parts?.[0]?.text || '',
    envKey: 'GOOGLE_API_KEY'
  },
  {
    name: 'Perplexity (Sonar)',
    url: 'https://api.perplexity.ai/chat/completions',
    headers: () => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
    }),
    buildBody: (question) => ({
      model: 'sonar',
      messages: [{ role: 'user', content: question }],
      max_tokens: 500
    }),
    extractText: (data) => data.choices?.[0]?.message?.content || '',
    envKey: 'PERPLEXITY_API_KEY'
  },
  {
    name: 'Llama 3.3 (Together.ai)',
    url: 'https://api.together.xyz/v1/chat/completions',
    headers: () => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`
    }),
    buildBody: (question) => ({
      model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
      messages: [{ role: 'user', content: question }],
      max_tokens: 500
    }),
    extractText: (data) => data.choices?.[0]?.message?.content || '',
    envKey: 'TOGETHER_API_KEY'
  },
  // Note: OpenAI disabled due to API quota issues
]

interface Result {
  api: string
  question: string
  questionId: string
  category: string
  success: boolean
  response?: string
  error?: string
  latencyMs: number
  huftMentioned: boolean
}

async function queryAPI(api: APIConfig, question: Question): Promise<Result> {
  const start = Date.now()
  const url = typeof api.url === 'function' ? api.url() : api.url

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: api.headers(),
      body: JSON.stringify(api.buildBody(question.question))
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 200)}`)
    }

    const data = await response.json()
    const text = api.extractText(data)
    const huftMentioned = /huft|heads\s*up\s*for\s*tails/i.test(text)

    return {
      api: api.name,
      question: question.question,
      questionId: question.id,
      category: question.category,
      success: true,
      response: text,
      latencyMs: Date.now() - start,
      huftMentioned
    }
  } catch (error: any) {
    return {
      api: api.name,
      question: question.question,
      questionId: question.id,
      category: question.category,
      success: false,
      error: error.message,
      latencyMs: Date.now() - start,
      huftMentioned: false
    }
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║  HUFT - API Test                                          ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  console.log()
  console.log(`📋 Questions: ${QUESTIONS.length}`)
  console.log(`🔌 APIs: ${APIS.map(a => a.name).join(', ')}`)
  console.log()

  // Check API keys
  const availableApis = APIS.filter(api => {
    const hasKey = !!process.env[api.envKey]
    if (!hasKey) {
      console.log(`⚠ Skipping ${api.name}: ${api.envKey} not set`)
    }
    return hasKey
  })

  if (availableApis.length === 0) {
    console.log('❌ No API keys configured. Set GOOGLE_API_KEY or PERPLEXITY_API_KEY')
    process.exit(1)
  }

  console.log()

  const results: Result[] = []

  for (let i = 0; i < QUESTIONS.length; i++) {
    const question = QUESTIONS[i]
    console.log(`[${i + 1}/${QUESTIONS.length}] ${question.id}`)
    console.log(`  Q: ${question.question.substring(0, 60)}...`)

    for (const api of availableApis) {
      const result = await queryAPI(api, question)
      results.push(result)

      if (result.success) {
        console.log(`  ${api.name}: ${result.huftMentioned ? '✓ HUFT' : '✗ No HUFT'} (${result.latencyMs}ms)`)
      } else {
        console.log(`  ${api.name}: ✗ Error - ${result.error?.substring(0, 50)}`)
      }
    }
    console.log()

    // Small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 500))
  }

  // Calculate stats per API
  console.log('════════════════════════════════════════════════════════════')
  console.log('  RESULTS BY API')
  console.log('════════════════════════════════════════════════════════════')

  for (const api of availableApis) {
    const apiResults = results.filter(r => r.api === api.name)
    const successful = apiResults.filter(r => r.success)
    const huftMentions = successful.filter(r => r.huftMentioned)

    console.log(`\n${api.name}:`)
    console.log(`  Success Rate: ${successful.length}/${apiResults.length} (${Math.round(successful.length / apiResults.length * 100)}%)`)
    console.log(`  HUFT Mentions: ${huftMentions.length}/${successful.length} (${Math.round(huftMentions.length / successful.length * 100)}%)`)
  }

  // Save results
  const timestamp = Date.now()
  const outputPath = `./scripts/consumer-monitoring/output/huft-api-${timestamp}.json`

  const output = {
    timestamp: new Date().toISOString(),
    totalQuestions: QUESTIONS.length,
    apis: availableApis.map(a => a.name),
    results,
    summary: availableApis.map(api => {
      const apiResults = results.filter(r => r.api === api.name)
      const successful = apiResults.filter(r => r.success)
      const huftMentions = successful.filter(r => r.huftMentioned)
      return {
        api: api.name,
        totalQueries: apiResults.length,
        successfulQueries: successful.length,
        huftMentions: huftMentions.length,
        huftMentionRate: Math.round(huftMentions.length / successful.length * 100)
      }
    })
  }

  await fs.writeFile(outputPath, JSON.stringify(output, null, 2))
  console.log(`\n📁 Results saved: ${outputPath}`)
}

main().catch(console.error)
