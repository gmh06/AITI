import { dimensions } from '../content/dimensions'
import type { Dim, Dimension, Pole } from '../content/types'
import type { Scores } from './score'

export interface DimensionView {
  dim: Dim
  name: string
  pos: Dimension['pos']
  neg: Dimension['neg']
  side: 'pos' | 'neg'
  letter: Pole
  poleName: string
  ratio: number
}

export function getDimensionViews(scores: Scores): DimensionView[] {
  return dimensions.map(({ id, name, pos, neg }) => {
    const side = scores[id] > 0 ? 'pos' : 'neg'
    const pole = side === 'pos' ? pos : neg
    return {
      dim: id,
      name,
      pos,
      neg,
      side,
      letter: pole.letter,
      poleName: pole.name,
      ratio: Math.abs(scores[id]) / 7,
    }
  })
}
