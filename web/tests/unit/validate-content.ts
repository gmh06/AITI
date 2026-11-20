import { CODES, DIMS, MODEL_IDS, OPTIONS, POLES } from '../../src/content/types'
import type { Dimension, Personality, Question, Text } from '../../src/content/types'

function cleanText(text: Text) {
  const isPlain = (value: unknown) => typeof value === 'string' && value.length > 0 && !/\*\*|`/.test(value)
  return isPlain(text) || (Array.isArray(text) && text.length > 0 && text.every((segment) =>
    segment && isPlain(segment.text) && [undefined, 'em', 'code'].includes(segment.style),
  ))
}

export function validateContent(
  questions: Question[],
  personalities: Record<string, Personality>,
  dimensions: Dimension[],
) {
  if (dimensions.map(({ id }) => id).join() !== DIMS.join()) throw new Error('Dimension IDs')
  const poles = dimensions.flatMap(({ pos, neg }) => [pos.letter, neg.letter])
  if (new Set(poles).size !== POLES.length || POLES.some((pole) => !poles.includes(pole))) {
    throw new Error('Pole coverage')
  }
  if (questions.length !== 10 || questions.some((question, index) => question.id !== index + 1)) {
    throw new Error('Question order')
  }
  for (const { id, scene, options } of questions) {
    if (!cleanText(scene) || Object.keys(options ?? {}).sort().join() !== OPTIONS.join()) {
      throw new Error(`Question structure Q${id}`)
    }
    for (const [key, option] of Object.entries(options)) {
      if (!cleanText(option.text) || !option.weights || Array.isArray(option.weights) || typeof option.weights !== 'object') {
        throw new Error(`Option structure Q${id}${key}`)
      }
      for (const [pole, weight] of Object.entries(option.weights)) {
        if (!POLES.some((candidate) => candidate === pole) || ![1, 2].includes(weight)) {
          throw new Error(`Invalid weight Q${id}${key}`)
        }
      }
      for (const { pos, neg, primary, secondary } of dimensions) {
        const a = option.weights[pos.letter] ?? 0
        const b = option.weights[neg.letter] ?? 0
        if (a && b) throw new Error(`Conflicting poles Q${id}${key}`)
        const expected = primary.includes(id) ? 2 : secondary.includes(id) ? 1 : 0
        if (a + b !== expected) throw new Error(`Weight table mismatch Q${id}${key}`)
      }
    }
    const patterns = Object.values(options).map(({ weights }) => Object.keys(weights).sort().join())
    if (new Set(patterns).size !== OPTIONS.length) console.warn(`Q${id} does not cover all pole combinations.`)
  }
  const codes = Object.keys(personalities)
  if (codes.length !== CODES.length || CODES.some((code) => !codes.includes(code))) throw new Error('Personality codes')
  for (const [code, personality] of Object.entries(personalities)) {
    if (dimensions.some(({ pos, neg }, i) => code[i] !== pos.letter && code[i] !== neg.letter)) {
      throw new Error(`Personality code order: ${code}`)
    }
    if (typeof personality.persona !== 'string' || !personality.persona.trim() ||
        typeof personality.model !== 'string' || !personality.model.trim() ||
        !MODEL_IDS.includes(personality.modelId) || !cleanText(personality.description)) {
      throw new Error(`Personality structure: ${code}`)
    }
    const { shareDescription } = personality
    if (shareDescription !== undefined &&
        (typeof shareDescription !== 'string' || (shareDescription !== '' && !cleanText(shareDescription)))) {
      throw new Error(`Share description: ${code}`)
    }
  }
  if (MODEL_IDS.some((modelId) => Object.values(personalities).filter((item) => item.modelId === modelId).length !== 2)) {
    throw new Error('Model distribution')
  }
}
