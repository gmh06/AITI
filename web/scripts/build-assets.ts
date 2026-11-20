import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { MODEL_IDS } from '../src/content/types.ts'

const repository = new URL('../../', import.meta.url)
const directory = new URL('../src/generated/img/', import.meta.url)
const sources: { characters: { model: string; white: string; transparent: string }[] } = JSON.parse(
  readFileSync(new URL('asset/nonhuman/cards/source-map.json', repository), 'utf8'),
)
const allowPlaceholder = !process.argv.includes('--release') || process.env.AITI_ALLOW_PLACEHOLDER === '1'
const width = 1024
const height = 1536
const limit = 150_000

const placeholder = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <path fill="#fff" d="M0 0h${width}v${height}H0z"/>
    <circle cx="512" cy="768" r="250" fill="#e3e8f7"/>
    <path fill="#a2b0f9" d="m512 606 162 162-162 162-162-162z"/>
  </svg>`,
)

mkdirSync(directory, { recursive: true })
const shareDirectory = new URL('../src/generated/share/', import.meta.url)
mkdirSync(shareDirectory, { recursive: true })
const framedArt: { scenes: { id: string; foreground: { sourceRect: [number, number, number, number] } }[] } = JSON.parse(
  readFileSync(new URL('asset/design/card-studies/v5/scenes.json', repository), 'utf8'),
)
const engravedDirectory = new URL('asset/design/card-studies/engraved-v1/', repository)
const engravedFronts = readFileSync(new URL('fronts.drawio', engravedDirectory), 'utf8')
const engravedPages = new Map(Array.from(engravedFronts.matchAll(
  /<diagram id="engraved-([a-z]+)"[^>]*>([\s\S]*?)<\/diagram>/g,
), ([, model, page]) => [model, page]))

function engravedLayer(model: string, layer: string) {
  const pattern = new RegExp(`<mxCell [^>]*?\\bid="${layer}" [^>]*?image=data:image/png,([A-Za-z0-9+/=]+)`)
  const png = engravedPages.get(model)?.match(pattern)?.[1]
  if (!png) throw new Error(`Missing engraved card layer: ${model}/${layer}`)
  return Buffer.from(png, 'base64')
}

await Promise.all(MODEL_IDS.map(async (model) => {
  const entry = sources.characters.find((source) => source.model === model)
  if (!entry) throw new Error(`Missing character entry for ${model}.`)
  const source = new URL(entry.white, repository)
  const available = existsSync(source)
  if (!available && !allowPlaceholder) throw new Error(`Missing character art: ${entry.white}`)
  if (!available) console.warn(`Using character placeholder: ${model}`)
  const image = sharp(available ? fileURLToPath(source) : placeholder)
  const metadata = await image.metadata()
  if (metadata.width !== width || metadata.height !== height) {
    throw new Error(`Character art for ${model} must be ${width}×${height}.`)
  }
  const info = await image.webp({ quality: 80 }).toFile(fileURLToPath(new URL(`${model}.webp`, directory)))
  if (info.size > limit) throw new Error(`Character art for ${model} is ${info.size} bytes (limit: ${limit}).`)

  const frame = framedArt.scenes.find(({ id }) => id === model)
  if (!frame) throw new Error(`Missing share-card framing for ${model}.`)
  const [left, top, cropWidth, cropHeight] = frame.foreground.sourceRect
  await Promise.all([
    sharp(fileURLToPath(new URL(entry.transparent, repository)))
      .extract({ left, top, width: cropWidth, height: cropHeight })
      .resize({ width: 400, height: 400, fit: 'inside' })
      .webp({ quality: 88 })
      .toFile(fileURLToPath(new URL(`poster-${model}.webp`, shareDirectory))),
    sharp(engravedLayer(model, 'model')).png()
      .toFile(fileURLToPath(new URL(`poster-name-${model}.png`, shareDirectory))),
  ])
}))

await Promise.all([
  // Sample an area of the engraved card's paper without lettering or linework.
  sharp(engravedLayer('gpt', 'frame'))
    .extract({ left: 510, top: 70, width: 252, height: 125 })
    .extend({ top: 0, bottom: 125, left: 0, right: 252, extendWith: 'mirror' })
    .webp({ quality: 90 })
    .toFile(fileURLToPath(new URL('poster-background.webp', shareDirectory))),
  sharp(fileURLToPath(new URL('asset/design/backgrounds/v3/city-landscape.png', repository)))
    .resize({ width: 1280 })
    .webp({ quality: 84 })
    .toFile(fileURLToPath(new URL('poster-city.webp', shareDirectory))),
  sharp(engravedLayer('gpt', 'title')).png()
    .toFile(fileURLToPath(new URL('poster-wordmark.png', shareDirectory))),
  sharp(engravedLayer('gpt', 'aiti')).png()
    .png()
    .toFile(fileURLToPath(new URL('poster-aiti.png', shareDirectory))),
  sharp(fileURLToPath(new URL('aiti-qr.png', engravedDirectory)))
    .resize({ width: 222, kernel: 'nearest' })
    .png()
    .toFile(fileURLToPath(new URL('poster-qr.png', shareDirectory))),
])
