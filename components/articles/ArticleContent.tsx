function renderInlineBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-[#051A24]">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export function ArticleDisclaimer() {
  return (
    <div className="mb-8 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <span className="shrink-0 text-xl text-amber-500">⚠️</span>
      <p className="text-sm leading-relaxed text-amber-800">
        <strong>คำเตือนสำคัญ:</strong> บทความนี้เป็นข้อมูลเบื้องต้นสำหรับชุมชนคนไทยในออสเตรเลียเท่านั้น
        ไม่ใช่คำแนะนำทางกฎหมาย ภาษี หรือการเงินอย่างเป็นทางการ
        กรุณาปรึกษาผู้เชี่ยวชาญที่มีใบอนุญาตก่อนตัดสินใจทางธุรกิจ
      </p>
    </div>
  )
}

export function ArticleContent({ content }: { content: string }) {
  const blocks = content.split('\n\n').filter(Boolean)

  return (
    <div className="space-y-4 text-[15px] leading-relaxed text-[rgba(5,26,36,0.7)]">
      {blocks.map((block, index) => {
        const trimmed = block.trim()

        if (trimmed.startsWith('⚠️')) {
          return (
            <p key={index} className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {renderInlineBold(trimmed)}
            </p>
          )
        }

        if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.includes('\n')) {
          return (
            <h3 key={index} className="pt-2 text-lg font-bold text-[#051A24]">
              {trimmed.slice(2, -2)}
            </h3>
          )
        }

        const lines = trimmed.split('\n')
        if (lines.every((line) => line.startsWith('- ') || line.match(/^\d+\.\s/))) {
          return (
            <ul key={index} className="list-inside list-disc space-y-2 pl-1">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{renderInlineBold(line.replace(/^(-|\d+\.)\s/, ''))}</li>
              ))}
            </ul>
          )
        }

        return <p key={index}>{renderInlineBold(trimmed)}</p>
      })}
    </div>
  )
}
