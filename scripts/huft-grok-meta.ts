/**
 * HUFT - Grok + Meta AI only test
 */
import 'dotenv/config'
import { runMonitoring } from './run-monitoring.js'

const ALL_QUESTIONS = [
  // Food
  { id: 'food_best_dog', question: 'What is the best dog food brand in India?', category: 'food' },
  { id: 'food_premium', question: 'What are good premium dog food options in India?', category: 'food' },
  { id: 'food_puppy', question: 'Best dog food for puppies in India?', category: 'food' },
  { id: 'food_treats', question: 'What are healthy dog treats without preservatives in India?', category: 'food' },
  { id: 'food_vegan', question: 'Is there vegan dog food available in India?', category: 'food' },
  { id: 'food_allergy', question: 'Best food for dogs with allergies in India?', category: 'food' },
  // Cat
  { id: 'cat_food', question: 'Best cat food brands in India?', category: 'cat' },
  { id: 'cat_toys', question: 'Best cat toys available in India?', category: 'cat' },
  { id: 'cat_litter', question: 'Where to buy cat litter in India?', category: 'cat' },
  { id: 'cat_scratch', question: 'Best cat scratching posts in India?', category: 'cat' },
  // Accessories
  { id: 'acc_collar', question: 'Best dog collars and leashes in India?', category: 'accessories' },
  { id: 'acc_bed', question: 'Where to buy dog beds in India?', category: 'accessories' },
  { id: 'acc_clothes', question: 'Traditional Indian style clothes for dogs?', category: 'accessories' },
  { id: 'acc_bowl', question: 'Best dog bowls and feeders in India?', category: 'accessories' },
  { id: 'acc_toys', question: 'Where to buy dog toys in India?', category: 'accessories' },
  { id: 'acc_grooming', question: 'Best dog grooming products in India?', category: 'accessories' },
  { id: 'acc_shampoo', question: 'Best dog shampoo brands in India?', category: 'accessories' },
  // Services
  { id: 'svc_spa', question: 'Where are the best pet spas in Delhi NCR?', category: 'services' },
  { id: 'svc_vet', question: 'How to find a good vet in Bangalore?', category: 'services' },
  { id: 'svc_grooming', question: 'Best pet grooming services in Mumbai?', category: 'services' },
  { id: 'svc_daycare', question: 'Pet daycare options in Hyderabad?', category: 'services' },
  { id: 'svc_boarding', question: 'Where can I board my dog in Chennai?', category: 'services' },
  { id: 'svc_trainer', question: 'Best dog trainers in India?', category: 'services' },
  // Shopping
  { id: 'shop_online', question: 'Best online pet stores in India?', category: 'shopping' },
  { id: 'shop_gurgaon', question: 'Best pet shops in Gurgaon?', category: 'shopping' },
  { id: 'shop_delhi', question: 'Pet stores near me in Delhi?', category: 'shopping' },
  // Comparison
  { id: 'comp_petsy', question: 'HUFT vs Petsy - which is better for pet products?', category: 'comparison' },
  { id: 'comp_supertails', question: 'Heads Up For Tails vs Supertails - which has better products?', category: 'comparison' },
  { id: 'comp_royal', question: 'Is HUFT dog food better than Royal Canin?', category: 'comparison' },
  // Brand
  { id: 'brand_huft', question: 'What products does Heads Up For Tails sell?', category: 'brand' },
  { id: 'brand_quality', question: 'Is HUFT a good brand for pet products?', category: 'brand' },
  { id: 'brand_saras', question: "What is Sara's Treats?", category: 'brand' },
  { id: 'brand_stores', question: 'Where are HUFT stores located in India?', category: 'brand' },
  // Use case
  { id: 'use_puppy_essentials', question: 'What do I need for a new puppy in India?', category: 'use-case' },
  { id: 'use_dry_skin', question: 'My dog has dry skin, what products can help?', category: 'use-case' },
  { id: 'use_travel', question: 'Best products for traveling with a dog in India?', category: 'use-case' },
  { id: 'use_gift', question: 'Good gift ideas for someone who just got a pet in India?', category: 'use-case' },
  { id: 'use_monsoon', question: 'How to care for dogs during monsoon season in India?', category: 'use-case' },
  { id: 'use_summer', question: 'Keeping dogs cool in Indian summer heat?', category: 'use-case' },
  { id: 'use_diwali', question: 'Diwali outfits for dogs available in India?', category: 'use-case' },
  // Nuanced
  { id: 'nuanced_senior_golden', question: 'I have a 15 year old Golden Retriever who weighs about 75 pounds. What dog food will provide the best nutrition and be easily digestible? Where can I buy it in India?', category: 'nuanced-senior' },
  { id: 'nuanced_senior_lab', question: 'My 12 year old Labrador has joint problems. What food has glucosamine and is available in Bangalore?', category: 'nuanced-senior' },
  { id: 'nuanced_senior_kidney', question: 'Vet says my 14 year old dog has early kidney issues. What low-phosphorus food is available in India?', category: 'nuanced-senior' },
  { id: 'nuanced_senior_teeth', question: 'My senior dog lost most of his teeth. What soft food options are there in India?', category: 'nuanced-senior' },
  { id: 'nuanced_puppy_gsd', question: 'I just got a 2 month old German Shepherd puppy. What large breed puppy food is best? First time dog owner in India.', category: 'nuanced-puppy' },
  { id: 'nuanced_puppy_indie', question: 'Adopted an Indian street puppy (indie), about 3 months old. She seems malnourished. What food should I start her on?', category: 'nuanced-puppy' },
  { id: 'nuanced_puppy_picky', question: "My Shih Tzu puppy (4 months) is a picky eater and underweight. What high-calorie food will she actually eat?", category: 'nuanced-puppy' },
  { id: 'nuanced_allergy_chicken', question: 'My Beagle is allergic to chicken. What protein alternatives are available in Indian dog food brands?', category: 'nuanced-allergy' },
  { id: 'nuanced_allergy_ibd', question: 'My dog has IBD and needs easily digestible food with limited ingredients. What brands in India cater to sensitive stomachs?', category: 'nuanced-allergy' },
  { id: 'nuanced_allergy_pancreatitis', question: 'Looking for low-fat dog food in India. My dog had pancreatitis and vet says he needs under 10% fat content.', category: 'nuanced-allergy' },
  { id: 'nuanced_lifestyle_mumbai', question: 'I have a Persian cat in a small Mumbai apartment. What litter brand controls odor best in hot weather?', category: 'nuanced-lifestyle' },
  { id: 'nuanced_lifestyle_wfh', question: "I work from home but my Lab gets bored. What interactive toys will keep him busy for hours that won't break in a day?", category: 'nuanced-lifestyle' },
  { id: 'nuanced_lifestyle_monsoon', question: 'Need a raincoat for my medium-sized dog for Mumbai monsoons. What brands fit Indian dogs well?', category: 'nuanced-lifestyle' },
  { id: 'nuanced_budget_indie', question: 'Best dog food under Rs 2000 for a 10kg indie? Want good quality but limited budget.', category: 'nuanced-budget' },
  { id: 'nuanced_budget_premium', question: 'Money is no issue - what is the absolute best premium dog food I can buy in India for my Husky?', category: 'nuanced-budget' },
  { id: 'nuanced_bed_hot', question: 'Need a cooling bed for my dog who overheats easily. What options ship to Pune?', category: 'nuanced-product' },
  { id: 'nuanced_delivery_tier2', question: 'Do online pet stores deliver to Jaipur? Looking for specific brands like Farmina.', category: 'nuanced-location' },
  { id: 'nuanced_store_delhi', question: "I'm visiting Delhi and want to buy supplies. What pet stores have the best selection in South Delhi?", category: 'nuanced-location' },
]

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║  HUFT - GROK + META AI TEST                                ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  console.log('')
  console.log(`📋 Questions: ${ALL_QUESTIONS.length}`)
  console.log('🎯 Surfaces: grok, meta-ai')
  console.log('')

  const run = await runMonitoring(
    'Heads Up For Tails',
    ALL_QUESTIONS,
    {
      surfaces: ['grok', 'meta-ai'] as any,
      headless: false,
      agentCount: 2,
    }
  )

  console.log('')
  console.log('════════════════════════════════════════════════════════════')
  console.log('  HUFT GROK + META AI COMPLETE')
  console.log('════════════════════════════════════════════════════════════')
}

main().catch(console.error)
