import { Fragment } from 'react'
import wordmark from '../../assets/style/wordmark-navy.png'
import type { Segment, Text } from '../content/types'

export function TopBar({ backLabel, onBack, inactive }: { backLabel: string; onBack: () => void; inactive?: boolean }) {
  return (
    <header className="topbar">
      <button type="button" className="back" onClick={onBack} disabled={inactive}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" />
        </svg>
        {backLabel}
      </button>
      <img className="wordmark" src={wordmark} alt="" width="900" height="67" />
    </header>
  )
}

const latin = /([A-Za-z0-9][A-Za-z0-9 ./+\-]*[A-Za-z0-9]|[A-Za-z0-9])/
const cjk = /[\u3000-\u9fff\uff00-\uffef]/

function mixedText(text: string) {
  const parts = text.split(latin)
  return parts.map((part, index) => {
    if (index % 2 === 0) return part
    const nearLeft = cjk.test(parts[index - 1]?.slice(-1) ?? '')
    const nearRight = cjk.test(parts[index + 1]?.[0] ?? '')
    return <span className={`latin${nearLeft ? ' latin-start' : ''}${nearRight ? ' latin-end' : ''}`} key={index}>{part}</span>
  })
}

export function RichText({ text }: { text: Text }) {
  const segments: Segment[] = typeof text === 'string' ? [{ text }] : text
  return segments.map((segment, index) => {
    if (segment.style === 'code') return <code key={index}>{segment.text}</code>
    const content = mixedText(segment.text)
    if (segment.style === 'em') return <em key={index}>{content}</em>
    return <Fragment key={index}>{content}</Fragment>
  })
}
