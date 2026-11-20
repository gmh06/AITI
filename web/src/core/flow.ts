import { questions } from '../content'
import type { OptionKey } from '../content/types'
import { score } from './score'
import type { Result } from './score'

export type Flow =
  | { screen: 'intro' }
  | { screen: 'quiz'; index: number; answers: OptionKey[] }
  | { screen: 'reveal' | 'result'; result: Result }

export type FlowEvent =
  | { type: 'START' | 'BACK' | 'REVEAL_DONE' | 'RESTART' }
  | { type: 'ANSWER'; index: number; key: OptionKey }

export const initialFlow: Flow = { screen: 'intro' }

export function reduceFlow(state: Flow, event: FlowEvent): Flow {
  switch (state.screen) {
    case 'intro':
      return event.type === 'START' ? { screen: 'quiz', index: 0, answers: [] } : state
    case 'quiz': {
      if (event.type === 'BACK') {
        return state.index > 0 ? { ...state, index: state.index - 1 } : initialFlow
      }
      if (event.type !== 'ANSWER' || event.index !== state.index) return state
      const answers = state.answers.slice()
      answers[state.index] = event.key
      const nextIndex = state.index + 1
      return nextIndex < questions.length
        ? { screen: 'quiz', index: nextIndex, answers }
        : { screen: 'reveal', result: score(answers) }
    }
    case 'reveal':
      return event.type === 'REVEAL_DONE'
        ? { screen: 'result', result: state.result }
        : state
    case 'result':
      return event.type === 'BACK' || event.type === 'RESTART' ? initialFlow : state
  }
}
