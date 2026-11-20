import type { Code, Personality } from '../content/types'
import type { DimensionView } from './dimensions'
import aitiUrl from '../generated/share/poster-aiti.png'
import paperUrl from '../generated/share/poster-background.webp'
import cityUrl from '../generated/share/poster-city.webp'
import qrUrl from '../generated/share/poster-qr.png'
import wordmarkUrl from '../generated/share/poster-wordmark.png'

const portraits = import.meta.glob<string>(['../generated/share/poster-*.webp', '!../generated/share/poster-{background,city}.webp'], {
  eager: true,
  import: 'default',
  query: '?url',
})
const modelNames = import.meta.glob<string>('../generated/share/poster-name-*.png', {
  eager: true,
  import: 'default',
  query: '?url',
})

const width = 1080
const baseHeight = 1440
const inset = 75
const panelTop = 558
const textInset = 112
const textWidth = width - 2 * textInset
const descriptionTop = 884
const footerHeight = 235
const navy = '#081d44'
const ivory = '#f5e6ce'
const cream = '#fff3de'
const muted = '#c3d3e4'
const heading = '"AITI Engraved", sans-serif'
const body = '"AITI Share", "PingFang SC", "Microsoft YaHei", sans-serif'
const festival = '清华大学计算机科学与技术系第 44 届学生节'
const eventDate = '11月29日 · 大礼堂'
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

function wrapDescription(context: CanvasRenderingContext2D, text: string, firstLineIndent: number) {
  return text.split(/\r?\n/u).flatMap((paragraph) => {
    const lines: { text: string; indent: number }[] = []
    let line = ''
    let indent = firstLineIndent
    const tokens = (paragraph.match(/[a-z0-9]+(?:[.+-][a-z0-9]+)*|./giu) ?? [])
      .flatMap((token) => context.measureText(token).width > textWidth - firstLineIndent ? Array.from(token) : token)
    for (const token of tokens) {
      if (context.measureText(line + token).width <= textWidth - indent) {
        line = (line + token).trimStart()
        continue
      }
      if (!token.trim()) continue
      line = line.trimEnd()
      const punctuation = line.match(opening)?.[0]
      const carry = punctuation ?? (closing.test(token) ? Array.from(line).pop() ?? '' : '')
      lines.push({ text: line.slice(0, line.length - carry.length).trimEnd(), indent })
      line = carry + token
      indent = 0
    }
    lines.push({ text: line.trimEnd(), indent })
    return lines
  })
}

function cutCorners(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, corner: number) {
  context.beginPath()
  context.moveTo(x + corner, y)
  context.lineTo(x + w - corner, y)
  context.lineTo(x + w, y + corner)
  context.lineTo(x + w, y + h - corner)
  context.lineTo(x + w - corner, y + h)
  context.lineTo(x + corner, y + h)
  context.lineTo(x, y + h - corner)
  context.lineTo(x, y + corner)
  context.closePath()
}

function drawPaper(context: CanvasRenderingContext2D, paper: HTMLImageElement, height: number) {
  context.fillStyle = context.createPattern(paper, 'repeat') ?? navy
  context.fillRect(0, 0, width, height)
  context.strokeStyle = ivory
  context.lineWidth = 3
  cutCorners(context, 22, 22, width - 44, height - 44, 23)
  context.stroke()
  context.lineWidth = 1.25
  cutCorners(context, 32, 32, width - 64, height - 64, 21)
  context.stroke()

  context.beginPath()
  for (const [x, dx] of [[32, 1], [width - 32, -1]]) {
    for (const [y, dy, reach] of [[196, -1, 74], [height - 102, 1, 21]]) {
      context.moveTo(x, y)
      context.lineTo(x + dx * reach / 3, y)
      context.lineTo(x + dx * reach * 2 / 3, y + dy * 20)
      context.lineTo(x + dx * (reach - 4), y + dy * 20)
      context.rect(x + dx * reach - 4, y + dy * 20 - 4, 8, 8)
    }
  }
  context.stroke()
}

function drawHero(context: CanvasRenderingContext2D, artwork: HTMLImageElement, modelName: HTMLImageElement, persona: string, code: Code) {
  const textCenter = 310
  const artCenter = 750
  const artY = 340
  const radius = 178

  context.strokeStyle = ivory
  context.lineWidth = 2
  for (const ringRadius of [radius, radius - 8]) {
    context.beginPath()
    context.arc(artCenter, artY, ringRadius, 0, 2 * Math.PI)
    context.stroke()
    context.lineWidth = 1
  }

  context.fillStyle = ivory
  for (const angle of [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) {
    context.save()
    context.translate(artCenter + Math.cos(angle) * radius, artY + Math.sin(angle) * radius)
    context.rotate(angle)
    context.beginPath()
    context.moveTo(-15, 0)
    context.lineTo(0, -5)
    context.lineTo(15, 0)
    context.lineTo(0, 5)
    context.fill()
    context.restore()
  }

  const artScale = 316 / Math.max(artwork.naturalWidth, artwork.naturalHeight)
  const artWidth = artwork.naturalWidth * artScale
  const artHeight = artwork.naturalHeight * artScale
  context.drawImage(artwork, artCenter - artWidth / 2, artY - artHeight / 2, artWidth, artHeight)

  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillStyle = cream
  context.font = `53px ${heading}`
  context.fillText(persona, textCenter, 240, 418)
  context.font = `38px ${heading}`
  context.fillStyle = ivory
  context.fillText(Array.from(code).join(' '), textCenter, 304)
  context.strokeStyle = 'rgba(245, 230, 206, 0.5)'
  context.beginPath()
  context.moveTo(textCenter - 52, 343)
  context.lineTo(textCenter + 52, 343)
  context.stroke()

  const nameScale = Math.min(106 / modelName.naturalHeight, 415 / modelName.naturalWidth)
  const nameWidth = modelName.naturalWidth * nameScale
  const nameHeight = modelName.naturalHeight * nameScale
  context.drawImage(modelName, textCenter - nameWidth / 2, 366 + (106 - nameHeight) / 2, nameWidth, nameHeight)
}

function drawPanel(context: CanvasRenderingContext2D, city: HTMLImageElement, bottom: number) {
  const panelWidth = width - 2 * inset
  const panelHeight = bottom - panelTop
  const scale = Math.max(panelWidth / city.naturalWidth, panelHeight / city.naturalHeight)
  const imageWidth = city.naturalWidth * scale
  const imageHeight = city.naturalHeight * scale

  context.save()
  cutCorners(context, inset, panelTop, panelWidth, panelHeight, 16)
  context.clip()
  context.fillStyle = navy
  context.fillRect(inset, panelTop, panelWidth, panelHeight)
  context.globalAlpha = 0.5
  context.drawImage(city, inset + (panelWidth - imageWidth) / 2, bottom - imageHeight, imageWidth, imageHeight)
  context.globalAlpha = 1
  const shade = context.createLinearGradient(0, panelTop, 0, bottom)
  shade.addColorStop(0, 'rgba(8, 29, 68, 0.23)')
  shade.addColorStop(0.37, 'rgba(8, 29, 68, 0.04)')
  shade.addColorStop(0.56, 'rgba(8, 29, 68, 0.27)')
  shade.addColorStop(1, 'rgba(8, 29, 68, 0.22)')
  context.fillStyle = shade
  context.fillRect(inset, panelTop, panelWidth, panelHeight)
  context.restore()

  context.strokeStyle = 'rgba(245, 230, 206, 0.74)'
  context.lineWidth = 1.3
  cutCorners(context, inset, panelTop, panelWidth, panelHeight, 16)
  context.stroke()
}

function drawDimensions(context: CanvasRenderingContext2D, dimensions: DimensionView[]) {
  const middle = width / 2
  context.textBaseline = 'middle'
  dimensions.forEach(({ pos, neg, side, ratio }, index) => {
    const y = 597 + index * 64
    for (const [pole, right, active] of [[neg, false, side === 'neg'], [pos, true, side === 'pos']] as const) {
      const edge = right ? width - textInset : textInset
      context.font = `29px ${body}`
      context.fillStyle = active ? cream : muted
      context.textAlign = right ? 'right' : 'left'
      const nameWidth = context.measureText(pole.name).width
      context.fillText(pole.name, right ? edge : edge + 32, y)
      context.font = `32px ${body}`
      context.fillStyle = active ? '#f6cf8c' : muted
      context.fillText(pole.letter, right ? edge - nameWidth - 12 : edge, y)
    }

    const barY = y + 21
    cutCorners(context, textInset, barY, textWidth, 13, 5)
    context.fillStyle = 'rgba(7, 22, 54, 0.58)'
    context.fill()
    context.lineWidth = 1
    context.strokeStyle = 'rgba(228, 220, 199, 0.68)'
    context.stroke()

    const length = ratio * textWidth / 2
    const tip = middle + (side === 'pos' ? length : -length)
    const tint = context.createLinearGradient(middle, 0, tip, 0)
    tint.addColorStop(0, '#bc9161')
    tint.addColorStop(1, '#ffe5a6')
    cutCorners(context, Math.min(middle, tip), barY + 2, length, 9, 4)
    context.fillStyle = tint
    context.fill()

    context.fillStyle = cream
    context.fillRect(middle - 1, barY - 2, 2, 17)
  })
}

export async function createSharePoster(code: Code, personality: Personality, dimensions: DimensionView[]) {
  const portraitUrl = portraits[`../generated/share/poster-${personality.modelId}.webp`]
  const modelNameUrl = modelNames[`../generated/share/poster-name-${personality.modelId}.png`]
  if (!portraitUrl || !modelNameUrl) throw new Error('Missing share-card character assets.')
  const [paper, city, portrait, modelName, aiti, wordmark, qr] = await Promise.all([
    loadImage(paperUrl), loadImage(cityUrl), loadImage(portraitUrl), loadImage(modelNameUrl),
    loadImage(aitiUrl), loadImage(wordmarkUrl), loadImage(qrUrl),
    document.fonts.load(`53px ${heading}`),
    document.fonts.load(`34px ${body}`),
  ])

  const canvas = document.createElement('canvas')
  canvas.width = width
  const context = canvas.getContext('2d', { alpha: false })
  if (!context) throw new Error('This browser does not support the share-card canvas.')

  const { description } = personality
  const text = (typeof description === 'string' ? description : description.map((segment) => segment.text).join('')).trim()
  const fontSize = 34
  const lineHeight = 47
  context.font = `${fontSize}px ${body}`
  const lines = wrapDescription(context, text, fontSize * 2)
  canvas.height = Math.max(baseHeight, descriptionTop + (lines.length - 1) * lineHeight + fontSize + 43 + footerHeight)
  const footerY = canvas.height - footerHeight

  drawPaper(context, paper, canvas.height)
  context.drawImage(wordmark, inset, 66, 342, 342 * wordmark.naturalHeight / wordmark.naturalWidth)
  context.drawImage(aiti, width - inset - 140, 70, 140, 140 * aiti.naturalHeight / aiti.naturalWidth)
  drawHero(context, portrait, modelName, personality.persona, code)
  drawPanel(context, city, footerY - 15)
  drawDimensions(context, dimensions)

  context.textAlign = 'left'
  context.textBaseline = 'top'
  context.fillStyle = cream
  context.font = `${fontSize}px ${body}`
  lines.forEach(({ text: line, indent }, index) => {
    context.fillText(line, textInset + indent, descriptionTop + index * lineHeight)
  })

  context.textBaseline = 'middle'
  context.fillStyle = ivory
  context.font = `36px ${heading}`
  context.fillText(festival, inset + 15, footerY + 75, 686)
  context.font = `51px ${heading}`
  context.fillText(eventDate, inset + 15, footerY + 143, 686)
  const qrSize = 174
  const qrX = width - inset - qrSize
  const qrY = footerY + 16
  context.strokeStyle = ivory
  context.lineWidth = 1.25
  cutCorners(context, qrX - 7, qrY - 7, qrSize + 14, qrSize + 14, 5)
  context.stroke()
  context.drawImage(qr, qrX, qrY, qrSize, qrSize)

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Could not encode the share card.'))
    }, 'image/jpeg', 0.94)
  })
}
