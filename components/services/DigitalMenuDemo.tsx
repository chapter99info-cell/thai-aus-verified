'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'

const MENU_ITEMS = [
  { id: 'fried-rice', name: 'ข้าวผัดกุ้ง', price: 15 },
  { id: 'tom-yum', name: 'ต้มยำกุ้ง', price: 18 },
  { id: 'pad-thai', name: 'ผัดไทย', price: 16 },
] as const

export function DigitalMenuDemo() {
  const [counts, setCounts] = useState<Record<string, number>>({})

  function changeCount(id: string, delta: number) {
    setCounts((prev) => {
      const next = Math.max(0, (prev[id] ?? 0) + delta)
      return { ...prev, [id]: next }
    })
  }

  const total = MENU_ITEMS.reduce((sum, item) => sum + (counts[item.id] ?? 0) * item.price, 0)

  return (
    <div className="rounded-2xl border-2 border-[#0D1B3E]/10 bg-white p-4">
      <p className="mb-3 text-base font-semibold text-[#0D1B3E]">🎮 ทดลองใช้งาน (ตัวอย่างเท่านั้น)</p>
      <div className="space-y-3">
        {MENU_ITEMS.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-xl border-2 border-[#0D1B3E]/10 p-4"
          >
            <div>
              <p className="text-base font-bold text-[#0D1B3E]">{item.name}</p>
              <p className="text-base text-[#0D1B3E]">${item.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => changeCount(item.id, -1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[#0D1B3E] text-[#0D1B3E]"
                aria-label={`ลด ${item.name}`}
              >
                <Minus className="h-4 w-4" aria-hidden />
              </button>
              <span className="min-w-[24px] text-center text-base font-semibold text-[#0D1B3E]">
                {counts[item.id] ?? 0}
              </span>
              <button
                type="button"
                onClick={() => changeCount(item.id, 1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#D4A017] text-[#0D1B3E]"
                aria-label={`เพิ่ม ${item.name}`}
              >
                <Plus className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-base font-semibold text-[#0D1B3E]">รวม: ${total}</p>
    </div>
  )
}
