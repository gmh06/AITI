import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import type { Code, Personality } from '../content/types'
import type { DimensionView } from '../core/dimensions'
import '../styles/share.css'

interface ShareDialogProps {
  code: Code
  personality: Personality
  dimensions: DimensionView[]
  onClose: () => void
}

type Preview =
  | { status: 'loading' | 'error' }
  | { status: 'ready'; url: string; file: File }

function readDataUrl(file: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function ShareDialog({ code, personality, dimensions, onClose }: ShareDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [preview, setPreview] = useState<Preview>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const wechat = /MicroMessenger/i.test(navigator.userAgent)
  const nativeDialog = typeof HTMLDialogElement !== 'undefined' && typeof HTMLDialogElement.prototype.showModal === 'function'

  useLayoutEffect(() => {
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    if (nativeDialog) dialog.current?.showModal()
    else dialog.current?.querySelector('button')?.focus()
    return () => {
      root.style.overflow = previousOverflow
    }
  }, [nativeDialog])

  useEffect(() => {
    let active = true
    let objectUrl: string | undefined

    async function prepare() {
      try {
        const { createSharePoster } = await import('../core/share')
        if (!active) return
        const poster = await createSharePoster(code, personality, dimensions)
        if (!active) return
        const file = new File([poster], `AITI-${code}.jpg`, { type: poster.type })
        const url = wechat ? await readDataUrl(file) : (objectUrl = URL.createObjectURL(file))
        if (active) setPreview({ status: 'ready', url, file })
      } catch {
        if (active) setPreview({ status: 'error' })
      }
    }

    void prepare()
    return () => {
      active = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [attempt, code, dimensions, personality, wechat])

  function close() {
    if (nativeDialog) dialog.current?.close()
    else onClose()
  }

  function handleFallbackKeys(event: KeyboardEvent<HTMLDialogElement>) {
    if (nativeDialog) return
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
    }
    if (event.key !== 'Tab') return
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button, a[href]'))
    const first = controls[0]
    const last = controls[controls.length - 1]
    const boundary = event.shiftKey ? first : last
    if (document.activeElement === boundary || !controls.includes(document.activeElement as HTMLElement)) {
      event.preventDefault()
      const destination = event.shiftKey ? last : first
      destination?.focus()
    }
  }

  async function save(event: MouseEvent<HTMLAnchorElement>) {
    if (preview.status !== 'ready' || !navigator.share || !matchMedia('(pointer: coarse)').matches) return
    const files = [preview.file]
    if (!navigator.canShare?.({ files })) return

    event.preventDefault()
    try {
      await navigator.share({ files })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      const download = document.createElement('a')
      download.href = preview.url
      download.download = preview.file.name
      document.body.append(download)
      download.click()
      download.remove()
    }
  }

  return <>
    {!nativeDialog && <div className="share-dialog-fallback-backdrop" aria-hidden="true" />}
    <dialog ref={dialog} className="share-dialog" open={nativeDialog ? undefined : true}
      role="dialog" aria-modal="true" aria-label="保存图片" onClose={onClose} onKeyDown={handleFallbackKeys}>
      <header className="share-dialog-header">
        <button type="button" className="share-dialog-close" aria-label="关闭" onClick={close}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="m5 5 14 14M19 5 5 19" />
          </svg>
        </button>
      </header>
      {preview.status === 'loading' && <p className="share-dialog-message" role="status">正在生成宣传图…</p>}
      {preview.status === 'error' && (
        <div className="share-dialog-message">
          <p role="alert">宣传图生成失败。</p>
          <button type="button" className="cta" onClick={() => {
            setPreview({ status: 'loading' })
            setAttempt((previous) => previous + 1)
          }}>重试</button>
        </div>
      )}
      {preview.status === 'ready' && (
        <>
          <div className="share-dialog-preview">
            <img src={preview.url} alt={`${personality.persona} · ${personality.model} 宣传图`} />
          </div>
          <div className="share-dialog-actions">
            {wechat ? <p>长按图片保存到相册</p> : (
              <a className="cta" href={preview.url} download={preview.file.name} onClick={save}>保存图片</a>
            )}
          </div>
        </>
      )}
    </dialog>
  </>
}
