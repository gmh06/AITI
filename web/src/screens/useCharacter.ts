import { useEffect, useState } from 'react'
import type { ModelId } from '../content/types'
import { characterUrl } from '../core/artwork'

const IMAGE_TIMEOUT_MS = 8000
const loading = { status: 'loading' } as const
type Artwork = typeof loading | { status: 'failed' } | { status: 'ready'; image: HTMLImageElement }

export function useCharacter(model: ModelId) {
  const [artwork, setArtwork] = useState<Artwork>(loading)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const url = characterUrl(model)
    if (!url) {
      setArtwork({ status: 'failed' })
      return
    }
    const image = new Image()
    let active = true

    function settle(result: Artwork) {
      if (!active) return
      active = false
      window.clearTimeout(timeout)
      if (result.status === 'failed') image.removeAttribute('src')
      setArtwork(result)
    }

    const fail = () => settle({ status: 'failed' })
    const timeout = window.setTimeout(fail, IMAGE_TIMEOUT_MS)
    image.src = url
    image.decode().then(() => settle({ status: 'ready', image }), fail)
    return () => {
      window.clearTimeout(timeout)
      if (active) image.removeAttribute('src')
      active = false
    }
  }, [model, attempt])

  function retry() {
    setArtwork(loading)
    setAttempt((value) => value + 1)
  }

  return { artwork, retry }
}
