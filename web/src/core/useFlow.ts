import { useEffect, useRef, useState } from 'react'
import { initialFlow, reduceFlow } from './flow'
import type { Flow, FlowEvent } from './flow'

function isSessionEntry() {
  return history.state?.aitiSession === true
}

function pushSessionEntry() {
  history.pushState({ ...history.state, aitiSession: true }, '')
}

export function useFlow() {
  const [flow, setFlow] = useState<Flow>(initialFlow)
  const current = useRef(flow)
  const sessionEntry = useRef(isSessionEntry())
  const goingHome = useRef(false)

  function commit(next: Flow) {
    if (next === current.current) return
    current.current = next
    setFlow(next)
  }

  useEffect(() => {
    const originalRestoration = history.scrollRestoration
    history.scrollRestoration = 'manual'

    function onPopState() {
      const wasSessionEntry = sessionEntry.current
      sessionEntry.current = isSessionEntry()
      if (sessionEntry.current) return
      if (current.current.screen === 'intro') {
        // The active entry can survive a reload even though the answers cannot.
        if (wasSessionEntry) history.back()
        return
      }

      goingHome.current = false
      const next = reduceFlow(current.current, { type: 'BACK' })
      if (next.screen !== 'intro') {
        pushSessionEntry()
        sessionEntry.current = true
      }
      commit(next)
    }

    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
      history.scrollRestoration = originalRestoration
    }
  }, [])

  function send(event: FlowEvent) {
    if (goingHome.current) return
    const previous = current.current
    const next = reduceFlow(previous, event)
    if (next === previous) return
    if (previous.screen === 'intro' && !sessionEntry.current) {
      pushSessionEntry()
      sessionEntry.current = true
    }
    if (next.screen === 'intro' && sessionEntry.current) {
      goingHome.current = true
      history.back()
      return
    }
    commit(next)
  }

  return { flow, send }
}
