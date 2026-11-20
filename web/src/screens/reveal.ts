import type { ModelId } from '../content/types'
import { REDUCED_MOTION_QUERY } from '../core/env'
import type { DimensionView } from '../core/dimensions'

const DURATION = 6000
const WAIT_AT = 1200
const RESUME_AT = 1000
const OPEN_AT = 3200
const OPENED_AT = 3800
const EASE = 'cubic-bezier(.16, 1, .3, 1)'
const ART_HEIGHT = 1.5 // The artwork box is 2:3, with its width as the unit.
const CIRCLE_PERCENT_BASE = Math.hypot(1, ART_HEIGHT) / Math.SQRT2

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
    const shade = 24 + Math.random() * 76
    pixels.data.set([shade * .82, shade * .90, shade, 255], i)
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
  const reduced = matchMedia(REDUCED_MOTION_QUERY).matches
  if (!HTMLElement.prototype.animate) {
    onDone()
    return undefined
  }

  const wrap = screen.querySelector<HTMLElement>('.art-wrap')!
  const ringPosition = wrap.querySelector<HTMLElement>('.reveal-ring-position')!
  const ring = wrap.querySelector<HTMLElement>('.reveal-ring')!
  const noise = wrap.querySelector<HTMLElement>('.reveal-noise')!
  const grain = noise.querySelector<HTMLElement>('span')!
  const coarse = wrap.querySelector<HTMLCanvasElement>('.reveal-coarse')!
  const fine = wrap.querySelector<HTMLCanvasElement>('.reveal-fine')!
  const { x, y, radius } = framing[model]
  const endRadius = Math.hypot(Math.max(x, 1 - x), Math.max(y, 1 - y) * ART_HEIGHT) + .01
  // Percentages keep the ring and clip aligned when the artwork resizes mid-reveal.
  const clip = (size: number) => `circle(${100 * size / CIRCLE_PERCENT_BASE}% at ${100 * x}% ${100 * y}%)`
  ringPosition.style.left = `${100 * x}%`
  ringPosition.style.top = `${100 * y}%`
  ringPosition.style.width = `${200 * radius}%`
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
  const pulse = (opacity: number, scale = 1) => ({ opacity, transform: `scale(${reduced ? 1 : scale})` })
  const move = (opacity: number, y: number, scale = 1) => ({
    opacity,
    transform: reduced ? 'none' : `translateY(${y}px) scale(${scale})`,
  })
  add(screen.querySelector('.reveal-background'), [[OPEN_AT, { opacity: 1 }], [OPENED_AT, { opacity: 0 }]])
  add(noise, [
    [0, pulse(0)], [200, pulse(.85)], [1000, pulse(.85)], [1100, pulse(reduced ? .85 : 1, 1.04)],
    [1200, pulse(.85)], [1600, pulse(.5)], [2200, pulse(0)],
  ])
  add(wrap.querySelector('.reveal-caption'), [
    [200, { opacity: 0 }], [800, { opacity: 1 }], [2200, { opacity: 1 }], [2400, { opacity: 0 }],
  ])
  add(ring, [
    [1200, pulse(0)], [1600, pulse(1)], [2400, { ...pulse(1), easing: 'linear' }],
    [OPEN_AT, pulse(1, 1.03)], [3500, pulse(0, 1.7)],
  ])
  if (!reduced) {
    add(screen.querySelector('.reveal-flash'), [
      [0, { opacity: 0, easing: 'steps(1, end)' }], [OPEN_AT, { opacity: .5 }], [3440, { opacity: 0 }],
    ])
    add(wrap.querySelector('.art-scale'), [
      [3600, { transform: 'scale(1)' }], [3800, { transform: 'scale(.97)' }], [4000, { transform: 'scale(1)' }],
    ])
  }
  add(wrap.querySelector('.art-peek'), reduced ? [
    [0, { clipPath: clip(radius), easing: 'steps(1, end)' }], [OPEN_AT, { clipPath: clip(endRadius) }],
  ] : [
    [0, { clipPath: clip(radius) }], [2400, { clipPath: clip(radius), easing: 'linear' }],
    [OPEN_AT, { clipPath: clip(radius * 1.03) }], [OPENED_AT, { clipPath: clip(endRadius) }],
  ])
  add(coarse, fade(1200, 1600))
  add(fine, fade(1600, 2200))
  add(wrap.querySelector('.character'), fade(2200, 2400))
  add(screen.querySelector('.persona'), [[4000, move(0, -12, 1.04)], [4600, move(1, 0)]])
  screen.querySelectorAll('.dimension').forEach((element, index) => {
    const from = 4600 + 120 * index
    add(element, fade(from, from + 440))
    if (!reduced) {
      add(element.querySelector('.bar'), [
        [from, { transform: 'scaleX(0)' }], [from + 440, { transform: `scaleX(${views[index].ratio})` }],
      ])
    }
  })
  screen.querySelectorAll('.topbar, .model-name, .description, .result-actions, .art-halo, .art-ring, .art-corner')
    .forEach((element) => add(element, [[5400, move(0, 8)], [6000, move(1, 0)]]))

  const jitter = reduced ? undefined : grain.animate(Array.from({ length: 12 }, () => ({
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

  function dispose() {
    if (disposed) return
    disposed = true
    window.clearTimeout(waitTimer)
    animations[0].onfinish = null
    animations.forEach((animation) => animation.cancel())
    jitter?.cancel()
    document.documentElement.style.overflow = previousOverflow
  }
  function finish() {
    if (disposed) return
    dispose()
    onDone()
  }

  animations[0].onfinish = finish

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
