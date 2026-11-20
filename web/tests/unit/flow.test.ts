import { describe, expect, it } from 'vitest'
import { initialFlow, reduceFlow } from '../../src/core/flow'
import type { Flow } from '../../src/core/flow'

describe('quiz flow', () => {
  const first: Flow = { screen: 'quiz', index: 0, answers: [] }

  it('starts fresh and returns home from Q1', () => {
    expect(reduceFlow(initialFlow, { type: 'START' })).toEqual(first)
    expect(reduceFlow(first, { type: 'BACK' })).toEqual(initialFlow)
  })

  it('keeps previous selections when going back and rejects stale clicks', () => {
    const second = reduceFlow(first, { type: 'ANSWER', index: 0, key: 'C' })
    expect(second).toEqual({ screen: 'quiz', index: 1, answers: ['C'] })
    expect(reduceFlow(second, { type: 'ANSWER', index: 0, key: 'D' })).toBe(second)
    expect(reduceFlow(second, { type: 'BACK' })).toEqual({ screen: 'quiz', index: 0, answers: ['C'] })
  })

  it('calculates the result on Q10, reveals it once, and clears it on restart', () => {
    const last: Flow = { screen: 'quiz', index: 9, answers: Array.from({ length: 9 }, () => 'A') }
    const reveal = reduceFlow(last, { type: 'ANSWER', index: 9, key: 'A' })
    expect(reveal).toEqual({ screen: 'reveal', result: { code: 'HQUA', scores: { D1: -1, D2: -5, D3: -1, D4: -5 } } })
    const result = reduceFlow(reveal, { type: 'REVEAL_DONE' })
    expect(result.screen).toBe('result')
    expect(reduceFlow(reveal, { type: 'BACK' })).toEqual(result)
    expect(reduceFlow(result, { type: 'REVEAL_DONE' })).toBe(result)
    expect(reduceFlow(result, { type: 'RESTART' })).toEqual(initialFlow)
    expect(reduceFlow(result, { type: 'BACK' })).toEqual(initialFlow)
  })
})
