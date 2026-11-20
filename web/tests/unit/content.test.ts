import { describe, expect, it } from 'vitest'
import { personalities, questions } from '../../src/content'
import { dimensions } from '../../src/content/dimensions'
import type { Dimension, Personality, Question } from '../../src/content/types'
import { validateContent } from './validate-content'

type Content = {
  questions: Question[]
  personalities: Record<string, Personality>
  dimensions: Dimension[]
}

describe('published quiz content', () => {
  it('passes all structural and scoring checks', () => {
    expect(() => validateContent(questions, personalities, dimensions)).not.toThrow()
  })

  const invalid: [message: string, mutate: (data: Content) => void][] = [
    ['Question structure', ({ questions }) => { questions[0].scene = '**格式残留**' }],
    ['Question order', ({ questions }) => { questions[1].id = 1 }],
    ['Option structure', ({ questions }) => { questions[0].options.A.text = [{ text: '' }] }],
    ['Invalid weight', ({ questions }) => { Object.assign(questions[0].options.A.weights, { H: 3 }) }],
    ['Invalid weight', ({ questions }) => { Object.assign(questions[0].options.A.weights, { X: 2 }) }],
    ['Conflicting poles', ({ questions }) => { Object.assign(questions[0].options.A.weights, { L: 2 }) }],
    ['Weight table mismatch', ({ questions }) => { questions[0].options.A.weights.H = 1 }],
    ['Pole coverage', ({ dimensions }) => { dimensions[1].pos.letter = 'L' }],
    ['Dimension IDs', ({ dimensions }) => { dimensions[0].id = 'D2' }],
    ['Personality code order', ({ dimensions }) => {
      const [first, second] = dimensions
      dimensions[0] = { ...second, id: first.id }
      dimensions[1] = { ...first, id: second.id }
    }],
    ['Personality codes', ({ personalities }) => { delete personalities.LDRS }],
    ['Personality structure', ({ personalities }) => { Object.assign(personalities.LDRS, { modelId: 'gtp' }) }],
    ['Personality structure', ({ personalities }) => { personalities.LDRS.description = '`未转换的代码`' }],
    ['Model distribution', ({ personalities }) => { personalities.LDRS.modelId = 'claude' }],
  ]

  it.each(invalid)('rejects invalid content (%s)', (message, mutate) => {
    const data = structuredClone({ questions, personalities, dimensions })
    mutate(data)
    expect(() => validateContent(data.questions, data.personalities, data.dimensions)).toThrow(message)
  })
})
