import { useLayoutEffect, useState } from 'react'
import { REDUCED_MOTION_QUERY } from '../core/env'

export function Scene({ intro }: { intro: boolean }) {
  const [transitioning, setTransitioning] = useState(false)

  useLayoutEffect(() => {
    if (intro || matchMedia(REDUCED_MOTION_QUERY).matches) return
    setTransitioning(true)
    const timer = window.setTimeout(() => setTransitioning(false), 1100)
    return () => {
      window.clearTimeout(timer)
      setTransitioning(false)
    }
  }, [intro])

  return (
    <div className={`scene${transitioning && !intro ? ' scene-dive' : ''}`} aria-hidden="true">
      {(intro || transitioning) && <div className="scene-night" />}
      {!intro && <div className="scene-mist" />}
      {transitioning && !intro && <div className="scene-flash" />}
    </div>
  )
}
