/**
 * Seed verified businesses + job postings for MVP UI testing.
 *
 * Usage (from project root):
 *   node --env-file=.env.local scripts/seed-mvp-demo.mjs
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Optional:
 *   SEED_OWNER_EMAIL — existing profile email to mark as verified_owner
 */

import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const DEMO_BUSINESSES = [
  {
    business_name: 'Siam Kitchen Sydney',
    business_type: 'restaurant',
    contact_phone: '0412 345 678',
    line_id: 'siamkitchensyd',
    suburb: 'Cabramatta',
    state: 'NSW',
  },
  {
    business_name: 'Bangkok Street Food',
    business_type: 'restaurant',
    contact_phone: '0423 456 789',
    line_id: 'bangkokstreetmelb',
    suburb: 'Richmond',
    state: 'VIC',
  },
  {
    business_name: 'Thai Orchid Massage',
    business_type: 'massage',
    contact_phone: '0434 567 890',
    line_id: 'thaiorchidspa',
    suburb: 'Parramatta',
    state: 'NSW',
  },
  {
    business_name: 'Lotus Thai Spa',
    business_type: 'massage',
    contact_phone: '0445 678 901',
    line_id: 'lotusthaibris',
    suburb: 'Fortitude Valley',
    state: 'QLD',
  },
  {
    business_name: 'Golden Elephant Restaurant',
    business_type: 'restaurant',
    contact_phone: '0456 789 012',
    line_id: 'goldenelephant',
    suburb: 'Haymarket',
    state: 'NSW',
  },
]

const DEMO_JOBS = [
  {
    business_name: 'Siam Kitchen Sydney',
    job_title: 'พนักงานเสิร์ฟ กะเย็น',
    description:
      'รับสมัครพนักงานเสิร์ฟ กะ 17:00–22:00 มีประสบการณ์ร้านอาหารไทยจะพิจารณาเป็นพิเศษ ค่าจ้าง $25–28/ชม. + tips',
    contact_info: '0412 345 678',
    days_ago: 1,
  },
  {
    business_name: 'Siam Kitchen Sydney',
    job_title: 'พ่อครัว/แม่ครัว',
    description:
      'ต้องการช่วยครัว ทำอาหารไทยพื้นฐาน สามารถสื่อสารภาษาไทยได้ ค่าจ้างตามประสบการณ์ เริ่ม $28/ชม.',
    contact_info: 'Line: siamkitchensyd',
    days_ago: 3,
  },
  {
    business_name: 'Bangkok Street Food',
    job_title: 'Kitchen Hand',
    description:
      'ช่วยเตรียมวัตถุดิบ ล้างจาน กะเช้า 9:00–15:00 ไม่ต้องมีประสบการณ์ สอนงานให้ ค่าจ้าง $23/ชม.',
    contact_info: '0423 456 789',
    days_ago: 0,
  },
  {
    business_name: 'Thai Orchid Massage',
    job_title: 'นักนวดแผนไทย',
    description:
      'รับสมัครนักนวดที่มีใบ Certificate นวดแผนไทย หรือประสบการณ์อย่างน้อย 2 ปี ค่าจ้าง 50/50 หรือ $35/ชม.',
    contact_info: '@thaiorchidspa',
    days_ago: 2,
  },
  {
    business_name: 'Thai Orchid Massage',
    job_title: 'พนักงานต้อนรับ (Reception)',
    description:
      'รับโทรศัพท์ จองคิว ดูแลลูกค้า พูดไทย-อังกฤษได้ กะหมุนเวียน ค่าจ้าง $26/ชม.',
    contact_info: '0434 567 890',
    days_ago: 5,
  },
  {
    business_name: 'Lotus Thai Spa',
    job_title: 'Massage Therapist',
    description:
      'Looking for qualified Thai massage therapist. Remedial certificate preferred. Flexible hours. $30–40/hr.',
    contact_info: '0445 678 901',
    days_ago: 4,
  },
  {
    business_name: 'Golden Elephant Restaurant',
    job_title: 'ล้างจาน / Dishwasher',
    description:
      'งานล้างจาน กะ dinner 17:30–22:30 จ-อา ค่าจ้าง $24/ชม. มีอาหารฟรี 1 มื้อ/วัน',
    contact_info: '0456 789 012',
    days_ago: 6,
  },
]

async function resolveOwnerId() {
  const seedEmail = process.env.SEED_OWNER_EMAIL

  if (seedEmail) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('email', seedEmail)
      .maybeSingle()

    if (error) throw error
    if (!data) {
      throw new Error(`No profile found for SEED_OWNER_EMAIL=${seedEmail}`)
    }

    if (data.role !== 'verified_owner') {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'verified_owner' })
        .eq('id', data.id)

      if (updateError) throw updateError
      console.log(`Updated ${seedEmail} → verified_owner`)
    }

    return data.id
  }

  const { data: admin, error: adminError } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'admin')
    .limit(1)
    .maybeSingle()

  if (adminError) throw adminError
  if (admin?.id) {
    console.log('Using admin profile as seed owner (set SEED_OWNER_EMAIL to use your account)')
    return admin.id
  }

  const { data: anyProfile, error: anyError } = await supabase
    .from('profiles')
    .select('id')
    .limit(1)
    .maybeSingle()

  if (anyError) throw anyError
  if (!anyProfile?.id) {
    throw new Error('No profiles found. Register a user first, then re-run the seed script.')
  }

  console.log('Using first profile as seed owner')
  return anyProfile.id
}

async function seedBusinesses(ownerId) {
  const businessIds = {}

  for (const biz of DEMO_BUSINESSES) {
    const { data: existing } = await supabase
      .from('businesses')
      .select('id')
      .eq('business_name', biz.business_name)
      .maybeSingle()

    if (existing?.id) {
      businessIds[biz.business_name] = existing.id
      console.log(`  ↷ ${biz.business_name} (exists)`)
      continue
    }

    const { data, error } = await supabase
      .from('businesses')
      .insert({
        owner_id: ownerId,
        business_name: biz.business_name,
        business_type: biz.business_type,
        contact_phone: biz.contact_phone,
        line_id: biz.line_id,
        suburb: biz.suburb,
        state: biz.state,
        is_verified: true,
      })
      .select('id')
      .single()

    if (error) throw error
    businessIds[biz.business_name] = data.id
    console.log(`  ✓ ${biz.business_name}`)
  }

  return businessIds
}

async function seedJobs(businessIds) {
  for (const job of DEMO_JOBS) {
    const businessId = businessIds[job.business_name]
    if (!businessId) {
      console.warn(`  ⚠ Skipping job — business not found: ${job.business_name}`)
      continue
    }

    const { data: existing } = await supabase
      .from('job_postings')
      .select('id')
      .eq('business_id', businessId)
      .eq('job_title', job.job_title)
      .maybeSingle()

    if (existing?.id) {
      console.log(`  ↷ ${job.job_title} @ ${job.business_name} (exists)`)
      continue
    }

    const createdAt = new Date(Date.now() - job.days_ago * 24 * 60 * 60 * 1000).toISOString()

    const { error } = await supabase.from('job_postings').insert({
      business_id: businessId,
      job_title: job.job_title,
      description: job.description,
      contact_info: job.contact_info,
      is_active: true,
      created_at: createdAt,
    })

    if (error) throw error
    console.log(`  ✓ ${job.job_title} @ ${job.business_name}`)
  }
}

async function main() {
  console.log('Seeding MVP demo data...\n')

  const ownerId = await resolveOwnerId()
  console.log(`Owner profile: ${ownerId}\n`)

  console.log('Businesses:')
  const businessIds = await seedBusinesses(ownerId)

  console.log('\nJob postings:')
  await seedJobs(businessIds)

  console.log('\nDone! Test at:')
  console.log('  /jobs   — job board')
  console.log('  /shops  — verified directory')
}

main().catch((err) => {
  console.error('\nSeed failed:', err.message ?? err)
  process.exit(1)
})
