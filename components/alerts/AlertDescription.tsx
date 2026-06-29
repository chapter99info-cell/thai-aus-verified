import type { ReactElement } from 'react'

const DANGER_WORDS = ['หลอก', 'ระวัง', 'อันตราย', 'ห้าม', 'ปลอม', 'SCAM', 'WARNING', 'โกง']

function formatAlertText(text: string) {
  const lines = text.split(/\n|→/)
  return lines.map((line, i) => {
    let formatted = line.trim()
    if (!formatted) return null

    DANGER_WORDS.forEach((word) => {
      formatted = formatted.replace(
        new RegExp(word, 'g'),
        `<strong class="text-red-600 font-semibold">${word}</strong>`
      )
    })

    const isBullet = formatted.startsWith('-') || formatted.startsWith('•')

    return isBullet ? (
      <li
        key={i}
        className="ml-4 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formatted.replace(/^[-•]\s*/, '') }}
      />
    ) : (
      <p
        key={i}
        className="leading-relaxed text-sm text-gray-700"
        dangerouslySetInnerHTML={{ __html: formatted }}
      />
    )
  })
}

function groupFormattedElements(elements: (ReactElement | null)[]) {
  const nodes: ReactElement[] = []
  let bulletBuffer: ReactElement[] = []

  const flushBullets = () => {
    if (bulletBuffer.length === 0) return
    nodes.push(
      <ul key={`ul-${nodes.length}`} className="ml-4 mt-2 list-disc space-y-1">
        {bulletBuffer}
      </ul>
    )
    bulletBuffer = []
  }

  for (const el of elements) {
    if (!el) continue
    if (el.type === 'li') {
      bulletBuffer.push(el)
    } else {
      flushBullets()
      nodes.push(el)
    }
  }

  flushBullets()
  return nodes
}

type Props = {
  description: string
}

export function AlertDescription({ description }: Props) {
  const formatted = formatAlertText(description)

  return <div className="mt-3 space-y-3">{groupFormattedElements(formatted)}</div>
}
