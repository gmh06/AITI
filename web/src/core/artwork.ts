import type { ModelId } from '../content/types'

const artwork = import.meta.glob<string>('../generated/img/*.webp', {
  eager: true,
  import: 'default',
  query: '?url',
})

export function characterUrl(model: ModelId) {
  return artwork[`../generated/img/${model}.webp`]
}
