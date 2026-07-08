export const metadata = {
  title: 'นโยบายความเป็นส่วนตัว | Thai-Aus Verified',
  description: 'นโยบายความเป็นส่วนตัว Thai-Aus Verified Community',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-[#0f172a]">นโยบายความเป็นส่วนตัว</h1>
      <p className="mt-2 text-sm text-slate-500">อัปเดตล่าสุด: มิถุนายน 2026</p>

      <div className="prose prose-slate mt-8 max-w-none space-y-6 text-base text-slate-700">
        <section>
          <h2 className="text-xl font-bold text-[#1e3a5f]">1. ข้อมูลที่เราเก็บรวบรวม</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>ข้อมูลบัญชี: อีเมล, ชื่อ, เบอร์โทร, Line ID</li>
            <li>ข้อมูลธุรกิจ: ชื่อธุรกิจ, ABN, ที่ตั้ง, ช่องทางติดต่อ, รูปภาพ</li>
            <li>ข้อมูลการชำระเงิน: จัดการโดย Stripe — เราไม่เก็บข้อมูลบัตรเครดิต</li>
            <li>รีวิวและคะแนนที่สมาชิกส่ง</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1e3a5f]">2. การใช้ข้อมูล</h2>
          <p>เราใช้ข้อมูลเพื่อ:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>ยืนยันตัวตนธุรกิจผ่าน ABN Lookup API</li>
            <li>แสดงธุรกิจใน Directory สาธารณะ</li>
            <li>จัดการสมาชิก Premium และการชำระเงิน</li>
            <li>ส่งการแจ้งเตือนที่เกี่ยวข้องกับบัญชี (เช่น การชำระเงินล้มเหลว)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1e3a5f]">3. การแชร์ข้อมูล</h2>
          <p>
            ข้อมูลธุรกิจและช่องทางติดต่อจะแสดงสาธารณะบน Directory
            เราไม่ขายข้อมูลส่วนบุคคลให้บุคคลที่สาม
            ข้อมูลอาจถูกแชร์กับผู้ให้บริการที่จำเป็น (Supabase, Stripe, Vercel)
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1e3a5f]">4. สิทธิของคุณ</h2>
          <p>
            คุณมีสิทธิขอเข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลของคุณ
            โดยติดต่อ chapter99solutions@gmail.com
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1e3a5f]">5. คุกกี้และการวิเคราะห์</h2>
          <p>
            เราใช้คุกกี้ที่จำเป็นสำหรับการเข้าสู่ระบบและการทำงานของแพลตฟอร์ม
            เราอาจใช้เครื่องมือวิเคราะห์เพื่อปรับปรุงบริการ
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1e3a5f]">6. ติดต่อเรา</h2>
          <p>
            Chapter99 Solutions — chapter99solutions@gmail.com — 0452044382
          </p>
        </section>
      </div>
    </div>
  )
}
