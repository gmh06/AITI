import type { ModelId } from '../content/types'
import { REDUCED_MOTION_QUERY } from '../core/env'
import type { DimensionView } from '../core/dimensions'

const WAIT_AT = 1200
const PEEK_VISIBLE_AT = 1650
const PEEK_BREATH_AT = PEEK_VISIBLE_AT + 1000
const CHARGE_AT = PEEK_BREATH_AT + 1180
const CHARGED_AT = CHARGE_AT + 280
const OPEN_AT = CHARGED_AT + 90
const OPENED_AT = OPEN_AT + 700
const SETTLED_AT = OPENED_AT + 280
const DIMENSIONS_AT = SETTLED_AT + 550
const DIMENSION_STAGGER = 120
const DIMENSION_FADE = 440
const DETAILS_FADE = 650
const EASE = 'cubic-bezier(.16, 1, .3, 1)'
const ART_HEIGHT = 1.5 // The artwork box is 2:3, with its width as the unit.
const CIRCLE_PERCENT_BASE = Math.hypot(1, ART_HEIGHT) / Math.SQRT2

const peekMotion = [
  { time: PEEK_VISIBLE_AT, scale: 1, easing: 'linear' },
  { time: PEEK_BREATH_AT, scale: 1, easing: 'linear' },
  { time: CHARGE_AT, scale: 1.03, easing: 'ease-in' },
  { time: CHARGED_AT, scale: .72, easing: 'linear' },
  { time: OPEN_AT, scale: .72, easing: EASE },
]

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

  const detailsAt = DIMENSIONS_AT + (views.length - 1) * DIMENSION_STAGGER + DIMENSION_FADE
  const duration = detailsAt + DETAILS_FADE
  const animations: Animation[] = []
  function add(element: Element | null, frames: Frame[]) {
    if (!element) return
    const keyframes = frames.map(([time, values]) => ({ easing: EASE, ...values, offset: time / duration }))
    const first = keyframes[0]
    const last = keyframes[keyframes.length - 1]
    if (first.offset > 0) keyframes.unshift({ ...first, offset: 0 })
    if (last.offset < 1) keyframes.push({ ...last, offset: 1 })
    animations.push(element.animate(keyframes, { duration, fill: 'both' }))
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
    [WAIT_AT, pulse(.85)], [PEEK_VISIBLE_AT, pulse(0)],
  ])
  add(wrap.querySelector('.reveal-caption'), [
    [200, { opacity: 0 }], [800, { opacity: 1 }], [WAIT_AT, { opacity: 1 }], [PEEK_VISIBLE_AT, { opacity: 0 }],
  ])
  add(ring, [
    [WAIT_AT, pulse(0)],
    ...peekMotion.map<Frame>(({ time, scale, easing }) => [time, { ...pulse(1, scale), easing }]),
    [OPEN_AT + 300, pulse(0, 1.7)],
  ])
  if (!reduced) {
    add(wrap.querySelector('.art-scale'), [
      [OPENED_AT - 180, { transform: 'scale(1)' }],
      [OPENED_AT, { transform: 'scale(.97)' }],
      [SETTLED_AT, { transform: 'scale(1)' }],
    ])
  }
  add(wrap.querySelector('.art-peek'), reduced ? [
    [0, { clipPath: clip(radius), easing: 'steps(1, end)' }], [OPEN_AT, { clipPath: clip(endRadius) }],
  ] : [
    [0, { clipPath: clip(radius) }],
    ...peekMotion.map<Frame>(({ time, scale, easing }) => [time, { clipPath: clip(radius * scale), easing }]),
    [OPENED_AT, { clipPath: clip(endRadius) }],
  ])
  add(wrap.querySelector('.character'), fade(WAIT_AT, PEEK_VISIBLE_AT))
  add(screen.querySelector('.persona'), [[SETTLED_AT, move(0, -12, 1.04)], [DIMENSIONS_AT, move(1, 0)]])
  screen.querySelectorAll('.dimension').forEach((element, index) => {
    const from = DIMENSIONS_AT + DIMENSION_STAGGER * index
    const to = from + DIMENSION_FADE
    add(element, fade(from, to))
    if (!reduced) {
      add(element.querySelector('.bar'), [
        [from, { transform: 'scaleX(0)' }], [to, { transform: `scaleX(${views[index].ratio})` }],
      ])
    }
  })
  screen.querySelectorAll('.topbar, .model-name, .description, .result-actions, .art-halo, .art-ring, .art-corner')
    .forEach((element) => add(element, [[detailsAt, move(0, 8)], [duration, move(1, 0)]]))

  const jitter = reduced ? undefined : grain.animate(Array.from({ length: 12 }, () => ({
    transform: `translate(${-Math.floor(Math.random() * 128)}px, ${-Math.floor(Math.random() * 128)}px)`,
    easing: 'steps(1, end)',
  })), { duration: 480, iterations: Infinity })
  let waiting = false
  let disposed = false
  const waitTimer = window.setTimeout(() => {
    waiting = true
    animations.forEach((animation) => {
      animation.pause()
      animation.currentTime = WAIT_AT
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
    // Keep the final animation styles until React switches to the result.
    onDone()
  }

  animations[0].onfinish = finish

  return {
    ready() {
      if (disposed) return
      window.clearTimeout(waitTimer)
      if (waiting) animations.forEach((animation) => animation.play())
    },
    finish,
    dispose,
  }
}
