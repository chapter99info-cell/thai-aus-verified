import Link from 'next/link'
import { getCategoryLabel } from '@/lib/articles'
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link key={article.id} href={`/articles/${article.slug}`} className="group block">
            <article className="h-full cursor-pointer rounded-2xl border border-[rgba(5,26,36,0.08)] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(5,26,36,0.2)] hover:shadow-lg">
              <span className="mb-4 inline-block rounded-full bg-[rgba(5,26,36,0.06)] px-3 py-1 text-xs font-bold text-[rgba(5,26,36,0.5)]">
                {getCategoryLabel(article.category)}
              </span>

              <h3 className="mb-3 text-base font-bold leading-snug text-[#051A24] transition-colors group-hover:text-[#051A24]">
                {article.title}
              </h3>

              <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-[rgba(5,26,36,0.5)]">
                {article.summary}
              </p>

              <div className="mb-4 flex flex-wrap gap-1">
                {article.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[rgba(5,26,36,0.04)] px-2 py-0.5 text-xs text-[rgba(5,26,36,0.4)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <span className="text-xs font-semibold text-[rgba(5,26,36,0.4)] transition-colors group-hover:text-[#051A24]">
                อ่านเพิ่มเติม →
              </span>
            </article>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-[rgba(5,26,36,0.3)]">
        อัปเดตโดยทีม Chapter99 Solutions · ข้อมูลเพื่อการศึกษาเท่านั้น
      </p>
    </section>
  )
}
