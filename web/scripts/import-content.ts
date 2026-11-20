// Archived after the initial import. Edit the production JSON directly.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { CODES, OPTIONS, POLES } from '../src/content/types.ts'
import type { Code, ModelId, Personality, Question, Segment, Text } from '../src/content/types.ts'

const outputs = ['questions.json', 'personalities.json'].map(
  (file) => new URL(`../src/content/${file}`, import.meta.url),
)
if (!process.argv.includes('--force') && outputs.some(existsSync)) {
  throw new Error('Content already exists. Use --force only to repeat the initial import.')
}

const modelIds: Record<string, ModelId> = {
  GPT: 'gpt',
  DeepSeek: 'deepseek',
  GLM: 'glm',
  Grok: 'grok',
  Kimi: 'kimi',
  Claude: 'claude',
  Gemini: 'gemini',
  豆包: 'doubao',
}

function parseText(value: string): Text {
  const segments: Segment[] = []
  let start = 0
  for (const match of value.matchAll(/\*\*([^*]+)\*\*|`([^`]+)`/g)) {
    if (match.index > start) segments.push({ text: value.slice(start, match.index) })
    segments.push({ text: match[1] ?? match[2], style: match[1] ? 'em' : 'code' })
    start = match.index + match[0].length
  }
  if (!segments.length) return value
  if (start < value.length) segments.push({ text: value.slice(start) })
  return segments
}

function readDoc(file: string) {
  return readFileSync(new URL(`../../docs/${file}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n')
}

const questionSections = [...readDoc('tests_design.md').matchAll(/^### Q(\d+)\. 【[^\n]+】\n([\s\S]*?)(?=^### Q|$(?![\s\S]))/gm)]
if (questionSections.length !== 10) throw new Error('Expected 10 question sections.')

const questionData = questionSections.map(([, id, section], index): Question => {
  const scene = section.match(/^\*\*场景\*\*：(.+)$/m)?.[1]
  const entries = [...section.matchAll(/^- \*\*([ABCD])\.\*\* (.+?)\s*`\[([^\]]+)\]`\s*$/gm)]
  if (Number(id) !== index + 1 || !scene || entries.length !== OPTIONS.length) {
    throw new Error(`Invalid question section Q${id}.`)
  }
  const options = Object.fromEntries(OPTIONS.map((key, position) => {
    const [, actualKey, text, rawWeights] = entries[position]
    if (actualKey !== key) throw new Error(`Invalid option order in Q${id}.`)
    const pairs = rawWeights.split(/,\s*/).map((item) => {
      const match = item.match(/^([A-Z]) \+([12])$/)
      if (!match || !POLES.some((pole) => pole === match[1])) {
        throw new Error(`Invalid weight in Q${id}${key}: ${item}`)
      }
      return [match[1], Number(match[2])]
    })
    if (new Set(pairs.map(([pole]) => pole)).size !== pairs.length) {
      throw new Error(`Duplicate pole in Q${id}${key}.`)
    }
    return [key, { text: parseText(text), weights: Object.fromEntries(pairs) }]
  })) as Question['options']
  return { id: Number(id), scene: parseText(scene), options }
})

const entries = [...readDoc('result_page.md').matchAll(
  /^\*\*(\d+)\. `([A-Z]{4})` (.+?)（对应模型：(.+?)）\*\*\n([\s\S]+?)(?=^\*\*\d+\.|$(?![\s\S]))/gm,
)]
const personalityData = Object.fromEntries(entries.map(([, n, code, persona, model, description], index) => {
  if (Number(n) !== index + 1 || !CODES.includes(code as Code) || !Object.hasOwn(modelIds, model)) {
    throw new Error(`Unknown personality at entry ${n}: ${code}, ${model}.`)
  }
  return [code, { persona, model, modelId: modelIds[model], description: parseText(description.trim()) } satisfies Personality]
}))
if (entries.length !== CODES.length || Object.keys(personalityData).length !== CODES.length) {
  throw new Error('Expected one entry for each of the 16 personality codes.')
}

for (const [index, data] of [questionData, personalityData].entries()) {
  writeFileSync(outputs[index], JSON.stringify(data, null, 2) + '\n')
}
