export const metadata = {
  title: 'ข้อกำหนดและเงื่อนไข | Thai-Aus Verified',
  description: 'ข้อกำหนดและเงื่อนไขการใช้งาน Thai-Aus Verified Community',
}

export default function TermsPage() {
  return (
    <>
      <div className="relative h-[300px] w-full overflow-hidden md:h-[400px]">
        <img
          src="https://jjbwiriphyxsnrnpoqnn.supabase.co/storage/v1/object/public/Thai-%20Aus%20Verified/photos/cover/468227018_10234778857722685_8922446049967068394_n.jpg"
          alt="Thai-Aus Verified Community"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0D1B3E]/60" />
        <div className="absolute bottom-6 left-8">
          <h1 className="text-3xl font-bold text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]">
            ข้อกำหนดและเงื่อนไข
          </h1>
          <p className="mt-1 text-sm text-white/70">อัปเดตล่าสุด: มิถุนายน 2026</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="prose prose-slate max-w-none space-y-6 text-base text-slate-700">
        <section>
          <h2 className="text-xl font-bold text-[#1e3a5f]">1. บทนำ</h2>
          <p>
            ยินดีต้อนรับสู่ Thai-Aus Verified Community (&quot;เรา&quot;, &quot;แพลตฟอร์ม&quot;)
            ชุมชนบริการสีขาวสำหรับคนไทยในออสเตรเลีย โดย Chapter99 Solutions
            การใช้งานแพลตฟอร์มนี้ถือว่าคุณยอมรับข้อกำหนดเหล่านี้
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1e3a5f]">2. การลงทะเบียนธุรกิจ</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>ต้องใช้หมายเลข ABN (Australian Business Number) ที่ถูกต้องเท่านั้น</li>
            <li>ห้ามกรอก TFN (Tax File Number) โดยเด็ดขาด</li>
            <li>ข้อมูลธุรกิจจะถูกตรวจสอบผ่านระบบ ABN Lookup ของรัฐบาลออสเตรเลีย</li>
            <li>ข้อมูลที่ลงทะเบียนต้องเป็นความจริงและเป็นปัจจุบัน</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1e3a5f]">3. การแสดงข้อมูลสาธารณะ</h2>
          <p>
            เมื่อลงทะเบียน คุณยินยอมให้แสดงข้อมูลธุรกิจ ชื่อธุรกิจ หมวดหมู่ ที่ตั้ง
            และช่องทางติดต่อที่คุณกรอก (เบอร์โทร, Line, Facebook, Instagram, เว็บไซต์)
            ในหน้า Directory สาธารณะ เพื่อให้ลูกค้าสามารถติดต่อธุรกิจของคุณได้
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1e3a5f]">4. สมาชิก Premium</h2>
          <p>
            แผน Premium ราคา A$9/เดือน ชำระผ่าน Stripe สมาชิก Premium ได้รับสิทธิ์โพสต์โฆษณาใน
            Facebook Group และแสดงผลลำดับต้นใน Directory การชำระเงินล้มเหลวจะมีระยะเวลา
            Grace Period 7 วันก่อนยกเลิกสิทธิ์ Premium
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1e3a5f]">5. รีวิวและความรับผิดชอบ</h2>
          <p>
            รีวิวจากสมาชิกเป็นความคิดเห็นส่วนบุคคล เราไม่รับประกันความถูกต้องของรีวิวทั้งหมด
            ธุรกิจและลูกค้าต้องใช้วิจารณญาณในการตัดสินใจ
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1e3a5f]">6. การยกเลิกบัญชี</h2>
          <p>
            เราสงวนสิทธิ์ในการระงับหรือยกเลิกบัญชีที่ละเมิดข้อกำหนด หรือให้ข้อมูลเท็จ
            โดยไม่ต้องแจ้งล่วงหน้า
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1e3a5f]">7. ติดต่อเรา</h2>
          <p>
            Chapter99 Solutions — chapter99solutions@gmail.com — 0452044382
          </p>
        </section>
      </div>
    </div>
    </>
  )
}
