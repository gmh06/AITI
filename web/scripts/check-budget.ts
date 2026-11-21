import { readFileSync, readdirSync } from 'node:fs'
import { gzipSync } from 'node:zlib'

interface Entry {
  file: string
  imports?: string[]
  css?: string[]
  isEntry?: boolean
}

const dist = new URL('../dist/', import.meta.url)
const manifest: Record<string, Entry> = JSON.parse(readFileSync(new URL('.vite/manifest.json', dist), 'utf8'))
const entry = Object.keys(manifest).find((key) => manifest[key].isEntry)
if (!entry) throw new Error('Production build is missing its entry point.')
const js = new Set<string>()
const css = new Set<string>()

function collect(key: string) {
  const chunk = manifest[key]
  if (js.has(chunk.file)) return
  js.add(chunk.file)
  chunk.css?.forEach((file) => css.add(file))
  chunk.imports?.forEach(collect)
}
collect(entry)

function total(files: Iterable<string>, gzip = false) {
  let size = 0
  for (const file of files) {
    const data = readFileSync(new URL(file, dist))
    size += gzip ? gzipSync(data).length : data.length
  }
  return size
}

function check(name: string, size: number, limit: number) {
  console.info(`${name}: ${(size / 1000).toFixed(1)} / ${limit / 1000} kB`)
  if (size > limit) throw new Error(`${name} exceeds the size budget.`)
}

const assets = readdirSync(new URL('assets/', dist))
const asset = (name: string) => {
  const file = assets.find((item) => item.startsWith(`${name}-`))
  if (!file) throw new Error(`Missing build asset: ${name}`)
  return `assets/${file}`
}
const shared = ['logo-white', 'event-department', 'event-festival'].map(asset)
check('Entry JS (gzip)', total(js, true), 150_000)
check('Entry CSS (gzip)', total(css, true), 20_000)
check('Mobile intro art', total([...shared, asset('night-portrait')]), 200_000)
check('Desktop intro art', total([...shared, asset('night-center')]), 200_000)
