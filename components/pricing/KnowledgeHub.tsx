import { ArticleCarousel3D } from '@/components/ArticleCarousel3D'
import type { ArticleListItem } from '@/types/articles'

export function KnowledgeHub({ articles }: { articles: ArticleListItem[] }) {
  if (articles.length === 0) return null

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-10 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <span className="shrink-0 text-xl text-amber-500">⚠️</span>
        <p className="text-sm leading-relaxed text-amber-800">
          <strong>คำเตือนสำคัญ:</strong> บทความในส่วนนี้เป็นข้อมูลเบื้องต้นสำหรับชุมชนคนไทยในออสเตรเลียเท่านั้น
          ไม่ใช่คำแนะนำทางกฎหมาย ภาษี หรือการเงินอย่างเป็นทางการ
          กรุณาปรึกษาผู้เชี่ยวชาญที่มีใบอนุญาตก่อนตัดสินใจทางธุรกิจ
        </p>
      </div>

      <div className="mb-12 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[rgba(5,26,36,0.4)]">
          คู่มือธุรกิจไทยในออสเตรเลีย
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#051A24] md:text-4xl">
          รู้ก่อน <span className="font-playfair italic">ปลอดภัยกว่า</span>
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-[rgba(5,26,36,0.5)]">
          ข้อมูลเบื้องต้นเกี่ยวกับ ABN ภาษี กฎหมาย และใบอนุญาตที่ควรรู้
          อัปเดตสม่ำเสมอโดยทีม Chapter99
        </p>
      </div>

      <ArticleCarousel3D articles={articles} />

      <p className="mt-8 text-center text-xs text-[rgba(5,26,36,0.3)]">
        อัปเดตโดยทีม Chapter99 Solutions · ข้อมูลเพื่อการศึกษาเท่านั้น
      </p>
    </section>
  )
}
