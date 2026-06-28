'use client'

import { useState } from 'react'
import { Users, X } from 'lucide-react'

const LOGO_URL =
  'https://cxcdzxauqcklajmvaxii.supabase.co/storage/v1/object/public/business-photos/logo/Thai-AUS%20verified%20(1).png'

const MESSENGER_URL = 'https://m.me/61591648941392'
const FACEBOOK_GROUP_URL = 'https://www.facebook.com/groups/1631889741218502'

function MessengerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.905 1.435 5.5 3.676 7.2V22l3.362-1.845c.897.248 1.847.382 2.962.382 5.523 0 10-4.145 10-9.243C22 6.145 17.523 2 12 2zm1.016 12.453-2.564-2.73-4.816 2.73 5.293-5.62 2.628 2.73 4.758-2.73-5.299 5.62z" />
    </svg>
  )
}

export function FloatingChat() {
  const [expanded, setExpanded] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {expanded && (
        <div className="chat-bubble-enter mb-3 w-[260px] rounded-2xl border border-black/8 bg-white p-4 shadow-xl">
          <div className="relative mb-4 flex items-center gap-3 pr-6">
            <img
              src={LOGO_URL}
              alt="Thai-Aus Verified"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-bold text-gray-900">Thai-Aus Verified</p>
              <p className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                ออนไลน์อยู่
              </p>
            </div>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="absolute right-0 top-0 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              aria-label="ปิดแชท"
            >
              <X size={16} />
            </button>
          </div>

          <div className="rounded-2xl bg-gray-100 p-3 text-sm leading-relaxed text-gray-800">
            สวัสดีครับ! 🙏 มีคำถามเกี่ยวกับการลงทะเบียนธุรกิจ หรืออยากทราบข้อมูลเพิ่มเติม
            ทักมาได้เลยครับ
          </div>
          <p className="mt-2 text-xs text-gray-400">Thai Aus Admin · just now</p>

          <div className="mt-4 space-y-2">
            <a
              href={MESSENGER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1877F2] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <MessengerIcon className="h-4 w-4" />
              ส่งข้อความใน Messenger
            </a>
            <a
              href={FACEBOOK_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Users size={16} />
              เข้าร่วม Facebook Group
            </a>
          </div>

          <p className="mt-2 text-center text-xs text-gray-400">ตอบกลับปกติภายใน 1 ชั่วโมง</p>
        </div>
      )}

      <div className="group relative">
        {!expanded && showTooltip && (
          <span className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-800 shadow-md">
            คุยกับเรา
          </span>
        )}

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          aria-label={expanded ? 'ปิดแชท' : 'เปิดแชท Messenger'}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-[0_4px_20px_rgba(24,119,242,0.4)] transition-transform hover:scale-105"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-30" />
          <MessengerIcon className="relative h-7 w-7" />
        </button>
      </div>
    </div>
  )
}
