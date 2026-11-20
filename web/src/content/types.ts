export const DIMS = ['D1', 'D2', 'D3', 'D4'] as const
export const POLES = ['L', 'H', 'D', 'Q', 'R', 'U', 'S', 'A'] as const
export const CODES = [
  'LDRS', 'LQRS', 'LDRA', 'LQRA', 'LDUA', 'LQUA', 'LDUS', 'LQUS',
  'HDRA', 'HQRA', 'HDRS', 'HQRS', 'HDUA', 'HDUS', 'HQUA', 'HQUS',
] as const
export const MODEL_IDS = ['gpt', 'deepseek', 'glm', 'grok', 'kimi', 'claude', 'gemini', 'doubao'] as const
export const OPTIONS = ['A', 'B', 'C', 'D'] as const

export type Dim = typeof DIMS[number]
export type Pole = typeof POLES[number]
export type Code = typeof CODES[number]
export type ModelId = typeof MODEL_IDS[number]
export type OptionKey = typeof OPTIONS[number]

export interface Dimension {
  id: Dim
  name: string
  pos: { letter: Pole; name: string }
  neg: { letter: Pole; name: string }
  primary: [number, number]
  secondary: [number, number, number]
}

export type Segment = { text: string; style?: 'em' | 'code' }
export type Text = string | Segment[]

export interface Question {
  id: number
  scene: Text
  options: Record<OptionKey, { text: Text; weights: Partial<Record<Pole, 1 | 2>> }>
}

export interface Personality {
  persona: string
  model: string
  modelId: ModelId
  description: Text
}
