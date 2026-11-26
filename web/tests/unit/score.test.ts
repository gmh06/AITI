import { expect, it } from 'vitest'
import { CODES, DIMS, OPTIONS } from '../../src/content/types'
import type { Code, OptionKey } from '../../src/content/types'
import { getDimensionViews } from '../../src/core/dimensions'
import { score } from '../../src/core/score'

it.each([
  ['AAAAAAAAAA', 'HQUA', { D1: -1, D2: -3, D3: -1, D4: -5 }],
  ['BBBBBBBBBB', 'LDRS', { D1: 1, D2: 3, D3: 1, D4: 1 }],
  ['ABCDABCDAB', 'HDRA', { D1: -3, D2: 5, D3: 3, D4: -1 }],
])('scores %s as %s', (answers, code, scores) => {
  expect(score([...answers] as OptionKey[])).toEqual({ code, scores })
})

it('reaches every personality with odd, nonzero scores across all 4¹⁰ answers', () => {
  const answers: OptionKey[] = Array.from({ length: 10 }, () => 'A')
  const counts = new Map<Code, number>()
  const count = OPTIONS.length ** answers.length
  for (let n = 0; n < count; n += 1) {
    let digits = n
    for (let i = 0; i < answers.length; i += 1) {
      answers[i] = OPTIONS[digits % OPTIONS.length]
      digits = Math.floor(digits / OPTIONS.length)
    }
    const { code, scores } = score(answers)
    for (const dim of DIMS) {
      const value = Math.abs(scores[dim])
      if (value > 7 || value % 2 !== 1) throw new Error(`${answers.join('')}: ${dim} = ${scores[dim]}`)
    }
    counts.set(code, (counts.get(code) ?? 0) + 1)
  }
  expect([...counts.keys()].sort()).toEqual([...CODES].sort())
  console.info('Personality distribution (%)', Object.fromEntries(CODES.map((code) => [code, 100 * counts.get(code)! / count])))
}, 25_000)

it.each([1, 3, 5, 7, -1, -3, -5, -7])('maps signed score %d into its pole and bar length', (n) => {
  const views = getDimensionViews({ D1: n, D2: n, D3: -n, D4: -n })
  expect(views.map((item) => [item.side, item.letter, item.poleName, item.ratio])).toEqual(
    (n > 0
      ? [['pos', 'L', '逻辑工程'], ['pos', 'D', '深度思考'], ['neg', 'U', '破界无忌'], ['neg', 'A', '顺应配合']]
      : [['neg', 'H', '人文表达'], ['neg', 'Q', '即时直觉'], ['pos', 'R', '准则自持'], ['pos', 'S', '犀利自主']]
    ).map((item) => [...item, Math.abs(n) / 7]),
  )
})
