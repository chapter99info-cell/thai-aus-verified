'use client'

import { AU_STATES, CATEGORY_LABELS } from '@/lib/constants'
import type { ServiceCategory } from '@/types'

interface SearchFilterProps {
  suburbs: string[]
  searchText: string
  onSearchTextChange: (value: string) => void
  category: string
  onCategoryChange: (value: string) => void
  state: string
  onStateChange: (value: string) => void
  suburb: string
  onSuburbChange: (value: string) => void
  verifiedOnly: boolean
  onVerifiedOnlyChange: (value: boolean) => void
  sort: string
  onSortChange: (value: string) => void
  onSearch: () => void
  loading?: boolean
}

export function SearchFilter({
  suburbs,
  searchText,
  onSearchTextChange,
  category,
  onCategoryChange,
  state,
  onStateChange,
  suburb,
  onSuburbChange,
  verifiedOnly,
  onVerifiedOnlyChange,
  sort,
  onSortChange,
  onSearch,
  loading = false,
}: SearchFilterProps) {
  const selectClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]'

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
          ค้นหาชื่อธุรกิจ
        </label>
        <input
          type="search"
          value={searchText}
          placeholder="พิมพ์ชื่อธุรกิจ..."
          className={selectClass}
          onChange={(e) => onSearchTextChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearch()
          }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
            ประเภท
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
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
            onChange={(e) => onStateChange(e.target.value)}
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
            onChange={(e) => onSuburbChange(e.target.value)}
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
            onChange={(e) => onSortChange(e.target.value)}
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
          onChange={(e) => onVerifiedOnlyChange(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-[#1e3a5f]"
        />
        <span className="text-sm font-medium text-slate-700">เฉพาะ Verified</span>
      </label>

      <button
        type="button"
        onClick={onSearch}
        disabled={loading}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1e3a5f] py-4 text-base font-bold text-white transition-all active:scale-95 disabled:opacity-60"
      >
        🔍 {loading ? 'กำลังค้นหา...' : 'ค้นหาธุรกิจ'}
      </button>
    </div>
  )
}
