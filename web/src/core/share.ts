import type { Personality } from '../content/types'
import type { DimensionView } from './dimensions'
import qrUrl from '../../assets/style/quiz-qr.png'
import aitiUrl from '../generated/share/poster-aiti.png'
import backgroundUrl from '../generated/share/poster-background.webp'
import wordmarkUrl from '../generated/share/poster-wordmark.png'

const portraits = import.meta.glob<string>(['../generated/share/poster-*.webp', '!../generated/share/poster-background.webp'], {
  eager: true,
  import: 'default',
  query: '?url',
})
const width = 1080
const baseHeight = 1440
const inset = 64
const textWidth = width - 2 * inset
const descriptionTop = 893
const footerHeight = 215
const ink = '#f4f8ff'
const muted = '#d3e2ff'
const accent = '#ffb791'
const ring = 'rgba(202, 235, 255, 0.76)'
const opening = /[（《“「『【‘(]+$/u
const closing = /^[、。！？；：，）》”」』】’.,!?)]/u

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Could not load a share-card asset.'))
    image.src = url
  })
}

function wrapDescription(context: CanvasRenderingContext2D, text: string) {
  return text.split(/\r?\n/u).flatMap((paragraph) => {
    const lines: string[] = []
    let line = ''
    const tokens = (paragraph.match(/[a-z0-9]+(?:[.+-][a-z0-9]+)*|./giu) ?? [])
      .flatMap((token) => context.measureText(token).width > textWidth ? Array.from(token) : token)
    for (const token of tokens) {
      if (context.measureText(line + token).width <= textWidth) {
        line = (line + token).trimStart()
        continue
      }
      if (!token.trim()) continue
      line = line.trimEnd()
      const carry = line.match(opening)?.[0] ?? (closing.test(token) ? Array.from(line).pop() ?? '' : '')
      const before = line.slice(0, line.length - carry.length)
      if (before) lines.push(before.trimEnd())
      line = carry + token
    }
    lines.push(line.trimEnd())
    return lines
  })
}

function drawArtwork(context: CanvasRenderingContext2D, image: HTMLImageElement) {
  const centerX = width / 2
  const centerY = 237
  const halo = context.createRadialGradient(centerX, centerY, 10, centerX, centerY, 222)
  halo.addColorStop(0, 'rgba(43, 80, 157, 0.58)')
  halo.addColorStop(1, 'rgba(43, 80, 157, 0)')
  context.fillStyle = halo
  context.fillRect(centerX - 222, centerY - 222, 444, 444)

  context.strokeStyle = ring
  context.lineWidth = 1.5
  context.beginPath()
  context.arc(centerX, centerY, 174, 0, 2 * Math.PI)
  context.stroke()
  context.setLineDash([4, 4])
  context.beginPath()
  context.arc(centerX, centerY, 156, 0, 2 * Math.PI)
  context.stroke()
  context.setLineDash([])

  context.beginPath()
  for (const [x, dx] of [[216, 1], [864, -1]]) {
    for (const [y, dy] of [[132, 1], [394, -1]]) {
      context.moveTo(x + dx * 19, y)
      context.lineTo(x, y)
      context.lineTo(x, y + dy * 19)
    }
  }
  context.stroke()
  context.fillStyle = '#ed794e'
  context.beginPath()
  context.moveTo(centerX, 53)
  context.lineTo(centerX + 10, 63)
  context.lineTo(centerX, 73)
  context.lineTo(centerX - 10, 63)
  context.fill()

  const scale = 280 / Math.max(image.naturalWidth, image.naturalHeight)
  const artWidth = image.naturalWidth * scale
  const artHeight = image.naturalHeight * scale
  context.drawImage(image, centerX - artWidth / 2, centerY - artHeight / 2, artWidth, artHeight)
}

function drawDimensions(context: CanvasRenderingContext2D, dimensions: DimensionView[], sans: string, mono: string) {
  const middle = width / 2
  dimensions.forEach(({ pos, neg, side, ratio }, index) => {
    const y = 618 + index * 69
    for (const [pole, right, active] of [[neg, false, side === 'neg'], [pos, true, side === 'pos']] as const) {
      context.font = `${active ? 700 : 400} 26px ${sans}`
      context.fillStyle = active ? ink : muted
      context.textAlign = right ? 'right' : 'left'
      const nameWidth = context.measureText(pole.name).width
      context.fillText(pole.name, right ? width - inset : inset + 31, y)
      context.font = `700 31px ${mono}`
      context.fillStyle = active ? accent : muted
      context.fillText(pole.letter, right ? width - inset - nameWidth - 12 : inset, y)
    }

    const barY = y + 22
    context.fillStyle = 'rgba(197, 219, 255, 0.26)'
    context.fillRect(inset, barY, textWidth, 12)
    const length = ratio * textWidth / 2
    if (length > 0) {
      const tip = middle + (side === 'pos' ? length : -length)
      const gradient = context.createLinearGradient(middle, 0, tip, 0)
      gradient.addColorStop(0, '#ce4c36')
      gradient.addColorStop(1, '#ffc08b')
      context.fillStyle = gradient
      const bevel = Math.min(length, 8)
      context.beginPath()
      context.moveTo(middle, barY)
      context.lineTo(tip + (side === 'neg' ? bevel : 0), barY)
      context.lineTo(tip - (side === 'pos' ? bevel : 0), barY + 12)
      context.lineTo(middle, barY + 12)
      context.fill()
    }
    context.fillStyle = '#9cb8e7'
    context.fillRect(middle, barY - 3, 2, 18)
  })
}

export async function createSharePoster(personality: Personality, dimensions: DimensionView[]) {
  const portraitUrl = portraits[`../generated/share/poster-${personality.modelId}.webp`]
  if (!portraitUrl) throw new Error('Missing share-card portrait.')
  const [background, portrait, aiti, wordmark, qr] = await Promise.all([
    loadImage(backgroundUrl), loadImage(portraitUrl), loadImage(aitiUrl), loadImage(wordmarkUrl), loadImage(qrUrl),
  ])
  await document.fonts.ready

  const styles = getComputedStyle(document.documentElement)
  const sans = styles.getPropertyValue('--sans').trim() || 'sans-serif'
  const mono = styles.getPropertyValue('--mono').trim() || 'monospace'
  const canvas = document.createElement('canvas')
  canvas.width = width
  const context = canvas.getContext('2d', { alpha: false })
  if (!context) throw new Error('This browser does not support the share-card canvas.')

  const text = personality.shareDescription?.trim()
  let fontSize = 28
  let lines: string[] = []
  if (text) {
    for (; fontSize >= 26; fontSize -= 1) {
      context.font = `${fontSize}px ${sans}`
      lines = wrapDescription(context, text)
      if (lines.length * fontSize * 1.43 <= baseHeight - footerHeight - descriptionTop - 20 || fontSize === 26) break
    }
  }
  const lineHeight = fontSize * 1.43
  canvas.height = Math.max(baseHeight, Math.ceil(descriptionTop + lines.length * lineHeight + 20 + footerHeight))

  const footerY = canvas.height - footerHeight
  context.drawImage(background, 0, 0)
  if (canvas.height > baseHeight) {
    context.drawImage(background, 0, 1040, width, 400, 0, 1040, width, canvas.height - 1040)
  }
  context.drawImage(aiti, inset, 36)
  context.drawImage(wordmark, width - inset - 402, 38, 402, 402 * wordmark.naturalHeight / wordmark.naturalWidth)
  drawArtwork(context, portrait)

  context.textBaseline = 'middle'
  context.textAlign = 'center'
  context.fillStyle = ink
  context.font = `700 48px ${sans}`
  context.fillText(personality.persona, width / 2, 481)
  context.font = `800 72px ${sans}`
  context.fillText(personality.model, width / 2, 545)
  drawDimensions(context, dimensions, sans, mono)

  context.textAlign = 'left'
  context.textBaseline = 'top'
  context.fillStyle = ink
  context.font = `${fontSize}px ${sans}`
  lines.forEach((line, index) => context.fillText(line, inset, descriptionTop + index * lineHeight))

  context.fillStyle = 'rgba(197, 221, 255, 0.46)'
  context.fillRect(inset, footerY, textWidth, 2)
  context.textBaseline = 'middle'
  context.fillStyle = ink
  context.font = `700 32px ${sans}`
  context.fillText('清华大学计算机科学与技术系第44届学生节', inset, footerY + 70)
  context.font = `700 41px ${sans}`
  context.fillText('11月29日 · 大礼堂', inset, footerY + 130)
  context.drawImage(qr, width - inset - qr.naturalWidth, footerY + 25)

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Could not encode the share card.'))
    }, 'image/jpeg', 0.94)
  })
}
