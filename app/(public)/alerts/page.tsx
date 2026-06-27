export default function AlertsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">แจ้งเตือนภัย</h1>
      <p className="mt-4 text-slate-600">
        ระวังการโกงค่าเช่าบ้านและงานออนไลน์ — ตรวจสอบ ABN และ Badge Verified ก่อนติดต่อทุกครั้ง
      </p>
      <div className="mt-8 rounded-xl border border-amber-200 bg-[#fef3c7] p-6">
        <p className="font-semibold text-amber-900">⚠️ คำเตือน: การโกงค่าเช่าบ้าน</p>
        <p className="mt-2 text-sm text-amber-900/90">
          อย่าโอนเงินมัดจำก่อนดูที่พักจริง ตรวจสอบ ABN ของผู้ให้เช่า และใช้บริการที่มี Badge Verified
          เท่านั้น
        </p>
      </div>
    </div>
  )
}
