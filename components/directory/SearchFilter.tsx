'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { AU_STATES, CATEGORY_LABELS } from '@/lib/constants'
import type { ServiceCategory } from '@/types'

interface SearchFilterProps {
  suburbs: string[]
}

export function SearchFilter({ suburbs }: SearchFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      router.push(`/directory?${params.toString()}`)
    },
    [router, searchParams]
  )

  const q = searchParams.get('q') ?? ''
  const category = searchParams.get('category') ?? ''
  const state = searchParams.get('state') ?? ''
  const suburb = searchParams.get('suburb') ?? ''
  const verifiedOnly = searchParams.get('verified') === 'true'
  const sort = searchParams.get('sort') ?? 'newest'

  const selectClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]'

  function toggleVerified() {
    update('verified', verifiedOnly ? '' : 'true')
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
          ค้นหาชื่อธุรกิจ
        </label>
        <input
          type="search"
          defaultValue={q}
          placeholder="พิมพ์ชื่อธุรกิจ..."
          className={selectClass}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              update('q', (e.target as HTMLInputElement).value)
            }
          }}
          onBlur={(e) => update('q', e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
            ประเภท
          </label>
          <select
            value={category}
            onChange={(e) => update('category', e.target.value)}
            className={selectClass}
          >
            <option value="">ทุกประเภท</option>
            {(Object.keys(CATEGORY_LABELS) as ServiceCategory[]).map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat].th}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
            รัฐ
          </label>
          <select
            value={state}
            onChange={(e) => update('state', e.target.value)}
            className={selectClass}
          >
            <option value="">ทุกรัฐ</option>
            {AU_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Suburb
          </label>
          <select
            value={suburb}
            onChange={(e) => update('suburb', e.target.value)}
            className={selectClass}
          >
            <option value="">ทุกพื้นที่</option>
            {suburbs.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
            เรียงตาม
          </label>
          <select
            value={sort}
            onChange={(e) => update('sort', e.target.value)}
            className={selectClass}
          >
            <option value="newest">ล่าสุด</option>
            <option value="rating">Rating สูงสุด</option>
          </select>
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
        <input
          type="checkbox"
          checked={verifiedOnly}
          onChange={toggleVerified}
          className="h-4 w-4 rounded border-slate-300 text-[#1e3a5f]"
        />
        <span className="text-sm font-medium text-slate-700">เฉพาะ Verified</span>
      </label>
    </div>
  )
}
