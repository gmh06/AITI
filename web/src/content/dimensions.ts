import type { Dimension } from './types.ts'

export const dimensions: Dimension[] = [
  {
    id: 'D1', name: '认知内核',
    pos: { letter: 'L', name: '逻辑工程' }, neg: { letter: 'H', name: '人文表达' },
    primary: [1, 2], secondary: [5, 6, 9],
  },
  {
    id: 'D2', name: '思考倾向',
    pos: { letter: 'D', name: '深度思考' }, neg: { letter: 'Q', name: '即时直觉' },
    primary: [3, 4], secondary: [1, 7, 10],
  },
  {
    id: 'D3', name: '对齐模式',
    pos: { letter: 'R', name: '准则自持' }, neg: { letter: 'U', name: '破界无忌' },
    primary: [5, 6], secondary: [4, 8, 9],
  },
  {
    id: 'D4', name: '交互姿态',
    pos: { letter: 'S', name: '犀利自主' }, neg: { letter: 'A', name: '顺应配合' },
    primary: [7, 8], secondary: [2, 3, 10],
  },
]
