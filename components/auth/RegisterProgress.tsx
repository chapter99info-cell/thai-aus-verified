import { CheckCircle2 } from 'lucide-react'

const STEPS = ['Step 1 of 3', 'Step 2 of 3', 'Step 3 of 3']

export function RegisterProgress({ step }: { step: number }) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-between gap-2">
        {STEPS.map((label, i) => {
          const num = i + 1
          const active = step === num
          const done = step > num
          return (
            <div key={label} className="flex flex-1 flex-col items-center gap-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  done
                    ? 'bg-[#0D1B3E] text-white'
                    : active
                      ? 'bg-[#C9A84C] text-[#0D1B3E]'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {done ? <CheckCircle2 size={16} aria-hidden /> : num}
              </div>
              <span
                className={`text-center text-xs font-medium ${
                  active ? 'text-[#C9A84C]' : done ? 'text-[#0D1B3E]' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-[#C9A84C] transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>
    </div>
  )
}
