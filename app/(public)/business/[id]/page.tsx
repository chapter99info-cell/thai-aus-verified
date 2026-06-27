import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Star } from 'lucide-react'
import { CATEGORY_LABELS } from '@/lib/constants'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import type { ServiceProvider } from '@/types'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function BusinessDetailPage({ params }: Props) {
  const { id } = await params

  if (!isSupabaseConfigured()) notFound()

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('service_providers')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) notFound()

  const business = data as ServiceProvider
  const category = CATEGORY_LABELS[business.category]

  return (
    <div className="bg-white px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/directory" className="text-sm text-slate-500 hover:text-[#1e3a5f]">
          ← กลับไดเรกทอรี
        </Link>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1e3a5f]">{business.business_name}</h1>
            <p className="mt-2 text-slate-600">
              {category.emoji} {category.th} · {business.suburb}, {business.state}
            </p>
          </div>
          {business.is_verified ? (
            <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
              ✅ ยืนยันแล้ว - Verified
            </span>
          ) : (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
              ⏳ รอการยืนยัน
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-1 text-slate-600">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={18}
              className={
                i < Math.round(Number(business.rating))
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-300'
              }
            />
          ))}
          <span className="ml-2">
            {Number(business.rating).toFixed(1)} ({business.review_count} รีวิว)
          </span>
        </div>

        {business.description && (
          <p className="mt-8 leading-relaxed text-slate-700">{business.description}</p>
        )}

        <dl className="mt-8 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm">
          <div>
            <dt className="text-slate-500">ที่อยู่</dt>
            <dd className="font-medium text-slate-900">{business.address || '—'}</dd>
          </div>
          <div>
            <dt className="text-slate-500">ABN</dt>
            <dd className="font-medium text-slate-900">{business.abn_number}</dd>
          </div>
          {business.phone && (
            <div>
              <dt className="text-slate-500">โทรศัพท์</dt>
              <dd className="font-medium text-slate-900">{business.phone}</dd>
            </div>
          )}
          {business.website && (
            <div>
              <dt className="text-slate-500">เว็บไซต์</dt>
              <dd>
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#1e3a5f] hover:underline"
                >
                  {business.website}
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  )
}
