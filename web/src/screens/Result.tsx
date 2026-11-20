import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { personalities } from '../content'
import { getDimensionViews } from '../core/dimensions'
import type { Result as QuizResult } from '../core/score'
import { RichText, TopBar } from './shared'
import { ShareDialog } from './ShareDialog'
import { startReveal } from './reveal'
import { useCharacter } from './useCharacter'

interface ResultProps {
  result: QuizResult
  revealing: boolean
  onRevealed: () => void
  onBack: () => void
  onRestart: () => void
}

export function Result({ result, revealing, onRevealed, onBack, onRestart }: ResultProps) {
  const personality = personalities[result.code]
  const dims = useMemo(() => getDimensionViews(result.scores), [result])
  const { artwork, retry } = useCharacter(personality.modelId)
  const [shareOpen, setShareOpen] = useState(false)
  const screen = useRef<HTMLElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const shareButton = useRef<HTMLButtonElement>(null)
  const skip = useRef<HTMLButtonElement>(null)
  const reveal = useRef<ReturnType<typeof startReveal>>(undefined)

  useLayoutEffect(() => {
    const section = screen.current!
    function updateArtSize() {
      section.style.setProperty('--art-max', `${Math.floor(1024 / window.devicePixelRatio)}px`)
    }
    updateArtSize()
    window.addEventListener('resize', updateArtSize)
    window.scrollTo(0, 0)
    return () => window.removeEventListener('resize', updateArtSize)
  }, [])

  useLayoutEffect(() => {
    if (!revealing) {
      heading.current?.focus({ preventScroll: true })
      return
    }
    skip.current?.focus({ preventScroll: true })
    const playback = startReveal(screen.current!, personality.modelId, dims, onRevealed)
    reveal.current = playback
    return () => {
      playback?.dispose()
      reveal.current = undefined
    }
  }, [revealing, personality.modelId, dims, onRevealed])

  useLayoutEffect(() => {
    if (artwork.status === 'ready') reveal.current?.ready(artwork.image)
    if (artwork.status === 'failed') reveal.current?.finish()
  }, [artwork])

  const image = artwork.status === 'ready' ? artwork.image : undefined
  const state = revealing ? 'revealing' : artwork.status

  return (
    <section className={`screen result ${state}`} aria-labelledby={revealing ? undefined : 'result-title'} ref={screen}>
      <div className="result-contents" aria-hidden={revealing} inert={revealing}>
        <TopBar backLabel="首页" onBack={onBack} inactive={revealing} />
        <div className="result-body">
          <div className="art-stage">
            <div className="art-halo" aria-hidden="true" />
            <div className="art-ring" aria-hidden="true" />
            <div className="art-wrap">
              <div className="art-scale">
                <div className="art-peek">
                  {revealing && <>
                    <canvas className="reveal-coarse" aria-hidden="true" />
                    <canvas className="reveal-fine" aria-hidden="true" />
                  </>}
                  <img className="character" src={image?.src} alt={image ? `${personality.model} 角色插画` : ''} width="1024" height="1536" />
                </div>
              </div>
              {revealing && <>
                <div className="reveal-noise" aria-hidden="true"><span /></div>
                <div className="reveal-ring-position" aria-hidden="true"><span className="reveal-ring" /></div>
                <p className="reveal-caption" aria-hidden="true">正在读取你的 <b>10</b> 个选择…</p>
              </>}
            </div>
            {!revealing && !image && (
              <div className="art-status">
                <p role="status">{artwork.status === 'failed' ? '角色图没有加载出来' : '正在加载角色图…'}</p>
                {artwork.status === 'failed' && (
                  <button className="ghost" type="button" onClick={() => {
                    heading.current?.focus({ preventScroll: true })
                    retry()
                  }}>重试</button>
                )}
              </div>
            )}
            <span className="art-corner corner-top-left" aria-hidden="true" />
            <span className="art-corner corner-top-right" aria-hidden="true" />
            <span className="art-corner corner-bottom-left" aria-hidden="true" />
            <span className="art-corner corner-bottom-right" aria-hidden="true" />
          </div>
          <div className="result-info">
            <div className="identity">
              <h2 id="result-title" className="persona" tabIndex={-1} ref={heading}>{personality.persona}</h2>
              <p className="model-name">{personality.model}</p>
            </div>
            <ul className="dimensions" role="list" aria-label="四维倾向">
              {dims.map((dim) => (
                <li
                  className={`dimension is-${dim.side}`}
                  key={dim.dim}
                  aria-label={`${dim.name}，${dim.neg.letter} ${dim.neg.name}、${dim.pos.letter} ${dim.pos.name}，当前倾向 ${dim.letter} ${dim.poleName}`}
                >
                  <span className="pole pole-neg"><b>{dim.neg.letter}</b> {dim.neg.name}</span>
                  <span className="pole pole-pos"><b>{dim.pos.letter}</b> {dim.pos.name}</span>
                  <span className="track" aria-hidden="true">
                    <span className="bar" style={{ '--ratio': dim.ratio } as CSSProperties} />
                  </span>
                </li>
              ))}
            </ul>
            <p className="description"><RichText text={personality.description} /></p>
            <div className="result-actions">
              <button ref={shareButton} type="button" className="cta" aria-haspopup="dialog" onClick={() => setShareOpen(true)} disabled={revealing}>保存图片</button>
              <button type="button" className="cta" onClick={onRestart} disabled={revealing}>再测一次</button>
            </div>
          </div>
        </div>
      </div>
      {shareOpen && <ShareDialog code={result.code} personality={personality} dimensions={dims} onClose={() => {
        setShareOpen(false)
        shareButton.current?.focus({ preventScroll: true })
      }} />}
      {revealing && <>
        <div className="reveal-flash" aria-hidden="true" />
        <button type="button" className="reveal-skip" ref={skip} onClick={onRevealed} aria-label="跳过揭晓">
          <span>跳过</span>
        </button>
      </>}
    </section>
  )
}
