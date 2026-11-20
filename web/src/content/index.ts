import questionData from './questions.json'
import personalityData from './personalities.json'
import type { Code, Personality, Question } from './types'

export const questions = questionData as Question[]
export const personalities = personalityData as Record<Code, Personality>
