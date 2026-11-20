import { dimensions } from '../content/dimensions'
import { questions } from '../content'
import type { Code, Dim, OptionKey } from '../content/types'

export type Scores = Record<Dim, number>
export interface Result {
  code: Code
  scores: Scores
}

const signedWeights = questions.map(({ options }) => Object.fromEntries(
  Object.entries(options).map(([key, { weights }]) => [
    key,
    dimensions.map(({ pos, neg }) => (weights[pos.letter] ?? 0) - (weights[neg.letter] ?? 0)),
  ]),
) as Record<OptionKey, number[]>)

export function score(answers: readonly OptionKey[]): Result {
  if (answers.length !== questions.length) {
    throw new Error('Scoring requires one answer per question.')
  }
  const scores: Scores = { D1: 0, D2: 0, D3: 0, D4: 0 }
  for (const [index, { id }] of dimensions.entries()) {
    for (let question = 0; question < answers.length; question += 1) {
      scores[id] += signedWeights[question][answers[question]][index]
    }
  }
  const code = dimensions.map(({ id, pos, neg }) => (scores[id] > 0 ? pos : neg).letter).join('') as Code
  return { code, scores }
}
