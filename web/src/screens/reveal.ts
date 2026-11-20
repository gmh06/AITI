import type { ModelId } from '../content/types'
import { DESKTOP_QUERY, REDUCED_MOTION_QUERY } from '../core/env'
import type { DimensionView } from '../core/dimensions'

const DURATION = 6000
const WAIT_AT = 1200
const RESUME_AT = 1000
const EASE = 'cubic-bezier(.16, 1, .3, 1)'

// Center is relative to the original image. Radius is a fraction of its width.
const framing: Record<ModelId, { x: number; y: number; radius: number }> = {
  gpt: { x: .30, y: .735, radius: .14 },
  deepseek: { x: .25, y: .755, radius: .145 },
  glm: { x: .48, y: .655, radius: .16 },
  grok: { x: .19, y: .685, radius: .15 },
  kimi: { x: .45, y: .77, radius: .16 },
  claude: { x: .745, y: .575, radius: .16 },
  gemini: { x: .68, y: .304, radius: .12 },
  doubao: { x: .505, y: .40, radius: .12 },
}

let noiseTexture: string | undefined

function getNoiseTexture() {
  if (noiseTexture) return noiseTexture
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const ctx = canvas.getContext('2d')
  if (!ctx) return undefined
  const pixels = ctx.createImageData(128, 128)
  for (let i = 0; i < pixels.data.length; i += 4) {
    const shade = 150 + Math.random() * 105
    pixels.data.set([shade * .88, shade * .92, shade, 255], i)
  }
  ctx.putImageData(pixels, 0, 0)
  noiseTexture = canvas.toDataURL()
  return noiseTexture
}

function paintPreview(canvas: HTMLCanvasElement, image: HTMLImageElement, width: number) {
  canvas.width = width
  canvas.height = Math.round(width * image.naturalHeight / image.naturalWidth)
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
}

type Frame = [time: number, keyframe: Keyframe]

export function startReveal(
  screen: HTMLElement,
  model: ModelId,
  views: DimensionView[],
  onDone: () => void,
) {
  const desktop = matchMedia(DESKTOP_QUERY)
  const reduced = matchMedia(REDUCED_MOTION_QUERY)
  if (reduced.matches || document.hidden || !HTMLElement.prototype.animate) {
    onDone()
    return undefined
  }

  const wrap = screen.querySelector<HTMLElement>('.art-wrap')!
  const ring = wrap.querySelector<HTMLElement>('.reveal-ring')!
  const noise = wrap.querySelector<HTMLElement>('.reveal-noise')!
  const grain = noise.querySelector<HTMLElement>('span')!
  const coarse = wrap.querySelector<HTMLCanvasElement>('.reveal-coarse')!
  const fine = wrap.querySelector<HTMLCanvasElement>('.reveal-fine')!
  const point = framing[model]
  const { width, height } = wrap.getBoundingClientRect()
  const x = point.x * width
  const y = point.y * height
  const radius = point.radius * width
  const endRadius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y)) + 2
  const clip = (size: number) => `circle(${size}px at ${x}px ${y}px)`
  ring.style.left = `${x}px`
  ring.style.top = `${y}px`
  ring.style.margin = `${-radius}px 0 0 ${-radius}px`
  ring.style.width = ring.style.height = `${2 * radius}px`
  const texture = getNoiseTexture()
  if (texture) grain.style.backgroundImage = `url(${texture})`
  const previousOverflow = document.documentElement.style.overflow
  document.documentElement.style.overflow = 'hidden'

  const animations: Animation[] = []
  function add(element: Element | null, frames: Frame[]) {
    if (!element) return
    const keyframes = frames.map(([time, values]) => ({ easing: EASE, ...values, offset: time / DURATION }))
    const first = keyframes[0]
    const last = keyframes[keyframes.length - 1]
    if (first.offset > 0) keyframes.unshift({ ...first, offset: 0 })
    if (last.offset < 1) keyframes.push({ ...last, offset: 1 })
    animations.push(element.animate(keyframes, { duration: DURATION, fill: 'both' }))
  }

  const fade = (from: number, to: number): Frame[] => [[from, { opacity: 0 }], [to, { opacity: 1 }]]
  const pulse = (opacity: number, scale = 1) => ({ opacity, transform: `scale(${scale})` })
  const move = (opacity: number, y: number, scale = 1) => ({ opacity, transform: `translateY(${y}px) scale(${scale})` })
  add(noise, [
    [0, pulse(0)], [200, pulse(.85)], [1000, pulse(.85)], [1100, pulse(1, 1.04)],
    [1200, pulse(.85)], [1600, pulse(.5)], [2200, pulse(0)],
  ])
  add(wrap.querySelector('.reveal-caption'), [
    [200, { opacity: 0 }], [800, { opacity: 1 }], [2200, { opacity: 1 }], [2400, { opacity: 0 }],
  ])
  add(ring, [
    [1200, pulse(0)], [1600, pulse(1)], [2400, { ...pulse(1), easing: 'linear' }],
    [3200, pulse(1, 1.03)], [3500, pulse(0, 1.7)],
  ])
  add(screen.querySelector('.reveal-flash'), [[3199, { opacity: 0 }], [3200, { opacity: .5 }], [3440, { opacity: 0 }]])
  add(wrap.querySelector('.art-scale'), [
    [3600, { transform: 'scale(1)' }], [3800, { transform: 'scale(.97)' }], [4000, { transform: 'scale(1)' }],
  ])
  add(wrap.querySelector('.art-peek'), [
    [0, { clipPath: clip(radius) }], [2400, { clipPath: clip(radius), easing: 'linear' }],
    [3200, { clipPath: clip(radius * 1.03) }], [3800, { clipPath: clip(endRadius) }],
  ])
  add(coarse, fade(1200, 1600))
  add(fine, fade(1600, 2200))
  add(wrap.querySelector('.character'), fade(2200, 2400))
  add(screen.querySelector('.persona'), [[4000, move(0, -12, 1.04)], [4600, move(1, 0)]])
  screen.querySelectorAll('.dimension').forEach((element, index) => {
    const from = 4600 + 120 * index
    add(element, fade(from, from + 440))
    add(element.querySelector('.bar'), [
      [from, { transform: 'scaleX(0)' }], [from + 440, { transform: `scaleX(${views[index].ratio})` }],
    ])
  })
  screen.querySelectorAll('.topbar, .model-name, .description, .result-actions, .art-halo, .art-ring, .art-corner')
    .forEach((element) => add(element, [[5400, move(0, 8)], [6000, move(1, 0)]]))

  const jitter = grain.animate(Array.from({ length: 12 }, () => ({
    transform: `translate(${-Math.floor(Math.random() * 128)}px, ${-Math.floor(Math.random() * 128)}px)`,
    easing: 'steps(1, end)',
  })), { duration: 480, iterations: Infinity })
  let hasArt = false
  let waiting = false
  let disposed = false
  const waitTimer = window.setTimeout(() => {
    if (hasArt) return
    waiting = true
    animations.forEach((animation) => {
      animation.pause()
      animation.currentTime = RESUME_AT
    })
  }, WAIT_AT)

  function onKey(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Escape') {
      event.preventDefault()
      finish()
    }
  }
  function onVisibility() {
    if (document.hidden) finish()
  }
  function onMotion() {
    if (reduced.matches) finish()
  }
  function dispose() {
    if (disposed) return
    disposed = true
    window.clearTimeout(waitTimer)
    animations[0].onfinish = null
    animations.forEach((animation) => animation.cancel())
    jitter.cancel()
    window.removeEventListener('keydown', onKey, true)
    window.removeEventListener('orientationchange', finish)
    document.removeEventListener('visibilitychange', onVisibility)
    desktop.removeEventListener('change', finish)
    reduced.removeEventListener('change', onMotion)
    document.documentElement.style.overflow = previousOverflow
  }
  function finish() {
    if (disposed) return
    dispose()
    onDone()
  }

  animations[0].onfinish = finish
  window.addEventListener('keydown', onKey, true)
  window.addEventListener('orientationchange', finish)
  document.addEventListener('visibilitychange', onVisibility)
  desktop.addEventListener('change', finish)
  reduced.addEventListener('change', onMotion)

  return {
    ready(image: HTMLImageElement) {
      if (disposed) return
      paintPreview(coarse, image, 16)
      paintPreview(fine, image, 64)
      hasArt = true
      if (waiting) animations.forEach((animation) => animation.play())
    },
    finish,
    dispose,
  }
}
