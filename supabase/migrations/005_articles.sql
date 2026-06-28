-- Knowledge Hub articles table
CREATE TABLE IF NOT EXISTS public.articles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  summary text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  target_occupation text DEFAULT 'all',
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published articles" ON public.articles;
CREATE POLICY "Public can read published articles"
  ON public.articles FOR SELECT
  USING (is_published = true);

DROP POLICY IF EXISTS "Admin can manage articles" ON public.articles;
CREATE POLICY "Admin can manage articles"
  ON public.articles FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Seed starter articles (skip if slug already exists)
INSERT INTO public.articles (title, slug, summary, content, category, tags, target_occupation)
SELECT * FROM (VALUES
(
  'ABN คืออะไร และต้องจดทะเบียนไหม?',
  'what-is-abn',
  'ABN (Australian Business Number) คือเลข 11 หลักที่ระบุตัวตนธุรกิจของคุณในออสเตรเลีย ถ้าทำธุรกิจหรือรับเงินจากลูกค้าควรมี ABN',
  $$ABN หรือ Australian Business Number คือหมายเลขประจำตัวธุรกิจ 11 หลักที่รัฐบาลออสเตรเลียออกให้

**ต้องจดไหม?**
ถ้าคุณทำธุรกิจในออสเตรเลีย ไม่ว่าจะเป็นร้านนวด ร้านอาหาร ช่างภาพ หรือ Sole Trader ควรจด ABN เพราะ:
- ลูกค้าสามารถตรวจสอบความน่าเชื่อถือของคุณได้
- ไม่มี ABN ลูกค้าอาจหัก Tax Withholding 47% จากการจ่ายเงินให้คุณ
- ต้องใช้ยื่น Tax Return และ BAS

**จดได้ที่ไหน?**
จดได้ฟรีที่ abr.business.gov.au ใช้เวลาประมาณ 10-15 นาที

⚠️ หมายเหตุ: บทความนี้เป็นข้อมูลเบื้องต้นเท่านั้น ไม่ใช่คำแนะนำทางกฎหมายหรือภาษี ควรปรึกษา Accountant หรือ Business Advisor ที่มีใบอนุญาต$$,
  'legal',
  ARRAY['ABN','จดทะเบียน','เริ่มต้นธุรกิจ'],
  'all'
),
(
  'Sole Trader vs Company ต่างกันอย่างไร?',
  'sole-trader-vs-company',
  'การเลือก structure ธุรกิจที่ถูกต้องส่งผลต่อภาษี ความรับผิดชอบทางกฎหมาย และการขยายธุรกิจในอนาคต',
  $$คนไทยส่วนใหญ่ในออสเตรเลียเริ่มต้นในรูปแบบ Sole Trader เพราะง่ายและถูก แต่มีข้อแตกต่างสำคัญ:

**Sole Trader**
- ตั้งได้ทันทีพร้อม ABN
- ไม่มีค่าใช้จ่ายจด
- รายได้นับรวมกับรายได้ส่วนตัว → เสียภาษีตาม Personal Tax Rate
- หากมีหนี้สิน คุณรับผิดชอบส่วนตัว

**Company (Pty Ltd)**
- ค่าจด ASIC ~$597
- Tax Rate คงที่ 25% (ถ้ารายได้ต่ำกว่า $50M)
- แยกทรัพย์สินส่วนตัวออกจากธุรกิจ
- เหมาะถ้ารายได้เกิน $80,000-100,000/ปี

⚠️ หมายเหตุ: ควรปรึกษา Accountant ก่อนตัดสินใจ structure ธุรกิจ$$,
  'legal',
  ARRAY['Sole Trader','Company','structure'],
  'all'
),
(
  'GST ต้องจดเมื่อไหร่?',
  'when-to-register-gst',
  'ถ้ารายได้ธุรกิจเกิน $75,000 ต่อปี คุณต้องจด GST และเรียกเก็บ 10% จากลูกค้า',
  $$GST (Goods and Services Tax) คือภาษีมูลค่าเพิ่ม 10% ในออสเตรเลีย

**เมื่อไหร่ต้องจด GST?**
- รายได้รวมเกิน $75,000/ปี (ปีภาษี)
- หรือคาดว่าจะเกิน $75,000 ในอีก 12 เดือน
- Taxi/Rideshare: ต้องจด GST ตั้งแต่วันแรก ไม่มีขั้นต่ำ

**หลังจดแล้วต้องทำอะไร?**
- เรียกเก็บ GST 10% จากลูกค้าทุกครั้ง
- ยื่น BAS (Business Activity Statement) ทุก Quarter
- จ่าย GST ที่เก็บได้ให้ ATO หักด้วย GST ที่จ่ายไป (Input Tax Credit)

**ตัวอย่าง:**
ร้านนวดคิด $100/ชั่วโมง → ต้องคิด $110 (รวม GST $10)
ส่ง $10 ให้ ATO ทุก Quarter

⚠️ หมายเหตุ: ข้อมูลนี้เป็นแนวทางเบื้องต้น ควรปรึกษา Registered Tax Agent$$,
  'tax',
  ARRAY['GST','ภาษี','BAS'],
  'all'
),
(
  'ร้านนวดต้องมี License อะไรบ้าง?',
  'massage-shop-licenses',
  'ร้านนวดในออสเตรเลียต้องมีใบอนุญาตหลายอย่างแตกต่างกันตามรัฐ รู้ก่อนเปิดร้านเพื่อหลีกเลี่ยงปัญหาทางกฎหมาย',
  $$การเปิดร้านนวดในออสเตรเลียต้องมีเอกสารหลายอย่าง:

**ใบอนุญาตที่จำเป็น:**
1. **ABN** — ต้องมีก่อนเปิดกิจการ
2. **Council Business License** — ขอจาก Local Council ในพื้นที่ของคุณ
3. **Food Business Registration** — ถ้ามีการขายเครื่องดื่ม/ขนม
4. **Public Liability Insurance** — อย่างน้อย $10M คุ้มครองลูกค้า

**NSW เพิ่มเติม:**
- ถ้าให้บริการนวดเกี่ยวกับสุขภาพ อาจต้องมี Health Practitioner Registration (AHPRA)
- Massage Therapist ที่ทำ Remedial Massage ควรมีใบรับรอง Diploma of Remedial Massage

**VIC เพิ่มเติม:**
- ต้องจด Working with Children Check ถ้ามีลูกค้าอายุต่ำกว่า 18 ปี

⚠️ ข้อมูลนี้เป็นแนวทางเบื้องต้นเท่านั้น กฎระเบียบอาจเปลี่ยนแปลง ควรตรวจสอบกับ Council และ Fair Work Ombudsman ในรัฐของคุณ$$,
  'legal',
  ARRAY['ร้านนวด','License','Council'],
  'massage'
),
(
  'จ้างพนักงานถูกกฎหมายในออสเตรเลีย',
  'hiring-employees-legally',
  'การจ้างพนักงานในออสเตรเลียมีขั้นตอนและข้อกำหนดที่ต้องปฏิบัติตาม Fair Work Act ละเมิดมีโทษปรับสูงมาก',
  $$ถ้าคุณจ้างพนักงาน (ไม่ใช่ Contractor) มีสิ่งที่ต้องทำ:

**ก่อนจ้าง:**
1. จด ABN และ PAYG Withholding กับ ATO
2. ลงทะเบียน WorkCover/Workers Compensation ในรัฐของคุณ
3. ตรวจสอบ Award Rate ที่ถูกต้องใน fairwork.gov.au
4. ขอเอกสาร Tax File Number Declaration จากพนักงาน
5. ตรวจสอบ Right to Work ในออสเตรเลีย (visa status)

**ทุกครั้งที่จ่ายเงิน:**
- หัก Tax ตาม Tax Table ของ ATO
- จ่าย Superannuation 11.5% (เพิ่มทุกปี)
- ออก Payslip ทุกครั้ง

**Minimum Wage 2024-2025:**
$24.10/ชั่วโมง (ปรับทุกปีโดย Fair Work Commission)

⚠️ การละเมิด Fair Work Act มีโทษปรับสูงถึง $93,900 ต่อครั้ง ควรปรึกษา HR Consultant หรือ Employment Lawyer$$,
  'legal',
  ARRAY['พนักงาน','Fair Work','Super','จ้างงาน'],
  'all'
),
(
  'ประกันภัยที่ธุรกิจไทยในออสเตรเลียควรมี',
  'business-insurance-guide',
  'Public Liability, Professional Indemnity, Workers Comp — รู้จักประกันภัยที่จำเป็นสำหรับธุรกิจไทยในออสเตรเลีย',
  $$ประกันภัยเป็นสิ่งสำคัญที่ไม่ควรมองข้าม:

**Public Liability Insurance**
- คุ้มครองถ้าลูกค้าได้รับบาดเจ็บในร้านหรือจากบริการของคุณ
- ขั้นต่ำแนะนำ: $10 ล้าน
- ร้านนวด ร้านอาหาร ช่าง — จำเป็นมาก
- ค่าเบี้ยประมาณ $500-$2,000/ปี

**Professional Indemnity**
- คุ้มครองถ้าลูกค้าฟ้องว่าคำแนะนำของคุณทำให้เสียหาย
- สำคัญสำหรับ: นักบัญชี, ที่ปรึกษา, นักนวดบำบัด

**Workers Compensation**
- บังคับตามกฎหมายถ้ามีพนักงาน
- แต่ละรัฐมีระบบต่างกัน: icare (NSW), WorkSafe (VIC)

**Contents & Equipment Insurance**
- คุ้มครองอุปกรณ์ในร้านถ้าเกิดไฟไหม้หรือถูกขโมย

⚠️ ควรปรึกษา Insurance Broker ที่มีใบอนุญาต AFSL เพื่อเลือกความคุ้มครองที่เหมาะสม$$,
  'insurance',
  ARRAY['ประกัน','Public Liability','Workers Comp'],
  'all'
)
) AS v(title, slug, summary, content, category, tags, target_occupation)
WHERE NOT EXISTS (SELECT 1 FROM public.articles a WHERE a.slug = v.slug);
