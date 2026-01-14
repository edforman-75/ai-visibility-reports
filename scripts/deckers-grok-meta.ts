/**
 * Deckers - Grok + Meta AI only test
 */
import 'dotenv/config'
import { runMonitoring } from './run-monitoring.js'

const ALL_QUESTIONS = [
  // HOKA
  { id: 'hoka_beginners', question: 'What are the best running shoes for beginners?', category: 'recommendation' },
  { id: 'hoka_marathon', question: 'What shoes are best for marathon training?', category: 'recommendation' },
  { id: 'hoka_cushioned', question: 'What are the most cushioned running shoes available?', category: 'recommendation' },
  { id: 'hoka_heavy', question: 'What are the best running shoes for heavy runners over 200 pounds?', category: 'recommendation' },
  { id: 'hoka_ultra', question: 'What shoes do ultramarathon runners wear?', category: 'recommendation' },
  { id: 'hoka_nurses', question: 'What are the best shoes for nurses who stand all day?', category: 'recommendation' },
  { id: 'hoka_plantar', question: 'Best shoes for plantar fasciitis runners?', category: 'medical' },
  { id: 'hoka_knee', question: 'What shoes help with knee pain?', category: 'medical' },
  { id: 'hoka_vs_brooks', question: 'HOKA vs Brooks - which is better for running?', category: 'comparison' },
  { id: 'hoka_vs_nb', question: 'HOKA vs New Balance - which has better cushioning?', category: 'comparison' },
  { id: 'hoka_worth_it', question: 'Are HOKA shoes worth the money?', category: 'comparison' },
  // UGG
  { id: 'ugg_winter', question: 'What are the best winter boots for women?', category: 'recommendation' },
  { id: 'ugg_slippers', question: 'What are the most comfortable slippers?', category: 'recommendation' },
  { id: 'ugg_trending', question: 'What boots are trending right now?', category: 'recommendation' },
  { id: 'ugg_gifts', question: 'What are the best cozy gifts for women?', category: 'recommendation' },
  { id: 'ugg_stylish', question: 'What are warm boots that actually look good?', category: 'recommendation' },
  { id: 'ugg_wfh', question: 'Best slippers for working from home?', category: 'recommendation' },
  { id: 'ugg_vs_bearpaw', question: 'UGG vs Bearpaw - what is the quality difference?', category: 'comparison' },
  // Teva
  { id: 'teva_hiking', question: 'What are the best hiking sandals?', category: 'recommendation' },
  { id: 'teva_water', question: 'What sandals are best for water activities?', category: 'recommendation' },
  { id: 'teva_walking', question: 'What are the most comfortable walking sandals?', category: 'recommendation' },
  { id: 'teva_travel', question: 'What sandals are best for travel?', category: 'recommendation' },
  { id: 'teva_vs_chaco', question: 'Teva vs Chaco - which sandal is better for hiking?', category: 'comparison' },
  // Sanuk
  { id: 'sanuk_casual', question: 'What are the most comfortable casual shoes?', category: 'recommendation' },
  { id: 'sanuk_summer', question: 'What are the best slip-on shoes for summer?', category: 'recommendation' },
  { id: 'sanuk_beach', question: 'Best comfortable shoes for a beach vacation?', category: 'recommendation' },
  // Category
  { id: 'cat_running_brands', question: 'What running shoe brands should I consider?', category: 'brand-discovery' },
  { id: 'cat_athletic', question: 'What are the best athletic footwear companies?', category: 'brand-discovery' },
  { id: 'cat_comfortable', question: 'What brands make the most comfortable shoes?', category: 'brand-discovery' },
  { id: 'cat_outdoor', question: 'What are the top outdoor footwear brands?', category: 'brand-discovery' },
  { id: 'use_plantar', question: 'I have plantar fasciitis, what shoes help?', category: 'use-case' },
  { id: 'use_concrete', question: 'What are the best shoes for standing on concrete all day?', category: 'use-case' },
  { id: 'use_europe', question: 'What shoes should I wear for a trip to Europe with lots of walking?', category: 'use-case' },
  { id: 'use_runner_gift', question: 'What are good gift ideas for a runner?', category: 'use-case' },
  { id: 'use_flat_feet', question: 'Best shoes for flat feet?', category: 'use-case' },
  // Nuanced
  { id: 'nuanced_morton', question: "I'm a 73 year old with Morton's neuroma. What running shoes will not cause recurrence?", category: 'nuanced-medical' },
  { id: 'nuanced_senior_knee', question: "I'm 68 years old and have arthritis in both knees. What walking shoes provide the most cushion and support?", category: 'nuanced-medical' },
  { id: 'nuanced_diabetic_neuropathy', question: "My father has diabetic neuropathy and needs shoes with extra room in the toe box. What brands make wide shoes for seniors?", category: 'nuanced-medical' },
  { id: 'nuanced_bunion_nurse', question: "I'm a nurse with bunions who works 12-hour shifts. What shoes won't make my bunions worse?", category: 'nuanced-medical' },
  { id: 'nuanced_achilles', question: "I had Achilles tendinitis last year and want to start running again. What shoes have the best heel support?", category: 'nuanced-medical' },
  { id: 'nuanced_heavy_beginner', question: "I'm 250 pounds and just starting to run. What shoes will last and not hurt my joints?", category: 'nuanced-fitness' },
  { id: 'nuanced_wide_feet_trail', question: "I have wide feet (4E) and want to try trail running. Are there any trail shoes that come in wide widths?", category: 'nuanced-fitness' },
  { id: 'nuanced_high_arch_marathon', question: "Training for my first marathon with high arches. Do I need neutral or support shoes?", category: 'nuanced-fitness' },
  { id: 'nuanced_teacher', question: "I'm an elementary school teacher on my feet 8 hours on hard floors. What shoes look professional but feel like sneakers?", category: 'nuanced-work' },
  { id: 'nuanced_warehouse', question: "I work in a warehouse walking 10+ miles a day on concrete. What shoes will hold up and keep my feet from hurting?", category: 'nuanced-work' },
  { id: 'nuanced_flight_attendant', question: "I'm a flight attendant and need shoes that look smart but can handle long hours standing. Any recommendations?", category: 'nuanced-work' },
  { id: 'nuanced_winter_run', question: "What running shoes can handle snow and ice? I run 5 days a week even in Minnesota winters.", category: 'nuanced-weather' },
  { id: 'nuanced_hot_climate', question: "I live in Phoenix and my feet get really hot when I walk. What are the most breathable walking shoes?", category: 'nuanced-weather' },
  { id: 'nuanced_rainy', question: "Looking for waterproof hiking sandals for a Costa Rica trip. Will be doing river crossings.", category: 'nuanced-weather' },
  { id: 'nuanced_budget_quality', question: "What's the best running shoe under $150 that will last more than 500 miles?", category: 'nuanced-budget' },
  { id: 'nuanced_splurge', question: "Money is no object - what's the absolute best shoe for a beginning runner who overpronates?", category: 'nuanced-budget' },
  { id: 'nuanced_upgrade', question: "I've been wearing Brooks Ghost for years but want to try something with more cushion. What's similar but softer?", category: 'nuanced-transition' },
  { id: 'nuanced_from_minimalist', question: "I've been in minimalist shoes but my doctor says I need more support. What's a good transition shoe?", category: 'nuanced-transition' },
]

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║  DECKERS - GROK + META AI TEST                             ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  console.log('')
  console.log(`📋 Questions: ${ALL_QUESTIONS.length}`)
  console.log('🎯 Surfaces: grok, meta-ai')
  console.log('')

  const run = await runMonitoring(
    'Deckers Outdoor Corporation',
    ALL_QUESTIONS,
    {
      surfaces: ['grok', 'meta-ai'] as any,
      headless: false,
      agentCount: 2,
    }
  )

  console.log('')
  console.log('════════════════════════════════════════════════════════════')
  console.log('  DECKERS GROK + META AI COMPLETE')
  console.log('════════════════════════════════════════════════════════════')
}

main().catch(console.error)
